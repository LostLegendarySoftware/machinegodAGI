import React from 'react';
import { 
  Activity, Brain, Users, Zap, Archive, Database, 
  BarChart2, Cpu, Shield, Layers, Sparkles 
} from 'lucide-react';

interface HUDPanelProps {
  title: string;
  icon: React.ReactNode;
  metrics: {
    label: string;
    value: number | string;
    max?: number;
    color?: string;
  }[];
  active?: boolean;
}

export const HUDPanel: React.FC<HUDPanelProps> = ({ 
  title, 
  icon, 
  metrics, 
  active = true 
}) => {
  return (
    <div className={`bg-black bg-opacity-80 border ${active ? 'border-cyan-500' : 'border-gray-700'} rounded-lg p-3 relative overflow-hidden`}>
      {/* Background grid effect */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i} 
            className="border-[0.5px] border-cyan-500"
          />
        ))}
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center space-x-2">
          <div className={`${active ? 'text-cyan-400' : 'text-gray-500'}`}>
            {icon}
          </div>
          <h3 className={`text-sm font-bold ${active ? 'text-cyan-300' : 'text-gray-500'}`}>
            {title}
          </h3>
        </div>
        <div className={`h-2 w-2 rounded-full ${active ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>
      </div>
      
      {/* Metrics */}
      <div className="space-y-2 relative z-10">
        {metrics.map((metric, index) => (
          <div key={index} className="text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{metric.label}</span>
              <span className={metric.color || (active ? 'text-cyan-300' : 'text-gray-500')}>
                {typeof metric.value === 'number' && metric.max 
                  ? `${(metric.value * 100).toFixed(0)}%` 
                  : metric.value}
              </span>
            </div>
            
            {/* Progress bar for numeric values with max */}
            {typeof metric.value === 'number' && metric.max && (
              <div className="w-full bg-gray-800 rounded-full h-1 mt-1">
                <div 
                  className={`h-1 rounded-full ${metric.color ? metric.color : 'bg-cyan-500'}`}
                  style={{ width: `${(metric.value / metric.max) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500 opacity-70"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500 opacity-70"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500 opacity-70"></div>
    </div>
  );
};

export const MetaLogicHUD: React.FC<{ status: any }> = ({ status }) => {
  return (
    <HUDPanel
      title="META-LOGIC"
      icon={<Brain size={16} />}
      active={status.metaLogic.active}
      metrics={[
        { label: "Evaluations", value: status.metaLogic.evaluationsCount },
        { label: "Paradoxes", value: status.metaLogic.paradoxCount },
        { label: "Coherence", value: 0.85, max: 1, color: "text-green-400" }
      ]}
    />
  );
};

export const ArielHUD: React.FC<{ status: any }> = ({ status }) => {
  return (
    <HUDPanel
      title="ARIEL SYSTEM"
      icon={<Users size={16} />}
      active={status.ariel.active}
      metrics={[
        { label: "Agents", value: status.ariel.agentCount },
        { label: "Debates", value: status.ariel.debateCount },
        { label: "Team Morale", value: status.ariel.teamMorale, max: 1, color: "text-blue-400" }
      ]}
    />
  );
};

export const WarpHUD: React.FC<{ status: any }> = ({ status }) => {
  return (
    <HUDPanel
      title="WARP SYSTEM"
      icon={<Zap size={16} />}
      active={status.warp.active}
      metrics={[
        { label: "Phase", value: status.warp.currentPhase },
        { label: "Teams", value: status.warp.teamCount },
        { label: "Efficiency", value: status.warp.efficiency, max: 1, color: "text-yellow-400" }
      ]}
    />
  );
};

export const HelixHUD: React.FC<{ status: any }> = ({ status }) => {
  return (
    <HUDPanel
      title="HELIX SYSTEM"
      icon={<Archive size={16} />}
      active={status.helix.active}
      metrics={[
        { label: "Compressions", value: status.helix.totalCompressions },
        { label: "Ratio", value: status.helix.averageRatio, max: 1, color: "text-purple-400" },
        { label: "Space Saved", value: `${Math.round(status.helix.spaceSaved / 1024)}KB` }
      ]}
    />
  );
};

export const StorageHUD: React.FC<{ status: any }> = ({ status }) => {
  return (
    <HUDPanel
      title="LOGIC STORAGE"
      icon={<Database size={16} />}
      active={true}
      metrics={[
        { label: "Algorithms", value: status.logicStorage.totalAlgorithms },
        { label: "Patterns", value: status.logicStorage.totalPatterns },
        { label: "Compression", value: status.logicStorage.compressionRatio, max: 1, color: "text-indigo-400" }
      ]}
    />
  );
};

export const BenchmarkHUD: React.FC<{ status: any }> = ({ status }) => {
  return (
    <HUDPanel
      title="BENCHMARKS"
      icon={<BarChart2 size={16} />}
      active={true}
      metrics={[
        { label: "Total", value: status.benchmarks.totalBenchmarks },
        { label: "Avg Score", value: status.benchmarks.averageScore, max: 100, color: "text-green-400" },
        { label: "Rank", value: status.benchmarks.leaderboardRank }
      ]}
    />
  );
};

export const TNLPHUD: React.FC<{ status: any }> = ({ status }) => {
  return (
    <HUDPanel
      title="TNLP SYSTEM"
      icon={<Cpu size={16} />}
      active={true}
      metrics={[
        { label: "Phase", value: status.phase || "Initialization" },
        { label: "Iterations", value: status.iterations || 0 },
        { label: "Quantum Ent", value: status.quantumEntanglement || 0.5, max: 1, color: "text-pink-400" }
      ]}
    />
  );
};

export const TruthProtocolHUD: React.FC<{ status: any }> = ({ status }) => {
  return (
    <HUDPanel
      title="TRUTH PROTOCOL"
      icon={<Shield size={16} />}
      active={status.truthProtocol.active}
      metrics={[
        { label: "Cycles", value: status.truthProtocol.adversarialCycles },
        { label: "Signatures", value: status.truthProtocol.truthSignatures },
        { label: "Compliance", value: 0.85, max: 1, color: "text-red-400" }
      ]}
    />
  );
};

export const NaturalLearningHUD: React.FC<{ status: any }> = ({ status }) => {
  return (
    <HUDPanel
      title="NATURAL LEARNING"
      icon={<Sparkles size={16} />}
      active={status.naturalLearning.continuousLearning}
      metrics={[
        { label: "Assets", value: status.naturalLearning.totalAssets },
        { label: "Quality", value: status.naturalLearning.averageQuality, max: 1, color: "text-green-400" },
        { label: "Patterns", value: status.naturalLearning.patternCount }
      ]}
    />
  );
};

export const MemoryHUD: React.FC<{ status: any }> = ({ status }) => {
  return (
    <HUDPanel
      title="MEMORY SYSTEM"
      icon={<Layers size={16} />}
      active={true}
      metrics={[
        { label: "Conversations", value: status.memory.totalConversations },
        { label: "Checkpoints", value: status.memory.trainingCheckpoints },
        { label: "Multi-Modal", value: status.memory.multiModalProgress, max: 1, color: "text-blue-400" }
      ]}
    />
  );
};