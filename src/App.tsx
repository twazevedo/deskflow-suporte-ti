import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Queue } from './structures/Queue';
import { PriorityQueue } from './structures/PriorityQueue';
import { ActionHistoryManager } from './structures/ActionHistoryManager';
import { Ticket, TicketPriority, PRIORITY_MAP } from './types/ticket';
import { Agent } from './types/agent';
import { DeskAction } from './types/action';
import { INITIAL_AGENTS, INITIAL_TICKETS, TICKET_TEMPLATES } from './data/mockData';
import { soundManager } from './utils/sound';

import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { TicketQueueView } from './components/TicketQueueView';
import { AgentDesksView } from './components/AgentDesksView';
import { DataStructureInspector } from './components/DataStructureInspector';
import { InteractiveLab } from './components/InteractiveLab';
import { NewTicketModal } from './components/NewTicketModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { RecruiterGuideModal } from './components/RecruiterGuideModal';
import { AICopilotChat } from './components/AICopilotChat';
import { ToastContainer, ToastMessage } from './components/Toast';

export const App: React.FC = () => {
  // Instâncias puras de Estruturas de Dados mantidas em referências para acesso direto O(1)
  const queueRef = useRef<Queue<Ticket>>(new Queue<Ticket>());
  const priorityQueueRef = useRef<PriorityQueue<Ticket>>(new PriorityQueue<Ticket>());
  const historyRef = useRef<ActionHistoryManager>(new ActionHistoryManager());

  // Estados React para renderização e snapshots reativos
  const [queueTickets, setQueueTickets] = useState<Ticket[]>([]);
  const [priorityQueueTickets, setPriorityQueueTickets] = useState<Ticket[]>([]);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [activeTicketsMap, setActiveTicketsMap] = useState<Record<string, Ticket>>({});
  const [resolvedTickets, setResolvedTickets] = useState<Ticket[]>([]);
  const [ticketSeq, setTicketSeq] = useState(106);

  // Estados de Navegação, Modais e Áudio
  const [activeTab, setActiveTab] = useState<'board' | 'lab'>('board');
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isRecruiterModalOpen, setIsRecruiterModalOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<Ticket | null>(null);
  const [undoCount, setUndoCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAutoStreamActive, setIsAutoStreamActive] = useState(false);

  // Ticker de 1 segundo para atualização de relógios de SLA em tempo real
  const [, setClockTicker] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setClockTicker((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Incident Streaming (NOC Auto-Feed Simulation)
  useEffect(() => {
    if (!isAutoStreamActive) return;

    const streamInterval = setInterval(() => {
      const randomTemplate = TICKET_TEMPLATES[Math.floor(Math.random() * TICKET_TEMPLATES.length)];
      const id = `INC-${Date.now().toString().slice(-4)}`;
      const streamTicket: Ticket = {
        ...randomTemplate,
        id,
        status: 'queued',
        createdAt: Date.now(),
        auditHistory: [
          { timestamp: Date.now(), actor: 'NOC Auto-Sensor', action: 'STREAM_EVENT_INGESTED', details: 'Telemetria capturada via webhook corporativo' }
        ]
      };

      queueRef.current.enqueue(streamTicket);
      priorityQueueRef.current.enqueue(streamTicket, streamTicket.priorityLevel);
      syncDataStructures();
      soundManager.playPush();

      addToast({
        type: 'info',
        title: `⚡ NOC Feed: ${streamTicket.id}`,
        description: `Incidente ${streamTicket.priority.toUpperCase()} "${streamTicket.title.substring(0, 35)}..." enfileirado automaticamente.`,
        dataStructureInfo: 'Queue.enqueue() -> O(1) Streaming Enqueue',
      });
    }, 10000);

    return () => clearInterval(streamInterval);
  }, [isAutoStreamActive]);

  // Exportar Relatório Corporativo em CSV
  const handleExportReport = () => {
    const allItems = [
      ...resolvedTickets.map(t => ({ ...t, stage: 'RESOLVIDO' })),
      ...Object.values(activeTicketsMap).map(t => ({ ...t, stage: 'EM_ATENDIMENTO' })),
      ...queueTickets.map(t => ({ ...t, stage: 'NA_FILA_O1' })),
    ];

    const csvHeader = 'ID,Titulo,Prioridade,Impacto,Tier,Status,Solicitante,Setor,SLA_Minutos,Resolucao_RCA,Data_Criacao\n';
    const csvRows = allItems.map(t => {
      const title = `"${(t.title || '').replace(/"/g, '""')}"`;
      const requester = `"${(t.requester?.name || '').replace(/"/g, '""')}"`;
      const dept = `"${(t.requester?.department || '').replace(/"/g, '""')}"`;
      const rca = `"${(t.resolutionNotes || 'Pendente').replace(/"/g, '""')}"`;
      const date = new Date(t.createdAt).toISOString();
      return `${t.id},${title},${t.priority},${t.impact || 'department'},${t.tier || 'N1'},${t.status},${requester},${dept},${t.slaMinutes},${rca},${date}`;
    }).join('\n');

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_incidentes_deskflow_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      type: 'success',
      title: 'Relatório CSV Exportado',
      description: 'Download do histórico de incidentes e auditoria concluído com sucesso.',
    });
  };

  // Sincronizador de snapshots das estruturas de dados para o React
  const syncDataStructures = useCallback(() => {
    setQueueTickets(queueRef.current.toArray());
    setPriorityQueueTickets(priorityQueueRef.current.toArray());
    setUndoCount(historyRef.current.undoCount());
    setRedoCount(historyRef.current.redoCount());
  }, []);

  // Notificações Toast
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Inicializa a fila com os incidentes pré-configurados
  useEffect(() => {
    INITIAL_TICKETS.forEach((ticket) => {
      queueRef.current.enqueue(ticket);
      priorityQueueRef.current.enqueue(ticket, ticket.priorityLevel);
    });
    syncDataStructures();
  }, [syncDataStructures]);

  // -------------------------------------------------------------
  // OPERAÇÕES DE NEGÓCIO & MANIPULAÇÃO DE ESTRUTURAS
  // -------------------------------------------------------------

  // 1. Criar e Enfileirar Novo Chamado (O(1))
  const handleCreateTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => {
    const newId = `TICK-${ticketSeq}`;
    setTicketSeq((prev) => prev + 1);

    const newTicket: Ticket = {
      ...ticketData,
      id: newId,
      status: 'queued',
      createdAt: Date.now(),
    };

    queueRef.current.enqueue(newTicket);
    priorityQueueRef.current.enqueue(newTicket, newTicket.priorityLevel);

    const action: DeskAction = {
      id: `act-${Date.now()}`,
      type: 'CREATE_TICKET',
      description: `Chamado ${newId} aberto e enfileirado no Fim (Tail)`,
      timestamp: Date.now(),
      ticketId: newId,
      updatedTicketState: newTicket,
    };
    historyRef.current.recordAction(action);

    soundManager.playPush();
    syncDataStructures();

    addToast({
      type: 'success',
      title: `Novo Chamado ${newId} Enfileirado`,
      description: `"${newTicket.title}" inserido na Fila com prioridade ${newTicket.priority.toUpperCase()}.`,
      dataStructureInfo: 'Queue.enqueue() -> O(1) Ponteiro Tail',
    });
  };

  // 2. Puxar Próximo Chamado para a Mesa (O(1) Dequeue)
  const handlePullNextForAgent = (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent || agent.currentTicketId) return;

    const pulledTicket = priorityQueueRef.current.dequeue();
    if (!pulledTicket) {
      addToast({
        type: 'warning',
        title: 'Fila de Atendimento Vazia',
        description: 'Não há chamados pendentes no momento.',
      });
      return;
    }

    queueRef.current.remove((t) => t.id === pulledTicket.id);

    const inProgressTicket: Ticket = {
      ...pulledTicket,
      status: 'in_progress',
      assignedAgentId: agentId,
      startedAt: Date.now(),
    };

    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, status: 'busy', currentTicketId: pulledTicket.id }
          : a
      )
    );

    setActiveTicketsMap((prev) => ({
      ...prev,
      [pulledTicket.id]: inProgressTicket,
    }));

    const action: DeskAction = {
      id: `act-${Date.now()}`,
      type: 'PULL_TICKET',
      description: `${agent.name} puxou o chamado ${pulledTicket.id}`,
      timestamp: Date.now(),
      ticketId: pulledTicket.id,
      agentId,
      previousTicketState: pulledTicket,
      updatedTicketState: inProgressTicket,
      previousAgentState: {
        agentId,
        currentTicketId: null,
        status: 'available',
        resolvedCount: agent.resolvedCount,
      },
    };
    historyRef.current.recordAction(action);

    soundManager.playPop();
    syncDataStructures();

    addToast({
      type: 'info',
      title: `${agent.name} Iniciou Atendimento`,
      description: `Chamado ${pulledTicket.id} atribuído para a mesa de suporte.`,
      dataStructureInfo: 'PriorityQueue.dequeue() -> O(1) Extração Head',
    });
  };

  // 3. Puxar Chamado Específico por ID
  const handlePullSpecificTicket = (ticketId: string) => {
    const availableAgent = agents.find((a) => a.status === 'available');
    if (!availableAgent) {
      addToast({
        type: 'warning',
        title: 'Todos os Analistas Ocupados',
        description: 'Conclua um atendimento antes de assumir outro chamado.',
      });
      return;
    }

    const removedFromPQ = priorityQueueRef.current.remove((t) => t.id === ticketId);
    const removedFromQueue = queueRef.current.remove((t) => t.id === ticketId);
    const targetTicket = removedFromPQ || removedFromQueue;

    if (!targetTicket) return;

    const inProgressTicket: Ticket = {
      ...targetTicket,
      status: 'in_progress',
      assignedAgentId: availableAgent.id,
      startedAt: Date.now(),
    };

    setAgents((prev) =>
      prev.map((a) =>
        a.id === availableAgent.id
          ? { ...a, status: 'busy', currentTicketId: targetTicket.id }
          : a
      )
    );

    setActiveTicketsMap((prev) => ({
      ...prev,
      [targetTicket.id]: inProgressTicket,
    }));

    const action: DeskAction = {
      id: `act-${Date.now()}`,
      type: 'PULL_TICKET',
      description: `${availableAgent.name} assumiu o chamado ${targetTicket.id}`,
      timestamp: Date.now(),
      ticketId: targetTicket.id,
      agentId: availableAgent.id,
      previousTicketState: targetTicket,
      updatedTicketState: inProgressTicket,
      previousAgentState: {
        agentId: availableAgent.id,
        currentTicketId: null,
        status: 'available',
        resolvedCount: availableAgent.resolvedCount,
      },
    };
    historyRef.current.recordAction(action);

    soundManager.playPop();
    syncDataStructures();

    addToast({
      type: 'info',
      title: `Chamado Atribuído`,
      description: `${availableAgent.name} iniciou o chamado ${targetTicket.id}.`,
      dataStructureInfo: 'Queue.remove(id) -> O(1) Emenda de Ponteiros',
    });
  };

  // 4. Concluir e Resolver Chamado
  const handleResolveTicket = (
    agentId: string, 
    ticketId: string, 
    notes: string, 
    resolutionCategory: import('./types/ticket').ResolutionCategory = 'patch_applied'
  ) => {
    const agent = agents.find((a) => a.id === agentId);
    const ticket = activeTicketsMap[ticketId];
    if (!agent || !ticket) return;

    const resolvedTicket: Ticket = {
      ...ticket,
      status: 'resolved',
      resolvedAt: Date.now(),
      resolutionNotes: notes,
      resolutionCategory,
    };

    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? {
              ...a,
              status: 'available',
              currentTicketId: null,
              resolvedCount: a.resolvedCount + 1,
            }
          : a
      )
    );

    setActiveTicketsMap((prev) => {
      const copy = { ...prev };
      delete copy[ticketId];
      return copy;
    });

    setResolvedTickets((prev) => [resolvedTicket, ...prev]);

    const action: DeskAction = {
      id: `act-${Date.now()}`,
      type: 'RESOLVE_TICKET',
      description: `${agent.name} resolveu o chamado ${ticketId}`,
      timestamp: Date.now(),
      ticketId,
      agentId,
      previousTicketState: ticket,
      updatedTicketState: resolvedTicket,
      previousAgentState: {
        agentId,
        currentTicketId: ticketId,
        status: 'busy',
        resolvedCount: agent.resolvedCount,
      },
    };
    historyRef.current.recordAction(action);

    soundManager.playSuccess();
    syncDataStructures();

    addToast({
      type: 'success',
      title: `Chamado ${ticketId} Concluído!`,
      description: `Mesa de ${agent.name} liberada para o próximo atendimento.`,
      dataStructureInfo: 'Stack.push(action) -> Frame no Topo da Pilha LIFO',
    });
  };

  // 5. Transferir Chamado entre Analistas
  const handleTransferTicket = (ticketId: string, fromAgentId: string, toAgentId: string) => {
    const fromAgent = agents.find((a) => a.id === fromAgentId);
    const toAgent = agents.find((a) => a.id === toAgentId);
    const ticket = activeTicketsMap[ticketId];

    if (!fromAgent || !toAgent || !ticket || toAgent.currentTicketId) {
      addToast({
        type: 'warning',
        title: 'Não foi possível transferir',
        description: 'O analista de destino está ocupado ou indisponível.',
      });
      return;
    }

    const updatedTicket: Ticket = {
      ...ticket,
      assignedAgentId: toAgentId,
    };

    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === fromAgentId) return { ...a, status: 'available', currentTicketId: null };
        if (a.id === toAgentId) return { ...a, status: 'busy', currentTicketId: ticketId };
        return a;
      })
    );

    setActiveTicketsMap((prev) => ({
      ...prev,
      [ticketId]: updatedTicket,
    }));

    const action: DeskAction = {
      id: `act-${Date.now()}`,
      type: 'TRANSFER_TICKET',
      description: `Chamado ${ticketId} transferido de ${fromAgent.name} para ${toAgent.name}`,
      timestamp: Date.now(),
      ticketId,
      agentId: fromAgentId,
      metadata: { fromAgentId, toAgentId },
      previousTicketState: ticket,
      updatedTicketState: updatedTicket,
    };
    historyRef.current.recordAction(action);

    soundManager.playPush();
    syncDataStructures();

    addToast({
      type: 'info',
      title: 'Chamado Transferido',
      description: `${ticketId} transferido para ${toAgent.name}.`,
      dataStructureInfo: 'Stack.push() -> Registro de Transferência',
    });
  };

  // 6. Cancelar Chamado da Fila
  const handleCancelTicket = (ticketId: string) => {
    const removedPQ = priorityQueueRef.current.remove((t) => t.id === ticketId);
    const removedQ = queueRef.current.remove((t) => t.id === ticketId);
    const target = removedPQ || removedQ;

    if (!target) return;

    const action: DeskAction = {
      id: `act-${Date.now()}`,
      type: 'CANCEL_TICKET',
      description: `Chamado ${ticketId} cancelado e removido da fila`,
      timestamp: Date.now(),
      ticketId,
      previousTicketState: target,
    };
    historyRef.current.recordAction(action);

    soundManager.playPop();
    syncDataStructures();

    addToast({
      type: 'undo',
      title: `Chamado ${ticketId} Removido`,
      description: 'Ação salva na Pilha. Clique em Desfazer para restaurar.',
      dataStructureInfo: 'Stack.push() -> Frame de Rollback Salvo',
    });
  };

  // 7. Alterar Nível de Prioridade
  const handleChangePriority = (ticketId: string, newPriority: TicketPriority) => {
    const existing = priorityQueueRef.current.remove((t) => t.id === ticketId);
    if (!existing) return;

    const oldState = { ...existing };
    const updated: Ticket = {
      ...existing,
      priority: newPriority,
      priorityLevel: PRIORITY_MAP[newPriority].level,
      slaMinutes: PRIORITY_MAP[newPriority].sla,
    };

    priorityQueueRef.current.enqueue(updated, updated.priorityLevel);
    queueRef.current.remove((t) => t.id === ticketId);
    queueRef.current.enqueue(updated);

    const action: DeskAction = {
      id: `act-${Date.now()}`,
      type: 'CHANGE_PRIORITY',
      description: `Prioridade do chamado ${ticketId} alterada para ${newPriority.toUpperCase()}`,
      timestamp: Date.now(),
      ticketId,
      previousTicketState: oldState,
      updatedTicketState: updated,
    };
    historyRef.current.recordAction(action);

    soundManager.playPush();
    syncDataStructures();

    addToast({
      type: 'warning',
      title: `Prioridade Escalonada (${newPriority.toUpperCase()})`,
      description: `Chamado ${ticketId} realocado para o topo da Fila de Prioridade.`,
      dataStructureInfo: 'PriorityQueue.enqueue(level) -> Re-inserção Ordenada',
    });
  };

  // -------------------------------------------------------------
  // MECANISMO DE DESFAZER E REFAZER COM PILHAS DUPLAS (LIFO)
  // -------------------------------------------------------------

  const handleUndo = useCallback(() => {
    const action = historyRef.current.undo();
    if (!action) return;

    switch (action.type) {
      case 'PULL_TICKET': {
        if (action.previousTicketState && action.agentId) {
          const restoredTicket: Ticket = {
            ...action.previousTicketState,
            status: 'queued',
            assignedAgentId: null,
          };

          // Reinsere diretamente no início da fila em O(1)
          queueRef.current.enqueueFront(restoredTicket);
          priorityQueueRef.current.enqueue(restoredTicket, restoredTicket.priorityLevel);

          setAgents((prev) =>
            prev.map((a) =>
              a.id === action.agentId
                ? { ...a, status: 'available', currentTicketId: null }
                : a
            )
          );

          setActiveTicketsMap((prev) => {
            const copy = { ...prev };
            delete copy[action.ticketId];
            return copy;
          });
        }
        break;
      }

      case 'RESOLVE_TICKET': {
        if (action.previousTicketState && action.agentId) {
          const reopenedTicket: Ticket = {
            ...action.previousTicketState,
            status: 'in_progress',
            resolvedAt: null,
          };

          setAgents((prev) =>
            prev.map((a) =>
              a.id === action.agentId
                ? {
                    ...a,
                    status: 'busy',
                    currentTicketId: action.ticketId,
                    resolvedCount: Math.max(0, a.resolvedCount - 1),
                  }
                : a
            )
          );

          setActiveTicketsMap((prev) => ({
            ...prev,
            [action.ticketId]: reopenedTicket,
          }));

          setResolvedTickets((prev) => prev.filter((t) => t.id !== action.ticketId));
        }
        break;
      }

      case 'CREATE_TICKET': {
        queueRef.current.remove((t) => t.id === action.ticketId);
        priorityQueueRef.current.remove((t) => t.id === action.ticketId);
        break;
      }

      case 'CANCEL_TICKET': {
        if (action.previousTicketState) {
          queueRef.current.enqueue(action.previousTicketState);
          priorityQueueRef.current.enqueue(
            action.previousTicketState,
            action.previousTicketState.priorityLevel
          );
        }
        break;
      }

      case 'TRANSFER_TICKET': {
        const fromAgentId = action.metadata?.fromAgentId;
        const toAgentId = action.metadata?.toAgentId;
        if (fromAgentId && toAgentId && action.previousTicketState) {
          setAgents((prev) =>
            prev.map((a) => {
              if (a.id === toAgentId) return { ...a, status: 'available', currentTicketId: null };
              if (a.id === fromAgentId) return { ...a, status: 'busy', currentTicketId: action.ticketId };
              return a;
            })
          );
          setActiveTicketsMap((prev) => ({
            ...prev,
            [action.ticketId]: action.previousTicketState!,
          }));
        }
        break;
      }

      case 'CHANGE_PRIORITY': {
        if (action.previousTicketState) {
          priorityQueueRef.current.remove((t) => t.id === action.ticketId);
          queueRef.current.remove((t) => t.id === action.ticketId);
          priorityQueueRef.current.enqueue(
            action.previousTicketState,
            action.previousTicketState.priorityLevel
          );
          queueRef.current.enqueue(action.previousTicketState);
        }
        break;
      }
    }

    soundManager.playUndo();
    syncDataStructures();

    addToast({
      type: 'undo',
      title: 'Ação Desfeita com Sucesso!',
      description: `Invertido: "${action.description}".`,
      dataStructureInfo: 'Stack.pop() -> O(1) Reversão LIFO',
    });
  }, [syncDataStructures]);

  const handleRedo = useCallback(() => {
    const action = historyRef.current.redo();
    if (!action) return;

    switch (action.type) {
      case 'PULL_TICKET': {
        if (action.agentId && action.updatedTicketState) {
          priorityQueueRef.current.remove((t) => t.id === action.ticketId);
          queueRef.current.remove((t) => t.id === action.ticketId);
          setAgents((prev) =>
            prev.map((a) =>
              a.id === action.agentId ? { ...a, status: 'busy', currentTicketId: action.ticketId } : a
            )
          );
          setActiveTicketsMap((prev) => ({
            ...prev,
            [action.ticketId]: action.updatedTicketState!,
          }));
        }
        break;
      }

      case 'RESOLVE_TICKET': {
        if (action.agentId && action.updatedTicketState) {
          setAgents((prev) =>
            prev.map((a) =>
              a.id === action.agentId
                ? { ...a, status: 'available', currentTicketId: null, resolvedCount: a.resolvedCount + 1 }
                : a
            )
          );
          setActiveTicketsMap((prev) => {
            const copy = { ...prev };
            delete copy[action.ticketId];
            return copy;
          });
          setResolvedTickets((prev) => [action.updatedTicketState!, ...prev]);
        }
        break;
      }

      case 'CREATE_TICKET': {
        if (action.updatedTicketState) {
          queueRef.current.enqueue(action.updatedTicketState);
          priorityQueueRef.current.enqueue(
            action.updatedTicketState,
            action.updatedTicketState.priorityLevel
          );
        }
        break;
      }

      case 'CANCEL_TICKET': {
        queueRef.current.remove((t) => t.id === action.ticketId);
        priorityQueueRef.current.remove((t) => t.id === action.ticketId);
        break;
      }

      case 'TRANSFER_TICKET': {
        const fromAgentId = action.metadata?.fromAgentId;
        const toAgentId = action.metadata?.toAgentId;
        if (fromAgentId && toAgentId && action.updatedTicketState) {
          setAgents((prev) =>
            prev.map((a) => {
              if (a.id === fromAgentId) return { ...a, status: 'available', currentTicketId: null };
              if (a.id === toAgentId) return { ...a, status: 'busy', currentTicketId: action.ticketId };
              return a;
            })
          );
          setActiveTicketsMap((prev) => ({
            ...prev,
            [action.ticketId]: action.updatedTicketState!,
          }));
        }
        break;
      }

      case 'CHANGE_PRIORITY': {
        if (action.updatedTicketState) {
          priorityQueueRef.current.remove((t) => t.id === action.ticketId);
          queueRef.current.remove((t) => t.id === action.ticketId);
          priorityQueueRef.current.enqueue(
            action.updatedTicketState,
            action.updatedTicketState.priorityLevel
          );
          queueRef.current.enqueue(action.updatedTicketState);
        }
        break;
      }
    }

    soundManager.playPush();
    syncDataStructures();

    addToast({
      type: 'redo',
      title: 'Ação Refeita!',
      description: `Reaplicado: "${action.description}".`,
      dataStructureInfo: 'RedoStack.pop() -> O(1) Avanço de Estado',
    });
  }, [syncDataStructures]);

  // Atalhos de Teclado (Ctrl+Z / Ctrl+Y / Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNewTicketModalOpen(false);
        setIsRecruiterModalOpen(false);
        setSelectedTicketForDetail(null);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Simulação de Carga Rápida
  const handleInjectSimulatedTickets = () => {
    let currentSeq = ticketSeq;
    TICKET_TEMPLATES.forEach((tmpl) => {
      const id = `TICK-${currentSeq++}`;
      const ticket: Ticket = {
        ...tmpl,
        id,
        status: 'queued',
        createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 15),
      };
      queueRef.current.enqueue(ticket);
      priorityQueueRef.current.enqueue(ticket, ticket.priorityLevel);
    });

    setTicketSeq(currentSeq);
    soundManager.playPush();
    syncDataStructures();

    addToast({
      type: 'success',
      title: '4 Chamados Simulados Injetados',
      description: 'Fila de atendimento carregada com incidentes corporativos.',
      dataStructureInfo: '4x Queue.enqueue() -> Complexidade O(1)',
    });
  };

  // Reiniciar Demonstração
  const handleResetDemo = () => {
    queueRef.current.clear();
    priorityQueueRef.current.clear();
    historyRef.current.clear();

    INITIAL_TICKETS.forEach((ticket) => {
      queueRef.current.enqueue(ticket);
      priorityQueueRef.current.enqueue(ticket, ticket.priorityLevel);
    });

    setAgents(INITIAL_AGENTS);
    setActiveTicketsMap({});
    setResolvedTickets([]);
    setTicketSeq(106);
    syncDataStructures();

    addToast({
      type: 'info',
      title: 'Sistema Reinicializado',
      description: 'Estado inicial e histórico redefinidos com sucesso.',
    });
  };

  // Métricas
  const inProgressCount = Object.keys(activeTicketsMap).length;
  const criticalCount = priorityQueueTickets.filter((t) => t.priority === 'critical').length;
  const totalProcessed = resolvedTickets.length + inProgressCount + queueTickets.length;
  const slaRate = 98.4;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      
      {/* Barra de Topo & Navegação */}
      <Header
        queueSize={queueTickets.length}
        undoCount={undoCount}
        redoCount={redoCount}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenNewTicketModal={() => setIsNewTicketModalOpen(true)}
        onOpenRecruiterModal={() => setIsRecruiterModalOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onInjectSimulatedTickets={handleInjectSimulatedTickets}
        onResetDemo={handleResetDemo}
        onExportReport={handleExportReport}
        isAutoStreamActive={isAutoStreamActive}
        onToggleAutoStream={() => setIsAutoStreamActive((prev) => !prev)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Área de Trabalho Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 flex flex-col">
        
        {/* Barra de Métricas e KPIs de SLA */}
        <MetricsBar
          queueSize={queueTickets.length}
          inProgressCount={inProgressCount}
          resolvedCount={resolvedTickets.length}
          criticalCount={criticalCount}
          slaRate={slaRate}
          totalProcessed={totalProcessed}
        />

        {/* Aba 1: Mesa de Atendimento */}
        {activeTab === 'board' && (
          <div className="space-y-6">
            
            {/* Grade Principal: Fila de Chamados (Esquerda) e Mesas de Atendimento (Direita) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Coluna 1: Fila de Chamados */}
              <div className="lg:col-span-5">
                <TicketQueueView
                  tickets={queueTickets}
                  priorityQueueTickets={priorityQueueTickets}
                  onPullTicket={handlePullSpecificTicket}
                  onCancelTicket={handleCancelTicket}
                  onChangePriority={handleChangePriority}
                  onSelectTicket={(ticket) => setSelectedTicketForDetail(ticket)}
                />
              </div>

              {/* Coluna 2: Mesas dos Analistas */}
              <div className="lg:col-span-7">
                <AgentDesksView
                  agents={agents}
                  activeTicketsMap={activeTicketsMap}
                  onPullNextForAgent={handlePullNextForAgent}
                  onResolveTicket={handleResolveTicket}
                  onTransferTicket={handleTransferTicket}
                  queueSize={priorityQueueTickets.length}
                />
              </div>

            </div>

            {/* Painel Inferior: Inspetor Visual de Memória & Estruturas de Dados */}
            <div>
              <DataStructureInspector
                queueVisualNodes={queueRef.current.toVisualNodes()}
                stackVisualNodes={historyRef.current.getVisualStackNodes()}
                undoCount={undoCount}
                redoCount={redoCount}
              />
            </div>

          </div>
        )}

        {/* Aba 2: Laboratório Interativo de Algoritmos & Benchmark */}
        {activeTab === 'lab' && <InteractiveLab />}

      </main>

      {/* Modal de Inspeção e Detalhes do Chamado */}
      <TicketDetailModal
        ticket={selectedTicketForDetail}
        onClose={() => setSelectedTicketForDetail(null)}
        onPullTicket={handlePullSpecificTicket}
        onChangePriority={handleChangePriority}
      />

      {/* Modal de Abertura de Novo Chamado */}
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onSubmit={handleCreateTicket}
      />

      {/* Modal de Documentação de Arquitetura */}
      <RecruiterGuideModal
        isOpen={isRecruiterModalOpen}
        onClose={() => setIsRecruiterModalOpen(false)}
      />

      {/* Autoatendimento Inteligente com IA Corporativa */}
      <AICopilotChat
        onAutoCreateTicket={handleCreateTicket}
        queueTickets={queueTickets}
        priorityQueueTickets={priorityQueueTickets}
        resolvedTickets={resolvedTickets}
        isOpenExternal={isAIChatOpen}
        onCloseExternal={() => setIsAIChatOpen(false)}
        onToggleExternal={() => setIsAIChatOpen((prev) => !prev)}
      />

      {/* Notificações Flutuantes (Toasts) */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Rodapé Corporativo */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-4 px-4 text-center text-xs text-slate-500 font-mono">
        DeskFlow • Sistema de Fila (Queue) e Pilha (Stack) para Atendimento de Suporte TI • Implementação Pura O(1) em TypeScript
      </footer>

    </div>
  );
};

export default App;
