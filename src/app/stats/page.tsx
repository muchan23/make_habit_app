'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function Navigation() {
    const { data: session } = useSession();
    const pathname = usePathname();

    const navigation = [
        { name: 'ダッシュボード', href: '/', icon: '📊' },
        { name: '目標管理', href: '/goals', icon: '🎯' },
        { name: '統計', href: '/stats', icon: '📈' },
        { name: 'カレンダー', href: '/calendar', icon: '📅' },
        { name: '設定', href: '/settings', icon: '⚙️' },
    ];

    const handleSignOut = () => {
        signOut({ callbackUrl: '/auth/login' });
    };

    return (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-2xl font-bold text-gray-900">
                  HabitTracker
                </Link>
                
                <nav className="hidden md:flex space-x-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
    
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  こんにちは、{session?.user?.name}さん
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="text-sm"
                >
                  ログアウト
                </Button>
              </div>
            </div>
          </div>
        </header>
      );
}