import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={cn("relative w-full bg-tally-bg-light dark:bg-tally-bg-dark rounded-3xl shadow-floating dark:shadow-floating-dark border border-tally-border-light dark:border-tally-border-dark overflow-hidden animate-fade-in flex flex-col max-h-[90vh]", maxWidth)}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-tally-border-light dark:border-tally-border-dark">
          <h2 className="text-xl font-display font-semibold text-tally-text-primary dark:text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-tally-surface-hover dark:hover:bg-tally-surface-darkHover text-tally-text-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
