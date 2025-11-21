import React, { useState, useMemo } from 'react';
import { ClothingItem, Category } from '../types';
import { Card, Button } from './UI';

interface MatcherProps {
  items: ClothingItem[];
}

const Matcher: React.FC<MatcherProps> = ({ items }) => {
  // Split items into tops and bottoms for the "Mix & Match" UI
  const tops = useMemo(() => items.filter(i => i.category === Category.TOP || i.category === Category.OUTERWEAR), [items]);
  const bottoms = useMemo(() => items.filter(i => i.category === Category.BOTTOM), [items]);

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  const nextTop = () => setTopIndex(prev => (prev + 1) % tops.length);
  const prevTop = () => setTopIndex(prev => (prev - 1 + tops.length) % tops.length);
  
  const nextBottom = () => setBottomIndex(prev => (prev + 1) % bottoms.length);
  const prevBottom = () => setBottomIndex(prev => (prev - 1 + bottoms.length) % bottoms.length);

  const handleRandomize = () => {
    if (tops.length) setTopIndex(Math.floor(Math.random() * tops.length));
    if (bottoms.length) setBottomIndex(Math.floor(Math.random() * bottoms.length));
  };

  if (tops.length === 0 || bottoms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-8 text-center">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <h3 className="text-lg font-bold text-slate-700">Мало вещей</h3>
        <p className="text-slate-500 text-sm mt-2">Вам нужно как минимум один "Верх" и один "Низ" для использования этой функции.</p>
      </div>
    );
  }

  const currentTop = tops[topIndex];
  const currentBottom = bottoms[bottomIndex];

  return (
    <div className="pb-24 h-full flex flex-col">
      <header className="p-4 text-center">
        <h1 className="text-xl font-bold text-slate-800">Конструктор Образов</h1>
      </header>

      <div className="flex-1 flex flex-col px-4 gap-2 max-w-md mx-auto w-full">
        {/* Top Card */}
        <Card className="flex-1 relative group touch-pan-y">
          <div className="absolute inset-0 bg-slate-50">
            <img src={currentTop.imageUrl} alt="top" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={prevTop} className="bg-white/80 p-2 rounded-full shadow text-slate-700 hover:bg-white">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={nextTop} className="bg-white/80 p-2 rounded-full shadow text-slate-700 hover:bg-white">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
            <p className="text-white font-medium text-sm shadow-sm">{currentTop.description}</p>
          </div>
        </Card>

        {/* Bottom Card */}
        <Card className="flex-1 relative group touch-pan-y">
          <div className="absolute inset-0 bg-slate-50">
            <img src={currentBottom.imageUrl} alt="bottom" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={prevBottom} className="bg-white/80 p-2 rounded-full shadow text-slate-700 hover:bg-white">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            <button onClick={nextBottom} className="bg-white/80 p-2 rounded-full shadow text-slate-700 hover:bg-white">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
           <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
            <p className="text-white font-medium text-sm shadow-sm">{currentBottom.description}</p>
          </div>
        </Card>
      </div>

      <div className="p-4 flex gap-4 justify-center max-w-md mx-auto w-full">
        <Button variant="outline" onClick={handleRandomize} className="rounded-full w-12 h-12 flex items-center justify-center p-0 border-slate-300">
           <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
        </Button>
        <Button className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-200 shadow-xl flex items-center justify-center gap-2">
           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
           Сохранить
        </Button>
      </div>
    </div>
  );
};

export default Matcher;