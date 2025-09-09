# 習慣化アプリ 要件定義書

## 1. プロジェクト概要

### 1.1 プロジェクト名
**HabitTracker** - GitHub風習慣化アプリ

### 1.2 プロジェクトの目的
GitHubのコミット履歴のような視覚的なフィードバックシステムを活用し、ユーザーの習慣形成を支援するアプリケーション。Googleカレンダー連携とAIエージェントによる行動提案機能を備える。

### 1.3 ターゲットユーザー
- 習慣化に取り組みたい個人
- 目標達成を可視化したいユーザー
- Googleカレンダーを日常的に使用しているユーザー
- AIによる行動提案を求めるユーザー

## 2. 機能要件

### 2.1 コア機能

#### 2.1.1 目標管理機能
- **目標の登録・編集・削除**
  - 目標名（例：英語学習、運動、読書など）
  - 目標の説明
  - 目標の有効/無効化

- **目標の実行記録**
  - 日付ごとの実行状況記録
  - 実行時間の記録（分単位）
  - メモ・感想の追加

#### 2.1.2 GitHub風ビジュアル表示
- **目標別カレンダー表示**
  - 各目標ごとにGitHubのコントリビューションカレンダーと同様の表示
  - 実行状況に応じた色分け（緑：達成、グレー：未達成）
  - **実行時間に応じた色の濃淡**（GitHubのコミット数と同じ仕組み）
    - **相対的評価システム**：ユーザーの過去の実行時間データに基づく相対的な色分け
    - レベル0（未実行）：グレー
    - レベル1（下位25%）：暗緑
    - レベル2（25-50%）：中暗緑
    - レベル3（50-75%）：中緑
    - レベル4（上位25%）：明るい緑
  - ホバー時の詳細情報表示（実行時間、メモなど）
  - 年単位での表示切り替え
  - 目標間の切り替え表示

- **統計・分析**
  - 連続実行日数の表示
  - 月間・年間の達成率
  - 目標別の成功率
  - 実行時間の統計（平均時間、総時間など）

#### 2.1.3 カレンダー機能
- **アプリ内カレンダー**
  - 目標実行予定の作成・編集・削除
  - 日付・時間・目標の設定
  - 繰り返し予定の設定
  - カレンダービューでの表示

- **Googleカレンダー連携**
  - Google Calendar API連携
  - カレンダーイベントの自動同期
  - **双方向連携**：アプリ内予定 ↔ Googleカレンダー

- **イベント分類システム**
  - **手動分類**：ユーザーがカレンダーイベントを目標に手動で分類
  - **分類ルール設定**：キーワードベースの自動分類ルール設定
  - **分類履歴管理**：過去の分類パターンの保存・管理
  - **拡張性設計**：将来的なAI自動分類への対応準備

#### 2.1.4 AIエージェント機能
- **行動提案システム**
  - 目標未達成時の自動通知
  - 個人の行動パターンに基づく提案
  - 時間帯別の最適な行動提案

- **パーソナライゼーション**
  - ユーザーの行動履歴分析
  - 成功率の高い時間帯の特定
  - カスタマイズされた提案メッセージ

### 2.2 サブ機能

#### 2.2.1 ユーザー管理
- ユーザー登録・ログイン
- プロフィール管理

#### 2.2.2 通知機能
- 目標実行リマインダー
- 目標達成通知
- AI提案通知

## 3. 非機能要件

### 3.1 パフォーマンス要件
- ページ読み込み時間: 3秒以内
- API応答時間: 1秒以内
- 同時接続ユーザー数: 10,000人
- データベースクエリ時間: 500ms以内

### 3.2 可用性要件
- システム稼働率: 99.9%以上
- メンテナンス時間: 月1回、2時間以内
- 障害復旧時間: 4時間以内

### 3.3 セキュリティ要件
- HTTPS通信の強制
- ユーザーデータの暗号化
- 認証トークンの適切な管理
- 個人情報保護法への準拠

### 3.4 互換性要件
- ブラウザ: Chrome, Firefox, Safari, Edge（最新版）
- モバイル: iOS 14+, Android 8+
- レスポンシブデザイン対応

## 4. 技術要件

### 4.1 フロントエンド
- **フレームワーク**: Next.js 14 (React 18)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: Zustand
- **UIコンポーネント**: Radix UI
- **チャート**: Chart.js / Recharts

### 4.2 バックエンド
- **フレームワーク**: Next.js API Routes
- **言語**: TypeScript
- **データベース**: PostgreSQL
- **ORM**: Prisma
- **認証**: NextAuth.js
- **ファイルストレージ**: AWS S3 / Cloudinary

### 4.3 AI・外部連携
- **AI API**: OpenAI GPT-4 / Anthropic Claude
- **カレンダーAPI**: Google Calendar API
- **通知**: Firebase Cloud Messaging

### 4.4 インフラ
- **ホスティング**: Vercel / AWS
- **CDN**: Cloudflare
- **監視**: Sentry
- **ログ**: LogRocket

## 5. データベース設計

### 5.1 主要テーブル

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Goals
```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, -- 例：英語学習、運動、読書
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### GoalRecords
```sql
CREATE TABLE goal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('completed', 'skipped')),
  duration_minutes INTEGER DEFAULT 0, -- 実行時間（分単位）
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(goal_id, date)
);
```

#### CalendarEvents
```sql
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id VARCHAR(255), -- GoogleカレンダーのイベントID（外部イベントの場合）
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL, -- 関連する目標
  event_type VARCHAR(50) DEFAULT 'internal', -- 'internal', 'external', 'synced'
  classification_method VARCHAR(50) DEFAULT 'manual', -- 'manual', 'rule', 'ai'
  classification_confidence DECIMAL(3,2), -- 分類の信頼度 (0.0-1.0)
  is_classified BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false, -- 繰り返し予定かどうか
  recurrence_rule JSONB, -- 繰り返しルール
  sync_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'synced', 'failed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### ClassificationRules
```sql
CREATE TABLE classification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  rule_name VARCHAR(255) NOT NULL,
  keywords TEXT[], -- キーワード配列
  time_patterns JSONB, -- 時間パターン
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### AIRecommendations
```sql
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50), -- 'reminder', 'suggestion', 'motivation'
  message TEXT NOT NULL,
  priority INTEGER DEFAULT 1,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 6. API設計

### 6.1 認証API
```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/session
POST /api/auth/register
```

### 6.2 目標管理API
```
GET /api/goals
POST /api/goals
GET /api/goals/[id]
PUT /api/goals/[id]
DELETE /api/goals/[id]
```

### 6.3 記録管理API
```
GET /api/records?goal_id=&date=
POST /api/records
PUT /api/records/[id]
DELETE /api/records/[id]
GET /api/records/calendar?year=&month=
GET /api/records/stats?goal_id=&period=
```

### 6.4 カレンダー管理API
```
GET /api/calendar/events
POST /api/calendar/events
GET /api/calendar/events/[id]
PUT /api/calendar/events/[id]
DELETE /api/calendar/events/[id]
GET /api/calendar/events/unclassified
```

### 6.5 カレンダー連携API
```
POST /api/calendar/sync
GET /api/calendar/sync/status
POST /api/calendar/sync/events/[id]
PUT /api/calendar/events/[id]/classify
GET /api/calendar/events/external
```

### 6.6 分類システムAPI
```
GET /api/classification/rules
POST /api/classification/rules
PUT /api/classification/rules/[id]
DELETE /api/classification/rules/[id]
POST /api/classification/classify
GET /api/classification/history
```

### 6.7 AI提案API
```
GET /api/ai/recommendations
POST /api/ai/generate-recommendation
PUT /api/ai/recommendations/[id]/read
```

### 6.8 統計API
```
GET /api/stats/overview
GET /api/stats/goals/[id]
GET /api/stats/streaks
GET /api/stats/calendar-data
GET /api/stats/duration?goal_id=&period=
GET /api/stats/percentiles?goal_id=&period=
```

## 7. UI/UX設計

### 7.1 デザイン原則
- GitHub風のミニマルなデザイン
- 直感的な操作性
- アクセシビリティの考慮
- モバイルファースト

### 7.2 主要画面構成

#### ダッシュボード
- 目標別のGitHub風コントリビューションカレンダー
- 今日の目標一覧
- 最近の統計サマリー
- AI提案の表示

#### 目標管理画面
- 目標一覧（グリッド表示）
- 目標の追加・編集フォーム
- 目標の詳細表示
- 目標の削除・アーカイブ

#### 統計・分析画面
- 目標別の成功率グラフ
- 連続実行日数の表示
- 月間・年間の達成率
- 成長トレンドの可視化
- 実行時間の統計（平均時間、総時間、時間分布）
- 相対的評価の基準値表示（パーセンタイル情報）

#### 設定画面
- プロフィール設定
- 通知設定
- Googleカレンダー連携設定
- 分類ルール設定
- データ管理

#### カレンダー画面
- 月間・週間・日間ビュー
- アプリ内予定の作成・編集・削除
- Googleカレンダーイベントの表示
- 予定と目標の関連付け

#### カレンダー分類画面
- 未分類イベント一覧
- イベントの手動分類
- 分類ルールの作成・編集
- 分類履歴の確認

### 7.3 カラーパレット
```css
:root {
  /* GitHub風の緑の濃淡（相対的評価システム） */
  --green-level-0: #ebedf0;    /* 未実行 */
  --green-level-1: #216e39;    /* 下位25%（暗緑） */
  --green-level-2: #30a14e;    /* 25-50%（中暗緑） */
  --green-level-3: #40c463;    /* 50-75%（中緑） */
  --green-level-4: #9be9a8;    /* 上位25%（明るい緑） */
  
  /* その他の色 */
  --primary-green: #28a745;
  --primary-green-hover: #218838;
  --secondary-gray: #6c757d;
  --light-gray: #f8f9fa;
  --dark-gray: #343a40;
  --success: #28a745;
  --warning: #ffc107;
  --danger: #dc3545;
  --info: #17a2b8;
}
```

## 8. 開発スケジュール

### Phase 1: 基盤構築 (4週間)
- [ ] プロジェクトセットアップ
- [ ] 認証システム（NextAuth.js）
- [ ] データベース設計・Prisma設定
- [ ] 基本的なCRUD操作
- [ ] 基本的なUIコンポーネント

### Phase 2: コア機能 (6週間)
- [ ] 目標管理機能
- [ ] 目標別GitHub風カレンダー表示
- [ ] 目標記録機能（実行時間記録含む）
- [ ] 相対的評価による色の濃淡システム
- [ ] 基本的な統計機能
- [ ] レスポンシブデザイン

### Phase 3: 連携機能 (4週間)
- [ ] アプリ内カレンダー機能
- [ ] Google Calendar連携
- [ ] 双方向同期システム
- [ ] 手動イベント分類システム
- [ ] 分類ルール設定機能
- [ ] 通知機能

### Phase 4: AI機能 (4週間)
- [ ] AIエージェント実装
- [ ] 行動提案システム
- [ ] パーソナライゼーション
- [ ] 推奨通知機能

### Phase 5: 最適化・リリース (2週間)
- [ ] パフォーマンス最適化
- [ ] セキュリティ監査
- [ ] テスト・デバッグ
- [ ] 本番リリース準備

## 9. リスク管理

### 9.1 技術リスク
- **外部API制限・変更**
  - 対策: 複数のAPIプロバイダーとの契約、フォールバック機能
- **スケーラビリティ問題**
  - 対策: 段階的なスケーリング、キャッシュ戦略
- **セキュリティ脆弱性**
  - 対策: 定期的なセキュリティ監査、ペネトレーションテスト

### 9.2 ビジネスリスク
- **競合他社の参入**
  - 対策: 差別化機能の強化、ユーザーエンゲージメント向上
- **ユーザー獲得の困難**
  - 対策: マーケティング戦略、ユーザーフィードバック収集
- **収益化の課題**
  - 対策: フリーミアムモデル、プレミアム機能の検討

## 10. 成功指標

### 10.1 KPI
- **月間アクティブユーザー数 (MAU)**
- **目標達成率**
- **ユーザー継続率 (30日、90日)**
- **機能利用率**
- **AI提案の受容率**

### 10.2 目標値
- **3ヶ月後**: 1,000 MAU、目標達成率 60%
- **6ヶ月後**: 5,000 MAU、目標達成率 70%
- **1年後**: 20,000 MAU、目標達成率 75%

### 10.3 測定方法
- Google Analytics 4
- カスタムイベント追跡
- ユーザーアンケート
- A/Bテスト

## 11. 今後の拡張計画

### 11.1 短期拡張 (6ヶ月以内)
- ソーシャル機能（友達との目標共有）
- 目標チャレンジ機能
- より詳細な分析機能

### 11.2 中期拡張 (1年以内)
- AI自動分類システム
- チーム・グループ機能
- 目標マーケットプレイス
- ウェアラブルデバイス連携

### 11.3 長期拡張 (1年以上)
- 企業向けソリューション
- ヘルスケア連携
- 国際展開

---

この要件定義書を基に、段階的に開発を進めていきます。何かご質問や修正点がございましたら、お気軽にお申し付けください。
