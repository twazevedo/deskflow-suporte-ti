import React, { useState } from 'react';
import { 
  Ticket, 
  TicketPriority, 
  TicketCategory, 
  PRIORITY_MAP, 
  CATEGORY_MAP 
} from '../types/ticket';
import { TICKET_TEMPLATES } from '../data/mockData';
import { 
  X, 
  Plus, 
  Sparkles, 
  Laptop, 
  Code, 
  Wifi, 
  KeyRound, 
  ShieldAlert, 
  Server,
  Zap
} from 'lucide-react';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTicket: Omit<Ticket, 'id' | 'createdAt' | 'status'>) => void;
}

export const NewTicketModal: React.FC<NewTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requesterName, setRequesterName] = useState('Mariana Silva');
  const [requesterEmail, setRequesterEmail] = useState('mariana.s@empresa.com.br');
  const [department, setDepartment] = useState('Financeiro');
  const [location, setLocation] = useState('Sede SP - 8º Andar');
  const [isVip, setIsVip] = useState(false);
  const [priority, setPriority] = useState<TicketPriority>('high');
  const [category, setCategory] = useState<TicketCategory>('software');
  const [impact, setImpact] = useState<'enterprise' | 'department' | 'individual'>('department');
  const [tier, setTier] = useState<'N1 - Suporte Ágil' | 'N2 - Sistemas & Cloud' | 'N3 - Infra & SecOps'>('N1 - Suporte Ágil');
  const [tagsInput, setTagsInput] = useState('ERP, Faturamento');

  if (!isOpen) return null;

  const handleTemplateSelect = (template: typeof TICKET_TEMPLATES[0]) => {
    setTitle(template.title);
    setDescription(template.description);
    setRequesterName(template.requester.name);
    setRequesterEmail(template.requester.email);
    setDepartment(template.requester.department);
    setLocation(template.requester.location || 'Sede Principal');
    setIsVip(template.priority === 'critical');
    setPriority(template.priority);
    setCategory(template.category);
    setImpact(template.impact || 'department');
    setTier(template.tier || 'N1 - Suporte Ágil');
    setTagsInput(template.tags.join(', '));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();
    if (!sanitizedTitle || !sanitizedDescription) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().substring(0, 20))
      .filter(Boolean);

    onSubmit({
      title: sanitizedTitle.substring(0, 120),
      description: sanitizedDescription.substring(0, 1000),
      requester: {
        name: requesterName.trim().substring(0, 60) || 'Solicitante Anônimo',
        email: requesterEmail.trim().substring(0, 80) || 'usuario@empresa.com.br',
        department: department.trim().substring(0, 50) || 'Geral',
        location: location.trim().substring(0, 50) || 'Sede Principal',
        isVip,
      },
      priority,
      priorityLevel: PRIORITY_MAP[priority].level,
      category,
      impact,
      tier,
      slaMinutes: PRIORITY_MAP[priority].sla,
      tags: tags.length > 0 ? tags : ['ITSM'],
      auditHistory: [
        { timestamp: Date.now(), actor: requesterName, action: 'INCIDENT_CREATED', details: 'Abertura manual via Portal Service Desk' }
      ]
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-ticket-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col custom-scrollbar">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 id="new-ticket-modal-title" className="text-base font-bold text-white tracking-tight">
                Abrir Novo Chamado de Suporte TI
              </h2>
              <p className="text-xs text-slate-400">
                O chamado será inserido na Fila FIFO e Fila de Prioridade O(1)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Rápidos */}
        <div className="px-6 pt-5 pb-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Templates Rápidos de Incidentes Reais:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TICKET_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTemplateSelect(tmpl)}
                className="text-left p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-xs flex items-center justify-between group"
              >
                <div className="truncate mr-2">
                  <span className="font-semibold text-slate-200 block truncate group-hover:text-emerald-300">
                    {tmpl.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {tmpl.category} • {tmpl.priority.toUpperCase()}
                  </span>
                </div>
                <Zap className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Assunto / Título do Incidente:
            </label>
            <input
              type="text"
              required
              maxLength={120}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Falha de autenticação ao conectar no servidor de arquivos"
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Descrição Detalhada do Problema:
            </label>
            <textarea
              required
              rows={3}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a mensagem de erro exata, passos executados e impacto na operação..."
              className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nível de Prioridade / SLA:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TicketPriority)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="critical">Crítico / SLA 15m (VIP / Sistemas fora)</option>
                <option value="high">Alta Prioridade / SLA 60m</option>
                <option value="medium">Média Prioridade / SLA 180m</option>
                <option value="low">Baixa Prioridade / SLA 480m</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Categoria de TI:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="software">Software & Aplicações</option>
                <option value="network">Redes, Firewall & VPN</option>
                <option value="access">Acessos, Senhas & AD</option>
                <option value="hardware">Hardware & Periféricos</option>
                <option value="security">Segurança & Phishing</option>
                <option value="infrastructure">Servidores & Cloud</option>
              </select>
            </div>
          </div>

          {/* Requester Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Solicitante:
              </label>
              <input
                type="text"
                required
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Departamento:
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                E-mail:
              </label>
              <input
                type="email"
                required
                value={requesterEmail}
                onChange={(e) => setRequesterEmail(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200"
              />
            </div>
          </div>

          {/* VIP Checkbox & Tags */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isVip}
                onChange={(e) => setIsVip(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-800 focus:ring-0"
              />
              <span>Solicitante VIP / Diretoria Executiva</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Tags:</span>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: ERP, SAP, Urgente"
                className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Inserir na Fila (Enqueue O(1))</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
