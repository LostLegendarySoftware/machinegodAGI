import React, { useState } from 'react';
import { Code, Copy, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';

interface APIEndpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
  responses: Array<{
    code: number;
    description: string;
    example: string;
  }>;
  codeExamples: {
    curl: string;
    javascript: string;
    python: string;
  };
}

interface APIDocumentationProps {
  endpoints: APIEndpoint[];
}

const APIDocumentation: React.FC<APIDocumentationProps> = ({ endpoints }) => {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'curl' | 'javascript' | 'python'>('curl');
  
  const toggleEndpoint = (name: string) => {
    if (expandedEndpoint === name) {
      setExpandedEndpoint(null);
    } else {
      setExpandedEndpoint(name);
    }
  };
  
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };
  
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-600';
      case 'POST': return 'bg-blue-600';
      case 'PUT': return 'bg-yellow-600';
      case 'DELETE': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">API Documentation</h2>
        <p className="text-gray-400 mt-2">
          Integrate with our powerful API to access advanced AI capabilities
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          {endpoints.map((endpoint) => (
            <div key={endpoint.name} className="border border-gray-800 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800"
                onClick={() => toggleEndpoint(endpoint.name)}
              >
                <div className="flex items-center space-x-3">
                  <span className={`${getMethodColor(endpoint.method)} text-white text-xs font-bold px-2 py-1 rounded`}>
                    {endpoint.method}
                  </span>
                  <span className="text-white font-mono">{endpoint.path}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">{endpoint.name}</span>
                  {expandedEndpoint === endpoint.name ? (
                    <ChevronDown size={18} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={18} className="text-gray-400" />
                  )}
                </div>
              </div>
              
              {expandedEndpoint === endpoint.name && (
                <div className="p-4 border-t border-gray-800">
                  <p className="text-gray-300 mb-4">{endpoint.description}</p>
                  
                  {/* Parameters */}
                  <h3 className="text-white font-medium mb-2">Parameters</h3>
                  <div className="bg-gray-800 rounded-lg overflow-hidden mb-4">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="px-4 py-2 text-left text-gray-400">Name</th>
                          <th className="px-4 py-2 text-left text-gray-400">Type</th>
                          <th className="px-4 py-2 text-left text-gray-400">Required</th>
                          <th className="px-4 py-2 text-left text-gray-400">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {endpoint.parameters.map((param, index) => (
                          <tr key={index} className={index < endpoint.parameters.length - 1 ? 'border-b border-gray-700' : ''}>
                            <td className="px-4 py-2 text-white font-mono">{param.name}</td>
                            <td className="px-4 py-2 text-purple-400">{param.type}</td>
                            <td className="px-4 py-2">
                              {param.required ? (
                                <span className="text-green-400">Yes</span>
                              ) : (
                                <span className="text-gray-400">No</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-gray-300">{param.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Responses */}
                  <h3 className="text-white font-medium mb-2">Responses</h3>
                  <div className="space-y-3 mb-4">
                    {endpoint.responses.map((response, index) => (
                      <div key={index} className="bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            response.code >= 200 && response.code < 300 ? 'bg-green-600 text-white' :
                            response.code >= 400 && response.code < 500 ? 'bg-yellow-600 text-white' :
                            response.code >= 500 ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                          }`}>
                            {response.code}
                          </span>
                          <span className="ml-2 text-gray-300">{response.description}</span>
                        </div>
                        <div className="bg-gray-900 rounded p-3 font-mono text-xs text-gray-300 relative">
                          <pre>{response.example}</pre>
                          <button 
                            onClick={() => copyCode(response.example)}
                            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Code Examples */}
                  <h3 className="text-white font-medium mb-2">Code Examples</h3>
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="flex border-b border-gray-700">
                      <button
                        className={`px-4 py-2 text-sm ${activeTab === 'curl' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('curl')}
                      >
                        cURL
                      </button>
                      <button
                        className={`px-4 py-2 text-sm ${activeTab === 'javascript' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('javascript')}
                      >
                        JavaScript
                      </button>
                      <button
                        className={`px-4 py-2 text-sm ${activeTab === 'python' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('python')}
                      >
                        Python
                      </button>
                    </div>
                    <div className="p-4 font-mono text-xs text-gray-300 relative">
                      <pre className="whitespace-pre-wrap">{endpoint.codeExamples[activeTab]}</pre>
                      <button 
                        onClick={() => copyCode(endpoint.codeExamples[activeTab])}
                        className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-medium">Need more help?</h3>
            <p className="text-gray-400 text-sm mt-1">Check our comprehensive documentation</p>
          </div>
          <a 
            href="#" 
            className="flex items-center text-purple-400 hover:text-purple-300"
          >
            <span className="mr-1">Full Documentation</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;