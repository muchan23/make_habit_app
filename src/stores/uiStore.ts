import { create } from 'zustand';

interface UIStore {
  // Modal states
  isAddGoalModalOpen: boolean;
  isEditGoalModalOpen: boolean;
  isAddRecordModalOpen: boolean;
  
  // Calendar view states
  calendarView: 'month' | 'week' | 'day';
  selectedDate: Date;
  
  // Loading states
  isGlobalLoading: boolean;
  
  // Actions
  openAddGoalModal: () => void;
  closeAddGoalModal: () => void;
  openEditGoalModal: () => void;
  closeEditGoalModal: () => void;
  openAddRecordModal: () => void;
  closeAddRecordModal: () => void;
  setCalendarView: (view: 'month' | 'week' | 'day') => void;
  setSelectedDate: (date: Date) => void;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial states
  isAddGoalModalOpen: false,
  isEditGoalModalOpen: false,
  isAddRecordModalOpen: false,
  calendarView: 'month',
  selectedDate: new Date(),
  isGlobalLoading: false,
  
  // Modal actions
  openAddGoalModal: () => set({ isAddGoalModalOpen: true }),
  closeAddGoalModal: () => set({ isAddGoalModalOpen: false }),
  openEditGoalModal: () => set({ isEditGoalModalOpen: true }),
  closeEditGoalModal: () => set({ isEditGoalModalOpen: false }),
  openAddRecordModal: () => set({ isAddRecordModalOpen: true }),
  closeAddRecordModal: () => set({ isAddRecordModalOpen: false }),
  
  // Calendar actions
  setCalendarView: (view) => set({ calendarView: view }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  // Loading actions
  setGlobalLoading: (loading) => set({ isGlobalLoading: loading }),
}));