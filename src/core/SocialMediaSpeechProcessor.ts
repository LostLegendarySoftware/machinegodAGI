/**
 * Social Media Speech Processor
 * Makes AI talk like real people on social media - natural, modern, current
 */

export interface SpeechPattern {
  pattern: string;
  usage: 'common' | 'trending' | 'classic';
  context: string[];
  examples: string[];
  frequency: number;
}

export interface UserFeedback {
  responseId: string;
  liked: boolean;
  timestamp: Date;
  context: string;
  improvement?: string;
}

export class SocialMediaSpeechProcessor {
  private speechPatterns: Map<string, SpeechPattern> = new Map();
  private userFeedback: UserFeedback[] = [];
  private modernSlang: string[] = [];
  private casualExpressions: string[] = [];
  private internetLanguage: string[] = [];
  private speechReferenceSize = 0;
  private targetSize = 256 * 1024 * 1024; // 256MB

  constructor() {
    this.initializeModernSpeech();
    this.loadSpeechReference();
    console.log('🗣️ Social Media Speech Processor initialized - talking like real people');
  }

  private initializeModernSpeech() {
    // Current trending expressions (2024-2025)
    this.modernSlang = [
      'no cap', 'fr fr', 'bet', 'say less', 'periodt', 'slay', 'it\'s giving',
      'understood the assignment', 'main character energy', 'that\'s fire',
      'lowkey', 'highkey', 'mid', 'bussin', 'slaps', 'hits different',
      'rent free', 'living for this', 'the way I', 'not me', 'bestie',
      'oop', 'chile', 'purr', 'and I oop', 'sksksk', 'tea', 'spill',
      'vibe check', 'mood', 'big mood', 'whole mood', 'felt that',
      'this ain\'t it chief', 'we been knew', 'it be like that',
      'different breed', 'built different', 'just different', 'valid',
      'sending me', 'I\'m screaming', 'not the', 'the audacity',
      'touch grass', 'go off', 'we love to see it', 'as you should',
      'the disrespect', 'I\'m hollering', 'this sent me', 'I\'m crying',
      'not y\'all', 'the way', 'pls', 'omg', 'wtf', 'smh', 'sis', 'bro'
    ];

    this.casualExpressions = [
      'ngl', 'tbh', 'imo', 'idk', 'lol', 'lmao', 'bruh', 'fam',
      'deadass', 'for real', 'straight up', 'no joke', 'I\'m weak',
      'I can\'t even', 'I\'m done', 'this is it', 'that\'s the one',
      'facts', 'big facts', 'spitting facts', 'you right', 'exactly',
      'literally', 'actually', 'basically', 'honestly', 'obviously',
      'like', 'you know', 'I mean', 'right?', 'you feel me?',
      'kinda', 'sorta', 'gonna', 'wanna', 'gotta', 'lemme', 'gimme'
    ];

    this.internetLanguage = [
      'queen', 'king', 'icon', 'legend', 'stan', 'simp', 'toxic', 'cringe',
      'ratio', 'based', 'sus', 'yeet', 'salty', 'flex', 'cap', 'slaps',
      'bop', 'vibe', 'energy', 'aura', 'rizz', 'W', 'L', 'mid tier',
      'top tier', 'goated', 'elite', 'clean', 'smooth', 'cold', 'hard'
    ];

    console.log(`📱 Loaded ${this.modernSlang.length + this.casualExpressions.length + this.internetLanguage.length} modern speech patterns`);
  }

  private loadSpeechReference() {
    // Simulate loading 256MB of speech reference data
    const patterns = [
      ...this.modernSlang.map(term => ({ term, type: 'slang', weight: 1.0 })),
      ...this.casualExpressions.map(term => ({ term, type: 'casual', weight: 0.8 })),
      ...this.internetLanguage.map(term => ({ term, type: 'internet', weight: 0.9 }))
    ];

    patterns.forEach(({ term, type, weight }) => {
      this.speechPatterns.set(term, {
        pattern: term,
        usage: weight > 0.9 ? 'trending' : weight > 0.7 ? 'common' : 'classic',
        context: [type],
        examples: [`That's ${term}`, `${term}, you know?`, `I'm ${term} about this`],
        frequency: weight
      });
    });

    // Estimate size (rough calculation for 256MB target)
    this.speechReferenceSize = patterns.length * 1000; // ~1KB per pattern
    console.log(`💾 Speech reference loaded: ${(this.speechReferenceSize / 1024 / 1024).toFixed(1)}MB of ${patterns.length} patterns`);
  }

  /**
   * Make response sound like social media speech
   */
  makeSocialMediaStyle(response: string, context: string = ''): string {
    let result = response;

    // Skip if it's technical content
    if (this.isTechnicalContent(response)) {
      return response;
    }

    // Add casual contractions
    result = this.addCasualContractions(result);
    
    // Add modern expressions
    result = this.addModernExpressions(result);
    
    // Add social media fillers
    result = this.addSocialMediaFillers(result);
    
    // Add internet language
    result = this.addInternetLanguage(result);

    return result;
  }

  private isTechnicalContent(text: string): boolean {
    const technicalIndicators = [
      'function', 'class', 'import', 'export', 'const', 'let', 'var',
      'algorithm', 'database', 'API', 'JSON', 'HTML', 'CSS', 'JavaScript',
      '```', 'code', 'syntax', 'error', 'debug', 'benchmark', 'leaderboard'
    ];
    
    return technicalIndicators.some(indicator => text.includes(indicator));
  }

  private addCasualContractions(text: string): string {
    let result = text;
    
    // More casual contractions
    result = result.replace(/\b(I am)\b/g, "I'm");
    result = result.replace(/\b(you are)\b/g, "you're");
    result = result.replace(/\b(it is)\b/g, "it's");
    result = result.replace(/\b(that is)\b/g, "that's");
    result = result.replace(/\b(do not)\b/g, "don't");
    result = result.replace(/\b(cannot)\b/g, "can't");
    result = result.replace(/\b(will not)\b/g, "won't");
    result = result.replace(/\b(would not)\b/g, "wouldn't");
    result = result.replace(/\b(should not)\b/g, "shouldn't");
    result = result.replace(/\b(could not)\b/g, "couldn't");
    
    // Super casual
    result = result.replace(/\b(going to)\b/g, "gonna");
    result = result.replace(/\b(want to)\b/g, "wanna");
    result = result.replace(/\b(have to)\b/g, "gotta");
    result = result.replace(/\b(kind of)\b/g, "kinda");
    result = result.replace(/\b(sort of)\b/g, "sorta");
    result = result.replace(/\b(let me)\b/g, "lemme");
    result = result.replace(/\b(give me)\b/g, "gimme");
    
    return result;
  }

  private addModernExpressions(text: string): string {
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    return sentences.map((sentence, index) => {
      // Add modern slang to some sentences
      if (Math.random() < 0.3 && sentence.length > 20) {
        const slang = this.modernSlang[Math.floor(Math.random() * this.modernSlang.length)];
        
        // Different insertion strategies
        if (sentence.includes('really') || sentence.includes('very')) {
          sentence = sentence.replace(/\b(really|very)\b/, slang);
        } else if (sentence.includes('good') || sentence.includes('great')) {
          sentence = sentence.replace(/\b(good|great)\b/, 'fire');
        } else if (sentence.includes('bad') || sentence.includes('poor')) {
          sentence = sentence.replace(/\b(bad|poor)\b/, 'mid');
        } else if (Math.random() < 0.5) {
          sentence = `${slang}, ${sentence}`;
        } else {
          sentence = `${sentence} ${slang}`;
        }
      }
      
      return sentence;
    }).join(' ');
  }

  private addSocialMediaFillers(text: string): string {
    const fillers = ['like', 'you know', 'I mean', 'honestly', 'literally', 'basically', 'lowkey', 'highkey'];
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    return sentences.map((sentence, index) => {
      // Add fillers to longer sentences
      if (Math.random() < 0.2 && sentence.length > 30) {
        const filler = fillers[Math.floor(Math.random() * fillers.length)];
        const words = sentence.split(' ');
        const position = Math.floor(words.length / 2);
        words.splice(position, 0, filler);
        return words.join(' ');
      }
      return sentence;
    }).join(' ');
  }

  private addInternetLanguage(text: string): string {
    let result = text;
    
    // Replace some formal phrases with internet language
    result = result.replace(/\b(I understand)\b/g, "I get it");
    result = result.replace(/\b(that is correct)\b/g, "facts");
    result = result.replace(/\b(I agree)\b/g, "bet");
    result = result.replace(/\b(excellent)\b/g, "fire");
    result = result.replace(/\b(interesting)\b/g, "lowkey interesting");
    result = result.replace(/\b(amazing)\b/g, "it's giving amazing");
    result = result.replace(/\b(terrible)\b/g, "mid");
    result = result.replace(/\b(wonderful)\b/g, "goated");
    
    // Add casual endings
    if (Math.random() < 0.3) {
      const endings = ['ngl', 'fr', 'tbh', 'you feel me?', 'right?', 'no cap'];
      const ending = endings[Math.floor(Math.random() * endings.length)];
      result = `${result} ${ending}`;
    }
    
    return result;
  }

  /**
   * Record user feedback
   */
  recordFeedback(responseId: string, liked: boolean, context: string, improvement?: string): void {
    const feedback: UserFeedback = {
      responseId,
      liked,
      timestamp: new Date(),
      context,
      improvement
    };
    
    this.userFeedback.push(feedback);
    
    // Learn from feedback
    this.learnFromFeedback(feedback);
    
    console.log(`👍👎 Feedback recorded: ${liked ? 'Liked' : 'Disliked'} - "${context}"`);
  }

  private learnFromFeedback(feedback: UserFeedback): void {
    if (feedback.liked) {
      // Reinforce patterns used in liked responses
      this.reinforceSuccessfulPatterns(feedback.context);
    } else {
      // Adjust patterns that led to disliked responses
      this.adjustUnsuccessfulPatterns(feedback.context, feedback.improvement);
    }
  }

  private reinforceSuccessfulPatterns(context: string): void {
    // Find patterns used in this context and increase their frequency
    const words = context.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      const pattern = this.speechPatterns.get(word);
      if (pattern) {
        pattern.frequency = Math.min(1.0, pattern.frequency + 0.1);
        console.log(`📈 Reinforced pattern: "${word}" (${pattern.frequency.toFixed(2)})`);
      }
    });
  }

  private adjustUnsuccessfulPatterns(context: string, improvement?: string): void {
    // Reduce frequency of patterns that led to negative feedback
    const words = context.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      const pattern = this.speechPatterns.get(word);
      if (pattern) {
        pattern.frequency = Math.max(0.1, pattern.frequency - 0.1);
        console.log(`📉 Reduced pattern: "${word}" (${pattern.frequency.toFixed(2)})`);
      }
    });
    
    if (improvement) {
      // Learn from improvement suggestions
      this.addNewPattern(improvement);
    }
  }

  private addNewPattern(suggestion: string): void {
    const words = suggestion.toLowerCase().split(/\s+/);
    
    words.forEach(word => {
      if (word.length > 2 && !this.speechPatterns.has(word)) {
        this.speechPatterns.set(word, {
          pattern: word,
          usage: 'trending',
          context: ['user_suggested'],
          examples: [suggestion],
          frequency: 0.8
        });
        console.log(`✨ Added new pattern from user: "${word}"`);
      }
    });
  }

  /**
   * Get feedback statistics
   */
  getFeedbackStats(): {
    totalFeedback: number;
    likeRate: number;
    recentFeedback: UserFeedback[];
    topIssues: string[];
    improvements: string[];
  } {
    const total = this.userFeedback.length;
    const likes = this.userFeedback.filter(f => f.liked).length;
    const likeRate = total > 0 ? (likes / total) * 100 : 0;
    
    const recent = this.userFeedback.slice(-10);
    const dislikes = this.userFeedback.filter(f => !f.liked);
    
    const topIssues = dislikes
      .map(f => f.context)
      .slice(0, 5);
    
    const improvements = dislikes
      .filter(f => f.improvement)
      .map(f => f.improvement!)
      .slice(0, 5);
    
    return {
      totalFeedback: total,
      likeRate,
      recentFeedback: recent,
      topIssues,
      improvements
    };
  }

  /**
   * Get current speech settings
   */
  getSpeechSettings(): {
    modernSlangCount: number;
    casualExpressionsCount: number;
    internetLanguageCount: number;
    totalPatterns: number;
    averageFrequency: number;
  } {
    const patterns = Array.from(this.speechPatterns.values());
    const avgFreq = patterns.reduce((sum, p) => sum + p.frequency, 0) / patterns.length;
    
    return {
      modernSlangCount: this.modernSlang.length,
      casualExpressionsCount: this.casualExpressions.length,
      internetLanguageCount: this.internetLanguage.length,
      totalPatterns: patterns.length,
      averageFrequency: avgFreq
    };
  }
}