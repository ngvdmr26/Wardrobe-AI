import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { ClothingItem, Category, WeatherState } from "../types";

// Initialize API Client
// Note: In a real production app, you might proxy this through a backend to protect the key,
// or require the user to input their own key for a pure client-side demo.
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Analyzes an image of clothing to extract metadata.
 */
export const analyzeClothingImage = async (base64Image: string): Promise<any> => {
  const ai = getAiClient();
  
  // Clean base64 string if it has data URI prefix
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, "");

  const prompt = `
    Проанализируй изображение одежды.
    Игнорируй фон.
    Классифицируй вещь в одну из категорий: TOP (Верх), BOTTOM (Низ), SHOES (Обувь), OUTERWEAR (Верхняя одежда), ACCESSORY (Аксессуары).
    
    Дай:
    1. Короткое описание на РУССКОМ языке (макс 10 слов).
    2. Список из 3-5 тегов на РУССКОМ (стиль, материал, повод).
    3. Основной цвет на РУССКОМ.
    4. Подходящие сезоны (summer, winter, spring, autumn, all).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { 
              type: Type.STRING, 
              enum: ["TOP", "BOTTOM", "SHOES", "OUTERWEAR", "ACCESSORY"] 
            },
            description: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            color: { type: Type.STRING },
            seasons: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
          },
          required: ["category", "description", "tags", "color", "seasons"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

/**
 * Suggests an outfit based on weather and available wardrobe.
 */
export const suggestOutfit = async (
  wardrobe: ClothingItem[], 
  weather: WeatherState
): Promise<{ recommendedItemsIds: string[], reasoning: string }> => {
  const ai = getAiClient();

  // Filter wardrobe to send only necessary data to save tokens
  const simplifiedWardrobe = wardrobe.map(item => ({
    id: item.id,
    category: item.category,
    description: item.description,
    color: item.color,
    seasons: item.seasons,
    tags: item.tags
  }));

  const prompt = `
    Контекст: Пользователь находится в городе: ${weather.location}. Погода: ${weather.temperature}°C, условия: ${weather.condition}.
    
    Задача: Выбери лучший наряд из гардероба пользователя.
    Правила:
    1. Выбери как минимум один TOP (Верх) и один BOTTOM (Низ) (если это не платье, которое обрабатывается логически).
    2. Если холодно (< 15°C), постарайся добавить OUTERWEAR (Верхнюю одежду).
    3. Выбери SHOES (Обувь), если есть.
    4. Верни ID выбранных вещей и короткое дружелюбное объяснение на РУССКОМ языке (почему этот выбор подходит под погоду).
    
    Wardrobe JSON:
    ${JSON.stringify(simplifiedWardrobe)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedItemsIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            reasoning: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    throw error;
  }
};