import React from 'react';
import { cn } from '@/lib/utils';

// Card の基本型定義
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'goal' | 'stat' | 'ai' | 'calendar';
  size?: 'sm' | 'md' | 'lg';
  isInteractive?: boolean;
  isSelected?: boolean;
  children: React.ReactNode;
}

// CardHeader の型定義
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// CardContent の型定義
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// CardFooter の型定義
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// CardTitle の型定義
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

// CardDescription の型定義
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

// メインのCardコンポーネント
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    size = 'md', 
    isInteractive = false, 
    isSelected = false, 
    children, 
    ...props 
  }, ref) => {
    const baseStyles = 'rounded-lg border bg-white shadow-sm transition-all duration-200';
    
    const variants = {
      default: 'border-gray-200 hover:shadow-md',
      goal: 'border-gray-200 hover:shadow-md hover:border-green-300',
      stat: 'border-gray-200 hover:shadow-md hover:border-blue-300',
      ai: 'border-gray-200 hover:shadow-md hover:border-purple-300',
      calendar: 'border-gray-200 hover:shadow-md hover:border-orange-300',
    };
    
    const sizes = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };
    
    const interactiveStyles = isInteractive 
      ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
      : '';
    
    const selectedStyles = isSelected 
      ? 'ring-2 ring-blue-500 border-blue-500' 
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          interactiveStyles,
          selectedStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

// CardHeader コンポーネント
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-3', className)}
      {...props}
    >
      {children}
    </div>
  )
);

// CardContent コンポーネント
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
);

// CardFooter コンポーネント
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-3 mt-3 border-t border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  )
);

// CardTitle コンポーネント
const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
);

// CardDescription コンポーネント
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600', className)}
      {...props}
    >
      {children}
    </p>
  )
);

// displayName の設定
Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';

export { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle, 
  CardDescription 
};