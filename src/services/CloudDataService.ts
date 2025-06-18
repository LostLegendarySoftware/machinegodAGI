/**
 * Cloud Data Persistence Service
 * Handles data synchronization with cloud storage
 */

export interface CloudData {
  id: string;
  userId: string;
  type: 'conversation' | 'training' | 'settings' | 'benchmark';
  data: any;
  timestamp: Date;
  version: number;
  synced: boolean;
}

export interface SyncStatus {
  lastSync: Date | null;
  pendingUploads: number;
  pendingDownloads: number;
  isOnline: boolean;
  syncInProgress: boolean;
}

export class CloudDataService {
  private static instance: CloudDataService;
  private localData: Map<string, CloudData> = new Map();
  private syncQueue: CloudData[] = [];
  private syncStatus: SyncStatus = {
    lastSync: null,
    pendingUploads: 0,
    pendingDownloads: 0,
    isOnline: navigator.onLine,
    syncInProgress: false
  };
  private listeners: ((status: SyncStatus) => void)[] = [];

  static getInstance(): CloudDataService {
    if (!CloudDataService.instance) {
      CloudDataService.instance = new CloudDataService();
    }
    return CloudDataService.instance;
  }

  private constructor() {
    this.initializeCloudSync();
    this.setupNetworkListeners();
    this.loadLocalData();
  }

  private initializeCloudSync() {
    // Auto-sync every 5 minutes
    setInterval(() => {
      if (this.syncStatus.isOnline && !this.syncStatus.syncInProgress) {
        this.syncWithCloud();
      }
    }, 5 * 60 * 1000);
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.syncStatus.isOnline = true;
      this.notifyListeners();
      this.syncWithCloud();
    });

    window.addEventListener('offline', () => {
      this.syncStatus.isOnline = false;
      this.notifyListeners();
    });
  }

  private loadLocalData() {
    try {
      const stored = localStorage.getItem('cloud_data');
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([key, value]: [string, any]) => {
          this.localData.set(key, {
            ...value,
            timestamp: new Date(value.timestamp)
          });
        });
      }
    } catch (error) {
      console.error('Failed to load local data:', error);
    }
  }

  private saveLocalData() {
    try {
      const data = Object.fromEntries(this.localData);
      localStorage.setItem('cloud_data', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save local data:', error);
    }
  }

  async saveData(type: CloudData['type'], data: any, userId: string): Promise<string> {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const cloudData: CloudData = {
      id,
      userId,
      type,
      data,
      timestamp: new Date(),
      version: 1,
      synced: false
    };

    this.localData.set(id, cloudData);
    this.saveLocalData();

    // Add to sync queue if online
    if (this.syncStatus.isOnline) {
      this.syncQueue.push(cloudData);
      this.syncStatus.pendingUploads++;
      this.notifyListeners();
      
      // Trigger immediate sync for important data
      if (type === 'conversation' || type === 'training') {
        this.syncWithCloud();
      }
    }

    return id;
  }

  async getData(id: string): Promise<CloudData | null> {
    return this.localData.get(id) || null;
  }

  async getDataByType(type: CloudData['type'], userId: string): Promise<CloudData[]> {
    return Array.from(this.localData.values())
      .filter(item => item.type === type && item.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async deleteData(id: string): Promise<boolean> {
    const exists = this.localData.has(id);
    if (exists) {
      this.localData.delete(id);
      this.saveLocalData();
      
      // Mark for deletion in cloud
      if (this.syncStatus.isOnline) {
        await this.deleteFromCloud(id);
      }
    }
    return exists;
  }

  async syncWithCloud(): Promise<void> {
    if (this.syncStatus.syncInProgress || !this.syncStatus.isOnline) {
      return;
    }

    this.syncStatus.syncInProgress = true;
    this.notifyListeners();

    try {
      // Upload pending data
      await this.uploadPendingData();
      
      // Download new data
      await this.downloadNewData();
      
      this.syncStatus.lastSync = new Date();
      this.syncStatus.pendingUploads = 0;
      this.syncStatus.pendingDownloads = 0;
      
      console.log('✅ Cloud sync completed successfully');
    } catch (error) {
      console.error('❌ Cloud sync failed:', error);
    } finally {
      this.syncStatus.syncInProgress = false;
      this.notifyListeners();
    }
  }

  private async uploadPendingData(): Promise<void> {
    const pendingData = this.syncQueue.splice(0);
    
    for (const data of pendingData) {
      try {
        // Simulate cloud upload
        await this.uploadToCloud(data);
        
        // Mark as synced
        const localData = this.localData.get(data.id);
        if (localData) {
          localData.synced = true;
          this.localData.set(data.id, localData);
        }
      } catch (error) {
        // Re-add to queue on failure
        this.syncQueue.push(data);
        throw error;
      }
    }
    
    this.saveLocalData();
  }

  private async downloadNewData(): Promise<void> {
    // Simulate downloading new data from cloud
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would fetch data from the cloud
    // and merge it with local data, handling conflicts appropriately
  }

  private async uploadToCloud(data: CloudData): Promise<void> {
    // Simulate cloud API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real implementation, this would make an actual API call
    console.log(`📤 Uploaded ${data.type} data to cloud:`, data.id);
  }

  private async deleteFromCloud(id: string): Promise<void> {
    // Simulate cloud deletion
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(`🗑️ Deleted data from cloud:`, id);
  }

  async exportData(userId: string): Promise<string> {
    const userData = Array.from(this.localData.values())
      .filter(item => item.userId === userId);
    
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      dataCount: userData.length,
      data: userData
    }, null, 2);
  }

  async importData(jsonData: string, userId: string): Promise<number> {
    try {
      const imported = JSON.parse(jsonData);
      let importedCount = 0;
      
      if (imported.data && Array.isArray(imported.data)) {
        for (const item of imported.data) {
          const cloudData: CloudData = {
            ...item,
            userId, // Override with current user
            timestamp: new Date(item.timestamp),
            synced: false // Mark for re-sync
          };
          
          this.localData.set(cloudData.id, cloudData);
          importedCount++;
        }
        
        this.saveLocalData();
      }
      
      return importedCount;
    } catch (error) {
      throw new Error('Invalid import data format');
    }
  }

  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  subscribe(listener: (status: SyncStatus) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.syncStatus));
  }

  async clearAllData(userId: string): Promise<void> {
    const userDataIds = Array.from(this.localData.entries())
      .filter(([_, data]) => data.userId === userId)
      .map(([id]) => id);
    
    userDataIds.forEach(id => this.localData.delete(id));
    this.saveLocalData();
    
    console.log(`🗑️ Cleared ${userDataIds.length} data items for user ${userId}`);
  }
}