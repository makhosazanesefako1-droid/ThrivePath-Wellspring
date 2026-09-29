import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container floating in top-right */}
      <div
        className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isWarning = toast.type === 'warning';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
                isSuccess
                  ? 'bg-white border-emerald-200 text-[#172033]'
                  : isWarning
                  ? 'bg-white border-amber-200 text-[#172033]'
                  : isError
                  ? 'bg-white border-red-200 text-[#172033]'
                  : 'bg-white border-blue-200 text-[#172033]'
              }`}
            >
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />}
              {!isSuccess && !isWarning && !isError && (
                <Info className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
              )}

              <div className="flex-1 text-sm font-medium leading-snug">{toast.message}</div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      showToast: (msg: string) => {
        console.log('[UniWell Toast]:', msg);
      },
    };
  }
  return context;
};
