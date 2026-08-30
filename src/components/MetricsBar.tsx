import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Flame,
  Activity
} from 'lucide-react';

interface MetricsBarProps {
  queueSize: number;
  inProgressCount: number;
  resolvedCount: number;
  criticalCount: number;
  slaRate: number;
  totalProcessed: number;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  queueSize,
  inProgressCount,
  resolvedCount,
  criticalCount,
  slaRate,
  totalProcessed,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      
      {/* Metric 1: Fila de Espera */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Fila de Espera</span>
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-white">{queueSize}</span>
          <span className="text-[11px] text-slate-400 font-mono">FIFO O(1)</span>
        </div>
      </div>

      {/* Metric 2: Críticos / SLA Urgente */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-rose-400 uppercase tracking-wider">SLA Crítico / VIP</span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-rose-400">{criticalCount}</span>
          <span className="text-[11px] text-rose-400/80">Fila Prioritária</span>
        </div>
      </div>

      {/* Metric 3: Em Atendimento */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Nas Mesas</span>
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-sky-400">{inProgressCount}</span>
          <span className="text-[11px] text-slate-400">em andamento</span>
        </div>
      </div>

      {/* Metric 4: Resolvidos */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Resolvidos</span>
          <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-teal-400">{resolvedCount}</span>
          <span className="text-[11px] text-slate-400">concluídos</span>
        </div>
      </div>

      {/* Metric 5: SLA Compliance */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">SLA no Prazo</span>
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-indigo-400">{slaRate}%</span>
          <span className="text-[11px] text-emerald-400">meta: &gt;95%</span>
        </div>
      </div>

      {/* Metric 6: Total Processados */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Vazão Total</span>
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold font-mono text-purple-400">{totalProcessed}</span>
          <span className="text-[11px] text-slate-400">chamados</span>
        </div>
      </div>

    </div>
  );
};
