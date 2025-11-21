import React, { useState } from 'react';
import { ClothingItem, WeatherState } from '../types';
import { suggestOutfit } from '../services/gemini';
import { Button, Card, Loader } from './UI';

interface AssistantProps {
  items: ClothingItem[];
}

// Helper to interpret Open-Meteo codes
const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Ясно';
  if (code >= 1 && code <= 3) return 'Облачно';
  if (code >= 45 && code <= 48) return 'Туман';
  if (code >= 51 && code <= 55) return 'Морось';
  if (code >= 61 && code <= 67) return 'Дождь';
  if (code >= 71 && code <= 77) return 'Снег';
  if (code >= 80 && code <= 82) return 'Ливень';
  if (code >= 95) return 'Гроза';
  return 'Пасмурно';
};

const Assistant: React.FC<AssistantProps> = ({ items }) => {
  const [weather, setWeather] = useState<WeatherState>({
    location: 'Москва',
    temperature: 15,
    condition: 'Облачно'
  });

  const [recommendation, setRecommendation] = useState<{
    items: ClothingItem[];
    reasoning: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Геолокация не поддерживается вашим браузером");
      return;
    }
    
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Using Open-Meteo (Free, No Key required) for real weather data
          const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&wind_speed_unit=ms`
          );
          const data = await response.json();
          
          if (data && data.current) {
            setWeather({
              location: `Коорд: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
              temperature: Math.round(data.current.temperature_2m),
              condition: getWeatherDescription(data.current.weather_code)
            });
          }
        } catch (error) {
          console.error("Failed to fetch weather", error);
          alert("Не удалось получить данные о погоде. Проверьте соединение.");
        } finally {
          setGeoLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error", error);
        alert("Не удалось определить местоположение. Разрешите доступ к геопозиции.");
        setGeoLoading(false);
      }
    );
  };

  const getRecommendation = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const result = await suggestOutfit(items, weather);
      
      // Map IDs back to full objects
      const recItems = result.recommendedItemsIds
        .map(id => items.find(item => item.id === id))
        .filter((item): item is ClothingItem => !!item);

      setRecommendation({
        items: recItems,
        reasoning: result.reasoning
      });
    } catch (e) {
      console.error(e);
      alert("Не удалось получить рекомендацию. Проверьте API Key или наличие вещей.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-24 p-4 max-w-lg mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Ассистент</h1>
        <p className="text-slate-500">Умные рекомендации на сегодня.</p>
      </header>

      {/* Weather Configuration Card */}
      <Card className="p-5 mb-6 bg-gradient-to-br from-sky-500 to-blue-600 text-white border-none shadow-blue-200 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
             <div className="flex items-center gap-2 opacity-90 text-sm font-medium mb-1">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
               {weather.location}
             </div>
             <div className="text-5xl font-bold tracking-tighter">{weather.temperature}°</div>
             <div className="text-blue-100 font-medium mt-1">{weather.condition}</div>
          </div>
          <div className="flex flex-col gap-2">
             <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm self-end">
                {/* Simple Icon based on condition */}
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
             </div>
             <button 
               onClick={handleGeolocation} 
               disabled={geoLoading}
               className="bg-white/20 hover:bg-white/30 text-xs px-2 py-1 rounded backdrop-blur-sm transition flex items-center gap-1"
             >
               {geoLoading ? (
                 <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               ) : (
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>
               )}
               Найти меня
             </button>
          </div>
        </div>
        
        {/* Inputs to Simulate Weather if Geo fails or user wants to change */}
        <div className="bg-black/10 rounded-xl p-3 space-y-2 backdrop-blur-sm">
           <label className="text-xs uppercase tracking-wider opacity-70 font-bold">Настройки симуляции</label>
           <div className="flex gap-2">
             <input 
               type="text" 
               value={weather.location}
               onChange={(e) => setWeather({...weather, location: e.target.value})}
               className="w-1/2 bg-white/20 border-none rounded px-2 py-1 text-sm text-white placeholder-white/50 focus:ring-0"
               placeholder="Город"
             />
             <input 
               type="number" 
               value={weather.temperature}
               onChange={(e) => setWeather({...weather, temperature: Number(e.target.value)})}
               className="w-1/4 bg-white/20 border-none rounded px-2 py-1 text-sm text-white focus:ring-0"
             />
             <select 
                value={weather.condition}
                onChange={(e) => setWeather({...weather, condition: e.target.value})}
                className="w-1/2 bg-white/20 border-none rounded px-2 py-1 text-sm text-white focus:ring-0 [&>option]:text-black"
             >
               <option value="Ясно">Ясно</option>
               <option value="Облачно">Облачно</option>
               <option value="Дождь">Дождь</option>
               <option value="Снег">Снег</option>
               <option value="Ветрено">Ветрено</option>
             </select>
           </div>
        </div>
      </Card>

      <div className="mb-6">
        <Button onClick={getRecommendation} disabled={loading || items.length === 0} className="w-full py-3 text-lg shadow-xl">
          {loading ? 'AI думает...' : 'Спросить AI: «Что надеть?»'}
        </Button>
        {items.length === 0 && <p className="text-center text-xs text-red-400 mt-2">Сначала добавьте вещи в гардероб!</p>}
      </div>

      {loading && <Loader text="Анализируем погоду и стиль..." />}

      {!loading && recommendation && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <h3 className="font-bold text-indigo-900 mb-1 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Рекомендация AI
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                "{recommendation.reasoning}"
              </p>
           </div>

           <div className="grid grid-cols-2 gap-4">
             {recommendation.items.map((item) => (
               <Card key={item.id} className="group">
                 <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                   <img src={item.imageUrl} alt={item.description} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>
                 <div className="p-2 text-center">
                   <p className="text-xs font-bold text-slate-700 truncate">{item.description}</p>
                   <p className="text-[10px] text-slate-400 uppercase">{item.category}</p>
                 </div>
               </Card>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Assistant;