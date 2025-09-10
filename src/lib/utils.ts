import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }
  
  return `${hours}時間${remainingMinutes}分`;
}

export function getColorLevelClass(level: 0 | 1 | 2 | 3 | 4): string {
  const colorClasses = {
    0: 'bg-gray-200', // 未実行
    1: 'bg-green-800', // 下位25%（暗緑）
    2: 'bg-green-600', // 25-50%（中暗緑）
    3: 'bg-green-500', // 50-75%（中緑）
    4: 'bg-green-300', // 上位25%（明るい緑）
  };
  
  return colorClasses[level];
}

export function getColorLevelDescription(level: 0 | 1 | 2 | 3 | 4): string {
  const descriptions = {
    0: '未実行',
    1: '下位25%',
    2: '25-50%',
    3: '50-75%',
    4: '上位25%',
  };
  
  return descriptions[level];
}