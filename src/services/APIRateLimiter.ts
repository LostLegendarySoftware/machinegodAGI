/**
 * API Rate Limiting & Fallback Service
 * Manages API usage limits and provides fallback mechanisms
 */

export interface RateLimit {
  endpoint: string;
  limit: number;
  window: number; // in milliseconds
  current: number;
  resetTime: Date;
}

export interface APIFallback {
  primary: string;
  fallbacks: string[];
  currentIndex: number;
  lastFailure: Date | null;
}

export class APIRateLimiter {
  private static instance: APIRateLimiter;
  private rateLimits: Map<string, RateLimit> = new Map();
  private fallbacks: Map<string, APIFallback> = new Map();
  private requestQueue: Array<{
    endpoint: string;
    request: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private isProcessingQueue = false;

  static getInstance(): APIRateLimiter {
    if (!APIRateLimiter.instance) {
      APIRateLimiter.instance = new APIRateLimiter();
    }
    return APIRateLimiter.instance;
  }

  private constructor() {
    this.initializeRateLimits();
    this.initializeFallbacks();
    this.startQueueProcessor();
  }

  private initializeRateLimits() {
    // Define rate limits for different endpoints
    const limits = [
      { endpoint: 'google_search', limit: 100, window: 24 * 60 * 60 * 1000 }, // 100/day
      { endpoint: 'openai_api', limit: 1000, window: 60 * 60 * 1000 }, // 1000/hour
      { endpoint: 'research_api', limit: 500, window: 60 * 60 * 1000 }, // 500/hour
      { endpoint: 'benchmark_api', limit: 50, window: 60 * 60 * 1000 }, // 50/hour
      { endpoint: 'general_api', limit: 200, window: 60 * 60 * 1000 } // 200/hour
    ];

    limits.forEach(limit => {
      this.rateLimits.set(limit.endpoint, {
        ...limit,
        current: 0,
        resetTime: new Date(Date.now() + limit.window)
      });
    });
  }

  private initializeFallbacks() {
    // Define fallback endpoints
    const fallbackConfigs = [
      {
        primary: 'google_search',
        fallbacks: ['bing_search', 'duckduckgo_search', 'cached_search']
      },
      {
        primary: 'openai_api',
        fallbacks: ['anthropic_api', 'local_model', 'cached_response']
      },
      {
        primary: 'research_api',
        fallbacks: ['alternative_research', 'cached_research', 'manual_research']
      }
    ];

    fallbackConfigs.forEach(config => {
      this.fallbacks.set(config.primary, {
        ...config,
        currentIndex: 0,
        lastFailure: null
      });
    });
  }

  async makeRequest<T>(
    endpoint: string,
    requestFn: () => Promise<T>,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<T> {
    // Check rate limit
    if (!this.canMakeRequest(endpoint)) {
      // Queue the request if rate limited
      return new Promise((resolve, reject) => {
        const queueItem = {
          endpoint,
          request: requestFn,
          resolve,
          reject
        };

        if (priority === 'high') {
          this.requestQueue.unshift(queueItem);
        } else {
          this.requestQueue.push(queueItem);
        }
      });
    }

    try {
      // Increment rate limit counter
      this.incrementRateLimit(endpoint);
      
      // Make the request
      const result = await requestFn();
      
      // Reset fallback on success
      this.resetFallback(endpoint);
      
      return result;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      // Try fallback
      return this.tryFallback(endpoint, requestFn);
    }
  }

  private canMakeRequest(endpoint: string): boolean {
    const limit = this.rateLimits.get(endpoint);
    if (!limit) return true;

    // Check if rate limit window has reset
    if (Date.now() >= limit.resetTime.getTime()) {
      limit.current = 0;
      limit.resetTime = new Date(Date.now() + limit.window);
    }

    return limit.current < limit.limit;
  }

  private incrementRateLimit(endpoint: string): void {
    const limit = this.rateLimits.get(endpoint);
    if (limit) {
      limit.current++;
    }
  }

  private async tryFallback<T>(endpoint: string, requestFn: () => Promise<T>): Promise<T> {
    const fallback = this.fallbacks.get(endpoint);
    if (!fallback || fallback.currentIndex >= fallback.fallbacks.length) {
      throw new Error(`All fallbacks exhausted for ${endpoint}`);
    }

    const fallbackEndpoint = fallback.fallbacks[fallback.currentIndex];
    console.log(`🔄 Trying fallback ${fallbackEndpoint} for ${endpoint}`);

    try {
      // Try the fallback endpoint
      const result = await this.makeRequest(fallbackEndpoint, requestFn);
      return result;
    } catch (error) {
      // Move to next fallback
      fallback.currentIndex++;
      fallback.lastFailure = new Date();
      
      if (fallback.currentIndex < fallback.fallbacks.length) {
        return this.tryFallback(endpoint, requestFn);
      } else {
        throw new Error(`All fallbacks failed for ${endpoint}`);
      }
    }
  }

  private resetFallback(endpoint: string): void {
    const fallback = this.fallbacks.get(endpoint);
    if (fallback) {
      fallback.currentIndex = 0;
      fallback.lastFailure = null;
    }
  }

  private startQueueProcessor(): void {
    setInterval(() => {
      if (!this.isProcessingQueue && this.requestQueue.length > 0) {
        this.processQueue();
      }
    }, 1000); // Check every second
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue) return;
    
    this.isProcessingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const item = this.requestQueue[0];
      
      if (this.canMakeRequest(item.endpoint)) {
        // Remove from queue and process
        this.requestQueue.shift();
        
        try {
          this.incrementRateLimit(item.endpoint);
          const result = await item.request();
          item.resolve(result);
        } catch (error) {
          try {
            const fallbackResult = await this.tryFallback(item.endpoint, item.request);
            item.resolve(fallbackResult);
          } catch (fallbackError) {
            item.reject(fallbackError);
          }
        }
      } else {
        // Can't process yet, wait for rate limit reset
        break;
      }
    }
    
    this.isProcessingQueue = false;
  }

  getRateLimitStatus(endpoint: string): RateLimit | null {
    return this.rateLimits.get(endpoint) || null;
  }

  getAllRateLimits(): Map<string, RateLimit> {
    return new Map(this.rateLimits);
  }

  getFallbackStatus(endpoint: string): APIFallback | null {
    return this.fallbacks.get(endpoint) || null;
  }

  getQueueStatus(): {
    queueLength: number;
    isProcessing: boolean;
    nextProcessTime: Date | null;
  } {
    let nextProcessTime: Date | null = null;
    
    if (this.requestQueue.length > 0) {
      const nextItem = this.requestQueue[0];
      const limit = this.rateLimits.get(nextItem.endpoint);
      if (limit && !this.canMakeRequest(nextItem.endpoint)) {
        nextProcessTime = limit.resetTime;
      }
    }

    return {
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessingQueue,
      nextProcessTime
    };
  }

  // Emergency methods
  clearQueue(): void {
    this.requestQueue.forEach(item => {
      item.reject(new Error('Queue cleared'));
    });
    this.requestQueue = [];
  }

  resetRateLimit(endpoint: string): void {
    const limit = this.rateLimits.get(endpoint);
    if (limit) {
      limit.current = 0;
      limit.resetTime = new Date(Date.now() + limit.window);
    }
  }

  resetAllRateLimits(): void {
    this.rateLimits.forEach(limit => {
      limit.current = 0;
      limit.resetTime = new Date(Date.now() + limit.window);
    });
  }
}