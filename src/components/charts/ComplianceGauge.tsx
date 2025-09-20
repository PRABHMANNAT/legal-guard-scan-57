import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ComplianceGaugeProps {
  score: number;
  target?: number;
  change?: number;
  period?: string;
}

const ComplianceGauge = ({ score, target = 95, change = 0, period = "vs last month" }: ComplianceGaugeProps) => {
  const radius = 120;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const scoreOffset = circumference - (score / 100) * circumference;
  
  // Color based on score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-success to-success/80';
    if (score >= 70) return 'from-warning to-warning/80';
    return 'from-destructive to-destructive/80';
  };

  return (
    <div className="flex items-center justify-center relative">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="hsl(var(--muted))"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        
        {/* Score arc */}
        <motion.circle
          stroke={`url(#scoreGradient)`}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: scoreOffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        {/* Target indicator */}
        {target && (
          <circle
            fill="hsl(var(--primary))"
            r={6}
            cx={radius + Math.cos((target / 100) * 2 * Math.PI - Math.PI / 2) * normalizedRadius}
            cy={radius + Math.sin((target / 100) * 2 * Math.PI - Math.PI / 2) * normalizedRadius}
          />
        )}
        
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={`${getScoreGradient(score).split(' ')[0]} stop-opacity-100`} />
            <stop offset="100%" className={`${getScoreGradient(score).split(' ')[2]} stop-opacity-80`} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
            {score}%
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Compliance Score
          </div>
        </motion.div>
      </div>
      
      {/* Change indicator */}
      {change !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
        >
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
            change > 0 
              ? 'bg-success/10 text-success' 
              : 'bg-destructive/10 text-destructive'
          }`}>
            {change > 0 ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {Math.abs(change)}% {period}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ComplianceGauge;