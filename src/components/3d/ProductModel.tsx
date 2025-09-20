import React from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Zap } from 'lucide-react';

const ProductModel = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main 3D Product Sphere */}
      <motion.div
        className="relative w-80 h-80 floating-3d"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Core Sphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-90 shadow-floating"></div>
        
        {/* Glassmorphic Layer */}
        <div className="absolute inset-4 rounded-full glass-morphism"></div>
        
        {/* Inner Core */}
        <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/20 to-transparent border border-white/30"></div>
        
        {/* Floating Icons */}
        <motion.div
          className="absolute top-12 -right-4 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 flex items-center justify-center"
          animate={{ 
            y: [-5, 5, -5],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Search className="w-6 h-6 text-white" />
        </motion.div>
        
        <motion.div
          className="absolute bottom-8 -left-6 w-14 h-14 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 flex items-center justify-center"
          animate={{ 
            y: [5, -5, 5],
            rotate: [0, -5, 5, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Shield className="w-7 h-7 text-white" />
        </motion.div>
        
        <motion.div
          className="absolute top-1/2 -right-8 w-10 h-10 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 flex items-center justify-center"
          animate={{ 
            y: [-3, 3, -3],
            x: [-2, 2, -2],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 3.5, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <Zap className="w-5 h-5 text-white" />
        </motion.div>
      </motion.div>

      {/* Ambient Light Rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-white/10"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      ></motion.div>
      
      <motion.div
        className="absolute inset-8 rounded-full border border-white/5"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.05, 0.2]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      ></motion.div>

      {/* Scanning Effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        animate={{ 
          scale: [0.8, 1.3],
          opacity: [0.8, 0]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeOut"
        }}
      ></motion.div>
    </div>
  );
};

export default ProductModel;