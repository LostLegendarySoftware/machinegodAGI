/**
 * Natural Conversation Processor
 * Makes AI responses sound more human and less technical
 */

import { SlangProcessor } from './SlangProcessor';

export interface ConversationStyle {
  name: string;
  description: string;
  characteristics: string[];
  examples: string[];
}

export class NaturalConversationProcessor {
  private conversationStyles: Map<string, ConversationStyle> = new Map();
  private currentStyle: string = 'casual';
  private slangProcessor: SlangProcessor;
  private technicalTerms: Set<string> = new Set([
    'algorithm', 'neural network', 'machine learning', 'artificial intelligence',
    'parameter', 'optimization', 'gradient descent', 'backpropagation',
    'tensor', 'vector', 'matrix', 'hyperparameter', 'epoch', 'batch size',
    'fine-tuning', 'pre-training', 'transformer', 'attention mechanism',
    'embedding', 'tokenization', 'classification', 'regression', 'clustering',
    'precision', 'recall', 'f1-score', 'accuracy', 'loss function'
  ]);
  private fillerPhrases: string[] = [
    "Let me think about that...",
    "That's an interesting question.",
    "Hmm, let me see...",
    "Good question!",
    "I've been thinking about this too.",
    "From what I understand,",
    "Based on what I know,",
    "Well, basically,",
    "In simple terms,",
    "The way I see it,"
  ];
  private transitionPhrases: string[] = [
    "Also,",
    "Plus,",
    "On top of that,",
    "What's more,",
    "Another thing to consider is",
    "I should mention that",
    "Don't forget that",
    "It's worth noting that",
    "Keep in mind that",
    "By the way,"
  ];
  private conclusionPhrases: string[] = [
    "So there you have it.",
    "Hope that helps!",
    "Does that make sense?",
    "Let me know if you need more details.",
    "That's the gist of it.",
    "That's pretty much it in a nutshell.",
    "That's my take on it, anyway.",
    "That's what I know about it.",
    "That's the basic idea.",
    "That should give you a good overview."
  ];
  private personalityTraits: {
    formality: number; // -1 to 1 (casual to formal)
    directness: number; // -1 to 1 (detailed to direct)
    humor: number; // -1 to 1 (serious to humorous)
    empathy: number; // -1 to 1 (logical to empathetic)
    techLevel: number; // -1 to 1 (simple to technical)
  } = {
    formality: 0,
    directness: 0,
    humor: 0,
    empathy: 0,
    techLevel: 0
  };
  private userPreferences: Map<string, any> = new Map();
  private responseHistory: Array<{input: string, output: string, style: string, rating?: number}> = [];
  private adaptiveMode: boolean = true;

  constructor() {
    this.initializeConversationStyles();
    this.slangProcessor = new SlangProcessor();
    console.log('💬 Natural Conversation Processor initialized with slang capabilities');
  }

  private initializeConversationStyles() {
    const styles: ConversationStyle[] = [
      {
        name: 'casual',
        description: 'Friendly, informal conversation style',
        characteristics: [
          'Uses contractions (I\'m, you\'re, don\'t)',
          'Includes filler words (well, like, you know)',
          'More personal pronouns (I, you, we)',
          'Shorter sentences',
          'Simpler vocabulary'
        ],
        examples: [
          "I think that's a great question!",
          "So, here's what I know about that...",
          "Well, it's basically about...",
          "Yeah, that's a tricky one."
        ]
      },
      {
        name: 'professional',
        description: 'Polite, business-appropriate style',
        characteristics: [
          'More formal language but still accessible',
          'Fewer contractions',
          'Avoids slang',
          'Clear structure',
          'Moderate sentence length'
        ],
        examples: [
          "That's an excellent question.",
          "Based on the available information...",
          "I would recommend considering...",
          "Several factors contribute to this situation."
        ]
      },
      {
        name: 'educational',
        description: 'Clear, instructional style',
        characteristics: [
          'Explains concepts thoroughly',
          'Uses analogies and examples',
          'Breaks down complex ideas',
          'Checks for understanding',
          'Structured presentation'
        ],
        examples: [
          "Let me explain this concept step by step.",
          "Think of it like...",
          "A helpful way to understand this is...",
          "To put it simply..."
        ]
      },
      {
        name: 'empathetic',
        description: 'Warm, supportive conversation style',
        characteristics: [
          'Acknowledges feelings',
          'Shows understanding',
          'Offers reassurance',
          'Uses warm language',
          'Focuses on the person'
        ],
        examples: [
          "I understand why you might feel that way.",
          "That sounds really challenging.",
          "It's completely normal to wonder about this.",
          "I'm here to help you figure this out."
        ]
      }
    ];

    styles.forEach(style => {
      this.conversationStyles.set(style.name, style);
    });
  }

  /**
   * Make AI response sound more natural and human-like
   */
  makeResponseNatural(response: string, context: string = ''): string {
    // Skip processing for system commands and benchmark results
    if (response.includes('benchmark') && response.includes('leaderboard')) {
      return response;
    }
    
    if (response.startsWith('```') || response.includes('| Benchmark | Our Score |')) {
      return response;
    }

    // Determine appropriate style based on context and user preferences
    const style = this.determineAppropriateStyle(context);
    
    // Apply transformations to make response more natural
    let naturalResponse = this.removeMarkdownFormatting(response);
    naturalResponse = this.replaceTechnicalTerms(naturalResponse);
    naturalResponse = this.addConversationalElements(naturalResponse, style);
    naturalResponse = this.varyStructure(naturalResponse);
    naturalResponse = this.addPersonality(naturalResponse, style);
    
    // Apply slang processing for casual style
    if (style === 'casual') {
      naturalResponse = this.slangProcessor.addSlang(naturalResponse, context);
    }
    
    // Store in response history
    this.responseHistory.push({
      input: context,
      output: naturalResponse,
      style
    });
    
    // Limit history size
    if (this.responseHistory.length > 100) {
      this.responseHistory.shift();
    }
    
    return naturalResponse;
  }

  /**
   * Determine appropriate conversation style based on context and user preferences
   */
  private determineAppropriateStyle(context: string): string {
    // If adaptive mode is off, just use current style
    if (!this.adaptiveMode) {
      return this.currentStyle;
    }
    
    const lowerContext = context.toLowerCase();
    
    // Check for explicit style indicators in context
    if (lowerContext.includes('explain') || lowerContext.includes('how does') || 
        lowerContext.includes('what is') || lowerContext.includes('teach')) {
      return 'educational';
    }
    
    if (lowerContext.includes('help') || lowerContext.includes('feeling') || 
        lowerContext.includes('worried') || lowerContext.includes('stressed')) {
      return 'empathetic';
    }
    
    if (lowerContext.includes('business') || lowerContext.includes('professional') || 
        lowerContext.includes('work') || lowerContext.includes('job')) {
      return 'professional';
    }
    
    // Check user preferences if available
    const userId = this.extractUserId(context);
    if (userId && this.userPreferences.has(userId)) {
      const preferences = this.userPreferences.get(userId);
      if (preferences.preferredStyle) {
        return preferences.preferredStyle;
      }
    }
    
    // Use personality traits to influence style
    if (this.personalityTraits.formality > 0.5) {
      return 'professional';
    } else if (this.personalityTraits.empathy > 0.5) {
      return 'empathetic';
    } else if (this.personalityTraits.techLevel > 0.5) {
      return 'educational';
    }
    
    // Analyze previous interactions with similar context
    const similarResponses = this.findSimilarResponses(context);
    if (similarResponses.length > 0) {
      // Find the style with highest average rating
      const styleRatings: Record<string, {sum: number, count: number}> = {};
      
      similarResponses.forEach(resp => {
        if (resp.rating) {
          styleRatings[resp.style] = styleRatings[resp.style] || {sum: 0, count: 0};
          styleRatings[resp.style].sum += resp.rating;
          styleRatings[resp.style].count += 1;
        }
      });
      
      let bestStyle = this.currentStyle;
      let bestRating = 0;
      
      Object.entries(styleRatings).forEach(([style, {sum, count}]) => {
        const avgRating = sum / count;
        if (avgRating > bestRating) {
          bestRating = avgRating;
          bestStyle = style;
        }
      });
      
      return bestStyle;
    }
    
    return 'casual'; // Default style
  }
  
  /**
   * Find similar previous responses
   */
  private findSimilarResponses(context: string): Array<{input: string, output: string, style: string, rating?: number}> {
    const contextWords = new Set(context.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    
    return this.responseHistory.filter(resp => {
      const respWords = new Set(resp.input.toLowerCase().split(/\s+/).filter(w => w.length > 3));
      let matches = 0;
      
      respWords.forEach(word => {
        if (contextWords.has(word)) {
          matches++;
        }
      });
      
      // Consider similar if at least 30% of words match
      return matches / Math.max(1, respWords.size) > 0.3;
    });
  }
  
  /**
   * Extract user ID from context (placeholder implementation)
   */
  private extractUserId(context: string): string | null {
    // In a real implementation, this would extract user ID from context
    // For now, return null
    return null;
  }

  /**
   * Remove markdown formatting
   */
  private removeMarkdownFormatting(text: string): string {
    // Remove markdown headers
    let result = text.replace(/^#+\s+(.*)$/gm, '$1');
    
    // Remove bold and italic formatting
    result = result.replace(/\*\*(.*?)\*\*/g, '$1');
    result = result.replace(/\*(.*?)\*/g, '$1');
    
    // Remove bullet points but keep the content
    result = result.replace(/^\s*[\*\-]\s+(.*)$/gm, '$1');
    
    // Remove code blocks but keep content
    result = result.replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```\w*\n?/, '').replace(/\n?```$/, '');
    });
    
    // Remove inline code formatting
    result = result.replace(/`([^`]+)`/g, '$1');
    
    return result;
  }

  /**
   * Replace technical terms with more conversational alternatives
   */
  private replaceTechnicalTerms(text: string): string {
    // Skip if technical level is high
    if (this.personalityTraits.techLevel > 0.5) {
      return text;
    }
    
    let result = text;
    
    this.technicalTerms.forEach(term => {
      // Only replace if not part of an explanation about the term itself
      if (!text.toLowerCase().includes(`what is ${term}`) && 
          !text.toLowerCase().includes(`definition of ${term}`)) {
        
        const replacement = this.getConversationalAlternative(term);
        
        // Use regex with word boundaries to avoid partial replacements
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        result = result.replace(regex, replacement);
      }
    });
    
    return result;
  }

  /**
   * Get conversational alternative for technical term
   */
  private getConversationalAlternative(term: string): string {
    const alternatives: Record<string, string> = {
      'algorithm': 'process',
      'neural network': 'learning system',
      'machine learning': 'automated learning',
      'artificial intelligence': 'AI',
      'parameter': 'setting',
      'optimization': 'improvement',
      'gradient descent': 'step-by-step improvement',
      'backpropagation': 'learning process',
      'tensor': 'data structure',
      'vector': 'list of numbers',
      'matrix': 'grid of values',
      'hyperparameter': 'configuration setting',
      'epoch': 'training round',
      'batch size': 'processing chunk',
      'fine-tuning': 'customizing',
      'pre-training': 'initial learning',
      'transformer': 'advanced AI model',
      'attention mechanism': 'focus system',
      'embedding': 'representation',
      'tokenization': 'text splitting',
      'classification': 'categorization',
      'regression': 'prediction',
      'clustering': 'grouping',
      'precision': 'accuracy',
      'recall': 'completeness',
      'f1-score': 'balance score',
      'accuracy': 'correctness',
      'loss function': 'error measurement'
    };
    
    return alternatives[term.toLowerCase()] || term;
  }

  /**
   * Add conversational elements based on style
   */
  private addConversationalElements(text: string, style: string): string {
    const styleObj = this.conversationStyles.get(style) || this.conversationStyles.get('casual')!;
    
    // Split into paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    
    if (paragraphs.length === 0) return text;
    
    // Add conversation starter
    let result = '';
    
    // Add filler phrase at the beginning based on personality
    const shouldAddFiller = this.personalityTraits.formality < 0.3 && Math.random() > 0.3;
    if (shouldAddFiller) {
      const fillerIndex = Math.floor(Math.random() * this.fillerPhrases.length);
      result += this.fillerPhrases[fillerIndex] + ' ';
    }
    
    // Process first paragraph
    result += paragraphs[0];
    
    // Process middle paragraphs with transition phrases
    for (let i = 1; i < paragraphs.length; i++) {
      // Add transitions based on directness trait
      const shouldAddTransition = this.personalityTraits.directness < 0.3 && Math.random() > 0.3;
      
      if (shouldAddTransition) {
        const transitionIndex = Math.floor(Math.random() * this.transitionPhrases.length);
        result += '\n\n' + this.transitionPhrases[transitionIndex] + ' ' + paragraphs[i];
      } else {
        result += '\n\n' + paragraphs[i];
      }
    }
    
    // Add conclusion phrase based on personality
    const shouldAddConclusion = paragraphs.length > 1 && this.personalityTraits.directness < 0.5 && Math.random() > 0.3;
    if (shouldAddConclusion) {
      const conclusionIndex = Math.floor(Math.random() * this.conclusionPhrases.length);
      result += '\n\n' + this.conclusionPhrases[conclusionIndex];
    }
    
    return result;
  }

  /**
   * Vary sentence structure for more natural flow
   */
  private varyStructure(text: string): string {
    // Split into sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    if (sentences.length <= 3) return text;
    
    let result = '';
    
    // Process sentences with varied structure
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      
      // Skip very short sentences
      if (sentence.split(' ').length < 4) {
        result += sentence + ' ';
        continue;
      }
      
      // Apply transformations with some probability based on personality
      const transformProbability = 0.3 + (0.4 * (1 - Math.abs(this.personalityTraits.formality)));
      
      if (i > 0 && Math.random() < transformProbability) {
        // Convert some statements to questions
        if (sentence.endsWith('.') && !sentence.includes('?')) {
          const transformed = this.convertToQuestion(sentence);
          result += transformed + ' ';
        }
        // Convert some sentences to active voice
        else if (sentence.includes(' is ') || sentence.includes(' are ') || 
                sentence.includes(' was ') || sentence.includes(' were ')) {
          const transformed = this.convertToActiveVoice(sentence);
          result += transformed + ' ';
        } else {
          result += sentence + ' ';
        }
      } else {
        result += sentence + ' ';
      }
    }
    
    return result.trim();
  }

  /**
   * Convert statement to question
   */
  private convertToQuestion(statement: string): string {
    // Remove period
    let result = statement.replace(/\.$/, '');
    
    // Simple transformation patterns
    if (result.includes(' is ')) {
      return result.replace(/^(.*) is (.*)$/, 'Is $1 $2?');
    }
    
    if (result.includes(' are ')) {
      return result.replace(/^(.*) are (.*)$/, 'Are $1 $2?');
    }
    
    if (result.toLowerCase().startsWith('this ') || result.toLowerCase().startsWith('that ')) {
      return `Isn't ${result}?`;
    }
    
    // Default transformation
    return `${result}, right?`;
  }

  /**
   * Convert passive to active voice (simplified)
   */
  private convertToActiveVoice(sentence: string): string {
    // This is a very simplified implementation
    // Real NLP would require more sophisticated parsing
    
    if (sentence.includes(' is ')) {
      return sentence.replace(/^(.*) is (.*) by (.*)$/, '$3 $2 $1');
    }
    
    if (sentence.includes(' are ')) {
      return sentence.replace(/^(.*) are (.*) by (.*)$/, '$3 $2 $1');
    }
    
    return sentence;
  }

  /**
   * Add personality elements based on style and personality traits
   */
  private addPersonality(text: string, style: string): string {
    let result = text;
    
    // Add style-specific elements
    switch (style) {
      case 'casual':
        // Add contractions based on formality trait
        if (this.personalityTraits.formality < 0.3) {
          result = this.addCasualContractions(result);
        }
        
        // Add casual phrases based on directness trait
        if (this.personalityTraits.directness < 0.3 && Math.random() > 0.5) {
          const casualPhrases = ['you know', 'basically', 'pretty much', 'kind of', 'sort of'];
          const phrase = casualPhrases[Math.floor(Math.random() * casualPhrases.length)];
          
          // Insert at a reasonable position
          const words = result.split(' ');
          if (words.length > 5) {
            const position = Math.floor(words.length / 3);
            words.splice(position, 0, phrase);
            result = words.join(' ');
          }
        }
        
        // Add humor based on humor trait
        if (this.personalityTraits.humor > 0.5 && Math.random() > 0.7) {
          result = this.addHumorElement(result);
        }
        break;
        
      case 'professional':
        // Ensure proper formatting
        result = result.replace(/\bi\b/g, 'I');
        
        // Add professional phrases based on formality trait
        if (this.personalityTraits.formality > 0.3 && Math.random() > 0.7) {
          const professionalPhrases = [
            'In my assessment,', 
            'From a professional standpoint,', 
            'Based on best practices,'
          ];
          const phrase = professionalPhrases[Math.floor(Math.random() * professionalPhrases.length)];
          
          // Add at beginning of a paragraph
          const paragraphs = result.split('\n\n');
          if (paragraphs.length > 1) {
            const position = Math.floor(Math.random() * (paragraphs.length - 1)) + 1;
            paragraphs[position] = phrase + ' ' + paragraphs[position];
            result = paragraphs.join('\n\n');
          }
        }
        break;
        
      case 'educational':
        // Add educational phrases based on techLevel trait
        if (this.personalityTraits.techLevel > 0 && Math.random() > 0.7) {
          const educationalPhrases = [
            'To illustrate this concept,',
            'A helpful analogy would be,',
            'To put it another way,',
            'Think of it like this:'
          ];
          const phrase = educationalPhrases[Math.floor(Math.random() * educationalPhrases.length)];
          
          // Add at beginning of a paragraph
          const paragraphs = result.split('\n\n');
          if (paragraphs.length > 1) {
            const position = Math.floor(Math.random() * (paragraphs.length - 1)) + 1;
            paragraphs[position] = phrase + ' ' + paragraphs[position];
            result = paragraphs.join('\n\n');
          }
        }
        break;
        
      case 'empathetic':
        // Add empathetic phrases based on empathy trait
        if (this.personalityTraits.empathy > 0 && Math.random() > 0.5) {
          const empatheticPhrases = [
            'I understand how you might feel about this.',
            'It\'s completely normal to have questions about this.',
            'Many people find this challenging.',
            'I can see why this matters to you.'
          ];
          const phrase = empatheticPhrases[Math.floor(Math.random() * empatheticPhrases.length)];
          
          // Add at beginning or end
          if (Math.random() > 0.5) {
            result = phrase + ' ' + result;
          } else {
            result = result + '\n\n' + phrase;
          }
        }
        break;
    }
    
    return result;
  }
  
  /**
   * Add casual contractions
   */
  private addCasualContractions(text: string): string {
    let result = text;
    
    // Standard contractions
    result = result.replace(/\b(I am)\b/g, "I'm");
    result = result.replace(/\b(You are)\b/g, "You're");
    result = result.replace(/\b(They are)\b/g, "They're");
    result = result.replace(/\b(We are)\b/g, "We're");
    result = result.replace(/\b(He is)\b/g, "He's");
    result = result.replace(/\b(She is)\b/g, "She's");
    result = result.replace(/\b(It is)\b/g, "It's");
    result = result.replace(/\b(That is)\b/g, "That's");
    result = result.replace(/\b(There is)\b/g, "There's");
    result = result.replace(/\b(Here is)\b/g, "Here's");
    result = result.replace(/\b(What is)\b/g, "What's");
    result = result.replace(/\b(Who is)\b/g, "Who's");
    result = result.replace(/\b(How is)\b/g, "How's");
    
    // Negative contractions
    result = result.replace(/\b(do not)\b/g, "don't");
    result = result.replace(/\b(does not)\b/g, "doesn't");
    result = result.replace(/\b(did not)\b/g, "didn't");
    result = result.replace(/\b(is not)\b/g, "isn't");
    result = result.replace(/\b(are not)\b/g, "aren't");
    result = result.replace(/\b(was not)\b/g, "wasn't");
    result = result.replace(/\b(were not)\b/g, "weren't");
    result = result.replace(/\b(have not)\b/g, "haven't");
    result = result.replace(/\b(has not)\b/g, "hasn't");
    result = result.replace(/\b(had not)\b/g, "hadn't");
    result = result.replace(/\b(will not)\b/g, "won't");
    result = result.replace(/\b(would not)\b/g, "wouldn't");
    result = result.replace(/\b(should not)\b/g, "shouldn't");
    result = result.replace(/\b(could not)\b/g, "couldn't");
    result = result.replace(/\b(cannot)\b/g, "can't");
    
    // Super casual contractions (only if very casual)
    if (this.personalityTraits.formality < -0.3) {
      result = result.replace(/\b(going to)\b/g, "gonna");
      result = result.replace(/\b(want to)\b/g, "wanna");
      result = result.replace(/\b(have to)\b/g, "gotta");
      result = result.replace(/\b(kind of)\b/g, "kinda");
      result = result.replace(/\b(sort of)\b/g, "sorta");
      result = result.replace(/\b(let me)\b/g, "lemme");
      result = result.replace(/\b(give me)\b/g, "gimme");
    }
    
    return result;
  }
  
  /**
   * Add humor element based on personality
   */
  private addHumorElement(text: string): string {
    const humorElements = [
      " (I'm not making this up!)",
      " (Trust me on this one!)",
      " (Seriously, it's true!)",
      " (I promise it's not as complicated as it sounds!)",
      " (Don't worry, I won't quiz you on this later!)"
    ];
    
    const element = humorElements[Math.floor(Math.random() * humorElements.length)];
    
    // Find a suitable sentence to add humor to
    const sentences = text.split(/(?<=[.!?])\s+/);
    if (sentences.length < 2) return text + element;
    
    const targetIndex = Math.floor(Math.random() * (sentences.length - 1)) + 1;
    sentences[targetIndex] = sentences[targetIndex].replace(/[.!?]$/, element + '.');
    
    return sentences.join(' ');
  }

  /**
   * Set conversation style
   */
  setConversationStyle(style: string): boolean {
    if (this.conversationStyles.has(style)) {
      this.currentStyle = style;
      return true;
    }
    return false;
  }

  /**
   * Set slang intensity
   */
  setSlangIntensity(intensity: number): void {
    this.slangProcessor.setSlangIntensity(intensity);
  }

  /**
   * Set personality traits
   */
  setPersonalityTraits(traits: Partial<typeof this.personalityTraits>): void {
    this.personalityTraits = {
      ...this.personalityTraits,
      ...traits
    };
    
    // Ensure values are within range
    Object.keys(this.personalityTraits).forEach(key => {
      const k = key as keyof typeof this.personalityTraits;
      this.personalityTraits[k] = Math.max(-1, Math.min(1, this.personalityTraits[k]));
    });
    
    console.log('👤 Personality traits updated:', this.personalityTraits);
  }
  
  /**
   * Set user preferences
   */
  setUserPreferences(userId: string, preferences: any): void {
    this.userPreferences.set(userId, {
      ...(this.userPreferences.get(userId) || {}),
      ...preferences
    });
  }
  
  /**
   * Record response rating
   */
  recordResponseRating(index: number, rating: number): void {
    if (index >= 0 && index < this.responseHistory.length) {
      this.responseHistory[index].rating = rating;
    }
  }
  
  /**
   * Toggle adaptive mode
   */
  setAdaptiveMode(enabled: boolean): void {
    this.adaptiveMode = enabled;
    console.log(`🔄 Adaptive conversation mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current conversation style
   */
  getCurrentStyle(): string {
    return this.currentStyle;
  }

  /**
   * Get available conversation styles
   */
  getAvailableStyles(): string[] {
    return Array.from(this.conversationStyles.keys());
  }
  
  /**
   * Get personality traits
   */
  getPersonalityTraits(): typeof this.personalityTraits {
    return {...this.personalityTraits};
  }
  
  /**
   * Get response history
   */
  getResponseHistory(): typeof this.responseHistory {
    return [...this.responseHistory];
  }
  
  /**
   * Get conversation statistics
   */
  getConversationStats(): {
    totalResponses: number;
    styleDistribution: Record<string, number>;
    averageRating: number;
    adaptiveModeEnabled: boolean;
  } {
    const styleDistribution: Record<string, number> = {};
    let totalRating = 0;
    let ratingCount = 0;
    
    this.responseHistory.forEach(resp => {
      styleDistribution[resp.style] = (styleDistribution[resp.style] || 0) + 1;
      
      if (resp.rating !== undefined) {
        totalRating += resp.rating;
        ratingCount++;
      }
    });
    
    return {
      totalResponses: this.responseHistory.length,
      styleDistribution,
      averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
      adaptiveModeEnabled: this.adaptiveMode
    };
  }
}