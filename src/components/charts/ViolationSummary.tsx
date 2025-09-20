import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Shield, AlertCircle, FileText, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ViolationItem {
  id: string;
  title: string;
  description: string;
  count: number;
  severity: 'critical' | 'major' | 'minor';
  category: string;
  trend: 'up' | 'down' | 'stable';
}

interface ViolationSummaryProps {
  violations: ViolationItem[];
  className?: string;
}

const ViolationSummary = ({ violations, className }: ViolationSummaryProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return AlertTriangle;
      case 'major':
        return AlertCircle;
      case 'minor':
        return Clock;
      default:
        return Shield;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'major':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'minor':
        return 'text-info bg-info/10 border-info/20';
      default:
        return 'text-success bg-success/10 border-success/20';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'major':
        return 'default'; // Will be styled as warning
      case 'minor':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Violation Summary</h3>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="space-y-3">
        {violations.map((violation, index) => {
          const Icon = getSeverityIcon(violation.severity);
          
          return (
            <motion.div
              key={violation.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`
                glass-morphism border transition-all duration-200 hover:shadow-md
                ${getSeverityColor(violation.severity)}
              `}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {/* Severity Icon */}
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        ${getSeverityColor(violation.severity)}
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground truncate">
                            {violation.title}
                          </h4>
                          <Badge 
                            variant={getSeverityBadge(violation.severity) as any}
                            className="text-xs"
                          >
                            {violation.severity}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {violation.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="font-medium">
                            {violation.count} incidents
                          </span>
                          <span>•</span>
                          <span>{violation.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {violations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Shield className="w-12 h-12 text-success mx-auto mb-4" />
          <h4 className="font-medium text-foreground mb-2">All Clear!</h4>
          <p className="text-sm text-muted-foreground">
            No violations found in the current filter scope.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ViolationSummary;