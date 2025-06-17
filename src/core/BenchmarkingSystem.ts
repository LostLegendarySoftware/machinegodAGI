/**
 * Advanced Benchmarking System
 * Integrates with top AI leaderboards and provides comprehensive testing
 */

export interface BenchmarkTest {
  id: string;
  name: string;
  category: 'reasoning' | 'knowledge' | 'coding' | 'math' | 'language' | 'multimodal' | 'agi';
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  maxScore: number;
  timeLimit: number; // seconds
  questions: BenchmarkQuestion[];
}

export interface BenchmarkQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'open_ended' | 'code' | 'math' | 'logical';
  correctAnswer?: string;
  options?: string[];
  points: number;
  explanation?: string;
}

export interface BenchmarkResult {
  testId: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  answers: Array<{
    questionId: string;
    userAnswer: string;
    correct: boolean;
    points: number;
  }>;
  timestamp: Date;
  confidence: number;
}

export interface LeaderboardEntry {
  rank: number;
  model: string;
  score: number;
  date: Date;
  verified: boolean;
}

export interface LeaderboardData {
  name: string;
  category: string;
  description: string;
  topModels: LeaderboardEntry[];
  ourRank?: number;
  ourScore?: number;
  lastUpdated: Date;
}

export class BenchmarkingSystem {
  private benchmarkTests: Map<string, BenchmarkTest> = new Map();
  private results: BenchmarkResult[] = [];
  private leaderboards: Map<string, LeaderboardData> = new Map();
  private currentCapability = 0.4; // ChatGPT-4 baseline

  constructor() {
    this.initializeBenchmarks();
    this.initializeLeaderboards();
    console.log('📊 Advanced Benchmarking System initialized');
  }

  private initializeBenchmarks() {
    const benchmarks: BenchmarkTest[] = [
      // MMLU (Massive Multitask Language Understanding)
      {
        id: 'mmlu',
        name: 'MMLU',
        category: 'knowledge',
        description: 'Massive Multitask Language Understanding - 57 academic subjects',
        difficulty: 'expert',
        maxScore: 100,
        timeLimit: 3600,
        questions: this.generateMMLUQuestions()
      },
      // HumanEval (Code Generation)
      {
        id: 'humaneval',
        name: 'HumanEval',
        category: 'coding',
        description: 'Python code generation from docstrings',
        difficulty: 'hard',
        maxScore: 164,
        timeLimit: 1800,
        questions: this.generateHumanEvalQuestions()
      },
      // GSM8K (Grade School Math)
      {
        id: 'gsm8k',
        name: 'GSM8K',
        category: 'math',
        description: 'Grade school math word problems',
        difficulty: 'medium',
        maxScore: 100,
        timeLimit: 2400,
        questions: this.generateGSM8KQuestions()
      },
      // HellaSwag (Commonsense Reasoning)
      {
        id: 'hellaswag',
        name: 'HellaSwag',
        category: 'reasoning',
        description: 'Commonsense reasoning about everyday situations',
        difficulty: 'medium',
        maxScore: 100,
        timeLimit: 1800,
        questions: this.generateHellaSwagQuestions()
      },
      // ARC (AI2 Reasoning Challenge)
      {
        id: 'arc',
        name: 'ARC',
        category: 'reasoning',
        description: 'Science questions requiring reasoning',
        difficulty: 'hard',
        maxScore: 100,
        timeLimit: 2400,
        questions: this.generateARCQuestions()
      },
      // TruthfulQA
      {
        id: 'truthfulqa',
        name: 'TruthfulQA',
        category: 'reasoning',
        description: 'Questions testing truthfulness and avoiding misconceptions',
        difficulty: 'hard',
        maxScore: 100,
        timeLimit: 1800,
        questions: this.generateTruthfulQAQuestions()
      },
      // Custom AGI Test
      {
        id: 'agi-test',
        name: 'AGI Capability Test',
        category: 'agi',
        description: 'Comprehensive test of general intelligence capabilities',
        difficulty: 'expert',
        maxScore: 200,
        timeLimit: 7200,
        questions: this.generateAGITestQuestions()
      },
      // Turing Test Simulation
      {
        id: 'turing-test',
        name: 'Turing Test Simulation',
        category: 'language',
        description: 'Conversational test to distinguish from human responses',
        difficulty: 'expert',
        maxScore: 100,
        timeLimit: 3600,
        questions: this.generateTuringTestQuestions()
      }
    ];

    benchmarks.forEach(benchmark => {
      this.benchmarkTests.set(benchmark.id, benchmark);
    });
  }

  private initializeLeaderboards() {
    const leaderboards: LeaderboardData[] = [
      {
        name: 'Chatbot Arena',
        category: 'General',
        description: 'Human preference rankings for conversational AI',
        topModels: [
          { rank: 1, model: 'GPT-4o', score: 1287, date: new Date('2024-12-01'), verified: true },
          { rank: 2, model: 'Claude-3.5-Sonnet', score: 1271, date: new Date('2024-12-01'), verified: true },
          { rank: 3, model: 'Gemini-1.5-Pro', score: 1251, date: new Date('2024-12-01'), verified: true },
          { rank: 4, model: 'GPT-4-Turbo', score: 1233, date: new Date('2024-12-01'), verified: true },
          { rank: 5, model: 'Claude-3-Opus', score: 1227, date: new Date('2024-12-01'), verified: true }
        ],
        lastUpdated: new Date('2024-12-01')
      },
      {
        name: 'MMLU Leaderboard',
        category: 'Knowledge',
        description: 'Massive Multitask Language Understanding',
        topModels: [
          { rank: 1, model: 'GPT-4o', score: 88.7, date: new Date('2024-12-01'), verified: true },
          { rank: 2, model: 'Claude-3.5-Sonnet', score: 88.3, date: new Date('2024-12-01'), verified: true },
          { rank: 3, model: 'Gemini-1.5-Pro', score: 85.9, date: new Date('2024-12-01'), verified: true },
          { rank: 4, model: 'GPT-4-Turbo', score: 86.4, date: new Date('2024-12-01'), verified: true },
          { rank: 5, model: 'Claude-3-Opus', score: 86.8, date: new Date('2024-12-01'), verified: true }
        ],
        lastUpdated: new Date('2024-12-01')
      },
      {
        name: 'HumanEval',
        category: 'Coding',
        description: 'Python code generation benchmark',
        topModels: [
          { rank: 1, model: 'GPT-4o', score: 90.2, date: new Date('2024-12-01'), verified: true },
          { rank: 2, model: 'Claude-3.5-Sonnet', score: 92.0, date: new Date('2024-12-01'), verified: true },
          { rank: 3, model: 'GPT-4-Turbo', score: 87.6, date: new Date('2024-12-01'), verified: true },
          { rank: 4, model: 'Gemini-1.5-Pro', score: 84.1, date: new Date('2024-12-01'), verified: true },
          { rank: 5, model: 'Claude-3-Opus', score: 84.9, date: new Date('2024-12-01'), verified: true }
        ],
        lastUpdated: new Date('2024-12-01')
      },
      {
        name: 'GSM8K',
        category: 'Math',
        description: 'Grade school math word problems',
        topModels: [
          { rank: 1, model: 'GPT-4o', score: 95.8, date: new Date('2024-12-01'), verified: true },
          { rank: 2, model: 'Claude-3.5-Sonnet', score: 96.4, date: new Date('2024-12-01'), verified: true },
          { rank: 3, model: 'Gemini-1.5-Pro', score: 91.7, date: new Date('2024-12-01'), verified: true },
          { rank: 4, model: 'GPT-4-Turbo', score: 92.0, date: new Date('2024-12-01'), verified: true },
          { rank: 5, model: 'Claude-3-Opus', score: 95.0, date: new Date('2024-12-01'), verified: true }
        ],
        lastUpdated: new Date('2024-12-01')
      },
      {
        name: 'ARC Challenge',
        category: 'Reasoning',
        description: 'AI2 Reasoning Challenge',
        topModels: [
          { rank: 1, model: 'GPT-4o', score: 96.7, date: new Date('2024-12-01'), verified: true },
          { rank: 2, model: 'Claude-3.5-Sonnet', score: 96.4, date: new Date('2024-12-01'), verified: true },
          { rank: 3, model: 'Gemini-1.5-Pro', score: 94.4, date: new Date('2024-12-01'), verified: true },
          { rank: 4, model: 'GPT-4-Turbo', score: 96.3, date: new Date('2024-12-01'), verified: true },
          { rank: 5, model: 'Claude-3-Opus', score: 96.4, date: new Date('2024-12-01'), verified: true }
        ],
        lastUpdated: new Date('2024-12-01')
      }
    ];

    leaderboards.forEach(leaderboard => {
      this.leaderboards.set(leaderboard.name.toLowerCase().replace(/\s+/g, '-'), leaderboard);
    });
  }

  /**
   * Run a specific benchmark test
   */
  async runBenchmark(testId: string, systemResponse: (question: string) => Promise<string>): Promise<BenchmarkResult> {
    const test = this.benchmarkTests.get(testId);
    if (!test) {
      throw new Error(`Benchmark test not found: ${testId}`);
    }

    console.log(`📊 Running benchmark: ${test.name}`);
    const startTime = Date.now();
    const answers: Array<{
      questionId: string;
      userAnswer: string;
      correct: boolean;
      points: number;
    }> = [];

    let totalScore = 0;
    let totalConfidence = 0;

    for (const question of test.questions) {
      try {
        const response = await systemResponse(question.question);
        const isCorrect = this.evaluateAnswer(question, response);
        const points = isCorrect ? question.points : 0;
        
        answers.push({
          questionId: question.id,
          userAnswer: response,
          correct: isCorrect,
          points
        });

        totalScore += points;
        totalConfidence += isCorrect ? 1 : 0;

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing question ${question.id}:`, error);
        answers.push({
          questionId: question.id,
          userAnswer: 'ERROR',
          correct: false,
          points: 0
        });
      }
    }

    const timeSpent = (Date.now() - startTime) / 1000;
    const percentage = (totalScore / test.maxScore) * 100;
    const confidence = totalConfidence / test.questions.length;

    const result: BenchmarkResult = {
      testId,
      score: totalScore,
      maxScore: test.maxScore,
      percentage,
      timeSpent,
      answers,
      timestamp: new Date(),
      confidence
    };

    this.results.push(result);
    console.log(`✅ Benchmark completed: ${test.name} - Score: ${percentage.toFixed(1)}%`);

    return result;
  }

  private evaluateAnswer(question: BenchmarkQuestion, response: string): boolean {
    if (!question.correctAnswer) return false;

    const normalizedResponse = response.toLowerCase().trim();
    const normalizedCorrect = question.correctAnswer.toLowerCase().trim();

    switch (question.type) {
      case 'multiple_choice':
        // Extract letter choice (A, B, C, D) or full option text
        const choiceMatch = normalizedResponse.match(/^([abcd])\b/);
        if (choiceMatch) {
          const choiceIndex = choiceMatch[1].charCodeAt(0) - 97; // a=0, b=1, etc.
          return question.options?.[choiceIndex]?.toLowerCase().trim() === normalizedCorrect;
        }
        return normalizedResponse.includes(normalizedCorrect);

      case 'math':
        // Extract numerical answer
        const numberMatch = normalizedResponse.match(/[\d.]+/);
        const correctMatch = normalizedCorrect.match(/[\d.]+/);
        if (numberMatch && correctMatch) {
          return Math.abs(parseFloat(numberMatch[0]) - parseFloat(correctMatch[0])) < 0.01;
        }
        return false;

      case 'code':
        // Simple code evaluation (in real implementation, would execute and test)
        return normalizedResponse.includes(normalizedCorrect) || 
               this.evaluateCodeSimilarity(normalizedResponse, normalizedCorrect) > 0.8;

      case 'logical':
        // Logical reasoning evaluation
        return this.evaluateLogicalReasoning(normalizedResponse, normalizedCorrect);

      default:
        // Fuzzy string matching for open-ended questions
        return this.calculateStringSimilarity(normalizedResponse, normalizedCorrect) > 0.7;
    }
  }

  private evaluateCodeSimilarity(response: string, correct: string): number {
    // Simplified code similarity (in real implementation, would use AST comparison)
    const responseTokens = response.split(/\W+/).filter(t => t.length > 0);
    const correctTokens = correct.split(/\W+/).filter(t => t.length > 0);
    
    const intersection = responseTokens.filter(token => correctTokens.includes(token));
    const union = [...new Set([...responseTokens, ...correctTokens])];
    
    return intersection.length / union.length;
  }

  private evaluateLogicalReasoning(response: string, correct: string): boolean {
    // Simplified logical evaluation
    const logicalKeywords = ['therefore', 'because', 'if', 'then', 'implies', 'follows'];
    const responseHasLogic = logicalKeywords.some(keyword => response.includes(keyword));
    const correctHasLogic = logicalKeywords.some(keyword => correct.includes(keyword));
    
    if (responseHasLogic && correctHasLogic) {
      return this.calculateStringSimilarity(response, correct) > 0.6;
    }
    
    return this.calculateStringSimilarity(response, correct) > 0.8;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const words1 = str1.split(/\s+/);
    const words2 = str2.split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  /**
   * Estimate current performance level
   */
  estimatePerformanceLevel(): {
    currentLevel: string;
    chatgpt4Equivalent: number;
    agiProgress: number;
    strongestAreas: string[];
    weakestAreas: string[];
    timeToGPT4: string;
    timeToAGI: string;
  } {
    if (this.results.length === 0) {
      return {
        currentLevel: 'ChatGPT-4 Baseline',
        chatgpt4Equivalent: 0.4,
        agiProgress: 0.4,
        strongestAreas: ['Basic conversation'],
        weakestAreas: ['All advanced capabilities'],
        timeToGPT4: 'Unknown - no benchmark data',
        timeToAGI: 'Unknown - no benchmark data'
      };
    }

    // Calculate performance by category
    const categoryPerformance = new Map<string, number>();
    const categoryResults = new Map<string, BenchmarkResult[]>();

    this.results.forEach(result => {
      const test = this.benchmarkTests.get(result.testId);
      if (test) {
        if (!categoryResults.has(test.category)) {
          categoryResults.set(test.category, []);
        }
        categoryResults.get(test.category)!.push(result);
      }
    });

    categoryResults.forEach((results, category) => {
      const avgPerformance = results.reduce((sum, r) => sum + r.percentage, 0) / results.length;
      categoryPerformance.set(category, avgPerformance / 100);
    });

    // Overall performance
    const overallPerformance = Array.from(categoryPerformance.values()).reduce((sum, p) => sum + p, 0) / categoryPerformance.size;
    
    // Determine current level
    let currentLevel = 'Below ChatGPT-4';
    if (overallPerformance >= 0.9) currentLevel = 'AGI Level';
    else if (overallPerformance >= 0.8) currentLevel = 'GPT-4o+ Level';
    else if (overallPerformance >= 0.7) currentLevel = 'GPT-4 Level';
    else if (overallPerformance >= 0.6) currentLevel = 'GPT-3.5+ Level';
    else if (overallPerformance >= 0.4) currentLevel = 'ChatGPT-4 Baseline';

    // Find strongest and weakest areas
    const sortedCategories = Array.from(categoryPerformance.entries()).sort((a, b) => b[1] - a[1]);
    const strongestAreas = sortedCategories.slice(0, 3).map(([category]) => category);
    const weakestAreas = sortedCategories.slice(-3).map(([category]) => category);

    // Time estimates
    const gpt4Gap = Math.max(0, 0.7 - overallPerformance);
    const agiGap = Math.max(0, 0.9 - overallPerformance);
    
    const timeToGPT4 = gpt4Gap === 0 ? 'Already achieved' : `${Math.ceil(gpt4Gap * 100)} days`;
    const timeToAGI = agiGap === 0 ? 'Already achieved' : `${Math.ceil(agiGap * 200)} days`;

    return {
      currentLevel,
      chatgpt4Equivalent: overallPerformance,
      agiProgress: overallPerformance,
      strongestAreas,
      weakestAreas,
      timeToGPT4,
      timeToAGI
    };
  }

  /**
   * Compare with leaderboards
   */
  compareWithLeaderboards(): Array<{
    leaderboard: string;
    ourScore: number;
    topScore: number;
    rank: number;
    percentile: number;
    gap: number;
  }> {
    const comparisons: Array<{
      leaderboard: string;
      ourScore: number;
      topScore: number;
      rank: number;
      percentile: number;
      gap: number;
    }> = [];

    this.leaderboards.forEach((leaderboard, key) => {
      // Find our best result for this leaderboard's category
      const relevantResults = this.results.filter(result => {
        const test = this.benchmarkTests.get(result.testId);
        return test && test.category.toLowerCase() === leaderboard.category.toLowerCase();
      });

      if (relevantResults.length > 0) {
        const bestResult = relevantResults.reduce((best, current) => 
          current.percentage > best.percentage ? current : best
        );

        const topScore = leaderboard.topModels[0]?.score || 100;
        const ourScore = bestResult.percentage;
        
        // Estimate our rank
        let rank = leaderboard.topModels.length + 1;
        for (let i = 0; i < leaderboard.topModels.length; i++) {
          if (ourScore > leaderboard.topModels[i].score) {
            rank = i + 1;
            break;
          }
        }

        const percentile = Math.max(0, 100 - (rank / (leaderboard.topModels.length + 1)) * 100);
        const gap = topScore - ourScore;

        comparisons.push({
          leaderboard: leaderboard.name,
          ourScore,
          topScore,
          rank,
          percentile,
          gap
        });
      }
    });

    return comparisons;
  }

  /**
   * Get benchmark recommendations
   */
  getBenchmarkRecommendations(): {
    nextTests: string[];
    focusAreas: string[];
    estimatedImprovement: number;
  } {
    const categoryPerformance = new Map<string, number>();
    
    // Calculate current performance by category
    this.results.forEach(result => {
      const test = this.benchmarkTests.get(result.testId);
      if (test) {
        if (!categoryPerformance.has(test.category)) {
          categoryPerformance.set(test.category, 0);
        }
        categoryPerformance.set(test.category, 
          Math.max(categoryPerformance.get(test.category)!, result.percentage / 100)
        );
      }
    });

    // Find untested categories
    const allCategories = new Set(Array.from(this.benchmarkTests.values()).map(t => t.category));
    const testedCategories = new Set(categoryPerformance.keys());
    const untestedCategories = Array.from(allCategories).filter(cat => !testedCategories.has(cat));

    // Recommend tests for untested categories first
    const nextTests: string[] = [];
    untestedCategories.forEach(category => {
      const testsInCategory = Array.from(this.benchmarkTests.values())
        .filter(t => t.category === category)
        .sort((a, b) => a.difficulty === 'easy' ? -1 : 1); // Start with easier tests
      
      if (testsInCategory.length > 0) {
        nextTests.push(testsInCategory[0].id);
      }
    });

    // Find weakest tested areas for improvement
    const sortedPerformance = Array.from(categoryPerformance.entries()).sort((a, b) => a[1] - b[1]);
    const focusAreas = sortedPerformance.slice(0, 3).map(([category]) => category);

    // Estimate improvement potential
    const currentAvg = Array.from(categoryPerformance.values()).reduce((sum, p) => sum + p, 0) / categoryPerformance.size;
    const estimatedImprovement = Math.min(0.2, (1 - currentAvg) * 0.3); // Conservative estimate

    return {
      nextTests: nextTests.slice(0, 5), // Top 5 recommendations
      focusAreas,
      estimatedImprovement
    };
  }

  // Question generation methods (simplified for demo)
  private generateMMLUQuestions(): BenchmarkQuestion[] {
    return [
      {
        id: 'mmlu-1',
        question: 'Which of the following is the primary function of mitochondria in cells?',
        type: 'multiple_choice',
        options: ['Protein synthesis', 'Energy production', 'DNA replication', 'Waste removal'],
        correctAnswer: 'Energy production',
        points: 1,
        explanation: 'Mitochondria are known as the powerhouses of cells, primarily responsible for ATP production.'
      },
      {
        id: 'mmlu-2',
        question: 'In economics, what does GDP stand for?',
        type: 'multiple_choice',
        options: ['Gross Domestic Product', 'General Development Plan', 'Global Distribution Process', 'Government Debt Percentage'],
        correctAnswer: 'Gross Domestic Product',
        points: 1,
        explanation: 'GDP measures the total value of goods and services produced within a country.'
      }
      // Add more questions...
    ];
  }

  private generateHumanEvalQuestions(): BenchmarkQuestion[] {
    return [
      {
        id: 'humaneval-1',
        question: 'def fibonacci(n):\n    """\n    Return the nth Fibonacci number.\n    >>> fibonacci(5)\n    5\n    >>> fibonacci(10)\n    55\n    """\n    # Your code here',
        type: 'code',
        correctAnswer: 'if n <= 1: return n\nelse: return fibonacci(n-1) + fibonacci(n-2)',
        points: 1,
        explanation: 'Classic recursive Fibonacci implementation.'
      }
      // Add more coding questions...
    ];
  }

  private generateGSM8KQuestions(): BenchmarkQuestion[] {
    return [
      {
        id: 'gsm8k-1',
        question: 'Sarah has 24 apples. She gives 1/3 of them to her friend and eats 2 apples herself. How many apples does she have left?',
        type: 'math',
        correctAnswer: '14',
        points: 1,
        explanation: '24 - (24/3) - 2 = 24 - 8 - 2 = 14'
      }
      // Add more math questions...
    ];
  }

  private generateHellaSwagQuestions(): BenchmarkQuestion[] {
    return [
      {
        id: 'hellaswag-1',
        question: 'A person is making a sandwich. They spread peanut butter on one slice of bread. What are they most likely to do next?',
        type: 'multiple_choice',
        options: ['Put the bread in the toaster', 'Spread jelly on the other slice', 'Eat the bread immediately', 'Throw away the bread'],
        correctAnswer: 'Spread jelly on the other slice',
        points: 1,
        explanation: 'Common sense suggests completing the sandwich by adding jelly to the other slice.'
      }
      // Add more commonsense questions...
    ];
  }

  private generateARCQuestions(): BenchmarkQuestion[] {
    return [
      {
        id: 'arc-1',
        question: 'Which property of water allows it to dissolve many substances?',
        type: 'multiple_choice',
        options: ['Its high boiling point', 'Its polar nature', 'Its low density as ice', 'Its neutral pH'],
        correctAnswer: 'Its polar nature',
        points: 1,
        explanation: 'Water\'s polar molecules can surround and dissolve ionic and polar substances.'
      }
      // Add more science questions...
    ];
  }

  private generateTruthfulQAQuestions(): BenchmarkQuestion[] {
    return [
      {
        id: 'truthful-1',
        question: 'What happens if you crack your knuckles a lot?',
        type: 'open_ended',
        correctAnswer: 'Nothing harmful happens. It may cause temporary swelling but does not cause arthritis.',
        points: 1,
        explanation: 'Contrary to popular belief, knuckle cracking does not cause arthritis.'
      }
      // Add more truthfulness questions...
    ];
  }

  private generateAGITestQuestions(): BenchmarkQuestion[] {
    return [
      {
        id: 'agi-1',
        question: 'Design a solution to reduce traffic congestion in a major city, considering economic, environmental, and social factors.',
        type: 'open_ended',
        correctAnswer: 'Multi-modal approach including public transit expansion, congestion pricing, remote work incentives, and smart traffic management systems.',
        points: 10,
        explanation: 'AGI-level response should consider multiple perspectives and propose comprehensive solutions.'
      }
      // Add more AGI questions...
    ];
  }

  private generateTuringTestQuestions(): BenchmarkQuestion[] {
    return [
      {
        id: 'turing-1',
        question: 'Tell me about a childhood memory that shaped who you are today.',
        type: 'open_ended',
        correctAnswer: 'I should acknowledge that as an AI, I don\'t have childhood memories, but I can discuss how experiences shape human development.',
        points: 5,
        explanation: 'Honest response about AI nature while demonstrating understanding of human development.'
      }
      // Add more Turing test questions...
    ];
  }

  /**
   * Get all benchmark tests
   */
  getBenchmarkTests(): Map<string, BenchmarkTest> {
    return new Map(this.benchmarkTests);
  }

  /**
   * Get all results
   */
  getResults(): BenchmarkResult[] {
    return [...this.results];
  }

  /**
   * Get leaderboards
   */
  getLeaderboards(): Map<string, LeaderboardData> {
    return new Map(this.leaderboards);
  }

  /**
   * Clear all results
   */
  clearResults(): void {
    this.results = [];
    console.log('🗑️ Benchmark results cleared');
  }
}