'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Send, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { REVIEWS } from '@/lib/data';
import { Review } from '@/lib/types';

export default function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [handle, setHandle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('Акриловый стенд «Crimson Requiem»');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) return;

    const newRev: Review = {
      id: `rev-user-${Date.now()}`,
      author: authorName.trim(),
      handle: handle.trim() ? (handle.startsWith('@') ? handle : `@${handle}`) : undefined,
      date: 'Только что',
      rating: 5,
      text: reviewText.trim(),
      productName: selectedProduct,
      verified: true,
      avatarBg: 'bg-primary-800',
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmitted(true);
    setTimeout(() => {
      setShowAddForm(false);
      setSubmitted(false);
      setAuthorName('');
      setHandle('');
      setReviewText('');
    }, 1800);
  };

  return (
    <section id="reviews" className="py-16 md:py-24 border-b border-border/80 scroll-mt-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
              <span className="text-primary-500 font-semibold uppercase">Обратная связь</span>
              <span aria-hidden="true">·</span>
              <span>Реальные покупатели</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold">5.0</span> рейтинг
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Отзывы о мерче
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-1 max-w-xl">
              Фотографии, распаковки и впечатления подписчиков канала Fraiters.
              Читайте отзывы и делитесь своими покупками.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-card border border-border/80 hover:border-primary rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-primary-500" />
              <span>Оставить отзыв</span>
            </button>

            <a
              href="https://t.me/fraiters"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-xs font-semibold text-white bg-primary hover:bg-primary-500 rounded-lg transition-all shadow-md shadow-red-950 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Отзывы в Telegram</span>
            </a>
          </div>
        </div>

        {/* Add Review Inline Form */}
        {showAddForm && (
          <div className="mb-10 bg-card rounded-xl border border-primary-900/60 p-6 sm:p-8 animate-in fade-in">
            <h3 className="text-base font-bold text-white mb-1">
              Поделитесь впечатлениями о мерче
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Ваш отзыв сразу появится на сайте в прототипе!
            </p>

            {submitted ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded-lg text-sm flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Спасибо! Ваш отзыв успешно добавлен.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Ваше имя / ник *</label>
                    <input
                      type="text"
                      required
                      placeholder="Например, Катя"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Telegram ник (опционально)</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Купленный товар</label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="Акриловый стенд «Crimson Requiem»">Акриловый стенд «Crimson Requiem»</option>
                      <option value="Голографический брелок «Abyss Walker»">Голографический брелок «Abyss Walker»</option>
                      <option value="Диорама «Shadow Protocol»">Диорама «Shadow Protocol»</option>
                      <option value="Стикерпак А5 «Red Void Edition»">Стикерпак А5 «Red Void Edition»</option>
                      <option value="Худи оверсайз «Fraiters Vanguard»">Худи оверсайз «Fraiters Vanguard»</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5 font-medium">Текст отзыва *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Напишите пару слов о качестве печати, упаковке, скорости доставки..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-xs text-muted-foreground hover:text-white"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-500 rounded-lg transition-colors cursor-pointer"
                  >
                    Опубликовать отзыв
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-card rounded-xl border border-border p-6 flex flex-col justify-between hover:border-primary-950 hover:shadow-xl hover:shadow-red-950/20 transition-colors"
            >
              <div>
                {/* Author row */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${rev.avatarBg} text-white font-bold text-xs flex items-center justify-center font-mono border border-border`}>
                      {rev.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{rev.author}</span>
                        {rev.verified && (
                          <span title="Подтвержденная покупка">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {rev.handle || 'Покупатель'} · {rev.date}
                      </div>
                    </div>
                  </div>

                  {/* 5 Stars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-neutral-700 text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                  «{rev.text}»
                </p>
              </div>

              {/* Product purchased tag */}
              <div className="pt-3 border-t border-border/80 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Купленный товар:</span>
                <span className="text-primary-400 font-medium truncate max-w-[240px]">
                  {rev.productName}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
