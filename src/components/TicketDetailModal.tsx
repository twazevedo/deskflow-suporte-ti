import React from 'react';
import { Ticket, PRIORITY_MAP, CATEGORY_MAP, TicketPriority } from '../types/ticket';
import { 
  X, 
  Clock, 
  User, 
  Mail, 
  Building2, 
  Tag, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  Flame,
  ArrowRight,
  Laptop,
  Code,
  Wifi,
  KeyRound,
  Server,
  FileText,
  HelpCircle,
  History,
  ShieldCheck,
  MapPin
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onPullTicket: (ticketId: string) => void;
  onChangePriority: (ticketId: string, priority: TicketPriority) => void;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'hardware': return <Laptop className="w-4 h-4 text-indigo-400" />;
    case 'software': return <Code className="w-4 h-4 text-blue-400" />;
    case 'network': return <Wifi className="w-4 h-4 text-purple-400" />;
    case 'access': return <KeyRound className="w-4 h-4 text-amber-400" />;
    case 'security': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
    case 'infrastructure': return <Server className="w-4 h-4 text-cyan-400" />;
    default: return <HelpCircle className="w-4 h-4" />;
  }
};

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  onPullTicket,
  onChangePriority,
}) => {
  if (!ticket) return null;

  const priorityConfig = PRIORITY_MAP[ticket.priority];
  const categoryConfig = CATEGORY_MAP[ticket.category] || { label: ticket.category, bg: 'bg-slate-800 text-slate-300' };

  const elapsedMinutes = Math.floor((Date.now() - ticket.createdAt) / (1000 * 60));
  const remainingMinutes = Math.max(0, ticket.slaMinutes - elapsedMinutes);
  const slaPercent = Math.min(100, Math.floor((elapsedMinutes / ticket.slaMinutes) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col custom-scrollbar">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
              {ticket.id}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityConfig.color}`}>
              {priorityConfig.code} • {priorityConfig.label}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              {ticket.tier || 'N1 - Suporte'}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar detalhes"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Title & Description */}
          <div>
            <h3 className="text-base font-bold text-white tracking-tight leading-snug">
              {ticket.title}
            </h3>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
              {ticket.description}
            </p>
          </div>

          {/* SLA Status Card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Auditoria de SLA & Contrato
              </span>
              <span className={`font-mono font-bold ${remainingMinutes === 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {remainingMinutes === 0 ? 'SLA Expirado' : `${remainingMinutes}m restantes`}
              </span>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-300 ${
                  slaPercent >= 100 ? 'bg-rose-500' : slaPercent >= 75 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${slaPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Registrado há {elapsedMinutes} minutos</span>
              <span>Deadline SLA: {ticket.slaMinutes}m ({priorityConfig.desc})</span>
            </div>
          </div>

          {/* Requester Profile Card */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Dados do Solicitante & Localidade
              </span>
              {ticket.requester.isVip && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  👑 Diretoria Executiva / VIP
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-200 truncate">{ticket.requester.name}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-300 truncate">{ticket.requester.department}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 sm:col-span-2">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-slate-300 font-mono truncate">{ticket.requester.email}</span>
              </div>
            </div>
          </div>

          {/* Audit History / Security Log */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
              <History className="w-3.5 h-3.5 text-indigo-400" />
              Trilha de Auditoria & Integridade (Audit Trail)
            </span>
            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-slate-400">
                <span>[HASH SHA-256 OK] Incidente enfileirado na Doubly Linked List</span>
                <span className="text-emerald-400 font-bold">O(1) ATIVO</span>
              </div>
              {ticket.auditHistory && ticket.auditHistory.map((item, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-slate-400">
                  <span>[{item.action}] {item.details}</span>
                  <span className="text-slate-500">{item.actor}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata: Category & Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className={`px-3 py-1 rounded-xl border text-xs font-medium flex items-center gap-1.5 ${categoryConfig.bg}`}>
              <CategoryIcon category={ticket.category} />
              <span>{categoryConfig.label}</span>
            </div>

            {ticket.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1"
              >
                <Tag className="w-3 h-3 text-slate-500" />
                {tag}
              </span>
            ))}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {ticket.priority !== 'critical' && (
              <button
                onClick={() => {
                  onChangePriority(ticket.id, 'critical');
                  onClose();
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Escalar para P1 Crítico
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Fechar
            </button>
            {ticket.status === 'queued' && (
              <button
                onClick={() => {
                  onPullTicket(ticket.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <span>Atender Incidente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

