/**
 * Mobile App Bridge Service
 * Provides communication between web and mobile app versions
 */

export interface MobileAppConfig {
  platform: 'ios' | 'android' | 'web';
  version: string;
  capabilities: {
    offlineMode: boolean;
    pushNotifications: boolean;
    biometricAuth: boolean;
    fileAccess: boolean;
    cameraAccess: boolean;
    locationAccess: boolean;
  };
  deviceInfo: {
    model: string;
    osVersion: string;
    screenSize: { width: number; height: number };
    orientation: 'portrait' | 'landscape';
  };
}

export interface SyncStatus {
  lastSync: Date | null;
  pendingChanges: number;
  syncInProgress: boolean;
}

export class MobileAppBridge {
  private static instance: MobileAppBridge;
  private appConfig: MobileAppConfig | null = null;
  private isNative = false;
  private messageQueue: Array<{
    type: string;
    data: any;
    timestamp: Date;
  }> = [];
  private eventListeners: Map<string, Array<(data: any) => void>> = new Map();
  private syncStatus: SyncStatus = {
    lastSync: null,
    pendingChanges: 0,
    syncInProgress: false
  };

  static getInstance(): MobileAppBridge {
    if (!MobileAppBridge.instance) {
      MobileAppBridge.instance = new MobileAppBridge();
    }
    return MobileAppBridge.instance;
  }

  private constructor() {
    this.detectEnvironment();
    this.setupMessageHandlers();
    console.log('📱 Mobile App Bridge initialized');
  }

  private detectEnvironment() {
    // Check if running in a WebView
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes('android');
    const isIOS = userAgent.includes('iphone') || userAgent.includes('ipad');
    
    // Check for native app bridge
    this.isNative = (window as any).ReactNativeWebView !== undefined || 
                   (window as any).webkit?.messageHandlers?.bridge !== undefined;
    
    if (this.isNative) {
      console.log('📱 Running in native mobile app WebView');
      
      this.appConfig = {
        platform: isAndroid ? 'android' : isIOS ? 'ios' : 'web',
        version: '1.0.0', // This would be injected by the native app
        capabilities: {
          offlineMode: true,
          pushNotifications: true,
          biometricAuth: true,
          fileAccess: true,
          cameraAccess: true,
          locationAccess: true
        },
        deviceInfo: {
          model: 'Unknown', // Would be injected by native app
          osVersion: 'Unknown', // Would be injected by native app
          screenSize: { 
            width: window.innerWidth, 
            height: window.innerHeight 
          },
          orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        }
      };
    } else {
      console.log('🌐 Running in web browser');
      
      this.appConfig = {
        platform: 'web',
        version: '1.0.0',
        capabilities: {
          offlineMode: true,
          pushNotifications: 'Notification' in window && Notification.permission === 'granted',
          biometricAuth: false,
          fileAccess: false,
          cameraAccess: false,
          locationAccess: false
        },
        deviceInfo: {
          model: 'Web Browser',
          osVersion: navigator.userAgent,
          screenSize: { 
            width: window.innerWidth, 
            height: window.innerHeight 
          },
          orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
        }
      };
    }
  }

  private setupMessageHandlers() {
    // Listen for messages from native app
    if (this.isNative) {
      // For Android
      (window as any).receiveMessageFromNative = (message: string) => {
        try {
          const parsedMessage = JSON.parse(message);
          this.handleNativeMessage(parsedMessage);
        } catch (error) {
          console.error('Failed to parse message from native app:', error);
        }
      };
      
      // For iOS
      document.addEventListener('message', (event: any) => {
        try {
          const parsedMessage = JSON.parse(event.data);
          this.handleNativeMessage(parsedMessage);
        } catch (error) {
          console.error('Failed to parse message from native app:', error);
        }
      });
    }
    
    // Listen for orientation changes
    window.addEventListener('resize', () => {
      if (this.appConfig) {
        this.appConfig.deviceInfo.screenSize = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        this.appConfig.deviceInfo.orientation = 
          window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        
        this.dispatchEvent('orientationChange', {
          orientation: this.appConfig.deviceInfo.orientation,
          screenSize: this.appConfig.deviceInfo.screenSize
        });
      }
    });
  }

  private handleNativeMessage(message: { type: string; data: any }) {
    console.log('📱 Received message from native app:', message.type);
    
    // Update app config if provided
    if (message.type === 'appConfig' && message.data) {
      this.appConfig = { ...this.appConfig, ...message.data };
    }
    
    // Update sync status if provided
    if (message.type === 'syncStatus' && message.data) {
      this.syncStatus = { ...this.syncStatus, ...message.data };
    }
    
    // Dispatch event to listeners
    this.dispatchEvent(message.type, message.data);
  }

  private dispatchEvent(type: string, data: any) {
    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error(`Error in event listener for ${type}:`, error);
      }
    });
  }

  /**
   * Send message to native app
   */
  sendMessage(type: string, data: any = {}): boolean {
    if (!this.isNative) {
      // Queue message for later if not in native app
      this.messageQueue.push({
        type,
        data,
        timestamp: new Date()
      });
      return false;
    }
    
    const message = JSON.stringify({ type, data });
    
    try {
      // Android
      if ((window as any).ReactNativeWebView) {
        (window as any).ReactNativeWebView.postMessage(message);
        return true;
      }
      
      // iOS
      if ((window as any).webkit?.messageHandlers?.bridge) {
        (window as any).webkit.messageHandlers.bridge.postMessage(message);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to send message to native app:', error);
      return false;
    }
  }

  /**
   * Register event listener
   */
  addEventListener(type: string, callback: (data: any) => void): () => void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    
    this.eventListeners.get(type)!.push(callback);
    
    return () => {
      const listeners = this.eventListeners.get(type) || [];
      this.eventListeners.set(
        type,
        listeners.filter(listener => listener !== callback)
      );
    };
  }

  /**
   * Check if running in native app
   */
  isNativeApp(): boolean {
    return this.isNative;
  }

  /**
   * Get app configuration
   */
  getAppConfig(): MobileAppConfig | null {
    return this.appConfig;
  }

  /**
   * Request native feature
   */
  async requestNativeFeature(
    feature: 'camera' | 'location' | 'biometric' | 'notification' | 'file'
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.isNative) {
      if (feature === 'notification' && 'Notification' in window) {
        try {
          const permission = await Notification.requestPermission();
          return {
            success: permission === 'granted',
            data: { permission }
          };
        } catch (error) {
          return {
            success: false,
            error: 'Failed to request notification permission'
          };
        }
      }
      
      return {
        success: false,
        error: 'Not supported in web browser'
      };
    }
    
    return new Promise(resolve => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const cleanup = this.addEventListener('featureResponse', (response) => {
        if (response.requestId === requestId) {
          cleanup();
          resolve(response);
        }
      });
      
      this.sendMessage('requestFeature', {
        feature,
        requestId
      });
      
      // Timeout after 10 seconds
      setTimeout(() => {
        cleanup();
        resolve({
          success: false,
          error: 'Request timed out'
        });
      }, 10000);
    });
  }

  /**
   * Sync data with native app
   */
  async syncData(): Promise<SyncStatus> {
    if (!this.isNative) {
      return this.syncStatus;
    }
    
    this.syncStatus.syncInProgress = true;
    
    return new Promise(resolve => {
      const cleanup = this.addEventListener('syncComplete', (status) => {
        cleanup();
        this.syncStatus = { ...this.syncStatus, ...status, syncInProgress: false };
        resolve(this.syncStatus);
      });
      
      this.sendMessage('syncData');
      
      // Timeout after 30 seconds
      setTimeout(() => {
        cleanup();
        this.syncStatus.syncInProgress = false;
        resolve(this.syncStatus);
      }, 30000);
    });
  }

  /**
   * Get pending messages
   */
  getPendingMessages(): Array<{
    type: string;
    data: any;
    timestamp: Date;
  }> {
    return [...this.messageQueue];
  }

  /**
   * Clear pending messages
   */
  clearPendingMessages(): void {
    this.messageQueue = [];
  }

  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  /**
   * Check if feature is available
   */
  isFeatureAvailable(feature: keyof MobileAppConfig['capabilities']): boolean {
    return this.appConfig?.capabilities[feature] || false;
  }

  /**
   * Get platform
   */
  getPlatform(): 'ios' | 'android' | 'web' {
    return this.appConfig?.platform || 'web';
  }

  /**
   * Get app version
   */
  getAppVersion(): string {
    return this.appConfig?.version || '1.0.0';
  }
}