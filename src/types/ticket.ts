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

export type IncidentImpact = 'enterprise' | 'department' | 'individual';
export type SupportTier = 'N1 - Suporte Ágil' | 'N2 - Sistemas & Cloud' | 'N3 - Infra & SecOps';

export type ResolutionCategory =
  | 'patch_applied'
  | 'workaround'
  | 'credential_reset'
  | 'hardware_replacement'
  | 'firewall_route_fix'
  | 'false_positive'
  | 'user_guidance';

export interface AuditEntry {
  timestamp: number;
  actor: string;
  action: string;
  details: string;
}

export interface Ticket {
  id: string; // e.g. "INC-1024"
  title: string;
  description: string;
  requester: {
    name: string;
    email: string;
    department: string;
    isVip?: boolean;
    location?: string;
  };
  priority: TicketPriority;
  priorityLevel: number; // 1 = critical (P1), 2 = high (P2), 3 = medium (P3), 4 = low (P4)
  category: TicketCategory;
  impact: IncidentImpact;
  tier: SupportTier;
  status: TicketStatus;
  createdAt: number;
  assignedAgentId?: string | null;
  startedAt?: number | null;
  resolvedAt?: number | null;
  slaMinutes: number; // Max resolution deadline in minutes
  resolutionNotes?: string;
  resolutionCategory?: ResolutionCategory;
  tags: string[];
  auditHistory?: AuditEntry[];
}

export const PRIORITY_MAP: Record<TicketPriority, { 
  label: string; 
  code: string;
  level: number; 
  color: string; 
  badge: string; 
  sla: number;
  desc: string;
}> = {
  critical: { 
    label: 'P1 • Crítico / Blocker', 
    code: 'P1',
    level: 1, 
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', 
    badge: 'bg-rose-600', 
    sla: 15,
    desc: 'Impacto total em sistemas centrais ou Diretoria'
  },
  high: { 
    label: 'P2 • Alta Severidade', 
    code: 'P2',
    level: 2, 
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', 
    badge: 'bg-amber-600', 
    sla: 60,
    desc: 'Degradação em setor produtivo sem workaround'
  },
  medium: { 
    label: 'P3 • Média Severidade', 
    code: 'P3',
    level: 3, 
    color: 'text-sky-400 bg-sky-500/10 border-sky-500/30', 
    badge: 'bg-sky-600', 
    sla: 180,
    desc: 'Incidente localizado com contingência viável'
  },
  low: { 
    label: 'P4 • Baixa / Requisição', 
    code: 'P4',
    level: 4, 
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', 
    badge: 'bg-emerald-600', 
    sla: 480,
    desc: 'Dúvida, instalação padrão ou solicitação menor'
  },
};

export const CATEGORY_MAP: Record<TicketCategory, { label: string; icon: string; bg: string }> = {
  hardware: { label: 'Hardware & Devices', icon: 'Laptop', bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  software: { label: 'Aplicações & ERP', icon: 'Code', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  network: { label: 'Redes, SD-WAN & VPN', icon: 'Wifi', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  access: { label: 'IAM, AD & MFA', icon: 'KeyRound', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  security: { label: 'SOC, Phishing & SecOps', icon: 'ShieldAlert', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  infrastructure: { label: 'Cloud, K8s & Servers', icon: 'Server', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
};

export const RESOLUTION_CATEGORIES: Record<ResolutionCategory, string> = {
  patch_applied: 'Hotfix / Atualização Aplicada',
  workaround: 'Contorno de Emergência Estabelecido',
  credential_reset: 'Reset de Credenciais & MFA Restabelecido',
  hardware_replacement: 'Substituição de Equipamento / Peça',
  firewall_route_fix: 'Reconfiguração de Roteamento / Firewall',
  false_positive: 'Falso Positivo / Sem Ação Necessária',
  user_guidance: 'Orientação Técnica ao Usuário Final',
};

