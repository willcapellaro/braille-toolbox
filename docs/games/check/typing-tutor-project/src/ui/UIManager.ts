import { Container, Text, Graphics } from 'pixi.js';
import { GameState } from '../core/GameState';

export class UIManager extends Container {
  private gameState: GameState;
  private scoreText!: Text;
  private livesText!: Text;
  private levelText!: Text;
  private freezeTimeText!: Text;
  private freezeBar!: Graphics;
  private pauseText!: Text;
  private gameOverText!: Text;
  private instructionsText!: Text;
  private debugPanel!: Container;
  private debugTexts: Text[] = [];
  private background!: Graphics;

  constructor(gameState: GameState) {
    super();
    this.gameState = gameState;
    
    this.createBackground();
    this.createTexts();
    this.update();
  }

  private createBackground(): void {
    this.background = new Graphics();
    this.background.beginFill(0x000000, 0.7);
    this.background.drawRect(0, 0, 1200, 80);
    this.background.endFill();
    this.addChild(this.background);
  }

  private createTexts(): void {
    const textStyle = {
      fontFamily: 'Courier New',
      fontSize: 18,
      fill: 0xffffff
    };

    this.scoreText = new Text('Score: 0', textStyle);
    this.scoreText.position.set(20, 20);
    this.addChild(this.scoreText);

    this.livesText = new Text('Lives: 3', textStyle);
    this.livesText.position.set(200, 20);
    this.addChild(this.livesText);

    this.levelText = new Text('Level: 1', textStyle);
    this.levelText.position.set(350, 20);
    this.addChild(this.levelText);

    // Freeze time display
    this.freezeTimeText = new Text('Freeze Time', textStyle);
    this.freezeTimeText.position.set(500, 20);
    this.addChild(this.freezeTimeText);

    // Freeze time bar
    this.freezeBar = new Graphics();
    this.freezeBar.position.set(500, 45);
    this.addChild(this.freezeBar);

    // Instructions
    this.instructionsText = new Text('Type falling words | Hold SPACE=freeze time | ESC=pause | R=restart', {
      fontFamily: 'Courier New',
      fontSize: 14,
      fill: 0xcccccc
    });
    this.instructionsText.position.set(650, 25);
    this.addChild(this.instructionsText);

    // Create debug panel
    this.createDebugPanel();

    // Pause text (initially hidden)
    this.pauseText = new Text('PAUSED - Press SPACE to continue', {
      fontFamily: 'Courier New',
      fontSize: 32,
      fill: 0xffff00,
      align: 'center'
    });
    this.pauseText.position.set(600, 400);
    this.pauseText.anchor.set(0.5);
    this.pauseText.visible = false;
    this.addChild(this.pauseText);

    // Game over text (initially hidden)
    this.gameOverText = new Text('GAME OVER\nFinal Score: 0\nPress R to restart', {
      fontFamily: 'Courier New',
      fontSize: 32,
      fill: 0xff0000,
      align: 'center'
    });
    this.gameOverText.position.set(600, 400);
    this.gameOverText.anchor.set(0.5);
    this.gameOverText.visible = false;
    this.addChild(this.gameOverText);

    // Setup debug mode toggle
    document.addEventListener('keydown', (event) => {
      if (event.key === '`' || event.key === '~') {
        this.gameState.debugMode = !this.gameState.debugMode;
        this.debugPanel.visible = this.gameState.debugMode;
      }
    });
  }

  private createDebugPanel(): void {
    this.debugPanel = new Container();
    this.debugPanel.position.set(20, 100);
    this.debugPanel.visible = false;
    
    // Debug background
    const debugBg = new Graphics();
    debugBg.beginFill(0x000000, 0.8);
    debugBg.lineStyle(2, 0x333333);
    debugBg.drawRect(0, 0, 300, 200);
    debugBg.endFill();
    this.debugPanel.addChild(debugBg);
    
    // Debug title
    const debugTitle = new Text('DEBUG PANEL', {
      fontFamily: 'Courier New',
      fontSize: 16,
      fill: 0xffff00
    });
    debugTitle.position.set(10, 10);
    this.debugPanel.addChild(debugTitle);
    
    // Debug instructions
    const instructions = [
      '1/2: Speed -/+',
      '3/4: Freeze Refill -/+',
      '5: Fill Freeze Time',
      '`: Toggle Debug'
    ];
    
    for (let i = 0; i < instructions.length; i++) {
      const text = new Text(instructions[i], {
        fontFamily: 'Courier New',
        fontSize: 12,
        fill: 0xcccccc
      });
      text.position.set(10, 35 + i * 15);
      this.debugPanel.addChild(text);
    }
    
    // Debug value displays
    for (let i = 0; i < 4; i++) {
      const text = new Text('', {
        fontFamily: 'Courier New',
        fontSize: 12,
        fill: 0x00ff00
      });
      text.position.set(10, 110 + i * 15);
      this.debugTexts.push(text);
      this.debugPanel.addChild(text);
    }
    
    this.addChild(this.debugPanel);
  }

  public update(): void {
    // Update UI text
    this.scoreText.text = `Score: ${this.gameState.score}`;
    this.livesText.text = `Lives: ${this.gameState.lives}`;
    this.levelText.text = `Level: ${this.gameState.level}`;

    // Update freeze time display
    const freezePercent = this.gameState.freezeTime / this.gameState.maxFreezeTime;
    this.freezeTimeText.text = `Freeze: ${Math.ceil(this.gameState.freezeTime / 1000)}s`;
    
    // Update freeze bar
    this.freezeBar.clear();
    this.freezeBar.beginFill(0x333333);
    this.freezeBar.drawRect(0, 0, 100, 10);
    this.freezeBar.endFill();
    
    const barColor = this.gameState.isFreezing ? 0x00ffff : (freezePercent > 0.3 ? 0x00ff00 : 0xff6600);
    this.freezeBar.beginFill(barColor);
    this.freezeBar.drawRect(0, 0, 100 * freezePercent, 10);
    this.freezeBar.endFill();

    // Show/hide pause text
    this.pauseText.visible = this.gameState.isPaused;

    // Show/hide game over text
    if (this.gameState.isGameOver) {
      this.gameOverText.text = `GAME OVER\nFinal Score: ${this.gameState.score}\nPress R to restart`;
      this.gameOverText.visible = true;
    } else {
      this.gameOverText.visible = false;
    }
    
    // Update debug panel
    if (this.gameState.debugMode) {
      this.debugTexts[0].text = `Speed Multi: ${this.gameState.debugSpeedMultiplier.toFixed(1)}`;
      this.debugTexts[1].text = `Freeze Refill: ${this.gameState.debugFreezeRefill}`;
      this.debugTexts[2].text = `Current Speed: ${this.gameState.getCurrentSpeed().toFixed(2)}`;
      this.debugTexts[3].text = `Focused Word: ${this.gameState.focusedWordIndex >= 0 ? this.gameState.currentWord : 'None'}`;
    }
  }
}