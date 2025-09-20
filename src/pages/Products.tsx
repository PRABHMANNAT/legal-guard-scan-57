import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search as SearchIcon, 
  Filter, 
  Eye, 
  RotateCcw, 
  Download, 
  ChevronDown,
  Calendar,
  X,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Import product images
import iphoneImg from '@/assets/iphone-product.jpg';
import redbullImg from '@/assets/redbull-product.jpg';
import pastaImg from '@/assets/pasta-product.jpg';
import doveSoapImg from '@/assets/dove-soap.jpg';
import nikeShoesImg from '@/assets/nike-shoes.jpg';
import samsungImg from '@/assets/samsung-phone.jpg';

interface Product {
  id: number;
  image: string;
  name: string;
  seller: string;
  category: string;
  complianceScore: number;
  violationsCount: number;
  lastScanned: string;
  status: 'compliant' | 'non-compliant' | 'pending';
  severity: 'critical' | 'warning' | 'info';
  sku: string;
}

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const products: Product[] = [
    {
      id: 1,
      image: iphoneImg,
      name: 'iPhone 15 Pro',
      seller: 'Apple Store',
      category: 'Electronics',
      complianceScore: 95,
      violationsCount: 0,
      lastScanned: '2024-01-15',
      status: 'compliant',
      severity: 'info',
      sku: 'APL-IPH15P-128'
    },
    {
      id: 2,
      image: redbullImg,
      name: 'Red Bull Energy Drink',
      seller: 'Energy Drinks Co.',
      category: 'Beverages',
      complianceScore: 65,
      violationsCount: 3,
      lastScanned: '2024-01-14',
      status: 'non-compliant',
      severity: 'warning',
      sku: 'RB-ENERGY-250ML'
    },
    {
      id: 3,
      image: pastaImg,
      name: 'Organic Pasta',
      seller: 'Italiano Foods',
      category: 'Food',
      complianceScore: 88,
      violationsCount: 1,
      lastScanned: '2024-01-13',
      status: 'non-compliant',
      severity: 'warning',
      sku: 'IT-PASTA-500G'
    },
    {
      id: 4,
      image: doveSoapImg,
      name: 'Dove Beauty Bar',
      seller: 'Unilever',
      category: 'Beauty',
      complianceScore: 92,
      violationsCount: 0,
      lastScanned: '2024-01-12',
      status: 'compliant',
      severity: 'info',
      sku: 'UNI-DOVE-100G'
    },
    {
      id: 5,
      image: nikeShoesImg,
      name: 'Nike Air Max',
      seller: 'Nike Official',
      category: 'Fashion',
      complianceScore: 45,
      violationsCount: 5,
      lastScanned: '2024-01-11',
      status: 'non-compliant',
      severity: 'critical',
      sku: 'NIK-AIRMAX-42'
    },
    {
      id: 6,
      image: samsungImg,
      name: 'Samsung Galaxy S24',
      seller: 'Samsung Store',
      category: 'Electronics',
      complianceScore: 78,
      violationsCount: 2,
      lastScanned: '2024-01-10',
      status: 'pending',
      severity: 'warning',
      sku: 'SAM-GAL24-256'
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'compliant': { 
        color: 'bg-success/10 text-success border-success/20', 
        label: '✅ Compliant',
        icon: '✅'
      },
      'non-compliant': { 
        color: 'bg-destructive/10 text-destructive border-destructive/20', 
        label: '❌ Non-Compliant',
        icon: '❌'
      },
      'pending': { 
        color: 'bg-warning/10 text-warning border-warning/20', 
        label: '⏳ Pending',
        icon: '⏳'
      }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['compliant'];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      'critical': 'bg-destructive text-destructive-foreground',
      'warning': 'bg-warning text-warning-foreground',
      'info': 'bg-primary text-primary-foreground'
    };
    
    return (
      <Badge className={severityConfig[severity as keyof typeof severityConfig]}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const handleProductSelect = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
    setSelectAll(!selectAll);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-display font-bold gradient-text flex items-center">
              <Package className="h-8 w-8 mr-3" />
              Products
            </h1>
            <p className="text-muted-foreground mt-1">
              Searchable and filterable list of products scanned by the system
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            {selectedProducts.length > 0 && (
              <Button className="bg-gradient-primary">
                Bulk Actions ({selectedProducts.length})
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filters Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {/* Search Bar */}
                <div className="lg:col-span-2">
                  <Label htmlFor="search" className="text-sm font-medium mb-2 block">
                    Search Products
                  </Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="search"
                      placeholder="Product name / URL / SKU"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Seller Dropdown */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Seller</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Sellers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sellers</SelectItem>
                      <SelectItem value="apple">Apple Store</SelectItem>
                      <SelectItem value="nike">Nike Official</SelectItem>
                      <SelectItem value="samsung">Samsung Store</SelectItem>
                      <SelectItem value="unilever">Unilever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Compliance Status */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="compliant">Compliant</SelectItem>
                      <SelectItem value="non-compliant">Non-compliant</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Severity</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Range Picker */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateFrom && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "PPP") : <span>Pick start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateTo && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "PPP") : <span>Pick end date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Action Buttons */}
                <div className="flex items-end space-x-2">
                  <Button className="bg-gradient-primary">
                    <Filter className="h-4 w-4 mr-2" />
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CardTitle>Products List</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Showing {products.length} products
                  </div>
                </div>
                
                {/* Bulk Actions */}
                {selectedProducts.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Re-scan All
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Export Selected
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 py-3 border-b font-medium text-sm text-muted-foreground">
                <div className="col-span-1 flex items-center">
                  <Checkbox 
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    className="mr-2"
                  />
                </div>
                <div className="col-span-2">Product</div>
                <div className="col-span-2">Seller</div>
                <div className="col-span-1">Score</div>
                <div className="col-span-1">Violations</div>
                <div className="col-span-2">Last Scanned</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Product Rows */}
              <div className="space-y-2">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`grid grid-cols-12 gap-4 py-4 border-b border-border/50 hover:bg-muted/30 transition-smooth rounded-lg ${
                      selectedProducts.includes(product.id) ? 'bg-primary/5' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="col-span-1 flex items-center">
                      <Checkbox 
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => handleProductSelect(product.id)}
                        className="mr-2"
                      />
                    </div>

                    {/* Product Image & Name */}
                    <div className="col-span-2 flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>

                    {/* Seller */}
                    <div className="col-span-2 flex items-center">
                      <div>
                        <p className="font-medium">{product.seller}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                    </div>

                    {/* Compliance Score */}
                    <div className="col-span-1 flex items-center">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${
                          product.complianceScore >= 90 ? 'text-success' :
                          product.complianceScore >= 70 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {product.complianceScore}%
                        </div>
                        {product.severity !== 'info' && (
                          <div className="mt-1">
                            {getSeverityBadge(product.severity)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Violations Count */}
                    <div className="col-span-1 flex items-center">
                      <span className={`font-medium ${
                        product.violationsCount === 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        {product.violationsCount}
                      </span>
                    </div>

                    {/* Last Scanned */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-muted-foreground">{product.lastScanned}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-center">
                      {getStatusBadge(product.status)}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 flex items-center space-x-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Re-Scan
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Products;