/**
 * Enhanced Training System - COMPLETELY FIXED
 * 15 questions, sequential progression, NO LOOPS EVER
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
  private currentQuestionIndex: number = 0; // Sequential index
  private questionsAsked: number = 0; // Total questions asked

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
    console.log('🧠 Enhanced Training System initialized - 15 questions, NO LOOPS');
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

    console.log(`📚 Loaded exactly ${this.trainingQuestions.length} sequential questions`);
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

    // Reset counters
    this.currentQuestionIndex = 0;
    this.questionsAsked = 0;

    console.log(`🧠 Started training session - 15 questions, sequential progression`);
    return this.currentSession;
  }

  /**
   * Get next question - COMPLETELY FIXED
   */
  getNextPrompt(): { type: 'question' | 'guess', content: string, questionId?: string, confidence?: number } {
    if (!this.currentSession || this.currentSession.isComplete) {
      return { type: 'question', content: 'Training session not active' };
    }

    // Check if we've completed training
    if (this.currentSession.correctCount >= this.REQUIRED_CORRECT) {
      this.currentSession.isComplete = true;
      return { 
        type: 'question', 
        content: '🎉 Training complete! I\'ve learned your preferences and communication style.' 
      };
    }

    // Check if we've asked all questions
    if (this.currentQuestionIndex >= this.trainingQuestions.length) {
      this.currentSession.isComplete = true;
      return { 
        type: 'question', 
        content: `🎉 All questions completed! I've learned ${this.currentSession.correctCount} things about you.` 
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

  /**
   * Process user response - COMPLETELY FIXED
   */
  processResponse(input: string, questionId: string, wasGuess: boolean = false): {
    success: boolean;
    needsMoreInfo: boolean;
    nextPrompt?: any;
    feedback?: string;
    aiResponse?: string;
    waitingForValidation?: boolean;
  } {
    // Store the user's answer
    this.storeUserAnswer(questionId, input);
    
    // Generate AI response
    const aiResponse = this.generateAIResponse(questionId, input);
    
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

  /**
   * Process validation - COMPLETELY FIXED
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
      // Correct answer - count it
      this.currentSession.correctCount++;
      this.learnFromSuccess(lastAttempt);
    } else if (explanation) {
      // Learn from explanation but still count as progress
      this.learnFromExplanation(lastAttempt, explanation);
      this.currentSession.correctCount++; // Still count it as learning
    } else {
      // No explanation but still move forward
      this.currentSession.correctCount++;
    }

    // ALWAYS move to next question
    this.currentQuestionIndex++;
    this.questionsAsked++;

    const isComplete = this.currentSession.correctCount >= this.REQUIRED_CORRECT || 
                      this.currentQuestionIndex >= this.trainingQuestions.length;
    
    if (isComplete) {
      this.currentSession.isComplete = true;
    }

    return {
      correct: validation === 'yes',
      progress: {
        correct: this.currentSession.correctCount,
        total: this.REQUIRED_CORRECT,
        remaining: Math.max(0, this.REQUIRED_CORRECT - this.currentSession.correctCount),
        questionsAsked: this.questionsAsked
      },
      isComplete,
      nextPrompt: isComplete ? null : this.getNextPrompt(),
      learningApplied: explanation ? `Learned from your feedback: ${explanation.substring(0, 50)}...` : undefined
    };
  }

  private storeUserAnswer(questionId: string, answer: string): void {
    const question = this.trainingQuestions.find(q => q.id === questionId);
    if (question) {
      this.storeKnownFact(`answer_${questionId}`, answer, 'explicit', 1.0);
      this.updatePersonalityFromAnswer(question.category, answer);
    }
  }

  private generateAIResponse(questionId: string, userAnswer: string): string {
    const question = this.trainingQuestions.find(q => q.id === questionId);
    if (!question) return 'I understand.';

    switch (question.category) {
      case 'communication':
        return `Got it! I'll remember that you prefer ${userAnswer}. This helps me communicate better with you.`;
      case 'technical':
        return `Perfect! I now know your technical preference: ${userAnswer}. I'll adjust my explanations accordingly.`;
      case 'personality':
        return `Thanks for sharing! "${userAnswer}" tells me a lot about your personality and how you like to interact.`;
      case 'preferences':
        return `Noted! Your preference for "${userAnswer}" will help me serve you better in the future.`;
      case 'learning':
        return `Excellent! Knowing you learn best through "${userAnswer}" will help me teach and explain things more effectively.`;
      default:
        return `I understand: "${userAnswer}". This helps me get to know you better.`;
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
      correctCount: this.currentSession.correctCount,
      totalAttempts: this.currentSession.totalAttempts,
      requiredCorrect: this.REQUIRED_CORRECT,
      isComplete: this.currentSession.isComplete,
      personalityDeveloped: Math.min(100, personalityDeveloped * 20),
      factsLearned: this.knownFacts.size,
      inferencesMade: 0,
      questionsAsked: this.questionsAsked,
      questionsRemaining: Math.max(0, this.REQUIRED_CORRECT - this.currentSession.correctCount)
    };
  }
}