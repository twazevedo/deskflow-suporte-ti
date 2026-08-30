import React, { useState, useMemo } from 'react';
import { 
  Ticket, 
  PRIORITY_MAP, 
  CATEGORY_MAP, 
  TicketPriority,
  TicketCategory
} from '../types/ticket';
import { 
  Clock, 
  User, 
  Sparkles, 
  Laptop, 
  Code, 
  Wifi, 
  KeyRound, 
  ShieldAlert, 
  Server,
  ArrowRight,
  Flame,
  ArrowUpCircle,
  Trash2,
  HelpCircle,
  Search,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface TicketQueueViewProps {
  tickets: Ticket[];
  priorityQueueTickets: Ticket[];
  onPullTicket: (ticketId: string) => void;
  onCancelTicket: (ticketId: string) => void;
  onChangePriority: (ticketId: string, newPriority: TicketPriority) => void;
  onSelectTicket: (ticket: Ticket) => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'hardware': return <Laptop className="w-3.5 h-3.5 text-indigo-400" />;
    case 'software': return <Code className="w-3.5 h-3.5 text-blue-400" />;
    case 'network': return <Wifi className="w-3.5 h-3.5 text-purple-400" />;
    case 'access': return <KeyRound className="w-3.5 h-3.5 text-amber-400" />;
    case 'security': return <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />;
    case 'infrastructure': return <Server className="w-3.5 h-3.5 text-cyan-400" />;
    default: return <HelpCircle className="w-3.5 h-3.5" />;
  }
};

export const TicketQueueView: React.FC<TicketQueueViewProps> = ({
  tickets,
  priorityQueueTickets,
  onPullTicket,
  onCancelTicket,
  onChangePriority,
  onSelectTicket,
}) => {
  const [viewMode, setViewMode] = useState<'priority' | 'fifo'>('priority');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const sourceTickets = viewMode === 'priority' ? priorityQueueTickets : tickets;

  // Filter and search
  const filteredTickets = useMemo(() => {
    return sourceTickets.filter((t) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.requester.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.requester.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [sourceTickets, searchQuery, selectedCategory]);

  const formatElapsed = (createdAt: number) => {
    const elapsedMinutes = Math.floor((Date.now() - createdAt) / (1000 * 60));
    if (elapsedMinutes < 1) return 'Agora mesmo';
    if (elapsedMinutes < 60) return `Há ${elapsedMinutes}m`;
    const hours = Math.floor(elapsedMinutes / 60);
    return `Há ${hours}h ${elapsedMinutes % 60}m`;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl shadow-xl flex flex-col h-full">
      
      {/* Queue Header & Mode Tabs */}
      <div className="flex flex-col gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Fila de Chamados
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {filteredTickets.length} de {sourceTickets.length}
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {viewMode === 'priority'
                ? 'Ordenação por Nível de SLA/Urgência (Priority Queue + FIFO)'
                : 'Ordenação estrita por tempo de chegada (Pure FIFO Queue)'}
            </p>
          </div>

          {/* Toggle View Mode */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('priority')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                viewMode === 'priority'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              SLA / Prioridade
            </button>
            <button
              onClick={() => setViewMode('fifo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                viewMode === 'fifo'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              Chegada (FIFO)
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Buscar chamado, solicitante ou setor"
              maxLength={100}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar chamado, solicitante ou setor..."
              className="w-full text-xs bg-slate-950/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-700"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
              }`}
            >
              Todas
            </button>
            {(['security', 'network', 'software', 'access', 'hardware'] as TicketCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60'
                }`}
              >
                {CATEGORY_MAP[cat].label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Queue Content List */}
      <div className="mt-3 flex-1 overflow-y-auto pr-1 space-y-2.5 max-h-[580px] custom-scrollbar">
        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/40">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-white">Nenhum chamado encontrado</h3>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              {searchQuery ? 'Tente ajustar os termos da busca.' : 'A fila de atendimento está zerada!'}
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket, index) => {
            const isHead = index === 0 && !searchQuery && selectedCategory === 'all';
            const priorityConfig = PRIORITY_MAP[ticket.priority];
            const categoryConfig = CATEGORY_MAP[ticket.category] || { label: ticket.category, bg: 'bg-slate-800 text-slate-300' };

            const elapsedMinutes = Math.floor((Date.now() - ticket.createdAt) / (1000 * 60));
            const remainingMinutes = Math.max(0, ticket.slaMinutes - elapsedMinutes);
            const slaPercent = Math.min(100, Math.floor((elapsedMinutes / ticket.slaMinutes) * 100));
            const isSlaBreached = slaPercent >= 100;
            const isSlaWarning = slaPercent >= 75 && !isSlaBreached;

            return (
              <div
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className={`group relative rounded-2xl border transition-all duration-200 p-4 cursor-pointer ${
                  isHead
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60 shadow-sm'
                }`}
              >
                {/* Top info */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg ${
                      isHead
                        ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-slate-800/80 text-slate-400 border border-slate-700/60'
                    }`}>
                      {isHead ? '★ PRÓXIMO DA FILA' : `#${index + 1}`}
                    </span>

                    <span className="text-xs font-mono font-semibold text-slate-300">
                      {ticket.id}
                    </span>

                    {ticket.requester.isVip && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                        👑 VIP
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityConfig.color}`}>
                      {priorityConfig.label}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                    {ticket.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>

                {/* Requester & SLA footer */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-400 truncate">
                    <div className="flex items-center gap-1 truncate">
                      <User className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="text-slate-300 truncate">{ticket.requester.name}</span>
                      <span className="text-slate-500 text-[11px] truncate">({ticket.requester.department})</span>
                    </div>
                  </div>

                  {/* SLA Countdown pill */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className={`text-[11px] font-mono font-bold ${
                      isSlaBreached ? 'text-rose-400' : isSlaWarning ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {remainingMinutes}m SLA
                    </span>
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="mt-2.5 pt-2 flex items-center justify-between gap-2 border-t border-slate-800/40" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    {ticket.priority !== 'critical' && (
                      <button
                        onClick={() => onChangePriority(ticket.id, 'critical')}
                        title="Escalar para Crítico"
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg transition-colors"
                      >
                        <ArrowUpCircle className="w-3 h-3" />
                        Escalar
                      </button>
                    )}
                    <button
                      onClick={() => onCancelTicket(ticket.id)}
                      title="Excluir/Cancelar chamado"
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onPullTicket(ticket.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all active:scale-95 ${
                      isHead
                        ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <span>Atender</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
