import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal } from '@/types';

interface GoalStore {
  goals: Goal[];
  selectedGoal: Goal | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  selectGoal: (goal: Goal | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: [],
      selectedGoal: null,
      isLoading: false,
      error: null,
      
      setGoals: (goals) => set({ goals }),
      
      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: `goal_${Date.now()}`,
          created_at: new Date(),
          updated_at: new Date(),
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },
      
      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates, updated_at: new Date() } : goal
          ),
        }));
      },
      
      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
          selectedGoal: state.selectedGoal?.id === id ? null : state.selectedGoal,
        }));
      },
      
      selectGoal: (goal) => set({ selectedGoal: goal }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
    }),
    {
      name: 'goal-storage',
      partialize: (state) => ({ goals: state.goals, selectedGoal: state.selectedGoal }),
    }
  )
);