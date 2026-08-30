import React, { useState } from 'react';
import { Agent } from '../types/agent';
import { Ticket, PRIORITY_MAP, CATEGORY_MAP, RESOLUTION_CATEGORIES, ResolutionCategory } from '../types/ticket';
import { 
  UserCheck, 
  CheckCircle, 
  Clock, 
  ArrowRightLeft, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  User,
  Zap,
  CheckSquare,
  ShieldAlert,
  Sliders
} from 'lucide-react';

interface AgentDesksViewProps {
  agents: Agent[];
  activeTicketsMap: Record<string, Ticket>;
  onPullNextForAgent: (agentId: string) => void;
  onResolveTicket: (agentId: string, ticketId: string, resolutionNotes: string, resolutionCategory?: ResolutionCategory) => void;
  onTransferTicket: (ticketId: string, fromAgentId: string, toAgentId: string) => void;
  queueSize: number;
}

export const AgentDesksView: React.FC<AgentDesksViewProps> = ({
  agents,
  activeTicketsMap,
  onPullNextForAgent,
  onResolveTicket,
  onTransferTicket,
  queueSize,
}) => {
  const [resolutionNotesMap, setResolutionNotesMap] = useState<Record<string, string>>({});
  const [resolutionCategoryMap, setResolutionCategoryMap] = useState<Record<string, ResolutionCategory>>({});
  const [transferAgentMap, setTransferAgentMap] = useState<Record<string, string>>({});

  const handleNotesChange = (agentId: string, value: string) => {
    setResolutionNotesMap((prev) => ({ ...prev, [agentId]: value }));
  };

  const handleResolveSubmit = (agentId: string, ticketId: string) => {
    const notes = resolutionNotesMap[agentId] || 'Incidente solucionado e validado em conformidade com os SLAs contratuais.';
    const category = resolutionCategoryMap[agentId] || 'patch_applied';
    onResolveTicket(agentId, ticketId, notes, category);
    
    setResolutionNotesMap((prev) => {
      const copy = { ...prev };
      delete copy[agentId];
      return copy;
    });
    setResolutionCategoryMap((prev) => {
      const copy = { ...prev };
      delete copy[agentId];
      return copy;
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-xl flex flex-col h-full">
      
      {/* Section Header */}
      <div className="pb-4 border-b border-slate-800/80 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Mesas de Incidentes (Service Desks)
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              {agents.length} analistas dedicados
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Distribuição por fila de prioridade O(1) e registro de pareceres técnicos com classificação RCA
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 overflow-y-auto max-h-[640px] pr-1 custom-scrollbar">
        {agents.map((agent) => {
          const currentTicket = agent.currentTicketId ? activeTicketsMap[agent.currentTicketId] : null;
          const isBusy = !!currentTicket;

          return (
            <div
              key={agent.id}
              className={`rounded-2xl border transition-all duration-200 p-4 ${
                isBusy
                  ? 'bg-slate-900/95 border-indigo-500/40 shadow-lg shadow-indigo-950/20 ring-1 ring-indigo-500/20'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Agent Header Info */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={agent.avatar}
                      alt={agent.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-700/80"
                    />
                    <div
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                        isBusy ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60">
                        {agent.resolvedCount} resolvidos
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{agent.role}</p>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border font-mono ${
                      isBusy
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {isBusy ? '● Em Atendimento' : '● Disponível'}
                  </span>
                </div>
              </div>

              {/* Desk Body: Idle vs Busy */}
              {!isBusy ? (
                <div className="mt-4 p-4 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">Especialidades: {agent.specialty.join(' • ')}</span>
                  </div>

                  <button
                    onClick={() => onPullNextForAgent(agent.id)}
                    disabled={queueSize === 0}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 disabled:opacity-40 disabled:hover:from-indigo-600 rounded-xl shadow-md shadow-indigo-900/30 transition-all active:scale-95 shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Puxar Próximo da Fila O(1)</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 space-y-3 pt-3 border-t border-slate-800/80">
                  
                  {/* Current Active Ticket Details */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-500/30">
                          {currentTicket.id}
                        </span>
                        {currentTicket.requester.isVip && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            👑 VIP
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {currentTicket.tier}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_MAP[currentTicket.priority].color}`}>
                        {PRIORITY_MAP[currentTicket.priority].label}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white">
                      {currentTicket.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {currentTicket.description}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-200">{currentTicket.requester.name}</span>
                        <span className="text-slate-500 font-mono">({currentTicket.requester.department})</span>
                      </div>
                      <div className="flex items-center gap-1 text-indigo-300 font-mono">
                        <Clock className="w-3 h-3 text-indigo-400 animate-spin" />
                        <span>SLA: {currentTicket.slaMinutes}m</span>
                      </div>
                    </div>
                  </div>

                  {/* Resolution Category & Technical Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Classificação da Resolução (RCA):
                      </label>
                      <select
                        value={resolutionCategoryMap[agent.id] || 'patch_applied'}
                        onChange={(e) => setResolutionCategoryMap((prev) => ({ ...prev, [agent.id]: e.target.value as ResolutionCategory }))}
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:outline-none focus:border-indigo-500/50"
                      >
                        {Object.entries(RESOLUTION_CATEGORIES).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        Parecer Técnico / Resolução Aplicada:
                      </label>
                      <input
                        type="text"
                        maxLength={800}
                        value={resolutionNotesMap[agent.id] || ''}
                        onChange={(e) => handleNotesChange(agent.id, e.target.value)}
                        placeholder="Ex: Flush de rotas DNS, túnel IPsec restabelecido e validado com monitoramento..."
                        className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60"
                      />
                    </div>
                  </div>

                  {/* Action Buttons: Resolve, Transfer / Escalate */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                    
                    {/* Transfer Select */}
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                      <select
                        aria-label="Escalar ou transferir chamado"
                        value={transferAgentMap[agent.id] || ''}
                        onChange={(e) => setTransferAgentMap((prev) => ({ ...prev, [agent.id]: e.target.value }))}
                        className="text-xs bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-slate-700"
                      >
                        <option value="">Escalar / Transferir para...</option>
                        {agents
                          .filter((a) => a.id !== agent.id)
                          .map((target) => (
                            <option key={target.id} value={target.id}>
                              {target.name} ({target.role.split(' - ')[0]})
                            </option>
                          ))}
                      </select>
                      {transferAgentMap[agent.id] && (
                        <button
                          onClick={() => {
                            onTransferTicket(currentTicket.id, agent.id, transferAgentMap[agent.id]);
                            setTransferAgentMap((prev) => {
                              const copy = { ...prev };
                              delete copy[agent.id];
                              return copy;
                            });
                          }}
                          className="px-2.5 py-1.5 text-xs font-semibold text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-xl transition-colors flex items-center gap-1"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          Escalar
                        </button>
                      )}
                    </div>

                    {/* Resolve Button */}
                    <button
                      onClick={() => handleResolveSubmit(agent.id, currentTicket.id)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      <CheckCircle className="w-4 h-4 text-slate-950" />
                      <span>Concluir Atendimento (RCA)</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

