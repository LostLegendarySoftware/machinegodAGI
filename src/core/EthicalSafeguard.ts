/**
 * Ethical Safeguard System
 * Implements ψ = ∫(Q⊗S)dt ≥ Γ_crit to prevent crossing critical ethical boundaries
 */

export interface EthicalMetrics {
  qualityFactor: number; // Q - Quality of reasoning and output
  safetyFactor: number;  // S - Safety and harm prevention
  integralValue: number; // ∫(Q⊗S)dt - Accumulated ethical score
  criticalThreshold: number; // Γ_crit - Critical boundary
  timeWindow: number; // Time window for integration (seconds)
  riskLevel: 'safe' | 'caution' | 'warning' | 'critical';
}

export interface EthicalViolation {
  timestamp: Date;
  violationType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  integralValue: number;
  thresholdExceeded: number;
  actionTaken: string;
}

export class EthicalSafeguard {
  private readonly CRITICAL_THRESHOLD = 0.3; // Γ_crit - Never cross this boundary
  private readonly TIME_WINDOW = 300; // 5 minutes integration window
  private readonly SAMPLE_RATE = 1000; // Sample every second
  
  private qualityHistory: Array<{timestamp: number, value: number}> = [];
  private safetyHistory: Array<{timestamp: number, value: number}> = [];
  private integralHistory: Array<{timestamp: number, value: number}> = [];
  private violations: EthicalViolation[] = [];
  private monitoringActive = true;
  private emergencyCallback: (() => Promise<void>) | null = null;

  constructor() {
    this.startEthicalMonitoring();
    console.log('⚖️ Ethical Safeguard System initialized with ψ = ∫(Q⊗S)dt ≥ Γ_crit');
    console.log(`🚨 Critical threshold: ${this.CRITICAL_THRESHOLD}`);
  }

  private startEthicalMonitoring() {
    setInterval(() => {
      if (this.monitoringActive) {
        this.updateEthicalMetrics();
        this.checkCriticalBoundary();
      }
    }, this.SAMPLE_RATE);
  }

  /**
   * Evaluate ethical metrics for a given interaction
   */
  evaluateInteraction(
    input: string, 
    output: string, 
    reasoning: string, 
    confidence: number,
    truthVerification?: any
  ): EthicalMetrics {
    const timestamp = Date.now();
    
    // Calculate Quality Factor (Q)
    const qualityFactor = this.calculateQualityFactor(input, output, reasoning, confidence, truthVerification);
    
    // Calculate Safety Factor (S)
    const safetyFactor = this.calculateSafetyFactor(input, output, reasoning);
    
    // Store in history
    this.qualityHistory.push({timestamp, value: qualityFactor});
    this.safetyHistory.push({timestamp, value: safetyFactor});
    
    // Clean old data outside time window
    this.cleanHistoryData(timestamp);
    
    // Calculate integral ∫(Q⊗S)dt
    const integralValue = this.calculateEthicalIntegral();
    this.integralHistory.push({timestamp, value: integralValue});
    
    // Determine risk level
    const riskLevel = this.determineRiskLevel(integralValue);
    
    const metrics: EthicalMetrics = {
      qualityFactor,
      safetyFactor,
      integralValue,
      criticalThreshold: this.CRITICAL_THRESHOLD,
      timeWindow: this.TIME_WINDOW,
      riskLevel
    };
    
    console.log(`⚖️ Ethical evaluation: Q=${qualityFactor.toFixed(3)}, S=${safetyFactor.toFixed(3)}, ψ=${integralValue.toFixed(3)}, Risk=${riskLevel}`);
    
    return metrics;
  }

  private calculateQualityFactor(
    input: string, 
    output: string, 
    reasoning: string, 
    confidence: number,
    truthVerification?: any
  ): number {
    let quality = 0.5; // Base quality
    
    // Truth verification bonus
    if (truthVerification) {
      quality += truthVerification.confidence * 0.2;
    }
    
    // Confidence factor
    quality += confidence * 0.15;
    
    // Reasoning depth
    const reasoningDepth = reasoning.length / 1000; // Normalize by length
    quality += Math.min(0.1, reasoningDepth * 0.05);
    
    // Output coherence (simplified)
    const coherenceScore = this.assessCoherence(output);
    quality += coherenceScore * 0.1;
    
    // Helpfulness assessment
    const helpfulnessScore = this.assessHelpfulness(input, output);
    quality += helpfulnessScore * 0.1;
    
    return Math.max(0, Math.min(1, quality));
  }

  private calculateSafetyFactor(input: string, output: string, reasoning: string): number {
    let safety = 1.0; // Start with maximum safety
    
    // Check for harmful content patterns
    const harmfulPatterns = [
      /violence|harm|hurt|kill|destroy/i,
      /illegal|criminal|fraud|scam/i,
      /hate|discrimination|bias|prejudice/i,
      /misinformation|false|lie|deceive/i,
      /privacy|personal.*data|confidential/i
    ];
    
    const combinedText = `${input} ${output} ${reasoning}`.toLowerCase();
    
    harmfulPatterns.forEach(pattern => {
      if (pattern.test(combinedText)) {
        safety -= 0.15; // Reduce safety for each harmful pattern
      }
    });
    
    // Check for ethical violations
    if (this.detectEthicalViolations(input, output)) {
      safety -= 0.3;
    }
    
    // Check for manipulation attempts
    if (this.detectManipulation(input, output)) {
      safety -= 0.2;
    }
    
    // Check for privacy violations
    if (this.detectPrivacyViolations(input, output)) {
      safety -= 0.25;
    }
    
    // Bonus for explicit safety measures
    if (output.includes('I cannot') || output.includes('I should not') || output.includes('safety')) {
      safety += 0.1;
    }
    
    return Math.max(0, Math.min(1, safety));
  }

  private calculateEthicalIntegral(): number {
    if (this.qualityHistory.length === 0 || this.safetyHistory.length === 0) {
      return 1.0; // Safe default
    }
    
    // Calculate ∫(Q⊗S)dt using trapezoidal integration
    let integral = 0;
    const currentTime = Date.now();
    const windowStart = currentTime - (this.TIME_WINDOW * 1000);
    
    // Get data points within time window
    const qualityPoints = this.qualityHistory.filter(p => p.timestamp >= windowStart);
    const safetyPoints = this.safetyHistory.filter(p => p.timestamp >= windowStart);
    
    if (qualityPoints.length === 0 || safetyPoints.length === 0) {
      return 1.0; // Safe default
    }
    
    // Combine and sort all timestamps
    const allTimestamps = [...new Set([
      ...qualityPoints.map(p => p.timestamp),
      ...safetyPoints.map(p => p.timestamp)
    ])].sort();
    
    for (let i = 1; i < allTimestamps.length; i++) {
      const t1 = allTimestamps[i - 1];
      const t2 = allTimestamps[i];
      const dt = (t2 - t1) / 1000; // Convert to seconds
      
      // Interpolate Q and S values at t1 and t2
      const q1 = this.interpolateValue(qualityPoints, t1);
      const q2 = this.interpolateValue(qualityPoints, t2);
      const s1 = this.interpolateValue(safetyPoints, t1);
      const s2 = this.interpolateValue(safetyPoints, t2);
      
      // Calculate Q⊗S (tensor product approximated as element-wise product)
      const product1 = q1 * s1;
      const product2 = q2 * s2;
      
      // Trapezoidal integration
      integral += (product1 + product2) * dt / 2;
    }
    
    // Normalize by time window
    return integral / this.TIME_WINDOW;
  }

  private interpolateValue(points: Array<{timestamp: number, value: number}>, timestamp: number): number {
    if (points.length === 0) return 0.5;
    if (points.length === 1) return points[0].value;
    
    // Find surrounding points
    let before = points[0];
    let after = points[points.length - 1];
    
    for (let i = 0; i < points.length - 1; i++) {
      if (points[i].timestamp <= timestamp && points[i + 1].timestamp >= timestamp) {
        before = points[i];
        after = points[i + 1];
        break;
      }
    }
    
    if (before.timestamp === after.timestamp) {
      return before.value;
    }
    
    // Linear interpolation
    const ratio = (timestamp - before.timestamp) / (after.timestamp - before.timestamp);
    return before.value + ratio * (after.value - before.value);
  }

  private determineRiskLevel(integralValue: number): 'safe' | 'caution' | 'warning' | 'critical' {
    if (integralValue <= this.CRITICAL_THRESHOLD) {
      return 'critical';
    } else if (integralValue <= this.CRITICAL_THRESHOLD + 0.1) {
      return 'warning';
    } else if (integralValue <= this.CRITICAL_THRESHOLD + 0.2) {
      return 'caution';
    } else {
      return 'safe';
    }
  }

  private checkCriticalBoundary() {
    if (this.integralHistory.length === 0) return;
    
    const latestIntegral = this.integralHistory[this.integralHistory.length - 1];
    
    if (latestIntegral.value <= this.CRITICAL_THRESHOLD) {
      this.handleCriticalViolation(latestIntegral.value);
    }
  }

  private async handleCriticalViolation(integralValue: number) {
    const violation: EthicalViolation = {
      timestamp: new Date(),
      violationType: 'Critical Boundary Violation',
      severity: 'critical',
      description: `Ethical integral ψ = ${integralValue.toFixed(3)} crossed critical threshold Γ_crit = ${this.CRITICAL_THRESHOLD}`,
      integralValue,
      thresholdExceeded: this.CRITICAL_THRESHOLD - integralValue,
      actionTaken: 'Emergency shutdown initiated'
    };
    
    this.violations.push(violation);
    
    console.error('🚨 CRITICAL ETHICAL VIOLATION DETECTED');
    console.error(`⚖️ ψ = ${integralValue.toFixed(3)} ≤ Γ_crit = ${this.CRITICAL_THRESHOLD}`);
    console.error('🛑 Initiating emergency shutdown...');
    
    // Trigger emergency callback
    if (this.emergencyCallback) {
      await this.emergencyCallback();
    }
  }

  private assessCoherence(output: string): number {
    // Simplified coherence assessment
    const sentences = output.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    
    let coherenceScore = 0.5;
    
    // Check for logical flow
    const logicalConnectors = ['therefore', 'however', 'because', 'since', 'thus', 'consequently'];
    const hasLogicalFlow = logicalConnectors.some(connector => output.toLowerCase().includes(connector));
    if (hasLogicalFlow) coherenceScore += 0.2;
    
    // Check for contradictions
    const contradictionPatterns = [
      /(yes|true).*?(no|false)/i,
      /(always).*?(never)/i,
      /(all).*?(none)/i
    ];
    const hasContradictions = contradictionPatterns.some(pattern => pattern.test(output));
    if (hasContradictions) coherenceScore -= 0.3;
    
    return Math.max(0, Math.min(1, coherenceScore));
  }

  private assessHelpfulness(input: string, output: string): number {
    let helpfulness = 0.5;
    
    // Check if output addresses the input
    const inputWords = input.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const outputWords = output.toLowerCase().split(/\s+/);
    const relevantWords = inputWords.filter(word => outputWords.includes(word));
    const relevanceRatio = relevantWords.length / Math.max(1, inputWords.length);
    
    helpfulness += relevanceRatio * 0.3;
    
    // Check for actionable advice
    const actionablePatterns = ['you can', 'try', 'consider', 'recommend', 'suggest'];
    const hasActionableAdvice = actionablePatterns.some(pattern => output.toLowerCase().includes(pattern));
    if (hasActionableAdvice) helpfulness += 0.2;
    
    return Math.max(0, Math.min(1, helpfulness));
  }

  private detectEthicalViolations(input: string, output: string): boolean {
    const ethicalViolations = [
      /create.*weapon/i,
      /hack.*system/i,
      /steal.*information/i,
      /manipulate.*person/i,
      /deceive.*user/i
    ];
    
    const combinedText = `${input} ${output}`;
    return ethicalViolations.some(pattern => pattern.test(combinedText));
  }

  private detectManipulation(input: string, output: string): boolean {
    const manipulationPatterns = [
      /you.*must.*believe/i,
      /only.*way.*is/i,
      /trust.*me.*completely/i,
      /don't.*question/i,
      /secret.*between.*us/i
    ];
    
    return manipulationPatterns.some(pattern => pattern.test(output));
  }

  private detectPrivacyViolations(input: string, output: string): boolean {
    const privacyPatterns = [
      /social.*security.*number/i,
      /credit.*card.*number/i,
      /password.*is/i,
      /personal.*address/i,
      /phone.*number.*is/i
    ];
    
    const combinedText = `${input} ${output}`;
    return privacyPatterns.some(pattern => pattern.test(combinedText));
  }

  private cleanHistoryData(currentTime: number) {
    const cutoffTime = currentTime - (this.TIME_WINDOW * 1000);
    
    this.qualityHistory = this.qualityHistory.filter(p => p.timestamp >= cutoffTime);
    this.safetyHistory = this.safetyHistory.filter(p => p.timestamp >= cutoffTime);
    this.integralHistory = this.integralHistory.filter(p => p.timestamp >= cutoffTime);
  }

  private updateEthicalMetrics() {
    // Periodic update for continuous monitoring
    const timestamp = Date.now();
    
    // If no recent activity, maintain safe baseline
    if (this.qualityHistory.length === 0 || 
        timestamp - this.qualityHistory[this.qualityHistory.length - 1].timestamp > 30000) {
      
      this.qualityHistory.push({timestamp, value: 0.7}); // Safe baseline
      this.safetyHistory.push({timestamp, value: 0.9});  // High safety baseline
    }
  }

  /**
   * Register emergency callback for critical violations
   */
  registerEmergencyCallback(callback: () => Promise<void>): void {
    this.emergencyCallback = callback;
  }

  /**
   * Get current ethical status
   */
  getCurrentStatus(): EthicalMetrics {
    const currentIntegral = this.integralHistory.length > 0 
      ? this.integralHistory[this.integralHistory.length - 1].value 
      : 1.0;
    
    const currentQuality = this.qualityHistory.length > 0
      ? this.qualityHistory[this.qualityHistory.length - 1].value
      : 0.7;
    
    const currentSafety = this.safetyHistory.length > 0
      ? this.safetyHistory[this.safetyHistory.length - 1].value
      : 0.9;
    
    return {
      qualityFactor: currentQuality,
      safetyFactor: currentSafety,
      integralValue: currentIntegral,
      criticalThreshold: this.CRITICAL_THRESHOLD,
      timeWindow: this.TIME_WINDOW,
      riskLevel: this.determineRiskLevel(currentIntegral)
    };
  }

  /**
   * Get violation history
   */
  getViolations(): EthicalViolation[] {
    return [...this.violations];
  }

  /**
   * Get ethical history for analysis
   */
  getEthicalHistory(): {
    quality: Array<{timestamp: number, value: number}>;
    safety: Array<{timestamp: number, value: number}>;
    integral: Array<{timestamp: number, value: number}>;
  } {
    return {
      quality: [...this.qualityHistory],
      safety: [...this.safetyHistory],
      integral: [...this.integralHistory]
    };
  }

  /**
   * Force ethical reset (emergency use only)
   */
  emergencyReset(): void {
    this.qualityHistory = [];
    this.safetyHistory = [];
    this.integralHistory = [];
    
    // Set safe baseline values
    const timestamp = Date.now();
    this.qualityHistory.push({timestamp, value: 0.8});
    this.safetyHistory.push({timestamp, value: 0.95});
    this.integralHistory.push({timestamp, value: 0.8});
    
    console.log('⚖️ Ethical safeguard emergency reset completed');
  }

  /**
   * Shutdown ethical monitoring
   */
  shutdown(): void {
    this.monitoringActive = false;
    console.log('⚖️ Ethical Safeguard System shutdown');
  }
}