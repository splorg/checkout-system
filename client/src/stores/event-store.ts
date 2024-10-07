import { create } from "zustand";

interface EventState {
  currentEvent: string;
  setCurrentEvent: (event: string) => void;
}

export const useEventStore = create<EventState>()(
  (set) => ({
    currentEvent: "",
    setCurrentEvent: (event) => set({ currentEvent: event }),
  }),
)
