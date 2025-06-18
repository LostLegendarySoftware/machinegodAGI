import React, { useState, useEffect } from 'react';
import { User, Settings, Crown, BarChart3, Download, Upload, Trash2, Shield } from 'lucide-react';
import { AuthService, User as UserType } from '../services/AuthService';
import { CloudDataService } from '../services/CloudDataService';
import { ErrorReportingService } from '../services/ErrorReportingService';

interface UserDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'data' | 'analytics'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  const authService = AuthService.getInstance();
  const cloudService = CloudDataService.getInstance();
  const errorService = ErrorReportingService.getInstance();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!isOpen || !user) return null;

  const handleUpgradeSubscription = async (tier: 'pro' | 'enterprise') => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.upgradeSubscription(tier);
      setUser(updatedUser);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await cloudService.exportData(user.id);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `machinegod-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedCount = await cloudService.importData(text, user.id);
      alert(`Successfully imported ${importedCount} data items`);
    } catch (error) {
      alert('Import failed: Invalid file format');
    }
  };

  const handleDeleteAllData = async () => {
    if (confirm('Are you sure you want to delete ALL your data? This cannot be undone.')) {
      try {
        await cloudService.clearAllData(user.id);
        alert('All data has been deleted');
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'text-yellow-400';
      case 'pro': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getSubscriptionIcon = (tier: string) => {
    switch (tier) {
      case 'enterprise': return <Crown className="text-yellow-400" size={20} />;
      case 'pro': return <Shield className="text-blue-400" size={20} />;
      default: return <User className="text-gray-400" size={20} />;
    }
  };

  const analytics = errorService.getAnalyticsSummary();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-purple-500 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-purple-300">User Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 p-4">
            <div className="space-y-2">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'subscription', label: 'Subscription', icon: Crown },
                { id: 'data', label: 'Data Management', icon: Download },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Profile Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Display Name</label>
                      <div className="text-white">{user.displayName}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Email</label>
                      <div className="text-white">{user.email}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Member Since</label>
                      <div className="text-white">{user.createdAt.toLocaleDateString()}</div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">Last Login</label>
                      <div className="text-white">{user.lastLogin.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Theme</span>
                      <span className="text-white capitalize">{user.preferences.theme}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Notifications</span>
                      <span className="text-white">{user.preferences.notifications ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Data Retention</span>
                      <span className="text-white">{user.preferences.dataRetention} days</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Current Subscription</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    {getSubscriptionIcon(user.subscriptionTier)}
                    <span className={`text-xl font-bold ${getSubscriptionColor(user.subscriptionTier)}`}>
                      {user.subscriptionTier.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg mb-4">
                    <h4 className="text-white font-medium mb-2">API Usage</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Current Usage</span>
                      <span className="text-white">{user.apiUsage.current} / {user.apiUsage.limit}</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(user.apiUsage.current / user.apiUsage.limit) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Resets on {user.apiUsage.resetDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {user.subscriptionTier === 'free' && (
                  <div className="space-y-4">
                    <div className="bg-blue-900 bg-opacity-30 p-6 rounded-lg border border-blue-600">
                      <h4 className="text-xl font-bold text-blue-300 mb-2">Pro Plan</h4>
                      <p className="text-gray-300 mb-4">Enhanced features for power users</p>
                      <ul className="text-sm text-gray-300 space-y-1 mb-4">
                        <li>• 1,000 API calls per month</li>
                        <li>• Priority support</li>
                        <li>• Advanced analytics</li>
                        <li>• Custom integrations</li>
                      </ul>
                      <button
                        onClick={() => handleUpgradeSubscription('pro')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        Upgrade to Pro - $29/month
                      </button>
                    </div>

                    <div className="bg-yellow-900 bg-opacity-30 p-6 rounded-lg border border-yellow-600">
                      <h4 className="text-xl font-bold text-yellow-300 mb-2">Enterprise Plan</h4>
                      <p className="text-gray-300 mb-4">Maximum power for organizations</p>
                      <ul className="text-sm text-gray-300 space-y-1 mb-4">
                        <li>• 10,000 API calls per month</li>
                        <li>• Dedicated support</li>
                        <li>• Custom model training</li>
                        <li>• SLA guarantees</li>
                        <li>• Team management</li>
                      </ul>
                      <button
                        onClick={() => handleUpgradeSubscription('enterprise')}
                        disabled={isLoading}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
                      >
                        Upgrade to Enterprise - $299/month
                      </button>
                    </div>
                  </div>
                )}

                {user.subscriptionTier === 'pro' && (
                  <div className="bg-yellow-900 bg-opacity-30 p-6 rounded-lg border border-yellow-600">
                    <h4 className="text-xl font-bold text-yellow-300 mb-2">Enterprise Plan</h4>
                    <p className="text-gray-300 mb-4">Maximum power for organizations</p>
                    <ul className="text-sm text-gray-300 space-y-1 mb-4">
                      <li>• 10,000 API calls per month</li>
                      <li>• Dedicated support</li>
                      <li>• Custom model training</li>
                      <li>• SLA guarantees</li>
                      <li>• Team management</li>
                    </ul>
                    <button
                      onClick={() => handleUpgradeSubscription('enterprise')}
                      disabled={isLoading}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
                    >
                      Upgrade to Enterprise - $299/month
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Data Management</h3>
                  <p className="text-gray-300 mb-6">
                    Manage your data, export for backup, or import from another account.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleExportData}
                      className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    >
                      <Download size={20} />
                      <span>Export All Data</span>
                    </button>
                    
                    <label className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer">
                      <Upload size={20} />
                      <span>Import Data</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportData}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="bg-red-900 bg-opacity-20 p-6 rounded-lg border border-red-800">
                  <h3 className="text-xl font-bold text-red-300 mb-4">Danger Zone</h3>
                  <p className="text-gray-300 mb-6">
                    These actions cannot be undone. Please be certain.
                  </p>
                  
                  <button
                    onClick={handleDeleteAllData}
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    <Trash2 size={20} />
                    <span>Delete All Data</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Usage Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Session Duration</div>
                      <div className="text-2xl font-bold text-white">
                        {Math.floor(analytics.sessionDuration / 60000)} min
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Total Events</div>
                      <div className="text-2xl font-bold text-white">
                        {analytics.totalEvents}
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Page Load Time</div>
                      <div className="text-2xl font-bold text-white">
                        {analytics.averagePageLoadTime.toFixed(0)} ms
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold text-white mb-3">Error Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Total Errors</div>
                      <div className="text-2xl font-bold text-white">
                        {analytics.totalErrors}
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Critical Errors</div>
                      <div className="text-2xl font-bold text-white">
                        {analytics.criticalErrors}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-white mb-4">Privacy Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Error Reporting</div>
                        <div className="text-sm text-gray-400">Send anonymous error reports to help improve the system</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={errorService.isAnalyticsEnabled()} onChange={() => errorService.setEnabled(!errorService.isAnalyticsEnabled())} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Usage Analytics</div>
                        <div className="text-sm text-gray-400">Collect anonymous usage data to improve features</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={errorService.isAnalyticsEnabled()} onChange={() => errorService.setEnabled(!errorService.isAnalyticsEnabled())} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">Performance Monitoring</div>
                        <div className="text-sm text-gray-400">Track performance metrics to optimize experience</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={errorService.isAnalyticsEnabled()} onChange={() => errorService.setEnabled(!errorService.isAnalyticsEnabled())} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};