export type ReservationStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface ReservationItem {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: string;
  status: ReservationStatus;
  notes?: string;
  totalEstimated?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReservationDto {
  customerName: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  totalEstimated?: number;
  tableNumber?: string;
  status?: ReservationStatus;
}

export interface RequestOtpResponse {
  success: boolean;
  message: string;
  email: string;
  expiresInSeconds?: number;
  devOtp?: string;
}

export interface VerifyOtpDto {
  email: string;
  otp: string;
}

export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  todayCount: number;
  todayGuests: number;
  totalEstimatedRevenue: number;
}

export interface ReservationsResponse {
  success: boolean;
  count?: number;
  data: ReservationItem[];
  message?: string;
}

export interface SingleReservationResponse {
  success: boolean;
  message?: string;
  data: ReservationItem;
}

export interface ReservationStatsResponse {
  success: boolean;
  data: ReservationStats;
  message?: string;
}
