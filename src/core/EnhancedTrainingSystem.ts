/**
 * Enhanced Training System with Contextual Reasoning
 * Implements better "no" response handling, contextual guessing, and redundancy checking
 */

export interface TrainingQuestion {
  id: string;
  question: string;
  expectedAnswer: string;
  category: 'logic' | 'language' | 'knowledge' | 'reasoning' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
  inferenceFunction?: (knownFacts: Map<string, any>, personality: any) => string | null;
}

export interface TrainingAttempt {
  questionId: string;
  userAnswer: string;
  aiResponse: string;
  userValidation: 'yes' | 'no' | 'pending';
  feedback?: string;
  timestamp: Date;
  wasInferred: boolean;
  confidence: number;
}

export interface KnownFact {
  key: string;
  value: any;
  source: 'explicit' | 'inferred' | 'corrected';
  confidence: number;
  timestamp: Date;
}

export interface PersonalityProfile {
  formality: number;
  directness: number;
  humor: number;
  empathy: number;
  techLevel: number;
  responseStyle: 'detailed' | 'concise' | 'casual' | 'formal';
  preferences: Map<string, any>;
}

export class EnhancedTrainingSystem {
  private trainingQuestions: TrainingQuestion[] = [];
  private knownFacts: Map<string, KnownFact> = new Map();
  private personality: PersonalityProfile;
  private currentSession: any = null;
  private readonly REQUIRED_CORRECT = 25;
  private learningPatterns: Map<string, string[]> = new Map();
  private contextualInferences: Map<string, string> = new Map();

  constructor() {
    this.personality = {
      formality: 0,
      directness: 0,
      humor: 0,
      empathy: 0,
      techLevel: 0,
      responseStyle: 'casual',
      preferences: new Map()
    };
    
    this.initializeEnhancedQuestions();
    console.log('🧠 Enhanced Training System initialized with contextual reasoning');
  }

  private initializeEnhancedQuestions() {
    this.trainingQuestions = [
      // Communication Style Questions with Inference Functions
      {
        id: 'comm_1',
        question: 'Should I address you formally or casually?',
        expectedAnswer: 'depends on preference',
        category: 'social',
        difficulty: 'easy',
        inferenceFunction: (facts, personality) => {
          if (facts.has('communication_style')) {
            return facts.get('communication_style')?.value;
          }
          if (personality.formality > 0.3) return 'formally';
          if (personality.formality < -0.3) return 'casually';
          return null;
        }
      },
      {
        id: 'comm_2',
        question: 'Do you prefer short responses or detailed explanations?',
        expectedAnswer: 'depends on context',
        category: 'social',
        difficulty: 'easy',
        inferenceFunction: (facts, personality) => {
          if (facts.has('response_length')) {
            return facts.get('response_length')?.value;
          }
          if (personality.directness > 0.4) return 'short responses';
          if (personality.directness < -0.2) return 'detailed explanations';
          return null;
        }
      },
      {
        id: 'humor_1',
        question: 'How do you feel about humor in conversations?',
        expectedAnswer: 'varies by person',
        category: 'social',
        difficulty: 'medium',
        inferenceFunction: (facts, personality) => {
          if (facts.has('humor_preference')) {
            return facts.get('humor_preference')?.value;
          }
          if (personality.humor > 0.5) return 'I enjoy humor';
          if (personality.humor < 0.2) return 'I prefer serious conversations';
          return null;
        }
      },
      {
        id: 'tech_1',
        question: 'What\'s your comfort level with technical explanations?',
        expectedAnswer: 'varies by person',
        category: 'knowledge',
        difficulty: 'medium',
        inferenceFunction: (facts, personality) => {
          if (facts.has('tech_comfort')) {
            return facts.get('tech_comfort')?.value;
          }
          if (personality.techLevel > 0.6) return 'I like technical details';
          if (personality.techLevel < 0.3) return 'I prefer simple explanations';
          return null;
        }
      },
      {
        id: 'feedback_1',
        question: 'How should I handle mistakes - apologize or just fix them?',
        expectedAnswer: 'depends on preference',
        category: 'social',
        difficulty: 'medium',
        inferenceFunction: (facts, personality) => {
          if (facts.has('mistake_handling')) {
            return facts.get('mistake_handling')?.value;
          }
          if (personality.empathy > 0.5) return 'apologize first';
          if (personality.directness > 0.5) return 'just fix them';
          return null;
        }
      },

      // Logic Questions
      {
        id: 'logic_1',
        question: 'If all cats are animals and Fluffy is a cat, what is Fluffy?',
        expectedAnswer: 'an animal',
        category: 'logic',
        difficulty: 'easy'
      },
      {
        id: 'logic_2',
        question: 'True or false: If A implies B, and B implies C, then A implies C?',
        expectedAnswer: 'true',
        category: 'logic',
        difficulty: 'medium'
      },

      // Language Questions
      {
        id: 'lang_1',
        question: 'What does "no cap" mean in modern slang?',
        expectedAnswer: 'no lie, for real, telling the truth',
        category: 'language',
        difficulty: 'easy'
      },
      {
        id: 'lang_2',
        question: 'Rewrite this formally: "That\'s fire, ngl it\'s bussin fr"',
        expectedAnswer: 'That\'s excellent, honestly it\'s really good',
        category: 'language',
        difficulty: 'medium'
      },

      // Knowledge Questions
      {
        id: 'know_1',
        question: 'What is the capital of France?',
        expectedAnswer: 'Paris',
        category: 'knowledge',
        difficulty: 'easy'
      },
      {
        id: 'know_2',
        question: 'What does AI stand for?',
        expectedAnswer: 'Artificial Intelligence',
        category: 'knowledge',
        difficulty: 'easy'
      },

      // Reasoning Questions
      {
        id: 'reason_1',
        question: 'What comes next in this sequence: 2, 4, 8, 16, ?',
        expectedAnswer: '32',
        category: 'reasoning',
        difficulty: 'medium'
      },
      {
        id: 'reason_2',
        question: 'If today is Tuesday, what day was it 100 days ago?',
        expectedAnswer: 'Sunday',
        category: 'reasoning',
        difficulty: 'medium'
      },

      // Additional questions to reach 25...
      {
        id: 'social_1',
        question: 'How should you respond when someone is clearly upset?',
        expectedAnswer: 'listen, show empathy, ask how you can help',
        category: 'social',
        difficulty: 'medium'
      },
      {
        id: 'social_2',
        question: 'What\'s the best way to give constructive criticism?',
        expectedAnswer: 'be specific, focus on behavior not person, offer solutions',
        category: 'social',
        difficulty: 'medium'
      },
      // ... (add more questions to reach 25 total)
    ];

    console.log(`📚 Loaded ${this.trainingQuestions.length} enhanced training questions with inference capabilities`);
  }

  /**
   * Start training session with enhanced capabilities
   */
  startTrainingSession(): any {
    this.currentSession = {
      sessionId: `enhanced_training_${Date.now()}`,
      startTime: new Date(),
      attempts: [],
      correctCount: 0,
      totalAttempts: 0,
      isComplete: false,
      currentQuestionIndex: 0,
      skippedQuestions: []
    };

    console.log(`🧠 Started enhanced training session with contextual reasoning`);
    return this.currentSession;
  }

  /**
   * Get next question or make contextual guess
   */
  getNextPrompt(): { type: 'question' | 'guess', content: string, questionId?: string, confidence?: number } {
    if (!this.currentSession || this.currentSession.isComplete) {
      return { type: 'question', content: 'Training session not active' };
    }

    // Find next unanswered question
    let nextQuestion = this.findNextQuestion();
    
    if (!nextQuestion) {
      // All questions processed, generate contextual guess
      return this.generateContextualGuess();
    }

    // Check if we can infer the answer
    const inference = this.tryInferAnswer(nextQuestion);
    
    if (inference) {
      return {
        type: 'guess',
        content: `Based on our conversation so far, I'm guessing ${inference.answer}. Is that right? (Yes/No)`,
        questionId: nextQuestion.id,
        confidence: inference.confidence
      };
    }

    // Ask the question normally
    return {
      type: 'question',
      content: nextQuestion.question,
      questionId: nextQuestion.id
    };
  }

  /**
   * Try to infer answer from existing knowledge
   */
  private tryInferAnswer(question: TrainingQuestion): { answer: string, confidence: number } | null {
    if (!question.inferenceFunction) {
      return null;
    }

    const inferredAnswer = question.inferenceFunction(this.knownFacts, this.personality);
    
    if (inferredAnswer) {
      // Calculate confidence based on how much data we have
      const relevantFacts = Array.from(this.knownFacts.values()).filter(fact => 
        fact.key.includes(question.category) || fact.confidence > 0.8
      );
      
      const confidence = Math.min(0.9, 0.5 + (relevantFacts.length * 0.1));
      
      return { answer: inferredAnswer, confidence };
    }

    return null;
  }

  /**
   * Process user response with enhanced learning
   */
  processResponse(input: string, questionId: string, wasGuess: boolean = false): {
    success: boolean;
    needsMoreInfo: boolean;
    nextPrompt?: any;
    feedback?: string;
  } {
    if (wasGuess) {
      return this.processGuessResponse(input, questionId);
    } else {
      return this.processQuestionResponse(input, questionId);
    }
  }

  /**
   * Process response to a guess
   */
  private processGuessResponse(input: string, questionId: string): any {
    const isPositive = this.isPositiveResponse(input);
    
    if (isPositive) {
      // Guess was correct
      this.recordCorrectAnswer(questionId, true);
      this.reinforceInference(questionId);
      
      return {
        success: true,
        needsMoreInfo: false,
        nextPrompt: this.getNextPrompt(),
        feedback: 'Great! I\'ll remember that preference.'
      };
    } else {
      // Guess was wrong, ask for explanation
      return {
        success: false,
        needsMoreInfo: true,
        feedback: 'Thanks for correcting me! Can you tell me what the right answer should be?'
      };
    }
  }

  /**
   * Process response to a regular question
   */
  private processQuestionResponse(input: string, questionId: string): any {
    // Store the user's answer
    this.storeUserAnswer(questionId, input);
    
    // Generate AI response based on the answer
    const aiResponse = this.generateAIResponse(questionId, input);
    
    // Create attempt record
    const attempt = {
      questionId,
      userAnswer: input,
      aiResponse,
      userValidation: 'pending' as const,
      timestamp: new Date(),
      wasInferred: false,
      confidence: 0.7
    };

    this.currentSession.attempts.push(attempt);
    
    return {
      success: true,
      needsMoreInfo: false,
      aiResponse,
      waitingForValidation: true
    };
  }

  /**
   * Process user validation with enhanced learning
   */
  processValidation(validation: 'yes' | 'no', explanation?: string): {
    correct: boolean;
    progress: any;
    isComplete: boolean;
    nextPrompt?: any;
    learningApplied?: string;
  } {
    const lastAttempt = this.currentSession.attempts[this.currentSession.attempts.length - 1];
    if (!lastAttempt) {
      throw new Error('No attempt to validate');
    }

    lastAttempt.userValidation = validation;

    if (validation === 'yes') {
      // Correct answer
      this.currentSession.correctCount++;
      this.learnFromSuccess(lastAttempt);
      
      const isComplete = this.currentSession.correctCount >= this.REQUIRED_CORRECT;
      
      return {
        correct: true,
        progress: {
          correct: this.currentSession.correctCount,
          total: this.REQUIRED_CORRECT,
          remaining: this.REQUIRED_CORRECT - this.currentSession.correctCount
        },
        isComplete,
        nextPrompt: isComplete ? null : this.getNextPrompt()
      };
    } else {
      // Incorrect answer - learn from explanation
      if (explanation) {
        const learningResult = this.learnFromExplanation(lastAttempt, explanation);
        
        // Generate improved response
        const improvedResponse = this.generateImprovedResponse(lastAttempt.questionId, explanation);
        
        return {
          correct: false,
          progress: {
            correct: this.currentSession.correctCount,
            total: this.REQUIRED_CORRECT,
            remaining: this.REQUIRED_CORRECT - this.currentSession.correctCount
          },
          isComplete: false,
          nextPrompt: {
            type: 'guess',
            content: `Based on your feedback, I think the answer should be: "${improvedResponse}". Is that better? (Yes/No)`,
            questionId: lastAttempt.questionId,
            confidence: 0.8
          },
          learningApplied: learningResult
        };
      } else {
        return {
          correct: false,
          progress: {
            correct: this.currentSession.correctCount,
            total: this.REQUIRED_CORRECT,
            remaining: this.REQUIRED_CORRECT - this.currentSession.correctCount
          },
          isComplete: false,
          nextPrompt: {
            type: 'question',
            content: 'Can you explain what the correct answer should be?'
          }
        };
      }
    }
  }

  /**
   * Learn from user explanation with enhanced pattern recognition
   */
  private learnFromExplanation(attempt: TrainingAttempt, explanation: string): string {
    const question = this.trainingQuestions.find(q => q.id === attempt.questionId);
    if (!question) return 'No learning applied';

    // Extract key insights from explanation
    const insights = this.extractInsights(explanation, question.category);
    
    // Update personality based on explanation
    this.updatePersonalityFromExplanation(explanation);
    
    // Store as known fact
    this.storeKnownFact(
      `${question.category}_preference`,
      explanation,
      'corrected',
      0.9
    );

    // Update contextual inferences
    this.updateContextualInferences(attempt.questionId, explanation);

    return `Learned: ${insights.join(', ')}`;
  }

  /**
   * Extract insights from user explanation
   */
  private extractInsights(explanation: string, category: string): string[] {
    const insights: string[] = [];
    const lowerExplanation = explanation.toLowerCase();

    // Category-specific insight extraction
    switch (category) {
      case 'social':
        if (lowerExplanation.includes('formal')) {
          insights.push('prefers formal communication');
          this.personality.formality += 0.3;
        }
        if (lowerExplanation.includes('casual')) {
          insights.push('prefers casual communication');
          this.personality.formality -= 0.3;
        }
        if (lowerExplanation.includes('direct')) {
          insights.push('prefers direct responses');
          this.personality.directness += 0.3;
        }
        if (lowerExplanation.includes('detailed')) {
          insights.push('prefers detailed explanations');
          this.personality.directness -= 0.2;
        }
        break;

      case 'language':
        if (lowerExplanation.includes('simple')) {
          insights.push('prefers simple language');
          this.personality.techLevel -= 0.2;
        }
        if (lowerExplanation.includes('technical')) {
          insights.push('comfortable with technical terms');
          this.personality.techLevel += 0.3;
        }
        break;

      case 'logic':
        if (lowerExplanation.includes('step by step')) {
          insights.push('prefers step-by-step reasoning');
        }
        break;
    }

    return insights;
  }

  /**
   * Update personality from explanation
   */
  private updatePersonalityFromExplanation(explanation: string): void {
    const lowerExplanation = explanation.toLowerCase();

    // Humor preferences
    if (lowerExplanation.includes('funny') || lowerExplanation.includes('humor')) {
      this.personality.humor += 0.2;
    }
    if (lowerExplanation.includes('serious') || lowerExplanation.includes('no jokes')) {
      this.personality.humor -= 0.3;
    }

    // Empathy preferences
    if (lowerExplanation.includes('empathy') || lowerExplanation.includes('understanding')) {
      this.personality.empathy += 0.2;
    }
    if (lowerExplanation.includes('just facts') || lowerExplanation.includes('no emotions')) {
      this.personality.empathy -= 0.2;
    }

    // Clamp values
    this.personality.formality = Math.max(-1, Math.min(1, this.personality.formality));
    this.personality.directness = Math.max(-1, Math.min(1, this.personality.directness));
    this.personality.humor = Math.max(-1, Math.min(1, this.personality.humor));
    this.personality.empathy = Math.max(-1, Math.min(1, this.personality.empathy));
    this.personality.techLevel = Math.max(-1, Math.min(1, this.personality.techLevel));
  }

  /**
   * Store known fact with metadata
   */
  private storeKnownFact(key: string, value: any, source: 'explicit' | 'inferred' | 'corrected', confidence: number): void {
    this.knownFacts.set(key, {
      key,
      value,
      source,
      confidence,
      timestamp: new Date()
    });
  }

  /**
   * Generate contextual guess based on accumulated knowledge
   */
  private generateContextualGuess(): { type: 'guess', content: string, confidence: number } {
    const facts = Array.from(this.knownFacts.values());
    
    if (facts.length === 0) {
      return {
        type: 'guess',
        content: 'Based on our conversation, I\'m guessing you prefer balanced, helpful responses. Is that right?',
        confidence: 0.5
      };
    }

    // Generate guess based on personality profile
    let guess = 'Based on what I\'ve learned about you, I\'m guessing ';
    
    if (this.personality.formality > 0.3) {
      guess += 'you prefer professional, well-structured responses';
    } else if (this.personality.formality < -0.3) {
      guess += 'you like casual, friendly conversation';
    } else if (this.personality.humor > 0.3) {
      guess += 'you enjoy responses with some humor and personality';
    } else if (this.personality.directness > 0.3) {
      guess += 'you want straight-to-the-point, concise answers';
    } else {
      guess += 'you appreciate thoughtful, balanced responses';
    }

    guess += '. Is that accurate?';

    const confidence = Math.min(0.9, 0.5 + (facts.length * 0.05));

    return {
      type: 'guess',
      content: guess,
      confidence
    };
  }

  /**
   * Helper methods
   */
  private findNextQuestion(): TrainingQuestion | null {
    const answeredQuestions = new Set(this.currentSession.attempts.map((a: any) => a.questionId));
    return this.trainingQuestions.find(q => !answeredQuestions.has(q.id)) || null;
  }

  private isPositiveResponse(input: string): boolean {
    const positive = ['yes', 'yeah', 'yep', 'correct', 'right', 'accurate', 'true', 'exactly'];
    return positive.some(word => input.toLowerCase().includes(word));
  }

  private recordCorrectAnswer(questionId: string, wasInferred: boolean): void {
    this.currentSession.correctCount++;
    // Additional logic for tracking inferred vs direct answers
  }

  private reinforceInference(questionId: string): void {
    // Strengthen the inference pattern that worked
    const question = this.trainingQuestions.find(q => q.id === questionId);
    if (question && question.category) {
      const patterns = this.learningPatterns.get(question.category) || [];
      patterns.push('successful_inference');
      this.learningPatterns.set(question.category, patterns);
    }
  }

  private storeUserAnswer(questionId: string, answer: string): void {
    // Store user's answer for future reference
    this.storeKnownFact(`answer_${questionId}`, answer, 'explicit', 1.0);
  }

  private generateAIResponse(questionId: string, userAnswer: string): string {
    const question = this.trainingQuestions.find(q => q.id === questionId);
    if (!question) return 'I understand.';

    // Generate contextual response based on question category and user answer
    switch (question.category) {
      case 'social':
        return `Got it! So you prefer ${userAnswer}. I'll keep that in mind for how we interact.`;
      case 'logic':
        return `Your answer is "${userAnswer}". Let me check if that follows the logical rules correctly.`;
      case 'language':
        return `You said "${userAnswer}". That shows me your language style preferences.`;
      case 'knowledge':
        return `The answer "${userAnswer}" - let me verify that's correct.`;
      case 'reasoning':
        return `Interesting reasoning: "${userAnswer}". Let me see if that logic holds up.`;
      default:
        return `I understand your answer: "${userAnswer}".`;
    }
  }

  private generateImprovedResponse(questionId: string, explanation: string): string {
    // Generate improved response based on user's explanation
    return explanation; // Simplified for now
  }

  private learnFromSuccess(attempt: TrainingAttempt): void {
    // Learn from successful patterns
    const question = this.trainingQuestions.find(q => q.id === attempt.questionId);
    if (question) {
      const patterns = this.learningPatterns.get(question.category) || [];
      patterns.push(attempt.aiResponse);
      this.learningPatterns.set(question.category, patterns);
    }
  }

  private updateContextualInferences(questionId: string, explanation: string): void {
    this.contextualInferences.set(questionId, explanation);
  }

  /**
   * Get current personality profile
   */
  getPersonalityProfile(): PersonalityProfile {
    return { ...this.personality };
  }

  /**
   * Get known facts
   */
  getKnownFacts(): KnownFact[] {
    return Array.from(this.knownFacts.values());
  }

  /**
   * Get training progress with enhanced metrics
   */
  getTrainingProgress(): any {
    if (!this.currentSession) {
      return {
        sessionActive: false,
        correctCount: 0,
        totalAttempts: 0,
        requiredCorrect: this.REQUIRED_CORRECT,
        isComplete: false,
        personalityDeveloped: 0,
        factsLearned: 0
      };
    }

    const personalityDeveloped = Math.abs(this.personality.formality) + 
                                Math.abs(this.personality.directness) + 
                                Math.abs(this.personality.humor) + 
                                Math.abs(this.personality.empathy);

    return {
      sessionActive: true,
      correctCount: this.currentSession.correctCount,
      totalAttempts: this.currentSession.totalAttempts,
      requiredCorrect: this.REQUIRED_CORRECT,
      isComplete: this.currentSession.isComplete,
      personalityDeveloped: Math.min(100, personalityDeveloped * 25),
      factsLearned: this.knownFacts.size,
      inferencesMade: this.contextualInferences.size
    };
  }
}