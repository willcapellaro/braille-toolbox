import { Container, Application, Graphics } from 'pixi.js';
import { GameState } from '../core/GameState';
import { WordSprite } from '../entities/WordSprite';
import { UIManager } from '../ui/UIManager';

export class GameScene extends Container {
  private app: Application;
  private gameState: GameState;
  private wordSprites: WordSprite[] = [];
  private uiManager!: UIManager;
  private lastSpawnTime: number = 0;
  private background!: Graphics;

  constructor(app: Application, gameState: GameState) {
    super();
    this.app = app;
    this.gameState = gameState;
    
    this.createBackground();
    this.uiManager = new UIManager(this.gameState);
    this.addChild(this.uiManager);
    this.setupKeyboardInput();
  }

  private createBackground(): void {
    this.background = new Graphics();
    this.background.beginFill(0x0a0a0a);
    this.background.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    this.background.endFill();
    this.addChild(this.background);
  }

  private setupKeyboardInput(): void {
    document.addEventListener('keydown', (event) => {
      // Handle restart - works in any state
      if (event.key.toLowerCase() === 'r') {
        this.restartGame();
        event.preventDefault();
        return;
      }
      
      if (this.gameState.isGameOver || this.gameState.isPaused) return;
      
      // Handle typing
      if (event.key.length === 1 && event.key.match(/[a-z]/i)) {
        this.handleTyping(event.key.toLowerCase());
      }
      
      // Handle backspace
      if (event.key === 'Backspace') {
        this.handleBackspace();
      }
      
      // Handle space for freeze time
      if (event.key === ' ') {
        this.gameState.startFreezeTime();
        event.preventDefault();
      }
      
      // Handle escape for pause
      if (event.key === 'Escape') {
        this.togglePause();
        event.preventDefault();
      }
      
      // Debug controls (only in debug mode)
      if (this.gameState.debugMode) {
        this.handleDebugKeys(event);
      }
    });
    
    // Handle key release for freeze time
    document.addEventListener('keyup', (event) => {
      if (event.key === ' ') {
        this.gameState.stopFreezeTime();
      }
    });
  }

  private handleTyping(key: string): void {
    // If we have a focused word, only allow typing on that word
    if (this.gameState.focusedWordIndex >= 0) {
      const focusedIndex = this.gameState.focusedWordIndex;
      if (focusedIndex < this.wordSprites.length) {
        const wordSprite = this.wordSprites[focusedIndex];
        const wordData = this.gameState.words[focusedIndex];
        
        if (wordData.text[wordData.currentIndex] === key) {
          wordData.currentIndex++;
          wordSprite.updateProgress(wordData.currentIndex);
          
          // Word completed
          if (wordData.currentIndex >= wordData.text.length) {
            this.completeWord(focusedIndex);
          }
        }
      }
      return;
    }
    
    // No focused word - find a word that starts with the typed key
    for (let i = 0; i < this.wordSprites.length; i++) {
      const wordSprite = this.wordSprites[i];
      const wordData = this.gameState.words[i];
      
      if (wordData.currentIndex === 0 && wordData.text[0] === key) {
        wordData.currentIndex = 1;
        wordSprite.updateProgress(1);
        this.gameState.setFocusedWord(i);
        this.updateFocusVisuals();
        return;
      }
    }
  }

  private handleBackspace(): void {
    if (this.gameState.focusedWordIndex >= 0) {
      const focusedIndex = this.gameState.focusedWordIndex;
      if (focusedIndex < this.wordSprites.length) {
        const wordData = this.gameState.words[focusedIndex];
        if (wordData.currentIndex > 0) {
          wordData.currentIndex--;
          this.wordSprites[focusedIndex].updateProgress(wordData.currentIndex);
          if (wordData.currentIndex === 0) {
            this.gameState.focusedWordIndex = -1;
            this.gameState.currentWord = '';
            this.updateFocusVisuals();
          }
        }
      }
    }
  }

  private updateFocusVisuals(): void {
    for (let i = 0; i < this.wordSprites.length; i++) {
      this.wordSprites[i].setFocused(i === this.gameState.focusedWordIndex);
    }
  }

  private completeWord(index: number): void {
    if (index < this.wordSprites.length) {
      this.removeChild(this.wordSprites[index]);
      this.wordSprites.splice(index, 1);
      this.gameState.completeWord(index);
      
      // Update focus visuals for remaining words
      this.updateFocusVisuals();
    }
  }

  private togglePause(): void {
    this.gameState.isPaused = !this.gameState.isPaused;
  }

  private restartGame(): void {
    // Clear all word sprites
    for (const wordSprite of this.wordSprites) {
      this.removeChild(wordSprite);
    }
    this.wordSprites = [];
    
    // Reset game state
    this.gameState.reset();
    this.lastSpawnTime = 0;
    
    // Update UI
    this.uiManager.update();
  }

  private handleDebugKeys(event: KeyboardEvent): void {
    switch (event.key) {
      case '1':
        this.gameState.debugSpeedMultiplier = Math.max(0.1, this.gameState.debugSpeedMultiplier - 0.1);
        break;
      case '2':
        this.gameState.debugSpeedMultiplier += 0.1;
        break;
      case '3':
        this.gameState.debugFreezeRefill = Math.max(100, this.gameState.debugFreezeRefill - 100);
        break;
      case '4':
        this.gameState.debugFreezeRefill += 100;
        break;
      case '5':
        this.gameState.freezeTime = this.gameState.maxFreezeTime;
        break;
    }
  }

  private spawnWord(): void {
    if (this.gameState.words.length >= this.gameState.maxWords) return;
    
    const wordData = this.gameState.addWord();
    const wordSprite = new WordSprite(wordData);
    this.wordSprites.push(wordSprite);
    this.addChild(wordSprite);
  }

  public update(deltaTime: number): void {
    if (this.gameState.isGameOver || this.gameState.isPaused) return;
    
    const currentTime = Date.now();
    
    // Spawn new words
    if (currentTime - this.lastSpawnTime > this.gameState.spawnRate) {
      this.spawnWord();
      this.lastSpawnTime = currentTime;
    }
    
    // Update word positions
    for (let i = this.wordSprites.length - 1; i >= 0; i--) {
      const wordSprite = this.wordSprites[i];
      const wordData = this.gameState.words[i];
      
        // Move word down with freeze time consideration
        const currentSpeed = this.gameState.getCurrentSpeed();
        wordData.y += wordData.speed * currentSpeed * deltaTime;
        wordSprite.position.set(wordData.x, wordData.y);      // Remove words that fall off screen
      if (wordData.y > this.app.screen.height + 50) {
        this.removeChild(wordSprite);
        this.wordSprites.splice(i, 1);
        this.gameState.removeWord(i);
        this.gameState.loseLife();
        
        // Clear focus if this was the focused word
        if (this.gameState.focusedWordIndex === i) {
          this.gameState.focusedWordIndex = -1;
          this.gameState.currentWord = '';
        } else if (this.gameState.focusedWordIndex > i) {
          // Adjust focused word index if a word before it was removed
          this.gameState.focusedWordIndex--;
        }
      }
    }
    
    // Update freeze time
    this.gameState.updateFreezeTime(deltaTime);
    
    // Update UI
    this.uiManager.update();
  }
}