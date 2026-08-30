export type AgentRole = 'Nível 1 - Suporte Ágil' | 'Nível 2 - Sistemas & Cloud' | 'Nível 3 - Infra & Redes';

export type AgentStatus = 'available' | 'busy' | 'break';

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: AgentRole;
  specialty: string[];
  status: AgentStatus;
  currentTicketId: string | null;
  resolvedCount: number;
  totalHandlingTimeMs: number;
}
