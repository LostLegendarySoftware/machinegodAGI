import React, { useState, useEffect } from 'react';
import { MachineGodCore } from '../core/MachineGodCore';
import { Trophy, Medal, Star, Crown, ArrowUp, ArrowDown, BarChart2, Zap } from 'lucide-react';

interface BenchmarkLeaderboardProps {
  machineGod: MachineGodCore;
  refreshInterval?: number; // in milliseconds
}

export const BenchmarkLeaderboard: React.FC<BenchmarkLeaderboardProps> = ({ 
  machineGod,
  refreshInterval = 5000
}) => {
  const [benchmarkStats, setBenchmarkStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [domination, setDomination] = useState<boolean>(false);
  const [dominationTime, setDominationTime] = useState<Date | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = machineGod.getBenchmarkStats();
        setBenchmarkStats(stats);
        
        // Check if we're #1 in all benchmarks
        if (stats.benchmarkResults && stats.benchmarkResults.length > 0) {
          const allNumberOne = stats.benchmarkResults.every(
            (result: any) => result.leaderboardComparison.rank === 1
          );
          
          if (allNumberOne && !domination && stats.benchmarkResults.length >= 3) {
            setDomination(true);
            setDominationTime(new Date());
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 10000); // Hide celebration after 10 seconds
          } else if (!allNumberOne) {
            setDomination(false);
            setDominationTime(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch benchmark stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    
    // Set up interval for refreshing
    const intervalId = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [machineGod, refreshKey, refreshInterval, domination]);

  const handleRunBenchmark = async (benchmarkId: string) => {
    setIsLoading(true);
    try {
      await machineGod.runLMMBenchmark(benchmarkId);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error(`Failed to run benchmark ${benchmarkId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !benchmarkStats) {
    return (
      <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full flex items-center justify-center">
        <div className="text-purple-300 animate-pulse">Loading benchmark data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full overflow-y-auto relative">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/70 to-indigo-900/70 flex flex-col items-center justify-center z-10 animate-pulse">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-4xl font-bold text-yellow-300 mb-4 text-center">GLOBAL DOMINATION</h2>
          <div className="text-2xl text-white text-center mb-6">
            MachineGod has achieved #1 rank in ALL benchmarks!
          </div>
          <div className="flex space-x-4 mb-8">
            <Crown className="text-yellow-300" size={48} />
            <Trophy className="text-yellow-300" size={48} />
            <Crown className="text-yellow-300" size={48} />
          </div>
          <button 
            onClick={() => setShowCelebration(false)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue to Dominate
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-purple-300 flex items-center">
            <BarChart2 className="mr-2" />
            Benchmark Leaderboard
          </h2>
          <p className="text-gray-400 text-sm">
            Tracking performance against leading AI models
          </p>
        </div>
        
        {domination && (
          <div className="flex items-center bg-gradient-to-r from-yellow-600 to-yellow-400 px-4 py-2 rounded-lg">
            <Crown className="text-black mr-2" size={20} />
            <div className="text-black font-bold">GLOBAL #1</div>
          </div>
        )}
      </div>

      {/* Domination Status */}
      {domination && dominationTime && (
        <div className="mb-6 bg-gradient-to-r from-purple-900 to-indigo-900 p-4 rounded-lg border border-yellow-400">
          <div className="flex items-center mb-2">
            <Trophy className="text-yellow-400 mr-2" size={24} />
            <h3 className="text-xl font-bold text-yellow-300">Global Benchmark Domination</h3>
          </div>
          <p className="text-white">
            MachineGod has achieved #1 rank in ALL benchmarks since{' '}
            <span className="font-bold">{dominationTime.toLocaleString()}</span>
          </p>
          <div className="mt-2 text-sm text-gray-300">
            Maintaining superiority across all reasoning categories
          </div>
        </div>
      )}

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-600">
          <div className="text-sm text-gray-300 mb-1">Total Benchmarks</div>
          <div className="text-2xl font-bold text-purple-300">{benchmarkStats?.totalBenchmarks || 0}</div>
        </div>
        <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-600">
          <div className="text-sm text-gray-300 mb-1">Average Score</div>
          <div className="text-2xl font-bold text-blue-300">
            {benchmarkStats?.averageScore ? `${benchmarkStats.averageScore.toFixed(1)}%` : 'N/A'}
          </div>
        </div>
        <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600">
          <div className="text-sm text-gray-300 mb-1">Top Benchmark</div>
          <div className="text-2xl font-bold text-green-300">
            {benchmarkStats?.topBenchmark || 'None'}
          </div>
        </div>
        <div className="bg-yellow-900 bg-opacity-30 p-4 rounded-lg border border-yellow-600">
          <div className="text-sm text-gray-300 mb-1">Average Rank</div>
          <div className="text-2xl font-bold text-yellow-300">
            {benchmarkStats?.leaderboardRank || 'N/A'}
          </div>
        </div>
      </div>

      {/* Benchmark Results Table */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
          <Medal className="mr-2" />
          Benchmark Results
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-purple-900 bg-opacity-50">
              <tr>
                <th className="px-4 py-2 text-purple-300">Benchmark</th>
                <th className="px-4 py-2 text-purple-300">Our Score</th>
                <th className="px-4 py-2 text-purple-300">Top Score</th>
                <th className="px-4 py-2 text-purple-300">Rank</th>
                <th className="px-4 py-2 text-purple-300">Percentile</th>
                <th className="px-4 py-2 text-purple-300">Status</th>
                <th className="px-4 py-2 text-purple-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {benchmarkStats?.benchmarkResults?.length > 0 ? (
                benchmarkStats.benchmarkResults.map((result: any) => (
                  <tr key={result.testId} className="border-b border-gray-800">
                    <td className="px-4 py-3 text-white">{result.testId}</td>
                    <td className="px-4 py-3 text-blue-300">{result.percentage.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-gray-300">{result.leaderboardComparison.topScore.toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {result.leaderboardComparison.rank === 1 ? (
                          <span className="text-yellow-300 font-bold flex items-center">
                            <Crown className="mr-1" size={16} />
                            1
                          </span>
                        ) : (
                          <span className="text-white">{result.leaderboardComparison.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-green-300">{result.leaderboardComparison.percentile.toFixed(1)}%</td>
                    <td className="px-4 py-3">
                      {result.leaderboardComparison.rank === 1 ? (
                        <span className="px-2 py-1 bg-yellow-600 text-yellow-100 rounded text-xs">DOMINATING</span>
                      ) : result.leaderboardComparison.rank <= 3 ? (
                        <span className="px-2 py-1 bg-green-600 text-green-100 rounded text-xs">TOP 3</span>
                      ) : result.leaderboardComparison.percentile > 75 ? (
                        <span className="px-2 py-1 bg-blue-600 text-blue-100 rounded text-xs">COMPETITIVE</span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-600 text-gray-100 rounded text-xs">IMPROVING</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleRunBenchmark(result.testId)}
                        className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                      >
                        Re-run
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-3 text-center text-gray-400">
                    No benchmark results available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Run New Benchmark */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
          <Zap className="mr-2" />
          Run New Benchmark
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => handleRunBenchmark('mathvista_mini')}
            className="p-3 bg-purple-900 hover:bg-purple-800 text-white rounded-lg flex flex-col items-center"
            disabled={isLoading}
          >
            <div className="text-xl mb-2">🧮</div>
            <div className="font-bold">MathVista Mini</div>
            <div className="text-xs text-gray-300 mt-1">Mathematical reasoning with visual elements</div>
          </button>
          
          <button 
            onClick={() => handleRunBenchmark('logicvista')}
            className="p-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg flex flex-col items-center"
            disabled={isLoading}
          >
            <div className="text-xl mb-2">🧠</div>
            <div className="font-bold">LogicVista</div>
            <div className="text-xs text-gray-300 mt-1">Logical reasoning and inference</div>
          </button>
          
          <button 
            onClick={() => handleRunBenchmark('wemath')}
            className="p-3 bg-green-900 hover:bg-green-800 text-white rounded-lg flex flex-col items-center"
            disabled={isLoading}
          >
            <div className="text-xl mb-2">📊</div>
            <div className="font-bold">WeMath</div>
            <div className="text-xs text-gray-300 mt-1">Comprehensive mathematical reasoning</div>
          </button>
        </div>
      </div>

      {/* Competitor Analysis */}
      <div>
        <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
          <Star className="mr-2" />
          Competitor Analysis
        </h3>
        
        <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-gray-700">
          <div className="text-sm text-gray-300 mb-3">Performance vs. Leading Models</div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white">GPT-4o</span>
                <span className="text-gray-300">
                  {domination ? (
                    <span className="text-yellow-300 flex items-center">
                      <ArrowUp size={16} className="mr-1" />
                      Surpassed
                    </span>
                  ) : (
                    <span className="text-blue-300">Competitive</span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${domination ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  style={{ width: domination ? '100%' : '95%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white">Claude-3.5-Sonnet</span>
                <span className="text-gray-300">
                  {domination ? (
                    <span className="text-yellow-300 flex items-center">
                      <ArrowUp size={16} className="mr-1" />
                      Surpassed
                    </span>
                  ) : (
                    <span className="text-blue-300">Competitive</span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${domination ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  style={{ width: domination ? '100%' : '97%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white">Gemini-1.5-Pro</span>
                <span className="text-gray-300">
                  {domination ? (
                    <span className="text-yellow-300 flex items-center">
                      <ArrowUp size={16} className="mr-1" />
                      Surpassed
                    </span>
                  ) : (
                    <span className="text-green-300 flex items-center">
                      <ArrowUp size={16} className="mr-1" />
                      Leading
                    </span>
                  )}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${domination ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: domination ? '100%' : '105%' }}
                ></div>
              </div>
            </div>
          </div>
          
          {domination && (
            <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 border border-yellow-600 rounded-lg">
              <div className="flex items-center">
                <Trophy className="text-yellow-400 mr-2" size={20} />
                <span className="text-yellow-300 font-bold">Global Benchmark Leader</span>
              </div>
              <p className="text-gray-300 text-sm mt-1">
                MachineGod has achieved unprecedented dominance across all benchmark categories, 
                establishing a new state-of-the-art in AI reasoning capabilities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};