import { apiFetch } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import { useCallback, useEffect, useState } from "react";

export type Garden = {
  id: number;
  user_id: string;
  generation: number;
  points: number;
  stage: number;
  image_url: string;
  is_active: boolean;
  completed_at?: string;
  created_at: string;
};

type State = {
  data: Garden[];
  isLoading: boolean;
  error: Error | null;
};

export function useGardenHistory() {
  const { user } = useAuth();
  const userId = user?.user_id;
  const [state, setState] = useState<State>({ data: [], isLoading: false, error: null });

  const fetchHistory = useCallback(async (id: string) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await apiFetch<Garden[]>(`/users/${id}/garden/history`);
      setState({ data, isLoading: false, error: null });
    } catch (e) {
      setState({ data: [], isLoading: false, error: e as Error });
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setState({ data: [], isLoading: false, error: null });
      return;
    }
    fetchHistory(userId);
  }, [userId, fetchHistory]);

  const refetch = useCallback(() => {
    if (userId) fetchHistory(userId);
  }, [userId, fetchHistory]);

  return { ...state, refetch };
}
