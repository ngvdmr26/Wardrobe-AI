import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { analyzeClothingImage } from '../services/gemini';
import { ClothingItem, Category } from '../types';
import { Button, Card, Loader } from './UI';

interface AddItemProps {
  onAdd: (item: ClothingItem) => void;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  'TOP': 'Верх',
  'BOTTOM': 'Низ',
  'SHOES': 'Обувь',
  'OUTERWEAR': 'Верхняя одежда',
  'ACCESSORY': 'Аксессуары'
};

const AddItem: React.FC<AddItemProps> = ({ onAdd, onClose }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Partial<ClothingItem> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null); // Reset previous analysis
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeClothingImage(image);
      setAnalysis(result);
    } catch (error) {
      alert("Не удалось проанализировать изображение. Попробуйте еще раз.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (image && analysis) {
      const newItem: ClothingItem = {
        id: uuidv4(),
        imageUrl: image,
        category: analysis.category as Category || Category.TOP,
        description: analysis.description || "Новая вещь",
        tags: analysis.tags || [],
        color: analysis.color || "Неизвестно",
        seasons: analysis.seasons || ["all"],
        createdAt: Date.now()
      };
      onAdd(newItem);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <button onClick={onClose} className="text-slate-500 hover:text-slate-800">Отмена</button>
        <h2 className="font-bold text-lg">Добавить вещь</h2>
        <div className="w-12"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        {!image ? (
          <div className="w-full max-w-md aspect-[3/4] bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-white rounded-full shadow-sm text-primary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <p className="text-slate-500 font-medium text-center">Сделайте фото<br/>или загрузите из галереи</p>
            <Button onClick={() => fileInputRef.current?.click()}>
              Выбрать фото
            </Button>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="w-full max-w-md flex flex-col gap-6">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg group">
               <img src={image} alt="Preview" className="w-full h-full object-cover" />
               {/* Simulated scanner effect */}
               {isAnalyzing && (
                 <div className="absolute inset-0 bg-primary/10">
                   <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                 </div>
               )}
            </div>

            {isAnalyzing ? (
               <Loader text="AI определяет фасон, цвет и стиль..." />
            ) : !analysis ? (
              <Button onClick={handleAnalysis} className="w-full py-4 text-lg">
                ✨ Анализ AI
              </Button>
            ) : (
              <Card className="p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Результат</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500">Категория</label>
                    <div className="font-medium text-slate-800">
                      {CATEGORY_LABELS[analysis.category as string] || analysis.category}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Описание</label>
                    <div className="font-medium text-slate-800">{analysis.description}</div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {analysis.tags?.map(tag => (
                      <span key={tag} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md text-xs font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="w-4 h-4 rounded-full border border-slate-200 shadow-sm" style={{ backgroundColor: analysis.color?.toLowerCase() }}></span>
                     <span className="text-sm text-slate-600 capitalize">{analysis.color}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                   <Button variant="outline" onClick={() => setImage(null)} className="flex-1">Заново</Button>
                   <Button onClick={handleSave} className="flex-1">Сохранить</Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AddItem;