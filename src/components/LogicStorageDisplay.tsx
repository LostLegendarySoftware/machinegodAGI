import React, { useState, useEffect } from 'react';
import { MachineGodCore } from '../core/MachineGodCore';

interface LogicStorageDisplayProps {
  machineGod: MachineGodCore;
}

export const LogicStorageDisplay: React.FC<LogicStorageDisplayProps> = ({ machineGod }) => {
  const [storageStats, setStorageStats] = useState<any>(null);
  const [selectedTier, setSelectedTier] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const stats = await machineGod.getLogicStorageStats();
        setStorageStats(stats);
      } catch (error) {
        console.error('Failed to fetch logic storage stats:', error);
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
      console.error('Failed to optimize storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full flex items-center justify-center">
        <div className="text-purple-300 animate-pulse">Loading logic storage data...</div>
      </div>
    );
  }

  if (!storageStats) {
    return (
      <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full">
        <div className="text-red-400">Failed to load logic storage data</div>
      </div>
    );
  }

  const { stats, tiers, topAlgorithms, topPatterns } = storageStats;

  return (
    <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-purple-300">6-Tier Logic Storage System</h2>
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
            Optimize Storage
          </button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-600">
          <div className="text-sm text-gray-300 mb-1">Total Algorithms</div>
          <div className="text-2xl font-bold text-purple-300">{stats.totalAlgorithms}</div>
        </div>
        <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-600">
          <div className="text-sm text-gray-300 mb-1">Total Patterns</div>
          <div className="text-2xl font-bold text-blue-300">{stats.totalPatterns}</div>
        </div>
        <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600">
          <div className="text-sm text-gray-300 mb-1">Active Units</div>
          <div className="text-2xl font-bold text-green-300">{stats.activeUnits} / {stats.totalUnits}</div>
        </div>
      </div>

      {/* Tier Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-purple-300 mb-3">Storage Tiers</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {tiers.map((tier: any) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`p-3 rounded-lg border ${
                selectedTier === tier.id 
                  ? 'bg-purple-700 border-purple-400' 
                  : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
              }`}
            >
              <div className="text-sm font-bold text-white">Tier {tier.id + 1}</div>
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

      {/* Selected Tier Details */}
      {tiers[selectedTier] && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-purple-300 mb-3">
            Tier {selectedTier + 1}: {tiers[selectedTier].description}
          </h3>
          
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-300">Usage</div>
                <div className="text-lg font-bold text-white">
                  {tiers[selectedTier].utilizationPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round(tiers[selectedTier].usedCapacity/1024/1024)}MB / {Math.round(tiers[selectedTier].totalCapacity/1024/1024)}MB
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-300">Compression</div>
                <div className="text-lg font-bold text-white">
                  {((1-tiers[selectedTier].compressionRatio) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-gray-400">
                  Space saved through compression
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-300">Status</div>
                <div className="text-lg font-bold text-green-400">
                  ACTIVE
                </div>
                <div className="text-xs text-gray-400">
                  256 logic data units
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Algorithms and Patterns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold text-purple-300 mb-3">Top Algorithms</h3>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700">
            {topAlgorithms.map((alg: any, index: number) => (
              <div key={alg.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-white">{index + 1}. {alg.name}</div>
                  <div className="text-green-400">{(alg.performance * 100).toFixed(1)}%</div>
                </div>
                <div className="text-sm text-gray-300 mt-1">{alg.purpose}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Gen {alg.generation} • {Math.round(alg.size/1024)}KB • Used {alg.usageCount} times
                </div>
                <div className="mt-2 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-green-500 h-1 rounded-full"
                    style={{ width: `${alg.performance * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-blue-300 mb-3">Top Patterns</h3>
          <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700">
            {topPatterns.map((pattern: any, index: number) => (
              <div key={pattern.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-white">{index + 1}. {pattern.type} pattern</div>
                  <div className="text-blue-400">{(pattern.frequency * 100).toFixed(1)}%</div>
                </div>
                <div className="text-sm text-gray-300 mt-1">{pattern.pattern}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {Math.round(pattern.size/1024)}KB • Last used {new Date(pattern.lastUsed).toLocaleDateString()}
                </div>
                <div className="mt-2 bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-blue-500 h-1 rounded-full"
                    style={{ width: `${pattern.frequency * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};