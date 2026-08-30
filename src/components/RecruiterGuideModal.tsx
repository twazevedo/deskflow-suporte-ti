import React from 'react';
import { 
  X, 
  Code2, 
  CheckCircle2, 
  Zap, 
  Layers, 
  RotateCcw, 
  Cpu, 
  BookOpen,
  FileCheck2,
  ShieldCheck,
  Binary
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
      aria-labelledby="architecture-guide-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col custom-scrollbar">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h2 id="architecture-guide-title" className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Documentação de Arquitetura & Engenharia de Software
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Especificação Técnica
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Detalhamento dos requisitos, estruturas de dados puras e análise assintótica de complexidade
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar documentação"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-slate-300 text-xs leading-relaxed">
          
          {/* Card 1: Escopo e Requisitos */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              1. Escopo Arquitetural e Requisitos Não-Funcionais
            </h3>
            <p className="text-slate-300">
              O <strong>DeskFlow Enterprise</strong> é um sistema projetado para atender aos padrões de alta disponibilidade e baixa latência de ambientes corporativos. A arquitetura desacopla a camada de gerenciamento de estado visual das estruturas de dados puras em memória, assegurando previsibilidade de execução e isolamento total de efeitos colaterais.
            </p>
          </div>

          {/* Card 2: Decisões Arquiteturais e Big-O */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              2. Análise Assintótica & Complexidade Computacional (Big-O)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 font-mono">Fila FIFO (Queue) O(1)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">Head / Tail</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Implementada como <strong>Lista Duplamente Encadeada</strong>. Em filas com milhares de nós, a operação <code className="text-slate-200">Array.shift()</code> nativa possui custo linear <strong>O(n)</strong> devido ao deslocamento contíguo de memória. Nossa implementação assegura custo estritamente <strong>O(1)</strong> constante.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 font-mono">Pilha LIFO (Stack) O(1)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">Top / Base</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Base do mecanismo de <strong>Rollback Transacional (Undo/Redo)</strong>. Cada transição de estado é empilhada com referências atômicas, permitindo restauração instantânea em <strong>O(1)</strong> com limpeza explícita de ponteiros para o Garbage Collector.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Padrões de Projeto (Design Patterns) */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-400" />
              3. Padrões de Projeto & Máquina de Estados
            </h3>
            <ul className="space-y-2 text-[11px] text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Command Pattern:</strong> Todas as operações (atendimento, conclusão, transferência e cancelamento) são encapsuladas em objetos de comando simétricos, possibilitando execução e reversão atômica.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>State Machine (Transição Determinística):</strong> Fluxo controlado de ciclo de vida (<code className="text-slate-200">queued</code> → <code className="text-slate-200">in_progress</code> → <code className="text-slate-200">resolved</code>) prevenindo estados inválidos.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Priority Queue com Tie-Breaking:</strong> Ordenação dinâmica baseada em severidade SLA com garantia estrita de FIFO para incidentes com a mesma prioridade.</span>
              </li>
            </ul>
          </div>

          {/* Card 4: Qualidade e Confiabilidade */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              4. Garantia de Qualidade & Cobertura de Testes
            </h3>
            <p className="text-slate-300">
              A confiabilidade de todas as estruturas e fluxos é validada por uma suíte de <strong>16 testes unitários automatizados com Vitest</strong> e integração contínua (CI/CD) via GitHub Actions, cobrindo cenários nominais, concorrência simulada e casos de borda.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800/80 flex items-center justify-between bg-slate-900/90">
          <span className="text-[11px] text-slate-500 font-mono">
            DeskFlow Enterprise • Especificação de Engenharia de Software
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-indigo-400 to-cyan-400 hover:from-indigo-300 hover:to-cyan-300 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            Fechar Documentação
          </button>
        </div>

      </div>
    </div>
  );
};

