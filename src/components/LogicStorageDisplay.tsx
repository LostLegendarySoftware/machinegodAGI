import React, { useState, useEffect } from 'react';
import { MachineGodCore } from '../core/MachineGodCore';

interface LogicStorageDisplayProps {
  machineGod: MachineGodCore;
}

export const LogicStorageDisplay: React.FC<LogicStorageDisplayProps> = ({ machineGod }) => {
  const [storageStats, setStorageStats] = useState<any>(null);
  const [brainVisualization, setBrainVisualization] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const stats = await machineGod.getLogicStorageStats();
        const brainViz = await machineGod.getBrainVisualization();
        setStorageStats(stats);
        setBrainVisualization(brainViz);
      } catch (error) {
        console.error('Failed to fetch brain storage stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [machineGod, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleOptimize = async () => {
    setIsLoading(true);
    try {
      await machineGod.optimize();
      handleRefresh();
    } catch (error) {
      console.error('Failed to optimize brain storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full flex items-center justify-center">
        <div className="text-purple-300 animate-pulse">🧠 Loading brain visualization data...</div>
      </div>
    );
  }

  if (!storageStats || !brainVisualization) {
    return (
      <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full">
        <div className="text-red-400">Failed to load brain storage data</div>
      </div>
    );
  }

  const { stats, tiers, topAlgorithms, topPatterns } = storageStats;

  return (
    <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-300">🧠 Advanced Brain Logic Storage</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleRefresh}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh
          </button>
          <button 
            onClick={handleOptimize}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Neural Optimization
          </button>
        </div>
      </div>

      {/* Brain Activity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-600">
          <div className="text-sm text-gray-300 mb-1">Active Concepts</div>
          <div className="text-2xl font-bold text-purple-300">{stats.activeUnits}</div>
          <div className="text-xs text-gray-400">Neural nodes firing</div>
        </div>
        <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-600">
          <div className="text-sm text-gray-300 mb-1">Neural Connections</div>
          <div className="text-2xl font-bold text-blue-300">{stats.totalPatterns}</div>
          <div className="text-xs text-gray-400">Synaptic links</div>
        </div>
        <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600">
          <div className="text-sm text-gray-300 mb-1">Brain Efficiency</div>
          <div className="text-2xl font-bold text-green-300">{(stats.averagePerformance * 100).toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Neural activation</div>
        </div>
        <div className="bg-yellow-900 bg-opacity-30 p-4 rounded-lg border border-yellow-600">
          <div className="text-sm text-gray-300 mb-1">Memory Density</div>
          <div className="text-2xl font-bold text-yellow-300">{(stats.compressionRatio * 100).toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Connection efficiency</div>
        </div>
      </div>

      {/* Active Brain Regions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-purple-300 mb-3">🧠 Active Brain Regions</h3>
        <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700">
          {brainVisualization.activeRegions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {brainVisualization.activeRegions.map((region: string, index: number) => (
                <div key={region} className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
                  🧠 {region.replace('_', ' ').toUpperCase()}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">No regions currently active</div>
          )}
        </div>
      </div>

      {/* Brain Region Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-purple-300 mb-3">Brain Region Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {tiers.map((tier: any) => (
            <button
              key={tier.id}
              onClick={() => setSelectedRegion(tier.id)}
              className={`p-3 rounded-lg border ${
                selectedRegion === tier.id 
                  ? 'bg-purple-700 border-purple-400' 
                  : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
              }`}
            >
              <div className="text-sm font-bold text-white">{tier.name}</div>
              <div className="text-xs text-gray-300 truncate">{tier.description}</div>
              <div className="mt-2 bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-purple-500 h-1.5 rounded-full"
                  style={{ width: `${tier.utilizationPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-right mt-1 text-gray-300">{tier.utilizationPercentage.toFixed(1)}%</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Region Details */}
      {tiers[selectedRegion] && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-purple-300 mb-3">
            🧠 {tiers[selectedRegion].name}
          </h3>
          
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-300">Neural Activity</div>
                <div className="text-lg font-bold text-white">
                  {tiers[selectedRegion].utilizationPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round(tiers[selectedRegion].usedCapacity/1024)}KB / {Math.round(tiers[selectedRegion].totalCapacity/1024)}KB
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-300">Plasticity</div>
                <div className="text-lg font-bold text-white">
                  {(tiers[selectedRegion].compressionRatio * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  Synaptic adaptability
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-300">Status</div>
                <div className="text-lg font-bold text-green-400">
                  ACTIVE
                </div>
                <div className="text-xs text-gray-400">
                  Neural processing online
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded-lg">
            <strong>Function:</strong> {tiers[selectedRegion].description}
          </div>
        </div>
      )}

      {/* Visual-Linguistic Concepts and Neural Connections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold text-purple-300 mb-3">🎨 Top Visual-Linguistic Concepts</h3>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700">
            {topAlgorithms.map((concept: any, index: number) => (
              <div key={concept.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-white">{index + 1}. {concept.name}</div>
                  <div className="text-green-400">{(concept.performance * 100).toFixed(1)}%</div>
                </div>
                <div className="text-sm text-gray-300 mt-1">{concept.purpose}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Neural activation: {concept.usageCount} • Memory: {Math.round(concept.size/1000)}KB
                </div>
                <div className="mt-2 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-purple-500 h-1 rounded-full"
                    style={{ width: `${concept.performance * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-blue-300 mb-3">🔗 Top Neural Connections</h3>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700">
            {topPatterns.map((connection: any, index: number) => (
              <div key={connection.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-white">{index + 1}. {connection.type}</div>
                  <div className="text-blue-400">{(connection.frequency * 100).toFixed(1)}%</div>
                </div>
                <div className="text-sm text-gray-300 mt-1">{connection.pattern}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Synaptic strength: {(connection.frequency * 100).toFixed(0)}% • Size: {Math.round(connection.size)}B
                </div>
                <div className="mt-2 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full"
                    style={{ width: `${connection.frequency * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Neural Network Visualization */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-cyan-300 mb-3">🌐 Neural Network Visualization</h3>
        <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700">
          <div className="text-center text-gray-300">
            <div className="text-4xl mb-2">🧠</div>
            <div className="text-lg font-bold">Brain Activity Map</div>
            <div className="text-sm mt-2">
              {brainVisualization.conceptNetwork.nodes.length} active concepts • {brainVisualization.conceptNetwork.connections.length} neural pathways
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-purple-800 p-2 rounded">
                <div className="font-bold">Visual Processing</div>
                <div>Colors, shapes, movement</div>
              </div>
              <div className="bg-blue-800 p-2 rounded">
                <div className="font-bold">Language Center</div>
                <div>Words, meaning, syntax</div>
              </div>
              <div className="bg-green-800 p-2 rounded">
                <div className="font-bold">Association Network</div>
                <div>Connections, patterns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};