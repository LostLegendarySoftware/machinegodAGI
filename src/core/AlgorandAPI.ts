/**
 * Algorand API Integration for MachineGod System
 * Provides blockchain connectivity and API serving capabilities
 */

export interface AlgorandConfig {
  apiToken: string;
  mainnetNode: string;
  mainnetIndexer: string;
  testnetNode: string;
  testnetIndexer: string;
  betanetNode: string;
  betanetIndexer: string;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  headers?: Record<string, string>;
  timestamp: Date;
  network: 'mainnet' | 'testnet' | 'betanet';
}

export interface BlockchainStatus {
  network: string;
  lastRound: number;
  timeSinceLastRound: number;
  catchupTime: number;
  hasSyncedSinceStartup: boolean;
  stoppedAtUnsupportedRound: boolean;
}

export interface TransactionInfo {
  id: string;
  type: string;
  sender: string;
  receiver?: string;
  amount?: number;
  fee: number;
  round: number;
  timestamp: Date;
}

export class AlgorandAPI {
  private config: AlgorandConfig;
  private currentNetwork: 'mainnet' | 'testnet' | 'betanet' = 'mainnet';
  private requestCount = 0;
  private lastRequestTime = Date.now();
  private rateLimitDelay = 100; // ms between requests

  constructor() {
    this.config = {
      apiToken: '98D9CE80660AD243893D56D9F125CD2D',
      mainnetNode: 'https://mainnet-api.4160.nodely.io',
      mainnetIndexer: 'https://mainnet-idx.4160.nodely.io',
      testnetNode: 'https://testnet-api.4160.nodely.io',
      testnetIndexer: 'https://testnet-idx.4160.nodely.io',
      betanetNode: 'https://betanet-api.4160.nodely.io',
      betanetIndexer: 'https://betanet-idx.4160.nodely.io'
    };
    
    console.log('🔗 Algorand API integration initialized');
  }

  /**
   * Get current network status
   */
  async getNetworkStatus(network: 'mainnet' | 'testnet' | 'betanet' = this.currentNetwork): Promise<APIResponse<BlockchainStatus>> {
    const nodeUrl = this.getNodeUrl(network);
    
    try {
      const response = await this.makeRequest(`${nodeUrl}/v2/status`, network);
      
      if (response.success && response.data) {
        const status: BlockchainStatus = {
          network,
          lastRound: response.data['last-round'],
          timeSinceLastRound: response.data['time-since-last-round'],
          catchupTime: response.data['catchup-time'],
          hasSyncedSinceStartup: response.data['has-synced-since-startup'],
          stoppedAtUnsupportedRound: response.data['stopped-at-unsupported-round']
        };
        
        return {
          success: true,
          data: status,
          headers: response.headers,
          timestamp: new Date(),
          network
        };
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Failed to get network status: ${error}`,
        timestamp: new Date(),
        network
      };
    }
  }

  /**
   * Get account information
   */
  async getAccountInfo(address: string, network: 'mainnet' | 'testnet' | 'betanet' = this.currentNetwork): Promise<APIResponse> {
    const nodeUrl = this.getNodeUrl(network);
    
    try {
      const response = await this.makeRequest(`${nodeUrl}/v2/accounts/${address}`, network);
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Failed to get account info: ${error}`,
        timestamp: new Date(),
        network
      };
    }
  }

  /**
   * Get transaction information
   */
  async getTransaction(txId: string, network: 'mainnet' | 'testnet' | 'betanet' = this.currentNetwork): Promise<APIResponse<TransactionInfo>> {
    const indexerUrl = this.getIndexerUrl(network);
    
    try {
      const response = await this.makeRequest(`${indexerUrl}/v2/transactions/${txId}`, network);
      
      if (response.success && response.data && response.data.transaction) {
        const tx = response.data.transaction;
        const transactionInfo: TransactionInfo = {
          id: tx.id,
          type: tx['tx-type'],
          sender: tx.sender,
          receiver: tx['payment-transaction']?.receiver,
          amount: tx['payment-transaction']?.amount,
          fee: tx.fee,
          round: tx['confirmed-round'],
          timestamp: new Date(tx['round-time'] * 1000)
        };
        
        return {
          success: true,
          data: transactionInfo,
          headers: response.headers,
          timestamp: new Date(),
          network
        };
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Failed to get transaction: ${error}`,
        timestamp: new Date(),
        network
      };
    }
  }

  /**
   * Search transactions for an account
   */
  async searchTransactions(
    address: string, 
    limit: number = 10,
    network: 'mainnet' | 'testnet' | 'betanet' = this.currentNetwork
  ): Promise<APIResponse<TransactionInfo[]>> {
    const indexerUrl = this.getIndexerUrl(network);
    
    try {
      const response = await this.makeRequest(
        `${indexerUrl}/v2/accounts/${address}/transactions?limit=${limit}`, 
        network
      );
      
      if (response.success && response.data && response.data.transactions) {
        const transactions: TransactionInfo[] = response.data.transactions.map((tx: any) => ({
          id: tx.id,
          type: tx['tx-type'],
          sender: tx.sender,
          receiver: tx['payment-transaction']?.receiver,
          amount: tx['payment-transaction']?.amount,
          fee: tx.fee,
          round: tx['confirmed-round'],
          timestamp: new Date(tx['round-time'] * 1000)
        }));
        
        return {
          success: true,
          data: transactions,
          headers: response.headers,
          timestamp: new Date(),
          network
        };
      }
      
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Failed to search transactions: ${error}`,
        timestamp: new Date(),
        network
      };
    }
  }

  /**
   * Get application information
   */
  async getApplication(appId: number, network: 'mainnet' | 'testnet' | 'betanet' = this.currentNetwork): Promise<APIResponse> {
    const indexerUrl = this.getIndexerUrl(network);
    
    try {
      const response = await this.makeRequest(`${indexerUrl}/v2/applications/${appId}`, network);
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Failed to get application: ${error}`,
        timestamp: new Date(),
        network
      };
    }
  }

  /**
   * Get asset information
   */
  async getAsset(assetId: number, network: 'mainnet' | 'testnet' | 'betanet' = this.currentNetwork): Promise<APIResponse> {
    const indexerUrl = this.getIndexerUrl(network);
    
    try {
      const response = await this.makeRequest(`${indexerUrl}/v2/assets/${assetId}`, network);
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Failed to get asset: ${error}`,
        timestamp: new Date(),
        network
      };
    }
  }

  /**
   * Get block information
   */
  async getBlock(round: number, network: 'mainnet' | 'testnet' | 'betanet' = this.currentNetwork): Promise<APIResponse> {
    const nodeUrl = this.getNodeUrl(network);
    
    try {
      const response = await this.makeRequest(`${nodeUrl}/v2/blocks/${round}`, network);
      return response;
    } catch (error) {
      return {
        success: false,
        error: `Failed to get block: ${error}`,
        timestamp: new Date(),
        network
      };
    }
  }

  /**
   * Switch network
   */
  setNetwork(network: 'mainnet' | 'testnet' | 'betanet'): void {
    this.currentNetwork = network;
    console.log(`🔄 Switched to ${network} network`);
  }

  /**
   * Get current network
   */
  getCurrentNetwork(): 'mainnet' | 'testnet' | 'betanet' {
    return this.currentNetwork;
  }

  /**
   * Get API statistics
   */
  getAPIStats(): {
    requestCount: number;
    currentNetwork: string;
    lastRequestTime: Date;
    rateLimitDelay: number;
    tokenActive: boolean;
  } {
    return {
      requestCount: this.requestCount,
      currentNetwork: this.currentNetwork,
      lastRequestTime: new Date(this.lastRequestTime),
      rateLimitDelay: this.rateLimitDelay,
      tokenActive: true // Token is active if we can make requests
    };
  }

  /**
   * Test API connectivity
   */
  async testConnectivity(): Promise<{
    mainnet: boolean;
    testnet: boolean;
    betanet: boolean;
    tokenValid: boolean;
  }> {
    const results = {
      mainnet: false,
      testnet: false,
      betanet: false,
      tokenValid: false
    };

    // Test mainnet
    try {
      const mainnetStatus = await this.getNetworkStatus('mainnet');
      results.mainnet = mainnetStatus.success;
      if (mainnetStatus.success) results.tokenValid = true;
    } catch (error) {
      console.warn('Mainnet connectivity test failed:', error);
    }

    // Test testnet
    try {
      const testnetStatus = await this.getNetworkStatus('testnet');
      results.testnet = testnetStatus.success;
    } catch (error) {
      console.warn('Testnet connectivity test failed:', error);
    }

    // Test betanet
    try {
      const betanetStatus = await this.getNetworkStatus('betanet');
      results.betanet = betanetStatus.success;
    } catch (error) {
      console.warn('Betanet connectivity test failed:', error);
    }

    return results;
  }

  /**
   * Create API endpoint for serving data
   */
  createAPIEndpoint(path: string, handler: (params: any) => Promise<APIResponse>): void {
    // In a real implementation, this would register the endpoint with an Express server
    console.log(`📡 API endpoint registered: ${path}`);
  }

  /**
   * Serve MachineGod data through Algorand infrastructure
   */
  async serveMachineGodData(dataType: 'status' | 'training' | 'conversations' | 'evolution', params: any = {}): Promise<APIResponse> {
    // This would integrate with your MachineGod core to serve data
    const timestamp = new Date();
    
    try {
      switch (dataType) {
        case 'status':
          return {
            success: true,
            data: {
              type: 'machinegod-status',
              timestamp,
              network: this.currentNetwork,
              apiToken: 'bolt', // Show token is active
              ...params
            },
            headers: {
              'x-and-tk': 'bolt',
              'x-machinegod-version': '3.0.0',
              'x-api-type': 'status'
            },
            timestamp,
            network: this.currentNetwork
          };
          
        case 'training':
          return {
            success: true,
            data: {
              type: 'machinegod-training',
              timestamp,
              network: this.currentNetwork,
              apiToken: 'bolt',
              ...params
            },
            headers: {
              'x-and-tk': 'bolt',
              'x-machinegod-version': '3.0.0',
              'x-api-type': 'training'
            },
            timestamp,
            network: this.currentNetwork
          };
          
        default:
          return {
            success: false,
            error: 'Unknown data type',
            timestamp,
            network: this.currentNetwork
          };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to serve MachineGod data: ${error}`,
        timestamp,
        network: this.currentNetwork
      };
    }
  }

  private getNodeUrl(network: 'mainnet' | 'testnet' | 'betanet'): string {
    switch (network) {
      case 'mainnet': return this.config.mainnetNode;
      case 'testnet': return this.config.testnetNode;
      case 'betanet': return this.config.betanetNode;
      default: return this.config.mainnetNode;
    }
  }

  private getIndexerUrl(network: 'mainnet' | 'testnet' | 'betanet'): string {
    switch (network) {
      case 'mainnet': return this.config.mainnetIndexer;
      case 'testnet': return this.config.testnetIndexer;
      case 'betanet': return this.config.betanetIndexer;
      default: return this.config.mainnetIndexer;
    }
  }

  private async makeRequest(url: string, network: 'mainnet' | 'testnet' | 'betanet'): Promise<APIResponse> {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest));
    }

    this.requestCount++;
    this.lastRequestTime = Date.now();

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Algo-api-token': this.config.apiToken,
          'Content-Type': 'application/json',
          'User-Agent': 'MachineGod-API/3.0.0'
        }
      });

      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          headers,
          timestamp: new Date(),
          network
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
        headers,
        timestamp: new Date(),
        network
      };

    } catch (error) {
      return {
        success: false,
        error: `Request failed: ${error}`,
        timestamp: new Date(),
        network
      };
    }
  }

  /**
   * Export API configuration for external use
   */
  exportConfig(): AlgorandConfig {
    return { ...this.config };
  }

  /**
   * Health check for all networks
   */
  async healthCheck(): Promise<{
    overall: 'healthy' | 'degraded' | 'unhealthy';
    networks: Record<string, { status: string; latency: number; lastRound?: number }>;
    timestamp: Date;
  }> {
    const results: Record<string, { status: string; latency: number; lastRound?: number }> = {};
    const networks: Array<'mainnet' | 'testnet' | 'betanet'> = ['mainnet', 'testnet', 'betanet'];
    
    let healthyCount = 0;

    for (const network of networks) {
      const startTime = Date.now();
      try {
        const status = await this.getNetworkStatus(network);
        const latency = Date.now() - startTime;
        
        if (status.success) {
          results[network] = {
            status: 'healthy',
            latency,
            lastRound: status.data?.lastRound
          };
          healthyCount++;
        } else {
          results[network] = {
            status: 'unhealthy',
            latency
          };
        }
      } catch (error) {
        results[network] = {
          status: 'error',
          latency: Date.now() - startTime
        };
      }
    }

    let overall: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === networks.length) {
      overall = 'healthy';
    } else if (healthyCount > 0) {
      overall = 'degraded';
    } else {
      overall = 'unhealthy';
    }

    return {
      overall,
      networks: results,
      timestamp: new Date()
    };
  }
}