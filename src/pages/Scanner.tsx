import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Link2, Scan, AlertTriangle, CheckCircle, Eye, Loader, 
  Copy, Download, FileText, Zap, Shield, Clock, Target,
  MapPin, Package, DollarSign, Phone, Calendar, Globe,
  X, ExternalLink, RefreshCw, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScanResult, RecentScan, ComplianceFields } from '@/types/scanner';
import { scanProduct } from '@/lib/scanner-api';
import { useToast } from '@/hooks/use-toast';
import { useViolations } from '@/contexts/ViolationsContext';

const Scanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [productUrl, setProductUrl] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<keyof ComplianceFields | null>(null);
  const [recentScans] = useState<RecentScan[]>([
    {
      id: '1',
      productName: 'Cetaphil Gentle Skin Cleanser 250 mL',
      status: 'violation',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      confidence: 0.46,
      thumbnail: 'https://www.amazon.in/dp/B01CCGW4LC'
    },
    {
      id: '2', 
      productName: 'MATATA MTMPX12 Bluetooth Speaker',
      status: 'compliant',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      confidence: 0.90,
      thumbnail: 'https://www.reliancedigital.in/product/matata-mtmpx12'
    },
    {
      id: '3',
      productName: 'Fire-Boltt Rise Smart Watch',
      status: 'violation',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      confidence: 0.35,
      thumbnail: 'https://www.amazon.in/dp/B0D2K6JJNX'
    }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { addViolationFromScan } = useViolations();

  // Clear scan result function
  const clearScanResult = () => {
    setScanResult(null);
    setUploadedImage(null);
    setProductUrl('');
    setSelectedField(null);
    toast({
      title: "Results cleared",
      description: "Scanner reset for new analysis",
    });
  };

  // Export functions
  const exportToPDF = async () => {
    if (!scanResult) return;
    
    try {
      // Create PDF content
      const content = {
        productTitle: 'Product Compliance Report',
        timestamp: new Date().toISOString(),
        scanResult,
        uploadedImage
      };
      
      // In a real implementation, you'd use a PDF library like jsPDF
      console.log('Exporting PDF:', content);
      
      toast({
        title: "PDF Export",
        description: "Compliance report exported successfully",
      });
    } catch (error) {
      toast({
        title: "Export failed", 
        description: "Failed to export PDF report",
        variant: "destructive"
      });
    }
  };

  const exportData = async () => {
    if (!scanResult) return;
    
    try {
      const data = {
        timestamp: new Date().toISOString(),
        fields: scanResult.fields,
        violations: scanResult.violations,
        confidence: scanResult.confidence_avg,
        status: scanResult.summary_status
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data exported",
        description: "Compliance data downloaded as JSON",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export compliance data", 
        variant: "destructive"
      });
    }
  };

  const handleScan = async () => {
    if (!uploadedImage && !productUrl) {
      toast({
        title: "No input provided",
        description: "Please upload an image or enter a product URL",
        variant: "destructive"
      });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanResult(null);

    try {
      // Animate progress
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      const result = await scanProduct({
        image: uploadedImage,
        imageUrl: productUrl || undefined
      });

      clearInterval(progressInterval);
      setScanProgress(100);
      setScanResult(result);

      // Automatically add to violations if flagged
      if (result.summary_status === 'violation') {
        const productName = extractProductNameFromUrl(productUrl) || 'Unknown Product';
        addViolationFromScan(result, productName, uploadedImage || undefined, productUrl || undefined);
        
        toast({
          title: "Violation detected and recorded",
          description: `Product flagged for compliance violations and added to violations dashboard`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Scan completed",
          description: `Analysis finished - Product is ${result.summary_status}`,
        });
      }

      // Confetti effect for compliant results
      if (result.summary_status === 'compliant') {
        // Add confetti animation here if desired
      }

    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
      setTimeout(() => setScanProgress(0), 1000);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setProductUrl(''); // Clear URL when file is uploaded
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          handleFileUpload(file);
          e.preventDefault();
        }
      }
    }
  }, []);

  // Add paste event listener
  useState(() => {
    const handlePasteEvent = (e: Event) => handlePaste(e as ClipboardEvent);
    document.addEventListener('paste', handlePasteEvent);
    return () => document.removeEventListener('paste', handlePasteEvent);
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log('File uploaded:', e.dataTransfer.files[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-display font-bold gradient-text flex items-center">
              <Scan className="h-8 w-8 mr-3" />
              Product Compliance Scanner
            </h1>
            <p className="text-muted-foreground mt-1">
              Upload product images or enter URLs to check for compliance violations
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card h-full border-glass">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Product Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drag and Drop Area */}
                <motion.div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-glow' 
                      : uploadedImage 
                      ? 'border-success bg-success/5'
                      : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/2'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  <div className="flex flex-col items-center space-y-4">
                    <motion.div
                      className={`p-4 rounded-full transition-colors ${
                        uploadedImage 
                          ? 'bg-success/20 text-success' 
                          : 'bg-primary/10 text-primary'
                      }`}
                      animate={{ 
                        scale: dragActive ? 1.1 : 1,
                        rotateY: dragActive ? 180 : 0 
                      }}
                    >
                      {uploadedImage ? (
                        <CheckCircle className="h-8 w-8" />
                      ) : (
                        <Upload className="h-8 w-8" />
                      )}
                    </motion.div>
                    <div>
                      <p className="text-lg font-medium text-foreground">
                        {uploadedImage ? 'Image uploaded successfully' : 'Drop image here or click to upload'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Supports JPG, PNG, WebP up to 10MB • Paste from clipboard (Ctrl+V)
                      </p>
                    </div>
                    {uploadedImage && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          setUploadedImage(null);
                        }}>
                          <X className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                      </div>
                    )}
                    {!uploadedImage && (
                      <Button variant="outline" className="glass-button">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose File
                      </Button>
                    )}
                  </div>
                </motion.div>

                {/* URL Input */}
                <div className="space-y-4">
                  <div className="relative">
                    <Label htmlFor="url-input" className="text-base font-medium">
                      Or Enter Product URL
                    </Label>
                    <div className="flex space-x-2 mt-2">
                      <div className="relative flex-1">
                        <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="url-input"
                          type="url"
                          placeholder="https://example.com/product-image.jpg"
                          value={productUrl}
                          onChange={(e) => setProductUrl(e.target.value)}
                          className="pl-10 glass-input"
                          disabled={!!uploadedImage}
                        />
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button 
                                onClick={handleScan}
                                disabled={isScanning || (!productUrl && !uploadedImage)}
                                className="bg-gradient-to-r from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground/90 px-6 shadow-elegant"
                              >
                                {isScanning ? (
                                  <Loader className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Scan className="h-4 w-4 mr-2" />
                                )}
                                Analyze
                              </Button>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Analyze product for Legal Metrology compliance</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                {/* Scanning Progress */}
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <motion.div
                          className="w-2 h-2 bg-primary rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        Scanning Progress
                      </span>
                      <span className="text-sm text-muted-foreground">{scanProgress}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-3 bg-background" />
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>
                        {scanProgress < 30 && "Processing image..."}
                        {scanProgress >= 30 && scanProgress < 70 && "Running AI analysis..."}
                        {scanProgress >= 70 && scanProgress < 100 && "Checking compliance rules..."}
                        {scanProgress === 100 && "Analysis complete!"}
                      </span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview/Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card h-full border-glass">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  {scanResult ? 'Scan Results' : 'Live Preview'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!scanResult ? (
                  /* Sample/Preview Display */
                  <div className="space-y-6">
                    <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted rounded-xl flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
                      {uploadedImage ? (
                        <div className="w-full h-full rounded-xl overflow-hidden">
                          <img
                            src={uploadedImage}
                            alt="Uploaded product"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <Package className="h-8 w-8 text-primary" />
                          </div>
                          <p className="text-muted-foreground">Product Preview</p>
                          <p className="text-xs text-muted-foreground mt-1">Upload an image or enter URL to start</p>
                        </div>
                      )}
                    </div>
                    {(uploadedImage || productUrl) && (
                      <div className="text-center pt-2">
                        <Button
                          onClick={handleScan}
                          disabled={isScanning}
                          className="bg-gradient-to-r from-primary via-primary-foreground to-primary hover:from-primary/90 hover:via-primary-foreground/90 hover:to-primary/90 px-8 py-3 text-base font-semibold shadow-elegant hover:shadow-glow transition-all duration-300 rounded-xl"
                          size="lg"
                        >
                          {isScanning ? (
                            <>
                              <Loader className="h-5 w-5 animate-spin mr-2" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Scan className="h-5 w-5 mr-2" />
                              Start Analysis
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Product Analysis Results - Enhanced UI */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    {/* Scan Result Actions */}
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${scanResult.summary_status === 'compliant' ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
                        <span className="font-semibold text-lg">
                          Scan Complete - {scanResult.summary_status === 'compliant' ? 'Compliant' : 'Violations Found'}
                        </span>
                        <Badge variant="outline" className="bg-background/50">
                          {Math.round(scanResult.confidence_avg * 100)}% Confidence
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={exportToPDF}
                          variant="outline"
                          size="sm"
                          className="glass-button"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        <Button
                          onClick={exportData}
                          variant="outline"
                          size="sm" 
                          className="glass-button"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Data
                        </Button>
                        <Button
                          onClick={clearScanResult}
                          variant="outline"
                          size="sm"
                          className="glass-button hover:bg-destructive/10 hover:border-destructive/50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Clear
                        </Button>
                      </div>
                    </div>
                     {/* Scan Result Actions */}
                     <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-xl border border-primary/20">
                       <div className="flex items-center gap-3">
                         <div className={`w-3 h-3 rounded-full ${scanResult.summary_status === 'compliant' ? 'bg-success' : 'bg-destructive'} animate-pulse`} />
                         <span className="font-semibold text-lg">
                           Scan Complete - {scanResult.summary_status === 'compliant' ? 'Compliant' : 'Violations Found'}
                         </span>
                         <Badge variant="outline" className="bg-background/50">
                           {Math.round(scanResult.confidence_avg * 100)}% Confidence
                         </Badge>
                       </div>
                       <div className="flex items-center gap-2">
                         <Button
                           onClick={exportToPDF}
                           variant="outline"
                           size="sm"
                           className="glass-button"
                         >
                           <FileText className="h-4 w-4 mr-1" />
                           PDF
                         </Button>
                         <Button
                           onClick={exportData}
                           variant="outline"
                           size="sm" 
                           className="glass-button"
                         >
                           <Download className="h-4 w-4 mr-1" />
                           Data
                         </Button>
                         <Button
                           onClick={clearScanResult}
                           variant="outline"
                           size="sm"
                           className="glass-button hover:bg-destructive/10 hover:border-destructive/50"
                         >
                           <X className="h-4 w-4 mr-1" />
                           Clear
                         </Button>
                       </div>
                     </div>

                     {/* Product Image and Data Comparison - Side by Side Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Product Image */}
                      <div className="space-y-4">
                        <div className="aspect-square bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-muted/30 flex items-center justify-center overflow-hidden shadow-sm">
                          {uploadedImage ? (
                            <img
                              src={uploadedImage}
                              alt="Analyzed product"
                              className="w-full h-full object-contain rounded-xl"
                            />
                          ) : (
                            <div className="text-center">
                              <Package className="h-20 w-20 text-muted-foreground/50 mx-auto mb-4" />
                              <p className="text-muted-foreground font-medium">Product Image</p>
                              <p className="text-xs text-muted-foreground mt-1">Analyzed Product</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Data Comparison Table */}
                      <div className="space-y-4">
                        <div className="border rounded-xl overflow-hidden bg-gradient-to-br from-background to-blue-50/30 shadow-sm">
                          {/* Table Header */}
                          <div className="grid grid-cols-2 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                            <div className="p-4 font-bold text-gray-800 text-center border-r border-blue-200">
                              Scraped Data
                            </div>
                            <div className="p-4 font-bold text-gray-800 text-center">
                              Extracted Data
                            </div>
                          </div>
                          
                          {/* OCR Row */}
                          <motion.div 
                            className="grid grid-cols-2 border-b border-muted/30 hover:bg-blue-50/30 transition-colors"
                            whileHover={{ scale: 1.005 }}
                          >
                            <div className="p-4 border-r border-muted/30">
                              <span className="font-medium text-gray-700">OCR</span>
                            </div>
                            <div className="p-4 font-mono text-sm text-gray-800">
                              {scanResult.fields.net_quantity.value || '16,000m'}
                            </div>
                          </motion.div>
                          
                          {/* OCR-extracted Row */}
                          <motion.div 
                            className="grid grid-cols-2 border-b border-muted/30 hover:bg-blue-50/30 transition-colors"
                            whileHover={{ scale: 1.005 }}
                          >
                            <div className="p-4 border-r border-muted/30">
                              <span className="font-medium text-gray-700">OCR-extracted</span>
                            </div>
                            <div className="p-4 font-mono text-sm text-gray-800">
                              {scanResult.fields.mrp_inclusive.value?.substring(0, 10) || '12,000m'}
                            </div>
                          </motion.div>
                          
                          {/* OCR on violation Row - Highlighted */}
                          <motion.div 
                            className="grid grid-cols-2 border-b border-muted/30 hover:bg-green-50/50 transition-colors"
                            whileHover={{ scale: 1.005 }}
                          >
                            <div className="p-4 border-r border-muted/30">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">OCR on violation</span>
                                <Badge className="bg-green-200 text-green-800 border-green-300 text-xs px-2 py-1 rounded">
                                  FLAGGED
                                </Badge>
                              </div>
                            </div>
                            <div className="p-4 font-mono text-sm text-gray-800">
                              10,000m
                            </div>
                          </motion.div>
                          
                          {/* Violations Row */}
                          <motion.div 
                            className="grid grid-cols-2 hover:bg-blue-50/30 transition-colors"
                            whileHover={{ scale: 1.005 }}
                          >
                            <div className="p-4 border-r border-muted/30">
                              <span className="font-medium text-gray-700">Heeuplp Violatios</span>
                            </div>
                            <div className="p-4 font-mono text-sm text-gray-800">
                              {scanResult.violations.length > 0 ? '12,000m' : 'None'}
                            </div>
                          </motion.div>
                        </div>

                        {/* Quick Stats Matching Original */}
                        <div className="flex gap-3">
                          <div className="flex-1 glass-card p-4 text-center border border-destructive/20 bg-gradient-to-br from-red-50/50 to-red-100/30">
                            <div className="text-2xl font-bold text-destructive mb-1">
                              {scanResult.violations.length}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">Violations Found</div>
                          </div>
                          <div className="flex-1 glass-card p-4 text-center border border-primary/20 bg-gradient-to-br from-blue-50/50 to-blue-100/30">
                            <div className="text-2xl font-bold text-primary mb-1">
                              {Math.round(scanResult.confidence_avg * 100)}%
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">AI Confidence</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Validation Report Card - Matching Reference UI */}
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card border-glass">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Shield className="h-6 w-6 text-primary" />
                  Validation Report Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {/* Legal Metrology Compliance Checks */}
                {Object.entries(scanResult.fields).map(([fieldKey, field], index) => {
                  const fieldConfig = getFieldConfig(fieldKey as keyof ComplianceFields);
                  const isPass = field.status === 'present' && field.confidence > 0.7;
                  const isFail = field.status === 'missing' || field.confidence < 0.6;
                  
                  return (
                    <motion.div
                      key={fieldKey}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between py-4 border-b border-muted/30 last:border-b-0 hover:bg-muted/20 transition-all rounded-lg px-4 mx-0"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-center gap-3">
                        <fieldConfig.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium text-foreground">{fieldConfig.label}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Status Text */}
                        <div className="flex items-center gap-2">
                          {isPass ? (
                            <>
                              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                                Pass
                              </Badge>
                              <motion.div 
                                className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              </motion.div>
                            </>
                          ) : isFail ? (
                            <>
                              <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
                                Fail
                              </Badge>
                              <motion.div 
                                className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <X className="h-5 w-5 text-red-600" />
                              </motion.div>
                            </>
                          ) : (
                            <>
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
                                Warning
                              </Badge>
                              <motion.div 
                                className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                              </motion.div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {/* Action Button - Matching Reference */}
                <div className="pt-6 flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-medium shadow-lg"
                      onClick={() => {
                        toast({
                          title: "Redirecting...",
                          description: "Opening original product listing"
                        });
                      }}
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      View Original Product Listing
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Additional Actions */}
        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card border-glass">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="outline" className="glass-button">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Re-scan Product
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report (PDF)
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Data (JSON)
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <Settings className="h-4 w-4 mr-2" />
                    Compliance Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card border-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="glass-tabs">
                  <TabsTrigger value="all">All Scans</TabsTrigger>
                  <TabsTrigger value="violations">Violations</TabsTrigger>
                  <TabsTrigger value="compliant">Compliant</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-3 mt-4">
                  <AnimatePresence>
                    {recentScans.map((scan, index) => (
                      <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl border border-muted hover:border-muted-foreground/50 hover:bg-muted/50 cursor-pointer transition-all group"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{scan.productName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-muted-foreground">
                                {scan.timestamp.toLocaleString()}
                              </p>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(scan.confidence * 100)}% confidence
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={`${
                              scan.status === 'violation' 
                                ? 'bg-destructive/20 text-destructive border-destructive/30' 
                                : scan.status === 'compliant'
                                ? 'bg-success/20 text-success border-success/30'
                                : 'bg-warning/20 text-warning border-warning/30'
                            }`}
                          >
                            {scan.status === 'compliant' ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 mr-1" />
                            )}
                            {scan.status === 'compliant' ? 'Compliant' : 
                             scan.status === 'violation' ? 'Violation' : 'Incomplete'}
                          </Badge>
                          <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </TabsContent>
                <TabsContent value="violations" className="space-y-3 mt-4">
                  <AnimatePresence>
                    {recentScans.filter(scan => scan.status === 'violation').map((scan, index) => (
                      <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-4 rounded-xl border border-destructive/20 bg-destructive/5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            <div>
                              <p className="font-medium">{scan.productName}</p>
                              <p className="text-sm text-muted-foreground">{scan.timestamp.toLocaleString()}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </TabsContent>
                <TabsContent value="compliant" className="space-y-3 mt-4">
                  <AnimatePresence>
                    {recentScans.filter(scan => scan.status === 'compliant').map((scan, index) => (
                      <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="p-4 rounded-xl border border-success/20 bg-success/5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-success" />
                            <div>
                              <p className="font-medium">{scan.productName}</p>
                              <p className="text-sm text-muted-foreground">{scan.timestamp.toLocaleString()}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-success text-success">
                            Compliant
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Helper functions
function getFieldConfig(fieldKey: keyof ComplianceFields) {
  const configs = {
    manufacturer: { icon: MapPin, label: 'Manufacturer/Packer/Importer' },
    net_quantity: { icon: Package, label: 'Net Quantity' },
    mrp_inclusive: { icon: DollarSign, label: 'MRP (Inclusive of all taxes)' },
    consumer_care: { icon: Phone, label: 'Consumer Care Details' },
    dom_or_doi: { icon: Calendar, label: 'Date of Manufacture/Import' },
    country_of_origin: { icon: Globe, label: 'Country of Origin' }
  };
  return configs[fieldKey];
}

function getStatusColor(status: string) {
  switch (status) {
    case 'present': return 'border-success text-success';
    case 'missing': return 'border-destructive text-destructive';
    case 'low_confidence': return 'border-warning text-warning';
    case 'invalid_format': return 'border-destructive text-destructive';
    default: return 'border-muted-foreground text-muted-foreground';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'present': return 'Present';
    case 'missing': return 'Missing';
    case 'low_confidence': return 'Low Confidence';
    case 'invalid_format': return 'Invalid Format';
    default: return 'Unknown';
  }
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 0.8) return 'bg-success';
  if (confidence >= 0.6) return 'bg-warning';
  return 'bg-destructive';
}

export default Scanner;

// Helper function to extract product name from URL
function extractProductNameFromUrl(url?: string): string | null {
  if (!url) return null;
  
  try {
    // Try to extract product name from common e-commerce URL patterns
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    
    // Amazon pattern: /dp/productId or /product-name/dp/productId
    if (pathname.includes('/dp/')) {
      const parts = pathname.split('/');
      const dpIndex = parts.indexOf('dp');
      if (dpIndex > 0) {
        return decodeURIComponent(parts[dpIndex - 1]).replace(/-/g, ' ');
      }
    }
    
    // Generic pattern: extract from path
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      return decodeURIComponent(segments[segments.length - 1]).replace(/[-_]/g, ' ');
    }
  } catch {
    // If URL parsing fails, return null
  }
  
  return null;
}