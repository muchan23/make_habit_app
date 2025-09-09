# HabitTracker - GitHub風習慣化アプリ

GitHubのコミット履歴のような視覚的なフィードバックシステムを活用し、ユーザーの習慣形成を支援するアプリケーション。

## 📋 要件定義

詳細な要件定義は [docs/requirements.md](./docs/requirements.md) を参照してください。

## 🎯 主要機能

- **GitHub風ビジュアル表示**: 相対的評価システムによる色の濃淡
- **アプリ内カレンダー**: 目標実行予定の管理
- **Googleカレンダー連携**: 双方向同期システム
- **手動イベント分類**: 拡張性を考慮した分類システム
- **AIエージェント**: 行動提案システム

## 🛠 技術スタック

- **フロントエンド**: Next.js 14 + TypeScript + Tailwind CSS
- **UIコンポーネント**: Radix UI
- **状態管理**: Zustand
- **データベース**: PostgreSQL + Prisma
- **認証**: NextAuth.js
- **外部連携**: Google Calendar API
- **AI**: OpenAI GPT-4 / Anthropic Claude

## 🚀 開発開始

### 前提条件
- Node.js 18+
- PostgreSQL
- Google Calendar API キー

### セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local

# データベースのセットアップ
npx prisma migrate dev

# 開発サーバーの起動
npm run dev
```

### 環境変数

```env
# データベース
DATABASE_URL="postgresql://username:password@localhost:5432/habit_tracker"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google Calendar API
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI API
OPENAI_API_KEY="your-openai-api-key"
```

## 📁 プロジェクト構造

```
src/
├── app/                    # Next.js App Router
├── components/             # Reactコンポーネント
├── lib/                    # ユーティリティ・設定
├── stores/                 # Zustand状態管理
└── types/                  # TypeScript型定義

docs/
├── requirements.md         # 詳細な要件定義書
├── implementation-plan.md  # 実装計画書
└── architecture.md         # アーキテクチャ設計
```

## 🎨 デザイン原則

- **GitHub風のミニマルデザイン**
- **相対的評価による色の濃淡**（上位=明るい、下位=暗い）
- **アクセシビリティの考慮**
- **レスポンシブデザイン**

## 📊 データベース設計

詳細なテーブル構造は [docs/requirements.md](./docs/requirements.md) の「5. データベース設計」を参照してください。

## 🔄 実装計画

実装の進め方は [docs/implementation-plan.md](./docs/implementation-plan.md) を参照してください。

## 🚀 デプロイ

### Vercel（推奨）

```bash
# Vercel CLIのインストール
npm i -g vercel

# デプロイ
vercel
```

### その他のプラットフォーム

- **フロントエンド**: Vercel, Netlify, AWS Amplify
- **データベース**: PostgreSQL on AWS RDS, Supabase
- **外部連携**: Google Calendar API

## 📝 開発ガイドライン

1. **要件定義書の参照**: 実装前に必ず `docs/requirements.md` を確認
2. **型安全性**: TypeScriptの型を適切に定義
3. **エラーハンドリング**: 適切なエラーハンドリングの実装
4. **テスト**: 単体テスト・統合テストの実装
5. **アクセシビリティ**: WAI-ARIA準拠の実装

## 🤝 コントリビューション

1. 要件定義書を確認
2. 実装計画に従って開発
3. テストの実装
4. プルリクエストの作成

## 📄 ライセンス

MIT License
