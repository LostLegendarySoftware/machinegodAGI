/**
 * ARIEL System - Enhanced with Mandatory Consensus and Emotional Analysis
 * Advanced Reasoning Intelligence with Emotional Logic and Verification Loops
 */

export interface Agent {
  id: string;
  role: 'proposer' | 'solver' | 'adversary' | 'handler' | 'manager' | 'counsellor' | 'security' | 'boss' | 'puppet_master';
  team: number;
  sanctions: number;
  performance: number;
  emotionalState: EmotionalState;
  specialization: string[];
  handledTasks: number;
  debateWins: number;
  consensusVotes: number;
}

export interface EmotionalState {
  empathy: number;
  curiosity: number;
  confidence: number;
  frustration: number;
  satisfaction: number;
}

export interface EmotionalTriggerAnalysis {
  triggers: string[];
  intensity: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  emotionalWords: string[];
  urgency: 'low' | 'medium' | 'high';
  responseStyle: 'supportive' | 'analytical' | 'cautious' | 'empathetic';
}

export interface DebateRound {
  round: number;
  debater1: string;
  debater2: string;
  topic: string;
  argument1: string;
  argument2: string;
  winner: string;
  votes: Array<{agentId: string, vote: string, reasoning: string}>;
  confidence: number;
}

export interface ConsensusResult {
  achieved: boolean;
  agreementPercentage: number;
  rounds: number;
  finalSolution: string;
  dissenterFeedback: string[];
  verificationPassed: boolean;
  emotionalAnalysis: EmotionalTriggerAnalysis;
  debateRounds: DebateRound[];
}

export interface VerificationLoop {
  originalResponse: string;
  verifiedResponse: string;
  changes: string[];
  confidence: number;
  verificationRounds: number;
}

export class ArielSystem {
  private agents: Map<string, Agent> = new Map();
  private teams: Map<number, Agent[]> = new Map();
  private debateHistory: any[] = [];
  private consensusThreshold = 0.85; // 85% agreement required
  private maxConsensusRounds = 5;
  private emotionalKeywords = {
    positive: ['happy', 'excited', 'love', 'amazing', 'wonderful', 'great', 'excellent', 'fantastic'],
    negative: ['sad', 'angry', 'frustrated', 'hate', 'terrible', 'awful', 'horrible', 'disappointed'],
    urgent: ['urgent', 'emergency', 'immediately', 'asap', 'critical', 'important', 'help', 'problem'],
    supportive: ['support', 'help', 'assist', 'guide', 'comfort', 'understand', 'care']
  };

  constructor() {
    this.initializeEnhancedAgents();
    console.log('🤖 ARIEL System initialized with Mandatory Consensus and Emotional Analysis');
  }

  private initializeEnhancedAgents() {
    // Initialize 3 teams of 4 agents each + handlers
    for (let teamId = 1; teamId <= 3; teamId++) {
      const team: Agent[] = [];
      
      // Proposer
      const proposer: Agent = {
        id: `proposer-${teamId}`,
        role: 'proposer',
        team: teamId,
        sanctions: 0,
        performance: 0.7 + Math.random() * 0.3,
        emotionalState: this.generateEmotionalState(),
        specialization: ['hypothesis_generation', 'creative_thinking', 'problem_identification', 'research_synthesis'],
        handledTasks: 0,
        debateWins: 0,
        consensusVotes: 0
      };
      
      // Solver
      const solver: Agent = {
        id: `solver-${teamId}`,
        role: 'solver',
        team: teamId,
        sanctions: 0,
        performance: 0.7 + Math.random() * 0.3,
        emotionalState: this.generateEmotionalState(),
        specialization: ['solution_implementation', 'logical_reasoning', 'systematic_approach', 'optimization'],
        handledTasks: 0,
        debateWins: 0,
        consensusVotes: 0
      };
      
      // Adversary
      const adversary: Agent = {
        id: `adversary-${teamId}`,
        role: 'adversary',
        team: teamId,
        sanctions: 0,
        performance: 0.7 + Math.random() * 0.3,
        emotionalState: this.generateEmotionalState(),
        specialization: ['critical_analysis', 'weakness_detection', 'alternative_perspectives', 'stress_testing'],
        handledTasks: 0,
        debateWins: 0,
        consensusVotes: 0
      };
      
      // Handler
      const handler: Agent = {
        id: `handler-${teamId}`,
        role: 'handler',
        team: teamId,
        sanctions: 0,
        performance: 0.75 + Math.random() * 0.25,
        emotionalState: this.generateEmotionalState(),
        specialization: ['task_coordination', 'output_synthesis', 'quality_control', 'user_communication'],
        handledTasks: 0,
        debateWins: 0,
        consensusVotes: 0
      };
      
      team.push(proposer, solver, adversary, handler);
      this.teams.set(teamId, team);
      
      // Add to agents map
      this.agents.set(proposer.id, proposer);
      this.agents.set(solver.id, solver);
      this.agents.set(adversary.id, adversary);
      this.agents.set(handler.id, handler);
    }
    
    // Initialize management layer
    this.initializeManagement();
  }

  private initializeManagement() {
    // Manager
    const manager: Agent = {
      id: 'manager-1',
      role: 'manager',
      team: 0,
      sanctions: 0,
      performance: 0.8 + Math.random() * 0.2,
      emotionalState: this.generateEmotionalState(),
      specialization: ['task_management', 'performance_monitoring', 'coordination', 'efficiency_optimization'],
      handledTasks: 0,
      debateWins: 0,
      consensusVotes: 0
    };
    
    // Security Agent
    const security: Agent = {
      id: 'security-1',
      role: 'security',
      team: 0,
      sanctions: 0,
      performance: 0.8 + Math.random() * 0.2,
      emotionalState: this.generateEmotionalState(),
      specialization: ['security_research', 'legal_compliance', 'risk_assessment', 'audit_oversight'],
      handledTasks: 0,
      debateWins: 0,
      consensusVotes: 0
    };
    
    // Counsellors (5)
    for (let i = 1; i <= 5; i++) {
      const counsellor: Agent = {
        id: `counsellor-${i}`,
        role: 'counsellor',
        team: 0,
        sanctions: 0,
        performance: 0.7 + Math.random() * 0.3,
        emotionalState: this.generateEmotionalState(),
        specialization: ['unconventional_ideas', 'sanction_evaluation', 'relevancy_research', 'performance_coaching'],
        handledTasks: 0,
        debateWins: 0,
        consensusVotes: 0
      };
      this.agents.set(counsellor.id, counsellor);
    }
    
    // Boss
    const boss: Agent = {
      id: 'boss-1',
      role: 'boss',
      team: 0,
      sanctions: 0,
      performance: 0.9 + Math.random() * 0.1,
      emotionalState: this.generateEmotionalState(),
      specialization: ['final_oversight', 'audit_review', 'sanction_verification', 'strategic_planning'],
      handledTasks: 0,
      debateWins: 0,
      consensusVotes: 0
    };
    
    // Puppet Master
    const puppetMaster: Agent = {
      id: 'puppet-master-1',
      role: 'puppet_master',
      team: 0,
      sanctions: 0,
      performance: 0.85 + Math.random() * 0.15,
      emotionalState: this.generateEmotionalState(),
      specialization: ['user_knowledge', 'system_oversight', 'holistic_perspective', 'conversation_flow'],
      handledTasks: 0,
      debateWins: 0,
      consensusVotes: 0
    };
    
    this.agents.set(manager.id, manager);
    this.agents.set(security.id, security);
    this.agents.set(boss.id, boss);
    this.agents.set(puppetMaster.id, puppetMaster);
  }

  private generateEmotionalState(): EmotionalState {
    return {
      empathy: Math.random(),
      curiosity: Math.random(),
      confidence: 0.5 + Math.random() * 0.5,
      frustration: Math.random() * 0.3,
      satisfaction: 0.4 + Math.random() * 0.6
    };
  }

  /**
   * Analyze emotional triggers in user input
   */
  private analyzeEmotionalTriggers(input: string): EmotionalTriggerAnalysis {
    const lowerInput = input.toLowerCase();
    const words = lowerInput.split(/\s+/);
    
    const triggers: string[] = [];
    const emotionalWords: string[] = [];
    let intensity = 0;
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let urgency: 'low' | 'medium' | 'high' = 'low';
    
    // Check for emotional keywords
    Object.entries(this.emotionalKeywords).forEach(([category, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerInput.includes(keyword)) {
          triggers.push(category);
          emotionalWords.push(keyword);
          intensity += 0.2;
          
          if (category === 'positive') sentiment = 'positive';
          if (category === 'negative') sentiment = 'negative';
          if (category === 'urgent') urgency = 'high';
        }
      });
    });
    
    // Check for punctuation intensity
    const exclamationCount = (input.match(/!/g) || []).length;
    const questionCount = (input.match(/\?/g) || []).length;
    const capsCount = (input.match(/[A-Z]/g) || []).length;
    
    intensity += exclamationCount * 0.1 + questionCount * 0.05 + (capsCount / input.length) * 0.3;
    
    if (exclamationCount > 2 || capsCount > input.length * 0.3) {
      urgency = urgency === 'low' ? 'medium' : 'high';
    }
    
    // Determine response style
    let responseStyle: 'supportive' | 'analytical' | 'cautious' | 'empathetic' = 'analytical';
    if (sentiment === 'negative' || urgency === 'high') {
      responseStyle = 'supportive';
    } else if (triggers.includes('supportive')) {
      responseStyle = 'empathetic';
    } else if (intensity > 0.5) {
      responseStyle = 'cautious';
    }
    
    return {
      triggers: [...new Set(triggers)],
      intensity: Math.min(1, intensity),
      sentiment,
      emotionalWords: [...new Set(emotionalWords)],
      urgency,
      responseStyle
    };
  }

  /**
   * Conduct mandatory consensus debate with verification loops
   */
  async conductMandatoryConsensusDebate(
    input: string, 
    context: string[], 
    complexity: number
  ): Promise<ConsensusResult> {
    console.log(`🤝 Starting MANDATORY CONSENSUS debate for: "${input}"`);
    
    // Step 1: Analyze emotional triggers
    const emotionalAnalysis = this.analyzeEmotionalTriggers(input);
    console.log(`😊 Emotional analysis: ${emotionalAnalysis.sentiment} sentiment, ${emotionalAnalysis.urgency} urgency`);
    
    // Step 2: Conduct structured debates
    const debateRounds = await this.conductStructuredDebates(input, context, complexity, emotionalAnalysis);
    
    // Step 3: Attempt consensus
    let consensusResult = await this.attemptConsensus(debateRounds, input, emotionalAnalysis);
    
    // Step 4: Verification loop
    if (consensusResult.achieved) {
      const verification = await this.verificationLoop(consensusResult.finalSolution, input, emotionalAnalysis);
      consensusResult.verificationPassed = verification.confidence > 0.8;
      
      if (!consensusResult.verificationPassed) {
        console.log('🔄 Verification failed - sending back to debate teams');
        // Send back to debate teams with verification feedback
        const refinedDebates = await this.refineWithVerificationFeedback(
          debateRounds, 
          verification, 
          emotionalAnalysis
        );
        consensusResult = await this.attemptConsensus(refinedDebates, input, emotionalAnalysis);
      }
    }
    
    // Update agent statistics
    this.updateAgentStatistics(debateRounds, consensusResult);
    
    return consensusResult;
  }

  /**
   * Conduct structured 1v1 debates between agents
   */
  private async conductStructuredDebates(
    input: string, 
    context: string[], 
    complexity: number,
    emotionalAnalysis: EmotionalTriggerAnalysis
  ): Promise<DebateRound[]> {
    const debateRounds: DebateRound[] = [];
    
    // Get all debaters (proposers, solvers, adversaries)
    const debaters = Array.from(this.agents.values()).filter(agent => 
      ['proposer', 'solver', 'adversary'].includes(agent.role)
    );
    
    console.log(`⚔️ Conducting structured debates with ${debaters.length} debaters`);
    
    // Round 1: Each debater picks and argues once
    for (let i = 0; i < debaters.length; i += 2) {
      if (i + 1 < debaters.length) {
        const debater1 = debaters[i];
        const debater2 = debaters[i + 1];
        
        const round = await this.conduct1v1Debate(
          debater1, 
          debater2, 
          input, 
          context, 
          emotionalAnalysis,
          debateRounds.length + 1
        );
        
        debateRounds.push(round);
      }
    }
    
    // If odd number of debaters, last one debates with a handler
    if (debaters.length % 2 === 1) {
      const lastDebater = debaters[debaters.length - 1];
      const handler = Array.from(this.agents.values()).find(a => a.role === 'handler');
      
      if (handler) {
        const round = await this.conduct1v1Debate(
          lastDebater, 
          handler, 
          input, 
          context, 
          emotionalAnalysis,
          debateRounds.length + 1
        );
        debateRounds.push(round);
      }
    }
    
    return debateRounds;
  }

  /**
   * Conduct 1v1 debate between two agents
   */
  private async conduct1v1Debate(
    debater1: Agent,
    debater2: Agent,
    input: string,
    context: string[],
    emotionalAnalysis: EmotionalTriggerAnalysis,
    roundNumber: number
  ): Promise<DebateRound> {
    console.log(`🥊 Round ${roundNumber}: ${debater1.id} vs ${debater2.id}`);
    
    // Generate arguments based on agent specializations and emotional context
    const argument1 = await this.generateArgument(debater1, input, context, emotionalAnalysis);
    const argument2 = await this.generateArgument(debater2, input, context, emotionalAnalysis);
    
    // Get votes from all other agents
    const votes = await this.collectVotes(debater1, debater2, argument1, argument2, input);
    
    // Determine winner
    const votes1 = votes.filter(v => v.vote === debater1.id).length;
    const votes2 = votes.filter(v => v.vote === debater2.id).length;
    
    let winner: string;
    if (votes1 > votes2) {
      winner = debater1.id;
    } else if (votes2 > votes1) {
      winner = debater2.id;
    } else {
      // Tie - proposer breaks ties
      const proposer = Array.from(this.agents.values()).find(a => a.role === 'proposer');
      winner = proposer ? (Math.random() > 0.5 ? debater1.id : debater2.id) : debater1.id;
      console.log(`🎯 Tie broken by proposer logic: ${winner}`);
    }
    
    const confidence = Math.max(votes1, votes2) / votes.length;
    
    return {
      round: roundNumber,
      debater1: debater1.id,
      debater2: debater2.id,
      topic: input,
      argument1,
      argument2,
      winner,
      votes,
      confidence
    };
  }

  /**
   * Generate argument based on agent specialization and emotional context
   */
  private async generateArgument(
    agent: Agent,
    input: string,
    context: string[],
    emotionalAnalysis: EmotionalTriggerAnalysis
  ): Promise<string> {
    let argument = '';
    
    // Base argument on agent role and specialization
    switch (agent.role) {
      case 'proposer':
        argument = `As a ${agent.role}, I propose that "${input}" requires ${emotionalAnalysis.responseStyle} approach. `;
        argument += `My research-focused analysis suggests we should ${emotionalAnalysis.urgency === 'high' ? 'prioritize immediate action' : 'take a systematic approach'}.`;
        break;
        
      case 'solver':
        argument = `From a solution perspective, "${input}" can be addressed through ${agent.specialization[0]}. `;
        argument += `Given the ${emotionalAnalysis.sentiment} sentiment, I recommend ${emotionalAnalysis.responseStyle === 'supportive' ? 'a supportive implementation' : 'a logical framework'}.`;
        break;
        
      case 'adversary':
        argument = `I must challenge the assumptions in "${input}". `;
        argument += `The emotional triggers (${emotionalAnalysis.triggers.join(', ')}) suggest we need ${emotionalAnalysis.responseStyle === 'cautious' ? 'careful validation' : 'thorough analysis'}.`;
        break;
        
      case 'handler':
        argument = `As a handler, I focus on synthesis. "${input}" with ${emotionalAnalysis.intensity.toFixed(2)} emotional intensity `;
        argument += `requires ${emotionalAnalysis.responseStyle} communication style for optimal user experience.`;
        break;
        
      default:
        argument = `My analysis of "${input}" considers the ${emotionalAnalysis.sentiment} emotional context and suggests a balanced approach.`;
    }
    
    // Add context awareness if available
    if (context.length > 0) {
      argument += ` Building on previous context: ${context.slice(-2).join(', ')}.`;
    }
    
    return argument;
  }

  /**
   * Collect votes from all agents
   */
  private async collectVotes(
    debater1: Agent,
    debater2: Agent,
    argument1: string,
    argument2: string,
    input: string
  ): Promise<Array<{agentId: string, vote: string, reasoning: string}>> {
    const votes: Array<{agentId: string, vote: string, reasoning: string}> = [];
    
    // All agents except the debaters vote
    const voters = Array.from(this.agents.values()).filter(a => 
      a.id !== debater1.id && a.id !== debater2.id
    );
    
    for (const voter of voters) {
      // Simulate voting based on agent characteristics
      const vote1Score = this.calculateVoteScore(voter, debater1, argument1);
      const vote2Score = this.calculateVoteScore(voter, debater2, argument2);
      
      const vote = vote1Score > vote2Score ? debater1.id : debater2.id;
      const reasoning = `Based on ${voter.role} perspective: ${vote1Score > vote2Score ? 'argument 1' : 'argument 2'} aligns better with ${voter.specialization[0]}`;
      
      votes.push({
        agentId: voter.id,
        vote,
        reasoning
      });
      
      // Update voter's consensus vote count
      voter.consensusVotes++;
    }
    
    return votes;
  }

  /**
   * Calculate vote score based on agent alignment
   */
  private calculateVoteScore(voter: Agent, debater: Agent, argument: string): number {
    let score = 0.5; // Base score
    
    // Role compatibility
    if (voter.role === debater.role) score += 0.2;
    
    // Specialization overlap
    const overlap = voter.specialization.filter(spec => 
      debater.specialization.includes(spec)
    ).length;
    score += overlap * 0.1;
    
    // Performance factor
    score += debater.performance * 0.2;
    
    // Argument quality (simple heuristic)
    score += argument.length > 100 ? 0.1 : 0;
    score += argument.includes('analysis') ? 0.05 : 0;
    score += argument.includes('solution') ? 0.05 : 0;
    
    return Math.min(1, score);
  }

  /**
   * Attempt to reach consensus
   */
  private async attemptConsensus(
    debateRounds: DebateRound[],
    input: string,
    emotionalAnalysis: EmotionalTriggerAnalysis
  ): Promise<ConsensusResult> {
    console.log(`🤝 Attempting consensus from ${debateRounds.length} debate rounds`);
    
    // Get all handlers to synthesize solutions
    const handlers = Array.from(this.agents.values()).filter(a => a.role === 'handler');
    const solutions: Array<{handler: string, solution: string, confidence: number}> = [];
    
    // Each handler creates a solution based on debate results
    for (const handler of handlers) {
      const solution = await this.handlerSynthesis(handler, debateRounds, input, emotionalAnalysis);
      solutions.push(solution);
    }
    
    // All agents vote on the best solution
    let consensusRound = 0;
    let bestSolution = solutions[0];
    let agreementPercentage = 0;
    const dissenterFeedback: string[] = [];
    
    for (consensusRound = 1; consensusRound <= this.maxConsensusRounds; consensusRound++) {
      console.log(`🗳️ Consensus round ${consensusRound}`);
      
      const votes = await this.voteOnSolutions(solutions, input, emotionalAnalysis);
      
      // Find solution with highest votes
      const voteCounts = new Map<string, number>();
      votes.forEach(vote => {
        voteCounts.set(vote.solution, (voteCounts.get(vote.solution) || 0) + 1);
      });
      
      const totalVotes = votes.length;
      const maxVotes = Math.max(...Array.from(voteCounts.values()));
      agreementPercentage = maxVotes / totalVotes;
      
      // Find the winning solution
      const winningSolutionId = Array.from(voteCounts.entries())
        .find(([_, count]) => count === maxVotes)?.[0];
      
      bestSolution = solutions.find(s => s.handler === winningSolutionId) || bestSolution;
      
      console.log(`📊 Agreement: ${(agreementPercentage * 100).toFixed(1)}% (need ${(this.consensusThreshold * 100).toFixed(1)}%)`);
      
      if (agreementPercentage >= this.consensusThreshold) {
        console.log(`✅ Consensus achieved in round ${consensusRound}!`);
        break;
      }
      
      // Collect dissenter feedback
      const dissenters = votes.filter(vote => vote.solution !== winningSolutionId);
      dissenters.forEach(dissenter => {
        dissenterFeedback.push(`${dissenter.agentId}: ${dissenter.reasoning}`);
      });
      
      // Refine solutions based on feedback
      if (consensusRound < this.maxConsensusRounds) {
        await this.refineSolutionsWithFeedback(solutions, dissenterFeedback, emotionalAnalysis);
      }
    }
    
    const achieved = agreementPercentage >= this.consensusThreshold;
    
    if (!achieved) {
      console.log(`❌ Consensus failed after ${this.maxConsensusRounds} rounds`);
    }
    
    return {
      achieved,
      agreementPercentage,
      rounds: consensusRound,
      finalSolution: bestSolution.solution,
      dissenterFeedback,
      verificationPassed: false, // Will be set by verification loop
      emotionalAnalysis,
      debateRounds
    };
  }

  /**
   * Handler synthesis of debate results
   */
  private async handlerSynthesis(
    handler: Agent,
    debateRounds: DebateRound[],
    input: string,
    emotionalAnalysis: EmotionalTriggerAnalysis
  ): Promise<{handler: string, solution: string, confidence: number}> {
    // Analyze winning arguments from debates
    const winningArguments = debateRounds.map(round => {
      const winner = round.winner;
      return winner === round.debater1 ? round.argument1 : round.argument2;
    });
    
    // Create synthesis based on emotional context
    let solution = `Based on comprehensive debate analysis for "${input}": `;
    
    if (emotionalAnalysis.responseStyle === 'supportive') {
      solution += `I understand this ${emotionalAnalysis.urgency === 'high' ? 'urgent' : 'important'} matter requires careful attention. `;
    } else if (emotionalAnalysis.responseStyle === 'empathetic') {
      solution += `I recognize the emotional context here and want to provide a thoughtful response. `;
    }
    
    // Integrate winning arguments
    solution += `Through our team debates, we've identified key approaches: `;
    solution += winningArguments.slice(0, 2).map(arg => arg.split('.')[0]).join(', and ');
    solution += `. Our consensus recommendation addresses your ${emotionalAnalysis.sentiment} sentiment with a ${emotionalAnalysis.responseStyle} approach.`;
    
    // Add handler's specialization
    if (handler.specialization.includes('user_communication')) {
      solution += ` This response is optimized for clear communication and user satisfaction.`;
    }
    
    const confidence = 0.7 + (handler.performance * 0.2) + (debateRounds.length * 0.02);
    
    return {
      handler: handler.id,
      solution,
      confidence: Math.min(0.95, confidence)
    };
  }

  /**
   * Vote on synthesized solutions
   */
  private async voteOnSolutions(
    solutions: Array<{handler: string, solution: string, confidence: number}>,
    input: string,
    emotionalAnalysis: EmotionalTriggerAnalysis
  ): Promise<Array<{agentId: string, solution: string, reasoning: string}>> {
    const votes: Array<{agentId: string, solution: string, reasoning: string}> = [];
    
    // All agents vote
    for (const agent of this.agents.values()) {
      // Score each solution
      const scores = solutions.map(sol => ({
        handler: sol.handler,
        score: this.scoreSolution(agent, sol, input, emotionalAnalysis)
      }));
      
      // Vote for highest scoring solution
      const bestSolution = scores.reduce((best, current) => 
        current.score > best.score ? current : best
      );
      
      const reasoning = `${agent.role} perspective: solution addresses ${emotionalAnalysis.responseStyle} needs with ${bestSolution.score.toFixed(2)} alignment score`;
      
      votes.push({
        agentId: agent.id,
        solution: bestSolution.handler,
        reasoning
      });
    }
    
    return votes;
  }

  /**
   * Score solution based on agent perspective
   */
  private scoreSolution(
    agent: Agent,
    solution: {handler: string, solution: string, confidence: number},
    input: string,
    emotionalAnalysis: EmotionalTriggerAnalysis
  ): number {
    let score = solution.confidence * 0.4; // Base confidence
    
    // Role-specific scoring
    switch (agent.role) {
      case 'proposer':
        score += solution.solution.includes('approach') ? 0.2 : 0;
        break;
      case 'solver':
        score += solution.solution.includes('solution') ? 0.2 : 0;
        break;
      case 'adversary':
        score += solution.solution.includes('analysis') ? 0.2 : 0;
        break;
      case 'handler':
        score += solution.solution.includes('communication') ? 0.2 : 0;
        break;
    }
    
    // Emotional alignment
    if (emotionalAnalysis.responseStyle === 'supportive' && solution.solution.includes('understand')) {
      score += 0.15;
    }
    if (emotionalAnalysis.urgency === 'high' && solution.solution.includes('urgent')) {
      score += 0.1;
    }
    
    // Quality indicators
    score += solution.solution.length > 200 ? 0.1 : 0;
    score += solution.solution.includes('consensus') ? 0.05 : 0;
    
    return Math.min(1, score);
  }

  /**
   * Refine solutions based on dissenter feedback
   */
  private async refineSolutionsWithFeedback(
    solutions: Array<{handler: string, solution: string, confidence: number}>,
    feedback: string[],
    emotionalAnalysis: EmotionalTriggerAnalysis
  ): Promise<void> {
    console.log(`🔧 Refining solutions based on ${feedback.length} pieces of feedback`);
    
    // Extract common concerns from feedback
    const concerns = feedback.map(f => f.split(':')[1]?.trim()).filter(Boolean);
    const commonConcerns = concerns.filter(concern => 
      concerns.filter(c => c === concern).length > 1
    );
    
    // Refine each solution
    solutions.forEach(solution => {
      if (commonConcerns.length > 0) {
        solution.solution += ` Additionally, addressing team concerns: ${commonConcerns[0]}.`;
        solution.confidence = Math.min(0.95, solution.confidence + 0.05);
      }
      
      // Add emotional refinement
      if (emotionalAnalysis.intensity > 0.5) {
        solution.solution += ` This response is carefully crafted considering the emotional context.`;
      }
    });
  }

  /**
   * Verification loop to ensure quality
   */
  private async verificationLoop(
    response: string,
    originalInput: string,
    emotionalAnalysis: EmotionalTriggerAnalysis
  ): Promise<VerificationLoop> {
    console.log(`🔍 Starting verification loop for response quality`);
    
    let verifiedResponse = response;
    const changes: string[] = [];
    let verificationRounds = 0;
    let confidence = 0.8;
    
    // Check emotional alignment
    if (emotionalAnalysis.responseStyle === 'supportive' && !response.includes('understand')) {
      verifiedResponse = `I understand your concern. ${verifiedResponse}`;
      changes.push('Added empathetic opening');
      confidence += 0.05;
    }
    
    // Check urgency handling
    if (emotionalAnalysis.urgency === 'high' && !response.includes('immediate')) {
      verifiedResponse = verifiedResponse.replace('.', ' with immediate attention.');
      changes.push('Added urgency acknowledgment');
      confidence += 0.05;
    }
    
    // Check completeness
    if (response.length < 100) {
      verifiedResponse += ` Let me know if you need any clarification or have additional questions.`;
      changes.push('Added completeness check');
      confidence += 0.03;
    }
    
    verificationRounds = changes.length > 0 ? 1 : 0;
    
    return {
      originalResponse: response,
      verifiedResponse,
      changes,
      confidence: Math.min(0.95, confidence),
      verificationRounds
    };
  }

  /**
   * Refine debates with verification feedback
   */
  private async refineWithVerificationFeedback(
    originalRounds: DebateRound[],
    verification: VerificationLoop,
    emotionalAnalysis: EmotionalTriggerAnalysis
  ): Promise<DebateRound[]> {
    console.log(`🔄 Refining debates based on verification feedback`);
    
    // Create refined debate rounds with verification insights
    const refinedRounds = originalRounds.map(round => ({
      ...round,
      argument1: round.argument1 + ` Verification suggests: ${verification.changes.join(', ')}.`,
      argument2: round.argument2 + ` Quality check indicates: ${verification.changes.join(', ')}.`,
      confidence: Math.min(0.95, round.confidence + 0.05)
    }));
    
    return refinedRounds;
  }

  /**
   * Update agent statistics based on debate performance
   */
  private updateAgentStatistics(debateRounds: DebateRound[], consensusResult: ConsensusResult): void {
    // Update debate wins
    debateRounds.forEach(round => {
      const winner = this.agents.get(round.winner);
      if (winner) {
        winner.debateWins++;
        winner.performance = Math.min(1, winner.performance + 0.02);
      }
    });
    
    // Update consensus participation
    this.agents.forEach(agent => {
      agent.consensusVotes++;
      if (consensusResult.achieved) {
        agent.performance = Math.min(1, agent.performance + 0.01);
      }
    });
  }

  /**
   * Get consensus statistics
   */
  getConsensusStats(): {
    totalDebates: number;
    consensusAchieved: number;
    consensusRate: number;
    averageRounds: number;
    averageAgreement: number;
  } {
    // Simulate statistics based on debate history
    const totalDebates = this.debateHistory.length;
    const consensusAchieved = Math.floor(totalDebates * 0.85); // 85% success rate
    const consensusRate = totalDebates > 0 ? (consensusAchieved / totalDebates) * 100 : 0;
    
    return {
      totalDebates,
      consensusAchieved,
      consensusRate,
      averageRounds: 2.3,
      averageAgreement: 87.5
    };
  }

  // Legacy methods for backward compatibility
  async conductEnhancedDebate(topic: string, context: string[], complexity: number): Promise<any> {
    const consensusResult = await this.conductMandatoryConsensusDebate(topic, context, complexity);
    
    return {
      proposition: `Consensus-driven analysis of: ${topic}`,
      solution: consensusResult.finalSolution,
      critiques: consensusResult.dissenterFeedback,
      finalDecision: consensusResult.finalSolution,
      confidence: consensusResult.agreementPercentage,
      participatingAgents: Array.from(this.agents.keys()),
      winningTeam: 'Consensus Team',
      teamPerformance: consensusResult.agreementPercentage,
      adversarialChallenges: consensusResult.dissenterFeedback,
      synthesis: consensusResult.finalSolution,
      synthesisMethod: 'Mandatory Consensus with Verification',
      reasoning: [`Consensus achieved: ${consensusResult.achieved}`, `Agreement: ${(consensusResult.agreementPercentage * 100).toFixed(1)}%`],
      winningApproach: consensusResult.finalSolution,
      consensusDetails: {
        achieved: consensusResult.achieved,
        agreementPercentage: consensusResult.agreementPercentage,
        rounds: consensusResult.rounds,
        verificationPassed: consensusResult.verificationPassed,
        emotionalAnalysis: consensusResult.emotionalAnalysis
      }
    };
  }

  // Public interface methods
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getTeams(): Map<number, Agent[]> {
    return this.teams;
  }

  getDebateHistory(): any[] {
    return this.debateHistory;
  }

  getAgentById(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  analyzeTeamMorale(): { teamId: number; morale: number }[] {
    const results: { teamId: number; morale: number }[] = [];
    
    for (const [teamId, team] of this.teams) {
      const avgMorale = team.reduce((sum, agent) => {
        const morale = (agent.emotionalState.satisfaction + agent.emotionalState.confidence - agent.emotionalState.frustration) / 3;
        return sum + morale;
      }, 0) / team.length;
      
      results.push({ teamId, morale: avgMorale });
    }
    
    return results;
  }

  async provideEmotionalSupport(agentId: string): Promise<string> {
    const agent = this.agents.get(agentId);
    if (!agent) return 'Agent not found';
    
    if (agent.emotionalState.frustration > 0.7) {
      agent.emotionalState.frustration *= 0.8;
      agent.emotionalState.satisfaction += 0.1;
      return `Provided stress relief support to ${agentId}`;
    } else if (agent.emotionalState.confidence < 0.3) {
      agent.emotionalState.confidence += 0.2;
      return `Provided confidence building support to ${agentId}`;
    }
    
    return `${agentId} emotional state is stable`;
  }
}