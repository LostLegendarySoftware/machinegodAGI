/**
 * Persistent Memory System
 * Handles user conversation history, training persistence, and multi-modal progression
 */

export interface UserSession {
  id: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  conversationCount: number;
  trainingContribution: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  responseStyle: 'detailed' | 'concise' | 'technical' | 'casual';
  topics: string[];
  learningGoals: string[];
  feedbackHistory: Array<{
    response: string;
    rating: number;
    feedback: string;
    timestamp: Date;
  }>;
}

export interface ConversationMemory {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  input: string;
  response: string;
  reasoning: string;
  confidence: number;
  trainingImpact: any;
  context: string[];
  topics: string[];
  complexity: number;
  userSatisfaction?: number;
}

export interface TrainingCheckpoint {
  id: string;
  timestamp: Date;
  generation: number;
  reasoningAbility: number;
  conversationQuality: number;
  algorithmCount: number;
  capabilities: string[];
  multiModalProgress: MultiModalProgress;
  totalConversations: number;
  userInteractions: number;
}

export interface MultiModalProgress {
  naturalLanguage: {
    level: number;
    capabilities: string[];
    nextMilestone: string;
  };
  speechToText: {
    level: number;
    capabilities: string[];
    nextMilestone: string;
  };
  imageGeneration: {
    level: number;
    capabilities: string[];
    nextMilestone: string;
  };
  videoSpatialAnalysis: {
    level: number;
    capabilities: string[];
    nextMilestone: string;
  };
  overallProgress: number;
}

export class PersistentMemory {
  private conversations: Map<string, ConversationMemory[]> = new Map();
  private userSessions: Map<string, UserSession> = new Map();
  private trainingCheckpoints: TrainingCheckpoint[] = [];
  private currentUserId: string = 'default-user';
  private currentSessionId: string = '';
  private multiModalProgress: MultiModalProgress;
  private storageKey = 'machinegod-memory';
  private maxConversationsPerUser = 1000;
  private maxCheckpoints = 100;

  constructor() {
    this.initializeMultiModalProgress();
    this.loadFromStorage();
    this.startNewSession();
    this.startPeriodicSave();
    console.log('💾 Persistent Memory System initialized');
  }

  private initializeMultiModalProgress() {
    this.multiModalProgress = {
      naturalLanguage: {
        level: 1,
        capabilities: ['Basic conversation', 'Simple reasoning', 'Context awareness'],
        nextMilestone: 'Advanced reasoning and complex dialogue'
      },
      speechToText: {
        level: 0,
        capabilities: [],
        nextMilestone: 'Basic speech recognition and processing'
      },
      imageGeneration: {
        level: 0,
        capabilities: [],
        nextMilestone: 'Simple image understanding and description'
      },
      videoSpatialAnalysis: {
        level: 0,
        capabilities: [],
        nextMilestone: 'Basic video frame analysis'
      },
      overallProgress: 0.25 // 25% - starting with natural language
    };
  }

  private startNewSession() {
    this.currentSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const existingUser = this.userSessions.get(this.currentUserId);
    if (existingUser) {
      existingUser.lastActivity = new Date();
      existingUser.conversationCount = this.getConversationCount(this.currentUserId);
    } else {
      const newUser: UserSession = {
        id: this.currentUserId,
        userId: this.currentUserId,
        startTime: new Date(),
        lastActivity: new Date(),
        conversationCount: 0,
        trainingContribution: 0,
        preferences: {
          responseStyle: 'detailed',
          topics: [],
          learningGoals: [],
          feedbackHistory: []
        }
      };
      this.userSessions.set(this.currentUserId, newUser);
    }
    
    console.log(`👤 New session started: ${this.currentSessionId}`);
  }

  /**
   * Store a conversation with full context
   */
  storeConversation(
    input: string,
    response: string,
    reasoning: string,
    confidence: number,
    trainingImpact: any,
    context: string[] = []
  ): string {
    const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const conversation: ConversationMemory = {
      id: conversationId,
      userId: this.currentUserId,
      sessionId: this.currentSessionId,
      timestamp: new Date(),
      input,
      response,
      reasoning,
      confidence,
      trainingImpact,
      context,
      topics: this.extractTopics(input),
      complexity: this.calculateComplexity(input)
    };
    
    // Get or create user conversation history
    const userConversations = this.conversations.get(this.currentUserId) || [];
    userConversations.push(conversation);
    
    // Limit conversation history per user
    if (userConversations.length > this.maxConversationsPerUser) {
      userConversations.shift();
    }
    
    this.conversations.set(this.currentUserId, userConversations);
    
    // Update user session
    const userSession = this.userSessions.get(this.currentUserId)!;
    userSession.conversationCount++;
    userSession.lastActivity = new Date();
    userSession.trainingContribution += trainingImpact?.performanceGain || 0;
    
    // Update user preferences based on conversation
    this.updateUserPreferences(conversation);
    
    console.log(`💬 Conversation stored: ${conversationId}`);
    return conversationId;
  }

  private extractTopics(input: string): string[] {
    const topics: string[] = [];
    const keywords = input.toLowerCase().split(/\s+/);
    
    // Technical topics
    const techKeywords = ['algorithm', 'system', 'code', 'programming', 'ai', 'machine', 'learning'];
    techKeywords.forEach(keyword => {
      if (keywords.includes(keyword)) topics.push('technology');
    });
    
    // Science topics
    const scienceKeywords = ['science', 'research', 'analysis', 'data', 'experiment'];
    scienceKeywords.forEach(keyword => {
      if (keywords.includes(keyword)) topics.push('science');
    });
    
    // Creative topics
    const creativeKeywords = ['create', 'design', 'art', 'creative', 'imagine'];
    creativeKeywords.forEach(keyword => {
      if (keywords.includes(keyword)) topics.push('creative');
    });
    
    return [...new Set(topics)];
  }

  private calculateComplexity(input: string): number {
    let complexity = 1;
    complexity += Math.floor(input.length / 50);
    
    const complexWords = ['analyze', 'synthesize', 'evaluate', 'compare', 'explain', 'describe'];
    complexity += complexWords.filter(word => input.toLowerCase().includes(word)).length;
    
    return Math.min(10, complexity);
  }

  private updateUserPreferences(conversation: ConversationMemory) {
    const userSession = this.userSessions.get(this.currentUserId)!;
    
    // Update topics
    conversation.topics.forEach(topic => {
      if (!userSession.preferences.topics.includes(topic)) {
        userSession.preferences.topics.push(topic);
      }
    });
    
    // Limit topics to most recent 20
    if (userSession.preferences.topics.length > 20) {
      userSession.preferences.topics = userSession.preferences.topics.slice(-20);
    }
  }

  /**
   * Create training checkpoint
   */
  createTrainingCheckpoint(
    generation: number,
    reasoningAbility: number,
    conversationQuality: number,
    algorithmCount: number,
    capabilities: string[]
  ): string {
    const checkpointId = `checkpoint-${Date.now()}`;
    
    const checkpoint: TrainingCheckpoint = {
      id: checkpointId,
      timestamp: new Date(),
      generation,
      reasoningAbility,
      conversationQuality,
      algorithmCount,
      capabilities,
      multiModalProgress: { ...this.multiModalProgress },
      totalConversations: this.getTotalConversations(),
      userInteractions: this.userSessions.size
    };
    
    this.trainingCheckpoints.push(checkpoint);
    
    // Limit checkpoints
    if (this.trainingCheckpoints.length > this.maxCheckpoints) {
      this.trainingCheckpoints.shift();
    }
    
    // Update multi-modal progress based on training metrics
    this.updateMultiModalProgress(reasoningAbility, conversationQuality);
    
    console.log(`📊 Training checkpoint created: ${checkpointId}`);
    return checkpointId;
  }

  private updateMultiModalProgress(reasoningAbility: number, conversationQuality: number) {
    // Natural Language progression
    if (reasoningAbility > 0.6 && this.multiModalProgress.naturalLanguage.level < 2) {
      this.multiModalProgress.naturalLanguage.level = 2;
      this.multiModalProgress.naturalLanguage.capabilities.push('Advanced reasoning', 'Complex dialogue');
      this.multiModalProgress.naturalLanguage.nextMilestone = 'Expert-level conversation and creative writing';
    }
    
    if (reasoningAbility > 0.8 && this.multiModalProgress.naturalLanguage.level < 3) {
      this.multiModalProgress.naturalLanguage.level = 3;
      this.multiModalProgress.naturalLanguage.capabilities.push('Expert conversation', 'Creative writing', 'Technical documentation');
      this.multiModalProgress.naturalLanguage.nextMilestone = 'Human-level language mastery';
    }
    
    // Speech-to-Text progression (unlocks after NL level 2)
    if (this.multiModalProgress.naturalLanguage.level >= 2 && this.multiModalProgress.speechToText.level === 0) {
      this.multiModalProgress.speechToText.level = 1;
      this.multiModalProgress.speechToText.capabilities.push('Basic speech recognition');
      this.multiModalProgress.speechToText.nextMilestone = 'Advanced speech processing and voice synthesis';
    }
    
    // Image Generation progression (unlocks after NL level 3)
    if (this.multiModalProgress.naturalLanguage.level >= 3 && this.multiModalProgress.imageGeneration.level === 0) {
      this.multiModalProgress.imageGeneration.level = 1;
      this.multiModalProgress.imageGeneration.capabilities.push('Image understanding', 'Basic descriptions');
      this.multiModalProgress.imageGeneration.nextMilestone = 'Image generation and advanced visual analysis';
    }
    
    // Video Spatial Analysis (unlocks after Image level 2)
    if (this.multiModalProgress.imageGeneration.level >= 2 && this.multiModalProgress.videoSpatialAnalysis.level === 0) {
      this.multiModalProgress.videoSpatialAnalysis.level = 1;
      this.multiModalProgress.videoSpatialAnalysis.capabilities.push('Basic video analysis');
      this.multiModalProgress.videoSpatialAnalysis.nextMilestone = 'Advanced spatial understanding and video generation';
    }
    
    // Calculate overall progress
    const totalLevels = this.multiModalProgress.naturalLanguage.level +
                       this.multiModalProgress.speechToText.level +
                       this.multiModalProgress.imageGeneration.level +
                       this.multiModalProgress.videoSpatialAnalysis.level;
    
    this.multiModalProgress.overallProgress = totalLevels / 12; // Max 3 levels per modality
  }

  /**
   * Get conversation history for context
   */
  getConversationContext(userId: string = this.currentUserId, limit: number = 10): string[] {
    const userConversations = this.conversations.get(userId) || [];
    return userConversations
      .slice(-limit)
      .map(conv => conv.input);
  }

  /**
   * Get user conversation history
   */
  getUserConversations(userId: string = this.currentUserId): ConversationMemory[] {
    return this.conversations.get(userId) || [];
  }

  /**
   * Search conversations by topic or content
   */
  searchConversations(query: string, userId: string = this.currentUserId): ConversationMemory[] {
    const userConversations = this.conversations.get(userId) || [];
    const searchTerm = query.toLowerCase();
    
    return userConversations.filter(conv =>
      conv.input.toLowerCase().includes(searchTerm) ||
      conv.response.toLowerCase().includes(searchTerm) ||
      conv.topics.some(topic => topic.includes(searchTerm))
    );
  }

  /**
   * Get training progress summary
   */
  getTrainingProgress(): {
    checkpoints: number;
    latestCheckpoint: TrainingCheckpoint | null;
    multiModalProgress: MultiModalProgress;
    totalConversations: number;
    userCount: number;
  } {
    return {
      checkpoints: this.trainingCheckpoints.length,
      latestCheckpoint: this.trainingCheckpoints[this.trainingCheckpoints.length - 1] || null,
      multiModalProgress: { ...this.multiModalProgress },
      totalConversations: this.getTotalConversations(),
      userCount: this.userSessions.size
    };
  }

  /**
   * Get user statistics
   */
  getUserStats(userId: string = this.currentUserId): {
    session: UserSession | null;
    conversationCount: number;
    averageComplexity: number;
    topTopics: string[];
    trainingContribution: number;
  } {
    const session = this.userSessions.get(userId) || null;
    const conversations = this.conversations.get(userId) || [];
    
    const avgComplexity = conversations.length > 0 
      ? conversations.reduce((sum, conv) => sum + conv.complexity, 0) / conversations.length
      : 0;
    
    const topicCounts = new Map<string, number>();
    conversations.forEach(conv => {
      conv.topics.forEach(topic => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });
    
    const topTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
    
    return {
      session,
      conversationCount: conversations.length,
      averageComplexity: avgComplexity,
      topTopics,
      trainingContribution: session?.trainingContribution || 0
    };
  }

  private getTotalConversations(): number {
    let total = 0;
    for (const conversations of this.conversations.values()) {
      total += conversations.length;
    }
    return total;
  }

  private getConversationCount(userId: string): number {
    return this.conversations.get(userId)?.length || 0;
  }

  /**
   * Save to localStorage
   */
  private saveToStorage() {
    try {
      const data = {
        conversations: Object.fromEntries(this.conversations),
        userSessions: Object.fromEntries(this.userSessions),
        trainingCheckpoints: this.trainingCheckpoints,
        multiModalProgress: this.multiModalProgress,
        currentUserId: this.currentUserId,
        lastSave: new Date().toISOString()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      console.log('💾 Memory saved to storage');
    } catch (error) {
      console.warn('⚠️ Failed to save memory to storage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        
        // Restore conversations
        this.conversations = new Map(Object.entries(data.conversations || {}));
        
        // Restore user sessions
        this.userSessions = new Map(Object.entries(data.userSessions || {}));
        
        // Restore training checkpoints
        this.trainingCheckpoints = data.trainingCheckpoints || [];
        
        // Restore multi-modal progress
        if (data.multiModalProgress) {
          this.multiModalProgress = data.multiModalProgress;
        }
        
        // Restore current user
        this.currentUserId = data.currentUserId || 'default-user';
        
        console.log(`💾 Memory loaded from storage - ${this.getTotalConversations()} conversations restored`);
      }
    } catch (error) {
      console.warn('⚠️ Failed to load memory from storage:', error);
    }
  }

  /**
   * Start periodic saving
   */
  private startPeriodicSave() {
    setInterval(() => {
      this.saveToStorage();
    }, 30000); // Save every 30 seconds
  }

  /**
   * Export memory data
   */
  exportMemory(): string {
    const data = {
      conversations: Object.fromEntries(this.conversations),
      userSessions: Object.fromEntries(this.userSessions),
      trainingCheckpoints: this.trainingCheckpoints,
      multiModalProgress: this.multiModalProgress,
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  /**
   * Clear all memory (with confirmation)
   */
  clearMemory(): boolean {
    this.conversations.clear();
    this.userSessions.clear();
    this.trainingCheckpoints = [];
    this.initializeMultiModalProgress();
    this.startNewSession();
    
    localStorage.removeItem(this.storageKey);
    
    console.log('🗑️ All memory cleared');
    return true;
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats(): {
    totalConversations: number;
    totalUsers: number;
    totalCheckpoints: number;
    storageSize: number;
    oldestConversation: Date | null;
    newestConversation: Date | null;
  } {
    let oldestDate: Date | null = null;
    let newestDate: Date | null = null;
    
    for (const conversations of this.conversations.values()) {
      for (const conv of conversations) {
        if (!oldestDate || conv.timestamp < oldestDate) {
          oldestDate = conv.timestamp;
        }
        if (!newestDate || conv.timestamp > newestDate) {
          newestDate = conv.timestamp;
        }
      }
    }
    
    const storageData = localStorage.getItem(this.storageKey);
    const storageSize = storageData ? new Blob([storageData]).size : 0;
    
    return {
      totalConversations: this.getTotalConversations(),
      totalUsers: this.userSessions.size,
      totalCheckpoints: this.trainingCheckpoints.length,
      storageSize,
      oldestConversation: oldestDate,
      newestConversation: newestDate
    };
  }
}