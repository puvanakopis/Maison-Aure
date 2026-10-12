export type MenuCategoryType =
  | "appetizers"
  | "mains"
  | "seasonal"
  | "desserts"
  | "drinks";

export type MenuBadgeType = "Chef's Pick" | "Trending" | "Seasonal";

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategoryType;
  price: number;
  description: string;
  ingredients: string[];
  image: string;
  badge?: MenuBadgeType | "" | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
}

export const menuCategories: MenuCategory[] = [
  { id: "appetizers", label: "Appetizers" },
  { id: "mains", label: "Main Dishes" },
  { id: "seasonal", label: "Seasonal Delights" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Drinks" },
];



export interface CreateMenuItemDto {
  name: string;
  category: MenuCategoryType;
  price: number;
  description?: string;
  ingredients: string[] | string;
  image?: string;
  badge?: MenuBadgeType | "" | null;
}

export interface UpdateMenuItemDto extends Partial<CreateMenuItemDto> {}

export interface ItemsResponse {
  success: boolean;
  count: number;
  data: MenuItem[];
  message?: string;
}

export interface SingleItemResponse {
  success: boolean;
  data: MenuItem;
  message?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: MenuCategory[];
  message?: string;
}
