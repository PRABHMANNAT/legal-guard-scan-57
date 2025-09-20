import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendData {
  date: string;
  score: number;
  scans: number;
  violations: number;
  category?: string;
}

interface ComplianceTrendsProps {
  data: TrendData[];
  title?: string;
  height?: number;
}

const ComplianceTrends = ({ 
  data, 
  title = "Compliance Trends by Category", 
  height = 300 
}: ComplianceTrendsProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['score', 'violations']);

  const exportChart = () => {
    // Export functionality would be implemented here
    console.log('Exporting chart...');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'score' ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-morphism">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={exportChart}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export PNG
        </Button>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="violationsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {selectedCategories.includes('score') && (
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                  name="Compliance Score"
                />
              )}
              
              {selectedCategories.includes('violations') && (
                <Area
                  type="monotone"
                  dataKey="violations"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#violationsGradient)"
                  name="Violations"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Legend with toggles */}
        <div className="flex items-center justify-center gap-4 mt-4">
          {[
            { key: 'score', label: 'Compliance Score', color: 'hsl(var(--primary))' },
            { key: 'violations', label: 'Violations', color: 'hsl(var(--destructive))' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setSelectedCategories(prev => 
                  prev.includes(item.key) 
                    ? prev.filter(c => c !== item.key)
                    : [...prev, item.key]
                );
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all ${
                selectedCategories.includes(item.key)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceTrends;