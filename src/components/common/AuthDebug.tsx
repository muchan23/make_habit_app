'use client';

import { useSession } from 'next-auth/react';

export function AuthDebug() {
  const { data: session, status } = useSession();

  // 開発環境でのみ表示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">認証状態デバッグ</h3>
      <div className="space-y-1">
        <div>Status: <span className={status === 'authenticated' ? 'text-green-400' : 'text-red-400'}>{status}</span></div>
        {session ? (
          <>
            <div>User ID: {session.user?.id || 'N/A'}</div>
            <div>Name: {session.user?.name || 'N/A'}</div>
            <div>Email: {session.user?.email || 'N/A'}</div>
          </>
        ) : (
          <div>No session</div>
        )}
      </div>
    </div>
  );
}
