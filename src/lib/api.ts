// APIクライアント関数
import { Goal, Record as RecordType } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// 共通のAPI呼び出し関数
async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
            const error = await response.json();
            errorMessage = error.error || errorMessage;
        } catch {
            // JSON解析に失敗した場合はデフォルトメッセージを使用
        }
        throw new Error(errorMessage);
    }

    return response.json();
}

// 目標管理API
export const goalAPI = {
    // 目標一覧取得
    getGoals: async (): Promise<Goal[]> => {
        return apiCall<Goal[]>('/api/goals');
    },
    
    // 目標作成
    createGoal: async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Goal> => {
        return apiCall<Goal>('/api/goals', {
            method: 'POST',
            body: JSON.stringify(goal),
        });
    },

    // 目標取得
    getGoal: async (id: string): Promise<Goal> => {
        return apiCall<Goal>(`/api/goals/${id}`);
    },

    // 目標更新
    updateGoal: async (id: string, updates: Partial<Goal>): Promise<Goal> => {
        return apiCall<Goal>(`/api/goals/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    // 目標削除
    deleteGoal: async (id: string): Promise<void> => {
        return apiCall<void>(`/api/goals/${id}`, {
            method: 'DELETE',
        });
    },
};

// 記録管理API
export const recordAPI = {
    // 記録一覧取得
    getRecords: async (params: { goalId?: string, date?:string }): Promise<RecordType[]> => {
        const searchParams = new URLSearchParams();
        if (params?.goalId) searchParams.append('goal_id', params.goalId);
        if (params?.date) searchParams.append('date', params.date);

        const queryString = searchParams.toString();
        const endpoint = queryString ? `/api/records?${queryString}` : '/api/records';

        return apiCall<RecordType[]>(endpoint);
    },

    // 記録作成
    createRecord: async (record: Omit<RecordType, 'id' | 'created_at' | 'updated_at'>): Promise<RecordType> => {
        return apiCall<RecordType>('/api/records', {
        method: 'POST',
        body: JSON.stringify(record),
        });
    },

    // 記録更新
    updateRecord: async (id: string, updates: Partial<RecordType>): Promise<RecordType> => {
        return apiCall<RecordType>(`/api/records/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
        });
    },

    // 記録削除
    deleteRecord: async (id: string): Promise<void> => {
        return apiCall<void>(`/api/records/${id}`, {
        method: 'DELETE',
        });
    },
};

// 統計API
export const statsAPI = {
    // 統計概要取得
    getOverview: async (): Promise<{
      totalGoals: number;
      monthlyRecords: number;
      currentStreak: number;
    }> => {
      return apiCall('/api/stats/overview');
    },
  
    // パーセンタイル計算
    getPercentiles: async (goalId: string, period?: string): Promise<{
      p25: number;
      p50: number;
      p75: number;
      totalRecords: number;
    }> => {
      const searchParams = new URLSearchParams();
      searchParams.append('goal_id', goalId);
      if (period) searchParams.append('period', period);
      
      return apiCall(`/api/stats/percentiles?${searchParams.toString()}`);
    },
};