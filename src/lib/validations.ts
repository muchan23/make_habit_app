import { z } from 'zod';

export const goalSchema = z.object({
  name: z.string().min(1, '目標名は必須です').max(100, '目標名は100文字以内で入力してください'),
  description: z.string().max(500, '説明は500文字以内で入力してください').optional(),
  color: z.string().default('green'),
});

export const recordSchema = z.object({
  goal_id: z.string().min(1, '目標を選択してください'),
  date: z.date(),
  status: z.enum(['COMPLETED', 'SKIPPED']),
  duration_minutes: z.number().min(0, '実行時間は0分以上で入力してください').max(1440, '実行時間は24時間以内で入力してください'),
  notes: z.string().max(1000, 'メモは1000文字以内で入力してください').optional(),
});

export const calendarEventSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(200, 'タイトルは200文字以内で入力してください'),
  description: z.string().max(1000, '説明は1000文字以内で入力してください').optional(),
  start_time: z.date(),
  end_time: z.date(),
  goal_id: z.string().optional(),
  is_recurring: z.boolean().default(false),
});

export type GoalInput = z.infer<typeof goalSchema>;
export type RecordInput = z.infer<typeof recordSchema>;
export type CalendarEventInput = z.infer<typeof calendarEventSchema>;