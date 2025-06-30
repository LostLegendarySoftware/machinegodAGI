import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Activity, Brain, Cpu, Terminal, Send, Search, MessageSquare, Crown, Sparkles } from 'lucide-react';
import IntroAnimation from './components/IntroAnimation';
import SubscriptionPaywall from './components/SubscriptionPaywall';

// HUDPanel Props interface
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

// HUD Panel Component
const HUDPanel: React.FC<HUDPanelProps> = ({ 
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

function App() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Check subscription status on load
  useEffect(() => {
    const checkSubscription = () => {
      const subscription = localStorage.getItem('subscription');
      setIsSubscribed(subscription === 'active');
    };
    
    checkSubscription();
  }, []);

  const handleSubscribe = (plan: string) => {
    // In a real app, this would process payment and activate subscription
    localStorage.setItem('subscription', 'active');
    localStorage.setItem('subscriptionPlan', plan);
    localStorage.setItem('subscriptionDate', new Date().toISOString());
    setIsSubscribed(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroAnimation />} />
        <Route 
          path="/main" 
          element={isSubscribed ? <MainInterface /> : <SubscriptionPaywall onSubscribe={handleSubscribe} />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Main interface component
const MainInterface = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 relative overflow-hidden">
    {/* Background grid effect */}
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 grid grid-cols-40 grid-rows-40 opacity-20">
        {Array.from({ length: 1600 }).map((_, i) => (
          <div 
            key={i} 
            className="border-[0.5px] border-cyan-500"
          />
        ))}
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-cyan-500 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 3}px`,
              height: `${1 + Math.random() * 3}px`,
              opacity: 0.3 + Math.random() * 0.5,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
    </div>
    
    {/* Main Content */}
    <div className="relative z-10 container mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-600">
          Lost Legendary Labs
        </h1>
        <p className="text-gray-400">
          Premium API Access
        </p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - System Stats */}
        <div className="space-y-4">
          <HUDPanel
            title="SYSTEM STATUS"
            icon={<Activity size={16} />}
            metrics={[
              { label: "Overall Status", value: "OPERATIONAL" },
              { label: "API Uptime", value: 0.999, max: 1, color: "text-green-400" },
              { label: "Request Limit", value: 0.45, max: 1, color: "text-blue-400" }
            ]}
          />
          
          <HUDPanel
            title="API USAGE"
            icon={<Brain size={16} />}
            metrics={[
              { label: "Requests Today", value: "1,245" },
              { label: "Monthly Usage", value: "45,678" },
              { label: "Remaining Credits", value: "54,322" }
            ]}
          />
          
          <HUDPanel
            title="PERFORMANCE"
            icon={<Cpu size={16} />}
            metrics={[
              { label: "Response Time", value: "124ms" },
              { label: "Success Rate", value: 0.998, max: 1, color: "text-green-400" },
              { label: "Cache Hit Rate", value: 0.87, max: 1, color: "text-blue-400" }
            ]}
          />
        </div>
        
        {/* Center Column - API Dashboard */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-300 mb-4">API Dashboard</h2>
            <p className="text-gray-300 mb-4">
              Welcome to your premium API dashboard. Your subscription is active and your API keys are ready to use.
            </p>
            
            <div className="bg-gray-900 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Your API Key</h3>
              <div className="flex">
                <input 
                  type="text" 
                  value="ll_api_key_123456789abcdef" 
                  readOnly
                  className="flex-1 bg-gray-800 text-gray-300 px-3 py-2 rounded-l-lg border border-gray-700"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-r-lg">
                  Copy
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Plan</div>
                <div className="text-xl font-bold text-white">Premium</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Rate Limit</div>
                <div className="text-xl font-bold text-white">100 req/sec</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Monthly Quota</div>
                <div className="text-xl font-bold text-white">100,000 requests</div>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-purple-300 mb-3">Recent API Calls</h3>
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-300">Endpoint</th>
                    <th className="px-4 py-2 text-left text-gray-300">Time</th>
                    <th className="px-4 py-2 text-left text-gray-300">Status</th>
                    <th className="px-4 py-2 text-left text-gray-300">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-800">
                    <td className="px-4 py-2 text-gray-300">/api/v1/generate</td>
                    <td className="px-4 py-2 text-gray-400">2 mins ago</td>
                    <td className="px-4 py-2"><span className="text-green-400">200 OK</span></td>
                    <td className="px-4 py-2 text-gray-300">124ms</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="px-4 py-2 text-gray-300">/api/v1/analyze</td>
                    <td className="px-4 py-2 text-gray-400">5 mins ago</td>
                    <td className="px-4 py-2"><span className="text-green-400">200 OK</span></td>
                    <td className="px-4 py-2 text-gray-300">89ms</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="px-4 py-2 text-gray-300">/api/v1/search</td>
                    <td className="px-4 py-2 text-gray-400">12 mins ago</td>
                    <td className="px-4 py-2"><span className="text-green-400">200 OK</span></td>
                    <td className="px-4 py-2 text-gray-300">156ms</td>
                  </tr>
                  <tr className="border-t border-gray-800">
                    <td className="px-4 py-2 text-gray-300">/api/v1/embed</td>
                    <td className="px-4 py-2 text-gray-400">18 mins ago</td>
                    <td className="px-4 py-2"><span className="text-yellow-400">429 Rate Limited</span></td>
                    <td className="px-4 py-2 text-gray-300">45ms</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default App;