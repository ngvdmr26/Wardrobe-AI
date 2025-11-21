export enum Category {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  SHOES = 'SHOES',
  OUTERWEAR = 'OUTERWEAR',
  ACCESSORY = 'ACCESSORY'
}

export interface ClothingItem {
  id: string;
  imageUrl: string;
  category: Category;
  description: string;
  tags: string[];
  color: string;
  seasons: string[]; // e.g., 'summer', 'winter', 'all'
  createdAt: number;
}

export interface Outfit {
  id: string;
  items: ClothingItem[];
  createdAt: number;
  isFavorite: boolean;
}

export interface WeatherState {
  temperature: number;
  condition: string;
  location: string;
}

export interface AnalysisResult {
  category: Category;
  description: string;
  tags: string[];
  color: string;
  seasons: string[];
}
