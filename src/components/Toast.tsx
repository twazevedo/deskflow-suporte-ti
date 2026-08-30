import React from 'react';
import { CheckCircle2, AlertTriangle, Undo2, Redo2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'undo' | 'redo';
  title: string;
  description?: string;
  dataStructureInfo?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col gap-2 max-w-xs sm:max-w-sm w-full pointer-events-none animate-fade-in">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderColor = 'border-sky-500/30';
        let bgGradient = 'from-slate-900/95 to-slate-900/95';
        let iconColor = 'text-sky-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'border-emerald-500/40';
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'undo') {
          Icon = Undo2;
          borderColor = 'border-amber-500/40';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'redo') {
          Icon = Redo2;
          borderColor = 'border-indigo-500/40';
          iconColor = 'text-indigo-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'border-rose-500/40';
          iconColor = 'text-rose-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-2.5 p-3 rounded-2xl border ${borderColor} bg-slate-950/90 backdrop-blur-xl shadow-xl transition-all`}
          >
            <div className={`p-1.5 rounded-xl bg-slate-900 ${iconColor} shrink-0 mt-0.5`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-white tracking-tight truncate">{toast.title}</h4>
                <button
                  onClick={() => onDismiss(toast.id)}
                  className="text-slate-500 hover:text-white transition-colors p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {toast.description && (
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{toast.description}</p>
              )}
              {toast.dataStructureInfo && (
                <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900/80 border border-slate-800 text-emerald-300">
                  <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                  <span className="truncate">{toast.dataStructureInfo}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

