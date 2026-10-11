'use client';

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export default function ErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 5, -5, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card-alt p-6 rounded-full mb-8 relative border border-primary/20"
        >
          <AlertOctagon className="w-24 h-24 text-primary" strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          Что-то пошло не так
        </h1>
        <p className="text-muted-foreground text-lg max-w-[500px] mb-8">
          Произошла непредвиденная ошибка. Мы уже разбираемся с этим, а пока вы можете попробовать перезагрузить страницу.
        </p>

        <button
          onClick={() => reset()}
          className="btn-primary flex items-center gap-2 group px-6 py-3 text-lg"
        >
          <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" />
          Попробовать снова
        </button>
      </motion.div>
    </div>
  );
}
