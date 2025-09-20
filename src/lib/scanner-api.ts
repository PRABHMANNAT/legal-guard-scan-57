import { ScanResult, ScanRequest } from '@/types/scanner';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const SYSTEM_PROMPT = `You are a compliance OCR/IE agent for India's Legal Metrology (Packaged Commodities) Rules, 2011. Extract the six mandatory declarations from product packaging images or listing screenshots.

Extract these 6 mandatory fields:
1. Name & Address of Manufacturer/Packer/Importer
2. Net Quantity (in standard units)
3. Maximum Retail Price (MRP, inclusive of all taxes)
4. Consumer Care Details (email/phone/address)
5. Date of Manufacture/Import/Packing
6. Country of Origin

For each field, provide:
- value: exact text extracted
- status: "present" | "missing" | "low_confidence" | "invalid_format"
- confidence: 0-1 score
- bbox: [x, y, width, height] if detectable, null otherwise

Apply validation rules:
- MRP must include "inclusive of all taxes" or similar
- Net quantity needs number + valid unit (g, kg, ml, L, pcs, etc.)
- Date should be parseable to YYYY-MM-DD format
- Consumer care needs at least email OR phone
- Mark low_confidence if confidence < 0.6

Return strictly valid JSON matching this schema. If a field is absent, set status='missing' and confidence=0.`;

async function fetchImageFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AssureX-Scanner/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      throw new Error('URL does not point to a valid image');
    }
    
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    throw new Error(`Failed to fetch image from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function scanProduct(request: ScanRequest): Promise<ScanResult> {
  if (!OPENAI_API_KEY) {
    // Return mock data for demo purposes when API key is not available
    return getMockScanResult();
  }

  try {
    const { image, imageUrl } = request;
    
    if (!image && !imageUrl) {
      throw new Error('Either image (base64) or imageUrl must be provided');
    }

    let imageData: string;
    
    if (imageUrl) {
      imageData = await fetchImageFromUrl(imageUrl);
    } else {
      imageData = image!;
    }

    // Validate base64 format
    if (!imageData.startsWith('data:image/')) {
      throw new Error('Invalid image format');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract Legal Metrology compliance declarations from this product image. Return strictly valid JSON matching the required schema.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to analyze image');
    }

    const result = await response.json();
    const scanResult: ScanResult = JSON.parse(result.choices[0].message.content);

    // Validate the response structure
    if (!scanResult.fields || !scanResult.violations || scanResult.confidence_avg === undefined) {
      throw new Error('Invalid response format from AI model');
    }

    return scanResult;
  } catch (error) {
    console.error('Scan Error:', error);
    throw new Error(`Failed to process scan request: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Mock product data based on real LMPC compliance examples
const mockProducts = {
  cetaphil: {
    fields: {
      manufacturer: {
        value: "",
        status: "missing" as const,
        confidence: 0.0,
        role: "manufacturer" as const
      },
      net_quantity: {
        value: "250 mL",
        status: "present" as const,
        confidence: 0.95,
        parsed: {
          amount: 250,
          unit: "mL"
        }
      },
      mrp_inclusive: {
        value: "₹769.00 (incl. of all taxes)",
        status: "present" as const,
        confidence: 0.90,
        parsed: {
          currency: "INR",
          amount: 769.00,
          inclusive: true
        }
      },
      consumer_care: {
        value: "",
        status: "missing" as const,
        confidence: 0.0
      },
      dom_or_doi: {
        value: "",
        status: "missing" as const,
        confidence: 0.0
      },
      country_of_origin: {
        value: "",
        status: "missing" as const,
        confidence: 0.0
      }
    },
    violations: [
      {
        field: "manufacturer" as const,
        rule: "Name & address of manufacturer/packer/importer not visible - back label scan needed",
        severity: "major" as const
      },
      {
        field: "consumer_care" as const,
        rule: "Consumer care details missing - requires back label or A+ content",
        severity: "major" as const
      },
      {
        field: "dom_or_doi" as const,
        rule: "Date of manufacture/import not visible",
        severity: "major" as const
      },
      {
        field: "country_of_origin" as const,
        rule: "Country of origin missing",
        severity: "major" as const
      }
    ],
    confidence_avg: 0.46,
    summary_status: "violation" as const
  },
  fireBoltt: {
    fields: {
      manufacturer: {
        value: "",
        status: "missing" as const,
        confidence: 0.0,
        role: "manufacturer" as const
      },
      net_quantity: {
        value: "1 Unit",
        status: "present" as const,
        confidence: 0.50,
        parsed: {
          amount: 1,
          unit: "Unit"
        }
      },
      mrp_inclusive: {
        value: "₹11,999.00 (incl. of all taxes)",
        status: "present" as const,
        confidence: 0.90,
        parsed: {
          currency: "INR",
          amount: 11999.00,
          inclusive: true
        }
      },
      consumer_care: {
        value: "",
        status: "missing" as const,
        confidence: 0.0
      },
      dom_or_doi: {
        value: "",
        status: "missing" as const,
        confidence: 0.0
      },
      country_of_origin: {
        value: "",
        status: "missing" as const,
        confidence: 0.0
      }
    },
    violations: [
      {
        field: "manufacturer" as const,
        rule: "Importer details not visible in product hero image - box packaging required",
        severity: "major" as const
      },
      {
        field: "consumer_care" as const,
        rule: "Consumer care details missing",
        severity: "major" as const
      },
      {
        field: "dom_or_doi" as const,
        rule: "Date of manufacture/import not visible",
        severity: "major" as const
      },
      {
        field: "country_of_origin" as const,
        rule: "Country of origin missing - typically printed on electronics box",
        severity: "major" as const
      }
    ],
    confidence_avg: 0.35,
    summary_status: "violation" as const
  },
  matata: {
    fields: {
      manufacturer: {
        value: "Flyball Electronic (Shenzhen) Co. Ltd., Zhiji Industrial Zone, Jinye Road, Kuiyong Street, Longgang District, Shenzhen, China",
        status: "present" as const,
        confidence: 0.95,
        role: "manufacturer" as const
      },
      net_quantity: {
        value: "1 N",
        status: "present" as const,
        confidence: 0.90,
        parsed: {
          amount: 1,
          unit: "N"
        }
      },
      mrp_inclusive: {
        value: "₹4,499.00 (Inclusive of all taxes)",
        status: "present" as const,
        confidence: 0.95,
        parsed: {
          currency: "INR",
          amount: 4499.00,
          inclusive: true
        }
      },
      consumer_care: {
        value: "1800-889-1055, reliancedigital@ril.com",
        status: "present" as const,
        confidence: 0.88,
        parsed: {
          email: "reliancedigital@ril.com",
          phone: "18008891055"
        }
      },
      dom_or_doi: {
        value: "June 2020",
        status: "present" as const,
        confidence: 0.82,
        parsed: {
          date: "2020-06-01"
        }
      },
      country_of_origin: {
        value: "China",
        status: "present" as const,
        confidence: 0.92,
        parsed: {
          country: "China",
          iso: "CN"
        }
      }
    },
    violations: [],
    confidence_avg: 0.90,
    summary_status: "compliant" as const
  }
};

function getMockScanResult(): ScanResult {
  // Cycle between different mock products for demo
  const products = Object.values(mockProducts);
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  return randomProduct;
}

// Export function to get specific product mock data
export function getMockProductData(productType: 'cetaphil' | 'fireBoltt' | 'matata'): ScanResult {
  return mockProducts[productType];
}