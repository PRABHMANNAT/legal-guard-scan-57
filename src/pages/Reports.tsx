import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar,
  Building,
  BarChart3,
  Filter,
  Plus,
  Eye,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const Reports = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    dateRange: '',
    department: '',
    reportType: '',
    status: ''
  });

  const preDefinedTemplates = [
    {
      id: 1,
      title: 'Monthly Compliance Report',
      description: 'Comprehensive monthly compliance analysis',
      category: 'compliance',
      lastUsed: '2 days ago',
      downloads: 45
    },
    {
      id: 2,
      title: 'Annual Expenditure Summary',
      description: 'Yearly financial compliance expenditure',
      category: 'financial',
      lastUsed: '1 week ago',
      downloads: 23
    },
    {
      id: 3,
      title: 'Public Feedback Analysis',
      description: 'Consumer complaints and feedback report',
      category: 'feedback',
      lastUsed: '3 days ago',
      downloads: 67
    },
    {
      id: 4,
      title: 'Platform Violation Summary',
      description: 'E-commerce platform specific violations',
      category: 'violations',
      lastUsed: '5 hours ago',
      downloads: 89
    }
  ];

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'compliance': { color: 'bg-primary/10 text-primary border-primary/20', label: 'Compliance' },
      'financial': { color: 'bg-success/10 text-success border-success/20', label: 'Financial' },
      'feedback': { color: 'bg-warning/10 text-warning border-warning/20', label: 'Feedback' },
      'violations': { color: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Violations' }
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig['compliance'];
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handleGenerateReport = () => {
    // Simulate report generation
    console.log('Generating report with filters:', selectedFilters);
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
              <FileText className="h-8 w-8 mr-3" />
              Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate and download compliance reports and analytics
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              View History
            </Button>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Custom Report Builder */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Custom Report Builder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date Range */}
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select onValueChange={(value) => setSelectedFilters({...selectedFilters, dateRange: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">Last 7 days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 days</SelectItem>
                      <SelectItem value="last-3-months">Last 3 months</SelectItem>
                      <SelectItem value="last-6-months">Last 6 months</SelectItem>
                      <SelectItem value="last-year">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Department */}
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select onValueChange={(value) => setSelectedFilters({...selectedFilters, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="all">All Departments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Report Type */}
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select onValueChange={(value) => setSelectedFilters({...selectedFilters, reportType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliance-summary">Compliance Summary</SelectItem>
                      <SelectItem value="violation-analysis">Violation Analysis</SelectItem>
                      <SelectItem value="platform-comparison">Platform Comparison</SelectItem>
                      <SelectItem value="trend-analysis">Trend Analysis</SelectItem>
                      <SelectItem value="detailed-audit">Detailed Audit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status Filter</Label>
                  <Select onValueChange={(value) => setSelectedFilters({...selectedFilters, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="compliant">Compliant</SelectItem>
                      <SelectItem value="violation">Violations</SelectItem>
                      <SelectItem value="under-review">Under Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Filters */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Additional Filters</Label>
                  
                  <div className="space-y-3">
                    <Input
                      placeholder="Keyword search terms..."
                      className="placeholder:text-muted-foreground"
                    />
                    <Input
                      placeholder="Brand or product filters..."
                      className="placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-4"
                >
                  <Button 
                    onClick={handleGenerateReport}
                    className="w-full bg-gradient-primary hover:bg-primary-dark"
                    size="lg"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Custom Report
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pre-defined Templates */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Pre-defined Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {preDefinedTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-4 border rounded-lg hover:bg-muted/30 transition-smooth group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold group-hover:text-primary transition-colors">
                            {template.title}
                          </h3>
                          {getCategoryBadge(template.category)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{template.lastUsed}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>{template.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          Use Template
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}

                {/* Quick Actions */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full text-xs">
                        <Download className="h-3 w-3 mr-2" />
                        Export All
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" className="w-full text-xs">
                        <Plus className="h-3 w-3 mr-2" />
                        Create Template
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Reports</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    name: 'Q1 Compliance Summary', 
                    type: 'Quarterly Report', 
                    generated: '2 hours ago', 
                    size: '2.4 MB',
                    status: 'completed' 
                  },
                  { 
                    name: 'Platform Violations March', 
                    type: 'Violation Analysis', 
                    generated: '1 day ago', 
                    size: '1.8 MB',
                    status: 'completed' 
                  },
                  { 
                    name: 'Consumer Feedback Report', 
                    type: 'Feedback Analysis', 
                    generated: '3 days ago', 
                    size: '3.2 MB',
                    status: 'completed' 
                  },
                  { 
                    name: 'Annual Compliance Audit', 
                    type: 'Annual Report', 
                    generated: '5 days ago', 
                    size: '5.7 MB',
                    status: 'processing' 
                  }
                ].map((report, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-smooth"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{report.type}</span>
                          <span>•</span>
                          <span>{report.generated}</span>
                          <span>•</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={report.status === 'completed' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-warning/10 text-warning'
                        }
                      >
                        {report.status}
                      </Badge>
                      {report.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
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

export default Reports;