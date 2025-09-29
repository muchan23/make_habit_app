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
        // セッションを完全にクリア
        signOut({ 
            callbackUrl: '/auth/login',
            redirect: true 
        });
    };

    return (
        <header className="bg-[#161b22] shadow-sm border-b border-[#30363d]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-2xl font-bold text-[#f0f6fc]">
                  HabitTracker
                </Link>
                
                <nav className="hidden md:flex space-x-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-[#238636] text-white'
                          : 'text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d]'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
    
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[#8b949e]">
                  こんにちは、{session?.user?.name}さん
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="text-sm border-[#30363d] text-[#f0f6fc] hover:bg-[#21262d]"
                >
                  ログアウト
                </Button>
              </div>
            </div>
          </div>
        </header>
      );
}
