import React from 'react';
import { motion } from 'framer-motion';
import EvervaultCardDemo from '@/components/evervault-card-demo';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EvervaultDemo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="absolute top-8 left-8 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-display font-bold gradient-text mb-4">
            EvervaultCard Demo
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Interactive card component with encrypted text reveal effect on hover.
            Built with Framer Motion and modern React patterns.
          </p>
        </motion.div>

        {/* Demo Section */}
        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EvervaultCardDemo />
        </motion.div>

        {/* Feature List */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {[
            {
              title: "Hover Animation",
              description: "Reveals encrypted text pattern on mouse movement"
            },
            {
              title: "Gradient Effects",
              description: "Beautiful primary-to-accent gradient with blur effects"
            },
            {
              title: "TypeScript Ready",
              description: "Fully typed components with proper prop interfaces"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default EvervaultDemo;