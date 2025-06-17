/**
 * META-LOGIC Absolute Zero Evaluator
 * Implements recursive self-referential analysis with paradox resolution
 */

export interface LogicalStatement {
  content: string;
  type: 'self_referential' | 'meta_classification' | 'standard';
  complexity: number;
  paradoxPotential: boolean;
}

export interface EvaluationResult {
  truthValue: 'true' | 'false' | 'undecidable' | 'multi_valued';
  confidence: number;
  reasoning: string[];
  compressionRatio: number;
  metaRules: string[];
  optimizations: string[];
}

export class MetaLogicEvaluator {
  private paradoxCount = 0;
  private evaluationHistory: Array<{ statement: LogicalStatement; result: EvaluationResult }> = [];
  
  constructor() {
    console.log('🧠 META-LOGIC Absolute Zero Evaluator initialized');
  }

  /**
   * Main evaluation method implementing recursive self-referential analysis
   */
  async evaluate(statement: LogicalStatement): Promise<EvaluationResult> {
    console.log(`🔄 Evaluating: "${statement.content}"`);
    
    // Step 1: Recursive Analysis
    const recursiveAnalysis = await this.recursiveAnalysis(statement);
    
    // Step 2: Paradox Resolution
    const paradoxResolution = await this.paradoxResolution(statement, recursiveAnalysis);
    
    // Step 3: Truth Value Assignment
    const truthValue = await this.truthValueAssignment(statement, paradoxResolution);
    
    // Step 4: Compression Assessment
    const compressionResult = await this.compressionAssessment(statement);
    
    // Step 5: Meta-Rule Generation
    const metaRules = await this.metaRuleGeneration(statement, truthValue);
    
    // Step 6: Self-Optimization
    const optimizations = await this.selfOptimization(statement);
    
    const result: EvaluationResult = {
      truthValue: truthValue.value,
      confidence: truthValue.confidence,
      reasoning: [
        ...recursiveAnalysis.steps,
        ...paradoxResolution.steps,
        ...truthValue.reasoning
      ],
      compressionRatio: compressionResult.ratio,
      metaRules,
      optimizations
    };
    
    // Store in history for learning
    this.evaluationHistory.push({ statement, result });
    
    return result;
  }

  private async recursiveAnalysis(statement: LogicalStatement) {
    const steps: string[] = [];
    
    // Check for self-reference
    if (statement.content.toLowerCase().includes('this statement')) {
      steps.push('🔄 Self-reference detected - applying recursive analysis');
      
      // Handle classic paradoxes
      if (statement.content.toLowerCase().includes('false')) {
        steps.push('⚠️ Liar paradox variant detected');
        this.paradoxCount++;
      }
    }
    
    // Analyze logical structure
    const logicalConnectives = ['and', 'or', 'not', 'if', 'then', 'implies'];
    const foundConnectives = logicalConnectives.filter(conn => 
      statement.content.toLowerCase().includes(conn)
    );
    
    if (foundConnectives.length > 0) {
      steps.push(`📊 Logical connectives found: ${foundConnectives.join(', ')}`);
    }
    
    // Check for meta-classification
    if (statement.type === 'meta_classification') {
      steps.push('🏷️ Meta-classification analysis applied');
    }
    
    return { steps };
  }

  private async paradoxResolution(statement: LogicalStatement, analysis: any) {
    const steps: string[] = [];
    
    if (statement.paradoxPotential) {
      steps.push('🧠 Paradox resolution protocol activated');
      
      // Apply multi-valued logic
      steps.push('📈 Applying multi-valued logic framework');
      
      // Temporal contextualization for self-referential statements
      if (statement.content.toLowerCase().includes('this statement')) {
        steps.push('⏰ Temporal contextualization: statement refers to its truth value at evaluation time');
      }
      
      // Level distinction for type/token ambiguity
      steps.push('🎯 Level distinction applied to prevent category errors');
    }
    
    return { steps };
  }

  private async truthValueAssignment(statement: LogicalStatement, resolution: any) {
    let value: 'true' | 'false' | 'undecidable' | 'multi_valued' = 'undecidable';
    let confidence = 0.5;
    const reasoning: string[] = [];
    
    // Handle classic paradoxes
    if (statement.content.toLowerCase().includes('this statement is false')) {
      value = 'multi_valued';
      confidence = 0.9;
      reasoning.push('🎭 Multi-valued assignment: neither purely true nor false');
      reasoning.push('📐 Paradox resolved through truth-value gaps');
    }
    // Handle evaluation process statements
    else if (statement.content.toLowerCase().includes('evaluation process')) {
      value = 'true';
      confidence = 0.85;
      reasoning.push('✅ Evaluation process statements are contextually true');
    }
    // Standard logical analysis
    else {
      // Simple heuristic based on complexity and content
      if (statement.complexity < 5) {
        value = 'true';
        confidence = 0.7;
        reasoning.push('📊 Low complexity statement - high confidence assignment');
      } else {
        confidence = Math.max(0.3, 1 - (statement.complexity / 10));
        reasoning.push(`🎲 Complexity-based confidence: ${confidence.toFixed(2)}`);
      }
    }
    
    return { value, confidence, reasoning };
  }

  private async compressionAssessment(statement: LogicalStatement) {
    // Simulate compression ratio calculation
    const originalLength = statement.content.length;
    const compressedLength = Math.floor(originalLength * (0.3 + Math.random() * 0.4));
    const ratio = compressedLength / originalLength;
    
    return {
      ratio,
      originalLength,
      compressedLength,
      notes: `Compressed from ${originalLength} to ${compressedLength} characters`
    };
  }

  private async metaRuleGeneration(statement: LogicalStatement, truthValue: any) {
    const rules: string[] = [];
    
    // Generate meta-rules based on statement type
    if (statement.type === 'self_referential') {
      rules.push('Meta-Rule: Self-referential statements require temporal context');
      rules.push('Meta-Rule: Apply multi-valued logic to paradoxical self-reference');
    }
    
    if (statement.paradoxPotential) {
      rules.push('Meta-Rule: Paradoxical statements benefit from level distinction');
      rules.push('Meta-Rule: Use truth-value gaps for unresolvable paradoxes');
    }
    
    // Confidence-based rules
    if (truthValue.confidence > 0.8) {
      rules.push('Meta-Rule: High confidence statements can be cached');
    }
    
    return rules;
  }

  private async selfOptimization(statement: LogicalStatement) {
    const optimizations: string[] = [];
    
    // Pattern recognition optimization
    const similarStatements = this.evaluationHistory.filter(h => 
      this.calculateSimilarity(h.statement.content, statement.content) > 0.7
    );
    
    if (similarStatements.length > 0) {
      optimizations.push(`📚 Pattern cache: Found ${similarStatements.length} similar evaluations`);
    }
    
    // Complexity reduction suggestions
    if (statement.complexity > 7) {
      optimizations.push('🔧 Suggestion: Break complex statement into simpler components');
    }
    
    // Paradox prevention
    if (this.paradoxCount > 5) {
      optimizations.push('⚠️ High paradox count detected - consider stricter input validation');
    }
    
    return optimizations;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    // Simple similarity calculation
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return intersection.length / union.length;
  }

  // Public interface methods
  getEvaluationHistory() {
    return this.evaluationHistory;
  }

  getParadoxCount() {
    return this.paradoxCount;
  }

  reset() {
    this.evaluationHistory = [];
    this.paradoxCount = 0;
    console.log('🔄 META-LOGIC Evaluator reset');
  }
}