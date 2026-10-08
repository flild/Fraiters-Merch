'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Произошла непредвиденная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-card border border-border/80 p-8 rounded-2xl shadow-xl shadow-red-950/10"
      >
        <div>
          <div className="mx-auto h-12 w-12 bg-primary/20 text-primary-500 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-center text-2xl font-extrabold text-white font-mono uppercase tracking-tight">
            Вход в админку
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Эта зона только для администраторов магазина
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-background border border-border placeholder-muted-foreground text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-colors"
                placeholder="Введите пароль..."
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg"
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 text-white/50 animate-spin" />
                ) : (
                  <Lock className="h-5 w-5 text-white/50 group-hover:text-white/70 transition-colors" aria-hidden="true" />
                )}
              </span>
              {isLoading ? 'Проверка...' : 'Войти'}
              {!isLoading && (
                <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                  <ArrowRight className="h-5 w-5 text-white/50 group-hover:text-white/70 group-hover:translate-x-1 transition-all" aria-hidden="true" />
                </span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
