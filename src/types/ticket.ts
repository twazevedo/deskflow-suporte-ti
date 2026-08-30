export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';

export type TicketCategory =
  | 'hardware'
  | 'software'
  | 'network'
  | 'access'
  | 'security'
  | 'infrastructure';

export type TicketStatus =
  | 'queued'
  | 'in_progress'
  | 'resolved'
  | 'cancelled'
  | 'transferred';

export interface Ticket {
  id: string; // e.g. "TICK-1024"
  title: string;
  description: string;
  requester: {
    name: string;
    email: string;
    department: string;
    isVip?: boolean;
  };
  priority: TicketPriority;
  priorityLevel: number; // 1 = critical, 2 = high, 3 = medium, 4 = low
  category: TicketCategory;
  status: TicketStatus;
  createdAt: number;
  assignedAgentId?: string | null;
  startedAt?: number | null;
  resolvedAt?: number | null;
  slaMinutes: number; // Max resolution deadline in minutes
  resolutionNotes?: string;
  tags: string[];
}

export const PRIORITY_MAP: Record<TicketPriority, { label: string; level: number; color: string; badge: string; sla: number }> = {
  critical: { label: 'Crítico / SLA VIP', level: 1, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', badge: 'bg-rose-600', sla: 15 },
  high: { label: 'Alta Prioridade', level: 2, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', badge: 'bg-amber-600', sla: 60 },
  medium: { label: 'Média Prioridade', level: 3, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30', badge: 'bg-sky-600', sla: 180 },
  low: { label: 'Baixa Prioridade', level: 4, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', badge: 'bg-emerald-600', sla: 480 },
};

export const CATEGORY_MAP: Record<TicketCategory, { label: string; icon: string; bg: string }> = {
  hardware: { label: 'Hardware', icon: 'Laptop', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  software: { label: 'Software / Apps', icon: 'Code', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  network: { label: 'Rede & VPN', icon: 'Wifi', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  access: { label: 'Acessos & Senhas', icon: 'KeyRound', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  security: { label: 'Segurança / Phishing', icon: 'ShieldAlert', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  infrastructure: { label: 'Servidores & Cloud', icon: 'Server', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
};
