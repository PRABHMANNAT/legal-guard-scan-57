import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, RefreshCw, Download, FileText, AlertTriangle, CheckCircle, 
  Eye, ExternalLink, Copy, Zap, Shield, Calendar, Globe, Package, 
  DollarSign, Phone, Mail, MapPin, Camera, Layers, BarChart3,
  Clock, Users, Store, Star, Flag, MessageSquare, Settings, Filter,
  ChevronDown, ChevronRight, Maximize2, RotateCcw, Search, Tag
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

// Mock product data matching the provided schema
const mockProduct = {
  cp_id: "CP-5911",
  title: "Cetaphil Gentle Skin Cleanser",
  brand: "Cetaphil",
  variant: "250 mL",
  ids: { gtin: "08912345678902", asin: "B01CCGW4LC" },
  score: 65,
  status: "warning" as const,
  attestation: { state: "missing" as const },
  last_scanned: "2025-09-20T06:40:00Z",
  marketplaces: 5,
  sellers: 8,
  duplicates: [
    {
      marketplace: "Amazon",
      seller: "ABC Retail",
      url: "https://amazon.in/dp/B01CCGW4LC",
      status: "non_compliant" as const,
      violations: 3,
      mrp: 769,
      selling_price: 685,
      why: ["ocr_fingerprint", "img_hash"],
      last_seen: "2025-09-19"
    },
    {
      marketplace: "Flipkart",
      seller: "XYZ Store",
      url: "https://flipkart.com/product",
      status: "warning" as const,
      violations: 1,
      mrp: 769,
      selling_price: 699,
      why: ["gtin"],
      last_seen: "2025-09-18"
    },
    {
      marketplace: "Nykaa",
      seller: "Beauty Hub",
      url: "https://nykaa.com/product",
      status: "compliant" as const,
      violations: 0,
      mrp: 769,
      selling_price: 750,
      why: ["title_match"],
      last_seen: "2025-09-20"
    }
  ],
  lmpc: {
    manufacturer: { name: null, address: null, sources: ["image"], confidence: 0.0 },
    packer: { name: null, address: null, sources: ["image"], confidence: 0.0 },
    importer: { name: "Galderma India Pvt. Ltd.", address: "Bangalore, India", sources: ["page"], confidence: 0.7 },
    net_quantity: { value: 250, unit: "mL", sources: ["image"], confidence: 0.95 },
    mrp: { value: 769, currency: "INR", inclusive: true, sources: ["page"], confidence: 0.9 },
    consumer_care: { phone: null, email: null, address: null, sources: ["image"], confidence: 0.0 },
    mfg_or_import_month_year: { value: null, sources: ["image"], confidence: 0.0 },
    country_of_origin: { value: null, sources: ["image"], confidence: 0.0 }
  },
  issues: ["missing_manufacturer", "missing_care", "missing_coo"]
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [showOCROverlay, setShowOCROverlay] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    evidence: true,
    duplicates: true,
    audit: false
  });

  // Mock evidence data
  const evidenceImages = [
    { id: 1, url: "/placeholder-product.jpg", type: "product_image", ocr_data: "250 mL", confidence: 0.95 },
    { id: 2, url: "/placeholder-label.jpg", type: "back_label", ocr_data: "Mfg: Galderma", confidence: 0.8 },
    { id: 3, url: "/placeholder-listing.jpg", type: "listing_screenshot", ocr_data: "₹769 MRP", confidence: 0.9 }
  ];

  const auditTrail = [
    { id: 1, action: "Product scanned", user: "AI Scanner", timestamp: "2025-09-20T06:40:00Z", details: "Initial LMPC compliance scan" },
    { id: 2, action: "Duplicate merged", user: "John Doe", timestamp: "2025-09-19T15:30:00Z", details: "Merged Amazon listing via GTIN match" },
    { id: 3, action: "Issue flagged", user: "Compliance Bot", timestamp: "2025-09-19T10:15:00Z", details: "Missing manufacturer information detected" }
  ];

  const handleRescan = () => {
    toast({
      title: "Re-scan initiated",
      description: "Product will be re-analyzed for compliance updates",
    });
  };

  const handleDownloadEvidence = () => {
    toast({
      title: "Evidence pack downloading",
      description: "ZIP file with all product evidence will download shortly",
    });
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      compliant: { color: "bg-success/10 text-success border-success/30", label: "Compliant", icon: CheckCircle },
      warning: { color: "bg-warning/10 text-warning border-warning/30", label: "Warning", icon: AlertTriangle },
      non_compliant: { color: "bg-destructive/10 text-destructive border-destructive/30", label: "Non-Compliant", icon: AlertTriangle },
      pending: { color: "bg-muted/10 text-muted-foreground border-muted/30", label: "Pending", icon: Clock }
    };
    
    const config = configs[status as keyof typeof configs] || configs.pending;
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getAttestationBadge = (state: string) => {
    const configs = {
      verified: { color: "bg-success text-success-foreground", label: "Verified", icon: Shield },
      self_declared: { color: "bg-warning text-warning-foreground", label: "Self-Declared", icon: Flag },
      missing: { color: "bg-muted text-muted-foreground", label: "Missing", icon: AlertTriangle }
    };
    
    const config = configs[state as keyof typeof configs] || configs.missing;
    const IconComponent = config.icon;
    
    return (
      <Badge className={config.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${text} has been copied`,
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Breadcrumb & Back Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 pt-4"
          >
            <Button variant="ghost" onClick={() => navigate('/products')} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm text-muted-foreground">Products / {mockProduct.cp_id}</span>
            
            {/* Keyboard Shortcuts Hint */}
            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">R</kbd>
              <span>Re-scan</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">E</kbd>
              <span>Export</span>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">G</kbd>
              <span>Gallery</span>
            </div>
          </motion.div>

          {/* Conflict Banners */}
          {mockProduct.duplicates.some(d => Math.abs(d.mrp - mockProduct.lmpc.mrp.value) > 0) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-warning/10 border border-warning/30 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="font-medium">MRP Drift Detected</span>
                <span className="text-sm text-muted-foreground">
                  Different MRP values found across listings. Click to filter affected duplicates.
                </span>
              </div>
            </motion.div>
          )}

          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-glass">
              <CardHeader className="pb-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Product Info */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-display font-bold gradient-text">{mockProduct.title}</h1>
                        <Badge variant="outline" className="bg-background/50 font-mono">
                          {mockProduct.cp_id}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="font-medium text-lg">{mockProduct.brand}</span>
                        <span>•</span>
                        <span className="text-lg">{mockProduct.variant}</span>
                      </div>
                    </div>

                    {/* IDs & Identifiers */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          GTIN: {mockProduct.ids.gtin}
                        </Badge>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(mockProduct.ids.gtin)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy GTIN</TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          ASIN: {mockProduct.ids.asin}
                        </Badge>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0"
                              onClick={() => copyToClipboard(mockProduct.ids.asin)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy ASIN</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Status & Score */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">Compliance Score:</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-3xl font-bold ${getScoreColor(mockProduct.score)}`}>
                            {mockProduct.score}
                          </span>
                          <span className="text-muted-foreground">/100</span>
                        </div>
                        <Progress value={mockProduct.score} className="w-24 h-2" />
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(mockProduct.status)}
                        {getAttestationBadge(mockProduct.attestation.state)}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Last Scanned:</span>
                        <p className="font-medium">
                          {new Date(mockProduct.last_scanned).toLocaleDateString('en-GB', { 
                            day: '2-digit', month: 'short', year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Marketplaces:</span>
                        <p className="font-medium flex items-center gap-1">
                          <Store className="h-3 w-3" />
                          {mockProduct.marketplaces}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sellers:</span>
                        <p className="font-medium flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {mockProduct.sellers}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duplicates:</span>
                        <p className="font-medium flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {mockProduct.duplicates.length}
                        </p>
                      </div>
                    </div>

                    {/* Issues Summary */}
                    {mockProduct.issues.length > 0 && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <span className="text-sm font-medium">Issues:</span>
                        <div className="flex flex-wrap gap-1">
                          {mockProduct.issues.map(issue => (
                            <Badge key={issue} variant="outline" className="bg-warning/10 text-warning border-warning/30 text-xs">
                              {issue.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-col gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleRescan} className="bg-gradient-to-r from-primary to-primary-foreground">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Re-Scan Product
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Keyboard shortcut: R</TooltipContent>
                    </Tooltip>
                    
                    <Button variant="outline" onClick={handleDownloadEvidence}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Evidence Pack
                    </Button>
                    
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Export PDF Report
                    </Button>
                    
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Request VC Attestation
                    </Button>
                    
                    <Button variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Raise Notice
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* LMPC Field Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  LMPC Compliance Matrix
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Legal Metrology (Packaged Commodities) Rules compliance status
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-full space-y-1">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 p-3 text-xs font-medium text-muted-foreground border-b">
                      <div className="col-span-3">Field</div>
                      <div className="col-span-3">Canonical Value</div>
                      <div className="col-span-2">Sources</div>
                      <div className="col-span-2">Confidence</div>
                      <div className="col-span-1">Coverage</div>
                      <div className="col-span-1">Action</div>
                    </div>
                    
                    {/* Data Rows */}
                    {Object.entries(mockProduct.lmpc).map(([field, data], index) => (
                      <motion.div
                        key={field}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="grid grid-cols-12 gap-4 p-3 border rounded-lg hover:border-primary/50 hover:bg-primary/2 transition-all"
                      >
                        {/* Field Name */}
                        <div className="col-span-3 flex items-center">
                          <div>
                            <p className="font-medium capitalize text-sm">
                              {field.replace(/_/g, ' ')}
                            </p>
                            {field === 'mrp' && (
                              <p className="text-xs text-muted-foreground">
                                Selling price ≠ MRP (law needs MRP inclusive of taxes)
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Canonical Value */}
                        <div className="col-span-3 flex items-center">
                          {(data as any).name || (data as any).value ? (
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate">
                                {(data as any).name || `${(data as any).value} ${(data as any).unit || (data as any).currency || ''}`}
                              </p>
                              {(data as any).address && (
                                <p className="text-xs text-muted-foreground truncate">{(data as any).address}</p>
                              )}
                              {(data as any).inclusive && (
                                <p className="text-xs text-success">Inclusive of all taxes</p>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Missing
                            </Badge>
                          )}
                        </div>

                        {/* Sources */}
                        <div className="col-span-2 flex items-center">
                          <div className="flex flex-wrap gap-1">
                            {data.sources?.map((source: string) => (
                              <Badge key={source} variant="outline" className="text-xs bg-background/50">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Confidence */}
                        <div className="col-span-2 flex items-center">
                          <div className="w-full space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Confidence</span>
                              <span className="font-medium">{Math.round((data.confidence || 0) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(data.confidence || 0) * 100} 
                              className="h-1.5"
                            />
                          </div>
                        </div>

                        {/* Coverage */}
                        <div className="col-span-1 flex items-center justify-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="text-xs cursor-help">
                                {Math.floor(Math.random() * mockProduct.duplicates.length + 1)}/{mockProduct.duplicates.length}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Coverage {Math.floor(Math.random() * mockProduct.duplicates.length + 1)}/{mockProduct.duplicates.length} listings</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center justify-center">
                          {(!(data as any).name && !(data as any).value) ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" className="h-6 px-2">
                                  <Zap className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Fix missing field</TooltipContent>
                            </Tooltip>
                          ) : data.confidence < 0.7 ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" className="h-6 px-2">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Review low confidence</TooltipContent>
                            </Tooltip>
                          ) : (
                            <CheckCircle className="h-3 w-3 text-success" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs for Additional Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Tabs defaultValue="evidence" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="evidence" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Evidence Gallery
                </TabsTrigger>
                <TabsTrigger value="duplicates" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Duplicates ({mockProduct.duplicates.length})
                </TabsTrigger>
                <TabsTrigger value="sellers" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Sellers & Pricing
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Audit Trail
                </TabsTrigger>
              </TabsList>

              <TabsContent value="evidence">
                <Card className="glass-card border-glass">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Evidence Gallery
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowOCROverlay(!showOCROverlay)}
                        >
                          <Layers className="h-3 w-3 mr-1" />
                          OCR Overlay {showOCROverlay ? 'ON' : 'OFF'}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Maximize2 className="h-3 w-3 mr-1" />
                          Full Screen
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Image Gallery */}
                      <div className="lg:col-span-2 space-y-4">
                        <div className="aspect-video bg-muted rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center relative overflow-hidden">
                          <div className="text-center">
                            <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                            <p className="font-medium">Evidence Image {selectedImage + 1}</p>
                            <p className="text-sm text-muted-foreground capitalize">
                              {evidenceImages[selectedImage].type.replace('_', ' ')}
                            </p>
                          </div>
                          
                          {/* OCR Overlay */}
                          {showOCROverlay && (
                            <div className="absolute inset-0 pointer-events-none">
                              <div className="absolute top-4 left-4 w-16 h-6 border-2 border-red-500 bg-red-500/20"></div>
                              <div className="absolute bottom-8 right-6 w-20 h-4 border-2 border-green-500 bg-green-500/20"></div>
                              <div className="absolute top-8 right-8 w-12 h-8 border-2 border-blue-500 bg-blue-500/20"></div>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {evidenceImages.map((image, index) => (
                            <button
                              key={image.id}
                              onClick={() => setSelectedImage(index)}
                              className={`aspect-square bg-muted rounded-lg border-2 transition-all hover:border-primary/50 ${
                                selectedImage === index ? 'border-primary shadow-lg' : 'border-transparent'
                              }`}
                            >
                              <div className="h-full flex flex-col items-center justify-center p-2">
                                <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                                <span className="text-xs text-center capitalize">
                                  {image.type.replace('_', ' ')}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* OCR Data Panel */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">Extracted Text</h3>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3 mr-1" />
                            Export OCR
                          </Button>
                        </div>
                        
                        <ScrollArea className="h-96">
                          <div className="space-y-3">
                            {evidenceImages.map((image, index) => (
                              <div
                                key={image.id}
                                className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                                  selectedImage === index ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'
                                }`}
                                onClick={() => setSelectedImage(index)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium capitalize">
                                    {image.type.replace('_', ' ')}
                                  </span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      image.confidence > 0.8 ? 'bg-success/10 text-success border-success/30' :
                                      image.confidence > 0.6 ? 'bg-warning/10 text-warning border-warning/30' :
                                      'bg-destructive/10 text-destructive border-destructive/30'
                                    }`}
                                  >
                                    {Math.round(image.confidence * 100)}%
                                  </Badge>
                                </div>
                                <div className="text-sm font-mono bg-muted/50 p-2 rounded border">
                                  "{image.ocr_data}"
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    Extracted from {image.type}
                                  </span>
                                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="duplicates">
                <Card className="glass-card border-glass">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        Duplicates & Variants
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Settings className="h-3 w-3 mr-1" />
                          Merge/Unmerge
                        </Button>
                        <Button variant="outline" size="sm">
                          <Tag className="h-3 w-3 mr-1" />
                          Mark as Variant
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {mockProduct.duplicates.map((duplicate, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="p-4 border rounded-xl hover:border-primary/50 hover:shadow-md transition-all"
                        >
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Marketplace & Seller */}
                            <div className="col-span-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="bg-background/50">
                                  {duplicate.marketplace}
                                </Badge>
                                {getStatusBadge(duplicate.status)}
                              </div>
                              <p className="font-medium text-sm">{duplicate.seller}</p>
                              <p className="text-xs text-muted-foreground">
                                Last seen: {new Date(duplicate.last_seen).toLocaleDateString('en-GB')}
                              </p>
                            </div>

                            {/* Price Info */}
                            <div className="col-span-3">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">MRP:</span>
                                  <span className="font-medium text-sm">₹{duplicate.mrp}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Tag className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Selling:</span>
                                  <span className="font-bold text-primary text-sm">₹{duplicate.selling_price}</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      duplicate.selling_price < duplicate.mrp ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                                    }`}
                                  >
                                    {duplicate.selling_price < duplicate.mrp ? 'Discount' : 'Premium'}
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Margin: ₹{Math.abs(duplicate.mrp - duplicate.selling_price)}
                                </div>
                              </div>
                            </div>

                            {/* Issues & Score */}
                            <div className="col-span-2">
                              <div className="space-y-2">
                                <Badge 
                                  variant="outline" 
                                  className={duplicate.violations > 0 ? 
                                    'bg-destructive/10 text-destructive border-destructive/30' : 
                                    'bg-success/10 text-success border-success/30'
                                  }
                                >
                                  {duplicate.violations} violations
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-warning fill-current" />
                                  <span className="text-xs">
                                    {Math.floor(Math.random() * 30 + 70)}/100
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Why Grouped */}
                            <div className="col-span-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="space-y-1 cursor-help">
                                    <p className="text-xs text-muted-foreground">Grouped by:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {duplicate.why.slice(0, 2).map(reason => (
                                        <Badge key={reason} variant="outline" className="text-xs">
                                          {reason.replace('_', ' ')}
                                        </Badge>
                                      ))}
                                      {duplicate.why.length > 2 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{duplicate.why.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="space-y-1">
                                    <p className="font-medium">Grouping reasons:</p>
                                    {duplicate.why.map(reason => (
                                      <p key={reason} className="text-xs">• {reason.replace('_', ' ')}</p>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 flex items-center gap-1 justify-end">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                    <a href={duplicate.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View listing</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Compare details</TooltipContent>
                              </Tooltip>
                              
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Settings className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>More actions</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sellers">
                <Card className="glass-card border-glass">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Store className="h-5 w-5" />
                        Seller Information & Price History
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Price Chart
                        </Button>
                        <Button variant="outline" size="sm">
                          <Globe className="h-3 w-3 mr-1" />
                          COO History
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Seller</TableHead>
                          <TableHead>Marketplace</TableHead>
                          <TableHead>MRP / Selling Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Margin</TableHead>
                          <TableHead>Last Seen</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockProduct.duplicates.map((duplicate, index) => (
                          <TableRow key={index} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                              <div>
                                <p>{duplicate.seller}</p>
                                <p className="text-xs text-muted-foreground">
                                  Score: {Math.floor(Math.random() * 30 + 70)}/100
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{duplicate.marketplace}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-mono text-sm">₹{duplicate.mrp}</p>
                                <p className="font-bold text-primary text-sm">₹{duplicate.selling_price}</p>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(duplicate.status)}</TableCell>
                            <TableCell>
                              <div className={`text-sm font-medium ${
                                duplicate.selling_price < duplicate.mrp ? 'text-success' : 'text-warning'
                              }`}>
                                {duplicate.selling_price < duplicate.mrp ? '-' : '+'}₹{Math.abs(duplicate.mrp - duplicate.selling_price)}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {new Date(duplicate.last_seen).toLocaleDateString('en-GB')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                  <a href={duplicate.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <BarChart3 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audit">
                <Card className="glass-card border-glass">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Audit Trail
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Filter className="h-3 w-3 mr-1" />
                          Filter Events
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Export Log
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {auditTrail.map((event, index) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary/50 transition-colors"
                        >
                          <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">{event.action}</span>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(event.timestamp).toLocaleString('en-GB')}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{event.details}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                by {event.user}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {event.action.toLowerCase().includes('scan') ? 'automated' : 'manual'}
                              </Badge>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProductDetails;