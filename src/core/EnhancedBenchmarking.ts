/**
 * Enhanced Benchmarking System with Proof-of-Concept Output Generation
 * Provides detailed benchmark results with evidence for GitHub upload
 */

import { BenchmarkingSystem, BenchmarkResult, BenchmarkTest } from './BenchmarkingSystem';

export interface ProofOfConceptOutput {
  benchmarkId: string;
  timestamp: Date;
  systemResponse: string;
  expectedAnswer: string;
  reasoning: string;
  confidence: number;
  correct: boolean;
  processingTime: number;
  metadata: {
    questionType: string;
    difficulty: string;
    category: string;
    tokens: number;
  };
}

export interface BenchmarkReport {
  testId: string;
  testName: string;
  overallScore: number;
  totalQuestions: number;
  correctAnswers: number;
  averageConfidence: number;
  averageProcessingTime: number;
  categoryBreakdown: Map<string, number>;
  proofOfConcepts: ProofOfConceptOutput[];
  recommendations: string[];
  comparisonWithLeaderboards: any[];
}

export class EnhancedBenchmarking extends BenchmarkingSystem {
  private proofOfConcepts: Map<string, ProofOfConceptOutput[]> = new Map();
  private detailedReports: Map<string, BenchmarkReport> = new Map();

  constructor() {
    super();
    console.log('📊 Enhanced Benchmarking System with PoC generation initialized');
  }

  /**
   * Run enhanced benchmark with proof-of-concept generation
   */
  async runEnhancedBenchmark(
    testId: string, 
    systemResponse: (question: string) => Promise<{response: string, reasoning: string, confidence: number}>
  ): Promise<BenchmarkReport> {
    console.log(`📊 Running enhanced benchmark: ${testId} with PoC generation`);
    
    const test = this.getBenchmarkTests().get(testId);
    if (!test) {
      throw new Error(`Benchmark test not found: ${testId}`);
    }

    const startTime = Date.now();
    const proofOfConcepts: ProofOfConceptOutput[] = [];
    const categoryScores = new Map<string, {correct: number, total: number}>();
    
    let correctAnswers = 0;
    let totalConfidence = 0;
    let totalProcessingTime = 0;

    // Process each question with detailed tracking
    for (let i = 0; i < test.questions.length; i++) {
      const question = test.questions[i];
      const questionStartTime = Date.now();
      
      try {
        console.log(`📝 Processing question ${i + 1}/${test.questions.length}: ${question.type}`);
        
        // Get system response with reasoning
        const result = await systemResponse(question.question);
        const questionProcessingTime = Date.now() - questionStartTime;
        
        // Evaluate answer
        const isCorrect = this.evaluateAnswer(question, result.response);
        if (isCorrect) correctAnswers++;
        
        totalConfidence += result.confidence;
        totalProcessingTime += questionProcessingTime;
        
        // Track category performance
        const category = this.getQuestionCategory(question, test);
        if (!categoryScores.has(category)) {
          categoryScores.set(category, {correct: 0, total: 0});
        }
        const categoryScore = categoryScores.get(category)!;
        categoryScore.total++;
        if (isCorrect) categoryScore.correct++;
        
        // Generate proof of concept
        const poc: ProofOfConceptOutput = {
          benchmarkId: `${testId}-q${i + 1}`,
          timestamp: new Date(),
          systemResponse: result.response,
          expectedAnswer: question.correctAnswer || 'No expected answer provided',
          reasoning: result.reasoning,
          confidence: result.confidence,
          correct: isCorrect,
          processingTime: questionProcessingTime,
          metadata: {
            questionType: question.type,
            difficulty: test.difficulty,
            category: category,
            tokens: this.estimateTokenCount(question.question + result.response)
          }
        };
        
        proofOfConcepts.push(poc);
        
        // Add small delay to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`❌ Error processing question ${i + 1}:`, error);
        
        // Create error proof of concept
        const errorPoc: ProofOfConceptOutput = {
          benchmarkId: `${testId}-q${i + 1}`,
          timestamp: new Date(),
          systemResponse: `ERROR: ${error}`,
          expectedAnswer: question.correctAnswer || 'No expected answer provided',
          reasoning: 'Processing failed due to system error',
          confidence: 0,
          correct: false,
          processingTime: Date.now() - questionStartTime,
          metadata: {
            questionType: question.type,
            difficulty: test.difficulty,
            category: 'error',
            tokens: 0
          }
        };
        
        proofOfConcepts.push(errorPoc);
      }
    }

    // Calculate category breakdown
    const categoryBreakdown = new Map<string, number>();
    categoryScores.forEach((score, category) => {
      categoryBreakdown.set(category, score.total > 0 ? score.correct / score.total : 0);
    });

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      correctAnswers / test.questions.length,
      categoryBreakdown,
      totalConfidence / test.questions.length
    );

    // Compare with leaderboards
    const leaderboardComparisons = this.compareWithLeaderboards();
    const relevantComparison = leaderboardComparisons.find(comp => 
      comp.leaderboard.toLowerCase().includes(testId.toLowerCase())
    );

    // Create comprehensive report
    const report: BenchmarkReport = {
      testId,
      testName: test.name,
      overallScore: (correctAnswers / test.questions.length) * 100,
      totalQuestions: test.questions.length,
      correctAnswers,
      averageConfidence: totalConfidence / test.questions.length,
      averageProcessingTime: totalProcessingTime / test.questions.length,
      categoryBreakdown,
      proofOfConcepts,
      recommendations,
      comparisonWithLeaderboards: relevantComparison ? [relevantComparison] : []
    };

    // Store results
    this.proofOfConcepts.set(testId, proofOfConcepts);
    this.detailedReports.set(testId, report);

    console.log(`✅ Enhanced benchmark completed: ${test.name}`);
    console.log(`📊 Score: ${report.overallScore.toFixed(1)}% (${correctAnswers}/${test.questions.length})`);
    console.log(`🎯 Confidence: ${(report.averageConfidence * 100).toFixed(1)}%`);
    console.log(`⏱️ Avg Time: ${report.averageProcessingTime.toFixed(0)}ms per question`);

    return report;
  }

  private getQuestionCategory(question: any, test: BenchmarkTest): string {
    // Determine category based on question content and test type
    if (test.category === 'knowledge') {
      const content = question.question.toLowerCase();
      if (content.includes('science') || content.includes('physics') || content.includes('chemistry')) {
        return 'science';
      } else if (content.includes('history') || content.includes('historical')) {
        return 'history';
      } else if (content.includes('math') || content.includes('calculate')) {
        return 'mathematics';
      } else if (content.includes('literature') || content.includes('language')) {
        return 'language_arts';
      } else {
        return 'general_knowledge';
      }
    } else {
      return test.category;
    }
  }

  private estimateTokenCount(text: string): number {
    // Rough token estimation (1 token ≈ 4 characters for English)
    return Math.ceil(text.length / 4);
  }

  private generateRecommendations(
    overallScore: number, 
    categoryBreakdown: Map<string, number>,
    averageConfidence: number
  ): string[] {
    const recommendations: string[] = [];

    // Overall performance recommendations
    if (overallScore < 0.5) {
      recommendations.push('Focus on fundamental training - consider additional algorithm evolution cycles');
    } else if (overallScore < 0.7) {
      recommendations.push('Good progress - target specific weak areas for improvement');
    } else if (overallScore < 0.9) {
      recommendations.push('Strong performance - fine-tune for expert-level capabilities');
    } else {
      recommendations.push('Excellent performance - ready for advanced challenges');
    }

    // Category-specific recommendations
    const sortedCategories = Array.from(categoryBreakdown.entries())
      .sort((a, b) => a[1] - b[1]);
    
    if (sortedCategories.length > 0) {
      const weakestCategory = sortedCategories[0];
      if (weakestCategory[1] < 0.6) {
        recommendations.push(`Improve ${weakestCategory[0]} capabilities through targeted training`);
      }
    }

    // Confidence recommendations
    if (averageConfidence < 0.6) {
      recommendations.push('Increase confidence through additional validation and truth verification');
    } else if (averageConfidence > 0.9) {
      recommendations.push('High confidence levels - consider more challenging benchmarks');
    }

    // Training recommendations
    recommendations.push('Continue algorithm evolution through ARIEL debate teams');
    recommendations.push('Maintain truth stratification protocols for accuracy');
    
    if (overallScore > 0.8) {
      recommendations.push('Consider advancing to next multi-modal capability');
    }

    return recommendations;
  }

  /**
   * Generate GitHub-ready proof of concept documentation
   */
  generateGitHubReport(testId: string): string {
    const report = this.detailedReports.get(testId);
    if (!report) {
      throw new Error(`No report found for test: ${testId}`);
    }

    let markdown = `# ${report.testName} Benchmark Report\n\n`;
    markdown += `**Generated:** ${report.proofOfConcepts[0]?.timestamp.toISOString()}\n`;
    markdown += `**Test ID:** ${testId}\n\n`;

    // Executive Summary
    markdown += `## Executive Summary\n\n`;
    markdown += `- **Overall Score:** ${report.overallScore.toFixed(1)}% (${report.correctAnswers}/${report.totalQuestions})\n`;
    markdown += `- **Average Confidence:** ${(report.averageConfidence * 100).toFixed(1)}%\n`;
    markdown += `- **Average Processing Time:** ${report.averageProcessingTime.toFixed(0)}ms per question\n`;
    markdown += `- **Success Rate:** ${((report.correctAnswers / report.totalQuestions) * 100).toFixed(1)}%\n\n`;

    // Category Breakdown
    if (report.categoryBreakdown.size > 0) {
      markdown += `## Category Performance\n\n`;
      markdown += `| Category | Score | Performance |\n`;
      markdown += `|----------|-------|-------------|\n`;
      
      Array.from(report.categoryBreakdown.entries())
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, score]) => {
          const percentage = (score * 100).toFixed(1);
          const performance = score > 0.8 ? '🟢 Excellent' : score > 0.6 ? '🟡 Good' : '🔴 Needs Improvement';
          markdown += `| ${category} | ${percentage}% | ${performance} |\n`;
        });
      markdown += '\n';
    }

    // Leaderboard Comparison
    if (report.comparisonWithLeaderboards.length > 0) {
      markdown += `## Leaderboard Comparison\n\n`;
      report.comparisonWithLeaderboards.forEach(comp => {
        markdown += `- **${comp.leaderboard}:** Rank #${comp.rank} (${comp.percentile.toFixed(1)}th percentile)\n`;
        markdown += `- **Our Score:** ${comp.ourScore.toFixed(1)}% vs **Top Score:** ${comp.topScore.toFixed(1)}%\n`;
        markdown += `- **Gap to #1:** ${comp.gap.toFixed(1)} points\n\n`;
      });
    }

    // Sample Proof of Concepts
    markdown += `## Sample Proof of Concepts\n\n`;
    markdown += `The following examples demonstrate the system's reasoning and response quality:\n\n`;

    // Show top 5 correct answers and top 3 incorrect ones
    const correctPocs = report.proofOfConcepts.filter(poc => poc.correct).slice(0, 5);
    const incorrectPocs = report.proofOfConcepts.filter(poc => !poc.correct).slice(0, 3);

    correctPocs.forEach((poc, index) => {
      markdown += `### ✅ Correct Answer ${index + 1}\n\n`;
      markdown += `**Question Type:** ${poc.metadata.questionType} (${poc.metadata.difficulty})\n`;
      markdown += `**Confidence:** ${(poc.confidence * 100).toFixed(1)}%\n`;
      markdown += `**Processing Time:** ${poc.processingTime}ms\n\n`;
      markdown += `**System Response:**\n`;
      markdown += `\`\`\`\n${poc.systemResponse.substring(0, 500)}${poc.systemResponse.length > 500 ? '...' : ''}\n\`\`\`\n\n`;
      markdown += `**Reasoning:**\n`;
      markdown += `\`\`\`\n${poc.reasoning.substring(0, 300)}${poc.reasoning.length > 300 ? '...' : ''}\n\`\`\`\n\n`;
    });

    if (incorrectPocs.length > 0) {
      markdown += `### ❌ Areas for Improvement\n\n`;
      incorrectPocs.forEach((poc, index) => {
        markdown += `#### Incorrect Answer ${index + 1}\n\n`;
        markdown += `**Question Type:** ${poc.metadata.questionType}\n`;
        markdown += `**Confidence:** ${(poc.confidence * 100).toFixed(1)}%\n\n`;
        markdown += `**System Response:**\n`;
        markdown += `\`\`\`\n${poc.systemResponse.substring(0, 300)}${poc.systemResponse.length > 300 ? '...' : ''}\n\`\`\`\n\n`;
        markdown += `**Expected Answer:**\n`;
        markdown += `\`\`\`\n${poc.expectedAnswer.substring(0, 300)}${poc.expectedAnswer.length > 300 ? '...' : ''}\n\`\`\`\n\n`;
      });
    }

    // Recommendations
    markdown += `## Recommendations\n\n`;
    report.recommendations.forEach(rec => {
      markdown += `- ${rec}\n`;
    });
    markdown += '\n';

    // Technical Details
    markdown += `## Technical Details\n\n`;
    markdown += `- **Total Questions Processed:** ${report.totalQuestions}\n`;
    markdown += `- **Average Tokens per Response:** ${Math.round(report.proofOfConcepts.reduce((sum, poc) => sum + poc.metadata.tokens, 0) / report.proofOfConcepts.length)}\n`;
    markdown += `- **Question Types:** ${[...new Set(report.proofOfConcepts.map(poc => poc.metadata.questionType))].join(', ')}\n`;
    markdown += `- **Categories Tested:** ${Array.from(report.categoryBreakdown.keys()).join(', ')}\n\n`;

    // Methodology
    markdown += `## Methodology\n\n`;
    markdown += `This benchmark was conducted using the MachineGod AlphaEvolve system with:\n\n`;
    markdown += `- **Truth Stratification:** Ω₁, Ω₂, Ω₃ verification layers\n`;
    markdown += `- **ARIEL Debate Teams:** 4x4 agent teams with specialized roles\n`;
    markdown += `- **Algorithm Evolution:** Continuous improvement through genetic programming\n`;
    markdown += `- **Ethical Safeguards:** ψ = ∫(Q⊗S)dt ≥ Γ_crit monitoring\n`;
    markdown += `- **Multi-Modal Integration:** Progressive capability unlocking\n\n`;

    markdown += `## Reproducibility\n\n`;
    markdown += `All benchmark results are reproducible using the same system configuration. `;
    markdown += `The proof-of-concept outputs demonstrate consistent reasoning patterns and `;
    markdown += `can be verified against the original benchmark questions.\n\n`;

    markdown += `---\n`;
    markdown += `*Generated by MachineGod AlphaEvolve Benchmarking System*\n`;

    return markdown;
  }

  /**
   * Export all proof of concepts as JSON for analysis
   */
  exportProofOfConcepts(testId: string): string {
    const pocs = this.proofOfConcepts.get(testId);
    if (!pocs) {
      throw new Error(`No proof of concepts found for test: ${testId}`);
    }

    return JSON.stringify({
      testId,
      timestamp: new Date().toISOString(),
      totalProofOfConcepts: pocs.length,
      proofOfConcepts: pocs
    }, null, 2);
  }

  /**
   * Get detailed benchmark report
   */
  getDetailedReport(testId: string): BenchmarkReport | null {
    return this.detailedReports.get(testId) || null;
  }

  /**
   * Get all available reports
   */
  getAllReports(): Map<string, BenchmarkReport> {
    return new Map(this.detailedReports);
  }

  /**
   * Generate comprehensive system evaluation
   */
  generateSystemEvaluation(): string {
    const allReports = Array.from(this.detailedReports.values());
    if (allReports.length === 0) {
      return 'No benchmark reports available for system evaluation.';
    }

    let evaluation = '# MachineGod System Evaluation Report\n\n';
    
    // Overall statistics
    const totalQuestions = allReports.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalCorrect = allReports.reduce((sum, r) => sum + r.correctAnswers, 0);
    const avgConfidence = allReports.reduce((sum, r) => sum + r.averageConfidence, 0) / allReports.length;
    const avgProcessingTime = allReports.reduce((sum, r) => sum + r.averageProcessingTime, 0) / allReports.length;

    evaluation += `## System Performance Summary\n\n`;
    evaluation += `- **Total Questions Processed:** ${totalQuestions}\n`;
    evaluation += `- **Overall Accuracy:** ${((totalCorrect / totalQuestions) * 100).toFixed(1)}%\n`;
    evaluation += `- **Average Confidence:** ${(avgConfidence * 100).toFixed(1)}%\n`;
    evaluation += `- **Average Processing Time:** ${avgProcessingTime.toFixed(0)}ms\n`;
    evaluation += `- **Benchmarks Completed:** ${allReports.length}\n\n`;

    // Individual benchmark performance
    evaluation += `## Benchmark Results\n\n`;
    evaluation += `| Benchmark | Score | Questions | Confidence | Time (ms) |\n`;
    evaluation += `|-----------|-------|-----------|------------|----------|\n`;
    
    allReports.forEach(report => {
      evaluation += `| ${report.testName} | ${report.overallScore.toFixed(1)}% | ${report.totalQuestions} | ${(report.averageConfidence * 100).toFixed(1)}% | ${report.averageProcessingTime.toFixed(0)} |\n`;
    });

    evaluation += '\n';

    // System capabilities assessment
    evaluation += `## Capability Assessment\n\n`;
    
    const overallScore = (totalCorrect / totalQuestions) * 100;
    if (overallScore >= 90) {
      evaluation += `🟢 **Expert Level Performance** - System demonstrates expert-level capabilities across multiple domains.\n\n`;
    } else if (overallScore >= 75) {
      evaluation += `🟡 **Advanced Performance** - System shows strong capabilities with room for optimization.\n\n`;
    } else if (overallScore >= 60) {
      evaluation += `🟠 **Intermediate Performance** - System demonstrates solid foundational capabilities.\n\n`;
    } else {
      evaluation += `🔴 **Developing Performance** - System requires additional training and optimization.\n\n`;
    }

    // Recommendations for improvement
    evaluation += `## System Recommendations\n\n`;
    const allRecommendations = allReports.flatMap(r => r.recommendations);
    const uniqueRecommendations = [...new Set(allRecommendations)];
    
    uniqueRecommendations.forEach(rec => {
      evaluation += `- ${rec}\n`;
    });

    return evaluation;
  }
}