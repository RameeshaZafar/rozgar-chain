'use client';

// Status badge component for displaying gig status

import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { GigStatus } from '@/types/gig';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: GigStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100';
      case 'Submitted':
        return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-100';
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Waiting':
        return '⏳';
      case 'In Progress':
        return '🔨';
      case 'Submitted':
        return '✅';
      case 'Completed':
        return '🎉';
      default:
        return '•';
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium px-3 py-1',
        getStatusStyles(),
        className
      )}
    >
      <span className="mr-1">{getStatusIcon()}</span>
      {status}
    </Badge>
  );
}
