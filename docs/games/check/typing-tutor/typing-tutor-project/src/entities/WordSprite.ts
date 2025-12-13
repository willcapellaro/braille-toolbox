import { Container, Text, Graphics } from 'pixi.js';
import { WordData } from '../core/GameState';

export class WordSprite extends Container {
  private wordData: WordData;
  private textDisplay!: Text;
  private background!: Graphics;
  private progressHighlight!: Graphics;
  private focusIndicator!: Graphics;

  constructor(wordData: WordData) {
    super();
    this.wordData = wordData;
    
    this.createBackground();
    this.createText();
    this.createProgressHighlight();
    this.createFocusIndicator();
    
    this.position.set(wordData.x, wordData.y);
  }

  private createBackground(): void {
    this.background = new Graphics();
    this.background.beginFill(0x2a2a2a, 0.8);
    this.background.lineStyle(2, 0x4a4a4a);
    this.background.drawRoundedRect(-10, -5, 200, 40, 8);
    this.background.endFill();
    this.addChild(this.background);
  }

  private createText(): void {
    this.textDisplay = new Text(this.wordData.text, {
      fontFamily: 'Courier New',
      fontSize: 24,
      fill: 0xffffff,
      align: 'left'
    });
    this.textDisplay.position.set(0, 5);
    this.addChild(this.textDisplay);
  }

  private createProgressHighlight(): void {
    this.progressHighlight = new Graphics();
    this.addChild(this.progressHighlight);
  }

  private createFocusIndicator(): void {
    this.focusIndicator = new Graphics();
    this.focusIndicator.visible = false;
    this.addChild(this.focusIndicator);
  }

  public updateProgress(currentIndex: number): void {
    this.wordData.currentIndex = currentIndex;
    
    // Clear previous highlight
    this.progressHighlight.clear();
    
    if (currentIndex > 0) {
      // Calculate the width of the completed portion
      const completedText = this.wordData.text.substring(0, currentIndex);
      const textMetrics = this.textDisplay.style.toFontString();
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        context.font = textMetrics;
        const width = context.measureText(completedText).width;
        
        // Draw highlight for completed characters
        this.progressHighlight.beginFill(0x00ff00, 0.3);
        this.progressHighlight.drawRect(0, 5, width, 24);
        this.progressHighlight.endFill();
      }
    }
    
    // Update text colors
    this.updateTextColors(currentIndex);
  }

  private updateTextColors(currentIndex: number): void {
    // Create a new text with colored characters
    let styledText = '';
    
    for (let i = 0; i < this.wordData.text.length; i++) {
      const char = this.wordData.text[i];
      if (i < currentIndex) {
        // Completed characters in green
        styledText += `<span style="color: #00ff00">${char}</span>`;
      } else if (i === currentIndex) {
        // Current character highlighted
        styledText += `<span style="color: #ffff00; background-color: #444444">${char}</span>`;
      } else {
        // Remaining characters in white
        styledText += `<span style="color: #ffffff">${char}</span>`;
      }
    }
    
    // For now, we'll use a simpler approach since HTML in PIXI text is complex
    // We'll just change the overall text color based on progress
    this.textDisplay.style.fill = currentIndex > 0 ? 0x00ff88 : 0xffffff;
  }

  public setFocused(focused: boolean): void {
    this.focusIndicator.visible = focused;
    
    if (focused) {
      // Draw focus border
      this.focusIndicator.clear();
      this.focusIndicator.lineStyle(3, 0xffff00, 1);
      this.focusIndicator.drawRoundedRect(-12, -7, 204, 44, 10);
    }
    
    // Update background color based on focus
    this.background.clear();
    const bgColor = focused ? 0x3a3a00 : 0x2a2a2a;
    this.background.beginFill(bgColor, 0.8);
    this.background.lineStyle(2, focused ? 0xffff00 : 0x4a4a4a);
    this.background.drawRoundedRect(-10, -5, 200, 40, 8);
    this.background.endFill();
  }

  public getWordData(): WordData {
    return this.wordData;
  }
}