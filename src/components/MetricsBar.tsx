import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Layers, 
  TrendingUp, 
  Flame,
  Activity,
  ShieldAlert,
  Gauge
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
      
      {/* Metric 1: Fila de Espera O(1) */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-lg shadow-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Fila de Triagem</span>
          <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-white tracking-tight">{queueSize}</span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">O(1) FIFO</span>
        </div>
      </div>

      {/* Metric 2: Incidentes P1/VIP */}
      <div className="bg-slate-900/70 border border-rose-900/40 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-lg shadow-rose-950/20 ring-1 ring-rose-500/10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider font-mono">P1 • Blocker SLA</span>
          <div className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Flame className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-rose-400 tracking-tight">{criticalCount}</span>
          <span className="text-[10px] text-rose-300/90 font-mono">Prioridade Máx</span>
        </div>
      </div>

      {/* Metric 3: Despacho Ativo / Nas Mesas */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-lg shadow-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Em Resolução</span>
          <div className="p-1.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Activity className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-sky-400 tracking-tight">{inProgressCount}</span>
          <span className="text-[10px] text-slate-400 font-mono">Analistas N1-N3</span>
        </div>
      </div>

      {/* Metric 4: Incidentes Concluídos */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-lg shadow-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Resolvidos / RCA</span>
          <div className="p-1.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-teal-400 tracking-tight">{resolvedCount}</span>
          <span className="text-[10px] text-teal-300 font-mono">Parecer Salvo</span>
        </div>
      </div>

      {/* Metric 5: SLA Compliance ITIL */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-lg shadow-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">SLA Compliance</span>
          <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Gauge className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-indigo-400 tracking-tight">{slaRate}%</span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">ITIL Target</span>
        </div>
      </div>

      {/* Metric 6: Throughput / Vazão */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-lg shadow-slate-950/40">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Vazão Total</span>
          <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black font-mono text-purple-400 tracking-tight">{totalProcessed}</span>
          <span className="text-[10px] text-slate-400 font-mono">Incidentes</span>
        </div>
      </div>

    </div>
  );
};

