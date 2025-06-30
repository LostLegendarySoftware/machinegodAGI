import React, { useState } from 'react';
import { BarChart, RefreshCw, Download, Filter, ChevronDown, AlertTriangle } from 'lucide-react';

interface APIUsageDashboardProps {
  apiKey: string;
  plan: string;
  usageData: {
    totalRequests: number;
    remainingQuota: number;
    dailyUsage: Array<{date: string, count: number}>;
    endpoints: Array<{name: string, count: number, percentage: number}>;
  };
}

const APIUsageDashboard: React.FC<APIUsageDashboardProps> = ({
  apiKey,
  plan,
  usageData
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  
  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API key copied to clipboard!');
  };
  
  const usagePercentage = (usageData.totalRequests / (usageData.totalRequests + usageData.remainingQuota)) * 100;
  
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">API Usage Dashboard</h2>
          <div className="flex items-center space-x-3">
            <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white">
              <RefreshCw size={16} />
            </button>
            <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white">
              <Download size={16} />
            </button>
            <div className="relative">
              <button className="flex items-center space-x-1 p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white">
                <Filter size={16} />
                <span className="text-sm">{timeRange}</span>
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Total Requests</div>
            <div className="text-2xl font-bold text-white">{usageData.totalRequests.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">This billing period</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Remaining Quota</div>
            <div className="text-2xl font-bold text-white">{usageData.remainingQuota.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">Resets in 14 days</div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Current Plan</div>
            <div className="text-2xl font-bold text-white">{plan}</div>
            <div className="text-xs text-gray-500 mt-1">
              <a href="#" className="text-purple-400 hover:text-purple-300">Upgrade plan</a>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-400">Usage</div>
            <div className="text-sm text-gray-400">{usagePercentage.toFixed(1)}%</div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                usagePercentage > 90 ? 'bg-red-500' : 
                usagePercentage > 75 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
          
          {usagePercentage > 90 && (
            <div className="mt-2 flex items-center text-red-400 text-sm">
              <AlertTriangle size={14} className="mr-1" />
              <span>You're approaching your usage limit. Consider upgrading your plan.</span>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <BarChart className="mr-2" size={18} />
            Daily Usage
          </h3>
          
          <div className="h-48 flex items-end space-x-2">
            {usageData.dailyUsage.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-purple-600 hover:bg-purple-500 rounded-t transition-all duration-200"
                  style={{ 
                    height: `${(day.count / Math.max(...usageData.dailyUsage.map(d => d.count))) * 100}%`,
                    minHeight: '4px'
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-1">{day.date}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-bold text-white mb-4">API Key</h3>
          <div className="flex mb-4">
            <div className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 font-mono text-sm">
              {showApiKey ? apiKey : apiKey.substring(0, 8) + '••••••••••••••••••••'}
            </div>
            <button 
              onClick={() => setShowApiKey(!showApiKey)}
              className="bg-gray-700 px-3 py-2 text-gray-300 hover:bg-gray-600"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
            <button 
              onClick={copyApiKey}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-r-lg"
            >
              Copy
            </button>
          </div>
          <div className="text-sm text-gray-400">
            Keep your API key secret. <a href="#" className="text-purple-400 hover:text-purple-300">Regenerate key</a>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800">
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">Endpoint Usage</h3>
          <div className="space-y-4">
            {usageData.endpoints.map((endpoint, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm text-gray-300">{endpoint.name}</div>
                  <div className="text-sm text-gray-400">{endpoint.count.toLocaleString()} requests</div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${endpoint.percentage}%` }}
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

export default APIUsageDashboard;