import React from 'react';
import { cn } from '../../utils/cn';

interface StatusPillProps {
  status: 'ACTIVE' | 'SUCCESS' | 'FAILED' | 'PENDING' | string;
  size?: 'sm' | 'md';
}

export function StatusPill({ status, size = 'md' }: StatusPillProps) {
  const normalizedStatus = status.toUpperCase();

  const getStatusStyles = () => {
    switch (normalizedStatus) {
      case 'ACTIVE':
      case 'SUCCESS':
        return 'bg-tally-status-success/20 text-tally-status-successText dark:text-tally-status-successTextDark';
      case 'FAILED':
        return 'bg-tally-status-error/20 text-tally-status-errorText dark:text-tally-status-errorTextDark';
      case 'PENDING':
        return 'bg-tally-status-pending/20 text-tally-status-pendingText dark:text-tally-status-pendingTextDark';
      default:
        return 'bg-tally-surface-hover dark:bg-tally-surface-darkHover text-tally-text-secondary dark:text-tally-text-secondaryDark';
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-bold rounded-full tracking-wide",
        size === 'sm' ? "px-2 py-0.5 text-[9px]" : "px-3 py-1 text-[10px]",
        getStatusStyles()
      )}
    >
      {normalizedStatus}
    </span>
  );
}
