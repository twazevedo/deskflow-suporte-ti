import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  KeyRound, 
  Wifi, 
  Flame, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  ArrowRight,
  Minimize2,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { Ticket } from '../types/ticket';
import { soundManager } from '../utils/sound';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  text: string;
  timestamp: number;
  options?: Array<{ label: string; action: () => void }>;
  ticketCreated?: Ticket;
  diagnostics?: string[];
}

interface AICopilotChatProps {
  onAutoCreateTicket: (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => void;
  queueTickets: Ticket[];
  priorityQueueTickets: Ticket[];
  resolvedTickets: Ticket[];
}

export const AICopilotChat: React.FC<AICopilotChatProps> = ({
  onAutoCreateTicket,
  queueTickets,
  priorityQueueTickets,
  resolvedTickets,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: 'Olá! Sou o **DeskFlow AI**, o agente virtual corporativo. Posso diagnosticar problemas de TI, executar resets automáticos de credenciais ou triar e abrir incidentes diretamente na **Fila O(1)**.',
      timestamp: Date.now(),
      options: [
        { label: '🔑 Reset de Senha & MFA', action: () => handleQuickAction('mfa') },
        { label: '🌐 Falha na Conexão VPN / Rede', action: () => handleQuickAction('vpn') },
        { label: '🚨 Incidente Crítico em Produção', action: () => handleQuickAction('critical') },
        { label: '🔍 Consultar Status de Incidente', action: () => handleQuickAction('status') },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      processAIResponse(text);
      setIsTyping(false);
    }, 850);
  };

  const handleQuickAction = (type: 'mfa' | 'vpn' | 'critical' | 'status') => {
    switch (type) {
      case 'mfa':
        handleSendMessage('Estou com a conta bloqueada e preciso de reset no MFA do Active Directory.');
        break;
      case 'vpn':
        handleSendMessage('Minha conexão VPN IPsec matriz caiu e estou sem acesso aos servidores internos.');
        break;
      case 'critical':
        handleSendMessage('Alerta: Servidor de banco de dados de produção parou de responder conexões.');
        break;
      case 'status':
        handleSendMessage('Gostaria de consultar o status dos incidentes em andamento.');
        break;
    }
  };

  const processAIResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase();

    // 1. Caso: Reset de Senha / MFA / AD
    if (query.includes('senha') || query.includes('mfa') || query.includes('bloqueio') || query.includes('active directory')) {
      onAutoCreateTicket({
        title: 'Autoatendimento: Reset de MFA e Desbloqueio AD',
        description: 'Solicitação tratada pelo Virtual Agent. Validação biométrica Okta bem-sucedida.',
        requester: {
          name: 'Colaborador Solicitante',
          email: 'usuario.corporativo@empresa.com.br',
          department: 'Operações',
          location: 'Remoto',
        },
        priority: 'medium',
        priorityLevel: 3,
        category: 'access',
        impact: 'individual',
        tier: 'N1 - Suporte Ágil',
        slaMinutes: 180,
        tags: ['Autoatendimento', 'IAM', 'MFA', 'Okta'],
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: '✅ **Procedimento de Auto-Resolução Executado com Sucesso!**\n\n1. Identidade verificada via token seguro corporativo.\n2. As credenciais do Active Directory foram desbloqueadas.\n3. O token MFA Okta foi reinicializado.\n\n*Um chamado foi registrado e enfileirado na Fila O(1) para conformidade de auditoria.*',
          timestamp: Date.now(),
          diagnostics: [
            'IAM Service: Conexão segura TLS 1.3 estabelecida',
            'Active Directory DC-01: Conta reativada',
            'Auditoria: Evento registrado no log SOC'
          ]
        },
      ]);
      soundManager.playSuccess();
      return;
    }

    // 2. Caso: VPN / Rede / IPsec
    if (query.includes('vpn') || query.includes('rede') || query.includes('internet') || query.includes('ipsec') || query.includes('conexão')) {
      onAutoCreateTicket({
        title: 'Incidente de Rede: Queda de Túnel IPsec VPN',
        description: `Triagem via DeskFlow AI: Usuário reportou "${userQuery}". Testes de conectividade acusaram latência na porta 500/4500.`,
        requester: {
          name: 'Usuário Home Office',
          email: 'colaborador@empresa.com.br',
          department: 'Comercial & Vendas',
          location: 'Remoto - VPN Matriz',
        },
        priority: 'high',
        priorityLevel: 2,
        category: 'network',
        impact: 'department',
        tier: 'N3 - Infra & SecOps',
        slaMinutes: 60,
        tags: ['VPN', 'SD-WAN', 'AutoTriage', 'Tier-N3'],
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: '🌐 **Diagnóstico de Rede Concluído:**\n\nDetectamos uma instabilidade temporária no concentrador VPN Fortinet/IPsec. Para evitar atrasos, realizei a triagem automática e criei o chamado prioritário na **Fila O(1)** atribuído diretamente à equipe de **N3 - Infra & SecOps**.',
          timestamp: Date.now(),
          diagnostics: [
            'Ping Gateway 10.200.0.1: 18ms (OK)',
            'Handshake TLS VPN: Timeout na porta 4500',
            'Ação: Enfileirado em Head O(1) com prioridade P2 ALTA'
          ]
        },
      ]);
      soundManager.playPush();
      return;
    }

    // 3. Caso: Incidente Crítico / Servidor / Produção / DB
    if (query.includes('servidor') || query.includes('banco') || query.includes('produção') || query.includes('crítico') || query.includes('postgres') || query.includes('queda') || query.includes('crash')) {
      onAutoCreateTicket({
        title: '🚨 P1 Blocker: Falha em Servidor / Banco de Produção',
        description: `Alerta crítico via DeskFlow AI: "${userQuery}". Escalação imediata disparada para engenharia de plantão.`,
        requester: {
          name: 'Monitoramento & SRE',
          email: 'sre-oncall@empresa.com.br',
          department: 'Engenharia de Plataforma',
          isVip: true,
          location: 'Cloud Cluster us-east-1',
        },
        priority: 'critical',
        priorityLevel: 1,
        category: 'infrastructure',
        impact: 'enterprise',
        tier: 'N3 - Infra & SecOps',
        slaMinutes: 15,
        tags: ['P1-Blocker', 'SLA-15m', 'Cloud', 'AutoEscalate'],
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: '🚨 **ALERTA DE SEVERIDADE MÁXIMA (P1 CRÍTICO)**\n\nO incidente foi classificado como **Impacto Corporativo Total (SLA de 15 minutos)**. O ticket foi inserido no topo da **Fila de Prioridade O(1)** e a telemetria do SOC foi notificada.',
          timestamp: Date.now(),
          diagnostics: [
            'Criticidade: P1 Blocker / VIP Protocol',
            'SLA Alvo: < 15 minutos de resposta',
            'Alocação: N3 - Infra & SecOps On-Call'
          ]
        },
      ]);
      soundManager.playPush();
      return;
    }

    // 4. Caso: Consultar Status de Chamados
    if (query.includes('status') || query.includes('consultar') || query.includes('chamado') || query.includes('inc-')) {
      const allActive = [...priorityQueueTickets];
      const countQueue = allActive.length;
      const countResolved = resolvedTickets.length;

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `📊 **Status em Tempo Real do DeskFlow Enterprise:**\n\n• **Incidentes na Fila O(1):** ${countQueue} pendentes de atendimento.\n• **Incidentes Concluídos:** ${countResolved} incidentes com parecer RCA.\n• **Conformidade de SLA Atual:** 98.4% no prazo contratual.\n\nVocê pode clicar em qualquer chamado na lista lateral para inspecionar os ponteiros de memória e a trilha de auditoria.`,
          timestamp: Date.now(),
        },
      ]);
      return;
    }

    // Resposta Padrão / Triage Geral
    onAutoCreateTicket({
      title: `Incidente Solicitado: ${userQuery.substring(0, 50)}...`,
      description: `Triagem geral via DeskFlow AI Assistant: "${userQuery}". Aguardando atendimento do analista responsável.`,
      requester: {
        name: 'Usuário Corporativo',
        email: 'usuario@empresa.com.br',
        department: 'Administração',
      },
      priority: 'medium',
      priorityLevel: 3,
      category: 'software',
      impact: 'individual',
      tier: 'N1 - Suporte Ágil',
      slaMinutes: 180,
      tags: ['AutoTriage', 'ServiceDesk'],
    });

    setMessages((prev) => [
      ...prev,
      {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Compreendido. Registrei sua solicitação e realizei a triagem automática. O chamado foi inserido com sucesso na **Fila O(1)** para atendimento ágil pela equipe de suporte.`,
        timestamp: Date.now(),
      },
    ]);
    soundManager.playPush();
  };

  return (
    <>
      {/* Botão Flutuante de Autoatendimento AI (Canto Inferior Direito) */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir Autoatendimento com IA"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-bold text-xs rounded-full shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border border-emerald-300/40 group"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-950 border border-emerald-300" />
        </div>
        <span className="hidden sm:inline font-mono">DeskFlow AI • Autoatendimento</span>
      </button>

      {/* Janela de Chat Interativo */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] bg-slate-950/95 border border-slate-800 rounded-3xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-fade-in ring-1 ring-emerald-500/30">
          
          {/* Top Bar */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  DeskFlow AI Agent
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Nível 0 • RAG
                  </span>
                </h3>
                <p className="text-[10px] text-emerald-400/90 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Autoatendimento & Triage Ativos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-medium rounded-br-none shadow-md'
                      : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Diagnostics Box if present */}
                  {msg.diagnostics && (
                    <div className="mt-2.5 p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-mono space-y-1 text-slate-400">
                      <div className="flex items-center gap-1 text-emerald-400 font-bold mb-1">
                        <Terminal className="w-3 h-3" />
                        <span>Telemetria Executada:</span>
                      </div>
                      {msg.diagnostics.map((d, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <span className="text-slate-600">›</span>
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Action Options */}
                {msg.options && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={opt.action}
                        className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700/80 hover:border-emerald-500/40 transition-all font-mono active:scale-95"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 w-24 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-800/80 bg-slate-900/90 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              maxLength={200}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida ou relate um incidente..."
              className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 text-slate-950 rounded-xl transition-all font-bold active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
