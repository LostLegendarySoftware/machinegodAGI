import React from 'react';
import { Crown, X } from 'lucide-react';
import { AuthService, User } from '../services/AuthService';

interface SubscriptionBannerProps {
  onUpgrade: () => void;
}

export const SubscriptionBanner: React.FC<SubscriptionBannerProps> = ({ onUpgrade }) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [user, setUser] = React.useState<User | null>(null);

  const authService = AuthService.getInstance();

  React.useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    const unsubscribe = authService.subscribe(state => {
      setUser(state.user);
    });

    return () => unsubscribe();
  }, []);

  if (!isVisible || !user || user.subscriptionTier !== 'free') {
    return null;
  }

  const apiUsagePercentage = (user.apiUsage.current / user.apiUsage.limit) * 100;
  const isNearLimit = apiUsagePercentage > 80;

  return (
    <div className={`${isNearLimit ? 'bg-red-900' : 'bg-blue-900'} bg-opacity-90 p-4 rounded-lg shadow-lg mb-6`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Crown className={`${isNearLimit ? 'text-red-300' : 'text-blue-300'}`} size={24} />
          <div>
            <h3 className="font-bold text-white">
              {isNearLimit ? 'API Limit Almost Reached' : 'Upgrade to Pro'}
            </h3>
            <p className={`text-sm ${isNearLimit ? 'text-red-200' : 'text-blue-200'}`}>
              {isNearLimit 
                ? `You've used ${user.apiUsage.current} of ${user.apiUsage.limit} API calls this month.`
                : 'Unlock advanced features and higher API limits.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-300 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mt-3">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`${isNearLimit ? 'bg-red-500' : 'bg-blue-500'} h-2 rounded-full`}
            style={{ width: `${Math.min(100, apiUsagePercentage)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className={`${isNearLimit ? 'text-red-200' : 'text-blue-200'}`}>
            {user.apiUsage.current} used
          </span>
          <span className="text-gray-300">
            {user.apiUsage.limit} limit
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onUpgrade}
          className={`px-4 py-2 rounded-lg font-medium ${
            isNearLimit 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isNearLimit ? 'Upgrade Now' : 'View Plans'}
        </button>
      </div>
    </div>
  );
};