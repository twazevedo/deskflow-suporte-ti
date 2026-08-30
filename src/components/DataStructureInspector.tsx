import React, { useState } from 'react';
import { Ticket } from '../types/ticket';
import { DeskAction } from '../types/action';
import { 
  Cpu, 
  Layers, 
  ArrowRight, 
  ArrowDown, 
  RotateCcw, 
  Zap, 
  Info, 
  Clock, 
  ShieldCheck,
  Code2,
  Copy,
  Check
} from 'lucide-react';

interface DataStructureInspectorProps {
  queueVisualNodes: Array<{
    id: string;
    value: Ticket;
    isHead: boolean;
    isTail: boolean;
    nextId: string | null;
    prevId: string | null;
  }>;
  stackVisualNodes: Array<{
    id: string;
    value: DeskAction;
    isTop: boolean;
    isBase: boolean;
    nextId: string | null;
  }>;
  undoCount: number;
  redoCount: number;
}

export const DataStructureInspector: React.FC<DataStructureInspectorProps> = ({
  queueVisualNodes,
  stackVisualNodes,
  undoCount,
  redoCount,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySnapshot = async () => {
    const payload = {
      timestamp: new Date().toISOString(),
      queueState: {
        type: 'DoublyLinkedList_FIFO_Queue',
        timeComplexity: 'O(1)',
        nodesCount: queueVisualNodes.length,
        nodes: queueVisualNodes,
      },
      stackState: {
        type: 'LinkedList_LIFO_Stack',
        timeComplexity: 'O(1)',
        framesCount: stackVisualNodes.length,
        frames: stackVisualNodes,
      },
    };

    const jsonString = JSON.stringify(payload, null, 2);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(jsonString);
      } else {
        // Fallback for non-secure / restricted environments
        const textArea = document.createElement('textarea');
        textArea.value = jsonString;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Gracefully handle clipboard rejection without breaking the UI
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl shadow-xl flex flex-col gap-6">
      
      {/* Inspector Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Inspetor de Memória & Estruturas de Dados
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Pure TypeScript O(1)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualização gráfica dos nós encadeados (Nodes), ponteiros e alocação LIFO/FIFO
            </p>
          </div>
        </div>

        <button
          onClick={handleCopySnapshot}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors self-start sm:self-auto"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          <span>{copied ? 'Snapshot Copiado!' : 'Copiar Estado JSON'}</span>
        </button>
      </div>

      {/* Grid: Live Queue Nodes & Live Stack Frames */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Section 1: Live Queue (FIFO) Linked List Visualization */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Fila FIFO: Encadeamento Duplo O(1)
              </h4>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              {queueVisualNodes.length} nós ativos
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
            Inserções no <strong className="text-emerald-300">TAIL</strong> e extrações no <strong className="text-emerald-300">HEAD</strong> com custo estrito <span className="font-mono text-emerald-400 font-bold">O(1)</span> (sem re-indexação de array em memória).
          </p>

          {/* Queue Nodes Chain */}
          <div className="flex-1 overflow-x-auto pb-3 custom-scrollbar">
            {queueVisualNodes.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-2xl">
                [Head: null] ⇄ [Tail: null] - Fila vazia
              </div>
            ) : (
              <div className="flex items-center gap-3 min-w-max py-2">
                {queueVisualNodes.map((node, i) => (
                  <div key={node.id} className="flex items-center gap-2">
                    {/* Single Linked Node Box */}
                    <div
                      className={`p-3.5 rounded-2xl border flex flex-col gap-1 w-48 transition-all ${
                        node.isHead
                          ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/30'
                          : node.isTail
                          ? 'bg-slate-900 border-indigo-500/40'
                          : 'bg-slate-900/80 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {node.id}
                        </span>
                        {node.isHead && (
                          <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950">
                            HEAD
                          </span>
                        )}
                        {node.isTail && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                            TAIL
                          </span>
                        )}
                      </div>

                      <div className="mt-1">
                        <span className="text-xs font-mono font-bold text-slate-100 block truncate">
                          {node.value.id}: {node.value.title}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                          Req: {node.value.requester.name}
                        </span>
                      </div>

                      {/* Memory pointers representation */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] font-mono text-slate-500">
                        <span>prev: {node.prevId ? node.prevId.substring(0, 6) : 'null'}</span>
                        <span>next: {node.nextId ? node.nextId.substring(0, 6) : 'null'}</span>
                      </div>
                    </div>

                    {/* Doubly Linked Arrow */}
                    {i < queueVisualNodes.length - 1 && (
                      <div className="flex flex-col items-center justify-center text-slate-600 font-mono text-xs px-1">
                        <span className="text-emerald-500/80 font-bold">⇄</span>
                        <span className="text-[8px] text-slate-500">next/prev</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Live Action History Stack (LIFO) Visualization */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Pilha LIFO: Desfazer Ações (Undo Stack)
              </h4>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {stackVisualNodes.length} ações no Topo
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
            O comando <strong className="text-amber-300">Desfazer (Undo)</strong> faz <code className="text-slate-300">pop()</code> do <strong className="text-amber-300">TOP</strong> da Pilha em <span className="font-mono text-amber-400 font-bold">O(1)</span>, invertendo a última alteração de estado no sistema.
          </p>

          {/* Stack Frames Vertical Container */}
          <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 space-y-2 custom-scrollbar">
            {stackVisualNodes.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-2xl">
                [Top: null] - Pilha de histórico vazia. Nenhuma ação recente gravada.
              </div>
            ) : (
              stackVisualNodes.map((frame, i) => (
                <div
                  key={frame.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    frame.isTop
                      ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-950/30 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      frame.isTop
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {frame.isTop ? 'TOP' : `#${stackVisualNodes.length - i}`}
                    </span>

                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {frame.value.type}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ({frame.value.ticketId})
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 truncate">
                        {frame.value.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {new Date(frame.value.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Complexity & Computer Science Tradeoffs Card */}
      <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-5">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
          <Code2 className="w-4 h-4 text-sky-400" />
          Tabela de Complexidade Algorítmica (Big-O Notation)
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Estrutura</th>
                <th className="pb-2 font-semibold">Operação</th>
                <th className="pb-2 font-semibold text-emerald-400">Nossa Solução (Ponteiros)</th>
                <th className="pb-2 font-semibold text-rose-400">Array Nativo JS (shift/unshift)</th>
                <th className="pb-2 font-semibold text-slate-300">Justificativa Técnica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-2.5 font-bold text-white">Queue (FIFO)</td>
                <td className="py-2.5">enqueue() [Tail]</td>
                <td className="py-2.5 text-emerald-400 font-bold">O(1)</td>
                <td className="py-2.5 text-emerald-400">O(1) amortizado</td>
                <td className="py-2.5 text-slate-400 font-sans text-[11px]">Atualiza ponteiro <code className="text-slate-200">tail.next</code> diretamente</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Queue (FIFO)</td>
                <td className="py-2.5">dequeue() [Head]</td>
                <td className="py-2.5 text-emerald-400 font-bold">O(1)</td>
                <td className="py-2.5 text-rose-400 font-bold">O(n) [Gargalo]</td>
                <td className="py-2.5 text-slate-400 font-sans text-[11px]"><code className="text-slate-200">Array.shift()</code> precisa re-indexar todos os N elementos em memória</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-white">Stack (LIFO)</td>
                <td className="py-2.5">push() / pop()</td>
                <td className="py-2.5 text-emerald-400 font-bold">O(1)</td>
                <td className="py-2.5 text-emerald-400">O(1)</td>
                <td className="py-2.5 text-slate-400 font-sans text-[11px]">Manipulação instantânea do topo da pilha de histórico</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
