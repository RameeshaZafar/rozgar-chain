'use client';

// Reusable primary button component with Pakistan-themed colors

import React, { type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  type = 'button',
  className,
  fullWidth = false
}: PrimaryButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200';
      case 'secondary':
        return 'bg-gray-100 text-gray-900 hover:bg-gray-200';
      case 'outline':
        return 'border-2 border-green-500 bg-green-500/90 text-white font-semibold hover:bg-green-600 hover:border-green-600 disabled:bg-green-600/70 disabled:border-green-600/70 disabled:text-white';
      default:
        return '';
    }
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'font-medium transition-all duration-200',
        getVariantStyles(),
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
