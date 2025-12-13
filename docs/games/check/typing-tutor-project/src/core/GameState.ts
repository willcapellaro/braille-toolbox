export interface WordData {
  text: string;
  x: number;
  y: number;
  speed: number;
  completed: boolean;
  currentIndex: number;
}

export class GameState {
  public score: number = 0;
  public lives: number = 3;
  public level: number = 1;
  public words: WordData[] = [];
  public currentWord: string = '';
  public focusedWordIndex: number = -1; // Index of currently focused word
  public isGameOver: boolean = false;
  public isPaused: boolean = false;
  
  // Freeze time mechanics
  public freezeTime: number = 5000; // Start with more freeze time
  public maxFreezeTime: number = 8000; // Higher maximum
  public isFreezing: boolean = false;
  public freezeSlowdown: number = 0.05; // Even slower during freeze
  public freezeRefillAmount: number = 800; // More generous refill
  
  // Game settings
  public wordSpeed: number = 0.3; // Slower initial speed
  public spawnRate: number = 3500; // Longer time between spawns
  public maxWords: number = 3; // Fewer words on screen
  
  // Debug controls
  public debugMode: boolean = false;
  public debugSpeedMultiplier: number = 1;
  public debugFreezeRefill: number = 800; // Match new refill amount
  
  // Word list for the typing game
  private wordList: string[] = [
    // Short words (easier)
    'cat', 'dog', 'run', 'jump', 'fast', 'code', 'fun', 'win', 'key', 'app',
    'go', 'up', 'top', 'new', 'yes', 'no', 'web', 'box', 'fix', 'try',
    // Medium words
    'hello', 'world', 'typing', 'game', 'speed', 'focus', 'skill', 'learn',
    'practice', 'challenge', 'progress', 'develop', 'create', 'design',
    // Longer words (harder)
    'javascript', 'typescript', 'programming', 'keyboard', 'accuracy', 
    'computer', 'concentration', 'improvement', 'software', 'interface',
    'graphics', 'animation', 'interactive', 'responsive'
  ];

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.words = [];
    this.currentWord = '';
    this.focusedWordIndex = -1;
    this.isGameOver = false;
    this.isPaused = false;
    this.freezeTime = 5000;
    this.isFreezing = false;
    this.wordSpeed = 0.3; // Match initial speed
    this.spawnRate = 3500; // Match initial spawn rate
  }

  public addWord(): WordData {
    const randomWord = this.wordList[Math.floor(Math.random() * this.wordList.length)];
    const newWord: WordData = {
      text: randomWord,
      x: Math.random() * 1000 + 100, // Random x position
      y: -150, // Start much higher to give more time
      speed: this.wordSpeed + (this.level - 1) * 0.2, // Slower speed progression
      completed: false,
      currentIndex: 0
    };
    
    this.words.push(newWord);
    return newWord;
  }

  public removeWord(index: number): void {
    if (index >= 0 && index < this.words.length) {
      this.words.splice(index, 1);
    }
  }

  public completeWord(index: number): void {
    if (index >= 0 && index < this.words.length) {
      const points = this.words[index].text.length * 10;
      this.score += points;
      
      // Check for level up every 500 points
      const newLevel = Math.floor(this.score / 500) + 1;
      if (newLevel > this.level) {
        this.level = newLevel;
        this.levelUp();
      }
      
      // Refill freeze time on successful completion
      this.freezeTime = Math.min(this.maxFreezeTime, this.freezeTime + this.freezeRefillAmount);
      this.removeWord(index);
      this.focusedWordIndex = -1;
      this.currentWord = '';
    }
  }

  public loseLife(): void {
    this.lives--;
    if (this.lives <= 0) {
      this.isGameOver = true;
    }
  }

  private levelUp(): void {
    // Increase speed more gradually
    this.wordSpeed += 0.15; // Even slower progression
    this.spawnRate = Math.max(2500, this.spawnRate - 200); // Don't go below 2.5 seconds
  }

  public startFreezeTime(): void {
    if (this.freezeTime > 0 && !this.isFreezing) {
      this.isFreezing = true;
    }
  }

  public stopFreezeTime(): void {
    this.isFreezing = false;
  }

  public updateFreezeTime(deltaTime: number): void {
    if (this.isFreezing && this.freezeTime > 0) {
      this.freezeTime = Math.max(0, this.freezeTime - deltaTime * 16.67); // Convert to milliseconds
      if (this.freezeTime <= 0) {
        this.isFreezing = false;
      }
    }
  }

  public canStartNewWord(): boolean {
    return this.focusedWordIndex === -1;
  }

  public setFocusedWord(index: number): void {
    this.focusedWordIndex = index;
    if (index >= 0 && index < this.words.length) {
      this.currentWord = this.words[index].text;
    }
  }

  public getCurrentSpeed(): number {
    const baseSpeed = this.wordSpeed * this.debugSpeedMultiplier;
    return this.isFreezing ? baseSpeed * this.freezeSlowdown : baseSpeed;
  }
}