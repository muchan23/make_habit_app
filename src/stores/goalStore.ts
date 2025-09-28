import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Goal } from '@/types';
import { goalAPI } from '@/lib/api';

interface GoalStore {
  goals: Goal[];
  selectedGoal: Goal | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  selectGoal: (goal: Goal | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API連携
  fetchGoals: () => Promise<void>;
  createGoal: (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGoalAPI: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoalAPI: (id: string) => Promise<void>;
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
          user_id: '', // 一時的な値、実際のAPI呼び出しでは不要
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

      // API連携メソッド
      fetchGoals: async () => {
        const state = get();
        if (state.isLoading || state.goals.length > 0) return; // 既にローディング中またはデータが存在する場合は何もしない
        
        try {
          set({ isLoading: true, error: null });
          console.log('Fetching goals...');
          const goals = await goalAPI.getGoals();
          console.log('Goals fetched successfully:', goals);
          set({ goals });
        } catch (error) {
          console.error('Error fetching goals:', error);
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      createGoal: async (goalData) => {
        try {
          set({ isLoading: true, error: null });
          const newGoal = await goalAPI.createGoal(goalData);
          set((state) => ({ goals: [...state.goals, newGoal] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateGoalAPI: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedGoal = await goalAPI.updateGoal(id, updates);
          set((state) => ({
            goals: state.goals.map((goal) =>
              goal.id === id ? updatedGoal : goal
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteGoalAPI: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await goalAPI.deleteGoal(id);
          set((state) => ({
            goals: state.goals.filter((goal) => goal.id !== id),
            selectedGoal: state.selectedGoal?.id === id ? null : state.selectedGoal,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'goal-storage',
      partialize: (state) => ({ goals: state.goals, selectedGoal: state.selectedGoal }),
    }
  )
);