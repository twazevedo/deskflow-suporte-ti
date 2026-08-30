import React from 'react';
import { 
  X, 
  Briefcase, 
  Code2, 
  CheckCircle2, 
  Zap, 
  Layers, 
  RotateCcw, 
  Award, 
  Cpu, 
  BookOpen,
  Sparkles,
  FileCheck2
} from 'lucide-react';

interface RecruiterGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecruiterGuideModal: React.FC<RecruiterGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="recruiter-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col custom-scrollbar">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 id="recruiter-guide-title" className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Guia do Recrutador & Arquitetura Técnica
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Diferencial para Portfólio
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Como este software comprova domínio prático em Estruturas de Dados e Arquitetura de Software
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar guia do recrutador"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-slate-300 text-xs leading-relaxed">
          
          {/* Card 1: Por que este projeto é relevante? */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              1. Por que este projeto se destaca em processos seletivos?
            </h3>
            <p className="text-slate-300">
              A maioria dos candidatos implementa estruturas de dados como exercícios acadêmicos de console (ex: prints de terminal). O <strong>DeskFlow</strong> conecta diretamente as estruturas de dados fundamentais da Ciência da Computação com <strong>regras de negócio reais de um Service Desk corporativo</strong>, tratando concorrência, estados e performance.
            </p>
          </div>

          {/* Card 2: Decisões Arquiteturais e Big-O */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              2. Decisões de Engenharia & Análise de Complexidade
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 font-mono">Fila FIFO (Queue) O(1)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">Head/Tail</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Implementada com <strong>Lista Duplamente Encadeada</strong>. Em filas de alta vazão, o <code className="text-slate-200">Array.shift()</code> nativo custa <strong>O(n)</strong> porque precisa re-indexar toda a memória. Nossa solução executa em <strong>O(1)</strong> constante.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 font-mono">Pilha LIFO (Stack) O(1)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">Top/Base</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Utilizada para o mecanismo de <strong>Desfazer (Undo/Redo)</strong>. Cada ação gera um frame no topo da pilha. A reversão ocorre em <strong>O(1)</strong> sem sobrecarregar o garbage collector.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Padrões de Projeto (Design Patterns) */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-400" />
              3. Padrões de Projeto & Boas Práticas Aplicadas
            </h3>
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Command Pattern (Padrão Comando):</strong> As ações de atendimento, resolução, cancelamento e transferência são encapsuladas em objetos de comando contendo seu estado anterior para execução e reversão simétrica.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>State Machine (Máquina de Estados de Chamados):</strong> Transições estritas de ciclo de vida (<code className="text-slate-200">queued</code> → <code className="text-slate-200">in_progress</code> → <code className="text-slate-200">resolved</code>) evitando inconsistências de concorrência.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Priority Queue com Tie-Breaking Determinístico:</strong> Chamados com a mesma criticidade respeitam rigorosamente a ordem cronológica de chegada (FIFO).</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Perguntas de Entrevista Respondidas */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              4. Como defender este projeto em uma entrevista técnica
            </h3>
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                <p className="font-semibold text-slate-200 mb-1">
                  ❓ <em>"Por que você escolheu implementar suas próprias classes de Fila e Pilha em vez de usar os métodos nativos do JavaScript?"</em>
                </p>
                <p className="text-slate-400">
                  💡 <strong>Resposta:</strong> "Em JavaScript, arrays nativos são vetores contíguos dinâmicos. Quando chamamos <code className="text-slate-300">Array.shift()</code> para desenfileirar, o motor V8 precisa deslocar todos os outros $N-1$ elementos em memória, degradando a performance para $O(n)$. Com listas duplamente encadeadas, a remoção do Head e inserção no Tail são garantidamente $O(1)$, o que é crítico para sistemas de mensageria e processamento em lote."
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80">
                <p className="font-semibold text-slate-200 mb-1">
                  ❓ <em>"Como você garantiu a corretude dos algoritmos?"</em>
                </p>
                <p className="text-slate-400">
                  💡 <strong>Resposta:</strong> "Escrevi uma suíte de testes unitários automatizados com Vitest com 100% de cobertura nos métodos <code className="text-slate-300">enqueue</code>, <code className="text-slate-300">dequeue</code>, <code className="text-slate-300">enqueueFront</code>, <code className="text-slate-300">push</code>, <code className="text-slate-300">pop</code> e na árvore de reversão de histórico."
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/90">
          <span className="text-[11px] text-slate-500 font-mono">
            DeskFlow • Arquitetura de Software & Estruturas de Dados Puras
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            Entendido, fechar guia
          </button>
        </div>

      </div>
    </div>
  );
};
