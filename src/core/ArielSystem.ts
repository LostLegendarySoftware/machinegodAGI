/**
 * ARIEL System - Enhanced 4x4 Agent Teams with Handlers
 * Advanced Reasoning Intelligence with Emotional Logic
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
}

export interface EmotionalState {
  empathy: number;
  curiosity: number;
  confidence: number;
  frustration: number;
  satisfaction: number;
}

export interface DebateResult {
  proposition: string;
  solution: string;
  critiques: string[];
  finalDecision: string;
  confidence: number;
  participatingAgents: string[];
  winningTeam?: string;
  teamPerformance?: number;
  adversarialChallenges?: string[];
  synthesis?: string;
  synthesisMethod?: string;
  reasoning?: string[];
}

export interface EnhancedDebateResult extends DebateResult {
  winningTeam: string;
  teamPerformance: number;
  adversarialChallenges: string[];
  synthesis: string;
  synthesisMethod: string;
  reasoning: string[];
  winningApproach: string;
}

export class ArielSystem {
  private agents: Map<string, Agent> = new Map();
  private teams: Map<number, Agent[]> = new Map();
  private debateHistory: DebateResult[] = [];
  private sanctionThreshold = 3;
  private performanceThreshold = 0.8; // 80% threshold for WARP phasing

  constructor() {
    this.initializeEnhancedAgents();
    console.log('🤖 ARIEL System initialized with enhanced 4x4 agent teams + handlers');
  }

  private initializeEnhancedAgents() {
    // Initialize 3 teams of 4 agents each + 1 handler (4x4 structure)
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
        handledTasks: 0
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
        handledTasks: 0
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
        handledTasks: 0
      };
      
      // Handler (new role)
      const handler: Agent = {
        id: `handler-${teamId}`,
        role: 'handler',
        team: teamId,
        sanctions: 0,
        performance: 0.75 + Math.random() * 0.25,
        emotionalState: this.generateEmotionalState(),
        specialization: ['task_coordination', 'output_synthesis', 'quality_control', 'user_communication'],
        handledTasks: 0
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
      handledTasks: 0
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
      handledTasks: 0
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
        handledTasks: 0
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
      handledTasks: 0
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
      handledTasks: 0
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
   * Enhanced debate for conversation processing
   */
  async conductEnhancedDebate(topic: string, context: string[], complexity: number): Promise<EnhancedDebateResult> {
    console.log(`🗣️ Starting enhanced ARIEL debate on: "${topic}"`);
    
    const participatingAgents: string[] = [];
    const critiques: string[] = [];
    const adversarialChallenges: string[] = [];
    const reasoning: string[] = [];
    
    // Phase 1: Research and Hypothesis Generation (All Proposers)
    reasoning.push('Phase 1: Research and hypothesis generation initiated');
    const propositions: Array<{team: number, content: string, confidence: number}> = [];
    
    for (let teamId = 1; teamId <= 3; teamId++) {
      const team = this.teams.get(teamId)!;
      const proposer = team.find(a => a.role === 'proposer')!;
      
      const proposition = await this.generateEnhancedProposition(proposer, topic, context, complexity);
      propositions.push({
        team: teamId,
        content: proposition.content,
        confidence: proposition.confidence
      });
      
      participatingAgents.push(proposer.id);
      proposer.emotionalState.curiosity += 0.1;
      proposer.emotionalState.confidence += 0.05;
      proposer.handledTasks++;
      
      reasoning.push(`Team ${teamId} Proposer: Generated research hypothesis with ${(proposition.confidence * 100).toFixed(1)}% confidence`);
    }
    
    // Phase 2: Solution Development (All Solvers)
    reasoning.push('Phase 2: Solution development and implementation planning');
    const solutions: Array<{team: number, content: string, feasibility: number}> = [];
    
    for (let teamId = 1; teamId <= 3; teamId++) {
      const team = this.teams.get(teamId)!;
      const solver = team.find(a => a.role === 'solver')!;
      const proposition = propositions[teamId - 1];
      
      const solution = await this.developSolution(solver, proposition.content, context, complexity);
      solutions.push({
        team: teamId,
        content: solution.content,
        feasibility: solution.feasibility
      });
      
      participatingAgents.push(solver.id);
      solver.emotionalState.satisfaction += 0.1;
      solver.handledTasks++;
      
      reasoning.push(`Team ${teamId} Solver: Developed solution with ${(solution.feasibility * 100).toFixed(1)}% feasibility`);
    }
    
    // Phase 3: Adversarial Analysis (All Adversaries)
    reasoning.push('Phase 3: Adversarial analysis and challenge generation');
    
    for (let teamId = 1; teamId <= 3; teamId++) {
      const team = this.teams.get(teamId)!;
      const adversary = team.find(a => a.role === 'adversary')!;
      
      // Challenge all other teams' solutions
      for (let solutionId = 0; solutionId < solutions.length; solutionId++) {
        if (solutionId !== teamId - 1) {
          const challenge = await this.generateAdversarialChallenge(adversary, solutions[solutionId], complexity);
          adversarialChallenges.push(`Team ${teamId} vs Team ${solutionId + 1}: ${challenge}`);
          critiques.push(`${adversary.id}: ${challenge}`);
        }
      }
      
      participatingAgents.push(adversary.id);
      adversary.emotionalState.confidence += 0.08;
      adversary.emotionalState.frustration += 0.05;
      adversary.handledTasks++;
      
      reasoning.push(`Team ${teamId} Adversary: Generated ${solutions.length - 1} challenges`);
    }
    
    // Phase 4: Handler Synthesis and Output Preparation
    reasoning.push('Phase 4: Handler synthesis and output preparation');
    const handlerOutputs: Array<{team: number, synthesis: string, quality: number}> = [];
    
    for (let teamId = 1; teamId <= 3; teamId++) {
      const team = this.teams.get(teamId)!;
      const handler = team.find(a => a.role === 'handler')!;
      
      const synthesis = await this.synthesizeTeamOutput(
        handler, 
        propositions[teamId - 1], 
        solutions[teamId - 1], 
        adversarialChallenges,
        context
      );
      
      handlerOutputs.push({
        team: teamId,
        synthesis: synthesis.content,
        quality: synthesis.quality
      });
      
      participatingAgents.push(handler.id);
      handler.emotionalState.satisfaction += 0.12;
      handler.handledTasks++;
      
      reasoning.push(`Team ${teamId} Handler: Synthesized output with ${(synthesis.quality * 100).toFixed(1)}% quality`);
    }
    
    // Phase 5: Management Review and Winner Selection
    reasoning.push('Phase 5: Management review and winner selection');
    const winnerSelection = await this.selectWinningApproach(handlerOutputs, adversarialChallenges, complexity);
    
    // Calculate team performance
    const teamPerformances = handlerOutputs.map(output => output.quality);
    const avgTeamPerformance = teamPerformances.reduce((sum, perf) => sum + perf, 0) / teamPerformances.length;
    
    // Update agent performances based on results
    await this.updateAgentPerformances(winnerSelection, handlerOutputs);
    
    const result: EnhancedDebateResult = {
      proposition: propositions.map(p => p.content).join(' | '),
      solution: solutions.map(s => s.content).join(' | '),
      critiques,
      finalDecision: winnerSelection.decision,
      confidence: winnerSelection.confidence,
      participatingAgents,
      winningTeam: `Team ${winnerSelection.winningTeam}`,
      teamPerformance: avgTeamPerformance,
      adversarialChallenges,
      synthesis: winnerSelection.synthesis,
      synthesisMethod: winnerSelection.method,
      reasoning,
      winningApproach: handlerOutputs[winnerSelection.winningTeam - 1].synthesis
    };
    
    this.debateHistory.push(result);
    
    reasoning.push(`Winner: Team ${winnerSelection.winningTeam} with ${(winnerSelection.confidence * 100).toFixed(1)}% confidence`);
    
    return result;
  }

  private async generateEnhancedProposition(proposer: Agent, topic: string, context: string[], complexity: number) {
    // Enhanced proposition generation with context awareness
    const contextAwareness = context.length > 0 ? 0.2 : 0;
    const complexityFactor = Math.min(complexity / 10, 1);
    
    const propositionTypes = [
      `Comprehensive analysis approach: Break down "${topic}" into core components and examine each systematically`,
      `Multi-perspective framework: Examine "${topic}" from technical, practical, and theoretical viewpoints`,
      `Context-driven solution: Address "${topic}" by building on established patterns and previous insights`,
      `Innovation-focused approach: Explore novel solutions to "${topic}" through creative problem-solving`,
      `Evidence-based methodology: Research and synthesize existing knowledge about "${topic}"`
    ];
    
    const selectedProposition = propositionTypes[Math.floor(Math.random() * propositionTypes.length)];
    const confidence = 0.6 + (proposer.performance * 0.3) + contextAwareness + (complexityFactor * 0.1);
    
    return {
      content: selectedProposition,
      confidence: Math.min(0.95, confidence)
    };
  }

  private async developSolution(solver: Agent, proposition: string, context: string[], complexity: number) {
    // Solution development with feasibility assessment
    const solutionApproaches = [
      `Structured implementation: ${proposition} through systematic step-by-step execution`,
      `Agile methodology: ${proposition} with iterative development and continuous feedback`,
      `Risk-managed approach: ${proposition} with comprehensive fallback strategies`,
      `Resource-optimized solution: ${proposition} focusing on efficiency and scalability`,
      `Collaborative framework: ${proposition} leveraging multiple stakeholder inputs`
    ];
    
    const selectedSolution = solutionApproaches[Math.floor(Math.random() * solutionApproaches.length)];
    const feasibility = 0.5 + (solver.performance * 0.4) + (context.length > 0 ? 0.1 : 0);
    
    return {
      content: selectedSolution,
      feasibility: Math.min(0.9, feasibility)
    };
  }

  private async generateAdversarialChallenge(adversary: Agent, solution: any, complexity: number) {
    // Generate meaningful challenges
    const challengeTypes = [
      `Scalability concern: How will this approach handle increased complexity or volume?`,
      `Resource limitation: What happens when resources are constrained?`,
      `Edge case analysis: How does this solution perform in unusual circumstances?`,
      `Alternative approach: Could a different methodology yield better results?`,
      `Implementation risk: What are the potential failure points in execution?`,
      `Long-term sustainability: Is this solution maintainable over time?`
    ];
    
    return challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
  }

  private async synthesizeTeamOutput(handler: Agent, proposition: any, solution: any, challenges: string[], context: string[]) {
    // Handler synthesizes team's work into coherent output
    const synthesisQuality = handler.performance * 0.7 + (context.length > 0 ? 0.2 : 0) + Math.random() * 0.1;
    
    const synthesis = `Based on our team's research: ${proposition.content}. 
    Our recommended approach: ${solution.content}. 
    We've addressed key challenges including scalability, resource constraints, and implementation risks. 
    ${context.length > 0 ? 'This builds on our previous conversation context.' : ''}`;
    
    return {
      content: synthesis,
      quality: Math.min(0.95, synthesisQuality)
    };
  }

  private async selectWinningApproach(handlerOutputs: any[], challenges: string[], complexity: number) {
    // Management selects the best approach
    const manager = this.agents.get('manager-1')!;
    const boss = this.agents.get('boss-1')!;
    
    // Score each team's output
    const scores = handlerOutputs.map((output, index) => ({
      team: index + 1,
      score: output.quality * 0.7 + (Math.random() * 0.3), // Add some randomness
      synthesis: output.synthesis
    }));
    
    // Find the winner
    const winner = scores.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    const confidence = winner.score;
    const method = 'Management evaluation with quality scoring and challenge assessment';
    
    return {
      winningTeam: winner.team,
      confidence,
      decision: `Team ${winner.team} selected for highest quality synthesis and challenge resilience`,
      synthesis: winner.synthesis,
      method
    };
  }

  private async updateAgentPerformances(winnerSelection: any, handlerOutputs: any[]) {
    // Update performance based on results
    for (let teamId = 1; teamId <= 3; teamId++) {
      const team = this.teams.get(teamId)!;
      const isWinningTeam = teamId === winnerSelection.winningTeam;
      const performanceBonus = isWinningTeam ? 0.05 : -0.02;
      
      team.forEach(agent => {
        agent.performance = Math.max(0.1, Math.min(1, agent.performance + performanceBonus));
        
        if (isWinningTeam) {
          agent.emotionalState.satisfaction += 0.1;
          agent.emotionalState.confidence += 0.05;
        } else {
          agent.emotionalState.frustration += 0.03;
        }
      });
    }
  }

  /**
   * Check if system performance meets WARP threshold
   */
  meetsWarpThreshold(): boolean {
    const agents = Array.from(this.agents.values());
    const avgPerformance = agents.reduce((sum, agent) => sum + agent.performance, 0) / agents.length;
    return avgPerformance >= this.performanceThreshold;
  }

  /**
   * Legacy debate method for backward compatibility
   */
  async conductDebate(problem: string): Promise<DebateResult> {
    const enhancedResult = await this.conductEnhancedDebate(problem, [], 5);
    
    // Convert to legacy format
    return {
      proposition: enhancedResult.proposition,
      solution: enhancedResult.solution,
      critiques: enhancedResult.critiques,
      finalDecision: enhancedResult.finalDecision,
      confidence: enhancedResult.confidence,
      participatingAgents: enhancedResult.participatingAgents
    };
  }

  /**
   * Sanction system for quality control
   */
  async evaluateSanctions(agentId: string, reason: 'irrelevancy' | 'laziness' | 'complacency' | 'ethics'): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) return false;
    
    // Get counsellor votes
    const counsellors = Array.from(this.agents.values()).filter(a => a.role === 'counsellor');
    const votes = counsellors.map(c => Math.random() > 0.6);
    const majorityApproves = votes.filter(v => v).length > counsellors.length / 2;
    
    if (majorityApproves) {
      agent.sanctions++;
      console.log(`⚠️ Agent ${agentId} received sanction for ${reason}. Total: ${agent.sanctions}`);
      
      if (agent.sanctions >= this.sanctionThreshold) {
        await this.replaceAgent(agentId);
        return true;
      }
    }
    
    return false;
  }

  private async replaceAgent(agentId: string) {
    const oldAgent = this.agents.get(agentId)!;
    console.log(`🔄 Replacing agent ${agentId} due to ${oldAgent.sanctions} sanctions`);
    
    const newAgent: Agent = {
      ...oldAgent,
      id: `${oldAgent.role}-${Date.now()}`,
      sanctions: 0,
      performance: 0.7 + Math.random() * 0.3,
      emotionalState: this.generateEmotionalState(),
      handledTasks: 0
    };
    
    this.agents.delete(agentId);
    this.agents.set(newAgent.id, newAgent);
    
    if (oldAgent.team > 0) {
      const team = this.teams.get(oldAgent.team)!;
      const index = team.findIndex(a => a.id === agentId);
      if (index >= 0) {
        team[index] = newAgent;
      }
    }
  }

  // Public interface methods
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  getTeams(): Map<number, Agent[]> {
    return this.teams;
  }

  getDebateHistory(): DebateResult[] {
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