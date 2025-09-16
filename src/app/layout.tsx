import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Navigation } from '@/components/common/Navigation';
import { AuthDebug } from '@/components/common/AuthDebug';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HabitTracker - GitHub風習慣化アプリ',
  description: 'GitHubのコミット履歴のような視覚的なフィードバックシステムで習慣形成を支援',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <SessionProvider>
          <Navigation />
          {children}
          <AuthDebug />
        </SessionProvider>
      </body>
    </html>
  );
}