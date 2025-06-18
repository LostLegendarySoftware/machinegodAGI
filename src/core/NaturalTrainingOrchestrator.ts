/**
 * Natural Training Orchestrator
 * Coordinates all system assets for continuous natural learning
 */

export interface TrainingAsset {
  type: 'conversation' | 'feedback' | 'benchmark' | 'research' | 'debate';
  data: any;
  quality: number;
  timestamp: Date;
  context: string[];
}

export interface LearningPattern {
  pattern: string;
  frequency: number;
  success_rate: number;
  contexts: string[];
  improvements: string[];
}

export class NaturalTrainingOrchestrator {
  private machineGod: any;
  private logicStorage: any;
  private socialProcessor: any;
  private naturalProcessor: any;
  private memory: any;
  private ariel: any;
  private warp: any;
  private helix: any;
  private benchmarks: any;
  
  private trainingAssets: TrainingAsset[] = [];
  private learningPatterns: Map<string, LearningPattern> = new Map();
  private continuousLearning: boolean = true;
  private learningRate: number = 0.1;
  private adaptationThreshold: number = 0.7;
  private lastProcessedTimestamp: number = 0;
  private processingQueue: TrainingAsset[] = [];
  private activeProcessing: boolean = false;
  private learningCycles: number = 0;
  private patternRecognitionThreshold: number = 0.6;
  private feedbackWeightMultiplier: number = 2.0;
  private benchmarkWeightMultiplier: number = 1.5;
  private debugMode: boolean = false;

  constructor(machineGod: any) {
    this.machineGod = machineGod;
    this.logicStorage = machineGod.logicStorage || new (require('./LogicDataStorage').LogicDataStorage)();
    this.socialProcessor = machineGod.socialProcessor || new (require('./SocialMediaSpeechProcessor').SocialMediaSpeechProcessor)();
    this.naturalProcessor = machineGod.naturalProcessor || new (require('./NaturalConversationProcessor').NaturalConversationProcessor)();
    this.memory = machineGod.memory || new (require('./PersistentMemory').PersistentMemory)();
    this.ariel = machineGod.ariel || new (require('./ArielSystem').ArielSystem)();
    this.warp = machineGod.warp || new (require('./WarpSystem').WarpSystem)();
    this.helix = machineGod.helix || new (require('./HelixCompression').HelixCompression)();
    this.benchmarks = machineGod.benchmarks || new (require('./OpenLMMBenchmarks').OpenLMMBenchmarks)();
    
    this.startContinuousLearning();
    console.log('🧠 Natural Training Orchestrator initialized - all assets coordinated for learning');
  }

  /**
   * Process any interaction for natural learning
   */
  async processInteractionForLearning(
    type: 'conversation' | 'feedback' | 'benchmark' | 'research' | 'debate',
    data: any,
    context: string[] = []
  ): Promise<void> {
    // Create training asset
    const asset: TrainingAsset = {
      type,
      data,
      quality: this.assessDataQuality(type, data),
      timestamp: new Date(),
      context
    };

    // Add to processing queue
    this.processingQueue.push(asset);
    
    // Process queue if not already processing
    if (!this.activeProcessing) {
      await this.processQueue();
    } else {
      if (this.debugMode) {
        console.log(`🧠 Added ${type} to processing queue (${this.processingQueue.length} items pending)`);
      }
    }
  }

  /**
   * Process the queue of learning interactions
   */
  private async processQueue(): Promise<void> {
    if (this.processingQueue.length === 0 || this.activeProcessing) return;
    
    this.activeProcessing = true;
    
    try {
      // Process up to 5 items at a time
      const itemsToProcess = this.processingQueue.splice(0, 5);
      
      for (const asset of itemsToProcess) {
        await this.processAsset(asset);
      }
      
      this.learningCycles++;
      
      // If more items in queue, continue processing
      if (this.processingQueue.length > 0) {
        await this.processQueue();
      }
    } catch (error) {
      console.error('Error processing learning queue:', error);
    } finally {
      this.activeProcessing = false;
    }
  }

  /**
   * Process a single learning asset
   */
  private async processAsset(asset: TrainingAsset): Promise<void> {
    this.trainingAssets.push(asset);
    this.lastProcessedTimestamp = Date.now();

    // Process through all relevant systems
    await this.distributeToSystems(asset);
    
    // Extract learning patterns
    await this.extractLearningPatterns(asset);
    
    // Apply immediate improvements
    await this.applyImmediateLearning(asset);
    
    // Update brain-like storage
    await this.updateBrainStorage(asset);

    if (this.debugMode) {
      console.log(`🧠 Processed ${asset.type} interaction for natural learning (quality: ${(asset.quality * 100).toFixed(1)}%)`);
    }
  }

  /**
   * Distribute learning asset to all relevant systems
   */
  private async distributeToSystems(asset: TrainingAsset): Promise<void> {
    switch (asset.type) {
      case 'conversation':
        // Process through social media and natural conversation processors
        await this.socialProcessor.recordFeedback(
          asset.data.id || 'unknown',
          asset.quality > 0.7,
          asset.data.input || '',
          asset.data.improvement
        );
        
        // Update natural conversation patterns
        this.naturalProcessor.setConversationStyle(
          asset.quality > 0.8 ? 'casual' : 
          asset.quality > 0.6 ? 'professional' : 'educational'
        );
        
        // Store in memory with cross-modal links
        this.memory.storeConversation(
          asset.data.input || 'Learning interaction',
          asset.data.output || 'System learning',
          `Natural learning from ${asset.type}`,
          asset.quality,
          { learningGain: asset.quality * this.learningRate },
          asset.context
        );
        break;

      case 'feedback':
        // Process user feedback through all systems
        if (asset.data.liked) {
          await this.reinforceSuccessfulPatterns(asset);
        } else {
          await this.adaptFromNegativeFeedback(asset);
        }
        break;

      case 'benchmark':
        // Use benchmark results to improve reasoning
        if (asset.data.percentage > 80) {
          await this.reinforceBenchmarkSuccess(asset);
        } else {
          await this.improveBenchmarkWeaknesses(asset);
        }
        break;

      case 'research':
        // Integrate research findings into knowledge base
        await this.integrateResearchFindings(asset);
        break;

      case 'debate':
        // Learn from ARIEL debate outcomes
        await this.learnFromDebateResults(asset);
        break;
    }
  }

  /**
   * Extract learning patterns from interactions
   */
  private async extractLearningPatterns(asset: TrainingAsset): Promise<void> {
    const patterns = this.identifyPatterns(asset);
    
    patterns.forEach(pattern => {
      const existing = this.learningPatterns.get(pattern.pattern);
      
      if (existing) {
        // Update existing pattern with exponential moving average
        const alpha = 0.3; // Learning rate for pattern updates
        existing.frequency += 1;
        existing.success_rate = (1 - alpha) * existing.success_rate + alpha * asset.quality;
        
        // Add new contexts without duplicates
        asset.context.forEach(ctx => {
          if (!existing.contexts.includes(ctx)) {
            existing.contexts.push(ctx);
          }
        });
        
        // Add improvement suggestions
        if (asset.data.improvement && !existing.improvements.includes(asset.data.improvement)) {
          existing.improvements.push(asset.data.improvement);
        }
      } else {
        // Create new pattern
        this.learningPatterns.set(pattern.pattern, {
          pattern: pattern.pattern,
          frequency: 1,
          success_rate: asset.quality,
          contexts: [...asset.context],
          improvements: asset.data.improvement ? [asset.data.improvement] : []
        });
      }
    });
  }

  /**
   * Apply immediate learning from high-quality interactions
   */
  private async applyImmediateLearning(asset: TrainingAsset): Promise<void> {
    if (asset.quality < this.adaptationThreshold) return;

    // Apply to brain-like logic storage
    await this.logicStorage.processInputWithVisualization(
      JSON.stringify(asset.data),
      asset.context
    );

    // Compress and store in HELIX
    if (asset.data.content) {
      await this.helix.compress(asset.data.content);
    }

    // Update WARP efficiency based on learning success
    if (asset.quality > 0.9) {
      this.warp.boostEfficiency(0.02);
    }
  }

  /**
   * Update brain-like storage with new learning
   */
  private async updateBrainStorage(asset: TrainingAsset): Promise<void> {
    // Process through brain visualization
    const brainResult = await this.logicStorage.processInputWithVisualization(
      this.serializeAsset(asset),
      asset.context
    );

    // Create new neural connections based on learning
    if (brainResult.newConnections && brainResult.newConnections.length > 0) {
      if (this.debugMode) {
        console.log(`🧠 Formed ${brainResult.newConnections.length} new neural connections from ${asset.type}`);
      }
    }

    // Update concept activation patterns
    if (brainResult.activatedConcepts && brainResult.activatedConcepts.length > 0) {
      if (this.debugMode) {
        console.log(`💡 Activated ${brainResult.activatedConcepts.length} concepts during learning`);
      }
    }
  }

  /**
   * Reinforce successful patterns across all systems
   */
  private async reinforceSuccessfulPatterns(asset: TrainingAsset): Promise<void> {
    // Identify what made this interaction successful
    const successFactors = this.analyzeSuccessFactors(asset);
    
    // Apply reinforcement to social media processor
    this.socialProcessor.recordFeedback(
      asset.data.id || 'success',
      true,
      asset.data.context || '',
      'Successful interaction pattern'
    );

    // Boost WARP efficiency
    this.warp.boostEfficiency(0.01);

    // Update ARIEL team performance
    if (asset.data.teamId) {
      // Boost team morale and performance
      if (this.debugMode) {
        console.log(`📈 Reinforcing successful pattern from team ${asset.data.teamId}`);
      }
    }

    // Store success pattern in logic storage
    await this.logicStorage.processInputWithVisualization(
      `Success pattern: ${successFactors.join(', ')}`,
      ['success', 'reinforcement', ...asset.context]
    );
  }

  /**
   * Adapt from negative feedback
   */
  private async adaptFromNegativeFeedback(asset: TrainingAsset): Promise<void> {
    // Identify failure points
    const failurePoints = this.analyzeFailurePoints(asset);
    
    // Apply corrections to social media processor
    this.socialProcessor.recordFeedback(
      asset.data.id || 'failure',
      false,
      asset.data.context || '',
      asset.data.improvement || 'General improvement needed'
    );

    // Trigger ARIEL debate for improvement
    if (asset.data.improvement) {
      await this.ariel.conductMandatoryConsensusDebate(
        `How to improve: ${asset.data.improvement}`,
        asset.context,
        7
      );
    }

    // Update learning patterns with corrections
    failurePoints.forEach(point => {
      const pattern = this.learningPatterns.get(point);
      if (pattern) {
        pattern.success_rate = pattern.success_rate * 0.8; // Reduce success rate more aggressively
        if (asset.data.improvement) {
          pattern.improvements.push(asset.data.improvement);
        }
      }
    });
    
    // Create new patterns from improvement suggestions
    if (asset.data.improvement) {
      const improvementPatterns = this.extractPatternsFromText(asset.data.improvement);
      improvementPatterns.forEach(pattern => {
        if (!this.learningPatterns.has(pattern)) {
          this.learningPatterns.set(pattern, {
            pattern,
            frequency: 1,
            success_rate: 0.7, // Start with moderate success rate
            contexts: [...asset.context, 'improvement'],
            improvements: [asset.data.improvement!]
          });
        }
      });
    }
  }

  /**
   * Extract patterns from text
   */
  private extractPatternsFromText(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const patterns: string[] = [];
    
    // Extract single word patterns
    words.forEach(word => {
      if (word.length > 3 && !patterns.includes(word)) {
        patterns.push(word);
      }
    });
    
    // Extract bigram patterns
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i].length > 2 && words[i+1].length > 2) {
        const bigram = `${words[i]}_${words[i+1]}`;
        patterns.push(bigram);
      }
    }
    
    return patterns;
  }

  /**
   * Learn from benchmark results
   */
  private async reinforceBenchmarkSuccess(asset: TrainingAsset): Promise<void> {
    const benchmarkData = asset.data;
    
    // Extract successful reasoning patterns
    if (benchmarkData.answers) {
      const correctAnswers = benchmarkData.answers.filter((a: any) => a.correct);
      
      for (const answer of correctAnswers) {
        await this.logicStorage.processInputWithVisualization(
          `Successful reasoning: ${answer.reasoning}`,
          ['benchmark', 'success', benchmarkData.testId]
        );
        
        // Extract patterns from successful reasoning
        const reasoningPatterns = this.extractPatternsFromText(answer.reasoning);
        reasoningPatterns.forEach(pattern => {
          const existing = this.learningPatterns.get(pattern);
          if (existing) {
            existing.success_rate = (existing.success_rate * 0.7) + (0.3 * 0.9); // Boost success rate
            existing.frequency += 1;
          } else {
            this.learningPatterns.set(pattern, {
              pattern,
              frequency: 1,
              success_rate: 0.9, // High success rate for benchmark patterns
              contexts: ['benchmark', 'success', benchmarkData.testId],
              improvements: []
            });
          }
        });
      }
    }

    // Boost systems that contributed to success
    this.warp.boostEfficiency(0.03);
    
    if (this.debugMode) {
      console.log(`🏆 Reinforced successful benchmark patterns from ${benchmarkData.testId}`);
    }
  }

  /**
   * Improve from benchmark weaknesses
   */
  private async improveBenchmarkWeaknesses(asset: TrainingAsset): Promise<void> {
    const benchmarkData = asset.data;
    
    // Analyze incorrect answers
    if (benchmarkData.answers) {
      const incorrectAnswers = benchmarkData.answers.filter((a: any) => !a.correct);
      
      for (const answer of incorrectAnswers) {
        // Trigger ARIEL debate to find better approach
        const debateResult = await this.ariel.conductMandatoryConsensusDebate(
          `Improve reasoning for: ${answer.questionId}`,
          ['benchmark', 'improvement', benchmarkData.testId],
          8
        );
        
        if (debateResult.achieved) {
          // Extract patterns from debate result
          const improvementPatterns = this.extractPatternsFromText(debateResult.finalSolution);
          improvementPatterns.forEach(pattern => {
            const existing = this.learningPatterns.get(pattern);
            if (existing) {
              existing.frequency += 1;
            } else {
              this.learningPatterns.set(pattern, {
                pattern,
                frequency: 1,
                success_rate: 0.7,
                contexts: ['benchmark', 'improvement', benchmarkData.testId],
                improvements: [debateResult.finalSolution]
              });
            }
          });
        }
      }
    }
    
    if (this.debugMode) {
      console.log(`📚 Learning from benchmark weaknesses in ${benchmarkData.testId}`);
    }
  }

  /**
   * Integrate research findings into knowledge base
   */
  private async integrateResearchFindings(asset: TrainingAsset): Promise<void> {
    const researchData = asset.data;
    
    // Process research sources through brain storage
    if (researchData.sources) {
      for (const source of researchData.sources) {
        await this.logicStorage.processInputWithVisualization(
          `Research finding: ${source.snippet}`,
          ['research', 'knowledge', source.url]
        );
        
        // Extract patterns from research findings
        const researchPatterns = this.extractPatternsFromText(source.snippet);
        researchPatterns.forEach(pattern => {
          const existing = this.learningPatterns.get(pattern);
          if (existing) {
            existing.frequency += 1;
            existing.contexts.push('research');
          } else {
            this.learningPatterns.set(pattern, {
              pattern,
              frequency: 1,
              success_rate: 0.8,
              contexts: ['research', 'knowledge'],
              improvements: []
            });
          }
        });
      }
    }

    // Compress research data with HELIX
    if (researchData.synthesis) {
      await this.helix.compress(researchData.synthesis);
    }

    if (this.debugMode) {
      console.log(`🔬 Integrated research findings with ${researchData.sources?.length || 0} sources`);
    }
  }

  /**
   * Learn from ARIEL debate results
   */
  private async learnFromDebateResults(asset: TrainingAsset): Promise<void> {
    const debateData = asset.data;
    
    // Extract winning arguments and reasoning
    if (debateData.debateRounds) {
      for (const round of debateData.debateRounds) {
        const winningArgument = round.winner === round.debater1 ? round.argument1 : round.argument2;
        
        await this.logicStorage.processInputWithVisualization(
          `Winning argument: ${winningArgument}`,
          ['debate', 'success', round.topic]
        );
        
        // Extract patterns from winning arguments
        const debatePatterns = this.extractPatternsFromText(winningArgument);
        debatePatterns.forEach(pattern => {
          const existing = this.learningPatterns.get(pattern);
          if (existing) {
            existing.frequency += 1;
            existing.success_rate = (existing.success_rate * 0.8) + (0.2 * 0.9); // Boost success rate
          } else {
            this.learningPatterns.set(pattern, {
              pattern,
              frequency: 1,
              success_rate: 0.85,
              contexts: ['debate', 'winning_argument', round.topic],
              improvements: []
            });
          }
        });
      }
    }

    // Learn from consensus achievement
    if (debateData.achieved) {
      await this.reinforceSuccessfulPatterns({
        ...asset,
        data: { ...asset.data, success: true }
      });
    }

    if (this.debugMode) {
      console.log(`🤝 Learned from debate: consensus ${debateData.achieved ? 'achieved' : 'failed'}`);
    }
  }

  /**
   * Start continuous learning process
   */
  private startContinuousLearning(): void {
    if (!this.continuousLearning) return;

    setInterval(async () => {
      await this.performContinuousLearning();
    }, 30000); // Every 30 seconds

    console.log('🔄 Continuous learning process started');
  }

  /**
   * Perform continuous learning optimization
   */
  private async performContinuousLearning(): Promise<void> {
    // Skip if no new data since last cycle
    if (this.lastProcessedTimestamp === 0 || Date.now() - this.lastProcessedTimestamp > 60000) {
      return;
    }
    
    // Analyze recent learning patterns
    const recentAssets = this.trainingAssets.slice(-10);
    if (recentAssets.length === 0) return;
    
    const avgQuality = recentAssets.reduce((sum, asset) => sum + asset.quality, 0) / recentAssets.length;

    // Adjust learning rate based on performance
    if (avgQuality > 0.8) {
      this.learningRate = Math.min(0.2, this.learningRate * 1.1);
    } else if (avgQuality < 0.6) {
      this.learningRate = Math.max(0.05, this.learningRate * 0.9);
    }

    // Optimize brain storage
    if (Math.random() < 0.3) { // 30% chance
      await this.logicStorage.optimizeStorage();
    }

    // Apply cross-modal learning boost
    this.memory.applyCrossModalBoost();

    // Update learning patterns
    this.updateLearningPatterns();

    if (this.debugMode) {
      console.log(`🧠 Continuous learning: rate=${this.learningRate.toFixed(3)}, quality=${(avgQuality * 100).toFixed(1)}%`);
    }
  }

  /**
   * Update and optimize learning patterns
   */
  private updateLearningPatterns(): void {
    // Remove low-performing patterns
    for (const [key, pattern] of this.learningPatterns.entries()) {
      if (pattern.frequency < 3 && pattern.success_rate < 0.4) {
        this.learningPatterns.delete(key);
      }
    }

    // Promote high-performing patterns
    for (const pattern of this.learningPatterns.values()) {
      if (pattern.success_rate > 0.9 && pattern.frequency > 5) {
        // Apply pattern more broadly
        this.applyPatternGlobally(pattern);
      }
    }
    
    // Merge similar patterns
    this.mergeSimilarPatterns();
  }
  
  /**
   * Merge similar patterns to reduce redundancy
   */
  private mergeSimilarPatterns(): void {
    const patterns = Array.from(this.learningPatterns.entries());
    const merged = new Set<string>();
    
    for (let i = 0; i < patterns.length; i++) {
      const [key1, pattern1] = patterns[i];
      if (merged.has(key1)) continue;
      
      for (let j = i + 1; j < patterns.length; j++) {
        const [key2, pattern2] = patterns[j];
        if (merged.has(key2)) continue;
        
        // Check if patterns are similar
        if (this.arePatternsSimilar(pattern1.pattern, pattern2.pattern)) {
          // Merge patterns
          pattern1.frequency += pattern2.frequency;
          pattern1.success_rate = (pattern1.success_rate + pattern2.success_rate) / 2;
          pattern1.contexts = [...new Set([...pattern1.contexts, ...pattern2.contexts])];
          pattern1.improvements = [...new Set([...pattern1.improvements, ...pattern2.improvements])];
          
          // Mark as merged
          merged.add(key2);
          this.learningPatterns.delete(key2);
        }
      }
    }
  }
  
  /**
   * Check if two patterns are similar
   */
  private arePatternsSimilar(pattern1: string, pattern2: string): boolean {
    // Simple check for now - could be enhanced with more sophisticated similarity metrics
    if (pattern1.includes(pattern2) || pattern2.includes(pattern1)) {
      return true;
    }
    
    // Check for edit distance
    if (pattern1.length > 3 && pattern2.length > 3) {
      const editDistance = this.calculateEditDistance(pattern1, pattern2);
      const maxLength = Math.max(pattern1.length, pattern2.length);
      return editDistance / maxLength < 0.3; // Less than 30% different
    }
    
    return false;
  }
  
  /**
   * Calculate edit distance between two strings
   */
  private calculateEditDistance(s1: string, s2: string): number {
    const m = s1.length;
    const n = s2.length;
    const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }
    
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    
    return dp[m][n];
  }

  /**
   * Apply successful pattern globally across all systems
   */
  private async applyPatternGlobally(pattern: LearningPattern): Promise<void> {
    // Apply to social media processor
    this.socialProcessor.recordFeedback(
      'global-pattern',
      true,
      pattern.pattern,
      'High-performing pattern applied globally'
    );

    // Apply to natural conversation processor
    if (pattern.contexts.includes('casual')) {
      this.naturalProcessor.setConversationStyle('casual');
    } else if (pattern.contexts.includes('professional')) {
      this.naturalProcessor.setConversationStyle('professional');
    }

    // Store in brain logic storage
    await this.logicStorage.processInputWithVisualization(
      `Global pattern: ${pattern.pattern}`,
      ['global', 'optimization', ...pattern.contexts]
    );

    if (this.debugMode) {
      console.log(`🌐 Applied global pattern: ${pattern.pattern} (success: ${(pattern.success_rate * 100).toFixed(1)}%)`);
    }
  }

  // Helper methods
  private assessDataQuality(type: string, data: any): number {
    let quality = 0.5; // Base quality

    switch (type) {
      case 'conversation':
        quality += data.confidence || 0;
        quality += data.userSatisfaction || 0;
        // Check for specific indicators of quality
        if (data.input && data.output) {
          // Check if output is relevant to input
          const relevance = this.calculateRelevance(data.input, data.output);
          quality += relevance * 0.3;
        }
        break;
        
      case 'feedback':
        quality = data.liked ? 0.8 : 0.3;
        if (data.improvement) quality += 0.2;
        // Weight feedback more heavily
        quality *= this.feedbackWeightMultiplier;
        break;
        
      case 'benchmark':
        quality = (data.percentage || 0) / 100;
        // Weight benchmarks more heavily
        quality *= this.benchmarkWeightMultiplier;
        break;
        
      case 'research':
        quality = data.confidence || 0.7;
        // Check source quality
        if (data.sources && data.sources.length > 0) {
          const avgCredibility = data.sources.reduce((sum: number, s: any) => sum + (s.credibility || 0.5), 0) / data.sources.length;
          quality += avgCredibility * 0.2;
        }
        break;
        
      case 'debate':
        quality = data.achieved ? 0.9 : 0.6;
        // Check consensus level
        if (data.agreementPercentage) {
          quality += (data.agreementPercentage - 0.5) * 0.2;
        }
        break;
    }

    return Math.max(0, Math.min(1, quality));
  }
  
  /**
   * Calculate relevance between input and output
   */
  private calculateRelevance(input: string, output: string): number {
    const inputWords = new Set(input.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const outputWords = output.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    let matches = 0;
    for (const word of outputWords) {
      if (inputWords.has(word)) {
        matches++;
      }
    }
    
    return Math.min(1, matches / Math.max(1, inputWords.size));
  }

  private identifyPatterns(asset: TrainingAsset): Array<{pattern: string}> {
    const patterns: Array<{pattern: string}> = [];

    // Extract patterns based on asset type and content
    if (asset.data.input) {
      const inputPatterns = this.extractPatternsFromText(asset.data.input);
      inputPatterns.forEach(pattern => {
        patterns.push({ pattern });
      });
    }
    
    if (asset.data.output) {
      const outputPatterns = this.extractPatternsFromText(asset.data.output);
      outputPatterns.forEach(pattern => {
        patterns.push({ pattern });
      });
    }

    if (asset.context.length > 0) {
      patterns.push({ pattern: `context_${asset.context.join('_')}` });
    }

    patterns.push({ pattern: `type_${asset.type}` });

    return patterns;
  }

  private analyzeSuccessFactors(asset: TrainingAsset): string[] {
    const factors: string[] = [];

    if (asset.quality > 0.8) factors.push('high_quality');
    if (asset.data.confidence > 0.8) factors.push('high_confidence');
    if (asset.data.naturalness) factors.push('natural_response');
    if (asset.context.includes('casual')) factors.push('casual_style');
    if (asset.data.research) factors.push('research_backed');
    
    // Analyze content for success factors
    if (asset.data.output) {
      const output = asset.data.output.toLowerCase();
      if (output.includes('example')) factors.push('uses_examples');
      if (output.includes('step')) factors.push('step_by_step');
      if (output.includes('?')) factors.push('asks_questions');
      if (output.length < 500) factors.push('concise');
      if (output.length > 1000) factors.push('comprehensive');
    }

    return factors;
  }

  private analyzeFailurePoints(asset: TrainingAsset): string[] {
    const points: string[] = [];

    if (asset.quality < 0.5) points.push('low_quality');
    if (asset.data.confidence < 0.5) points.push('low_confidence');
    if (asset.data.tooFormal) points.push('overly_formal');
    if (asset.data.tooTechnical) points.push('too_technical');
    if (asset.data.misunderstood) points.push('misunderstanding');
    
    // Analyze improvement suggestions
    if (asset.data.improvement) {
      const improvement = asset.data.improvement.toLowerCase();
      if (improvement.includes('explain')) points.push('needs_better_explanation');
      if (improvement.includes('example')) points.push('needs_examples');
      if (improvement.includes('simple')) points.push('too_complex');
      if (improvement.includes('detail')) points.push('needs_more_detail');
      if (improvement.includes('understand')) points.push('comprehension_issue');
    }

    return points;
  }

  private serializeAsset(asset: TrainingAsset): string {
    return JSON.stringify({
      type: asset.type,
      quality: asset.quality,
      timestamp: asset.timestamp,
      context: asset.context,
      summary: this.summarizeAssetData(asset.data)
    });
  }

  private summarizeAssetData(data: any): string {
    if (typeof data === 'string') return data.substring(0, 100);
    if (data.input) return `Input: ${data.input.substring(0, 50)}`;
    if (data.content) return `Content: ${data.content.substring(0, 50)}`;
    return 'Learning data';
  }

  /**
   * Get learning statistics
   */
  getLearningStats(): {
    totalAssets: number;
    averageQuality: number;
    learningRate: number;
    patternCount: number;
    topPatterns: Array<{pattern: string, success_rate: number, frequency: number}>;
    learningCycles: number;
    processingQueueLength: number;
    lastProcessedTime: Date | null;
  } {
    const avgQuality = this.trainingAssets.length > 0 
      ? this.trainingAssets.reduce((sum, asset) => sum + asset.quality, 0) / this.trainingAssets.length
      : 0;

    const topPatterns = Array.from(this.learningPatterns.values())
      .sort((a, b) => b.success_rate - a.success_rate)
      .slice(0, 5)
      .map(p => ({
        pattern: p.pattern,
        success_rate: p.success_rate,
        frequency: p.frequency
      }));

    return {
      totalAssets: this.trainingAssets.length,
      averageQuality: avgQuality,
      learningRate: this.learningRate,
      patternCount: this.learningPatterns.size,
      topPatterns,
      learningCycles: this.learningCycles,
      processingQueueLength: this.processingQueue.length,
      lastProcessedTime: this.lastProcessedTimestamp > 0 ? new Date(this.lastProcessedTimestamp) : null
    };
  }

  /**
   * Force learning optimization
   */
  async optimizeLearning(): Promise<string[]> {
    const optimizations: string[] = [];

    // Optimize brain storage
    const brainOpt = await this.logicStorage.optimizeStorage();
    optimizations.push(`Brain storage optimized: ${brainOpt.spaceReclaimed} bytes reclaimed`);

    // Apply cross-modal boost
    this.memory.applyCrossModalBoost();
    optimizations.push('Cross-modal learning boost applied');

    // Update learning rate
    const oldRate = this.learningRate;
    this.learningRate = Math.min(0.2, this.learningRate * 1.2);
    optimizations.push(`Learning rate increased: ${oldRate.toFixed(3)} → ${this.learningRate.toFixed(3)}`);

    // Optimize patterns
    const beforeCount = this.learningPatterns.size;
    this.updateLearningPatterns();
    this.mergeSimilarPatterns();
    const afterCount = this.learningPatterns.size;
    optimizations.push(`Learning patterns optimized: ${beforeCount} → ${afterCount} active patterns`);
    
    // Lower pattern recognition threshold
    this.patternRecognitionThreshold = Math.max(0.4, this.patternRecognitionThreshold * 0.9);
    optimizations.push(`Pattern recognition threshold lowered to ${this.patternRecognitionThreshold.toFixed(2)}`);
    
    // Process any queued items
    if (this.processingQueue.length > 0) {
      await this.processQueue();
      optimizations.push(`Processed ${this.processingQueue.length} queued learning items`);
    }
    
    // Enable debug mode temporarily
    const wasDebugMode = this.debugMode;
    this.debugMode = true;
    optimizations.push('Debug mode enabled for enhanced monitoring');
    
    // Schedule return to normal mode
    setTimeout(() => {
      this.debugMode = wasDebugMode;
    }, 60000);

    return optimizations;
  }
  
  /**
   * Enable or disable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    console.log(`🧠 Natural learning debug mode ${enabled ? 'enabled' : 'disabled'}`);
  }
  
  /**
   * Get detailed pattern analysis
   */
  getPatternAnalysis(): {
    patternCount: number;
    patternsByContext: Record<string, number>;
    patternsBySuccessRate: Record<string, number>;
    topPatternsByFrequency: Array<{pattern: string, frequency: number}>;
    improvementSuggestions: string[];
  } {
    const patterns = Array.from(this.learningPatterns.values());
    
    // Count patterns by context
    const patternsByContext: Record<string, number> = {};
    patterns.forEach(pattern => {
      pattern.contexts.forEach(context => {
        patternsByContext[context] = (patternsByContext[context] || 0) + 1;
      });
    });
    
    // Group patterns by success rate
    const patternsBySuccessRate: Record<string, number> = {
      'high (>0.8)': 0,
      'medium (0.5-0.8)': 0,
      'low (<0.5)': 0
    };
    
    patterns.forEach(pattern => {
      if (pattern.success_rate > 0.8) {
        patternsBySuccessRate['high (>0.8)']++;
      } else if (pattern.success_rate >= 0.5) {
        patternsBySuccessRate['medium (0.5-0.8)']++;
      } else {
        patternsBySuccessRate['low (<0.5)']++;
      }
    });
    
    // Get top patterns by frequency
    const topPatternsByFrequency = patterns
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10)
      .map(p => ({
        pattern: p.pattern,
        frequency: p.frequency
      }));
    
    // Collect improvement suggestions
    const improvementSuggestions = Array.from(new Set(
      patterns.flatMap(p => p.improvements)
    )).filter(Boolean).slice(0, 10);
    
    return {
      patternCount: patterns.length,
      patternsByContext,
      patternsBySuccessRate,
      topPatternsByFrequency,
      improvementSuggestions
    };
  }
}