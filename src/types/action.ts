import { Ticket } from './ticket';

export type ActionType =
  | 'PULL_TICKET'
  | 'RESOLVE_TICKET'
  | 'CANCEL_TICKET'
  | 'TRANSFER_TICKET'
  | 'CREATE_TICKET'
  | 'CHANGE_PRIORITY';

export interface DeskAction {
  id: string;
  type: ActionType;
  description: string;
  timestamp: number;
  ticketId: string;
  agentId?: string;
  previousTicketState?: Ticket;
  updatedTicketState?: Ticket;
  previousAgentState?: {
    agentId: string;
    currentTicketId: string | null;
    status: 'available' | 'busy' | 'break';
    resolvedCount: number;
  };
  metadata?: Record<string, any>;
}
