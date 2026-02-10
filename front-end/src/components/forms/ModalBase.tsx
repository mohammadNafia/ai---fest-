import React, { useEffect, useRef, ReactNode } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import type { Theme } from '@/types';

interface ModalBaseProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  theme?: Theme;
}

const ModalBase: React.FC<ModalBaseProps> = ({ title, onClose, children, theme: themeProp }) => {
  const { theme: contextTheme } = useTheme();
  const theme = themeProp || contextTheme;
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Keyboard trap and focus management
  useEffect(() => {
    // Store the previously active element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the modal when it opens
    if (modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      if (firstElement) {
        firstElement.focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Tab key trap - keep focus within modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [onClose]);

  return (
    <div
      className="bg-black/70 backdrop-blur-md p-4 overflow-y-auto"
      style={{
        position: 'fixed',
        zIndex: 9999,
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`w-full max-w-2xl rounded-2xl flex flex-col max-h-[90vh] ${
          theme === 'light'
            ? 'bg-white border border-blue-200/50 shadow-2xl'
            : 'bg-[#0a0a1a] border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.2)]'
        }`}
        style={{ margin: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b flex justify-between items-center flex-shrink-0 rounded-t-2xl ${
          theme === 'light'
            ? 'border-gray-200 bg-gradient-to-r from-blue-50 to-transparent'
            : 'border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent'
        }`}>
          <h3 id="modal-title" className={`text-2xl font-bold mb-1 ${
            theme === 'light' ? 'text-gray-900' : 'text-white'
          }`}>{title}</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors focus:ring-2 focus:ring-blue-500/70 outline-none ${
              theme === 'light'
                ? 'hover:bg-gray-100 text-gray-600'
                : 'hover:bg-white/10 text-gray-400 hover:text-white'
            }`}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalBase;

