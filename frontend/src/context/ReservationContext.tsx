"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  ReservationItem,
  CreateReservationDto,
  ReservationStats,
  ReservationStatus,
  RequestOtpResponse,
  VerifyOtpDto,
} from "@/interfaces/reservation.interface";
import { reservationService } from "@/services/reservationService";

interface ReservationContextType {
  reservations: ReservationItem[];
  stats: ReservationStats | null;
  isLoading: boolean;
  error: string | null;
  fetchReservations: (params?: {
    status?: string;
    search?: string;
    date?: string;
  }) => Promise<ReservationItem[]>;
  fetchStats: () => Promise<ReservationStats | null>;
  createReservation: (data: CreateReservationDto) => Promise<ReservationItem>;
  requestOtp: (data: CreateReservationDto) => Promise<RequestOtpResponse>;
  verifyOtp: (dto: VerifyOtpDto) => Promise<ReservationItem>;
  lookupReservation: (query: string) => Promise<ReservationItem[]>;
  updateReservation: (
    id: string,
    data: Partial<ReservationItem>
  ) => Promise<ReservationItem>;
  updateReservationStatus: (
    id: string,
    status: ReservationStatus
  ) => Promise<ReservationItem>;
  deleteReservation: (id: string) => Promise<void>;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [stats, setStats] = useState<ReservationStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const calculateLocalStats = (list: ReservationItem[]): ReservationStats => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: list.length,
      pending: list.filter((r) => r.status === "Pending").length,
      confirmed: list.filter((r) => r.status === "Confirmed").length,
      completed: list.filter((r) => r.status === "Completed").length,
      cancelled: list.filter((r) => r.status === "Cancelled").length,
      todayCount: list.filter((r) => r.date === today).length,
      todayGuests: list
        .filter((r) => r.date === today && r.status !== "Cancelled")
        .reduce((sum, r) => sum + (r.guests || 0), 0),
      totalEstimatedRevenue: list
        .filter((r) => r.status !== "Cancelled")
        .reduce((sum, r) => sum + (r.totalEstimated || 0), 0),
    };
  };

  const fetchReservations = useCallback(
    async (params?: { status?: string; search?: string; date?: string }): Promise<ReservationItem[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await reservationService.getAllReservations(params);
        const list = Array.isArray(data) ? data : [];
        setReservations(list);
        setStats(calculateLocalStats(list));
        return list;
      } catch (err: any) {
        console.warn("Could not fetch reservations from backend:", err?.message);
        setError(err?.message || "Failed to load reservations");
        setReservations([]);
        setStats(calculateLocalStats([]));
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchStats = useCallback(async (): Promise<ReservationStats | null> => {
    try {
      const liveStats = await reservationService.getReservationStats();
      if (liveStats) {
        setStats(liveStats);
        return liveStats;
      }
    } catch (err) {
      console.warn("Could not fetch live reservation stats, computing locally:", err);
    }
    setStats((prev) => prev || calculateLocalStats([]));
    return null;
  }, []);

  useEffect(() => {
    fetchReservations();
    fetchStats();
  }, []);

  const createReservation = useCallback(
    async (data: CreateReservationDto): Promise<ReservationItem> => {
      try {
        const created = await reservationService.createReservation(data);
        setReservations((prev) => {
          const next = [created, ...prev];
          setStats(calculateLocalStats(next));
          return next;
        });
        return created;
      } catch (err) {
        console.error("Backend error creating reservation, generating reference locally:", err);
        const tempId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
        const localItem: ReservationItem = {
          id: tempId,
          customerName: data.customerName,
          email: data.email,
          phone: data.phone,
          date: data.date,
          time: data.time,
          guests: data.guests,
          status: data.status || "Pending",
          notes: data.notes || "Online guest booking",
          totalEstimated: data.totalEstimated || data.guests * 85,
          createdAt: new Date().toISOString(),
        };
        setReservations((prev) => {
          const next = [localItem, ...prev];
          setStats(calculateLocalStats(next));
          return next;
        });
        return localItem;
      }
    },
    []
  );

  const requestOtp = useCallback(
    async (data: CreateReservationDto): Promise<RequestOtpResponse> => {
      return await reservationService.requestOtp(data);
    },
    []
  );

  const verifyOtp = useCallback(
    async (dto: VerifyOtpDto): Promise<ReservationItem> => {
      const created = await reservationService.verifyOtp(dto);
      setReservations((prev) => {
        const next = [created, ...prev];
        setStats(calculateLocalStats(next));
        return next;
      });
      return created;
    },
    []
  );

  const lookupReservation = useCallback(
    async (query: string): Promise<ReservationItem[]> => {
      try {
        const results = await reservationService.lookupReservation(query);
        if (results && results.length > 0) {
          return results;
        }
      } catch (err) {
        console.warn("Backend lookup unavailable, searching local store:", err);
      }

      // Fallback local lookup
      const q = query.trim().toLowerCase();
      return reservations.filter(
        (r) =>
          r.id.toLowerCase() === q ||
          r.email.toLowerCase() === q ||
          r.customerName.toLowerCase().includes(q)
      );
    },
    [reservations]
  );

  const updateReservation = useCallback(
    async (id: string, data: Partial<ReservationItem>): Promise<ReservationItem> => {
      try {
        const updated = await reservationService.updateReservation(id, data);
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
        );
        return updated;
      } catch (err) {
        console.error("API update reservation failed, updating locally:", err);
        let updatedLocal: ReservationItem | null = null;
        setReservations((prev) =>
          prev.map((r) => {
            if (r.id === id) {
              const res = { ...r, ...data };
              updatedLocal = res;
              return res;
            }
            return r;
          })
        );
        return updatedLocal!;
      }
    },
    []
  );

  const updateReservationStatus = useCallback(
    async (id: string, status: ReservationStatus): Promise<ReservationItem> => {
      return updateReservation(id, { status });
    },
    [updateReservation]
  );

  const deleteReservation = useCallback(
    async (id: string): Promise<void> => {
      try {
        await reservationService.deleteReservation(id);
      } catch (err) {
        console.error("API delete failed, removing locally:", err);
      } finally {
        setReservations((prev) => prev.filter((r) => r.id !== id));
      }
    },
    []
  );

  return (
    <ReservationContext.Provider
      value={{
        reservations,
        stats,
        isLoading,
        error,
        fetchReservations,
        fetchStats,
        createReservation,
        requestOtp,
        verifyOtp,
        lookupReservation,
        updateReservation,
        updateReservationStatus,
        deleteReservation,
      }}
    >
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservations() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservations must be used within a ReservationProvider");
  }
  return context;
}

export default ReservationContext;
