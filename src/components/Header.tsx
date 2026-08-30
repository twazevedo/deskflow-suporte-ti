import { 
  Layers, 
  Undo2, 
  Redo2, 
  Plus, 
  Sparkles, 
  Cpu, 
  RotateCcw, 
  Zap, 
  Volume2, 
  VolumeX, 
  Briefcase,
  ShieldCheck,
  Download,
  Play,
  Pause,
  Activity,
  Bot
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface HeaderProps {
  queueSize: number;
  undoCount: number;
  redoCount: number;
  onUndo: () => void;
  onRedo: () => void;
  onOpenNewTicketModal: () => void;
  onOpenRecruiterModal: () => void;
  onOpenAIChat?: () => void;
  onInjectSimulatedTickets: () => void;
  onResetDemo: () => void;
  onExportReport: () => void;
  isAutoStreamActive: boolean;
  onToggleAutoStream: () => void;
  activeTab: 'board' | 'lab';
  setActiveTab: (tab: 'board' | 'lab') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  queueSize,
  undoCount,
  redoCount,
  onUndo,
  onRedo,
  onOpenNewTicketModal,
  onOpenRecruiterModal,
  onOpenAIChat,
  onInjectSimulatedTickets,
  onResetDemo,
  onExportReport,
  isAutoStreamActive,
  onToggleAutoStream,
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
}) => {
  const toggleSound = () => {
    const nextState = !soundEnabled;
    soundManager.enabled = nextState;
    setSoundEnabled(nextState);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/80 px-4 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-2">
                  DeskFlow Enterprise
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    ITIL v4 • O(1) Engine
                  </span>
                </h1>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400/90 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  SOC Guard Operacional
                </span>
                <span>•</span>
                <span>Fila O(1) + Command Pattern Stack</span>
              </div>
            </div>
          </div>

          {/* Mobile view tabs */}
          <div className="flex md:hidden items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'board' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Mesa
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'lab' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Lab
            </button>
          </div>
        </div>

        {/* Center navigation tabs (Desktop) */}
        <div className="hidden md:flex items-center bg-slate-900/80 p-1 rounded-2xl border border-slate-800/80 shadow-inner">
          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'board'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Mesa de Incidentes
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'lab'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Lab de Algoritmos & Benchmark
          </button>
        </div>

        {/* Actions bar: Auto-Stream, Recruiter Guide, Undo/Redo, Export, Add Incident */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          
          {/* Live Incident Stream Toggle */}
          <button
            onClick={onToggleAutoStream}
            title="Simular Tráfego Contínuo de Incidentes Corporativos (Streaming NOC)"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-2xl border transition-all ${
              isAutoStreamActive
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-950/40 animate-pulse'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800'
            }`}
          >
            {isAutoStreamActive ? <Pause className="w-3.5 h-3.5 text-rose-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden lg:inline">{isAutoStreamActive ? 'Pausar NOC Feed' : 'Live Feed NOC'}</span>
          </button>

          {/* Export Incident Report */}
          <button
            onClick={onExportReport}
            title="Exportar Relatório Corporativo de Incidentes e Auditoria em CSV"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden xl:inline">Exportar CSV</span>
          </button>

          {/* Architecture Docs Button */}
          <button
            onClick={onOpenRecruiterModal}
            title="Visualizar especificação técnica e decisões de arquitetura"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Docs de Arquitetura</span>
          </button>

          {/* Undo / Stack Action */}
          <div className="flex items-center bg-slate-900/90 rounded-2xl border border-slate-800 p-0.5 shadow-sm">
            <button
              onClick={onUndo}
              disabled={undoCount === 0}
              title="Desfazer Última Ação (Ctrl+Z) - Operação de Pilha (LIFO pop)"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 rounded-xl hover:bg-slate-800/80 transition-all active:scale-95"
            >
              <Undo2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Desfazer</span>
              {undoCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {undoCount}
                </span>
              )}
            </button>

            <div className="h-4 w-px bg-slate-800" />

            <button
              onClick={onRedo}
              disabled={redoCount === 0}
              title="Refazer Ação (Ctrl+Y) - LIFO Redo Stack"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-40 disabled:hover:text-slate-300 rounded-xl hover:bg-slate-800/80 transition-all active:scale-95"
            >
              <Redo2 className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Refazer</span>
              {redoCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {redoCount}
                </span>
              )}
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar micro-sons' : 'Ativar feedback sonoro'}
            className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick Simulate Batch */}
          <button
            onClick={onInjectSimulatedTickets}
            title="Injetar Chamados Simulados na Fila"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">+ Carga</span>
          </button>

          {/* AI Auto-Service Button */}
          <button
            onClick={onOpenAIChat}
            title="Abrir Agente Virtual de Autoatendimento com IA (Triage & Reset Automático)"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 rounded-2xl shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.03] active:scale-95 border border-teal-200/40"
          >
            <Bot className="w-4 h-4 text-slate-950" />
            <span>Autoatendimento IA</span>
          </button>

          {/* New Incident */}
          <button
            onClick={onOpenNewTicketModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Incidente</span>
          </button>

          {/* Reset Demo */}
          <button
            onClick={onResetDemo}
            title="Reiniciar dados de demonstração"
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 bg-slate-950/60 border border-slate-800 rounded-2xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

