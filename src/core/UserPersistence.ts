/**
 * Enhanced User Persistence System
 * Maintains user identity and training state across sessions and tabs
 */

export interface UserProfile {
  id: string;
  username: string;
  createdAt: Date;
  lastActive: Date;
  sessionCount: number;
  totalInteractions: number;
  preferences: UserPreferences;
  trainingContribution: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  interests: string[];
  learningGoals: string[];
}

export interface UserPreferences {
  responseStyle: 'detailed' | 'concise' | 'technical' | 'casual';
  preferredTopics: string[];
  communicationStyle: 'formal' | 'informal' | 'adaptive';
  feedbackFrequency: 'high' | 'medium' | 'low';
  privacyLevel: 'open' | 'moderate' | 'strict';
  multiModalPreferences: {
    textEnabled: boolean;
    speechEnabled: boolean;
    visualEnabled: boolean;
    videoEnabled: boolean;
  };
}

export interface SessionData {
  sessionId: string;
  userId: string;
  startTime: Date;
  lastActivity: Date;
  tabId: string;
  conversationCount: number;
  trainingProgress: number;
  contextHistory: string[];
  activeModalities: string[];
}

export interface TrainingState {
  userId: string;
  currentLevel: string;
  progressPercentage: number;
  reasoningAbility: number;
  algorithmCount: number;
  generation: number;
  multiModalProgress: number;
  lastCheckpoint: Date;
  continuousTraining: boolean;
}

export class UserPersistence {
  private readonly STORAGE_KEY = 'machinegod-user-persistence';
  private readonly SESSION_KEY = 'machinegod-session';
  private readonly TRAINING_KEY = 'machinegod-training-state';
  
  private userProfiles: Map<string, UserProfile> = new Map();
  private activeSessions: Map<string, SessionData> = new Map();
  private trainingStates: Map<string, TrainingState> = new Map();
  private currentUser: UserProfile | null = null;
  private currentSession: SessionData | null = null;
  private tabId: string;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.tabId = this.generateTabId();
    this.loadPersistedData();
    this.initializeUser();
    this.startHeartbeat();
    
    // Handle tab/window events
    this.setupEventListeners();
    
    console.log('👤 Enhanced User Persistence System initialized');
    console.log(`🏷️ Tab ID: ${this.tabId}`);
  }

  private generateTabId(): string {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadPersistedData() {
    try {
      // Load user profiles
      const userProfilesData = localStorage.getItem(this.STORAGE_KEY);
      if (userProfilesData) {
        const parsed = JSON.parse(userProfilesData);
        Object.entries(parsed).forEach(([userId, profile]: [string, any]) => {
          this.userProfiles.set(userId, {
            ...profile,
            createdAt: new Date(profile.createdAt),
            lastActive: new Date(profile.lastActive)
          });
        });
      }

      // Load training states
      const trainingData = localStorage.getItem(this.TRAINING_KEY);
      if (trainingData) {
        const parsed = JSON.parse(trainingData);
        Object.entries(parsed).forEach(([userId, state]: [string, any]) => {
          this.trainingStates.set(userId, {
            ...state,
            lastCheckpoint: new Date(state.lastCheckpoint)
          });
        });
      }

      console.log(`👤 Loaded ${this.userProfiles.size} user profiles and ${this.trainingStates.size} training states`);
    } catch (error) {
      console.warn('⚠️ Failed to load persisted user data:', error);
    }
  }

  private initializeUser() {
    // Try to restore existing user or create new one
    const existingUserId = this.findExistingUser();
    
    if (existingUserId) {
      this.currentUser = this.userProfiles.get(existingUserId)!;
      this.currentUser.lastActive = new Date();
      this.currentUser.sessionCount++;
      console.log(`👤 Restored user: ${this.currentUser.username} (${this.currentUser.sessionCount} sessions)`);
    } else {
      this.currentUser = this.createNewUser();
      console.log(`👤 Created new user: ${this.currentUser.username}`);
    }

    // Create new session
    this.currentSession = this.createNewSession(this.currentUser.id);
    
    // Restore or create training state
    this.restoreTrainingState(this.currentUser.id);
    
    this.persistData();
  }

  private findExistingUser(): string | null {
    // Look for recent user activity (within last 7 days)
    const recentThreshold = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const [userId, profile] of this.userProfiles) {
      if (profile.lastActive.getTime() > recentThreshold) {
        return userId;
      }
    }
    
    // If no recent users, return the most recent one
    if (this.userProfiles.size > 0) {
      const sortedUsers = Array.from(this.userProfiles.entries())
        .sort(([,a], [,b]) => b.lastActive.getTime() - a.lastActive.getTime());
      return sortedUsers[0][0];
    }
    
    return null;
  }

  private createNewUser(): UserProfile {
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const username = `User${Math.floor(Math.random() * 10000)}`;
    
    const profile: UserProfile = {
      id: userId,
      username,
      createdAt: new Date(),
      lastActive: new Date(),
      sessionCount: 1,
      totalInteractions: 0,
      preferences: {
        responseStyle: 'detailed',
        preferredTopics: [],
        communicationStyle: 'adaptive',
        feedbackFrequency: 'medium',
        privacyLevel: 'moderate',
        multiModalPreferences: {
          textEnabled: true,
          speechEnabled: false,
          visualEnabled: false,
          videoEnabled: false
        }
      },
      trainingContribution: 0,
      skillLevel: 'beginner',
      interests: [],
      learningGoals: []
    };
    
    this.userProfiles.set(userId, profile);
    return profile;
  }

  private createNewSession(userId: string): SessionData {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const session: SessionData = {
      sessionId,
      userId,
      startTime: new Date(),
      lastActivity: new Date(),
      tabId: this.tabId,
      conversationCount: 0,
      trainingProgress: 0,
      contextHistory: [],
      activeModalities: ['text']
    };
    
    this.activeSessions.set(sessionId, session);
    return session;
  }

  private restoreTrainingState(userId: string) {
    let trainingState = this.trainingStates.get(userId);
    
    if (!trainingState) {
      trainingState = {
        userId,
        currentLevel: 'ChatGPT-4 Baseline',
        progressPercentage: 15,
        reasoningAbility: 0.4,
        algorithmCount: 0,
        generation: 0,
        multiModalProgress: 0.25,
        lastCheckpoint: new Date(),
        continuousTraining: true
      };
      
      this.trainingStates.set(userId, trainingState);
    }
    
    console.log(`🧬 Restored training state: ${trainingState.currentLevel} (${trainingState.progressPercentage.toFixed(1)}%)`);
  }

  private setupEventListeners() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handleTabHidden();
      } else {
        this.handleTabVisible();
      }
    });

    // Handle beforeunload
    window.addEventListener('beforeunload', () => {
      this.handleTabClosing();
    });

    // Handle focus/blur
    window.addEventListener('focus', () => {
      this.handleTabFocus();
    });

    window.addEventListener('blur', () => {
      this.handleTabBlur();
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.updateActivity();
      this.persistData();
    }, 30000); // Every 30 seconds
  }

  private handleTabHidden() {
    console.log('👁️ Tab hidden - pausing training updates');
    if (this.currentSession) {
      this.currentSession.lastActivity = new Date();
    }
    this.persistData();
  }

  private handleTabVisible() {
    console.log('👁️ Tab visible - resuming training updates');
    this.updateActivity();
  }

  private handleTabFocus() {
    console.log('🎯 Tab focused - user active');
    this.updateActivity();
  }

  private handleTabBlur() {
    console.log('🎯 Tab blurred - user inactive');
    if (this.currentSession) {
      this.currentSession.lastActivity = new Date();
    }
  }

  private handleTabClosing() {
    console.log('🚪 Tab closing - saving final state');
    this.persistData();
  }

  private updateActivity() {
    const now = new Date();
    
    if (this.currentUser) {
      this.currentUser.lastActive = now;
    }
    
    if (this.currentSession) {
      this.currentSession.lastActivity = now;
    }
  }

  /**
   * Record user interaction
   */
  recordInteraction(input: string, response: string, confidence: number, trainingImpact: any) {
    if (!this.currentUser || !this.currentSession) return;

    // Update user stats
    this.currentUser.totalInteractions++;
    this.currentUser.trainingContribution += trainingImpact?.performanceGain || 0;
    
    // Update session stats
    this.currentSession.conversationCount++;
    this.currentSession.contextHistory.push(input);
    
    // Keep only recent context
    if (this.currentSession.contextHistory.length > 10) {
      this.currentSession.contextHistory = this.currentSession.contextHistory.slice(-10);
    }
    
    // Update skill level based on interaction complexity
    this.updateSkillLevel(input, confidence);
    
    // Extract interests from input
    this.updateInterests(input);
    
    this.updateActivity();
    this.persistData();
  }

  /**
   * Update training state
   */
  updateTrainingState(
    currentLevel: string,
    progressPercentage: number,
    reasoningAbility: number,
    algorithmCount: number,
    generation: number,
    multiModalProgress: number
  ) {
    if (!this.currentUser) return;

    const trainingState = this.trainingStates.get(this.currentUser.id);
    if (trainingState) {
      trainingState.currentLevel = currentLevel;
      trainingState.progressPercentage = progressPercentage;
      trainingState.reasoningAbility = reasoningAbility;
      trainingState.algorithmCount = algorithmCount;
      trainingState.generation = generation;
      trainingState.multiModalProgress = multiModalProgress;
      trainingState.lastCheckpoint = new Date();
      
      // Update session training progress
      if (this.currentSession) {
        this.currentSession.trainingProgress = progressPercentage;
      }
    }
    
    this.persistData();
  }

  /**
   * Enable multi-modal capability
   */
  enableMultiModalCapability(modality: 'speech' | 'visual' | 'video') {
    if (!this.currentUser) return;

    switch (modality) {
      case 'speech':
        this.currentUser.preferences.multiModalPreferences.speechEnabled = true;
        if (this.currentSession && !this.currentSession.activeModalities.includes('speech')) {
          this.currentSession.activeModalities.push('speech');
        }
        break;
      case 'visual':
        this.currentUser.preferences.multiModalPreferences.visualEnabled = true;
        if (this.currentSession && !this.currentSession.activeModalities.includes('visual')) {
          this.currentSession.activeModalities.push('visual');
        }
        break;
      case 'video':
        this.currentUser.preferences.multiModalPreferences.videoEnabled = true;
        if (this.currentSession && !this.currentSession.activeModalities.includes('video')) {
          this.currentSession.activeModalities.push('video');
        }
        break;
    }
    
    console.log(`🌟 Enabled ${modality} capability for user ${this.currentUser.username}`);
    this.persistData();
  }

  private updateSkillLevel(input: string, confidence: number) {
    if (!this.currentUser) return;

    const complexity = this.assessInputComplexity(input);
    const skillScore = (complexity * 0.4) + (confidence * 0.6);
    
    // Update skill level based on consistent performance
    if (skillScore > 0.8 && this.currentUser.totalInteractions > 20) {
      if (this.currentUser.skillLevel === 'beginner') {
        this.currentUser.skillLevel = 'intermediate';
      } else if (this.currentUser.skillLevel === 'intermediate') {
        this.currentUser.skillLevel = 'advanced';
      } else if (this.currentUser.skillLevel === 'advanced') {
        this.currentUser.skillLevel = 'expert';
      }
    }
  }

  private assessInputComplexity(input: string): number {
    let complexity = 0.1;
    
    // Length factor
    complexity += Math.min(0.3, input.length / 500);
    
    // Technical terms
    const technicalTerms = ['algorithm', 'system', 'analysis', 'implementation', 'optimization'];
    complexity += technicalTerms.filter(term => input.toLowerCase().includes(term)).length * 0.1;
    
    // Question complexity
    const questionWords = ['how', 'why', 'what', 'when', 'where', 'which'];
    complexity += questionWords.filter(qw => input.toLowerCase().includes(qw)).length * 0.05;
    
    return Math.min(1.0, complexity);
  }

  private updateInterests(input: string) {
    if (!this.currentUser) return;

    const topics = this.extractTopics(input);
    topics.forEach(topic => {
      if (!this.currentUser!.interests.includes(topic)) {
        this.currentUser!.interests.push(topic);
        
        // Keep only recent interests
        if (this.currentUser!.interests.length > 20) {
          this.currentUser!.interests = this.currentUser!.interests.slice(-20);
        }
      }
    });
  }

  private extractTopics(input: string): string[] {
    const topics: string[] = [];
    const lowerInput = input.toLowerCase();
    
    const topicKeywords = {
      'technology': ['tech', 'computer', 'software', 'ai', 'machine learning'],
      'science': ['science', 'research', 'experiment', 'theory', 'hypothesis'],
      'mathematics': ['math', 'equation', 'formula', 'calculation', 'statistics'],
      'programming': ['code', 'programming', 'development', 'algorithm', 'function'],
      'business': ['business', 'market', 'strategy', 'management', 'finance'],
      'education': ['learn', 'study', 'education', 'teaching', 'knowledge'],
      'health': ['health', 'medical', 'wellness', 'fitness', 'nutrition'],
      'creativity': ['creative', 'art', 'design', 'music', 'writing']
    };
    
    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        topics.push(topic);
      }
    });
    
    return topics;
  }

  private persistData() {
    try {
      // Save user profiles
      const userProfilesData = Object.fromEntries(this.userProfiles);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userProfilesData));
      
      // Save training states
      const trainingData = Object.fromEntries(this.trainingStates);
      localStorage.setItem(this.TRAINING_KEY, JSON.stringify(trainingData));
      
      // Save current session
      if (this.currentSession) {
        sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(this.currentSession));
      }
    } catch (error) {
      console.warn('⚠️ Failed to persist user data:', error);
    }
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  /**
   * Get current session
   */
  getCurrentSession(): SessionData | null {
    return this.currentSession;
  }

  /**
   * Get training state for current user
   */
  getCurrentTrainingState(): TrainingState | null {
    if (!this.currentUser) return null;
    return this.trainingStates.get(this.currentUser.id) || null;
  }

  /**
   * Get conversation context for current session
   */
  getConversationContext(): string[] {
    return this.currentSession?.contextHistory || [];
  }

  /**
   * Check if multi-modal capability is enabled
   */
  isMultiModalEnabled(modality: 'speech' | 'visual' | 'video'): boolean {
    if (!this.currentUser) return false;
    
    switch (modality) {
      case 'speech':
        return this.currentUser.preferences.multiModalPreferences.speechEnabled;
      case 'visual':
        return this.currentUser.preferences.multiModalPreferences.visualEnabled;
      case 'video':
        return this.currentUser.preferences.multiModalPreferences.videoEnabled;
      default:
        return false;
    }
  }

  /**
   * Get user statistics
   */
  getUserStats(): {
    totalUsers: number;
    activeSessions: number;
    currentUserStats: any;
    trainingProgress: any;
  } {
    const currentUserStats = this.currentUser ? {
      username: this.currentUser.username,
      sessionCount: this.currentUser.sessionCount,
      totalInteractions: this.currentUser.totalInteractions,
      skillLevel: this.currentUser.skillLevel,
      trainingContribution: this.currentUser.trainingContribution,
      interests: this.currentUser.interests.slice(-5), // Last 5 interests
      activeModalities: this.currentSession?.activeModalities || []
    } : null;
    
    const trainingProgress = this.getCurrentTrainingState();
    
    return {
      totalUsers: this.userProfiles.size,
      activeSessions: this.activeSessions.size,
      currentUserStats,
      trainingProgress
    };
  }

  /**
   * Update user preferences
   */
  updateUserPreferences(preferences: Partial<UserPreferences>) {
    if (!this.currentUser) return;
    
    this.currentUser.preferences = {
      ...this.currentUser.preferences,
      ...preferences
    };
    
    this.persistData();
    console.log('👤 User preferences updated');
  }

  /**
   * Cleanup old sessions and data
   */
  cleanup() {
    const now = Date.now();
    const oldThreshold = now - (30 * 24 * 60 * 60 * 1000); // 30 days
    
    // Remove old sessions
    for (const [sessionId, session] of this.activeSessions) {
      if (session.lastActivity.getTime() < oldThreshold) {
        this.activeSessions.delete(sessionId);
      }
    }
    
    // Remove very old user profiles (keep at least recent ones)
    const userCount = this.userProfiles.size;
    if (userCount > 10) {
      const sortedUsers = Array.from(this.userProfiles.entries())
        .sort(([,a], [,b]) => b.lastActive.getTime() - a.lastActive.getTime());
      
      // Keep only the 10 most recent users
      const usersToKeep = sortedUsers.slice(0, 10);
      this.userProfiles.clear();
      usersToKeep.forEach(([userId, profile]) => {
        this.userProfiles.set(userId, profile);
      });
    }
    
    this.persistData();
    console.log('🧹 User persistence cleanup completed');
  }

  /**
   * Shutdown persistence system
   */
  shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    this.persistData();
    console.log('👤 User Persistence System shutdown');
  }
}