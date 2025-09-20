import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Search,
  ArrowRight,
  Play,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Scan,
  MessageSquare,
  Shield,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ComplianceGauge from '@/components/charts/ComplianceGauge';
import ComplianceTrends from '@/components/charts/ComplianceTrends';
import KPICard from '@/components/ui/kpi-card';
import FilterBar from '@/components/ui/filter-bar';
import ViolationSummary from '@/components/charts/ViolationSummary';

interface DashboardProps {
  userRole: 'consumer' | 'official' | 'admin';
}

const Dashboard = ({ userRole }: DashboardProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Mock data following the specification
  const mockData = {
    filters: {
      from: "2025-08-01",
      to: "2025-09-20",
      marketplace: "All",
      category: "All",
      brand: "All",
      seller: "All",
      status: "All"
    },
    kpis: {
      score: 87,
      products: 12840,
      violations: {
        critical: 312,
        major: 1490,
        minor: 2890
      },
      complaints: {
        open: 214,
        breached: 19
      },
      duplicates: 856,
      attested_pct: 37
    },
    trends: [
      { date: "Aug 1", score: 81, scans: 120, violations: 18 },
      { date: "Aug 8", score: 83, scans: 145, violations: 22 },  
      { date: "Aug 15", score: 85, scans: 160, violations: 15 },
      { date: "Aug 22", score: 84, scans: 180, violations: 28 },
      { date: "Aug 29", score: 86, scans: 200, violations: 12 },
      { date: "Sep 5", score: 87, scans: 220, violations: 20 },
      { date: "Sep 12", score: 85, scans: 190, violations: 25 },
      { date: "Sep 19", score: 87, scans: 210, violations: 18 }
    ],
    violations: [
      {
        id: "1",
        title: "Late Filings",
        description: "Your Filings are past the deadline",
        count: 24,
        severity: "critical" as const,
        category: "Compliance",
        trend: "up" as const
      },
      {
        id: "2", 
        title: "Minor Safety Incidents",
        description: "Safety related regulations alerts",
        count: 12,
        severity: "minor" as const,
        category: "Safety",
        trend: "down" as const
      },
      {
        id: "3",
        title: "Data Breaches", 
        description: "Major unauthorized device breach",
        count: 8,
        severity: "critical" as const,
        category: "Security",
        trend: "up" as const
      },
      {
        id: "4",
        title: "Data Privacy",
        description: "Treatment states of purpose errors",
        count: 15,
        severity: "major" as const,
        category: "Privacy",
        trend: "stable" as const
      }
    ]
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-light via-background to-primary/5 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Loading Skeleton */}
          <div className="space-y-6">
            <div className="h-12 w-96 bg-gradient-primary/20 animate-shimmer rounded-xl"></div>
            <div className="h-16 bg-muted/50 animate-shimmer rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 bg-gradient-glass backdrop-blur-xl animate-shimmer rounded-2xl border border-white/10"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-surface-light via-background to-primary/5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Real-Time Compliance Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Monitor key compliance metrics across your product catalog
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm">
                <Scan className="w-4 h-4 mr-2" />
                Start Scan
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div variants={itemVariants} className="mb-8">
          <FilterBar />
        </motion.div>

        {/* Hero Section with Gauge and Quick Actions */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Compliance Gauge */}
            <div className="lg:col-span-1">
              <Card className="glass-morphism h-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">Real-Time Compliance Score</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ComplianceGauge 
                    score={mockData.kpis.score}
                    target={95}
                    change={2.5}
                    period="vs last month"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button size="lg" className="bg-gradient-primary text-white h-16 group">
                  <Scan className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-semibold">Start Scan</div>
                    <div className="text-xs opacity-90">Quick compliance check</div>
                  </div>
                </Button>
                <Button size="lg" variant="outline" className="h-16 group">
                  <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-semibold">File Complaint</div>
                    <div className="text-xs opacity-70">Report violations</div>
                  </div>
                </Button>
                <Button size="lg" variant="outline" className="h-16 group">
                  <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <div className="font-semibold">Export Report</div>
                    <div className="text-xs opacity-70">Download insights</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <KPICard
              title="Products Scanned"
              value={mockData.kpis.products}
              icon={Search}
              variant="default"
              change={{ value: 5.2, period: "vs last month", trend: "up" }}
            />
            <KPICard
              title="Critical Violations"
              value={mockData.kpis.violations.critical}
              icon={AlertTriangle}
              variant="destructive"
              change={{ value: -12.3, period: "vs last month", trend: "down" }}
            />
            <KPICard
              title="Open Complaints"
              value={mockData.kpis.complaints.open}
              icon={MessageSquare}
              variant="warning"
              change={{ value: 3.1, period: "vs last month", trend: "up" }}
            />
            <KPICard
              title="Duplicate Clusters"
              value={mockData.kpis.duplicates}
              icon={Activity}
              variant="info"
              change={{ value: -8.7, period: "vs last month", trend: "down" }}
            />
            <KPICard
              title="Verified Attestations"
              value={`${mockData.kpis.attested_pct}%`}
              icon={Shield}
              variant="success"
              change={{ value: 15.2, period: "vs last month", trend: "up" }}
            />
            <KPICard
              title="SLA Breaches"
              value={mockData.kpis.complaints.breached}
              icon={Clock}
              variant="destructive"
              change={{ value: -45.1, period: "vs last month", trend: "down" }}
            />
          </div>
        </motion.div>

        {/* Charts and Analysis Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Compliance Trends Chart */}
            <div className="lg:col-span-1">
              <ComplianceTrends 
                data={mockData.trends}
                title="Compliance Trends"
                height={350}
              />
            </div>

            {/* Violation Summary */}
            <div className="lg:col-span-1">
              <Card className="glass-morphism h-full">
                <CardContent className="p-6">
                  <ViolationSummary violations={mockData.violations} />
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity Table */}
        <motion.div variants={itemVariants}>
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Scan Activity</span>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    product: "Cetaphil Gentle Skin Cleanser 250mL",
                    seller: "HealthKart",
                    marketplace: "Amazon",
                    score: 65,
                    violations: 3,
                    lastScanned: "2 hours ago",
                    status: "warning"
                  },
                  {
                    product: "Nike Air Max 270 Running Shoes",
                    seller: "Nike Official",
                    marketplace: "Myntra",
                    score: 92,
                    violations: 0,
                    lastScanned: "4 hours ago", 
                    status: "compliant"
                  },
                  {
                    product: "Samsung Galaxy S24 Ultra 256GB",
                    seller: "Electronics Hub",
                    marketplace: "Flipkart",
                    score: 45,
                    violations: 8,
                    lastScanned: "6 hours ago",
                    status: "critical"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.product}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.seller} • {item.marketplace} • {item.lastScanned}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`text-sm font-semibold ${
                          item.score >= 80 ? 'text-success' : 
                          item.score >= 60 ? 'text-warning' : 'text-destructive'
                        }`}>
                          {item.score}% compliant
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.violations} violations
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;