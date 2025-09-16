'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface SessionProviderProps {
    children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
    return (
        <NextAuthSessionProvider
            // セッションの有効期限を短く設定（デバッグ用）
            refetchInterval={5 * 60} // 5分ごとにセッションを再取得
            refetchOnWindowFocus={true} // ウィンドウフォーカス時にセッションを再取得
        >
            {children}
        </NextAuthSessionProvider>
    )
}