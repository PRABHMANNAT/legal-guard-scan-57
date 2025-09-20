export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractedField {
  value: string;
  status: 'present' | 'missing' | 'low_confidence' | 'invalid_format';
  confidence: number;
  bbox?: BoundingBox | null;
}

export interface ManufacturerField extends ExtractedField {
  role?: 'manufacturer' | 'packer' | 'importer';
}

export interface NetQuantityField extends ExtractedField {
  parsed?: {
    amount: number;
    unit: string;
  };
}

export interface MRPField extends ExtractedField {
  parsed?: {
    currency: string;
    amount: number;
    inclusive: boolean;
  };
}

export interface ConsumerCareField extends ExtractedField {
  parsed?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface DateField extends ExtractedField {
  parsed?: {
    date: string; // ISO format YYYY-MM-DD
  };
}

export interface CountryField extends ExtractedField {
  parsed?: {
    country: string;
    iso?: string;
  };
}

export interface ComplianceFields {
  manufacturer: ManufacturerField;
  net_quantity: NetQuantityField;
  mrp_inclusive: MRPField;
  consumer_care: ConsumerCareField;
  dom_or_doi: DateField;
  country_of_origin: CountryField;
}

export interface ComplianceViolation {
  field: keyof ComplianceFields;
  rule: string;
  severity: 'minor' | 'major' | 'critical';
}

export interface ScanResult {
  fields: ComplianceFields;
  violations: ComplianceViolation[];
  confidence_avg: number;
  summary_status: 'compliant' | 'violation' | 'incomplete';
}

export interface ScanRequest {
  image?: string; // base64
  imageUrl?: string;
}

export interface RecentScan {
  id: string;
  productName: string;
  status: 'compliant' | 'violation' | 'incomplete';
  timestamp: Date;
  thumbnail?: string;
  confidence: number;
}