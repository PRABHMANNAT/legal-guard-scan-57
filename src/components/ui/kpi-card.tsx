import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
    trend: 'up' | 'down';
  };
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
  className?: string;
  isLoading?: boolean;
}

const variantStyles = {
  default: {
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
    color: 'from-primary to-primary/80'
  },
  success: {
    bgColor: 'bg-success/10',
    textColor: 'text-success',
    color: 'from-success to-success/80'
  },
  warning: {
    bgColor: 'bg-warning/10',
    textColor: 'text-warning',
    color: 'from-warning to-warning/80'
  },
  destructive: {
    bgColor: 'bg-destructive/10',
    textColor: 'text-destructive',
    color: 'from-destructive to-destructive/80'
  },
  info: {
    bgColor: 'bg-info/10',
    textColor: 'text-info',
    color: 'from-info to-info/80'
  }
};

const KPICard = ({
  title,
  value,
  change,
  icon: Icon,
  variant = 'default',
  className,
  isLoading = false
}: KPICardProps) => {
  const styles = variantStyles[variant];

  if (isLoading) {
    return (
      <Card className={cn("glass-morphism border-white/10 h-full", className)}>
        <CardContent className="p-6">
          <div className="space-y-4 animate-pulse">
            <div className={`w-16 h-16 ${styles.bgColor} rounded-2xl`}></div>
            <div className="h-8 bg-muted/20 rounded"></div>
            <div className="h-5 bg-muted/20 rounded w-3/4"></div>
            <div className="h-6 bg-muted/20 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Card className={cn(
        "glass-morphism border-white/10 metric-card-hover h-full relative overflow-hidden",
        className
      )}>
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${styles.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        <CardContent className="p-6 relative z-10">
          {/* Icon */}
          <motion.div 
            className={`w-16 h-16 ${styles.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Icon className={`h-8 w-8 ${styles.textColor}`} />
          </motion.div>
          
          {/* Value */}
          <motion.h3 
            className="text-3xl md:text-4xl font-bold text-foreground mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.h3>
          
          {/* Title */}
          <motion.p 
            className="text-muted-foreground font-medium mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.p>
          
          {/* Change Indicator */}
          {change && (
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className={`flex items-center px-3 py-1 rounded-full ${
                change.trend === 'up' 
                  ? 'bg-success/10 text-success' 
                  : 'bg-destructive/10 text-destructive'
              }`}>
                {change.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-semibold">
                  {change.value > 0 ? '+' : ''}{change.value}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {change.period}
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default KPICard;