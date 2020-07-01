export interface Recipe {
  id?: number;
  title: string;
  description: string;
  ingredients: string;
  content: string;
  preparationTime?: number;
  cookingTime?: number;
  utensils?: string;
  createdAt: string;
  illustration?: string;
  owner?: any;
  categories?: any;
}
