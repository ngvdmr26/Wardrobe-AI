import React, { useMemo, useState } from 'react';
import { ClothingItem, Category } from '../types';
import { Card } from './UI';

interface WardrobeProps {
  items: ClothingItem[];
  onDeleteItem: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  'ALL': 'Все',
  'TOP': 'Верх',
  'BOTTOM': 'Низ',
  'SHOES': 'Обувь',
  'OUTERWEAR': 'Верхняя',
  'ACCESSORY': 'Аксессуары'
};

const Wardrobe: React.FC<WardrobeProps> = ({ items, onDeleteItem }) => {
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');

  const filteredItems = useMemo(() => {
    if (filter === 'ALL') return items;
    return items.filter(item => item.category === filter);
  }, [items, filter]);

  const categories = ['ALL', ...Object.values(Category)];

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b border-slate-100">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Мой Гардероб
        </h1>
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat as Category | 'ALL')}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === cat 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>
      </header>

      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <p>В этой категории пока пусто.</p>
            {filter === 'ALL' && <p className="text-xs mt-2">Нажмите кнопку +, чтобы добавить первую вещь!</p>}
          </div>
        ) : (
          filteredItems.map(item => (
            <Card key={item.id} className="relative group">
              <div className="aspect-square bg-slate-50 relative overflow-hidden">
                 {/* Simulated background removal by using object-cover and center focus */}
                <img 
                  src={item.imageUrl} 
                  alt={item.description} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                    className="self-end text-white bg-red-500/80 p-1.5 rounded-full hover:bg-red-600 mb-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-slate-800 text-sm truncate">{item.description}</h3>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Wardrobe;