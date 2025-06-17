/**
 * Enhanced Training System with Contextual Reasoning
 * Implements better "no" response handling, contextual guessing, and redundancy checking
 */

export interface TrainingQuestion {
  id: string;
  question: string;
  category: 'communication' | 'preferences' | 'technical' | 'personality' | 'learning';
  inferenceFunction?: (knownFacts: Map<string, KnownFact>, personality: PersonalityProfile) => string | null;
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
  private readonly REQUIRED_CORRECT = 25;
  private contextualInferences: Map<string, string> = new Map();
  private askedQuestions: Set<string> = new Set(); // Track asked questions
  private currentQuestionIndex: number = 0; // Track current position

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
        category: 'communication',
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
        category: 'communication',
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
        category: 'personality',
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
        category: 'technical',
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
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('mistake_handling')) {
            return facts.get('mistake_handling')?.value;
          }
          if (personality.empathy > 0.5) return 'apologize first';
          if (personality.directness > 0.5) return 'just fix them';
          return null;
        }
      },
      {
        id: 'emoji_1',
        question: 'Do you prefer emojis in messages? 😊',
        category: 'communication',
        inferenceFunction: (facts, personality) => {
          if (facts.has('emoji_preference')) {
            return facts.get('emoji_preference')?.value;
          }
          if (personality.formality < -0.4 && personality.humor > 0.3) return 'yes, I like emojis';
          if (personality.formality > 0.4) return 'no, I prefer text without emojis';
          return null;
        }
      },
      {
        id: 'interrupt_1',
        question: 'When you\'re busy, should I summarize or wait?',
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('interruption_preference')) {
            return facts.get('interruption_preference')?.value;
          }
          if (personality.directness > 0.4) return 'summarize briefly';
          return null;
        }
      },
      {
        id: 'initiative_1',
        question: 'How much initiative should I take? (1-10)',
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('initiative_level')) {
            return facts.get('initiative_level')?.value;
          }
          if (personality.directness > 0.6) return 'high (8-10)';
          if (personality.directness < -0.2) return 'low (1-3)';
          return null;
        }
      },
      {
        id: 'personal_1',
        question: 'Should I remember personal details?',
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('remember_details')) {
            return facts.get('remember_details')?.value;
          }
          return null;
        }
      },
      {
        id: 'stress_1',
        question: 'When stressed, do you prefer solutions or empathy?',
        category: 'personality',
        inferenceFunction: (facts, personality) => {
          if (facts.has('stress_response')) {
            return facts.get('stress_response')?.value;
          }
          if (personality.empathy > 0.5) return 'empathy first, then solutions';
          if (personality.directness > 0.5) return 'solutions first';
          return null;
        }
      },
      {
        id: 'sarcasm_1',
        question: 'How should I handle sarcasm? Mirror/Ignore/Explain',
        category: 'personality',
        inferenceFunction: (facts, personality) => {
          if (facts.has('sarcasm_handling')) {
            return facts.get('sarcasm_handling')?.value;
          }
          if (personality.humor > 0.6) return 'mirror it';
          if (personality.humor < 0.2) return 'ignore it';
          return null;
        }
      },
      {
        id: 'privacy_1',
        question: 'What\'s your privacy red line?',
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('privacy_preference')) {
            return facts.get('privacy_preference')?.value;
          }
          return null;
        }
      },
      {
        id: 'mood_1',
        question: 'Should I adapt to your mood changes?',
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('mood_adaptation')) {
            return facts.get('mood_adaptation')?.value;
          }
          if (personality.empathy > 0.4) return 'yes, please adapt';
          return null;
        }
      },
      {
        id: 'annoying_1',
        question: 'What makes an assistant "annoying" to you?',
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('annoying_traits')) {
            return facts.get('annoying_traits')?.value;
          }
          return null;
        }
      },
      {
        id: 'phrase_1',
        question: 'What phrase do you overuse?',
        category: 'personality',
        inferenceFunction: (facts, personality) => {
          if (facts.has('overused_phrase')) {
            return facts.get('overused_phrase')?.value;
          }
          return null;
        }
      },
      {
        id: 'understood_1',
        question: 'What makes you feel truly understood?',
        category: 'personality',
        inferenceFunction: (facts, personality) => {
          if (facts.has('understanding_preference')) {
            return facts.get('understanding_preference')?.value;
          }
          return null;
        }
      },
      {
        id: 'missed_1',
        question: 'What should I know about you that others miss?',
        category: 'personality',
        inferenceFunction: (facts, personality) => {
          if (facts.has('missed_trait')) {
            return facts.get('missed_trait')?.value;
          }
          return null;
        }
      },
      {
        id: 'habit_1',
        question: 'What habit do you wish I could help change?',
        category: 'learning',
        inferenceFunction: (facts, personality) => {
          if (facts.has('habit_change')) {
            return facts.get('habit_change')?.value;
          }
          return null;
        }
      },
      {
        id: 'interrupt_2',
        question: 'Describe your ideal interruption:',
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('ideal_interruption')) {
            return facts.get('ideal_interruption')?.value;
          }
          if (facts.has('interruption_preference')) {
            const pref = facts.get('interruption_preference')?.value;
            if (pref.includes('summarize')) return 'brief summary of important information';
            if (pref.includes('wait')) return 'no interruptions unless urgent';
          }
          return null;
        }
      },
      {
        id: 'innovation_1',
        question: 'What innovation would genuinely surprise you?',
        category: 'learning',
        inferenceFunction: (facts, personality) => {
          if (facts.has('innovation_interest')) {
            return facts.get('innovation_interest')?.value;
          }
          return null;
        }
      },
      {
        id: 'surprise_1',
        question: 'What would make you say "Whoa - how did you know?!"',
        category: 'learning',
        inferenceFunction: (facts, personality) => {
          if (facts.has('surprise_factor')) {
            return facts.get('surprise_factor')?.value;
          }
          return null;
        }
      },
      {
        id: 'correction_1',
        question: 'Should I correct your grammar mistakes?',
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('grammar_correction')) {
            return facts.get('grammar_correction')?.value;
          }
          if (personality.formality > 0.5) return 'yes, please correct my grammar';
          if (personality.formality < -0.3) return 'no, only if it changes the meaning';
          return null;
        }
      },
      {
        id: 'pop_culture_1',
        question: 'Do you want pop-culture references?',
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('pop_culture_preference')) {
            return facts.get('pop_culture_preference')?.value;
          }
          if (personality.humor > 0.4 && personality.formality < 0.2) return 'yes, I enjoy pop culture references';
          if (personality.formality > 0.5) return 'no, keep it professional';
          return null;
        }
      },
      {
        id: 'fine_1',
        question: 'When you say "I\'m fine", what does it usually mean?',
        category: 'personality',
        inferenceFunction: (facts, personality) => {
          if (facts.has('fine_meaning')) {
            return facts.get('fine_meaning')?.value;
          }
          return null;
        }
      },
      {
        id: 'criticism_1',
        question: 'How do you prefer to receive criticism?',
        category: 'preferences',
        inferenceFunction: (facts, personality) => {
          if (facts.has('criticism_preference')) {
            return facts.get('criticism_preference')?.value;
          }
          if (personality.directness > 0.5) return 'directly and to the point';
          if (personality.empathy > 0.5) return 'gently with positive reinforcement';
          return null;
        }
      },
      {
        id: 'learning_style_1',
        question: 'How do you learn best - examples, theory, or practice?',
        category: 'learning'
      },
      {
        id: 'decision_making_1',
        question: 'Do you make decisions quickly or need time to think?',
        category: 'personality'
      },
      {
        id: 'conflict_1',
        question: 'How do you handle disagreements?',
        category: 'personality'
      },
      {
        id: 'motivation_1',
        question: 'What motivates you most - achievement, recognition, or helping others?',
        category: 'personality'
      },
      {
        id: 'communication_timing_1',
        question: 'What time of day are you most receptive to new information?',
        category: 'preferences'
      },
      {
        id: 'complexity_1',
        question: 'Do you prefer step-by-step instructions or high-level overviews?',
        category: 'communication'
      }
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

    // Reset tracking
    this.askedQuestions.clear();
    this.currentQuestionIndex = 0;

    console.log(`🧠 Started enhanced training session with contextual reasoning`);
    return this.currentSession;
  }

  /**
   * Get next question or make contextual guess - FIXED VERSION
   */
  getNextPrompt(): { type: 'question' | 'guess', content: string, questionId?: string, confidence?: number } {
    if (!this.currentSession || this.currentSession.isComplete) {
      return { type: 'question', content: 'Training session not active' };
    }

    // Check if we've completed enough questions
    if (this.currentSession.correctCount >= this.REQUIRED_CORRECT) {
      this.currentSession.isComplete = true;
      return { type: 'question', content: 'Training complete! 🎉' };
    }

    // Find next unanswered question using sequential approach
    let nextQuestion = this.findNextSequentialQuestion();
    
    if (!nextQuestion) {
      // If we've gone through all questions but haven't reached 25 correct, 
      // generate a contextual summary question
      return this.generateFinalQuestion();
    }

    // Mark this question as asked
    this.askedQuestions.add(nextQuestion.id);

    // Check if we can infer the answer
    const inference = this.tryInferAnswer(nextQuestion);
    
    if (inference && inference.confidence > 0.7) {
      return {
        type: 'guess',
        content: `Based on our conversation so far, I'm guessing: ${inference.answer}. Is that right? (Yes/No)`,
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
   * Find next question sequentially to avoid loops
   */
  private findNextSequentialQuestion(): TrainingQuestion | null {
    // Start from current index and find next unasked question
    for (let i = this.currentQuestionIndex; i < this.trainingQuestions.length; i++) {
      const question = this.trainingQuestions[i];
      if (!this.askedQuestions.has(question.id)) {
        this.currentQuestionIndex = i + 1; // Move to next for future calls
        return question;
      }
    }

    // If we've reached the end, check if there are any unasked questions from the beginning
    for (let i = 0; i < this.currentQuestionIndex; i++) {
      const question = this.trainingQuestions[i];
      if (!this.askedQuestions.has(question.id)) {
        return question;
      }
    }

    return null; // All questions have been asked
  }

  /**
   * Generate a final summary question if needed
   */
  private generateFinalQuestion(): { type: 'question', content: string, questionId: string } {
    const remainingNeeded = this.REQUIRED_CORRECT - this.currentSession.correctCount;
    
    const finalQuestions = [
      'What\'s the most important thing for me to remember about how you like to communicate?',
      'If you could change one thing about how AI assistants typically behave, what would it be?',
      'What\'s your biggest pet peeve when talking to AI systems?',
      'How would you describe your ideal AI assistant in three words?',
      'What should I never assume about you without asking first?'
    ];

    const questionIndex = Math.min(finalQuestions.length - 1, remainingNeeded - 1);
    const questionId = `final_${Date.now()}_${questionIndex}`;
    
    return {
      type: 'question',
      content: finalQuestions[questionIndex],
      questionId
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
   * Process user response with enhanced learning - FIXED VERSION
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
      // Guess was correct - count it and move on
      this.recordCorrectAnswer(questionId, true);
      this.reinforceInference(questionId);
      
      // Check if training is complete
      if (this.currentSession.correctCount >= this.REQUIRED_CORRECT) {
        this.currentSession.isComplete = true;
        return {
          success: true,
          needsMoreInfo: false,
          nextPrompt: null,
          feedback: 'Training complete! 🎉 I\'ve learned your preferences.'
        };
      }
      
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
   * Process user validation with enhanced learning - FIXED VERSION
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
      // Correct answer - increment and move on
      this.currentSession.correctCount++;
      this.learnFromSuccess(lastAttempt);
      
      const isComplete = this.currentSession.correctCount >= this.REQUIRED_CORRECT;
      
      if (isComplete) {
        this.currentSession.isComplete = true;
      }
      
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
      // Incorrect answer - learn from explanation and move on
      if (explanation) {
        const learningResult = this.learnFromExplanation(lastAttempt, explanation);
        
        // Still move to next question after learning
        return {
          correct: false,
          progress: {
            correct: this.currentSession.correctCount,
            total: this.REQUIRED_CORRECT,
            remaining: this.REQUIRED_CORRECT - this.currentSession.correctCount
          },
          isComplete: false,
          nextPrompt: this.getNextPrompt(), // Always move to next question
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
      case 'communication':
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

      case 'technical':
        if (lowerExplanation.includes('simple')) {
          insights.push('prefers simple language');
          this.personality.techLevel -= 0.2;
        }
        if (lowerExplanation.includes('technical')) {
          insights.push('comfortable with technical terms');
          this.personality.techLevel += 0.3;
        }
        break;

      case 'personality':
        if (lowerExplanation.includes('humor') || lowerExplanation.includes('joke')) {
          if (lowerExplanation.includes('no ') || lowerExplanation.includes('not ')) {
            insights.push('prefers serious tone');
            this.personality.humor -= 0.3;
          } else {
            insights.push('enjoys humor');
            this.personality.humor += 0.3;
          }
        }
        if (lowerExplanation.includes('empathy') || lowerExplanation.includes('understand')) {
          insights.push('values empathy');
          this.personality.empathy += 0.3;
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
  private isPositiveResponse(input: string): boolean {
    const positive = ['yes', 'yeah', 'yep', 'correct', 'right', 'accurate', 'true', 'exactly'];
    return positive.some(word => input.toLowerCase().includes(word));
  }

  private recordCorrectAnswer(questionId: string, wasInferred: boolean): void {
    this.currentSession.correctCount++;
    this.currentSession.totalAttempts++;
    
    // If this was an inferred answer, record that for metrics
    if (wasInferred) {
      if (!this.currentSession.inferredCorrect) {
        this.currentSession.inferredCorrect = 0;
      }
      this.currentSession.inferredCorrect++;
    }
  }

  private reinforceInference(questionId: string): void {
    // Strengthen the inference pattern that worked
    const question = this.trainingQuestions.find(q => q.id === questionId);
    if (question && question.category) {
      // Store the successful inference
      this.contextualInferences.set(questionId, "successful_inference");
      
      // Update personality based on the successful inference
      if (question.category === 'communication' && questionId === 'comm_1') {
        // If we correctly guessed formality preference, strengthen that trait
        this.personality.formality = this.personality.formality > 0 ? 
          Math.min(1, this.personality.formality + 0.1) : 
          Math.max(-1, this.personality.formality - 0.1);
      }
    }
  }

  private storeUserAnswer(questionId: string, answer: string): void {
    // Store user's answer for future reference
    const question = this.trainingQuestions.find(q => q.id === questionId);
    if (question) {
      this.storeKnownFact(`answer_${questionId}`, answer, 'explicit', 1.0);
      
      // Update personality based on answer
      this.updatePersonalityFromAnswer(question.category, answer);
    }
  }

  private updatePersonalityFromAnswer(category: string, answer: string): void {
    const lowerAnswer = answer.toLowerCase();
    
    switch(category) {
      case 'communication':
        if (lowerAnswer.includes('formal')) this.personality.formality += 0.2;
        if (lowerAnswer.includes('casual')) this.personality.formality -= 0.2;
        if (lowerAnswer.includes('direct') || lowerAnswer.includes('short')) this.personality.directness += 0.2;
        if (lowerAnswer.includes('detail')) this.personality.directness -= 0.2;
        break;
        
      case 'personality':
        if (lowerAnswer.includes('humor') || lowerAnswer.includes('joke') || lowerAnswer.includes('funny')) {
          if (!lowerAnswer.includes('no ') && !lowerAnswer.includes('not ')) {
            this.personality.humor += 0.2;
          } else {
            this.personality.humor -= 0.2;
          }
        }
        break;
        
      case 'technical':
        if (lowerAnswer.includes('technical') || lowerAnswer.includes('detail')) this.personality.techLevel += 0.2;
        if (lowerAnswer.includes('simple') || lowerAnswer.includes('basic')) this.personality.techLevel -= 0.2;
        break;
    }
    
    // Clamp values
    this.personality.formality = Math.max(-1, Math.min(1, this.personality.formality));
    this.personality.directness = Math.max(-1, Math.min(1, this.personality.directness));
    this.personality.humor = Math.max(-1, Math.min(1, this.personality.humor));
    this.personality.empathy = Math.max(-1, Math.min(1, this.personality.empathy));
    this.personality.techLevel = Math.max(-1, Math.min(1, this.personality.techLevel));
  }

  private generateAIResponse(questionId: string, userAnswer: string): string {
    const question = this.trainingQuestions.find(q => q.id === questionId);
    if (!question) return 'I understand.';

    // Generate contextual response based on question category and user answer
    switch (question.category) {
      case 'communication':
        return `Got it! So you prefer ${userAnswer}. I'll keep that in mind for how we interact.`;
      case 'technical':
        return `Your answer is "${userAnswer}". That helps me understand your technical preferences.`;
      case 'personality':
        return `Thanks for sharing that "${userAnswer}". This helps me understand your personality better.`;
      case 'preferences':
        return `I'll remember your preference: "${userAnswer}". This will help me serve you better.`;
      case 'learning':
        return `Interesting response: "${userAnswer}". I'll keep this in mind for our future interactions.`;
      default:
        return `I understand your answer: "${userAnswer}".`;
    }
  }

  private learnFromSuccess(attempt: TrainingAttempt): void {
    // Learn from successful patterns
    const question = this.trainingQuestions.find(q => q.id === attempt.questionId);
    if (question) {
      // Store the successful answer
      this.storeKnownFact(`${question.category}_success_${attempt.questionId}`, attempt.userAnswer, 'explicit', 0.9);
      
      // Update contextual inferences
      this.contextualInferences.set(attempt.questionId, attempt.userAnswer);
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
        factsLearned: 0,
        inferencesMade: 0
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
      inferencesMade: this.contextualInferences.size
    };
  }
}