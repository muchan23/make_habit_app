# 開発ガイドライン

## 実装時のベストプラクティス

### 1. 要件定義書の参照
- **実装前**: 必ず `docs/requirements.md` を確認
- **機能要件**: 各機能の詳細仕様を理解
- **データベース設計**: テーブル構造とリレーションを確認
- **API設計**: エンドポイントとパラメータを確認

### 2. 実装の進め方

#### 各機能の実装手順
1. **要件定義書の確認**
2. **データベーススキーマの実装**
3. **APIエンドポイントの実装**
4. **フロントエンドコンポーネントの実装**
5. **テストの実装**

#### 相対的評価システムの実装
```typescript
// 実装例：相対的評価システム
const calculateColorLevel = (currentDuration: number, historicalData: number[]) => {
  if (currentDuration === 0) return 0; // 未実行
  
  const percentiles = calculatePercentiles(historicalData);
  
  if (currentDuration <= percentiles.p25) return 1; // 下位25%
  if (currentDuration <= percentiles.p50) return 2; // 25-50%
  if (currentDuration <= percentiles.p75) return 3; // 50-75%
  return 4; // 上位25%
};
```

### 3. データベース設計の遵守

#### テーブル構造の厳密な遵守
- 要件定義書のスキーマを変更しない
- 新しいフィールドが必要な場合は要件定義書を更新
- リレーションシップを適切に実装

#### 相対的評価システムの実装
```sql
-- 実行時間の統計を取得するクエリ
SELECT 
  goal_id,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY duration_minutes) as p25,
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY duration_minutes) as p50,
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY duration_minutes) as p75
FROM goal_records 
WHERE status = 'completed' 
  AND date >= ? 
GROUP BY goal_id;
```

### 4. UI/UX設計の実装

#### GitHub風デザインの実装
```css
/* 相対的評価による色の濃淡 */
:root {
  --green-level-0: #ebedf0;    /* 未実行 */
  --green-level-1: #216e39;    /* 下位25%（暗緑） */
  --green-level-2: #30a14e;    /* 25-50%（中暗緑） */
  --green-level-3: #40c463;    /* 50-75%（中緑） */
  --green-level-4: #9be9a8;    /* 上位25%（明るい緑） */
}
```

#### アクセシビリティの実装
- WAI-ARIA準拠の実装
- キーボードナビゲーションのサポート
- スクリーンリーダー対応

### 5. 状態管理の実装

#### Zustandストアの設計
```typescript
// 目標管理ストア
interface GoalStore {
  goals: Goal[];
  selectedGoal: Goal | null;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  selectGoal: (goal: Goal) => void;
}

// 記録管理ストア
interface RecordStore {
  records: Record[];
  addRecord: (record: Omit<Record, 'id'>) => void;
  updateRecord: (id: string, updates: Partial<Record>) => void;
  getRecordsByGoal: (goalId: string) => Record[];
  getStreak: (goalId: string) => number;
}
```

### 6. API設計の実装

#### RESTful APIの実装
```typescript
// 目標管理API
export const goalAPI = {
  // 目標一覧取得
  getGoals: async (): Promise<Goal[]> => {
    const response = await fetch('/api/goals');
    return response.json();
  },
  
  // 目標作成
  createGoal: async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
    const response = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal)
    });
    return response.json();
  }
};
```

### 7. エラーハンドリング

#### 適切なエラーハンドリングの実装
```typescript
// API呼び出し時のエラーハンドリング
const handleAPICall = async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
  try {
    return await apiCall();
  } catch (error) {
    console.error('API call failed:', error);
    // ユーザーにエラーメッセージを表示
    showErrorMessage('操作に失敗しました。もう一度お試しください。');
    return null;
  }
};
```

### 8. テストの実装

#### 単体テスト
```typescript
// 相対的評価システムのテスト
describe('calculateColorLevel', () => {
  it('should return correct color level for given duration', () => {
    const historicalData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    expect(calculateColorLevel(15, historicalData)).toBe(1); // 下位25%
    expect(calculateColorLevel(45, historicalData)).toBe(2); // 25-50%
    expect(calculateColorLevel(75, historicalData)).toBe(3); // 50-75%
    expect(calculateColorLevel(95, historicalData)).toBe(4); // 上位25%
  });
});
```

### 9. パフォーマンス最適化

#### データベースクエリの最適化
```typescript
// 効率的なクエリの実装
const getGoalRecords = async (goalId: string, startDate: Date, endDate: Date) => {
  return await prisma.goalRecord.findMany({
    where: {
      goalId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: { date: 'desc' },
    take: 100 // 適切な制限
  });
};
```

### 10. セキュリティの実装

#### 認証・認可の実装
```typescript
// APIルートでの認証チェック
export const withAuth = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    return handler(req, res);
  };
};
```

## 実装時のチェックリスト

### 各機能の実装前
- [ ] 要件定義書の該当箇所を確認
- [ ] データベーススキーマを確認
- [ ] API設計を確認
- [ ] UI/UX設計を確認

### 実装後
- [ ] 型安全性の確認
- [ ] エラーハンドリングの実装
- [ ] テストの実装
- [ ] アクセシビリティの確認
- [ ] パフォーマンスの確認

### コードレビュー
- [ ] 要件定義書との整合性
- [ ] コードの可読性
- [ ] エラーハンドリングの適切性
- [ ] セキュリティの確認
