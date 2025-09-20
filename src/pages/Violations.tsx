import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Filter, Search, Eye, Download, Calendar, Building, Package, 
  ChevronDown, X, Plus, Edit, Trash2, MessageSquare, UserCheck, Clock, 
  TrendingUp, BarChart3, FileText, Settings, SortAsc, SortDesc, Tag,
  CheckCircle, XCircle, AlertCircle, Pause, Play, ExternalLink, Copy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useViolations } from '@/contexts/ViolationsContext';
import { ViolationRecord, ViolationFilters, ViolationSortConfig } from '@/types/violations';
import { useToast } from '@/hooks/use-toast';

const Violations = () => {
  const { violations, updateViolation, deleteViolation, changeStatus, addUserAction, getFilteredViolations, getViolationStats } = useViolations();
  const { toast } = useToast();

  // State management
  const [showFilters, setShowFilters] = useState(false);
  const [selectedViolations, setSelectedViolations] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filters, setFilters] = useState<ViolationFilters>({
    search: '',
    complianceStatus: [],
    severity: [],
    platform: [],
    category: [],
    violationType: [],
    assignedTo: [],
    priority: [],
    tags: [],
    dateRange: {}
  });
  const [sortConfig, setSortConfig] = useState<ViolationSortConfig>({
    field: 'dateScanned',
    direction: 'desc'
  });

  // Filter and sort violations
  const filteredViolations = useMemo(() => {
    return getFilteredViolations(filters, sortConfig);
  }, [getFilteredViolations, filters, sortConfig]);

  const stats = useMemo(() => getViolationStats(), [getViolationStats]);

  // Handlers
  const handleFilterChange = (key: keyof ViolationFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (field: ViolationSortConfig['field']) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleStatusChange = (violationId: string, newStatus: ViolationRecord['complianceStatus']) => {
    changeStatus(violationId, newStatus, `Status changed via bulk action`);
    toast({
      title: "Status updated",
      description: `Violation status changed to ${newStatus}`,
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedViolations.length === 0) {
      toast({
        title: "No violations selected",
        description: "Please select violations to perform bulk actions",
        variant: "destructive"
      });
      return;
    }

    switch (action) {
      case 'resolve':
        selectedViolations.forEach(id => changeStatus(id, 'resolved'));
        toast({ title: "Bulk action completed", description: `${selectedViolations.length} violations marked as resolved` });
        break;
      case 'dismiss':
        selectedViolations.forEach(id => changeStatus(id, 'dismissed'));
        toast({ title: "Bulk action completed", description: `${selectedViolations.length} violations dismissed` });
        break;
      case 'delete':
        selectedViolations.forEach(id => deleteViolation(id));
        toast({ title: "Bulk action completed", description: `${selectedViolations.length} violations deleted` });
        break;
    }
    setSelectedViolations([]);
  };

  const exportData = (format: 'csv' | 'json' | 'pdf') => {
    const data = filteredViolations.map(v => ({
      id: v.id,
      productName: v.productName,
      brand: v.brand,
      platform: v.platform,
      status: v.complianceStatus,
      severity: v.severity,
      dateScanned: v.dateScanned.toISOString().split('T')[0],
      violationType: v.violationType.join('; '),
      confidenceScore: v.confidenceScore
    }));

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `violations-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    toast({
      title: "Export completed",
      description: `${data.length} violations exported as ${format.toUpperCase()}`,
    });
  };

  const getStatusBadge = (status: ViolationRecord['complianceStatus']) => {
    const configs = {
      'compliant': { icon: CheckCircle, color: 'bg-success/10 text-success border-success/30', label: 'Compliant' },
      'violation': { icon: XCircle, color: 'bg-destructive/10 text-destructive border-destructive/30', label: 'Violation' },
      'pending': { icon: Clock, color: 'bg-warning/10 text-warning border-warning/30', label: 'Pending Review' },
      'resolved': { icon: CheckCircle, color: 'bg-primary/10 text-primary border-primary/30', label: 'Resolved' },
      'dismissed': { icon: Pause, color: 'bg-muted/10 text-muted-foreground border-muted/30', label: 'Dismissed' }
    };
    
    const config = configs[status];
    const IconComponent = config.icon;
    return (
      <Badge className={config.color}>
        <IconComponent className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: ViolationRecord['severity']) => {
    const configs = {
      'critical': { color: 'bg-red-500 text-white', label: 'Critical' },
      'high': { color: 'bg-destructive text-destructive-foreground', label: 'High' },
      'medium': { color: 'bg-warning text-warning-foreground', label: 'Medium' },
      'low': { color: 'bg-muted text-muted-foreground', label: 'Low' }
    };
    return <Badge className={configs[severity].color}>{configs[severity].label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mt-8"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-display font-bold gradient-text flex items-center">
              <AlertTriangle className="h-10 w-10 mr-4" />
              Compliance Violations
            </h1>
            <p className="text-muted-foreground text-lg">
              Monitor, manage, and resolve product compliance violations across all platforms
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => exportData('json')} className="glass-button">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" onClick={() => exportData('csv')} className="glass-button">
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-primary-foreground shadow-elegant">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Violation Management Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Auto-assignment rules</Label>
                    <Select defaultValue="category">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category">Assign by Category</SelectItem>
                        <SelectItem value="severity">Assign by Severity</SelectItem>
                        <SelectItem value="platform">Assign by Platform</SelectItem>
                        <SelectItem value="manual">Manual Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notification preferences</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email" defaultChecked />
                        <Label htmlFor="email">Email notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="realtime" defaultChecked />
                        <Label htmlFor="realtime">Real-time alerts</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="glass-card border-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Violations</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% from last week
                  </p>
                </div>
                <div className="h-12 w-12 bg-destructive/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Violations</p>
                  <p className="text-3xl font-bold">{stats.byStatus.violation || 0}</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Needs attention
                  </p>
                </div>
                <div className="h-12 w-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-3xl font-bold">{stats.byStatus.resolved || 0}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Great progress
                  </p>
                </div>
                <div className="h-12 w-12 bg-success/20 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                  <p className="text-3xl font-bold">
                    {Math.round(((stats.byStatus.resolved || 0) / stats.total) * 100)}%
                  </p>
                  <Progress 
                    value={((stats.byStatus.resolved || 0) / stats.total) * 100} 
                    className="w-full h-2 mt-2" 
                  />
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-80"
          >
            <Card className="glass-card border-glass sticky top-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Advanced Filters
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({
                      search: '',
                      complianceStatus: [],
                      severity: [],
                      platform: [],
                      category: [],
                      violationType: [],
                      assignedTo: [],
                      priority: [],
                      tags: [],
                      dateRange: {}
                    })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label>Search Products</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search products, brands, violations..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="pl-10 glass-input"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-3">
                  <Label>Compliance Status</Label>
                  <div className="space-y-2">
                    {[
                      { id: 'violation', label: 'Active Violations', count: stats.byStatus.violation || 0 },
                      { id: 'pending', label: 'Pending Review', count: stats.byStatus.pending || 0 },
                      { id: 'resolved', label: 'Resolved', count: stats.byStatus.resolved || 0 },
                      { id: 'compliant', label: 'Compliant', count: stats.byStatus.compliant || 0 },
                      { id: 'dismissed', label: 'Dismissed', count: stats.byStatus.dismissed || 0 }
                    ].map((status) => (
                      <div key={status.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={status.id}
                            checked={filters.complianceStatus.includes(status.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('complianceStatus', [...filters.complianceStatus, status.id]);
                              } else {
                                handleFilterChange('complianceStatus', filters.complianceStatus.filter(s => s !== status.id));
                              }
                            }}
                          />
                          <Label htmlFor={status.id} className="text-sm">
                            {status.label}
                          </Label>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {status.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Severity Filter */}
                <div className="space-y-3">
                  <Label>Severity Level</Label>
                  <div className="space-y-2">
                    {[
                      { id: 'critical', label: 'Critical', count: stats.bySeverity.critical || 0 },
                      { id: 'high', label: 'High', count: stats.bySeverity.high || 0 },
                      { id: 'medium', label: 'Medium', count: stats.bySeverity.medium || 0 },
                      { id: 'low', label: 'Low', count: stats.bySeverity.low || 0 }
                    ].map((severity) => (
                      <div key={severity.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`sev-${severity.id}`}
                            checked={filters.severity.includes(severity.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleFilterChange('severity', [...filters.severity, severity.id]);
                              } else {
                                handleFilterChange('severity', filters.severity.filter(s => s !== severity.id));
                              }
                            }}
                          />
                          <Label htmlFor={`sev-${severity.id}`} className="text-sm">
                            {severity.label}
                          </Label>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {severity.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Filter */}
                <div className="space-y-3">
                  <Label>E-commerce Platform</Label>
                  <Select 
                    value={filters.platform.length > 0 ? filters.platform[0] : 'all'}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        handleFilterChange('platform', []);
                      } else {
                        handleFilterChange('platform', [value]);
                      }
                    }}
                  >
                    <SelectTrigger className="glass-input">
                      <SelectValue placeholder="All Platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="Amazon">Amazon ({stats.byPlatform.Amazon || 0})</SelectItem>
                      <SelectItem value="Flipkart">Flipkart ({stats.byPlatform.Flipkart || 0})</SelectItem>
                      <SelectItem value="Reliance Digital">Reliance Digital ({stats.byPlatform['Reliance Digital'] || 0})</SelectItem>
                      <SelectItem value="Myntra">Myntra ({stats.byPlatform.Myntra || 0})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Actions */}
                <Separator />
                <div className="space-y-3">
                  <Label>Quick Actions</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleFilterChange('complianceStatus', ['violation'])}
                      className="glass-button"
                    >
                      Show Violations
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleFilterChange('severity', ['critical', 'high'])}
                      className="glass-button"
                    >
                      High Priority
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex-1"
          >
            <Card className="glass-card border-glass">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Violations List
                    </CardTitle>
                    <Badge variant="outline" className="bg-background/50">
                      {filteredViolations.length} results
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedViolations.length > 0 && (
                      <div className="flex items-center gap-2 mr-4">
                        <Badge variant="outline">{selectedViolations.length} selected</Badge>
                        <Button size="sm" onClick={() => handleBulkAction('resolve')} className="glass-button">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleBulkAction('delete')}>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                      className="glass-button"
                    >
                      {viewMode === 'list' ? 'Grid View' : 'List View'}
                    </Button>
                  </div>
                </div>
                
                {/* Column Headers - List View */}
                {viewMode === 'list' && (
                  <div className="grid grid-cols-12 gap-4 py-3 text-sm font-medium text-muted-foreground border-b border-border/50">
                    <div className="col-span-1">
                      <Checkbox 
                        checked={selectedViolations.length === filteredViolations.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedViolations(filteredViolations.map(v => v.id));
                          } else {
                            setSelectedViolations([]);
                          }
                        }}
                      />
                    </div>
                    <div className="col-span-3 cursor-pointer flex items-center gap-1" onClick={() => handleSort('productName')}>
                      Product Name
                      {sortConfig.field === 'productName' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                    <div className="col-span-2 cursor-pointer flex items-center gap-1" onClick={() => handleSort('platform')}>
                      Platform
                      {sortConfig.field === 'platform' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 cursor-pointer flex items-center gap-1" onClick={() => handleSort('severity')}>
                      Severity
                      {sortConfig.field === 'severity' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                    <div className="col-span-2 cursor-pointer flex items-center gap-1" onClick={() => handleSort('dateScanned')}>
                      Date Scanned
                      {sortConfig.field === 'dateScanned' && (
                        sortConfig.direction === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                    <div className="col-span-1">Actions</div>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <AnimatePresence>
                  {filteredViolations.map((violation, index) => (
                    <motion.div
                      key={violation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <Collapsible>
                        <div className={`grid grid-cols-12 gap-4 p-4 rounded-xl border transition-all duration-200 hover:border-primary/50 hover:bg-primary/2 ${
                          selectedViolations.includes(violation.id) ? 'border-primary/50 bg-primary/5' : 'border-border/30'
                        }`}>
                          {/* Checkbox */}
                          <div className="col-span-1 flex items-center">
                            <Checkbox 
                              checked={selectedViolations.includes(violation.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedViolations([...selectedViolations, violation.id]);
                                } else {
                                  setSelectedViolations(selectedViolations.filter(id => id !== violation.id));
                                }
                              }}
                            />
                          </div>

                          {/* Product Name */}
                          <div className="col-span-3 flex items-center space-x-3">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{violation.productName}</p>
                              <p className="text-sm text-muted-foreground truncate">{violation.brand}</p>
                            </div>
                          </div>

                          {/* Platform */}
                          <div className="col-span-2 flex items-center">
                            <Badge variant="outline" className="bg-background/50">
                              {violation.platform}
                            </Badge>
                          </div>

                          {/* Status */}
                          <div className="col-span-2 flex items-center">
                            {getStatusBadge(violation.complianceStatus)}
                          </div>

                          {/* Severity */}
                          <div className="col-span-1 flex items-center">
                            {getSeverityBadge(violation.severity)}
                          </div>

                          {/* Date */}
                          <div className="col-span-2 flex items-center">
                            <span className="text-sm text-muted-foreground">
                              {violation.dateScanned.toLocaleDateString('en-GB', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 flex items-center space-x-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>Violation Details: {violation.productName}</DialogTitle>
                                </DialogHeader>
                                <ViolationDetailView violation={violation} onStatusChange={handleStatusChange} />
                              </DialogContent>
                            </Dialog>
                            
                            {violation.productUrl && (
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                                <a href={violation.productUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Expanded Content */}
                        <CollapsibleContent>
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="ml-16 mr-4 mb-4 p-6 bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-muted/30"
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* Violation Details */}
                              <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4" />
                                  Field Violations
                                </h4>
                                <div className="space-y-3">
                                  {violation.fieldViolations.map((fieldViolation, idx) => (
                                    <div key={idx} className="p-3 bg-background/50 rounded-lg">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium capitalize">{fieldViolation.field.replace('_', ' ')}</span>
                                        <Badge className={
                                          fieldViolation.severity === 'critical' ? 'bg-red-500 text-white' :
                                          fieldViolation.severity === 'major' ? 'bg-destructive text-destructive-foreground' :
                                          'bg-warning text-warning-foreground'
                                        }>
                                          {fieldViolation.severity}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{fieldViolation.issue}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Actions & Metadata */}
                              <div className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2">
                                  <Settings className="h-4 w-4" />
                                  Quick Actions
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleStatusChange(violation.id, 'resolved')}
                                    className="glass-button"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-2" />
                                    Resolve
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleStatusChange(violation.id, 'pending')}
                                    className="glass-button"
                                  >
                                    <Clock className="h-3 w-3 mr-2" />
                                    Mark Pending
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleStatusChange(violation.id, 'dismissed')}
                                    className="glass-button"
                                  >
                                    <Pause className="h-3 w-3 mr-2" />
                                    Dismiss
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => exportData('json')}
                                    className="glass-button"
                                  >
                                    <Download className="h-3 w-3 mr-2" />
                                    Export
                                  </Button>
                                </div>

                                <div className="pt-4 space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Confidence Score:</span>
                                    <span className="font-medium">{Math.round(violation.confidenceScore * 100)}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Priority:</span>
                                    <Badge variant="outline" className="capitalize">{violation.priority}</Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Category:</span>
                                    <span className="font-medium">{violation.category}</span>
                                  </div>
                                  {violation.tags.length > 0 && (
                                    <div className="flex items-start justify-between">
                                      <span className="text-muted-foreground">Tags:</span>
                                      <div className="flex flex-wrap gap-1">
                                        {violation.tags.slice(0, 3).map(tag => (
                                          <Badge key={tag} variant="outline" className="text-xs">
                                            {tag}
                                          </Badge>
                                        ))}
                                        {violation.tags.length > 3 && (
                                          <Badge variant="outline" className="text-xs">
                                            +{violation.tags.length - 3} more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </CollapsibleContent>
                      </Collapsible>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredViolations.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-muted/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">No violations found</h3>
                    <p className="text-muted-foreground mb-4">
                      {Object.keys(filters).some(key => 
                        key === 'search' ? filters[key] : 
                        Array.isArray(filters[key as keyof ViolationFilters]) ? 
                          (filters[key as keyof ViolationFilters] as any[]).length > 0 : false
                      ) 
                        ? 'Try adjusting your filters to see more results'
                        : 'Great! All products are compliant with regulations'
                      }
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({
                        search: '',
                        complianceStatus: [],
                        severity: [],
                        platform: [],
                        category: [],
                        violationType: [],
                        assignedTo: [],
                        priority: [],
                        tags: [],
                        dateRange: {}
                      })}
                    >
                      Clear All Filters
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Violation Detail View Component
function ViolationDetailView({ 
  violation, 
  onStatusChange 
}: { 
  violation: ViolationRecord; 
  onStatusChange: (id: string, status: ViolationRecord['complianceStatus']) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Product Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product Name:</span>
                <span className="font-medium">{violation.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Brand:</span>
                <span className="font-medium">{violation.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{violation.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform:</span>
                <Badge variant="outline">{violation.platform}</Badge>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Compliance Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current Status:</span>
                <Badge className={
                  violation.complianceStatus === 'violation' ? 'bg-destructive/10 text-destructive border-destructive/30' :
                  violation.complianceStatus === 'resolved' ? 'bg-success/10 text-success border-success/30' :
                  'bg-warning/10 text-warning border-warning/30'
                }>
                  {violation.complianceStatus}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Severity:</span>
                <Badge className={
                  violation.severity === 'critical' ? 'bg-red-500 text-white' :
                  violation.severity === 'high' ? 'bg-destructive text-destructive-foreground' :
                  violation.severity === 'medium' ? 'bg-warning text-warning-foreground' :
                  'bg-muted text-muted-foreground'
                }>
                  {violation.severity}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Confidence:</span>
                <span className="font-medium">{Math.round(violation.confidenceScore * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Field Violations */}
      <div>
        <h3 className="font-semibold mb-3">Field Violations</h3>
        <div className="grid gap-3">
          {violation.fieldViolations.map((fieldViolation, idx) => (
            <div key={idx} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize">{fieldViolation.field.replace('_', ' ')}</span>
                <Badge className={
                  fieldViolation.severity === 'critical' ? 'bg-red-500 text-white' :
                  fieldViolation.severity === 'major' ? 'bg-destructive text-destructive-foreground' :
                  'bg-warning text-warning-foreground'
                }>
                  {fieldViolation.severity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{fieldViolation.issue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action History */}
      <div>
        <h3 className="font-semibold mb-3">Action History</h3>
        <ScrollArea className="h-32">
          <div className="space-y-2">
            {violation.actionHistory.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-2 text-sm border-b border-border/30">
                <span>{action.details}</span>
                <span className="text-muted-foreground text-xs">
                  {action.performedAt.toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Status Actions */}
      <div className="flex gap-2 pt-4 border-t">
        <Button 
          onClick={() => onStatusChange(violation.id, 'resolved')}
          className="bg-success text-success-foreground hover:bg-success/90"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark Resolved
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStatusChange(violation.id, 'pending')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Mark Pending
        </Button>
        <Button 
          variant="outline"
          onClick={() => onStatusChange(violation.id, 'dismissed')}
        >
          <Pause className="h-4 w-4 mr-2" />
          Dismiss
        </Button>
      </div>
    </div>
  );
}

export default Violations;