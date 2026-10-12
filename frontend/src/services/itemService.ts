import apiClient from "./api";
import {
  MenuItem,
  MenuCategory,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  ItemsResponse,
  SingleItemResponse,
  CategoriesResponse,
} from "@/interfaces/item.interface";

export const itemService = {
  async getAllItems(params?: {
    category?: string;
    search?: string;
  }): Promise<MenuItem[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "all") {
      query.append("category", params.category);
    }
    if (params?.search && params.search.trim()) {
      query.append("search", params.search.trim());
    }

    const qs = query.toString();
    const endpoint = `/items${qs ? `?${qs}` : ""}`;
    const res = await apiClient.get<ItemsResponse>(endpoint);
    return res.data || [];
  },

  async getCategories(): Promise<MenuCategory[]> {
    const res = await apiClient.get<CategoriesResponse>("/items/categories");
    return res.data || [];
  },

  async getItemById(id: string): Promise<MenuItem> {
    const res = await apiClient.get<SingleItemResponse>(`/items/${id}`);
    return res.data;
  },

  async createMenuItem(data: CreateMenuItemDto): Promise<MenuItem> {
    const res = await apiClient.post<SingleItemResponse>("/items", data);
    return res.data;
  },

  async updateMenuItem(
    id: string,
    data: UpdateMenuItemDto
  ): Promise<MenuItem> {
    const res = await apiClient.put<SingleItemResponse>(`/items/${id}`, data);
    return res.data;
  },

  async deleteMenuItem(id: string): Promise<string> {
    const res = await apiClient.delete<{ success: boolean; id: string }>(
      `/items/${id}`
    );
    return res.id || id;
  },

  async resetMenuItems(): Promise<MenuItem[]> {
    const res = await apiClient.post<{
      success: boolean;
      message: string;
      data: MenuItem[];
    }>("/items/reset");
    return res.data || [];
  },
};

export default itemService;
