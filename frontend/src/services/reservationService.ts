import apiClient from "./api";
import {
  ReservationItem,
  CreateReservationDto,
  ReservationStats,
  ReservationsResponse,
  SingleReservationResponse,
  ReservationStatsResponse,
} from "@/interfaces/reservation.interface";

export const reservationService = {
  async createReservation(
    data: CreateReservationDto
  ): Promise<ReservationItem> {
    const res = await apiClient.post<SingleReservationResponse>(
      "/reservations",
      data
    );
    return res.data;
  },

  async lookupReservation(query: string): Promise<ReservationItem[]> {
    const isEmail = query.includes("@");
    const param = isEmail
      ? `email=${encodeURIComponent(query.trim())}`
      : `id=${encodeURIComponent(query.trim())}`;
    const res = await apiClient.get<ReservationsResponse>(
      `/reservations/lookup?${param}`
    );
    return res.data || [];
  },

  async getAllReservations(params?: {
    status?: string;
    search?: string;
    date?: string;
  }): Promise<ReservationItem[]> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== "All") {
      query.append("status", params.status);
    }
    if (params?.search && params.search.trim()) {
      query.append("search", params.search.trim());
    }
    if (params?.date && params.date.trim()) {
      query.append("date", params.date.trim());
    }

    const qs = query.toString();
    const endpoint = `/reservations${qs ? `?${qs}` : ""}`;
    const res = await apiClient.get<ReservationsResponse>(endpoint);
    return res.data || [];
  },

  async getReservationStats(): Promise<ReservationStats> {
    const res = await apiClient.get<ReservationStatsResponse>(
      "/reservations/stats"
    );
    return res.data;
  },

  async getReservationById(id: string): Promise<ReservationItem> {
    const res = await apiClient.get<SingleReservationResponse>(
      `/reservations/${id}`
    );
    return res.data;
  },

  async updateReservation(
    id: string,
    data: Partial<ReservationItem>
  ): Promise<ReservationItem> {
    const res = await apiClient.put<SingleReservationResponse>(
      `/reservations/${id}`,
      data
    );
    return res.data;
  },

  async deleteReservation(id: string): Promise<string> {
    const res = await apiClient.delete<{ success: boolean; id: string }>(
      `/reservations/${id}`
    );
    return res.id || id;
  },
};

export default reservationService;
