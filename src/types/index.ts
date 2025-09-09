export interface User {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Goal {
    id: string;
    name: string;
    description?: string;
    color: string;
    is_active: boolean;
    user_id: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface Record {
    id: string;
    goal_id: string;
    user_id: string;
    date: Date;
    status: 'COMPLETED' | 'SKIPPED';
    duration_minutes: number;
    notes?: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface CalendarEvent {
    id: string;
    user_id: string;
    event_id?: string;
    title: string;
    description?: string;
    start_time: Date;
    end_time: Date;
    goal_id?: string;
    event_type: 'INTERNAL' | 'EXTERNAL' | 'SYNCED';
    classification_method: string;
    classification_confidence?: number;
    is_classified: boolean;
    is_recurring: boolean;
    recurrence_rule?: any;
    sync_status: string;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface ClassificationRule {
    id: string;
    user_id: string;
    goal_id: string;
    rule_name: string;
    keywords: string[];
    time_patterns?: any;
    is_active: boolean;
    priority: number;
    created_at: Date;
    updated_at: Date;
  }
  
  export interface AIRecommendation {
    id: string;
    user_id: string;
    goal_id: string;
    recommendation_type: string;
    message: string;
    priority: number;
    is_read: boolean;
    created_at: Date;
  }
  
  // 相対的評価システム用の型
  export interface Percentiles {
    p25: number;
    p50: number;
    p75: number;
  }
  
  export interface ColorLevel {
    level: 0 | 1 | 2 | 3 | 4;
    description: string;
  }