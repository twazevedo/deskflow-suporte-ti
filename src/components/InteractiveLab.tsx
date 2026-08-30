import React, { useState } from 'react';
import { Queue } from '../structures/Queue';
import { Stack } from '../structures/Stack';
import { PriorityQueue } from '../structures/PriorityQueue';
import { 
  Play, 
  RotateCcw, 
  Layers, 
  ArrowRight, 
  ArrowDown, 
  Plus, 
  Trash2, 
  Sparkles,
  Code2,
  Cpu,
  Gauge,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { soundManager } from '../utils/sound';

export const InteractiveLab: React.FC = () => {
  const [labQueue] = useState(() => new Queue<string>());
  const [labStack] = useState(() => new Stack<string>());
  const [labPQ] = useState(() => new PriorityQueue<string>());

  const [queueInput, setQueueInput] = useState('Chamado-Incidente-01');
  const [stackInput, setStackInput] = useState('Ação-Atendimento-01');
  const [pqInput, setPqInput] = useState('Incidente-VIP-NOC');
  const [pqPriority, setPqPriority] = useState<number>(1);

  const [queueItems, setQueueItems] = useState<string[]>([]);
  const [stackItems, setStackItems] = useState<string[]>([]);
  const [pqItems, setPqItems] = useState<Array<{ data: string; priority: number }>>([]);

  // Benchmark State
  const [benchmarkRunning, setBenchmarkRunning] = useState(false);
  const [benchmarkResult, setBenchmarkResult] = useState<{
    elementsCount: number;
    queueTimeMs: number;
    arrayTimeMs: number;
    speedupRatio: number;
  } | null>(null);

  const [executionLog, setExecutionLog] = useState<Array<{ text: string; codeSnippet: string; time: string }>>([
    {
      text: 'Laboratório de Algoritmos Inicializado com sucesso.',
      codeSnippet: 'const queue = new Queue<T>(); const stack = new Stack<T>();',
      time: new Date().toLocaleTimeString(),
    }
  ]);

  const logOperation = (text: string, codeSnippet: string) => {
    setExecutionLog((prev) => [
      {
        text,
        codeSnippet,
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 19),
    ]);
  };

  // Run Real In-Browser Benchmark
  const runBenchmark = () => {
    setBenchmarkRunning(true);
    setTimeout(() => {
      const N = 40000;

      // Test 1: Pure Linked List Queue (O(1))
      const testQueue = new Queue<number>();
      for (let i = 0; i < N; i++) {
        testQueue.enqueue(i);
      }
      const t0 = performance.now();
      for (let i = 0; i < N; i++) {
        testQueue.dequeue();
      }
      const t1 = performance.now();
      const queueTimeMs = Math.max(0.1, Number((t1 - t0).toFixed(2)));

      // Test 2: Native JS Array with shift() (O(n))
      const testArray: number[] = [];
      for (let i = 0; i < N; i++) {
        testArray.push(i);
      }
      const t2 = performance.now();
      for (let i = 0; i < N; i++) {
        testArray.shift();
      }
      const t3 = performance.now();
      const arrayTimeMs = Math.max(0.1, Number((t3 - t2).toFixed(2)));

      const speedupRatio = Number((arrayTimeMs / queueTimeMs).toFixed(1));

      setBenchmarkResult({
        elementsCount: N,
        queueTimeMs,
        arrayTimeMs,
        speedupRatio,
      });

      soundManager.playSuccess();
      logOperation(
        `Benchmark Concluído com ${N.toLocaleString()} operações: Queue O(1) (${queueTimeMs}ms) vs Array shift() O(n) (${arrayTimeMs}ms)`,
        `// Speedup: Nossa fila foi ${speedupRatio}x mais veloz que Array.shift() em ${N} operações!`
      );
      setBenchmarkRunning(false);
    }, 50);
  };

  // Queue Handlers
  const handleEnqueue = () => {
    if (!queueInput.trim()) return;
    labQueue.enqueue(queueInput);
    setQueueItems(labQueue.toArray());
    soundManager.playPush();
    logOperation(
      `Fila (Queue): enqueue("${queueInput}") inserido no TAIL (Fim) em O(1)`,
      `newNode.prev = this.tail;\nthis.tail.next = newNode;\nthis.tail = newNode;\nthis.count++;`
    );
    setQueueInput(`Chamado-Incidente-0${queueItems.length + 2}`);
  };

  const handleDequeue = () => {
    const val = labQueue.dequeue();
    setQueueItems(labQueue.toArray());
    if (val) {
      soundManager.playPop();
      logOperation(
        `Fila (Queue): dequeue() removeu "${val}" do HEAD (Início) em O(1)`,
        `const val = this.head.value;\nthis.head = this.head.next;\nif (this.head) this.head.prev = null;\nthis.count--;`
      );
    }
  };

  const handleEnqueueFront = () => {
    if (!queueInput.trim()) return;
    labQueue.enqueueFront(`${queueInput} (Restaurado)`);
    setQueueItems(labQueue.toArray());
    soundManager.playPush();
    logOperation(
      `Fila (Queue): enqueueFront("${queueInput}") inserido no HEAD (Rollback de Desfazer)`,
      `newNode.next = this.head;\nif (this.head) this.head.prev = newNode;\nthis.head = newNode;`
    );
  };

  // Stack Handlers
  const handlePush = () => {
    if (!stackInput.trim()) return;
    labStack.push(stackInput);
    setStackItems(labStack.toArray());
    soundManager.playPush();
    logOperation(
      `Pilha (Stack): push("${stackInput}") adicionado no TOPO em O(1)`,
      `newNode.next = this.topNode;\nthis.topNode = newNode;\nthis.count++;`
    );
    setStackInput(`Ação-Atendimento-0${stackItems.length + 2}`);
  };

  const handlePop = () => {
    const val = labStack.pop();
    setStackItems(labStack.toArray());
    if (val) {
      soundManager.playPop();
      logOperation(
        `Pilha (Stack): pop() desempilhou "${val}" do TOPO em O(1)`,
        `const val = this.topNode.value;\nthis.topNode = this.topNode.next;\nthis.count--;`
      );
    }
  };

  // Priority Queue Handlers
  const handlePQEnqueue = () => {
    if (!pqInput.trim()) return;
    labPQ.enqueue(pqInput, pqPriority);
    setPqItems(labPQ.toItems().map((i) => ({ data: i.data, priority: i.priority })));
    soundManager.playPush();
    logOperation(
      `Fila de Prioridade: enqueue("${pqInput}", prioridade: ${pqPriority})`,
      `// Inserção ordenada preservando FIFO para prioridades iguais\nthis.insertSorted(newNode, priority);`
    );
    setPqInput(`Incidente-VIP-${pqItems.length + 2}`);
  };

  const handlePQDequeue = () => {
    const val = labPQ.dequeue();
    setPqItems(labPQ.toItems().map((i) => ({ data: i.data, priority: i.priority })));
    if (val) {
      soundManager.playPop();
      logOperation(
        `Fila de Prioridade: dequeue() removeu o elemento mais prioritário "${val}" em O(1)`,
        `const val = this.head.value.data;\nthis.head = this.head.next;\nthis.count--;`
      );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Benchmark Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Laboratório Interativo & Benchmark de Performance
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Teste de Estresse
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Execute testes práticos de ponteiros e compare a performance contra arrays nativos
              </p>
            </div>
          </div>

          {/* Benchmark Action Button */}
          <button
            onClick={runBenchmark}
            disabled={benchmarkRunning}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 disabled:opacity-50 rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 shrink-0"
          >
            <Gauge className="w-4 h-4" />
            <span>{benchmarkRunning ? 'Processando 40.000 nós...' : 'Executar Benchmark (40.000 Operações)'}</span>
          </button>
        </div>

        {/* Benchmark Results Display */}
        {benchmarkResult && (
          <div className="mt-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-slide-in text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-1">
              <span className="text-[11px] font-semibold text-emerald-400">Nossa Fila O(1) (Lista Encadeada)</span>
              <div className="text-xl font-bold font-mono text-white">{benchmarkResult.queueTimeMs} ms</div>
              <span className="text-[10px] text-slate-400">Tempo total para 40.000 dequeues</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-1">
              <span className="text-[11px] font-semibold text-rose-400">Array JS Nativo O(n) (Array.shift)</span>
              <div className="text-xl font-bold font-mono text-white">{benchmarkResult.arrayTimeMs} ms</div>
              <span className="text-[10px] text-slate-400">Tempo total para 40.000 shifts</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1">
              <span className="text-[11px] font-semibold text-amber-400">Ganho de Performance (Speedup)</span>
              <div className="text-xl font-bold font-mono text-amber-300">{benchmarkResult.speedupRatio}x mais rápido</div>
              <span className="text-[10px] text-slate-400">Eliminação do gargalo de memória</span>
            </div>
          </div>
        )}
      </div>

      {/* 3 Sandboxes: Queue, Priority Queue, Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sandbox 1: FIFO Queue */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Fila FIFO Pura</h3>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Tamanho: {queueItems.length}
              </span>
            </div>

            <div className="space-y-2.5">
              <input
                type="text"
                value={queueInput}
                onChange={(e) => setQueueInput(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500/50"
                placeholder="Valor do elemento..."
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEnqueue}
                  className="flex-1 px-3 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all active:scale-95"
                >
                  Enqueue (Tail)
                </button>
                <button
                  onClick={handleDequeue}
                  disabled={queueItems.length === 0}
                  className="flex-1 px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl transition-all active:scale-95"
                >
                  Dequeue (Head)
                </button>
              </div>
              <button
                onClick={handleEnqueueFront}
                className="w-full px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-colors"
              >
                Enqueue Front (Rollback Undo)
              </button>
            </div>

            {/* Visual Box */}
            <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl min-h-[120px] max-h-[160px] overflow-y-auto space-y-1.5 custom-scrollbar">
              {queueItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">Fila vazia</div>
              ) : (
                queueItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-mono ${
                      idx === 0
                        ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-bold'
                        : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    <span className="truncate">{item}</span>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                      {idx === 0 ? 'HEAD' : idx === queueItems.length - 1 ? 'TAIL' : `#${idx}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sandbox 2: Priority Queue */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">Fila de Prioridade SLA</h3>
              </div>
              <span className="text-xs font-mono font-bold text-rose-400">
                Tamanho: {pqItems.length}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pqInput}
                  onChange={(e) => setPqInput(e.target.value)}
                  className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-rose-500/50"
                  placeholder="Nome do chamado..."
                />
                <select
                  aria-label="Nível de prioridade"
                  value={pqPriority}
                  onChange={(e) => setPqPriority(Number(e.target.value))}
                  className="text-xs bg-slate-950 border border-slate-800 rounded-xl px-2 text-slate-200 focus:outline-none"
                >
                  <option value={1}>1: Crítico</option>
                  <option value={2}>2: Alta</option>
                  <option value={3}>3: Média</option>
                  <option value={4}>4: Baixa</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePQEnqueue}
                  className="flex-1 px-3 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all active:scale-95"
                >
                  Enqueue Priority
                </button>
                <button
                  onClick={handlePQDequeue}
                  disabled={pqItems.length === 0}
                  className="flex-1 px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl transition-all active:scale-95"
                >
                  Dequeue
                </button>
              </div>
            </div>

            {/* Visual Box */}
            <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl min-h-[120px] max-h-[160px] overflow-y-auto space-y-1.5 custom-scrollbar">
              {pqItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">Fila vazia</div>
              ) : (
                pqItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-mono bg-slate-900 border border-slate-800"
                  >
                    <span className="text-slate-200 truncate">{item.data}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-2 ${
                      item.priority === 1
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : item.priority === 2
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      Prio {item.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sandbox 3: LIFO Stack */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Pilha LIFO (Histórico)</h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                Tamanho: {stackItems.length}
              </span>
            </div>

            <div className="space-y-2.5">
              <input
                type="text"
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-500/50"
                placeholder="Ação para empilhar..."
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePush}
                  className="flex-1 px-3 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all active:scale-95"
                >
                  Push (Topo)
                </button>
                <button
                  onClick={handlePop}
                  disabled={stackItems.length === 0}
                  className="flex-1 px-3 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl transition-all active:scale-95"
                >
                  Pop (Desempilhar)
                </button>
              </div>
            </div>

            {/* Visual Box */}
            <div className="mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl min-h-[120px] max-h-[160px] overflow-y-auto space-y-1.5 custom-scrollbar">
              {stackItems.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">Pilha vazia</div>
              ) : (
                stackItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded-xl text-xs font-mono ${
                      idx === 0
                        ? 'bg-amber-950/40 border border-amber-500/40 text-amber-300 font-bold'
                        : 'bg-slate-900 text-slate-300'
                    }`}
                  >
                    <span className="truncate">{item}</span>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                      {idx === 0 ? 'TOP' : `Frame #${stackItems.length - idx}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Execution Trace & Algorithm Output */}
      <div className="bg-slate-950/90 border border-slate-800/80 rounded-3xl p-6">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Trilha de Execução Algorítmica & Código Fonte Interno
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {executionLog.length} operações registradas
          </span>
        </div>

        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
          {executionLog.map((log, index) => (
            <div
              key={index}
              className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 font-mono text-xs"
            >
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-semibold text-emerald-300">{log.text}</span>
                <span className="text-[10px] text-slate-500">{log.time}</span>
              </div>
              <pre className="mt-2 p-2.5 bg-slate-950 rounded-xl text-[11px] text-indigo-300 overflow-x-auto border border-slate-800/60">
                <code>{log.codeSnippet}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
