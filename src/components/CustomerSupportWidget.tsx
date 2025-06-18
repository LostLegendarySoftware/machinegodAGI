import React, { useState } from 'react';
import { MessageSquare, X, Send, User, Bot } from 'lucide-react';

export const CustomerSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    text: string;
    sender: 'user' | 'support';
    timestamp: Date;
  }>>([
    {
      id: 'welcome',
      text: 'Welcome to MachineGod AI support! How can I help you today?',
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: `user_${Date.now()}`,
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate support agent typing
    setIsTyping(true);
    
    // Simulate response after delay
    setTimeout(() => {
      const supportMessage = {
        id: `support_${Date.now()}`,
        text: getAutomatedResponse(newMessage),
        sender: 'support' as const,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAutomatedResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('subscription') || lowerMessage.includes('upgrade') || lowerMessage.includes('plan')) {
      return "To upgrade your subscription, go to your User Dashboard and select the 'Subscription' tab. There you'll find all available plans. If you need help with billing, please email billing@machinegod.ai.";
    }
    
    if (lowerMessage.includes('api') || lowerMessage.includes('limit') || lowerMessage.includes('rate')) {
      return "API limits are based on your subscription tier. Free accounts get 100 calls/month, Pro accounts get 1,000 calls/month, and Enterprise accounts get 10,000 calls/month. Your usage resets on the first day of each month.";
    }
    
    if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('issue')) {
      return "I'm sorry you're experiencing an issue. Could you provide more details about what happened? For technical support, you can also email support@machinegod.ai with error screenshots.";
    }
    
    if (lowerMessage.includes('data') || lowerMessage.includes('privacy') || lowerMessage.includes('delete')) {
      return "You can manage all your data in the User Dashboard under 'Data Management'. You can export or delete your data at any time. We take privacy seriously and comply with all relevant regulations including GDPR.";
    }
    
    if (lowerMessage.includes('offline') || lowerMessage.includes('sync')) {
      return "MachineGod AI works offline! When you're disconnected, we store your interactions locally and sync them when you're back online. You'll see a sync indicator in the bottom right corner when this happens.";
    }
    
    if (lowerMessage.includes('mobile') || lowerMessage.includes('app') || lowerMessage.includes('phone')) {
      return "Our mobile app is available for both iOS and Android. You can download it from the App Store or Google Play Store. Your account and data will sync automatically between web and mobile.";
    }
    
    return "Thank you for your message. Our support team will review it and get back to you soon. For immediate assistance, please email support@machinegod.ai or check our documentation for common questions.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-3 shadow-lg"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat widget */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 border border-purple-500 rounded-lg shadow-xl w-80 sm:w-96 flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="bg-purple-600 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-bold">Customer Support</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[350px]">
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-white'
                  }`}>
                    <div className="flex items-center mb-1">
                      {message.sender === 'support' ? (
                        <Bot size={16} className="mr-1 text-purple-300" />
                      ) : (
                        <User size={16} className="mr-1 text-purple-300" />
                      )}
                      <span className="text-xs text-gray-300">
                        {message.sender === 'user' ? 'You' : 'Support'}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 bg-gray-800 border border-gray-600 rounded-l-lg text-white focus:outline-none focus:border-purple-500 resize-none"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white p-2 rounded-r-lg"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Support hours: 24/7 for Enterprise, 9am-5pm ET for other plans
            </div>
          </div>
        </div>
      )}
    </>
  );
};