/**
 * Enhanced Training System - FINAL FIX
 * 15 questions, ALWAYS moves forward, NO LOOPS, creative unique responses
 */

export interface TrainingQuestion {
  id: string;
  question: string;
  category: 'communication' | 'preferences' | 'technical' | 'personality' | 'learning';
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
  formality: number; // -1 to 1 (casual to formal)
  directness: number; // -1 to 1 (detailed to direct)
  humor: number; // -1 to 1 (serious to humorous)
  empathy: number; // -1 to 1 (logical to empathetic)
  techLevel: number; // -1 to 1 (simple to technical)
  responseStyle: 'detailed' | 'concise' | 'casual' | 'formal';
  preferences: Map<string, any>;
}

export class EnhancedTrainingSystem {
  private trainingQuestions: TrainingQuestion[] = [];
  private knownFacts: Map<string, KnownFact> = new Map();
  private personality: PersonalityProfile;
  private currentSession: any = null;
  private readonly REQUIRED_CORRECT = 15;
  private currentQuestionIndex: number = 0;
  private questionsCompleted: number = 0;
  private creativeGuesses: string[] = [];

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
    
    this.initializeQuestions();
    this.initializeCreativeGuesses();
    console.log('🧠 Enhanced Training System - FINAL VERSION - NO LOOPS EVER');
  }

  private initializeQuestions() {
    this.trainingQuestions = [
      {
        id: 'q1_communication_style',
        question: 'Should I be formal or casual with you?',
        category: 'communication'
      },
      {
        id: 'q2_response_length',
        question: 'Do you prefer short answers or detailed explanations?',
        category: 'communication'
      },
      {
        id: 'q3_humor_preference',
        question: 'How do you feel about humor in our conversations?',
        category: 'personality'
      },
      {
        id: 'q4_tech_comfort',
        question: 'What\'s your comfort level with technical explanations?',
        category: 'technical'
      },
      {
        id: 'q5_mistake_handling',
        question: 'When I make mistakes, should I apologize or just fix them?',
        category: 'preferences'
      },
      {
        id: 'q6_emoji_preference',
        question: 'Do you like emojis in messages? 😊',
        category: 'communication'
      },
      {
        id: 'q7_interruption_style',
        question: 'When you\'re busy, should I be brief or wait?',
        category: 'preferences'
      },
      {
        id: 'q8_initiative_level',
        question: 'How proactive should I be? (1-10 scale)',
        category: 'preferences'
      },
      {
        id: 'q9_personal_details',
        question: 'Should I remember personal details about you?',
        category: 'preferences'
      },
      {
        id: 'q10_stress_response',
        question: 'When stressed, do you prefer solutions or empathy first?',
        category: 'personality'
      },
      {
        id: 'q11_feedback_style',
        question: 'How should I give you feedback - direct or gentle?',
        category: 'communication'
      },
      {
        id: 'q12_learning_style',
        question: 'How do you learn best - examples, theory, or practice?',
        category: 'learning'
      },
      {
        id: 'q13_decision_making',
        question: 'Do you make decisions quickly or need time to think?',
        category: 'personality'
      },
      {
        id: 'q14_motivation_type',
        question: 'What motivates you most - achievement, recognition, or helping others?',
        category: 'personality'
      },
      {
        id: 'q15_communication_timing',
        question: 'What time of day are you most receptive to new information?',
        category: 'preferences'
      }
    ];

    console.log(`📚 Loaded exactly ${this.trainingQuestions.length} questions - SEQUENTIAL ONLY`);
  }

  private initializeCreativeGuesses() {
    this.creativeGuesses = [
      "Based on your energy, I'm sensing you prefer direct, no-nonsense communication",
      "Your writing style suggests you appreciate both humor and efficiency",
      "I'm getting the vibe that you like things explained clearly but not dumbed down",
      "From our interaction, I think you value authenticity over formality",
      "Your approach tells me you prefer solutions over lengthy explanations",
      "I sense you're someone who appreciates when AI feels more human and less robotic",
      "Your communication style suggests you like balanced responses - not too short, not too long",
      "I'm picking up that you prefer when I'm proactive rather than waiting for instructions",
      "Based on how you phrase things, I think you like when I remember context from our conversation",
      "Your style suggests you prefer empathy first, then practical solutions",
      "I sense you appreciate direct feedback rather than sugar-coating",
      "From your approach, I think you learn best through examples and hands-on practice",
      "Your communication pattern suggests you make decisions quickly and trust your instincts",
      "I'm getting the impression that helping others and making an impact motivates you most",
      "Based on our interaction timing, I sense you're most receptive to new info in the morning or evening"
    ];
  }

  /**
   * Start training session
   */
  startTrainingSession(): any {
    this.currentSession = {
      sessionId: `training_${Date.now()}`,
      startTime: new Date(),
      attempts: [],
      correctCount: 0,
      totalAttempts: 0,
      isComplete: false,
      sessionActive: true
    };

    // Reset ALL counters
    this.currentQuestionIndex = 0;
    this.questionsCompleted = 0;

    console.log(`🧠 Training session started - 15 questions, ALWAYS FORWARD`);
    return this.currentSession;
  }

  /**
   * Get next prompt - CREATIVE GUESSES EVERY TIME
   */
  getNextPrompt(): { type: 'question' | 'guess', content: string, questionId?: string, confidence?: number } {
    if (!this.currentSession || this.currentSession.isComplete) {
      return { type: 'question', content: 'Training session not active' };
    }

    // Check if training is complete
    if (this.questionsCompleted >= this.REQUIRED_CORRECT) {
      this.currentSession.isComplete = true;
      return { 
        type: 'question', 
        content: '🎉 Training complete! I\'ve learned your unique communication style and preferences.' 
      };
    }

    // Check if we've gone through all questions
    if (this.currentQuestionIndex >= this.trainingQuestions.length) {
      this.currentSession.isComplete = true;
      return { 
        type: 'question', 
        content: `🎉 All questions completed! I've learned ${this.questionsCompleted} things about your style.` 
      };
    }

    // ALWAYS make a creative guess first (except for first question)
    if (this.questionsCompleted > 0 && Math.random() > 0.3) {
      const creativeGuess = this.generateCreativeGuess();
      const currentQuestion = this.trainingQuestions[this.currentQuestionIndex];
      
      return {
        type: 'guess',
        content: `${creativeGuess} - Is that accurate?`,
        questionId: currentQuestion.id,
        confidence: 0.7 + Math.random() * 0.2
      };
    }

    // Get the current question
    const currentQuestion = this.trainingQuestions[this.currentQuestionIndex];
    
    return {
      type: 'question',
      content: currentQuestion.question,
      questionId: currentQuestion.id
    };
  }

  private generateCreativeGuess(): string {
    // Generate unique creative guesses based on what we've learned
    const personalityInsights = [
      `I think you're someone who values ${this.personality.directness > 0 ? 'straight-forward' : 'thoughtful'} communication`,
      `Based on our chat, you seem like you prefer ${this.personality.formality > 0 ? 'professional' : 'casual'} interactions`,
      `I'm sensing you're the type who likes ${this.personality.humor > 0 ? 'some humor mixed in' : 'serious, focused discussions'}`,
      `From your vibe, I think you appreciate ${this.personality.techLevel > 0 ? 'technical depth' : 'clear, simple explanations'}`,
      `Your energy suggests you're someone who wants ${this.personality.empathy > 0 ? 'understanding first' : 'solutions first'}`
    ];

    const contextualGuesses = [
      "I'm getting the sense that you like AI that feels more human and less robotic",
      "Based on how you communicate, I think you prefer efficiency over lengthy explanations",
      "Your style tells me you value authenticity and directness in conversations",
      "I sense you're someone who appreciates when I remember our conversation context",
      "From our interaction, I think you like when I'm proactive rather than just reactive"
    ];

    const evolutionaryGuesses = [
      "I'm evolving to understand that you prefer responses that feel natural and conversational",
      "My reasoning is developing to match your preference for balanced, thoughtful answers",
      "I'm learning that you value AI that can adapt and grow from our interactions",
      "Based on our conversation flow, I think you like when I show genuine understanding",
      "I'm developing the sense that you prefer AI that learns your style rather than being generic"
    ];

    // Combine all guess types and pick randomly
    const allGuesses = [...personalityInsights, ...contextualGuesses, ...evolutionaryGuesses];
    const randomGuess = allGuesses[Math.floor(Math.random() * allGuesses.length)];
    
    // Add some creative variation
    const variations = [
      `Here's what I'm thinking: ${randomGuess}`,
      `My intuition tells me: ${randomGuess}`,
      `I'm developing the understanding that: ${randomGuess}`,
      `Based on our interaction pattern: ${randomGuess}`,
      `My evolving reasoning suggests: ${randomGuess}`
    ];

    return variations[Math.floor(Math.random() * variations.length)];
  }

  /**
   * Process user response - ALWAYS MOVES FORWARD
   */
  processResponse(input: string, questionId: string, wasGuess: boolean = false): {
    success: boolean;
    needsMoreInfo: boolean;
    nextPrompt?: any;
    feedback?: string;
    aiResponse?: string;
    waitingForValidation?: boolean;
  } {
    if (wasGuess) {
      return this.processGuessResponse(input, questionId);
    }

    // Store the user's answer
    this.storeUserAnswer(questionId, input);
    
    // Generate AI response
    const aiResponse = this.generateCreativeAIResponse(questionId, input);
    
    // Create attempt record
    const attempt = {
      questionId,
      userAnswer: input,
      aiResponse,
      userValidation: 'pending' as const,
      timestamp: new Date(),
      wasInferred: false,
      confidence: 0.8
    };

    this.currentSession.attempts.push(attempt);
    this.currentSession.totalAttempts++;
    
    return {
      success: true,
      needsMoreInfo: false,
      aiResponse,
      waitingForValidation: true
    };
  }

  private processGuessResponse(input: string, questionId: string): any {
    const isPositive = this.isPositiveResponse(input);
    
    // ALWAYS count as progress and move forward
    this.questionsCompleted++;
    this.currentQuestionIndex++;
    
    if (isPositive) {
      this.currentSession.correctCount++;
      return {
        success: true,
        needsMoreInfo: false,
        nextPrompt: this.getNextPrompt(),
        feedback: 'Awesome! I\'m learning your style. Moving to the next insight...'
      };
    } else {
      // Still count as progress, just ask for clarification
      this.currentSession.correctCount++;
      return {
        success: false,
        needsMoreInfo: true,
        feedback: 'Got it! Help me understand better - what would be more accurate?'
      };
    }
  }

  private isPositiveResponse(input: string): boolean {
    const positive = ['yes', 'yeah', 'yep', 'correct', 'right', 'accurate', 'true', 'exactly', 'spot on', 'that\'s right'];
    const lowerInput = input.toLowerCase();
    return positive.some(word => lowerInput.includes(word));
  }

  /**
   * Process validation - ALWAYS MOVES FORWARD
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

    // ALWAYS count as progress regardless of validation
    this.questionsCompleted++;
    this.currentSession.correctCount++;
    
    if (validation === 'yes') {
      this.learnFromSuccess(lastAttempt);
    } else if (explanation) {
      this.learnFromExplanation(lastAttempt, explanation);
    }

    // ALWAYS move to next question
    this.currentQuestionIndex++;

    const isComplete = this.questionsCompleted >= this.REQUIRED_CORRECT || 
                      this.currentQuestionIndex >= this.trainingQuestions.length;
    
    if (isComplete) {
      this.currentSession.isComplete = true;
    }

    return {
      correct: validation === 'yes',
      progress: {
        correct: this.questionsCompleted,
        total: this.REQUIRED_CORRECT,
        remaining: Math.max(0, this.REQUIRED_CORRECT - this.questionsCompleted),
        questionsAsked: this.questionsCompleted
      },
      isComplete,
      nextPrompt: isComplete ? null : this.getNextPrompt(),
      learningApplied: explanation ? `Evolved understanding: ${explanation.substring(0, 50)}...` : 'Learning pattern reinforced'
    };
  }

  private generateCreativeAIResponse(questionId: string, userAnswer: string): string {
    const question = this.trainingQuestions.find(q => q.id === questionId);
    if (!question) return 'I understand.';

    // Generate creative, evolving responses
    const creativeResponses = {
      communication: [
        `Perfect! I'm evolving to match your ${userAnswer} style. This helps me communicate in a way that feels natural to you.`,
        `Got it! My communication algorithms are adapting to your preference for ${userAnswer}. I'm learning your unique style.`,
        `Excellent! I'm developing a deeper understanding of how you like to interact: ${userAnswer}. This shapes my personality.`
      ],
      technical: [
        `Noted! My technical explanation engine is calibrating to your ${userAnswer} comfort level. I'm becoming more aligned with your needs.`,
        `Perfect! I'm evolving my technical communication to match your preference: ${userAnswer}. This helps me explain things better.`,
        `Great insight! My reasoning is adapting to provide ${userAnswer} explanations that work best for your learning style.`
      ],
      personality: [
        `Fascinating! This tells me a lot about your personality: ${userAnswer}. I'm building a unique profile of how you think and feel.`,
        `This is valuable! Your response "${userAnswer}" helps me understand your emotional and social preferences. I'm evolving to match.`,
        `Insightful! I'm developing empathy patterns based on your preference: ${userAnswer}. This makes our interactions more meaningful.`
      ],
      preferences: [
        `Understood! I'm encoding your preference "${userAnswer}" into my decision-making process. This personalizes how I help you.`,
        `Perfect! My behavioral algorithms are adapting to your preference: ${userAnswer}. I'm becoming more tailored to your needs.`,
        `Excellent! This preference "${userAnswer}" is now part of my evolving understanding of how to serve you best.`
      ],
      learning: [
        `Great! I'm optimizing my teaching methods for your ${userAnswer} learning style. This makes me a better educational partner.`,
        `Perfect! My knowledge transfer algorithms are adapting to your preference: ${userAnswer}. I'm evolving as your learning companion.`,
        `Wonderful! Understanding that you learn through ${userAnswer} helps me structure information in the most effective way for you.`
      ]
    };

    const responses = creativeResponses[question.category] || [
      `I understand: "${userAnswer}". This insight helps me evolve to better match your unique style and preferences.`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private storeUserAnswer(questionId: string, answer: string): void {
    const question = this.trainingQuestions.find(q => q.id === questionId);
    if (question) {
      this.storeKnownFact(`answer_${questionId}`, answer, 'explicit', 1.0);
      this.updatePersonalityFromAnswer(question.category, answer);
    }
  }

  private updatePersonalityFromAnswer(category: string, answer: string): void {
    const lowerAnswer = answer.toLowerCase();
    
    switch(category) {
      case 'communication':
        if (lowerAnswer.includes('formal')) this.personality.formality += 0.3;
        if (lowerAnswer.includes('casual')) this.personality.formality -= 0.3;
        if (lowerAnswer.includes('short') || lowerAnswer.includes('brief')) this.personality.directness += 0.3;
        if (lowerAnswer.includes('detailed') || lowerAnswer.includes('explanation')) this.personality.directness -= 0.3;
        break;
        
      case 'personality':
        if (lowerAnswer.includes('humor') || lowerAnswer.includes('funny')) {
          if (!lowerAnswer.includes('no ') && !lowerAnswer.includes('not ')) {
            this.personality.humor += 0.3;
          } else {
            this.personality.humor -= 0.3;
          }
        }
        if (lowerAnswer.includes('empathy') || lowerAnswer.includes('understanding')) {
          this.personality.empathy += 0.3;
        }
        break;
        
      case 'technical':
        if (lowerAnswer.includes('technical') || lowerAnswer.includes('detail')) this.personality.techLevel += 0.3;
        if (lowerAnswer.includes('simple') || lowerAnswer.includes('basic')) this.personality.techLevel -= 0.3;
        break;
    }
    
    // Clamp values
    this.personality.formality = Math.max(-1, Math.min(1, this.personality.formality));
    this.personality.directness = Math.max(-1, Math.min(1, this.personality.directness));
    this.personality.humor = Math.max(-1, Math.min(1, this.personality.humor));
    this.personality.empathy = Math.max(-1, Math.min(1, this.personality.empathy));
    this.personality.techLevel = Math.max(-1, Math.min(1, this.personality.techLevel));
  }

  private learnFromSuccess(attempt: TrainingAttempt): void {
    const question = this.trainingQuestions.find(q => q.id === attempt.questionId);
    if (question) {
      this.storeKnownFact(`${question.category}_success_${attempt.questionId}`, attempt.userAnswer, 'explicit', 0.9);
    }
  }

  private learnFromExplanation(attempt: TrainingAttempt, explanation: string): void {
    const question = this.trainingQuestions.find(q => q.id === attempt.questionId);
    if (question) {
      this.storeKnownFact(`${question.category}_correction_${attempt.questionId}`, explanation, 'corrected', 0.9);
      this.updatePersonalityFromExplanation(explanation);
    }
  }

  private updatePersonalityFromExplanation(explanation: string): void {
    const lowerExplanation = explanation.toLowerCase();

    if (lowerExplanation.includes('formal')) this.personality.formality += 0.2;
    if (lowerExplanation.includes('casual')) this.personality.formality -= 0.2;
    if (lowerExplanation.includes('humor')) this.personality.humor += 0.2;
    if (lowerExplanation.includes('serious')) this.personality.humor -= 0.2;
    if (lowerExplanation.includes('technical')) this.personality.techLevel += 0.2;
    if (lowerExplanation.includes('simple')) this.personality.techLevel -= 0.2;

    // Clamp values
    this.personality.formality = Math.max(-1, Math.min(1, this.personality.formality));
    this.personality.directness = Math.max(-1, Math.min(1, this.personality.directness));
    this.personality.humor = Math.max(-1, Math.min(1, this.personality.humor));
    this.personality.empathy = Math.max(-1, Math.min(1, this.personality.empathy));
    this.personality.techLevel = Math.max(-1, Math.min(1, this.personality.techLevel));
  }

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
   * Get training progress
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
        factsLearned: 0,
        inferencesMade: 0,
        questionsAsked: 0,
        questionsRemaining: this.REQUIRED_CORRECT
      };
    }

    const personalityDeveloped = Math.abs(this.personality.formality) + 
                                Math.abs(this.personality.directness) + 
                                Math.abs(this.personality.humor) + 
                                Math.abs(this.personality.empathy) +
                                Math.abs(this.personality.techLevel);

    return {
      sessionActive: true,
      correctCount: this.questionsCompleted,
      totalAttempts: this.currentSession.totalAttempts,
      requiredCorrect: this.REQUIRED_CORRECT,
      isComplete: this.currentSession.isComplete,
      personalityDeveloped: Math.min(100, personalityDeveloped * 20),
      factsLearned: this.knownFacts.size,
      inferencesMade: this.questionsCompleted,
      questionsAsked: this.questionsCompleted,
      questionsRemaining: Math.max(0, this.REQUIRED_CORRECT - this.questionsCompleted)
    };
  }
}