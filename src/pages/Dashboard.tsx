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
  Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductModel from '@/components/3d/ProductModel';

interface DashboardProps {
  userRole: 'consumer' | 'official' | 'admin';
}

const Dashboard = ({ userRole }: DashboardProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const heroVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.6
      }
    }
  };

  // Landing Page Metrics (SaaS Style)
  const metricsCards = [
    { 
      title: 'Total Violations', 
      value: '1,247', 
      change: '+5.2%', 
      trend: 'up',
      icon: AlertTriangle, 
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600'
    },
    { 
      title: 'Pending Reviews', 
      value: '89', 
      change: '-12.3%', 
      trend: 'down',
      icon: Clock, 
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-600'
    },
    { 
      title: 'Resolved Cases', 
      value: '2,156', 
      change: '+18.7%', 
      trend: 'up',
      icon: CheckCircle, 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600'
    },
    { 
      title: 'Active Investigations', 
      value: '34', 
      change: '+3.1%', 
      trend: 'up',
      icon: Search, 
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Loading Skeleton */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="h-16 w-96 bg-gradient-primary/20 animate-shimmer rounded-2xl mx-auto"></div>
              <div className="h-6 w-[600px] bg-muted/50 animate-shimmer rounded-xl mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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
      className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center py-20 relative"
          variants={heroVariants}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-hero opacity-5 rounded-3xl"></div>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-[800px] h-[400px] bg-gradient-primary opacity-10 blur-3xl rounded-full"></div>
          
          <div className="relative z-10">
            {/* Main Headline */}
            <motion.h1 
              className="text-6xl md:text-7xl font-display font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="gradient-text">Ensuring Accurate &</span>
              <br />
              <span className="text-foreground">Automated E-commerce</span>
              <br />
              <span className="gradient-text">Compliance</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              AssureX leverages AI to verify Legal Metrology compliance on product listings in real-time,
              ensuring your e-commerce platform meets all regulatory requirements.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-primary text-white px-8 py-4 text-lg font-semibold shadow-floating hover:shadow-glow transition-all duration-300 group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-4 text-lg font-semibold glass-morphism hover:bg-white/10 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                See Demo
              </Button>
            </motion.div>
          </div>
          
          {/* 3D Product Model */}
          <motion.div 
            className="relative z-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <ProductModel />
          </motion.div>
        </motion.div>

        {/* Metrics Cards Section */}
        <motion.div 
          className="py-16"
          variants={cardVariants}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-4">
              Real-Time Compliance Insights
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Monitor key compliance metrics across your entire product catalog
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metricsCards.map((metric, index) => (
              <motion.div
                key={metric.title}
                variants={cardVariants}
                className="group"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="glass-morphism border-white/10 metric-card-hover h-full relative overflow-hidden">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  
                  <CardContent className="p-8 relative z-10">
                    {/* Icon */}
                    <div className={`w-16 h-16 ${metric.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <metric.icon className={`h-8 w-8 ${metric.textColor}`} />
                    </div>
                    
                    {/* Value */}
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {metric.value}
                    </h3>
                    
                    {/* Title */}
                    <p className="text-muted-foreground font-medium mb-4">
                      {metric.title}
                    </p>
                    
                    {/* Change Indicator */}
                    <div className="flex items-center">
                      <div className={`flex items-center px-3 py-1 rounded-full ${
                        metric.trend === 'up' 
                          ? 'bg-green-500/10 text-green-600' 
                          : 'bg-red-500/10 text-red-600'
                      }`}>
                        {metric.trend === 'up' ? (
                          <TrendingUp className="w-4 h-4 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-semibold">{metric.change}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-2">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          className="py-16"
          variants={cardVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                <span className="gradient-text">AI-Powered</span> Compliance 
                <br />at Scale
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our advanced machine learning algorithms continuously scan and verify 
                product listings against Legal Metrology requirements, ensuring 100% 
                compliance across your entire catalog.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Real-time Scanning",
                    description: "Instant compliance verification for new product listings"
                  },
                  {
                    title: "Automated Reporting",
                    description: "Generate detailed compliance reports with a single click"
                  },
                  {
                    title: "Smart Alerts",
                    description: "Get notified immediately when violations are detected"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 * index }}
                  >
                    <div className="w-2 h-2 bg-gradient-primary rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="glass-morphism p-8 rounded-3xl">
                <div className="space-y-4">
                  {/* Compliance Score */}
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <span className="text-muted-foreground">Compliance Score</span>
                    <span className="text-2xl font-bold gradient-text">97.8%</span>
                  </div>
                  
                  {/* Processing Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <p className="text-2xl font-bold text-foreground">2.3s</p>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl text-center">
                      <p className="text-2xl font-bold text-foreground">99.9%</p>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;