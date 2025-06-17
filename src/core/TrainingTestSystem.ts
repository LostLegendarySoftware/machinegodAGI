/**
 * Training Test System
 * 25-question rapid fire test before natural conversation is unlocked
 */

export interface TrainingQuestion {
  id: string;
  question: string;
  expectedAnswer: string;
  category: 'logic' | 'language' | 'knowledge' | 'reasoning' | 'social';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TrainingAttempt {
  questionId: string;
  userAnswer: string;
  aiResponse: string;
  userValidation: 'yes' | 'no' | 'pending';
  feedback?: string;
  timestamp: Date;
}

export interface TrainingSession {
  sessionId: string;
  startTime: Date;
  attempts: TrainingAttempt[];
  correctCount: number;
  totalAttempts: number;
  isComplete: boolean;
  currentQuestionIndex: number;
}

export class TrainingTestSystem {
  private trainingQuestions: TrainingQuestion[] = [];
  private currentSession: TrainingSession | null = null;
  private readonly REQUIRED_CORRECT = 25;
  private learningPatterns: Map<string, string[]> = new Map();

  constructor() {
    this.initializeTrainingQuestions();
    console.log('🎯 Training Test System initialized - 25 questions to unlock natural conversation');
  }

  private initializeTrainingQuestions() {
    this.trainingQuestions = [
      // Logic Questions (5)
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
      {
        id: 'logic_3',
        question: 'What is the logical fallacy in: "Everyone I know likes pizza, so everyone in the world likes pizza"?',
        expectedAnswer: 'hasty generalization',
        category: 'logic',
        difficulty: 'medium'
      },
      {
        id: 'logic_4',
        question: 'If it\'s raining, then the ground is wet. The ground is wet. Is it raining?',
        expectedAnswer: 'not necessarily',
        category: 'logic',
        difficulty: 'hard'
      },
      {
        id: 'logic_5',
        question: 'What makes an argument valid vs sound?',
        expectedAnswer: 'valid means logical structure is correct, sound means valid with true premises',
        category: 'logic',
        difficulty: 'hard'
      },

      // Language Questions (5)
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
      {
        id: 'lang_3',
        question: 'What\'s the difference between "your" and "you\'re"?',
        expectedAnswer: 'your is possessive, you\'re is you are',
        category: 'language',
        difficulty: 'easy'
      },
      {
        id: 'lang_4',
        question: 'What does "it\'s giving" mean in social media speak?',
        expectedAnswer: 'it has the vibe of, it seems like',
        category: 'language',
        difficulty: 'medium'
      },
      {
        id: 'lang_5',
        question: 'How would you explain something complex to a 5-year-old?',
        expectedAnswer: 'use simple words, analogies, examples they understand',
        category: 'language',
        difficulty: 'medium'
      },

      // Knowledge Questions (5)
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
      {
        id: 'know_3',
        question: 'What is 2 + 2 × 3?',
        expectedAnswer: '8',
        category: 'knowledge',
        difficulty: 'medium'
      },
      {
        id: 'know_4',
        question: 'What year did World War II end?',
        expectedAnswer: '1945',
        category: 'knowledge',
        difficulty: 'medium'
      },
      {
        id: 'know_5',
        question: 'What is the largest planet in our solar system?',
        expectedAnswer: 'Jupiter',
        category: 'knowledge',
        difficulty: 'easy'
      },

      // Reasoning Questions (5)
      {
        id: 'reason_1',
        question: 'A man lives on the 20th floor. Every day he takes the elevator down to the ground floor. When he comes home, he takes the elevator to the 10th floor and walks the rest. Why?',
        expectedAnswer: 'he\'s too short to reach the 20th floor button',
        category: 'reasoning',
        difficulty: 'hard'
      },
      {
        id: 'reason_2',
        question: 'If you have a 3-gallon jug and a 5-gallon jug, how do you measure exactly 4 gallons?',
        expectedAnswer: 'fill 5, pour into 3, empty 3, pour remaining 2 from 5 into 3, fill 5 again, pour into 3 until full (1 gallon), leaving 4 in the 5-gallon jug',
        category: 'reasoning',
        difficulty: 'hard'
      },
      {
        id: 'reason_3',
        question: 'What comes next in this sequence: 2, 4, 8, 16, ?',
        expectedAnswer: '32',
        category: 'reasoning',
        difficulty: 'medium'
      },
      {
        id: 'reason_4',
        question: 'If today is Tuesday, what day was it 100 days ago?',
        expectedAnswer: 'Sunday',
        category: 'reasoning',
        difficulty: 'medium'
      },
      {
        id: 'reason_5',
        question: 'You have 12 balls, one is heavier. Using a balance scale only 3 times, how do you find the heavy ball?',
        expectedAnswer: 'divide into groups of 4, weigh two groups, then narrow down systematically',
        category: 'reasoning',
        difficulty: 'hard'
      },

      // Social Questions (5)
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
      {
        id: 'social_3',
        question: 'Someone asks "How are you?" What\'s an appropriate casual response?',
        expectedAnswer: 'good, thanks! how about you?',
        category: 'social',
        difficulty: 'easy'
      },
      {
        id: 'social_4',
        question: 'What does it mean to "read the room"?',
        expectedAnswer: 'understand the mood and social context of a situation',
        category: 'social',
        difficulty: 'medium'
      },
      {
        id: 'social_5',
        question: 'How do you politely disagree with someone?',
        expectedAnswer: 'acknowledge their point, then share your perspective respectfully',
        category: 'social',
        difficulty: 'medium'
      }
    ];

    console.log(`📚 Loaded ${this.trainingQuestions.length} training questions across 5 categories`);
  }

  /**
   * Start a new training session
   */
  startTrainingSession(): TrainingSession {
    this.currentSession = {
      sessionId: `training_${Date.now()}`,
      startTime: new Date(),
      attempts: [],
      correctCount: 0,
      totalAttempts: 0,
      isComplete: false,
      currentQuestionIndex: 0
    };

    console.log(`🎯 Started training session: ${this.currentSession.sessionId}`);
    return this.currentSession;
  }

  /**
   * Get current question for training
   */
  getCurrentQuestion(): TrainingQuestion | null {
    if (!this.currentSession || this.currentSession.isComplete) {
      return null;
    }

    if (this.currentSession.currentQuestionIndex >= this.trainingQuestions.length) {
      // Cycle back to beginning if we've gone through all questions
      this.currentSession.currentQuestionIndex = 0;
    }

    return this.trainingQuestions[this.currentSession.currentQuestionIndex];
  }

  /**
   * Submit an answer to the current question
   */
  submitAnswer(userAnswer: string, aiResponse: string): TrainingAttempt {
    if (!this.currentSession) {
      throw new Error('No active training session');
    }

    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      throw new Error('No current question available');
    }

    const attempt: TrainingAttempt = {
      questionId: currentQuestion.id,
      userAnswer,
      aiResponse,
      userValidation: 'pending',
      timestamp: new Date()
    };

    this.currentSession.attempts.push(attempt);
    this.currentSession.totalAttempts++;

    console.log(`📝 Answer submitted for question ${currentQuestion.id}: "${aiResponse}"`);
    return attempt;
  }

  /**
   * Process user validation (yes/no)
   */
  processValidation(validation: 'yes' | 'no', feedback?: string): {
    correct: boolean;
    needsFeedback: boolean;
    progress: { correct: number; total: number; remaining: number };
    isComplete: boolean;
  } {
    if (!this.currentSession) {
      throw new Error('No active training session');
    }

    const lastAttempt = this.currentSession.attempts[this.currentSession.attempts.length - 1];
    if (!lastAttempt) {
      throw new Error('No attempt to validate');
    }

    lastAttempt.userValidation = validation;
    lastAttempt.feedback = feedback;

    let correct = false;
    let needsFeedback = false;

    if (validation === 'yes') {
      correct = true;
      this.currentSession.correctCount++;
      this.currentSession.currentQuestionIndex++;
      
      // Learn from successful pattern
      this.learnFromSuccess(lastAttempt);
      
      console.log(`✅ Correct! Progress: ${this.currentSession.correctCount}/${this.REQUIRED_CORRECT}`);
    } else {
      needsFeedback = !feedback; // Need feedback if not provided
      
      if (feedback) {
        // Learn from the correction
        this.learnFromCorrection(lastAttempt, feedback);
        this.currentSession.currentQuestionIndex++; // Move to next question after learning
        console.log(`❌ Incorrect. Learning from feedback: "${feedback}"`);
      } else {
        console.log(`❌ Incorrect. Waiting for user feedback...`);
      }
    }

    // Check if training is complete
    const isComplete = this.currentSession.correctCount >= this.REQUIRED_CORRECT;
    if (isComplete) {
      this.currentSession.isComplete = true;
      console.log(`🎉 Training complete! ${this.REQUIRED_CORRECT} correct answers achieved!`);
    }

    return {
      correct,
      needsFeedback,
      progress: {
        correct: this.currentSession.correctCount,
        total: this.REQUIRED_CORRECT,
        remaining: this.REQUIRED_CORRECT - this.currentSession.correctCount
      },
      isComplete
    };
  }

  /**
   * Learn from successful answer
   */
  private learnFromSuccess(attempt: TrainingAttempt): void {
    const question = this.trainingQuestions.find(q => q.id === attempt.questionId);
    if (!question) return;

    const category = question.category;
    const successfulPatterns = this.learningPatterns.get(category) || [];
    
    // Extract key phrases from successful response
    const keyPhrases = this.extractKeyPhrases(attempt.aiResponse);
    keyPhrases.forEach(phrase => {
      if (!successfulPatterns.includes(phrase)) {
        successfulPatterns.push(phrase);
      }
    });

    this.learningPatterns.set(category, successfulPatterns);
    console.log(`📈 Learned successful pattern for ${category}: ${keyPhrases.join(', ')}`);
  }

  /**
   * Learn from user correction
   */
  private learnFromCorrection(attempt: TrainingAttempt, feedback: string): void {
    const question = this.trainingQuestions.find(q => q.id === attempt.questionId);
    if (!question) return;

    const category = question.category;
    const corrections = this.learningPatterns.get(`${category}_corrections`) || [];
    
    // Store the correction pattern
    const correctionPattern = `${attempt.aiResponse} -> ${feedback}`;
    corrections.push(correctionPattern);

    this.learningPatterns.set(`${category}_corrections`, corrections);
    console.log(`📚 Learned correction for ${category}: ${correctionPattern}`);
  }

  /**
   * Extract key phrases from text
   */
  private extractKeyPhrases(text: string): string[] {
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were']);
    
    return words
      .filter(word => word.length > 3 && !stopWords.has(word))
      .slice(0, 5); // Top 5 key words
  }

  /**
   * Get improved response based on learning
   */
  getImprovedResponse(questionId: string, originalResponse: string): string {
    const question = this.trainingQuestions.find(q => q.id === questionId);
    if (!question) return originalResponse;

    const category = question.category;
    const corrections = this.learningPatterns.get(`${category}_corrections`) || [];
    const successfulPatterns = this.learningPatterns.get(category) || [];

    // Check if we have a specific correction for this type of response
    for (const correction of corrections) {
      const [wrongPattern, rightPattern] = correction.split(' -> ');
      if (originalResponse.toLowerCase().includes(wrongPattern.toLowerCase())) {
        return rightPattern;
      }
    }

    // Try to incorporate successful patterns
    if (successfulPatterns.length > 0) {
      const randomPattern = successfulPatterns[Math.floor(Math.random() * successfulPatterns.length)];
      if (!originalResponse.toLowerCase().includes(randomPattern.toLowerCase())) {
        return `${originalResponse} (${randomPattern})`;
      }
    }

    return originalResponse;
  }

  /**
   * Check if training is complete
   */
  isTrainingComplete(): boolean {
    return this.currentSession?.isComplete || false;
  }

  /**
   * Get training progress
   */
  getTrainingProgress(): {
    sessionActive: boolean;
    correctCount: number;
    totalAttempts: number;
    requiredCorrect: number;
    isComplete: boolean;
    currentCategory?: string;
    recentAttempts: TrainingAttempt[];
  } {
    if (!this.currentSession) {
      return {
        sessionActive: false,
        correctCount: 0,
        totalAttempts: 0,
        requiredCorrect: this.REQUIRED_CORRECT,
        isComplete: false,
        recentAttempts: []
      };
    }

    const currentQuestion = this.getCurrentQuestion();
    
    return {
      sessionActive: true,
      correctCount: this.currentSession.correctCount,
      totalAttempts: this.currentSession.totalAttempts,
      requiredCorrect: this.REQUIRED_CORRECT,
      isComplete: this.currentSession.isComplete,
      currentCategory: currentQuestion?.category,
      recentAttempts: this.currentSession.attempts.slice(-5)
    };
  }

  /**
   * Get learning statistics
   */
  getLearningStats(): {
    totalPatterns: number;
    categoriesLearned: string[];
    correctionsLearned: number;
    successPatternsLearned: number;
  } {
    const allPatterns = Array.from(this.learningPatterns.keys());
    const corrections = allPatterns.filter(key => key.includes('_corrections'));
    const successPatterns = allPatterns.filter(key => !key.includes('_corrections'));

    const totalCorrections = corrections.reduce((sum, key) => {
      return sum + (this.learningPatterns.get(key)?.length || 0);
    }, 0);

    const totalSuccessPatterns = successPatterns.reduce((sum, key) => {
      return sum + (this.learningPatterns.get(key)?.length || 0);
    }, 0);

    return {
      totalPatterns: this.learningPatterns.size,
      categoriesLearned: successPatterns,
      correctionsLearned: totalCorrections,
      successPatternsLearned: totalSuccessPatterns
    };
  }

  /**
   * Reset training session
   */
  resetTraining(): void {
    this.currentSession = null;
    console.log('🔄 Training session reset');
  }
}