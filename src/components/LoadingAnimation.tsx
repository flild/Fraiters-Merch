'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Package } from 'lucide-react';

export default function LoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <Package className="w-16 h-16 text-primary" strokeWidth={1.5} />
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-2 bg-primary/20 blur-sm rounded-full"
        />
      </motion.div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mt-8 text-muted-foreground font-medium"
      >
        Собираем посылочку...
      </motion.p>
    </div>
  );
}
