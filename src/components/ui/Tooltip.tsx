'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, side = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        let x = rect.left + scrollX + rect.width / 2;
        let y = rect.top + scrollY;

        switch (side) {
          case 'top':
            y -= 10;
            break;
          case 'bottom':
            y += rect.height + 10;
            break;
          case 'left':
            x = rect.left + scrollX - 10;
            y = rect.top + scrollY + rect.height / 2;
            break;
          case 'right':
            x = rect.right + scrollX + 10;
            y = rect.top + scrollY + rect.height / 2;
            break;
        }

        setPosition({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const getTooltipClasses = () => {
    const baseClasses = 'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg pointer-events-none';
    
    switch (side) {
      case 'top':
        return `${baseClasses} transform -translate-x-1/2 -translate-y-full`;
      case 'bottom':
        return `${baseClasses} transform -translate-x-1/2`;
      case 'left':
        return `${baseClasses} transform -translate-x-full -translate-y-1/2`;
      case 'right':
        return `${baseClasses} transform -translate-y-1/2`;
      default:
        return baseClasses;
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      
      {isVisible && createPortal(
        <div
          className={getTooltipClasses()}
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}