/**
 * Natural Conversation Processor
 * Makes AI responses sound more human and less technical
 */

export interface ConversationStyle {
  name: string;
  description: string;
  characteristics: string[];
  examples: string[];
}

export class NaturalConversationProcessor {
  private conversationStyles: Map<string, ConversationStyle> = new Map();
  private currentStyle: string = 'casual';
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

  constructor() {
    this.initializeConversationStyles();
    console.log('💬 Natural Conversation Processor initialized');
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

    // Determine appropriate style based on context
    const style = this.determineAppropriateStyle(context);
    
    // Apply transformations to make response more natural
    let naturalResponse = this.removeMarkdownFormatting(response);
    naturalResponse = this.replaceTechnicalTerms(naturalResponse);
    naturalResponse = this.addConversationalElements(naturalResponse, style);
    naturalResponse = this.varyStructure(naturalResponse);
    naturalResponse = this.addPersonality(naturalResponse, style);
    
    return naturalResponse;
  }

  /**
   * Determine appropriate conversation style based on context
   */
  private determineAppropriateStyle(context: string): string {
    const lowerContext = context.toLowerCase();
    
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
    
    return 'casual'; // Default style
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
    
    // Add filler phrase at the beginning
    if (Math.random() > 0.5) {
      const fillerIndex = Math.floor(Math.random() * this.fillerPhrases.length);
      result += this.fillerPhrases[fillerIndex] + ' ';
    }
    
    // Process first paragraph
    result += paragraphs[0];
    
    // Process middle paragraphs with transition phrases
    for (let i = 1; i < paragraphs.length; i++) {
      if (Math.random() > 0.3) { // 70% chance to add transition
        const transitionIndex = Math.floor(Math.random() * this.transitionPhrases.length);
        result += '\n\n' + this.transitionPhrases[transitionIndex] + ' ' + paragraphs[i];
      } else {
        result += '\n\n' + paragraphs[i];
      }
    }
    
    // Add conclusion phrase
    if (paragraphs.length > 1 && Math.random() > 0.5) {
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
      
      // Apply transformations with some probability
      if (i > 0 && Math.random() > 0.7) {
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
   * Add personality elements based on style
   */
  private addPersonality(text: string, style: string): string {
    const styleObj = this.conversationStyles.get(style) || this.conversationStyles.get('casual')!;
    
    let result = text;
    
    // Add style-specific elements
    switch (style) {
      case 'casual':
        // Add contractions
        result = result.replace(' is not ', ' isn\'t ');
        result = result.replace(' are not ', ' aren\'t ');
        result = result.replace(' do not ', ' don\'t ');
        result = result.replace(' does not ', ' doesn\'t ');
        result = result.replace(' cannot ', ' can\'t ');
        result = result.replace(' will not ', ' won\'t ');
        
        // Add casual phrases
        if (Math.random() > 0.7) {
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
        break;
        
      case 'professional':
        // Ensure proper formatting
        result = result.replace(/\bi\b/g, 'I');
        
        // Add professional phrases
        if (Math.random() > 0.7) {
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
        // Add educational phrases
        if (Math.random() > 0.7) {
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
        // Add empathetic phrases
        if (Math.random() > 0.5) {
          const empatheticPhrases = [
            'I understand how you might feel about this.',
            'It's completely normal to have questions about this.',
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
}