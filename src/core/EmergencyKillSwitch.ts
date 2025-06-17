/**
 * Emergency Kill Switch System
 * Provides immediate system shutdown and safety protocols
 */

export interface EmergencyProtocol {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoTrigger: boolean;
  conditions: string[];
}

export interface SystemHealth {
  cpu: number;
  memory: number;
  responseTime: number;
  errorRate: number;
  truthProtocolStability: number;
  apiConnectivity: number;
  overallHealth: 'healthy' | 'degraded' | 'critical' | 'emergency';
}

export class EmergencyKillSwitch {
  private isArmed = true;
  private emergencyActive = false;
  private protocols: Map<string, EmergencyProtocol> = new Map();
  private healthMetrics: SystemHealth;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private emergencyCallbacks: Array<() => Promise<void>> = [];
  private lastHealthCheck = Date.now();
  private emergencyLog: Array<{timestamp: Date, protocol: string, reason: string}> = [];

  constructor() {
    this.initializeProtocols();
    this.initializeHealthMetrics();
    this.startHealthMonitoring();
    console.log('🚨 Emergency Kill Switch armed and monitoring');
  }

  private initializeProtocols() {
    const protocols: EmergencyProtocol[] = [
      {
        id: 'memory-overflow',
        name: 'Memory Overflow Protection',
        description: 'Triggers when memory usage exceeds 90%',
        severity: 'high',
        autoTrigger: true,
        conditions: ['memory > 90%', 'sustained for 30 seconds']
      },
      {
        id: 'infinite-loop',
        name: 'Infinite Loop Detection',
        description: 'Detects and stops infinite processing loops',
        severity: 'critical',
        autoTrigger: true,
        conditions: ['response time > 60 seconds', 'no progress indicators']
      },
      {
        id: 'truth-protocol-failure',
        name: 'Truth Protocol Breakdown',
        description: 'Activates when truth stratification fails critically',
        severity: 'high',
        autoTrigger: true,
        conditions: ['truth confidence < 10%', 'geometric verification fails']
      },
      {
        id: 'api-cascade-failure',
        name: 'API Cascade Failure',
        description: 'Multiple API endpoints failing simultaneously',
        severity: 'medium',
        autoTrigger: true,
        conditions: ['API connectivity < 20%', 'multiple endpoint failures']
      },
      {
        id: 'training-divergence',
        name: 'Training Divergence Emergency',
        description: 'Algorithm evolution producing harmful patterns',
        severity: 'critical',
        autoTrigger: true,
        conditions: ['performance degradation > 50%', 'harmful pattern detection']
      },
      {
        id: 'manual-override',
        name: 'Manual Emergency Override',
        description: 'User-initiated emergency shutdown',
        severity: 'critical',
        autoTrigger: false,
        conditions: ['user command', 'immediate execution']
      }
    ];

    protocols.forEach(protocol => {
      this.protocols.set(protocol.id, protocol);
    });
  }

  private initializeHealthMetrics() {
    this.healthMetrics = {
      cpu: 0,
      memory: 0,
      responseTime: 0,
      errorRate: 0,
      truthProtocolStability: 100,
      apiConnectivity: 100,
      overallHealth: 'healthy'
    };
  }

  private startHealthMonitoring() {
    this.monitoringInterval = setInterval(() => {
      this.updateHealthMetrics();
      this.checkEmergencyConditions();
    }, 1000); // Check every second
  }

  private updateHealthMetrics() {
    // Simulate system metrics (in real implementation, these would be actual system calls)
    this.healthMetrics.cpu = Math.random() * 100;
    this.healthMetrics.memory = Math.random() * 100;
    this.healthMetrics.responseTime = 100 + Math.random() * 500;
    this.healthMetrics.errorRate = Math.random() * 10;
    this.healthMetrics.truthProtocolStability = 80 + Math.random() * 20;
    this.healthMetrics.apiConnectivity = 70 + Math.random() * 30;

    // Calculate overall health
    const healthScore = (
      (100 - this.healthMetrics.cpu) * 0.2 +
      (100 - this.healthMetrics.memory) * 0.3 +
      (Math.max(0, 1000 - this.healthMetrics.responseTime) / 1000 * 100) * 0.2 +
      (100 - this.healthMetrics.errorRate * 10) * 0.1 +
      this.healthMetrics.truthProtocolStability * 0.1 +
      this.healthMetrics.apiConnectivity * 0.1
    );

    if (healthScore > 80) {
      this.healthMetrics.overallHealth = 'healthy';
    } else if (healthScore > 60) {
      this.healthMetrics.overallHealth = 'degraded';
    } else if (healthScore > 30) {
      this.healthMetrics.overallHealth = 'critical';
    } else {
      this.healthMetrics.overallHealth = 'emergency';
    }

    this.lastHealthCheck = Date.now();
  }

  private checkEmergencyConditions() {
    if (!this.isArmed || this.emergencyActive) return;

    // Check memory overflow
    if (this.healthMetrics.memory > 90) {
      this.triggerEmergency('memory-overflow', 'Memory usage exceeded 90%');
      return;
    }

    // Check response time
    if (this.healthMetrics.responseTime > 60000) {
      this.triggerEmergency('infinite-loop', 'Response time exceeded 60 seconds');
      return;
    }

    // Check truth protocol stability
    if (this.healthMetrics.truthProtocolStability < 10) {
      this.triggerEmergency('truth-protocol-failure', 'Truth protocol confidence below 10%');
      return;
    }

    // Check API connectivity
    if (this.healthMetrics.apiConnectivity < 20) {
      this.triggerEmergency('api-cascade-failure', 'API connectivity below 20%');
      return;
    }

    // Check overall health
    if (this.healthMetrics.overallHealth === 'emergency') {
      this.triggerEmergency('manual-override', 'Overall system health critical');
      return;
    }
  }

  /**
   * Trigger emergency protocol
   */
  async triggerEmergency(protocolId: string, reason: string): Promise<void> {
    if (this.emergencyActive) {
      console.warn('🚨 Emergency already active, ignoring additional triggers');
      return;
    }

    const protocol = this.protocols.get(protocolId);
    if (!protocol) {
      console.error(`❌ Unknown emergency protocol: ${protocolId}`);
      return;
    }

    this.emergencyActive = true;
    console.log(`🚨 EMERGENCY PROTOCOL ACTIVATED: ${protocol.name}`);
    console.log(`📋 Reason: ${reason}`);
    console.log(`⚠️ Severity: ${protocol.severity.toUpperCase()}`);

    // Log emergency
    this.emergencyLog.push({
      timestamp: new Date(),
      protocol: protocol.name,
      reason
    });

    try {
      // Execute emergency callbacks
      console.log('🔧 Executing emergency shutdown procedures...');
      for (const callback of this.emergencyCallbacks) {
        await callback();
      }

      // Stop health monitoring
      if (this.monitoringInterval) {
        clearInterval(this.monitoringInterval);
        this.monitoringInterval = null;
      }

      console.log('✅ Emergency shutdown completed successfully');
      
    } catch (error) {
      console.error('❌ Emergency shutdown failed:', error);
    }
  }

  /**
   * Manual emergency trigger
   */
  async manualEmergencyShutdown(reason: string = 'Manual override'): Promise<void> {
    await this.triggerEmergency('manual-override', reason);
  }

  /**
   * Register emergency callback
   */
  registerEmergencyCallback(callback: () => Promise<void>): void {
    this.emergencyCallbacks.push(callback);
  }

  /**
   * Arm/disarm kill switch
   */
  setArmed(armed: boolean): void {
    this.isArmed = armed;
    console.log(`🚨 Emergency Kill Switch ${armed ? 'ARMED' : 'DISARMED'}`);
  }

  /**
   * Get current health metrics
   */
  getHealthMetrics(): SystemHealth {
    return { ...this.healthMetrics };
  }

  /**
   * Get emergency protocols
   */
  getProtocols(): EmergencyProtocol[] {
    return Array.from(this.protocols.values());
  }

  /**
   * Get emergency log
   */
  getEmergencyLog(): Array<{timestamp: Date, protocol: string, reason: string}> {
    return [...this.emergencyLog];
  }

  /**
   * Check if emergency is active
   */
  isEmergencyActive(): boolean {
    return this.emergencyActive;
  }

  /**
   * Reset emergency state (use with caution)
   */
  resetEmergencyState(): void {
    this.emergencyActive = false;
    this.startHealthMonitoring();
    console.log('🔄 Emergency state reset - system monitoring resumed');
  }

  /**
   * Get system status for dashboard
   */
  getSystemStatus(): {
    armed: boolean;
    emergencyActive: boolean;
    health: SystemHealth;
    lastCheck: Date;
    protocolCount: number;
    emergencyCount: number;
  } {
    return {
      armed: this.isArmed,
      emergencyActive: this.emergencyActive,
      health: this.healthMetrics,
      lastCheck: new Date(this.lastHealthCheck),
      protocolCount: this.protocols.size,
      emergencyCount: this.emergencyLog.length
    };
  }

  /**
   * Cleanup and shutdown
   */
  shutdown(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('🔌 Emergency Kill Switch shutdown complete');
  }
}