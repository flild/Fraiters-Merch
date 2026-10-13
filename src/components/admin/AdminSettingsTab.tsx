import React from 'react';
import { Download, Upload, RefreshCw } from 'lucide-react';

interface AdminSettingsTabProps {
  handleExportData: () => void;
  handleImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resetProducts: () => void;
}

export function AdminSettingsTab({
  handleExportData,
  handleImportData,
  resetProducts,
}: AdminSettingsTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Резервное копирование и управление данными</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Все изменения товаров, цен и заказов сохраняются в локальном хранилище вашего браузера (localStorage). Вы можете экспортировать базу в файл или сбросить всё до изначального состояния Fraiters.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-muted border border-border text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Скачать резервную копию (JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-muted border border-border text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Загрузить базу из JSON</span>
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('Сбросить весь каталог товаров к стандартным позициям?')) {
                resetProducts();
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-primary-950/60 border border-primary-900/60 text-xs font-semibold text-primary-400 rounded-lg transition-colors cursor-pointer ml-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Сбросить к исходным товарам</span>
          </button>
        </div>
      </div>
    </div>
  );
}
