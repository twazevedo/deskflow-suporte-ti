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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderColor = 'border-sky-500/30';
        let bgGradient = 'from-slate-900 via-slate-900 to-sky-950/40';
        let iconColor = 'text-sky-400';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderColor = 'border-emerald-500/40';
          bgGradient = 'from-slate-900 via-slate-900 to-emerald-950/40';
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'undo') {
          Icon = Undo2;
          borderColor = 'border-amber-500/40';
          bgGradient = 'from-slate-900 via-slate-900 to-amber-950/40';
          iconColor = 'text-amber-400';
        } else if (toast.type === 'redo') {
          Icon = Redo2;
          borderColor = 'border-indigo-500/40';
          bgGradient = 'from-slate-900 via-slate-900 to-indigo-950/40';
          iconColor = 'text-indigo-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderColor = 'border-rose-500/40';
          bgGradient = 'from-slate-900 via-slate-900 to-rose-950/40';
          iconColor = 'text-rose-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${borderColor} bg-gradient-to-r ${bgGradient} backdrop-blur-md shadow-2xl animate-slide-in`}
          >
            <div className={`p-2 rounded-lg bg-slate-800/80 ${iconColor} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-white tracking-tight">{toast.title}</h4>
                <button
                  onClick={() => onDismiss(toast.id)}
                  className="text-slate-400 hover:text-white transition-colors p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              {toast.description && (
                <p className="text-xs text-slate-300 mt-0.5">{toast.description}</p>
              )}
              {toast.dataStructureInfo && (
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950/60 border border-slate-700/50 text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {toast.dataStructureInfo}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
