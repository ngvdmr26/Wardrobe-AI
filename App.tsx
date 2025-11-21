import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ClothingItem, Category } from './types';
import Wardrobe from './components/Wardrobe';
import AddItem from './components/AddItem';
import Matcher from './components/Matcher';
import Assistant from './components/Assistant';

enum View {
  WARDROBE = 'WARDROBE',
  MATCHER = 'MATCHER',
  ASSISTANT = 'ASSISTANT'
}

function App() {
  const [currentView, setCurrentView] = useState<View>(View.WARDROBE);
  // Start with empty wardrobe
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  // In a real app, we would persist to LocalStorage here
  useEffect(() => { 
    const saved = localStorage.getItem('wardrobe_ai_data'); 
    if(saved) {
      try {
        setItems(JSON.parse(saved)); 
      } catch (e) {
        console.error("Failed to load wardrobe", e);
      }
    }
  }, []);

  useEffect(() => { 
    localStorage.setItem('wardrobe_ai_data', JSON.stringify(items)); 
  }, [items]);

  const handleAddItem = (newItem: ClothingItem) => {
    setItems(prev => [newItem, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 relative flex flex-col max-w-md mx-auto shadow-2xl bg-white h-screen overflow-hidden">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        {currentView === View.WARDROBE && (
          <Wardrobe items={items} onDeleteItem={handleDeleteItem} />
        )}
        {currentView === View.MATCHER && (
          <Matcher items={items} />
        )}
        {currentView === View.ASSISTANT && (
          <Assistant items={items} />
        )}
      </main>

      {/* Floating Action Button (Add Item) - Only on Wardrobe View */}
      {currentView === View.WARDROBE && (
        <div className="absolute bottom-24 right-6 z-20">
          <button 
            onClick={() => setIsAddItemOpen(true)}
            className="w-14 h-14 bg-slate-900 rounded-full shadow-xl shadow-slate-900/30 flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </button>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddItemOpen && (
        <AddItem onAdd={handleAddItem} onClose={() => setIsAddItemOpen(false)} />
      )}

      {/* Bottom Navigation Bar */}
      <nav className="bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center z-30">
        <button 
          onClick={() => setCurrentView(View.WARDROBE)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === View.WARDROBE ? 'text-primary' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          <span className="text-[10px] font-medium">Гардероб</span>
        </button>

        <button 
          onClick={() => setCurrentView(View.MATCHER)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === View.MATCHER ? 'text-primary' : 'text-slate-400'}`}
        >
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
           <span className="text-[10px] font-medium">Подбор</span>
        </button>

        <button 
          onClick={() => setCurrentView(View.ASSISTANT)}
          className={`flex flex-col items-center gap-1 transition-colors ${currentView === View.ASSISTANT ? 'text-primary' : 'text-slate-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          <span className="text-[10px] font-medium">Ассистент</span>
        </button>
      </nav>
    </div>
  );
}

export default App;