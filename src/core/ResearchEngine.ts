/**
 * Research Engine - REAL Internet Search and Analysis
 * Implements proper research methodology with Google Custom Search API
 */

export interface ResearchQuery {
  query: string;
  domain: string;
  complexity: number;
  searchTerms: string[];
  expectedSources: number;
}

export interface ResearchResult {
  query: string;
  sources: Array<{
    url: string;
    title: string;
    snippet: string;
    relevance: number;
    credibility: number;
  }>;
  synthesis: string;
  confidence: number;
  factChecked: boolean;
  contradictions: string[];
  supportingEvidence: string[];
}

export interface LogicalAnalysis {
  premises: string[];
  inferences: string[];
  conclusions: string[];
  logicalForm: string;
  validityCheck: boolean;
  soundnessCheck: boolean;
  paradoxDetected: boolean;
}

export interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

export class ResearchEngine {
  private readonly GOOGLE_API_KEY = 'AIzaSyBqBDDy_z1JQ_jD3MaOPmAjfhlUbInbaeU';
  private readonly GOOGLE_CX = '017576662512468239146:omuauf_lfve'; // Default search engine ID
  private readonly GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

  private logicalAxioms = [
    { id: 'A1', name: 'Law of Identity', formulation: 'A = A' },
    { id: 'A2', name: 'Law of Non-contradiction', formulation: '¬(A ∧ ¬A)' },
    { id: 'A3', name: 'Law of Excluded Middle', formulation: 'A ∨ ¬A' },
    { id: 'A4', name: 'Law of Sufficient Reason', formulation: 'For every fact F, there is a sufficient reason R' }
  ];

  private inferenceRules = [
    { id: 'R1', name: 'Modus Ponens', formulation: 'A, A → B ⊢ B' },
    { id: 'R2', name: 'Modus Tollens', formulation: '¬B, A → B ⊢ ¬A' },
    { id: 'R3', name: 'Hypothetical Syllogism', formulation: 'A → B, B → C ⊢ A → C' }
  ];

  constructor() {
    console.log('🔍 Research Engine initialized with REAL Google Search API');
  }

  /**
   * Conduct comprehensive research using REAL Google Search
   */
  async conductResearch(query: string): Promise<ResearchResult> {
    console.log(`🔍 Starting REAL research: "${query}"`);

    try {
      // Step 1: Analyze query and generate search strategy
      const researchQuery = this.analyzeQuery(query);
      
      // Step 2: Perform REAL web searches using Google API
      const searchResults = await this.performRealWebSearch(researchQuery);
      
      // Step 3: Analyze and synthesize findings
      const synthesis = await this.synthesizeFindings(searchResults, researchQuery);
      
      // Step 4: Fact-check and validate
      const validation = await this.validateFindings(synthesis, searchResults);
      
      return {
        query: researchQuery.query,
        sources: searchResults,
        synthesis: synthesis.content,
        confidence: synthesis.confidence,
        factChecked: validation.factChecked,
        contradictions: validation.contradictions,
        supportingEvidence: validation.supportingEvidence
      };
    } catch (error) {
      console.error('Research failed:', error);
      
      // Fallback to basic response if API fails
      return {
        query,
        sources: [],
        synthesis: `I attempted to research "${query}" but encountered technical difficulties with the search API. This appears to be a question about ${this.categorizeQuery(query)}. While I cannot provide real-time search results at the moment, I can offer general knowledge on this topic.`,
        confidence: 0.3,
        factChecked: false,
        contradictions: ['Unable to verify information due to search API issues'],
        supportingEvidence: []
      };
    }
  }

  /**
   * Perform REAL Google Custom Search API calls
   */
  private async performRealWebSearch(researchQuery: ResearchQuery): Promise<Array<{
    url: string;
    title: string;
    snippet: string;
    relevance: number;
    credibility: number;
  }>> {
    console.log(`🌐 Performing REAL Google search for: ${researchQuery.searchTerms.join(', ')}`);

    const results: Array<{
      url: string;
      title: string;
      snippet: string;
      relevance: number;
      credibility: number;
    }> = [];

    try {
      // Search with multiple terms for comprehensive results
      for (const searchTerm of researchQuery.searchTerms.slice(0, 3)) { // Limit to 3 searches to avoid quota issues
        const searchUrl = `${this.GOOGLE_SEARCH_URL}?key=${this.GOOGLE_API_KEY}&cx=${this.GOOGLE_CX}&q=${encodeURIComponent(searchTerm)}&num=5`;
        
        console.log(`🔍 Searching: "${searchTerm}"`);
        
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
          console.error(`Google Search API error: ${response.status} ${response.statusText}`);
          continue;
        }

        const data = await response.json();
        
        if (data.items && Array.isArray(data.items)) {
          data.items.forEach((item: GoogleSearchResult) => {
            const credibility = this.assessSourceCredibility(item.displayLink);
            const relevance = this.calculateRelevance(item.title + ' ' + item.snippet, researchQuery.query);
            
            results.push({
              url: item.link,
              title: item.title,
              snippet: item.snippet,
              relevance,
              credibility
            });
          });
        }

        // Add delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`✅ Found ${results.length} real search results`);
      
      // Sort by relevance and credibility
      return results
        .sort((a, b) => (b.relevance * 0.6 + b.credibility * 0.4) - (a.relevance * 0.6 + a.credibility * 0.4))
        .slice(0, 10); // Top 10 results

    } catch (error) {
      console.error('Google Search API error:', error);
      throw new Error(`Search API failed: ${error}`);
    }
  }

  /**
   * Assess source credibility based on domain
   */
  private assessSourceCredibility(domain: string): number {
    const highCredibilityDomains = [
      'edu', 'gov', 'org', 'nature.com', 'science.org', 'pubmed.ncbi.nlm.nih.gov',
      'scholar.google.com', 'arxiv.org', 'who.int', 'cdc.gov', 'nih.gov',
      'wikipedia.org', 'britannica.com', 'reuters.com', 'bbc.com', 'npr.org'
    ];
    
    const mediumCredibilityDomains = [
      'com', 'net', 'co.uk', 'nytimes.com', 'washingtonpost.com', 'theguardian.com',
      'cnn.com', 'forbes.com', 'techcrunch.com', 'wired.com'
    ];

    const lowerDomain = domain.toLowerCase();
    
    if (highCredibilityDomains.some(hcd => lowerDomain.includes(hcd))) {
      return 0.9;
    } else if (mediumCredibilityDomains.some(mcd => lowerDomain.includes(mcd))) {
      return 0.7;
    } else {
      return 0.5; // Unknown domains get medium credibility
    }
  }

  /**
   * Calculate relevance score between search result and query
   */
  private calculateRelevance(resultText: string, query: string): number {
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const resultWords = resultText.toLowerCase().split(/\s+/);
    
    let matches = 0;
    let totalWords = queryWords.length;
    
    queryWords.forEach(queryWord => {
      if (resultWords.some(resultWord => 
        resultWord.includes(queryWord) || queryWord.includes(resultWord)
      )) {
        matches++;
      }
    });
    
    return totalWords > 0 ? matches / totalWords : 0;
  }

  /**
   * Apply logical analysis to statements
   */
  async applyLogicalAnalysis(statement: string): Promise<LogicalAnalysis> {
    console.log(`🧠 Applying logical analysis to: "${statement}"`);

    // Step 1: Parse statement into logical components
    const premises = this.extractPremises(statement);
    const conclusions = this.extractConclusions(statement);
    
    // Step 2: Apply inference rules
    const inferences = this.applyInferenceRules(premises);
    
    // Step 3: Convert to logical form
    const logicalForm = this.convertToLogicalForm(statement);
    
    // Step 4: Check validity and soundness
    const validityCheck = this.checkValidity(premises, conclusions, inferences);
    const soundnessCheck = this.checkSoundness(premises, validityCheck);
    
    // Step 5: Detect paradoxes
    const paradoxDetected = this.detectParadoxes(statement, logicalForm);

    return {
      premises,
      inferences,
      conclusions,
      logicalForm,
      validityCheck,
      soundnessCheck,
      paradoxDetected
    };
  }

  private analyzeQuery(query: string): ResearchQuery {
    const words = query.toLowerCase().split(/\s+/);
    
    // Determine domain
    let domain = 'general';
    if (words.some(w => ['science', 'research', 'study', 'experiment'].includes(w))) {
      domain = 'scientific';
    } else if (words.some(w => ['history', 'historical', 'past', 'ancient'].includes(w))) {
      domain = 'historical';
    } else if (words.some(w => ['technology', 'computer', 'software', 'ai'].includes(w))) {
      domain = 'technical';
    } else if (words.some(w => ['health', 'medical', 'disease', 'treatment'].includes(w))) {
      domain = 'medical';
    }

    // Calculate complexity
    let complexity = Math.min(10, Math.max(1, words.length / 3));
    if (query.includes('?')) complexity += 1;
    if (query.includes('how') || query.includes('why')) complexity += 2;
    if (query.includes('compare') || query.includes('analyze')) complexity += 3;

    // Generate search terms
    const searchTerms = this.generateSearchTerms(query, domain);
    
    // Determine expected sources
    const expectedSources = Math.min(10, Math.max(3, complexity * 2));

    return {
      query,
      domain,
      complexity,
      searchTerms,
      expectedSources
    };
  }

  private generateSearchTerms(query: string, domain: string): string[] {
    const baseTerms = [query];
    
    // Add domain-specific terms
    switch (domain) {
      case 'scientific':
        baseTerms.push(`${query} research study`, `${query} scientific evidence`);
        break;
      case 'historical':
        baseTerms.push(`${query} history`, `${query} historical facts`);
        break;
      case 'technical':
        baseTerms.push(`${query} technical documentation`, `${query} specifications`);
        break;
      case 'medical':
        baseTerms.push(`${query} medical research`, `${query} clinical studies`);
        break;
      default:
        baseTerms.push(`${query} facts`, `${query} information`);
    }

    return baseTerms;
  }

  private async synthesizeFindings(
    searchResults: Array<{url: string, title: string, snippet: string, relevance: number, credibility: number}>,
    researchQuery: ResearchQuery
  ): Promise<{content: string, confidence: number}> {
    console.log(`🔬 Synthesizing findings from ${searchResults.length} REAL sources`);

    if (searchResults.length === 0) {
      return {
        content: `No search results were found for "${researchQuery.query}". This may be due to API limitations or the query being too specific.`,
        confidence: 0.1
      };
    }

    // Weight sources by credibility and relevance
    const weightedSources = searchResults.map(source => ({
      ...source,
      weight: (source.credibility * 0.6) + (source.relevance * 0.4)
    })).sort((a, b) => b.weight - a.weight);

    // Extract key information
    const keyFindings = weightedSources.map(source => {
      // Extract key phrases from snippets
      const sentences = source.snippet.split(/[.!?]+/).filter(s => s.trim().length > 10);
      return {
        source: source.title,
        url: source.url,
        finding: sentences[0]?.trim() || source.snippet.substring(0, 100),
        weight: source.weight,
        credibility: source.credibility
      };
    });

    // Create synthesis
    let synthesis = `Based on real-time research from ${searchResults.length} web sources:\n\n`;
    
    synthesis += `**Key Findings:**\n`;
    keyFindings.slice(0, 5).forEach((finding, index) => {
      synthesis += `${index + 1}. ${finding.finding}\n`;
      synthesis += `   Source: ${finding.source} (Credibility: ${(finding.credibility * 100).toFixed(0)}%)\n\n`;
    });

    synthesis += `**Research Analysis:**\n`;
    synthesis += `This research on "${researchQuery.query}" reveals information from ${researchQuery.domain} sources. `;
    
    if (weightedSources.length > 0) {
      const avgCredibility = weightedSources.reduce((sum, s) => sum + s.credibility, 0) / weightedSources.length;
      const avgRelevance = weightedSources.reduce((sum, s) => sum + s.relevance, 0) / weightedSources.length;
      
      synthesis += `The average source credibility is ${(avgCredibility * 100).toFixed(1)}% with ${(avgRelevance * 100).toFixed(1)}% relevance to your query. `;
      synthesis += `This indicates ${avgCredibility > 0.8 ? 'high' : avgCredibility > 0.6 ? 'moderate' : 'low'} reliability of the information found.`;
    }

    // Calculate confidence based on source quality and consistency
    const avgCredibility = weightedSources.reduce((sum, s) => sum + s.credibility, 0) / weightedSources.length;
    const avgRelevance = weightedSources.reduce((sum, s) => sum + s.relevance, 0) / weightedSources.length;
    const confidence = (avgCredibility * 0.6) + (avgRelevance * 0.4);

    return {
      content: synthesis,
      confidence
    };
  }

  private async validateFindings(
    synthesis: {content: string, confidence: number},
    searchResults: Array<{url: string, title: string, snippet: string, relevance: number, credibility: number}>
  ): Promise<{factChecked: boolean, contradictions: string[], supportingEvidence: string[]}> {
    console.log(`✅ Validating findings through cross-referencing`);

    const contradictions: string[] = [];
    const supportingEvidence: string[] = [];

    if (searchResults.length === 0) {
      return {
        factChecked: false,
        contradictions: ['No sources available for fact-checking'],
        supportingEvidence: []
      };
    }

    // Look for contradictions between sources
    for (let i = 0; i < searchResults.length; i++) {
      for (let j = i + 1; j < searchResults.length; j++) {
        const source1 = searchResults[i];
        const source2 = searchResults[j];
        
        if (this.detectContradiction(source1.snippet, source2.snippet)) {
          contradictions.push(`Potential contradiction between "${source1.title}" and "${source2.title}"`);
        }
      }
    }

    // Identify supporting evidence
    const highCredibilitySources = searchResults.filter(s => s.credibility > 0.8);
    supportingEvidence.push(...highCredibilitySources.map(s => 
      `${s.title}: ${s.snippet.substring(0, 100)}... (${s.url})`
    ));

    const factChecked = contradictions.length < searchResults.length * 0.3; // Less than 30% contradictions

    return {
      factChecked,
      contradictions,
      supportingEvidence
    };
  }

  private detectContradiction(snippet1: string, snippet2: string): boolean {
    // Simple contradiction detection
    const contradictoryPairs = [
      ['increase', 'decrease'],
      ['positive', 'negative'],
      ['effective', 'ineffective'],
      ['true', 'false'],
      ['confirmed', 'denied'],
      ['safe', 'dangerous'],
      ['beneficial', 'harmful']
    ];

    return contradictoryPairs.some(([word1, word2]) => 
      snippet1.toLowerCase().includes(word1) && snippet2.toLowerCase().includes(word2) ||
      snippet1.toLowerCase().includes(word2) && snippet2.toLowerCase().includes(word1)
    );
  }

  private categorizeQuery(query: string): string {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('science') || lowerQuery.includes('research')) return 'scientific research';
    if (lowerQuery.includes('history') || lowerQuery.includes('historical')) return 'historical information';
    if (lowerQuery.includes('technology') || lowerQuery.includes('computer')) return 'technology';
    if (lowerQuery.includes('health') || lowerQuery.includes('medical')) return 'health and medicine';
    return 'general knowledge';
  }

  // Logical analysis methods (unchanged from previous implementation)
  private extractPremises(statement: string): string[] {
    const sentences = statement.split(/[.!?]+/).filter(s => s.trim().length > 5);
    
    const premiseIndicators = ['because', 'since', 'given that', 'assuming', 'if'];
    
    return sentences.filter(sentence => 
      premiseIndicators.some(indicator => sentence.toLowerCase().includes(indicator))
    ).map(s => s.trim());
  }

  private extractConclusions(statement: string): string[] {
    const sentences = statement.split(/[.!?]+/).filter(s => s.trim().length > 5);
    
    const conclusionIndicators = ['therefore', 'thus', 'hence', 'so', 'consequently'];
    
    return sentences.filter(sentence => 
      conclusionIndicators.some(indicator => sentence.toLowerCase().includes(indicator))
    ).map(s => s.trim());
  }

  private applyInferenceRules(premises: string[]): string[] {
    const inferences: string[] = [];
    
    premises.forEach(premise => {
      if (premise.includes('if') && premise.includes('then')) {
        inferences.push(`Modus Ponens applicable: ${premise}`);
      }
      
      if (premise.includes('all') || premise.includes('every')) {
        inferences.push(`Universal instantiation: ${premise}`);
      }
    });

    return inferences;
  }

  private convertToLogicalForm(statement: string): string {
    let logicalForm = statement;
    
    logicalForm = logicalForm.replace(/\band\b/gi, ' ∧ ');
    logicalForm = logicalForm.replace(/\bor\b/gi, ' ∨ ');
    logicalForm = logicalForm.replace(/\bnot\b/gi, '¬');
    logicalForm = logicalForm.replace(/\bif\b/gi, '');
    logicalForm = logicalForm.replace(/\bthen\b/gi, '→');
    logicalForm = logicalForm.replace(/\ball\b/gi, '∀');
    logicalForm = logicalForm.replace(/\bsome\b/gi, '∃');

    return logicalForm;
  }

  private checkValidity(premises: string[], conclusions: string[], inferences: string[]): boolean {
    if (premises.length === 0) return false;
    if (conclusions.length === 0) return true;
    
    return conclusions.every(conclusion => 
      premises.some(premise => 
        this.logicallyFollows(premise, conclusion)
      ) || inferences.some(inference => 
        inference.includes(conclusion.substring(0, 20))
      )
    );
  }

  private checkSoundness(premises: string[], validity: boolean): boolean {
    const obviousFalsehoods = ['2+2=5', 'the earth is flat', 'water is not wet'];
    const premisesSound = premises.every(premise => 
      !obviousFalsehoods.some(falsehood => 
        premise.toLowerCase().includes(falsehood.toLowerCase())
      )
    );
    
    return validity && premisesSound;
  }

  private detectParadoxes(statement: string, logicalForm: string): boolean {
    const paradoxPatterns = [
      /this statement is false/i,
      /this sentence is not true/i,
      /the set of all sets/i,
      /if this statement is true/i
    ];

    return paradoxPatterns.some(pattern => pattern.test(statement)) ||
           logicalForm.includes('¬') && logicalForm.includes('→') && statement.toLowerCase().includes('this');
  }

  private logicallyFollows(premise: string, conclusion: string): boolean {
    const premiseWords = premise.toLowerCase().split(/\s+/);
    const conclusionWords = conclusion.toLowerCase().split(/\s+/);
    
    const overlap = premiseWords.filter(word => conclusionWords.includes(word)).length;
    const overlapRatio = overlap / Math.max(premiseWords.length, conclusionWords.length);
    
    return overlapRatio > 0.3;
  }

  /**
   * Get research capabilities
   */
  getCapabilities(): {
    searchEndpoints: number;
    logicalAxioms: number;
    inferenceRules: number;
    domains: string[];
    realTimeSearch: boolean;
  } {
    return {
      searchEndpoints: 1, // Google Custom Search API
      logicalAxioms: this.logicalAxioms.length,
      inferenceRules: this.inferenceRules.length,
      domains: ['scientific', 'historical', 'technical', 'medical', 'general'],
      realTimeSearch: true
    };
  }
}