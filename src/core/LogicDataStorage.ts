/**
 * Logic Data Storage System
 * Implements 6-tier x 256 unit storage for algorithms and diffusion model data
 */

export interface LogicDataTier {
  id: number;
  name: string;
  description: string;
  units: LogicDataUnit[];
  totalCapacity: number;
  usedCapacity: number;
  compressionRatio: number;
}

export interface LogicDataUnit {
  id: string;
  tier: number;
  unitIndex: number;
  algorithms: AlgorithmData[];
  patterns: PatternData[];
  nlpTokens: Map<string, number>;
  performance: number;
  lastUpdated: Date;
  compressionLevel: number;
  usedCapacity: number;
  maxCapacity: number;
}

export interface AlgorithmData {
  id: string;
  name: string;
  pattern: string;
  purpose: string;
  performance: number;
  generation: number;
  parentIds: string[];
  mutations: number;
  size: number;
  lastUsed: Date;
  usageCount: number;
  compressionRatio: number;
}

export interface PatternData {
  id: string;
  type: 'reasoning' | 'language' | 'slang' | 'common_sense' | 'domain_knowledge';
  pattern: string;
  examples: string[];
  frequency: number;
  lastUsed: Date;
  size: number;
}

export interface StorageStats {
  totalUnits: number;
  activeUnits: number;
  totalAlgorithms: number;
  totalPatterns: number;
  averagePerformance: number;
  topPerformingTier: number;
  compressionRatio: number;
  capacityUsed: number;
  capacityTotal: number;
}

export class LogicDataStorage {
  private tiers: LogicDataTier[] = [];
  private readonly TIER_COUNT = 6;
  private readonly UNITS_PER_TIER = 256;
  private readonly UNIT_CAPACITY = 1024 * 1024; // 1MB per unit
  private readonly TIER_PURPOSES = [
    'Common Sense & Meta-Logic',
    'Natural Language Processing',
    'Agentic Training',
    'Slang & Natural Speaking',
    'Image Generation & Spatial Analysis',
    'Video Generation & 3D Modeling'
  ];
  
  constructor() {
    this.initializeStorage();
    console.log('💾 Logic Data Storage initialized with 6 tiers × 256 units (1536 total)');
  }
  
  private initializeStorage() {
    // Create 6 tiers with 256 units each
    for (let tierId = 0; tierId < this.TIER_COUNT; tierId++) {
      const tier: LogicDataTier = {
        id: tierId,
        name: `Tier ${tierId + 1}`,
        description: this.TIER_PURPOSES[tierId],
        units: [],
        totalCapacity: this.UNITS_PER_TIER * this.UNIT_CAPACITY,
        usedCapacity: 0,
        compressionRatio: 1.0
      };
      
      // Create 256 units per tier
      for (let unitIndex = 0; unitIndex < this.UNITS_PER_TIER; unitIndex++) {
        const unit: LogicDataUnit = {
          id: `T${tierId}_U${unitIndex}`,
          tier: tierId,
          unitIndex,
          algorithms: [],
          patterns: [],
          nlpTokens: new Map(),
          performance: 0.3 + Math.random() * 0.2, // Start with baseline performance
          lastUpdated: new Date(),
          compressionLevel: 1.0,
          usedCapacity: 0,
          maxCapacity: this.UNIT_CAPACITY
        };
        
        // Initialize with basic algorithms and patterns based on tier
        this.seedInitialData(unit);
        
        tier.units.push(unit);
        tier.usedCapacity += unit.usedCapacity;
      }
      
      this.tiers.push(tier);
    }
  }
  
  /**
   * Seed initial data based on tier purpose
   */
  private seedInitialData(unit: LogicDataUnit) {
    const tierPurpose = this.TIER_PURPOSES[unit.tier];
    
    // Create initial algorithms based on tier purpose
    const algorithmCount = Math.floor(Math.random() * 3) + 2; // 2-4 initial algorithms
    for (let i = 0; i < algorithmCount; i++) {
      const algorithm = this.createInitialAlgorithm(unit.tier, unit.id, i);
      unit.algorithms.push(algorithm);
      unit.usedCapacity += algorithm.size;
    }
    
    // Create initial patterns based on tier purpose
    const patternCount = Math.floor(Math.random() * 5) + 3; // 3-7 initial patterns
    for (let i = 0; i < patternCount; i++) {
      const pattern = this.createInitialPattern(unit.tier, unit.id, i);
      unit.patterns.push(pattern);
      unit.usedCapacity += pattern.size;
    }
  }
  
  /**
   * Create initial algorithm based on tier
   */
  private createInitialAlgorithm(tier: number, unitId: string, index: number): AlgorithmData {
    // Different algorithm types based on tier
    const tierAlgorithms = [
      // Tier 0: Common Sense & Meta-Logic
      ['common-sense-reasoning', 'logical-inference', 'paradox-resolution', 'self-reference-detection'],
      // Tier 1: Natural Language Processing
      ['language-understanding', 'context-awareness', 'sentiment-analysis', 'entity-recognition'],
      // Tier 2: Agentic Training
      ['agent-coordination', 'debate-framework', 'consensus-building', 'task-allocation'],
      // Tier 3: Slang & Natural Speaking
      ['slang-detection', 'casual-speech', 'regional-dialect', 'conversational-flow'],
      // Tier 4: Image Generation & Spatial Analysis
      ['image-understanding', 'spatial-reasoning', 'visual-composition', 'color-theory'],
      // Tier 5: Video Generation & 3D Modeling
      ['motion-analysis', '3d-representation', 'temporal-consistency', 'physics-simulation']
    ];
    
    const algorithmTypes = tierAlgorithms[tier];
    const algorithmType = algorithmTypes[index % algorithmTypes.length];
    
    return {
      id: `${unitId}_ALG_${index}`,
      name: `${algorithmType}-v1`,
      pattern: `${algorithmType}-pattern-${Math.floor(Math.random() * 100)}`,
      purpose: `Handles ${algorithmType.replace(/-/g, ' ')} operations`,
      performance: 0.3 + Math.random() * 0.3,
      generation: 1,
      parentIds: [],
      mutations: 0,
      size: 10000 + Math.floor(Math.random() * 50000), // 10KB - 60KB
      lastUsed: new Date(),
      usageCount: 0,
      compressionRatio: 1.0
    };
  }
  
  /**
   * Create initial pattern based on tier
   */
  private createInitialPattern(tier: number, unitId: string, index: number): PatternData {
    // Different pattern types based on tier
    const patternTypes: ('reasoning' | 'language' | 'slang' | 'common_sense' | 'domain_knowledge')[] = [
      'common_sense', 'reasoning', 'reasoning', 'common_sense', 'domain_knowledge', // Tier 0
      'language', 'language', 'reasoning', 'domain_knowledge', 'common_sense',      // Tier 1
      'reasoning', 'language', 'domain_knowledge', 'common_sense', 'reasoning',     // Tier 2
      'slang', 'language', 'slang', 'language', 'common_sense',                     // Tier 3
      'domain_knowledge', 'reasoning', 'common_sense', 'language', 'reasoning',     // Tier 4
      'domain_knowledge', 'reasoning', 'language', 'common_sense', 'reasoning'      // Tier 5
    ];
    
    const patternType = patternTypes[tier * 5 + (index % 5)];
    
    return {
      id: `${unitId}_PAT_${index}`,
      type: patternType,
      pattern: `${patternType}-pattern-${Math.floor(Math.random() * 100)}`,
      examples: [
        `Example 1 for ${patternType} pattern`,
        `Example 2 for ${patternType} pattern`
      ],
      frequency: Math.random(),
      lastUsed: new Date(),
      size: 5000 + Math.floor(Math.random() * 15000) // 5KB - 20KB
    };
  }
  
  /**
   * Store algorithm in appropriate tier
   */
  storeAlgorithm(algorithm: Omit<AlgorithmData, 'id' | 'lastUsed' | 'usageCount'>, tierPreference?: number): string {
    // Determine best tier based on algorithm purpose if not specified
    const tier = tierPreference !== undefined ? 
      Math.min(this.TIER_COUNT - 1, Math.max(0, tierPreference)) : 
      this.determineBestTier(algorithm.purpose);
    
    // Find unit with most available space
    const tierUnits = this.tiers[tier].units;
    const sortedUnits = [...tierUnits].sort((a, b) => 
      (a.maxCapacity - a.usedCapacity) - (b.maxCapacity - b.usedCapacity)
    );
    
    const targetUnit = sortedUnits[0];
    
    // Check if there's enough space
    if (targetUnit.usedCapacity + algorithm.size > targetUnit.maxCapacity) {
      // Try to compress existing data
      this.compressUnit(targetUnit);
      
      // Check again after compression
      if (targetUnit.usedCapacity + algorithm.size > targetUnit.maxCapacity) {
        // Not enough space even after compression
        console.warn(`⚠️ Not enough space in tier ${tier} for algorithm. Trying to replace obsolete algorithm.`);
        
        // Try to replace an obsolete algorithm
        const replaced = this.replaceObsoleteAlgorithm(targetUnit, algorithm);
        if (!replaced) {
          throw new Error(`Not enough space in tier ${tier} for algorithm of size ${algorithm.size}`);
        }
      }
    }
    
    // Create full algorithm object
    const fullAlgorithm: AlgorithmData = {
      ...algorithm,
      id: `T${tier}_U${targetUnit.unitIndex}_ALG_${targetUnit.algorithms.length}`,
      lastUsed: new Date(),
      usageCount: 0
    };
    
    // Store algorithm
    targetUnit.algorithms.push(fullAlgorithm);
    targetUnit.usedCapacity += algorithm.size;
    targetUnit.lastUpdated = new Date();
    
    // Update tier capacity
    this.tiers[tier].usedCapacity += algorithm.size;
    
    console.log(`✅ Stored algorithm ${fullAlgorithm.id} in tier ${tier} (${this.TIER_PURPOSES[tier]})`);
    
    return fullAlgorithm.id;
  }
  
  /**
   * Store pattern in appropriate tier
   */
  storePattern(pattern: Omit<PatternData, 'id' | 'lastUsed'>, tierPreference?: number): string {
    // Determine best tier based on pattern type if not specified
    const tier = tierPreference !== undefined ? 
      Math.min(this.TIER_COUNT - 1, Math.max(0, tierPreference)) : 
      this.determineBestTierForPattern(pattern.type);
    
    // Find unit with most available space
    const tierUnits = this.tiers[tier].units;
    const sortedUnits = [...tierUnits].sort((a, b) => 
      (a.maxCapacity - a.usedCapacity) - (b.maxCapacity - b.usedCapacity)
    );
    
    const targetUnit = sortedUnits[0];
    
    // Check if there's enough space
    if (targetUnit.usedCapacity + pattern.size > targetUnit.maxCapacity) {
      // Try to compress existing data
      this.compressUnit(targetUnit);
      
      // Check again after compression
      if (targetUnit.usedCapacity + pattern.size > targetUnit.maxCapacity) {
        // Not enough space even after compression
        console.warn(`⚠️ Not enough space in tier ${tier} for pattern. Trying to replace obsolete pattern.`);
        
        // Try to replace an obsolete pattern
        const replaced = this.replaceObsoletePattern(targetUnit, pattern);
        if (!replaced) {
          throw new Error(`Not enough space in tier ${tier} for pattern of size ${pattern.size}`);
        }
      }
    }
    
    // Create full pattern object
    const fullPattern: PatternData = {
      ...pattern,
      id: `T${tier}_U${targetUnit.unitIndex}_PAT_${targetUnit.patterns.length}`,
      lastUsed: new Date()
    };
    
    // Store pattern
    targetUnit.patterns.push(fullPattern);
    targetUnit.usedCapacity += pattern.size;
    targetUnit.lastUpdated = new Date();
    
    // Update tier capacity
    this.tiers[tier].usedCapacity += pattern.size;
    
    console.log(`✅ Stored pattern ${fullPattern.id} in tier ${tier} (${this.TIER_PURPOSES[tier]})`);
    
    return fullPattern.id;
  }
  
  /**
   * Store NLP tokens in appropriate tier
   */
  storeNLPTokens(tokens: Map<string, number>, tierPreference?: number): void {
    // Default to Tier 1 (Natural Language Processing) if not specified
    const tier = tierPreference !== undefined ? 
      Math.min(this.TIER_COUNT - 1, Math.max(0, tierPreference)) : 
      1;
    
    // Calculate approximate size
    const tokenSize = Array.from(tokens.entries()).reduce((size, [token, count]) => {
      return size + token.length * 2 + 8; // Rough estimate: token length * 2 bytes + 8 bytes for count
    }, 0);
    
    // Distribute tokens across units
    const tierUnits = this.tiers[tier].units;
    
    // Group tokens into chunks
    const tokenEntries = Array.from(tokens.entries());
    const chunkSize = Math.ceil(tokenEntries.length / Math.min(10, tierUnits.length));
    const chunks = [];
    
    for (let i = 0; i < tokenEntries.length; i += chunkSize) {
      chunks.push(tokenEntries.slice(i, i + chunkSize));
    }
    
    // Store each chunk in a different unit
    chunks.forEach((chunk, index) => {
      const unitIndex = index % tierUnits.length;
      const unit = tierUnits[unitIndex];
      
      // Calculate chunk size
      const chunkTokenSize = chunk.reduce((size, [token, count]) => {
        return size + token.length * 2 + 8;
      }, 0);
      
      // Check if there's enough space
      if (unit.usedCapacity + chunkTokenSize > unit.maxCapacity) {
        // Try to compress
        this.compressUnit(unit);
        
        // If still not enough space, remove old tokens
        if (unit.usedCapacity + chunkTokenSize > unit.maxCapacity) {
          this.pruneOldTokens(unit, chunkTokenSize);
        }
      }
      
      // Store tokens
      chunk.forEach(([token, count]) => {
        const currentCount = unit.nlpTokens.get(token) || 0;
        unit.nlpTokens.set(token, currentCount + count);
      });
      
      // Update capacity
      unit.usedCapacity += chunkTokenSize;
      unit.lastUpdated = new Date();
      
      // Update tier capacity
      this.tiers[tier].usedCapacity += chunkTokenSize;
    });
    
    console.log(`✅ Stored ${tokens.size} NLP tokens across ${chunks.length} units in tier ${tier}`);
  }
  
  /**
   * Retrieve algorithm by ID
   */
  getAlgorithm(algorithmId: string): AlgorithmData | null {
    // Parse tier and unit from ID
    const idParts = algorithmId.split('_');
    if (idParts.length < 2) return null;
    
    const tierUnitParts = idParts[0].split('U');
    if (tierUnitParts.length < 2) return null;
    
    const tierStr = tierUnitParts[0].replace('T', '');
    const unitStr = tierUnitParts[1];
    
    const tier = parseInt(tierStr);
    const unitIndex = parseInt(unitStr);
    
    if (isNaN(tier) || isNaN(unitIndex) || 
        tier < 0 || tier >= this.TIER_COUNT || 
        unitIndex < 0 || unitIndex >= this.UNITS_PER_TIER) {
      return null;
    }
    
    // Find algorithm in unit
    const unit = this.tiers[tier].units[unitIndex];
    const algorithm = unit.algorithms.find(alg => alg.id === algorithmId);
    
    if (algorithm) {
      // Update usage statistics
      algorithm.lastUsed = new Date();
      algorithm.usageCount++;
      unit.lastUpdated = new Date();
      
      return algorithm;
    }
    
    return null;
  }
  
  /**
   * Retrieve pattern by ID
   */
  getPattern(patternId: string): PatternData | null {
    // Parse tier and unit from ID
    const idParts = patternId.split('_');
    if (idParts.length < 2) return null;
    
    const tierUnitParts = idParts[0].split('U');
    if (tierUnitParts.length < 2) return null;
    
    const tierStr = tierUnitParts[0].replace('T', '');
    const unitStr = tierUnitParts[1];
    
    const tier = parseInt(tierStr);
    const unitIndex = parseInt(unitStr);
    
    if (isNaN(tier) || isNaN(unitIndex) || 
        tier < 0 || tier >= this.TIER_COUNT || 
        unitIndex < 0 || unitIndex >= this.UNITS_PER_TIER) {
      return null;
    }
    
    // Find pattern in unit
    const unit = this.tiers[tier].units[unitIndex];
    const pattern = unit.patterns.find(pat => pat.id === patternId);
    
    if (pattern) {
      // Update usage statistics
      pattern.lastUsed = new Date();
      pattern.frequency += 0.01; // Slightly increase frequency with each use
      unit.lastUpdated = new Date();
      
      return pattern;
    }
    
    return null;
  }
  
  /**
   * Search for algorithms by purpose or pattern
   */
  searchAlgorithms(query: string): AlgorithmData[] {
    const results: AlgorithmData[] = [];
    
    this.tiers.forEach(tier => {
      tier.units.forEach(unit => {
        const matchingAlgorithms = unit.algorithms.filter(alg => 
          alg.purpose.toLowerCase().includes(query.toLowerCase()) ||
          alg.pattern.toLowerCase().includes(query.toLowerCase()) ||
          alg.name.toLowerCase().includes(query.toLowerCase())
        );
        
        results.push(...matchingAlgorithms);
      });
    });
    
    // Update usage statistics for found algorithms
    results.forEach(alg => {
      alg.lastUsed = new Date();
      alg.usageCount++;
    });
    
    return results;
  }
  
  /**
   * Search for patterns by type or content
   */
  searchPatterns(query: string, type?: PatternData['type']): PatternData[] {
    const results: PatternData[] = [];
    
    this.tiers.forEach(tier => {
      tier.units.forEach(unit => {
        const matchingPatterns = unit.patterns.filter(pat => 
          (type === undefined || pat.type === type) &&
          (pat.pattern.toLowerCase().includes(query.toLowerCase()) ||
           pat.examples.some(ex => ex.toLowerCase().includes(query.toLowerCase())))
        );
        
        results.push(...matchingPatterns);
      });
    });
    
    // Update usage statistics for found patterns
    results.forEach(pat => {
      pat.lastUsed = new Date();
      pat.frequency += 0.01; // Slightly increase frequency with each use
    });
    
    return results;
  }
  
  /**
   * Get top performing algorithms
   */
  getTopAlgorithms(count: number = 10): AlgorithmData[] {
    const allAlgorithms: AlgorithmData[] = [];
    
    this.tiers.forEach(tier => {
      tier.units.forEach(unit => {
        allAlgorithms.push(...unit.algorithms);
      });
    });
    
    return allAlgorithms
      .sort((a, b) => b.performance - a.performance)
      .slice(0, count);
  }
  
  /**
   * Get most frequently used patterns
   */
  getMostFrequentPatterns(count: number = 10): PatternData[] {
    const allPatterns: PatternData[] = [];
    
    this.tiers.forEach(tier => {
      tier.units.forEach(unit => {
        allPatterns.push(...unit.patterns);
      });
    });
    
    return allPatterns
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, count);
  }
  
  /**
   * Compress a unit to free up space
   */
  private compressUnit(unit: LogicDataUnit): void {
    console.log(`🗜️ Compressing unit ${unit.id}`);
    
    // Calculate current size
    const currentSize = unit.usedCapacity;
    
    // Apply compression to algorithms
    unit.algorithms.forEach(alg => {
      // More frequently used algorithms get better compression
      const usageBonus = Math.min(0.2, alg.usageCount / 100);
      const newCompressionRatio = Math.max(0.5, alg.compressionRatio - 0.1 - usageBonus);
      
      // Calculate space saved
      const oldSize = alg.size;
      const newSize = Math.floor(oldSize * newCompressionRatio / alg.compressionRatio);
      const spaceSaved = oldSize - newSize;
      
      // Update algorithm
      alg.size = newSize;
      alg.compressionRatio = newCompressionRatio;
      
      // Update unit capacity
      unit.usedCapacity -= spaceSaved;
    });
    
    // Apply compression to patterns
    unit.patterns.forEach(pat => {
      // More frequent patterns get better compression
      const frequencyBonus = Math.min(0.2, pat.frequency);
      const compressionFactor = 0.8 - frequencyBonus;
      
      // Calculate space saved
      const oldSize = pat.size;
      const newSize = Math.floor(oldSize * compressionFactor);
      const spaceSaved = oldSize - newSize;
      
      // Update pattern
      pat.size = newSize;
      
      // Update unit capacity
      unit.usedCapacity -= spaceSaved;
    });
    
    // Update unit compression level
    unit.compressionLevel = unit.usedCapacity / currentSize;
    
    console.log(`✅ Compressed unit ${unit.id} from ${currentSize} to ${unit.usedCapacity} bytes (${(unit.compressionLevel * 100).toFixed(1)}%)`);
  }
  
  /**
   * Replace obsolete algorithm to make space
   */
  private replaceObsoleteAlgorithm(unit: LogicDataUnit, newAlgorithm: Omit<AlgorithmData, 'id' | 'lastUsed' | 'usageCount'>): boolean {
    // Find least used and oldest algorithm
    const sortedAlgorithms = [...unit.algorithms].sort((a, b) => {
      // Sort by usage count first
      if (a.usageCount !== b.usageCount) {
        return a.usageCount - b.usageCount;
      }
      // Then by last used date
      return a.lastUsed.getTime() - b.lastUsed.getTime();
    });
    
    if (sortedAlgorithms.length === 0) return false;
    
    const obsoleteAlgorithm = sortedAlgorithms[0];
    
    // Check if the new algorithm is better than the obsolete one
    if (newAlgorithm.performance <= obsoleteAlgorithm.performance) {
      // Only replace if the new algorithm is better
      return false;
    }
    
    // Remove obsolete algorithm
    const index = unit.algorithms.findIndex(alg => alg.id === obsoleteAlgorithm.id);
    if (index !== -1) {
      unit.algorithms.splice(index, 1);
      unit.usedCapacity -= obsoleteAlgorithm.size;
      
      console.log(`🔄 Replaced obsolete algorithm ${obsoleteAlgorithm.id} (performance: ${obsoleteAlgorithm.performance.toFixed(2)}, usage: ${obsoleteAlgorithm.usageCount})`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Replace obsolete pattern to make space
   */
  private replaceObsoletePattern(unit: LogicDataUnit, newPattern: Omit<PatternData, 'id' | 'lastUsed'>): boolean {
    // Find least frequent and oldest pattern
    const sortedPatterns = [...unit.patterns].sort((a, b) => {
      // Sort by frequency first
      if (a.frequency !== b.frequency) {
        return a.frequency - b.frequency;
      }
      // Then by last used date
      return a.lastUsed.getTime() - b.lastUsed.getTime();
    });
    
    if (sortedPatterns.length === 0) return false;
    
    const obsoletePattern = sortedPatterns[0];
    
    // Remove obsolete pattern
    const index = unit.patterns.findIndex(pat => pat.id === obsoletePattern.id);
    if (index !== -1) {
      unit.patterns.splice(index, 1);
      unit.usedCapacity -= obsoletePattern.size;
      
      console.log(`🔄 Replaced obsolete pattern ${obsoletePattern.id} (frequency: ${obsoletePattern.frequency.toFixed(2)})`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Prune old tokens to make space
   */
  private pruneOldTokens(unit: LogicDataUnit, requiredSpace: number): void {
    // Convert tokens to array for sorting
    const tokenEntries = Array.from(unit.nlpTokens.entries());
    
    // Sort by frequency (count)
    tokenEntries.sort((a, b) => a[1] - b[1]);
    
    let spaceFreed = 0;
    const tokensToRemove: string[] = [];
    
    // Remove tokens until enough space is freed
    for (const [token, count] of tokenEntries) {
      const tokenSize = token.length * 2 + 8; // Same estimate as when storing
      tokensToRemove.push(token);
      spaceFreed += tokenSize;
      
      if (spaceFreed >= requiredSpace) {
        break;
      }
    }
    
    // Remove the tokens
    tokensToRemove.forEach(token => {
      unit.nlpTokens.delete(token);
    });
    
    unit.usedCapacity -= spaceFreed;
    console.log(`🧹 Pruned ${tokensToRemove.length} old tokens to free ${spaceFreed} bytes`);
  }
  
  /**
   * Determine best tier for algorithm based on purpose
   */
  private determineBestTier(purpose: string): number {
    const purpose_lower = purpose.toLowerCase();
    
    if (purpose_lower.includes('common sense') || purpose_lower.includes('logic') || 
        purpose_lower.includes('reasoning') || purpose_lower.includes('inference')) {
      return 0; // Tier 1: Common Sense & Meta-Logic
    }
    
    if (purpose_lower.includes('language') || purpose_lower.includes('nlp') || 
        purpose_lower.includes('text') || purpose_lower.includes('word')) {
      return 1; // Tier 2: Natural Language Processing
    }
    
    if (purpose_lower.includes('agent') || purpose_lower.includes('team') || 
        purpose_lower.includes('debate') || purpose_lower.includes('coordination')) {
      return 2; // Tier 3: Agentic Training
    }
    
    if (purpose_lower.includes('slang') || purpose_lower.includes('speak') || 
        purpose_lower.includes('conversation') || purpose_lower.includes('casual')) {
      return 3; // Tier 4: Slang & Natural Speaking
    }
    
    if (purpose_lower.includes('image') || purpose_lower.includes('visual') || 
        purpose_lower.includes('spatial') || purpose_lower.includes('2d')) {
      return 4; // Tier 5: Image Generation & Spatial Analysis
    }
    
    if (purpose_lower.includes('video') || purpose_lower.includes('3d') || 
        purpose_lower.includes('animation') || purpose_lower.includes('model')) {
      return 5; // Tier 6: Video Generation & 3D Modeling
    }
    
    // Default to Tier 1 if no match
    return 0;
  }
  
  /**
   * Determine best tier for pattern based on type
   */
  private determineBestTierForPattern(type: PatternData['type']): number {
    switch (type) {
      case 'reasoning':
        return 0; // Tier 1: Common Sense & Meta-Logic
      case 'language':
        return 1; // Tier 2: Natural Language Processing
      case 'slang':
        return 3; // Tier 4: Slang & Natural Speaking
      case 'common_sense':
        return 0; // Tier 1: Common Sense & Meta-Logic
      case 'domain_knowledge':
        return 2; // Tier 3: Agentic Training
      default:
        return 1; // Default to Tier 2
    }
  }
  
  /**
   * Get storage statistics
   */
  getStorageStats(): StorageStats {
    let totalAlgorithms = 0;
    let totalPatterns = 0;
    let totalPerformance = 0;
    let algorithmCount = 0;
    let activeUnits = 0;
    let totalCapacity = 0;
    let usedCapacity = 0;
    
    // Calculate tier with highest average performance
    const tierPerformances: number[] = Array(this.TIER_COUNT).fill(0);
    const tierAlgorithmCounts: number[] = Array(this.TIER_COUNT).fill(0);
    
    this.tiers.forEach(tier => {
      totalCapacity += tier.totalCapacity;
      usedCapacity += tier.usedCapacity;
      
      tier.units.forEach(unit => {
        if (unit.algorithms.length > 0 || unit.patterns.length > 0) {
          activeUnits++;
        }
        
        totalAlgorithms += unit.algorithms.length;
        totalPatterns += unit.patterns.length;
        
        unit.algorithms.forEach(alg => {
          totalPerformance += alg.performance;
          algorithmCount++;
          
          tierPerformances[tier.id] += alg.performance;
          tierAlgorithmCounts[tier.id]++;
        });
      });
    });
    
    // Calculate average performance per tier
    const tierAveragePerformances = tierPerformances.map((perf, index) => 
      tierAlgorithmCounts[index] > 0 ? perf / tierAlgorithmCounts[index] : 0
    );
    
    // Find top performing tier
    let topPerformingTier = 0;
    let highestPerformance = 0;
    
    tierAveragePerformances.forEach((perf, index) => {
      if (perf > highestPerformance) {
        highestPerformance = perf;
        topPerformingTier = index;
      }
    });
    
    return {
      totalUnits: this.TIER_COUNT * this.UNITS_PER_TIER,
      activeUnits,
      totalAlgorithms,
      totalPatterns,
      averagePerformance: algorithmCount > 0 ? totalPerformance / algorithmCount : 0,
      topPerformingTier,
      compressionRatio: usedCapacity / totalCapacity,
      capacityUsed: usedCapacity,
      capacityTotal: totalCapacity
    };
  }
  
  /**
   * Get tier information
   */
  getTierInfo(tierId: number): LogicDataTier | null {
    if (tierId < 0 || tierId >= this.TIER_COUNT) {
      return null;
    }
    
    return this.tiers[tierId];
  }
  
  /**
   * Get all tiers
   */
  getAllTiers(): LogicDataTier[] {
    return [...this.tiers];
  }
  
  /**
   * Optimize storage by compressing and reorganizing
   */
  async optimizeStorage(): Promise<{
    spaceReclaimed: number;
    compressionImproved: number;
    duration: number;
  }> {
    console.log('🔄 Starting storage optimization...');
    const startTime = Date.now();
    
    let totalSpaceReclaimed = 0;
    const initialUsedCapacity = this.tiers.reduce((sum, tier) => sum + tier.usedCapacity, 0);
    
    // Compress all units
    for (const tier of this.tiers) {
      for (const unit of tier.units) {
        if (unit.usedCapacity > 0) {
          const beforeCompression = unit.usedCapacity;
          this.compressUnit(unit);
          const spaceReclaimed = beforeCompression - unit.usedCapacity;
          totalSpaceReclaimed += spaceReclaimed;
        }
      }
      
      // Update tier compression ratio
      tier.compressionRatio = tier.usedCapacity / tier.totalCapacity;
    }
    
    const finalUsedCapacity = this.tiers.reduce((sum, tier) => sum + tier.usedCapacity, 0);
    const compressionImproved = initialUsedCapacity > 0 ? 
      (initialUsedCapacity - finalUsedCapacity) / initialUsedCapacity : 0;
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ Storage optimization complete: ${totalSpaceReclaimed} bytes reclaimed (${(compressionImproved * 100).toFixed(1)}% improvement) in ${duration}ms`);
    
    return {
      spaceReclaimed: totalSpaceReclaimed,
      compressionImproved,
      duration
    };
  }
  
  /**
   * Evolve algorithms by combining high-performing ones
   */
  evolveAlgorithms(count: number = 5): AlgorithmData[] {
    console.log(`🧬 Evolving ${count} new algorithms...`);
    
    // Get top performing algorithms
    const topAlgorithms = this.getTopAlgorithms(20);
    
    if (topAlgorithms.length < 2) {
      console.warn('⚠️ Not enough algorithms to evolve');
      return [];
    }
    
    const newAlgorithms: AlgorithmData[] = [];
    
    for (let i = 0; i < count; i++) {
      // Select two parent algorithms
      const parent1Index = Math.floor(Math.random() * topAlgorithms.length);
      let parent2Index = Math.floor(Math.random() * topAlgorithms.length);
      
      // Ensure different parents
      while (parent2Index === parent1Index) {
        parent2Index = Math.floor(Math.random() * topAlgorithms.length);
      }
      
      const parent1 = topAlgorithms[parent1Index];
      const parent2 = topAlgorithms[parent2Index];
      
      // Create child algorithm
      const childAlgorithm: Omit<AlgorithmData, 'id' | 'lastUsed' | 'usageCount'> = {
        name: `${parent1.name.split('-')[0]}-${parent2.name.split('-')[0]}-evolved`,
        pattern: `${parent1.pattern}-${parent2.pattern}`,
        purpose: `Combined functionality of ${parent1.purpose} and ${parent2.purpose}`,
        performance: Math.min(1.0, (parent1.performance + parent2.performance) / 2 + 0.1),
        generation: Math.max(parent1.generation, parent2.generation) + 1,
        parentIds: [parent1.id, parent2.id],
        mutations: 0,
        size: Math.floor((parent1.size + parent2.size) * 0.8), // Some efficiency from combination
        compressionRatio: Math.min(parent1.compressionRatio, parent2.compressionRatio)
      };
      
      // Apply random mutation
      if (Math.random() < 0.3) {
        childAlgorithm.mutations++;
        childAlgorithm.performance = Math.min(1.0, childAlgorithm.performance + Math.random() * 0.1);
        childAlgorithm.pattern += '-mutated';
      }
      
      // Store in same tier as highest performing parent
      const parentTier = parent1.performance > parent2.performance ? 
        parseInt(parent1.id.split('_')[0].replace('T', '')) : 
        parseInt(parent2.id.split('_')[0].replace('T', ''));
      
      try {
        const algorithmId = this.storeAlgorithm(childAlgorithm, parentTier);
        const storedAlgorithm = this.getAlgorithm(algorithmId);
        
        if (storedAlgorithm) {
          newAlgorithms.push(storedAlgorithm);
        }
      } catch (error) {
        console.error(`Failed to store evolved algorithm: ${error}`);
      }
    }
    
    console.log(`✅ Created ${newAlgorithms.length} evolved algorithms`);
    return newAlgorithms;
  }
  
  /**
   * Generate new patterns from existing ones
   */
  generateNewPatterns(count: number = 3): PatternData[] {
    console.log(`🧩 Generating ${count} new patterns...`);
    
    // Get most frequent patterns
    const topPatterns = this.getMostFrequentPatterns(10);
    
    if (topPatterns.length < 2) {
      console.warn('⚠️ Not enough patterns to generate new ones');
      return [];
    }
    
    const newPatterns: PatternData[] = [];
    
    for (let i = 0; i < count; i++) {
      // Select pattern type based on current needs
      const patternTypes: PatternData['type'][] = ['reasoning', 'language', 'slang', 'common_sense', 'domain_knowledge'];
      const selectedType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      
      // Create new pattern
      const basePattern = topPatterns[Math.floor(Math.random() * topPatterns.length)];
      
      const newPattern: Omit<PatternData, 'id' | 'lastUsed'> = {
        type: selectedType,
        pattern: `${selectedType}-${basePattern.pattern}-variant-${Math.floor(Math.random() * 100)}`,
        examples: [
          `New example for ${selectedType} pattern`,
          `Another example for ${selectedType} pattern`
        ],
        frequency: 0.1, // Start with low frequency
        size: Math.floor(basePattern.size * 0.9) // Slightly smaller than base
      };
      
      try {
        const patternId = this.storePattern(newPattern);
        const storedPattern = this.getPattern(patternId);
        
        if (storedPattern) {
          newPatterns.push(storedPattern);
        }
      } catch (error) {
        console.error(`Failed to store new pattern: ${error}`);
      }
    }
    
    console.log(`✅ Created ${newPatterns.length} new patterns`);
    return newPatterns;
  }
}