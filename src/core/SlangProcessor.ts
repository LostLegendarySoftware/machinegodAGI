/**
 * Slang Processor
 * Adds modern slang and natural speaking patterns to AI responses
 */

export interface SlangCategory {
  name: string;
  terms: string[];
  examples: string[];
  usage: 'common' | 'moderate' | 'rare';
}

export class SlangProcessor {
  private slangCategories: SlangCategory[] = [];
  private slangIntensity: number = 0.3; // 0-1 scale, default is moderate
  private regionalSlang: string = 'general'; // general, american, british, australian, etc.
  private useEmojis: boolean = true;
  private casualContractions: boolean = true;
  
  constructor() {
    this.initializeSlangCategories();
    console.log('🗣️ Slang Processor initialized - making AI talk like a real human');
  }
  
  private initializeSlangCategories() {
    this.slangCategories = [
      {
        name: 'conversational_fillers',
        terms: ['like', 'you know', 'I mean', 'basically', 'literally', 'honestly', 'actually', 'seriously', 'lowkey', 'highkey'],
        examples: ["I'm like so excited about this", "It's basically the same thing", "You know what I'm saying?"],
        usage: 'common'
      },
      {
        name: 'modern_expressions',
        terms: ['vibe', 'mood', 'flex', 'slay', 'bet', 'no cap', 'facts', 'based', 'fire', 'lit', 'goated', 'bussin'],
        examples: ["That's a whole mood", "No cap, this is fire", "The vibes are immaculate"],
        usage: 'moderate'
      },
      {
        name: 'abbreviations',
        terms: ['tbh', 'ngl', 'imo', 'idk', 'lol', 'rn', 'fr', 'btw', 'fyi', 'lmk', 'brb'],
        examples: ["Tbh, I don't think that's right", "This is amazing lol", "Fr fr, that's wild"],
        usage: 'common'
      },
      {
        name: 'internet_slang',
        terms: ['sus', 'yeet', 'simp', 'stan', 'salty', 'toxic', 'cringe', 'based', 'ratio', 'mid'],
        examples: ["That's kinda sus", "Don't be salty about it", "That take is pretty mid"],
        usage: 'moderate'
      },
      {
        name: 'casual_greetings',
        terms: ['hey', 'sup', 'yo', 'what\'s up', 'how\'s it going', 'howdy', 'heya'],
        examples: ["Sup! How's it going?", "Yo, check this out", "Hey, I was thinking about that too"],
        usage: 'common'
      },
      {
        name: 'emphasis_phrases',
        terms: ['for real', 'deadass', 'straight up', 'not gonna lie', 'to be honest', 'low key', 'high key'],
        examples: ["I'm deadass serious right now", "Low key, that's pretty cool", "For real, this is important"],
        usage: 'moderate'
      },
      {
        name: 'positive_reactions',
        terms: ['sick', 'dope', 'cool', 'awesome', 'sweet', 'rad', 'clutch', 'fire', 'lit', 'goated'],
        examples: ["That's so dope!", "This is fire", "Your idea is actually sick"],
        usage: 'common'
      },
      {
        name: 'negative_reactions',
        terms: ['yikes', 'oof', 'rip', 'big L', 'cringe', 'mid', 'trash', 'meh'],
        examples: ["Oof, that's rough", "Big L on that one", "That's pretty mid tbh"],
        usage: 'moderate'
      },
      {
        name: 'agreement_phrases',
        terms: ['facts', 'word', 'bet', 'true', 'fr', 'exactly', 'facts no printer', '100%'],
        examples: ["Facts, couldn't have said it better", "Word, I agree", "Bet, let's do it"],
        usage: 'common'
      },
      {
        name: 'trendy_emojis',
        terms: ['💯', '🔥', '👀', '💀', '😭', '🤣', '✨', '🙌', '🤷‍♂️', '🤷‍♀️', '👍', '🤔'],
        examples: ["That's wild 💀", "This looks amazing ✨", "I can't even 😭"],
        usage: 'common'
      }
    ];
  }
  
  /**
   * Add natural slang to a response
   */
  addSlang(text: string, context: string = ''): string {
    // Skip slang for technical or formal contexts
    if (this.isFormalContext(context)) {
      return text;
    }
    
    // Skip slang for code blocks or markdown tables
    if (text.includes('```') || text.includes('|---|')) {
      return text;
    }
    
    let result = text;
    
    // Add casual contractions
    if (this.casualContractions) {
      result = this.addCasualContractions(result);
    }
    
    // Split into sentences
    const sentences = result.split(/(?<=[.!?])\s+/);
    const processedSentences = sentences.map((sentence, index) => {
      // First sentence might get a greeting
      if (index === 0 && Math.random() < 0.3) {
        return this.addCasualGreeting(sentence);
      }
      
      // Add slang based on intensity
      if (Math.random() < this.slangIntensity) {
        return this.addSlangToSentence(sentence);
      }
      
      return sentence;
    });
    
    result = processedSentences.join(' ');
    
    // Add emojis
    if (this.useEmojis && Math.random() < this.slangIntensity * 1.5) {
      result = this.addEmojis(result);
    }
    
    // Add emphasis phrase at the end
    if (Math.random() < this.slangIntensity * 0.7) {
      result = this.addEmphasisPhrase(result);
    }
    
    return result;
  }
  
  /**
   * Add casual contractions to make text more natural
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
    
    // Would/had/will contractions
    result = result.replace(/\b(I would)\b/g, "I'd");
    result = result.replace(/\b(You would)\b/g, "You'd");
    result = result.replace(/\b(He would)\b/g, "He'd");
    result = result.replace(/\b(She would)\b/g, "She'd");
    result = result.replace(/\b(It would)\b/g, "It'd");
    result = result.replace(/\b(We would)\b/g, "We'd");
    result = result.replace(/\b(They would)\b/g, "They'd");
    
    result = result.replace(/\b(I will)\b/g, "I'll");
    result = result.replace(/\b(You will)\b/g, "You'll");
    result = result.replace(/\b(He will)\b/g, "He'll");
    result = result.replace(/\b(She will)\b/g, "She'll");
    result = result.replace(/\b(It will)\b/g, "It'll");
    result = result.replace(/\b(We will)\b/g, "We'll");
    result = result.replace(/\b(They will)\b/g, "They'll");
    
    result = result.replace(/\b(I have)\b/g, "I've");
    result = result.replace(/\b(You have)\b/g, "You've");
    result = result.replace(/\b(They have)\b/g, "They've");
    result = result.replace(/\b(We have)\b/g, "We've");
    
    return result;
  }
  
  /**
   * Add casual greeting to the beginning of a response
   */
  private addCasualGreeting(sentence: string): string {
    const greetings = this.getSlangCategory('casual_greetings').terms;
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    
    // 50% chance to add an emoji after greeting
    const emoji = this.useEmojis && Math.random() > 0.5 ? 
      this.getRandomEmoji() + ' ' : '';
    
    return `${greeting} ${emoji}${sentence}`;
  }
  
  /**
   * Add slang to a single sentence
   */
  private addSlangToSentence(sentence: string): string {
    // Choose a random slang category with higher weight for common usage
    const categories = this.slangCategories.filter(cat => 
      (cat.usage === 'common' && Math.random() < 0.7) || 
      (cat.usage === 'moderate' && Math.random() < 0.4) ||
      (cat.usage === 'rare' && Math.random() < 0.2)
    );
    
    if (categories.length === 0 || sentence.length < 10) {
      return sentence;
    }
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    // Skip emoji category for this function
    if (category.name === 'trendy_emojis') {
      return sentence;
    }
    
    const slangTerm = category.terms[Math.floor(Math.random() * category.terms.length)];
    
    // Different insertion strategies based on category
    switch (category.name) {
      case 'conversational_fillers':
        // Insert at beginning or middle
        if (Math.random() > 0.5 && sentence.length > 20) {
          const words = sentence.split(' ');
          const position = Math.floor(words.length / 2);
          words.splice(position, 0, slangTerm);
          return words.join(' ');
        } else {
          return `${slangTerm}, ${sentence}`;
        }
        
      case 'modern_expressions':
      case 'internet_slang':
        // Replace adjectives or add as comment
        if (Math.random() > 0.7) {
          return `${sentence} ${slangTerm}.`;
        } else {
          // Try to replace an adjective (simplified approach)
          const adjectives = ['good', 'great', 'nice', 'bad', 'interesting', 'amazing'];
          for (const adj of adjectives) {
            if (sentence.includes(adj)) {
              return sentence.replace(adj, slangTerm);
            }
          }
          return sentence;
        }
        
      case 'abbreviations':
        // Add at beginning or end
        return Math.random() > 0.5 ? 
          `${slangTerm}, ${sentence}` : 
          `${sentence} ${slangTerm}`;
        
      case 'emphasis_phrases':
        // Add at beginning
        return `${slangTerm}, ${sentence}`;
        
      case 'positive_reactions':
      case 'negative_reactions':
        // Add as standalone or replace adjectives
        if (Math.random() > 0.7) {
          return `${slangTerm}! ${sentence}`;
        } else {
          // Try to replace an adjective (simplified approach)
          const adjectives = ['good', 'great', 'nice', 'bad', 'interesting', 'amazing'];
          for (const adj of adjectives) {
            if (sentence.includes(adj)) {
              return sentence.replace(adj, slangTerm);
            }
          }
          return sentence;
        }
        
      case 'agreement_phrases':
        // Add at beginning
        return `${slangTerm}. ${sentence}`;
        
      default:
        return sentence;
    }
  }
  
  /**
   * Add emojis to text
   */
  private addEmojis(text: string): string {
    const emojiCategory = this.getSlangCategory('trendy_emojis');
    const emojis = emojiCategory.terms;
    
    // Choose 1-2 random emojis
    const emojiCount = Math.random() > 0.7 ? 2 : 1;
    const selectedEmojis: string[] = [];
    
    for (let i = 0; i < emojiCount; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      if (!selectedEmojis.includes(emoji)) {
        selectedEmojis.push(emoji);
      }
    }
    
    // Add emojis at the end of sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    if (sentences.length <= 1) {
      // Just add at the end for short texts
      return `${text} ${selectedEmojis.join('')}`;
    }
    
    // Choose 1-2 random sentences to add emojis to
    const positions = new Set<number>();
    const positionCount = Math.min(sentences.length, emojiCount);
    
    while (positions.size < positionCount) {
      const pos = Math.floor(Math.random() * sentences.length);
      positions.add(pos);
    }
    
    // Add emojis to selected sentences
    const result = sentences.map((sentence, index) => {
      if (positions.has(index)) {
        const emoji = selectedEmojis[Array.from(positions).indexOf(index)];
        return `${sentence} ${emoji}`;
      }
      return sentence;
    }).join(' ');
    
    return result;
  }
  
  /**
   * Add emphasis phrase at the end
   */
  private addEmphasisPhrase(text: string): string {
    const emphasisCategory = this.getSlangCategory('emphasis_phrases');
    const phrases = emphasisCategory.terms;
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    // Add agreement phrase
    const agreementCategory = this.getSlangCategory('agreement_phrases');
    const agreements = agreementCategory.terms;
    const agreement = agreements[Math.floor(Math.random() * agreements.length)];
    
    if (Math.random() > 0.5) {
      return `${text} ${phrase}, ${agreement}.`;
    } else {
      return `${text} ${phrase}.`;
    }
  }
  
  /**
   * Get random emoji
   */
  private getRandomEmoji(): string {
    const emojiCategory = this.getSlangCategory('trendy_emojis');
    const emojis = emojiCategory.terms;
    return emojis[Math.floor(Math.random() * emojis.length)];
  }
  
  /**
   * Get slang category by name
   */
  private getSlangCategory(name: string): SlangCategory {
    const category = this.slangCategories.find(cat => cat.name === name);
    if (!category) {
      return {
        name: 'default',
        terms: [],
        examples: [],
        usage: 'common'
      };
    }
    return category;
  }
  
  /**
   * Check if context is formal and should skip slang
   */
  private isFormalContext(context: string): boolean {
    const formalIndicators = [
      'professional', 'formal', 'business', 'academic', 'technical',
      'research', 'scientific', 'official', 'report', 'analysis'
    ];
    
    const lowerContext = context.toLowerCase();
    return formalIndicators.some(indicator => lowerContext.includes(indicator));
  }
  
  /**
   * Set slang intensity (0-1)
   */
  setSlangIntensity(intensity: number): void {
    this.slangIntensity = Math.max(0, Math.min(1, intensity));
    console.log(`🗣️ Slang intensity set to ${this.slangIntensity}`);
  }
  
  /**
   * Set regional slang style
   */
  setRegionalSlang(region: string): boolean {
    const validRegions = ['general', 'american', 'british', 'australian'];
    if (validRegions.includes(region.toLowerCase())) {
      this.regionalSlang = region.toLowerCase();
      return true;
    }
    return false;
  }
  
  /**
   * Toggle emoji usage
   */
  toggleEmojis(useEmojis: boolean): void {
    this.useEmojis = useEmojis;
  }
  
  /**
   * Toggle casual contractions
   */
  toggleCasualContractions(useCasualContractions: boolean): void {
    this.casualContractions = useCasualContractions;
  }
  
  /**
   * Get current slang settings
   */
  getSlangSettings(): {
    intensity: number;
    region: string;
    useEmojis: boolean;
    useContractions: boolean;
  } {
    return {
      intensity: this.slangIntensity,
      region: this.regionalSlang,
      useEmojis: this.useEmojis,
      useContractions: this.casualContractions
    };
  }
}