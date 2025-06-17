import React from 'react';
import { SystemStatus } from '../core/MachineGodCore';
import { Activity, Brain, Users, Zap, Archive } from 'lucide-react';

interface SystemDashboardProps {
  status: SystemStatus;
}

export const SystemDashboard: React.FC<SystemDashboardProps> = ({ status }) => {
  const getStatusColor = (active: boolean) => active ? 'text-green-400' : 'text-red-400';
  const getStatusBg = (active: boolean) => active ? 'bg-green-900 bg-opacity-30' : 'bg-red-900 bg-opacity-30';

  return (
    <div className="system-dashboard p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-300 mb-2 flex items-center">
          <Activity className="mr-2" />
          MachineGod System Status
        </h2>
        <div className="text-green-400 text-sm">
          OmegaEvolved • Background Reasoning • Auto-Tasking • Truth Stratification
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* META-LOGIC Status */}
        <div className={`p-4 rounded-lg border border-purple-600 ${getStatusBg(status.metaLogic.active)}`}>
          <div className="flex items-center mb-3">
            <Brain className={`mr-2 ${getStatusColor(status.metaLogic.active)}`} size={20} />
            <h3 className="text-purple-300 font-bold">META-LOGIC</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className={getStatusColor(status.metaLogic.active)}>
                {status.metaLogic.active ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Evaluations:</span>
              <span className="text-green-300">{status.metaLogic.evaluationsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Paradoxes:</span>
              <span className="text-yellow-300">{status.metaLogic.paradoxCount}</span>
            </div>
          </div>
        </div>

        {/* ARIEL Status */}
        <div className={`p-4 rounded-lg border border-purple-600 ${getStatusBg(status.ariel.active)}`}>
          <div className="flex items-center mb-3">
            <Users className={`mr-2 ${getStatusColor(status.ariel.active)}`} size={20} />
            <h3 className="text-purple-300 font-bold">ARIEL</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className={getStatusColor(status.ariel.active)}>
                {status.ariel.active ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Agents:</span>
              <span className="text-green-300">{status.ariel.agentCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Debates:</span>
              <span className="text-blue-300">{status.ariel.debateCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Performance:</span>
              <span className={status.ariel.teamMorale > 0.7 ? 'text-green-300' : 'text-yellow-300'}>
                {(status.ariel.teamMorale * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* WARP Status */}
        <div className={`p-4 rounded-lg border border-purple-600 ${getStatusBg(status.warp.active)}`}>
          <div className="flex items-center mb-3">
            <Zap className={`mr-2 ${getStatusColor(status.warp.active)}`} size={20} />
            <h3 className="text-purple-300 font-bold">WARP</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className={getStatusColor(status.warp.active)}>
                {status.warp.active ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Phase:</span>
              <span className="text-cyan-300">{status.warp.currentPhase}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Efficiency:</span>
              <span className={status.warp.efficiency > 0.8 ? 'text-green-300' : 'text-yellow-300'}>
                {(status.warp.efficiency * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Teams:</span>
              <span className="text-green-300">{status.warp.teamCount}</span>
            </div>
          </div>
        </div>

        {/* HELIX Status */}
        <div className={`p-4 rounded-lg border border-purple-600 ${getStatusBg(status.helix.active)}`}>
          <div className="flex items-center mb-3">
            <Archive className={`mr-2 ${getStatusColor(status.helix.active)}`} size={20} />
            <h3 className="text-purple-300 font-bold">HELIX</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className={getStatusColor(status.helix.active)}>
                {status.helix.active ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Operations:</span>
              <span className="text-green-300">{status.helix.totalCompressions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Avg Ratio:</span>
              <span className="text-blue-300">{(status.helix.averageRatio * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Space Saved:</span>
              <span className="text-green-300">{Math.round(status.helix.spaceSaved / 1024)}KB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Training Status */}
      <div className="mt-6 p-4 bg-purple-900 bg-opacity-30 rounded-lg border border-purple-600">
        <h3 className="text-purple-300 font-bold mb-3 flex items-center">
          <Brain className="mr-2" size={18} />
          OmegaEvolved Training Status
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-purple-500">
            <div className="text-sm text-gray-300 mb-1">Current Level</div>
            <div className="text-lg font-bold text-purple-300">{status.training.currentLevel}</div>
          </div>
          
          <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-purple-500">
            <div className="text-sm text-gray-300 mb-1">Progress</div>
            <div className="text-lg font-bold text-green-300">{status.training.progressPercentage.toFixed(1)}%</div>
          </div>
          
          <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-purple-500">
            <div className="text-sm text-gray-300 mb-1">Reasoning Ability</div>
            <div className="text-lg font-bold text-blue-300">{(status.training.reasoningAbility * 100).toFixed(1)}%</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Training Progress</span>
              <span className="text-green-300">
                {status.training.progressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-purple-500 h-2 rounded-full"
                style={{ width: `${status.training.progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300">Multi-Modal Progress</span>
              <span className="text-cyan-300">
                {(status.memory.multiModalProgress * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                style={{ width: `${status.memory.multiModalProgress * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Research & API Status */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-600">
          <h3 className="text-blue-300 font-bold mb-3">REAL Research Status</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Google Search API:</span>
              <span className="text-green-300">CONNECTED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">API Requests:</span>
              <span className="text-blue-300">{status.api.requestCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Network:</span>
              <span className="text-purple-300">{status.api.network}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Connectivity:</span>
              <span className={status.api.connectivity === 'healthy' ? 'text-green-300' : 'text-yellow-300'}>
                {status.api.connectivity.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-red-900 bg-opacity-30 rounded-lg border border-red-600">
          <h3 className="text-red-300 font-bold mb-3">Truth Protocol Status</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-300">Status:</span>
              <span className={status.truthProtocol.active ? 'text-green-300' : 'text-red-300'}>
                {status.truthProtocol.active ? 'ACTIVE' : 'DISABLED'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Adversarial Cycles:</span>
              <span className="text-orange-300">{status.truthProtocol.adversarialCycles}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Truth Signatures:</span>
              <span className="text-yellow-300">{status.truthProtocol.truthSignatures}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Stratum Compliance:</span>
              <span className="text-pink-300">
                {Object.entries(status.truthProtocol.stratumCompliance).map(([key, value]) => 
                  `${key}:${(value * 100 || 0).toFixed(0)}%`
                ).join(' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Memory & Conversation Stats */}
      <div className="mt-6 p-4 bg-green-900 bg-opacity-30 rounded-lg border border-green-600">
        <h3 className="text-green-300 font-bold mb-3">Memory & Conversation Stats</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-green-400">
              {status.memory.totalConversations}
            </div>
            <div className="text-sm text-gray-300">Total Conversations</div>
          </div>
          
          <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-blue-400">
              {status.memory.userSessions}
            </div>
            <div className="text-sm text-gray-300">User Sessions</div>
          </div>
          
          <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-purple-400">
              {status.memory.trainingCheckpoints}
            </div>
            <div className="text-sm text-gray-300">Training Checkpoints</div>
          </div>
          
          <div className="bg-black bg-opacity-50 p-3 rounded-lg border border-gray-600">
            <div className="text-2xl font-bold text-yellow-400">
              {(status.memory.multiModalProgress * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-300">Multi-Modal Progress</div>
          </div>
        </div>
      </div>
    </div>
  );
};