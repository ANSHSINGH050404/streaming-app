import { create } from 'zustand'
import axios from 'axios'
import { Event } from '@/components/Card'
import Cookies from 'js-cookie'

export const BACKEND_URL = "http://localhost:5000";

interface EventStore {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  setEvents: (events: Event[]) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  loading: false,
  error: null,
  setEvents: (events) => set({ events }),
  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${BACKEND_URL}/events`);
      set({ events: res.data, loading: false });
    } catch (err: any) {
      console.error(err);
      set({ 
        error: err.response?.data?.message || "Failed to fetch events", 
        loading: false 
      });
    }
  },
}));

interface AuthStore {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem("authToken") : null,
  setToken: (token) => {
    if (token) {
      localStorage.setItem("authToken", token);
      Cookies.set("authToken", token, { expires: 7 });
    } else {
      localStorage.removeItem("authToken");
      Cookies.remove("authToken");
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("authToken");
    Cookies.remove("authToken");
    set({ token: null });
  },
}));
