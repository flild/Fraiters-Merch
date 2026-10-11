'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="bg-card-alt p-6 rounded-full mb-8 relative"
        >
          <ShoppingBag className="w-24 h-24 text-primary" strokeWidth={1.5} />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="absolute -bottom-2 -right-2 bg-background border-4 border-card-alt rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg text-primary"
          >
            404
          </motion.div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Упс! Страница не найдена
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-[500px] mb-8">
          Кажется, вы забрели в другую локацию. Этот мерч либо распродан, либо его никогда здесь и не было.
        </p>

        <Link
          href="/"
          className="btn-primary flex items-center gap-2 group px-6 py-3 text-lg"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Вернуться в каталог
        </Link>
      </motion.div>
    </div>
  );
}
