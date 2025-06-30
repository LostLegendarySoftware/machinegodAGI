import React, { useState } from 'react';
import { CheckCircle, CreditCard, Shield, Zap, ChevronRight } from 'lucide-react';

interface SubscriptionPlanProps {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
  onSelect: () => void;
}

interface SubscriptionPaywallProps {
  onSubscribe: (plan: string) => void;
}

const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({ 
  name, 
  price, 
  features, 
  recommended = false,
  onSelect
}) => {
  return (
    <div className={`bg-gray-900 rounded-lg overflow-hidden border ${recommended ? 'border-purple-500' : 'border-gray-700'}`}>
      {recommended && (
        <div className="bg-purple-600 text-white text-center py-1 text-sm font-medium">
          RECOMMENDED
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-white">{price}</span>
          <span className="text-gray-400 ml-1">/month</span>
        </div>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="text-green-400 mr-2 flex-shrink-0 mt-0.5" size={16} />
              <span className="text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onSelect}
          className={`w-full py-2 rounded-lg font-medium ${
            recommended 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          Select Plan
        </button>
      </div>
    </div>
  );
};

const SubscriptionPaywall: React.FC<SubscriptionPaywallProps> = ({ onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setPaymentStep(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (selectedPlan) {
        onSubscribe(selectedPlan);
      }
      setIsProcessing(false);
    }, 1500);
  };

  const plans = [
    {
      name: "Basic",
      price: "$29",
      features: [
        "10,000 API calls per month",
        "Standard response time",
        "Basic support",
        "Single API key",
        "REST API access"
      ]
    },
    {
      name: "Professional",
      price: "$99",
      features: [
        "100,000 API calls per month",
        "Priority response time",
        "24/7 email support",
        "Multiple API keys",
        "REST & WebSocket API access",
        "Advanced analytics"
      ],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "$299",
      features: [
        "1,000,000 API calls per month",
        "Ultra-fast response time",
        "Dedicated support team",
        "Unlimited API keys",
        "All APIs & SDKs",
        "Custom model training",
        "SLA guarantees"
      ]
    }
  ];

  if (paymentStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg max-w-md w-full p-6 border border-purple-500">
          <h2 className="text-2xl font-bold text-white mb-6">Complete Your Subscription</h2>
          
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-white font-medium">{selectedPlan} Plan</h3>
                <p className="text-gray-400 text-sm">Monthly subscription</p>
              </div>
              <div className="text-white font-bold">
                {selectedPlan === "Basic" ? "$29" : selectedPlan === "Professional" ? "$99" : "$299"}
              </div>
            </div>
          </div>
          
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Card Information
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  placeholder="John Smith"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Billing Address
                </label>
                <input
                  type="text"
                  placeholder="Street Address"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white mb-2"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 bg-gray-800 border-gray-700 rounded"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
                I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
              </label>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Subscribe Now <ChevronRight size={16} className="ml-1" />
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentStep(false)}
                className="text-gray-400 hover:text-white text-sm text-center"
              >
                Back to plans
              </button>
            </div>
          </form>
          
          <div className="mt-6 flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <Shield size={16} />
            <span>Secure payment processing</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Access Premium API Features</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Get industry-low rates for high-performance AI capabilities with our flexible subscription plans
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <SubscriptionPlan
              key={plan.name}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              recommended={plan.recommended}
              onSelect={() => handlePlanSelect(plan.name)}
            />
          ))}
        </div>
        
        <div className="mt-12 bg-gray-900 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <Zap className="text-yellow-400 mr-2" size={20} />
            Enterprise Solutions
          </h2>
          <p className="text-gray-300 mb-4">
            Need a custom solution? Our enterprise plans offer tailored API access, dedicated support, and custom model training.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="text-white font-bold text-2xl">Contact Us</div>
              <div className="text-gray-400">Get a custom quote for your business</div>
            </div>
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg">
              Request Information
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-400 text-sm">
          All plans include a 7-day money-back guarantee. No contracts, cancel anytime.
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPaywall;