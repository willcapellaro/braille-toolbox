import * as PIXI from 'pixi.js';
import { ChordInputSystem, ChordDirection, ChordInputEvent } from './ChordInput';

// Declare the app variable
let app: PIXI.Application;

class GridRacer {
  squareSize: number;
  gridVNumber: number;
  gridHNumber: number;
  trackVNumber: number;
  trackHNumber: number;
  trackThickness: number;
  startFinishPos: { x: number; y: number };
  flagLineSquares: { x: number; y: number }[];
  lastDirection: string;
  laps: number;
  targetLaps: number;
  gameState: string;
  startTime: number;
  playerPos: { x: number; y: number };
  lastPos: { x: number; y: number };
  moveAnimation: any;
  hasMoved: boolean;
  trackContainer!: PIXI.Container;
  player!: PIXI.Graphics | PIXI.Sprite;
  uiContainer!: PIXI.Container;
  lapText!: PIXI.Text;
  startButton!: PIXI.Graphics;
  winContainer!: PIXI.Container;
  timeText!: PIXI.Text;
  playAgainButton!: PIXI.Graphics;
  startContainer!: PIXI.Container;
  keyHandler!: (e: KeyboardEvent) => void;
  animationTicker!: () => void;
  audioContext!: AudioContext;
  audioEnabled: boolean;
  movementSoundsEnabled: boolean;
  lapCountSoundsEnabled: boolean;
  upcomingTurnSoundsEnabled: boolean;
  upcomingTurnDistance: number;
  correctTurnSoundsEnabled: boolean;
  completingTurnSoundsEnabled: boolean;
  completingTurnDistance: number;
  perfectTurnSoundsEnabled: boolean;
  lastKeyTime: number;
  typingSpeed: number;
  heartbeatInterval: number;
  muzakMuted: boolean;
  debugPanel!: HTMLDivElement;
  debugCollapsed: boolean;
  infoPanel!: HTMLDivElement;
  infoContent!: HTMLDivElement;
  infoToggleButton!: HTMLButtonElement;
  infoCollapsed: boolean;
  chordInput!: ChordInputSystem;
  debounceAmount: number;
  raceLog: Array<{
    date: string;
    startTime: number;
    endTime?: number;
    speed?: number | string; // seconds or 'DNF'
    totalKeystrokes: number;
    correctKeystrokes: number;
    accuracy?: number; // percentage
    status?: 'active' | 'completed' | 'cancelled' | 'DNF';
  }> = [];
  currentRaceKeystrokes: number = 0;
  currentRaceCorrectKeystrokes: number = 0;
  rightPanel!: HTMLDivElement;
  brailleSection!: HTMLDivElement;
  debugSection!: HTMLDivElement;
  raceLogSection!: HTMLDivElement;
  raceLogContent!: HTMLDivElement;
  currentRaceRecord?: {
    date: string;
    startTime: number;
    endTime?: number;
    speed?: number | string;
    totalKeystrokes: number;
    correctKeystrokes: number;
    accuracy?: number;
    status: 'active' | 'completed' | 'cancelled' | 'DNF';
  };
  cancelFlagSprite?: PIXI.Sprite;
  roadTexture!: PIXI.Texture;
  grassTexture!: PIXI.Texture;
  roadStripeTexture!: PIXI.Texture;
  grassCornerTexture!: PIXI.Texture;
  roadCornerTexture!: PIXI.Texture;
  carTexture!: PIXI.Texture;
  signNTexture!: PIXI.Texture;
  signETexture!: PIXI.Texture;
  signSTexture!: PIXI.Texture;
  signWTexture!: PIXI.Texture;
  skidNTexture!: PIXI.Texture;
  skidETexture!: PIXI.Texture;
  skidSTexture!: PIXI.Texture;
  skidWTexture!: PIXI.Texture;
  ouchTexture!: PIXI.Texture;
  startflagTexture!: PIXI.Texture;
  startflagSprite?: PIXI.Sprite;
  skidMarks: Array<{ x: number, y: number, direction: string, sprite: PIXI.Sprite, opacity: number }> = [];
  ouchDots: Array<{ x: number, y: number, sprite: PIXI.Sprite }> = [];
  
  // Central lap display
  centralDisplayContainer?: PIXI.Container;
  centralLapText?: PIXI.Text;
  centralDisplayStrip: PIXI.Sprite[] = [];
  
  texturesLoaded: boolean;

  constructor() {
    this.squareSize = 50;
    this.gridVNumber = 16;  // Grid height (vertical)
    this.gridHNumber = 28;  // Grid width (horizontal)
    this.trackVNumber = 4;  // Track inside height
    this.trackHNumber = 10;  // Track inside width
    this.trackThickness = 3; // Track border thickness
    this.startFinishPos = { x: 0, y: 0 };
    this.flagLineSquares = [];
    this.lastDirection = '';
    this.laps = 0;
    this.targetLaps = 4;
    this.gameState = 'start';
    this.startTime = 0;
    this.playerPos = { x: 6, y: 1 }; // Will be set to start position
    this.lastPos = { x: 6, y: 1 };
    this.moveAnimation = null;
    this.hasMoved = false;
    this.audioEnabled = true;
    this.movementSoundsEnabled = true;
    this.lapCountSoundsEnabled = true;
    this.upcomingTurnSoundsEnabled = true;
    this.upcomingTurnDistance = 0;
    this.correctTurnSoundsEnabled = true;
    this.completingTurnSoundsEnabled = true;
    this.completingTurnDistance = 0;
    this.perfectTurnSoundsEnabled = true;
    this.lastKeyTime = 0;
    this.typingSpeed = 1.0;
    this.heartbeatInterval = 0;
    this.muzakMuted = false;
    this.debugCollapsed = false;
    this.infoCollapsed = false;
    this.debounceAmount = 50; // Default debounce in milliseconds
    this.currentRaceKeystrokes = 0;
    this.currentRaceCorrectKeystrokes = 0;
    
    // Central lap display properties
    this.centralDisplayContainer = undefined;
    this.centralLapText = undefined;
    this.centralDisplayStrip = [];
    
    this.loadRaceLogFromStorage();
    this.texturesLoaded = false;
    this.initAudio();
    this.createRightPanel();
    this.initializeGame();

  }

  async initializeGame() {
    // Load textures first, then set up the track
    await this.loadTextures();
    this.setupTrack();
    // Start UI removed - game starts by touching flag
    this.setupKeyboard();
    this.setupChordInput();
    this.setupAnimationLoop();
    this.startHeartbeat();
    // Right panel already created with all sections
    
    // Ensure UI is properly positioned after everything is set up
    setTimeout(() => this.positionCenteredUI(), 100);
  }

  async loadTextures() {
    console.log('🔄 Starting texture loading...');
    
    // First, test if files are accessible via HTTP
    const testHttpAccess = async (url: string): Promise<boolean> => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`🌐 HTTP test for ${url}: ${response.status} ${response.statusText}`);
        return response.ok;
      } catch (error) {
        console.error(`🌐 HTTP test failed for ${url}:`, error);
        return false;
      }
    };
    
// Test HTTP access first
const roadAccessible = await testHttpAccess('./road.png');
const grassAccessible = await testHttpAccess('./grass.png');
const stripeAccessible = await testHttpAccess('./roadstripe.png');    if (!roadAccessible || !grassAccessible || !stripeAccessible) {
      console.error('💥 FILES NOT ACCESSIBLE VIA HTTP - Creating fallback textures');
      this.createFallbackTextures();
      return;
    }
    
    try {
      // Try canvas-based texture creation as workaround
      const createCanvasTexture = (color: string, name: string): PIXI.Texture => {
        console.log(`🎨 Creating canvas texture for ${name} with color ${color}`);
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 16, 16);
        
        const texture = PIXI.Texture.from(canvas);
        console.log(`✅ Canvas texture created for ${name}:`, texture.width + 'x' + texture.height);
        return texture;
      };
      
      // Try actual PNG loading with public/ prefix
      console.log('🔄 Trying PNG loading with public/ prefix...');
      
      const loadPNG = async (path: string, name: string): Promise<PIXI.Texture> => {
        const img = new Image();
        return new Promise((resolve, reject) => {
          img.onload = () => {
            try {
              const texture = PIXI.Texture.from(img);
              console.log(`✅ ${name} loaded:`, texture.width + 'x' + texture.height);
              resolve(texture);
            } catch (error) {
              reject(error);
            }
          };
          img.onerror = reject;
          img.src = path;
        });
      };
      
      try {
        this.roadTexture = await loadPNG('./road.png', 'road');
  this.grassTexture = await loadPNG('./grass.png', 'grass');
  this.roadStripeTexture = await loadPNG('./roadstripe.png', 'roadstripe');
  this.grassCornerTexture = await loadPNG('./grasscorner.png', 'grasscorner');
  this.roadCornerTexture = await loadPNG('./roadcorner.png', 'roadcorner');
  this.carTexture = await loadPNG('./car.png', 'car');
  this.signNTexture = await loadPNG('./sign-n.png', 'sign-n');
  this.signETexture = await loadPNG('./sign-e.png', 'sign-e');
  this.signSTexture = await loadPNG('./sign-s.png', 'sign-s');
  this.signWTexture = await loadPNG('./sign-w.png', 'sign-w');
  this.skidNTexture = await loadPNG('./skid-n.png', 'skid-n');
  this.skidETexture = await loadPNG('./skid-e.png', 'skid-e');
  this.skidSTexture = await loadPNG('./skid-s.png', 'skid-s');
  this.skidWTexture = await loadPNG('./skid-w.png', 'skid-w');
  this.ouchTexture = await loadPNG('./ouch.png', 'ouch');
  this.startflagTexture = await loadPNG('./startflag.png', 'startflag');        this.texturesLoaded = true;
        console.log('🎉 PNG TEXTURES LOADED SUCCESSFULLY!');
        return;
      } catch (error) {
        console.warn('⚠️ PNG loading failed, using canvas fallback:', error);
      }
      
      this.roadTexture = createCanvasTexture('#1e3a8a', 'road (blue)');
      this.grassTexture = createCanvasTexture('#0f172a', 'grass (dark)');
      this.roadStripeTexture = createCanvasTexture('#8b5cf6', 'roadstripe (purple)');
      this.grassCornerTexture = createCanvasTexture('#22c55e', 'grasscorner (green)');
      this.roadCornerTexture = createCanvasTexture('#3b82f6', 'roadcorner (light blue)');
      this.carTexture = createCanvasTexture('#fbbf24', 'car (yellow)');
      this.signNTexture = createCanvasTexture('#ef4444', 'sign-n (red)');
      this.signETexture = createCanvasTexture('#10b981', 'sign-e (green)');
      this.signSTexture = createCanvasTexture('#3b82f6', 'sign-s (blue)');
      this.signWTexture = createCanvasTexture('#f59e0b', 'sign-w (orange)');
      this.skidNTexture = createCanvasTexture('#4b5563', 'skid-n (gray)');
      this.skidETexture = createCanvasTexture('#4b5563', 'skid-e (gray)');
      this.skidSTexture = createCanvasTexture('#4b5563', 'skid-s (gray)');
      this.skidWTexture = createCanvasTexture('#4b5563', 'skid-w (gray)');
      this.ouchTexture = createCanvasTexture('#ff0000', 'ouch (red)');
      this.startflagTexture = createCanvasTexture('#10b981', 'startflag (green)');
      
      this.texturesLoaded = true;
      console.log('🎉 CANVAS TEXTURES CREATED SUCCESSFULLY!');
      console.log('📊 All textures are 16x16 canvas-based');
      
    } catch (error) {
      console.error('💥 EVEN CANVAS TEXTURES FAILED:', error);
      this.texturesLoaded = false;
    }
  }
  
  createFallbackTextures() {
    console.log('🎨 Creating simple colored canvas textures as fallback...');
    
    const createSimpleTexture = (color: string): PIXI.Texture => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 16, 16);
      return PIXI.Texture.from(canvas);
    };
    
    this.roadTexture = createSimpleTexture('#1e3a8a');
    this.grassTexture = createSimpleTexture('#0f172a');
    this.roadStripeTexture = createSimpleTexture('#8b5cf6');
    this.grassCornerTexture = createSimpleTexture('#22c55e');
    this.roadCornerTexture = createSimpleTexture('#3b82f6');
    this.carTexture = createSimpleTexture('#fbbf24');
    this.signNTexture = createSimpleTexture('#ef4444');
    this.signETexture = createSimpleTexture('#10b981');
    this.signSTexture = createSimpleTexture('#3b82f6');
    this.signWTexture = createSimpleTexture('#f59e0b');
    this.skidNTexture = createSimpleTexture('#4b5563');
    this.skidETexture = createSimpleTexture('#4b5563');
    this.skidSTexture = createSimpleTexture('#4b5563');
    this.skidWTexture = createSimpleTexture('#4b5563');
    this.ouchTexture = createSimpleTexture('#ff0000');
    this.startflagTexture = createSimpleTexture('#10b981');
    this.texturesLoaded = true;
    
    console.log('✅ Fallback textures created successfully');
  }
  
  logRace(timeTaken: number) {
    const accuracy = this.currentRaceKeystrokes > 0 ? 
      (this.currentRaceCorrectKeystrokes / this.currentRaceKeystrokes) * 100 : 100;
    
    const raceData = {
      date: new Date().toLocaleString(),
      startTime: this.startTime,
      endTime: Date.now(),
      speed: timeTaken,
      totalKeystrokes: this.currentRaceKeystrokes,
      correctKeystrokes: this.currentRaceCorrectKeystrokes,
      accuracy: Math.round(accuracy * 100) / 100
    };
    
    this.raceLog.push(raceData);
    console.log('🏁 Race logged:', raceData);
    
    // Update race log display
    this.updateRaceLogDisplay();
  }
  
  updateRaceLogDisplay() {
    if (!this.raceLogContent) return;
    
    this.raceLogContent.innerHTML = '';
    
    if (this.raceLog.length === 0) {
      this.raceLogContent.innerHTML = '<p style="color: #6b7280; font-style: italic;">No races completed yet</p>';
      return;
    }
    
    // Show last 5 races
    const recentRaces = this.raceLog.slice(-5).reverse();
    
    recentRaces.forEach((race, index) => {
      const raceEntry = document.createElement('div');
      raceEntry.style.cssText = `
        margin-bottom: 12px;
        padding: 8px;
        background: rgba(55, 65, 81, 0.3);
        border-radius: 4px;
        font-size: 11px;
      `;
      
      raceEntry.innerHTML = `
        <div style="color: #fbbf24; font-weight: bold;">Race ${this.raceLog.length - index}</div>
        <div style="color: #9ca3af; margin-bottom: 4px;">${race.date}</div>
        <div>Time: <span style="color: ${race.speed === 'DNF' ? '#ef4444' : '#10b981'};">${race.speed === 'DNF' ? 'DNF' : (race.speed || 'N/A') + 's'}</span></div>
        <div>Keystrokes: <span style="color: #3b82f6;">${race.correctKeystrokes}/${race.totalKeystrokes}</span></div>
        <div>Accuracy: <span style="color: ${(race.accuracy || 0) >= 90 ? '#10b981' : (race.accuracy || 0) >= 75 ? '#f59e0b' : '#ef4444'};">${race.accuracy || 0}%</span></div>
        <div style="color: #6b7280; font-size: 10px;">Status: ${race.status || 'completed'}</div>
      `;
      
      this.raceLogContent.appendChild(raceEntry);
    });
  }
  
  createRightPanel() {
    // Create unified right panel container
    this.rightPanel = document.createElement('div');
    this.rightPanel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 8px;
      border: 2px solid #374151;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 1000;
      min-width: 300px;
      max-width: 350px;
    `;
    
    // Create header with toggle button
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      cursor: pointer;
    `;
    
    const title = document.createElement('span');
    title.textContent = '🐛 Debug Panel';
    title.style.fontWeight = 'bold';
    
    const toggleBtn = document.createElement('span');
    toggleBtn.textContent = '−';
    toggleBtn.style.cssText = `
      font-size: 16px;
      cursor: pointer;
      user-select: none;
    `;
    
    header.appendChild(title);
    header.appendChild(toggleBtn);
    
    // Create content container
    const content = document.createElement('div');
    content.id = 'debug-content';
    
    // Square Size Control
    content.appendChild(this.createDebugControl(
      'Square Size',
      'squareSize',
      this.squareSize,
      20,
      100,
      5,
      'Visual size of each square in pixels. Found in constructor as this.squareSize = 50'
    ));
    
    // Grid Height Control
    content.appendChild(this.createDebugControl(
      'Grid Height',
      'gridVNumber',
      this.gridVNumber,
      6,
      20,
      1,
      'How many squares tall the total grid is. Found in constructor as this.gridVNumber = 12'
    ));
    
    // Grid Width Control
    content.appendChild(this.createDebugControl(
      'Grid Width',
      'gridHNumber',
      this.gridHNumber,
      6,
      30,
      1,
      'How many squares wide the total grid is. Found in constructor as this.gridHNumber = 12'
    ));
    
    // Track Inside Height Control
    content.appendChild(this.createDebugControl(
      'Track Inside Height',
      'trackVNumber',
      this.trackVNumber,
      2,
      15,
      1,
      'How many squares tall the inside of the track is. Found in constructor as this.trackVNumber = 6'
    ));
    
    // Track Inside Width Control
    content.appendChild(this.createDebugControl(
      'Track Inside Width',
      'trackHNumber',
      this.trackHNumber,
      2,
      15,
      1,
      'How many squares wide the inside of the track is. Found in constructor as this.trackHNumber = 6'
    ));
    
    // Track Thickness Control
    content.appendChild(this.createDebugControl(
      'Track Thickness',
      'trackThickness',
      this.trackThickness,
      1,
      3,
      1,
      'Track border thickness (1,2,3). Additional squares go outside minimal track. Found in constructor as this.trackThickness = 2'
    ));
    
    // Audio Controls Section
    const audioHeader = document.createElement('h4');
    audioHeader.textContent = 'Audio Controls';
    audioHeader.style.cssText = `
      margin: 20px 0 10px 0;
      color: #e5e7eb;
      font-size: 14px;
      font-weight: bold;
    `;
    content.appendChild(audioHeader);
    
    // Movement Sounds Toggle
    content.appendChild(this.createDebugToggle(
      'Movement Sounds',
      'movementSoundsEnabled',
      this.movementSoundsEnabled,
      'On-track rev sounds and off-track bonk sounds. Found in playOnTrackSound() and playOffTrackSound() methods'
    ));
    
    // Lap Count Sounds Toggle
    content.appendChild(this.createDebugToggle(
      'Lap Count Sounds',
      'lapCountSoundsEnabled',
      this.lapCountSoundsEnabled,
      'High-pitched tones when completing laps. Found in playLapCountTone() method called from checkLap()'
    ));
    
    // Upcoming Turn Sounds Toggle
    content.appendChild(this.createDebugToggle(
      'Upcoming Turn Sounds',
      'upcomingTurnSoundsEnabled',
      this.upcomingTurnSoundsEnabled,
      'Warning sound when approaching turn zone (barrel marker). Found in playUpcomingTurnSound() method'
    ));
    
    // Upcoming Turn Distance Control
    content.appendChild(this.createDebugControl(
      'Upcoming Turn Distance',
      'upcomingTurnDistance',
      this.upcomingTurnDistance,
      -3,
      3,
      1,
      'Tile offset for upcoming turn warning. 0=at interior boundary, +1=one tile earlier, -1=one tile later. Found in checkTurnIndicator() upcoming turn logic'
    ));
    
    // Correct Turn Sounds Toggle
    content.appendChild(this.createDebugToggle(
      'Correct Turn Sounds',
      'correctTurnSoundsEnabled',
      this.correctTurnSoundsEnabled,
      'Confirmation when turning in correct direction. Found in playCorrectTurnSound() method'
    ));
    
    // Completing Turn Sounds Toggle
    content.appendChild(this.createDebugToggle(
      'Completing Turn Sounds',
      'completingTurnSoundsEnabled',
      this.completingTurnSoundsEnabled,
      'Sound when passing barrel marker after turn. Found in playCompletingTurnSound() method'
    ));
    
    // Completing Turn Distance Control
    content.appendChild(this.createDebugControl(
      'Completing Turn Distance',
      'completingTurnDistance',
      this.completingTurnDistance,
      -3,
      3,
      1,
      'Tile offset for completing turn sound. 0=at boundary exit, +1=one tile before exit, -1=one tile after exit. Found in checkTurnIndicator() completing turn logic'
    ));
    
    // Perfect Turn Sounds Toggle
    content.appendChild(this.createDebugToggle(
      'Perfect Turn Sounds',
      'perfectTurnSoundsEnabled',
      this.perfectTurnSoundsEnabled,
      'Emphatic sound for perfect cornering. Found in playPerfectTurnSound() method'
    ));

    // Chord Input Debounce Control
    content.appendChild(this.createDebugControl(
      'Chord Debounce (ms)',
      'debounceAmount',
      this.debounceAmount,
      10,
      200,
      5,
      'Milliseconds to wait after key release before processing chord. Higher = more forgiving but slower. Found in ChordInput.ts as RELEASE_DEBOUNCE_MS'
    ));
    
    // Create the right panel container
    this.rightPanel = document.createElement('div');
    this.rightPanel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 8px;
      border: 2px solid #374151;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      z-index: 1000;
      min-width: 300px;
      max-width: 350px;
    `;
    
    // Create collapsible accordion sections
    
    // Braille Steering Section
    const brailleHeader = document.createElement('div');
    brailleHeader.style.cssText = 'background: #374151; padding: 12px; font-weight: bold; color: #fbbf24; border-bottom: 1px solid #555; cursor: pointer; display: flex; justify-content: space-between; align-items: center;';
    
    const brailleTitle = document.createElement('span');
    brailleTitle.textContent = '🧠 Braille Steering';
    
    const brailleToggle = document.createElement('span');
    brailleToggle.textContent = '−'; // Start expanded
    brailleToggle.style.cssText = 'font-size: 16px; user-select: none;';
    
    brailleHeader.appendChild(brailleTitle);
    brailleHeader.appendChild(brailleToggle);
    
    const brailleContent = document.createElement('div');
    brailleContent.innerHTML = `
      <div style="padding: 16px; text-align: center;">
        <img src="public/grasscorner.png" style="width: 32px; height: 32px; image-rendering: pixelated; margin-bottom: 15px;">
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 8px; font-size: 11px; margin-bottom: 15px;">
          <div></div><div style="color: #10b981;">⠝ N ↑</div><div></div>
          <div style="color: #10b981;">⠺ W ←</div><div style="font-size: 16px; color: #6b7280;">✤</div><div style="color: #10b981;">⠑ E →</div>
          <div></div><div style="color: #10b981;">⠎ S ↓</div><div></div>
        </div>
      </div>
    `;
    
    let brailleCollapsed = false;
    brailleHeader.addEventListener('click', () => {
      brailleCollapsed = !brailleCollapsed;
      brailleToggle.textContent = brailleCollapsed ? '+' : '−';
      brailleContent.style.display = brailleCollapsed ? 'none' : 'block';
    });
    
    // Race Log Section
    const raceLogHeader = document.createElement('div');
    raceLogHeader.style.cssText = 'background: #374151; padding: 12px; font-weight: bold; color: #fbbf24; border-bottom: 1px solid #555; cursor: pointer; display: flex; justify-content: space-between; align-items: center;';
    
    const raceLogTitle = document.createElement('span');
    raceLogTitle.textContent = '🏁 Race Log';
    
    const raceLogToggle = document.createElement('span');
    raceLogToggle.textContent = '−'; // Start expanded
    raceLogToggle.style.cssText = 'font-size: 16px; user-select: none; margin-left: 8px;';
    
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.style.cssText = 'background: #ef4444; color: white; border: none; padding: 4px 8px; border-radius: 3px; font-size: 10px; cursor: pointer; margin-right: 8px;';
    clearButton.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent header click
      this.clearRaceData();
    });
    
    const raceLogHeaderLeft = document.createElement('div');
    raceLogHeaderLeft.appendChild(raceLogTitle);
    
    const raceLogHeaderRight = document.createElement('div');
    raceLogHeaderRight.style.display = 'flex';
    raceLogHeaderRight.style.alignItems = 'center';
    raceLogHeaderRight.appendChild(clearButton);
    raceLogHeaderRight.appendChild(raceLogToggle);
    
    raceLogHeader.appendChild(raceLogHeaderLeft);
    raceLogHeader.appendChild(raceLogHeaderRight);
    
    this.raceLogContent = document.createElement('div');
    this.raceLogContent.style.cssText = 'padding: 16px; font-size: 11px;';
    this.updateRaceLogDisplay();
    
    let raceLogCollapsed = false;
    raceLogHeader.addEventListener('click', () => {
      raceLogCollapsed = !raceLogCollapsed;
      raceLogToggle.textContent = raceLogCollapsed ? '+' : '−';
      this.raceLogContent.style.display = raceLogCollapsed ? 'none' : 'block';
    });
    
    // Create debug section
    const debugHeader = document.createElement('div');
    debugHeader.style.cssText = 'background: #374151; padding: 12px; font-weight: bold; color: #fbbf24; border-bottom: 1px solid #555; cursor: pointer; display: flex; justify-content: space-between; align-items: center;';
    
    const debugTitle = document.createElement('span');
    debugTitle.textContent = '🐛 Debug Controls';
    
    const debugToggle = document.createElement('span');
    debugToggle.textContent = this.debugCollapsed ? '+' : '−';
    debugToggle.style.cssText = 'font-size: 16px; user-select: none;';
    
    debugHeader.appendChild(debugTitle);
    debugHeader.appendChild(debugToggle);
    
    const debugContent = document.createElement('div');
    debugContent.style.cssText = `padding: 16px; font-size: 11px; ${this.debugCollapsed ? 'display: none;' : ''}`;
    
    // Add all debug controls
    debugContent.appendChild(this.createDebugControl(
      'Grid Width', 'gridHNumber', this.gridHNumber, 16, 40, 1,
      'Number of grid squares horizontally'
    ));
    
    debugContent.appendChild(this.createDebugControl(
      'Grid Height', 'gridVNumber', this.gridVNumber, 10, 30, 1,
      'Number of grid squares vertically'
    ));
    
    debugContent.appendChild(this.createDebugControl(
      'Track Width', 'trackHNumber', this.trackHNumber, 4, 20, 1,
      'Inner track width in squares'
    ));
    
    debugContent.appendChild(this.createDebugControl(
      'Track Height', 'trackVNumber', this.trackVNumber, 3, 15, 1,
      'Inner track height in squares'
    ));
    
    debugContent.appendChild(this.createDebugControl(
      'Track Thickness', 'trackThickness', this.trackThickness, 1, 8, 1,
      'Thickness of track border'
    ));
    
    debugContent.appendChild(this.createDebugControl(
      'Square Size', 'squareSize', this.squareSize, 20, 100, 5,
      'Size of each grid square in pixels'
    ));
    
    debugContent.appendChild(this.createDebugToggle(
      'Audio Enabled', 'audioEnabled', this.audioEnabled,
      'Enable/disable all audio effects'
    ));
    
    debugContent.appendChild(this.createDebugToggle(
      'Movement Sounds', 'movementSoundsEnabled', this.movementSoundsEnabled,
      'Enable/disable movement sound effects'
    ));
    
    debugContent.appendChild(this.createDebugToggle(
      'Lap Count Sounds', 'lapCountSoundsEnabled', this.lapCountSoundsEnabled,
      'Enable/disable lap counting audio'
    ));
    
    debugContent.appendChild(this.createDebugControl(
      'Target Laps', 'targetLaps', this.targetLaps, 1, 10, 1,
      'Number of laps required to complete race'
    ));
    
    debugContent.appendChild(this.createDebugToggle(
      'Upcoming Turn Sounds', 'upcomingTurnSoundsEnabled', this.upcomingTurnSoundsEnabled,
      'Enable/disable upcoming turn audio cues'
    ));
    
    debugContent.appendChild(this.createDebugToggle(
      'Completing Turn Sounds', 'completingTurnSoundsEnabled', this.completingTurnSoundsEnabled,
      'Enable/disable turn completion audio'
    ));
    
    debugContent.appendChild(this.createDebugControl(
      'Typing Speed Factor', 'typingSpeed', this.typingSpeed, 0.5, 5.0, 0.1,
      'Speed multiplier based on typing cadence'
    ));
    
    debugContent.appendChild(this.createDebugToggle(
      'Perfect Turn Sounds', 'perfectTurnSoundsEnabled', this.perfectTurnSoundsEnabled,
      'Enable/disable perfect turn audio feedback'
    ));
    
    // Chord Input Debounce Control
    debugContent.appendChild(this.createDebugControl(
      'Chord Debounce (ms)', 'debounceAmount', this.debounceAmount, 0, 200, 10,
      'Milliseconds to wait after key release before processing chord. Higher = more forgiving but slower. Found in ChordInput.ts as RELEASE_DEBOUNCE_MS'
    ));
    
    // Debug header click handler
    debugHeader.addEventListener('click', () => {
      this.debugCollapsed = !this.debugCollapsed;
      debugToggle.textContent = this.debugCollapsed ? '+' : '−';
      debugContent.style.display = this.debugCollapsed ? 'none' : 'block';
    });
    
    // Add all sections to panel
    this.rightPanel.appendChild(brailleHeader);
    this.rightPanel.appendChild(brailleContent);
    this.rightPanel.appendChild(raceLogHeader);
    this.rightPanel.appendChild(this.raceLogContent);
    this.rightPanel.appendChild(debugHeader);
    this.rightPanel.appendChild(debugContent);
    
    // Set debugPanel reference for compatibility
    this.debugPanel = this.rightPanel;
    this.debugSection = debugContent;
    
    document.body.appendChild(this.rightPanel);
  }
  
  createDebugControl(label: string, property: string, value: number, min: number, max: number, step: number, tooltip: string): HTMLDivElement {
    const container = document.createElement('div');
    container.style.marginBottom = '12px';
    
    // Label with tooltip
    const labelContainer = document.createElement('div');
    labelContainer.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 4px;
    `;
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.style.cssText = `
      display: block;
      margin-right: 8px;
      font-weight: bold;
    `;
    
    const infoBtn = document.createElement('span');
    infoBtn.textContent = 'ℹ️';
    infoBtn.style.cssText = `
      cursor: help;
      font-size: 10px;
      opacity: 0.7;
    `;
    infoBtn.title = tooltip;
    
    labelContainer.appendChild(labelEl);
    labelContainer.appendChild(infoBtn);
    
    // Input container
    const inputContainer = document.createElement('div');
    inputContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    
    // Range slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min.toString();
    slider.max = max.toString();
    slider.step = step.toString();
    slider.value = value.toString();
    slider.setAttribute('data-property', property);
    slider.style.cssText = `
      flex: 1;
      cursor: pointer;
    `;
    
    // Value display
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = value.toString();
    valueDisplay.style.cssText = `
      min-width: 30px;
      text-align: right;
      font-family: monospace;
    `;
    
    // Update handler
    slider.addEventListener('input', (e) => {
      const newValue = parseInt((e.target as HTMLInputElement).value);
      
      // Validate the new value before applying
      let isValid = true;
      let errorMessage = '';
      
      if (property === 'trackVNumber' && newValue >= this.gridVNumber) {
        isValid = false;
        errorMessage = 'Track height must be less than grid height';
      } else if (property === 'trackHNumber' && newValue >= this.gridHNumber) {
        isValid = false;
        errorMessage = 'Track width must be less than grid width';
      } else if (property === 'trackThickness' && newValue < 1) {
        isValid = false;
        errorMessage = 'Track thickness must be at least 1';
      } else if (property === 'gridVNumber' && this.trackVNumber >= newValue) {
        isValid = false;
        errorMessage = 'Grid height must be greater than track height';
      } else if (property === 'gridHNumber' && this.trackHNumber >= newValue) {
        isValid = false;
        errorMessage = 'Grid width must be greater than track width';
      }
      
      if (!isValid) {
        console.warn(`⚠️ Invalid value: ${errorMessage}`);
        slider.value = (this as any)[property].toString();
        return;
      }
      
      valueDisplay.textContent = newValue.toString();
      (this as any)[property] = newValue;
      this.rebuildTrack();
      
      // Reset game state to start when debug values change
      this.resetGame();
    });
    
    inputContainer.appendChild(slider);
    inputContainer.appendChild(valueDisplay);
    
    container.appendChild(labelContainer);
    container.appendChild(inputContainer);
    
    return container;
  }
  
  createDebugToggle(label: string, property: string, value: boolean, tooltip: string): HTMLDivElement {
    const container = document.createElement('div');
    container.style.marginBottom = '12px';
    
    // Label with tooltip
    const labelContainer = document.createElement('div');
    labelContainer.style.cssText = `
      display: flex;
      align-items: center;
      margin-bottom: 4px;
    `;
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    labelEl.style.cssText = `
      display: block;
      margin-right: 8px;
      font-weight: bold;
    `;
    
    const infoBtn = document.createElement('span');
    infoBtn.textContent = 'ℹ️';
    infoBtn.style.cssText = `
      cursor: help;
      font-size: 10px;
      opacity: 0.7;
    `;
    infoBtn.title = tooltip;
    
    labelContainer.appendChild(labelEl);
    labelContainer.appendChild(infoBtn);
    
    // Toggle container
    const toggleContainer = document.createElement('div');
    toggleContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
    `;
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = value;
    checkbox.setAttribute('data-property', property);
    checkbox.style.cssText = `
      cursor: pointer;
      transform: scale(1.2);
    `;
    
    // Status text
    const statusText = document.createElement('span');
    statusText.textContent = value ? 'ON' : 'OFF';
    statusText.style.cssText = `
      font-family: monospace;
      color: ${value ? '#10b981' : '#ef4444'};
      font-weight: bold;
    `;
    
    // Update handler
    checkbox.addEventListener('change', (e) => {
      const newValue = (e.target as HTMLInputElement).checked;
      statusText.textContent = newValue ? 'ON' : 'OFF';
      statusText.style.color = newValue ? '#10b981' : '#ef4444';
      (this as any)[property] = newValue;
    });
    
    toggleContainer.appendChild(checkbox);
    toggleContainer.appendChild(statusText);
    
    container.appendChild(labelContainer);
    container.appendChild(toggleContainer);
    
    return container;
  }
  
  rebuildTrack() {
    // Remove existing track graphics
    this.trackContainer.removeChildren();
    
    // Recalculate start/finish position and flag line
    this.calculateStartFinishPosition();
    
    // Create grid lines (optional - can be removed if you don't want them)
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(1, 0xe5e7eb, 0.1); // Very faint grid lines
    for (let i = 0; i <= this.gridHNumber; i++) {
      graphics.moveTo(i * this.squareSize, 0);
      graphics.lineTo(i * this.squareSize, this.gridVNumber * this.squareSize);
    }
    for (let j = 0; j <= this.gridVNumber; j++) {
      graphics.moveTo(0, j * this.squareSize);
      graphics.lineTo(this.gridHNumber * this.squareSize, j * this.squareSize);
    }
    this.trackContainer.addChild(graphics);
    
    // Draw track squares using sprites or fallback to graphics
    console.log('🎨 Rebuilding track with texturesLoaded =', this.texturesLoaded);
    
    for (let x = 0; x < this.gridHNumber; x++) {
      for (let y = 0; y < this.gridVNumber; y++) {
        const cellType = this.getCellType(x, y);
        
        if (this.texturesLoaded) {
          // Check for corners first
          const corner = this.getCornerType(x, y);
          let sprite: PIXI.Sprite;
          
          if (corner.type === 'inside') {
            sprite = new PIXI.Sprite(this.grassCornerTexture);
          } else if (corner.type === 'outside') {
            sprite = new PIXI.Sprite(this.roadCornerTexture);
          } else if (cellType === 'track') {
            sprite = new PIXI.Sprite(this.roadTexture);
          } else if (cellType === 'start') {
            sprite = new PIXI.Sprite(this.roadStripeTexture);
          } else {
            sprite = new PIXI.Sprite(this.grassTexture);
          }
          
          // Position and scale the sprite
          sprite.x = x * this.squareSize;
          sprite.y = y * this.squareSize;
          sprite.width = this.squareSize;
          sprite.height = this.squareSize;
          
          // Enable nearest neighbor (pixelated) rendering
          sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
          
          // Apply rotation if it's a corner
          if (corner.type !== 'none') {
            sprite.anchor.set(0.5, 0.5);
            sprite.x += this.squareSize / 2;
            sprite.y += this.squareSize / 2;
            sprite.rotation = (corner.rotation * Math.PI) / 180;
          }
          
          this.trackContainer.addChild(sprite);
          
          // Check for corner signs and add them on top
          const signTexture = this.getCornerSignTexture(x, y);
          if (signTexture) {
            const signSprite = new PIXI.Sprite(signTexture);
            signSprite.x = x * this.squareSize;
            signSprite.y = y * this.squareSize;
            signSprite.width = this.squareSize;
            signSprite.height = this.squareSize;
            signSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            this.trackContainer.addChild(signSprite);
          }
        } else {
          // Fallback to graphics if textures failed to load
          const fallbackGraphics = new PIXI.Graphics();
          
          if (cellType === 'track') {
            fallbackGraphics.beginFill(0x1e3a8a); // Blue track
          } else if (cellType === 'start') {
            fallbackGraphics.beginFill(0x8b5cf6); // Purple start/finish
          } else {
            fallbackGraphics.beginFill(0x0f172a); // Dark grass/off-track
          }
          
          fallbackGraphics.drawRect(x * this.squareSize, y * this.squareSize, this.squareSize, this.squareSize);
          fallbackGraphics.endFill();
          this.trackContainer.addChild(fallbackGraphics);
        }
      }
    }
    
    // Re-add player sprite if it exists (will be moved to top layer after reset)
    if (this.player) {
      this.trackContainer.addChild(this.player);
      this.updateCarRotation();
    }
    
    // Add start flag if game is not active
    this.createStartFlag();
    
    // Create central lap display
    this.createCentralDisplay();
    
    // Reset player to start position
    this.resetPlayerToStart();
    
    // Update canvas size
    const newWidth = this.gridHNumber * this.squareSize;
    const newHeight = this.gridVNumber * this.squareSize;
    if (app.screen.width !== newWidth || app.screen.height !== newHeight) {
      app.renderer.resize(newWidth, newHeight);
    }
    
    // Update slider ranges
    this.updateSliderRanges();
    
    // Position centered UI elements
    this.positionCenteredUI();
  }
  
  updateSliderRanges() {
    // Update max values for track dimension sliders
    const maxTrackH = Math.floor(this.gridHNumber * 0.8);
    const maxTrackV = Math.floor(this.gridVNumber * 0.8);
    
    const trackHSlider = document.querySelector('input[data-property="trackHNumber"]') as HTMLInputElement;
    const trackVSlider = document.querySelector('input[data-property="trackVNumber"]') as HTMLInputElement;
    
    if (trackHSlider) {
      trackHSlider.max = maxTrackH.toString();
      if (parseInt(trackHSlider.value) > maxTrackH) {
        trackHSlider.value = maxTrackH.toString();
        this.trackHNumber = maxTrackH;
      }
    }
    
    if (trackVSlider) {
      trackVSlider.max = maxTrackV.toString();
      if (parseInt(trackVSlider.value) > maxTrackV) {
        trackVSlider.value = maxTrackV.toString();
        this.trackVNumber = maxTrackV;
      }
    }
  }
  
  calculateStartFinishPosition() {
    // Start/finish line is in the center of the top strip
    const trackStartX = Math.floor((this.gridHNumber - this.trackHNumber) / 2) - this.trackThickness;
    const trackStartY = Math.floor((this.gridVNumber - this.trackVNumber) / 2) - this.trackThickness;
    
    const flagX = Math.floor(this.gridHNumber / 2);
    
    // Create flag line - dynamic number of squares based on track thickness
    this.flagLineSquares = [];
    for (let i = 0; i < this.trackThickness; i++) {
      this.flagLineSquares.push({ x: flagX, y: trackStartY + i });
    }
    
    // Player starts on the innermost flag square (last one)
    this.startFinishPos = {
      x: flagX,
      y: trackStartY + this.trackThickness - 1
    };
  }
  
  getCornerSignTexture(x: number, y: number): PIXI.Texture | null {
    // Calculate track boundaries to identify corners
    const trackStartX = Math.floor((this.gridHNumber - this.trackHNumber) / 2) - this.trackThickness;
    const trackEndX = trackStartX + this.trackHNumber + (this.trackThickness * 2);
    const trackStartY = Math.floor((this.gridVNumber - this.trackVNumber) / 2) - this.trackThickness;
    const trackEndY = trackStartY + this.trackVNumber + (this.trackThickness * 2);
    
    // Only place signs on exterior grass tiles
    if (this.getCellType(x, y) !== 'exterior') return null;
    
    // Check if this is an outside grass square at specific corners
    
    // SW corner (sign-n.png) - outside grass tile SW of the track
    if (x === trackStartX - 1 && y === trackEndY) {
      return this.signNTexture;
    }
    
    // NW corner (sign-e.png) - outside grass tile NW of the track  
    if (x === trackStartX - 1 && y === trackStartY - 1) {
      return this.signETexture;
    }
    
    // NE corner (sign-s.png) - outside grass tile NE of the track
    if (x === trackEndX && y === trackStartY - 1) {
      return this.signSTexture;
    }
    
    // SE corner (sign-w.png) - outside grass tile SE of the track
    if (x === trackEndX && y === trackEndY) {
      return this.signWTexture;
    }
    
    return null;
  }
  
  getCellType(x: number, y: number): 'track' | 'start' | 'interior' | 'exterior' {
    // Calculate track boundaries
    const trackStartX = Math.floor((this.gridHNumber - this.trackHNumber) / 2) - this.trackThickness;
    const trackEndX = trackStartX + this.trackHNumber + (this.trackThickness * 2);
    const trackStartY = Math.floor((this.gridVNumber - this.trackVNumber) / 2) - this.trackThickness;
    const trackEndY = trackStartY + this.trackVNumber + (this.trackThickness * 2);
    
    const interiorStartX = trackStartX + this.trackThickness;
    const interiorEndX = trackEndX - this.trackThickness;
    const interiorStartY = trackStartY + this.trackThickness;
    const interiorEndY = trackEndY - this.trackThickness;
    
    // Check if it's part of the flag line
    const isFlagSquare = this.flagLineSquares.some(flag => flag.x === x && flag.y === y);
    if (isFlagSquare) {
      return 'start';
    }
    
    // Check if it's in the track area but not interior
    if (x >= trackStartX && x < trackEndX && y >= trackStartY && y < trackEndY) {
      if (x >= interiorStartX && x < interiorEndX && y >= interiorStartY && y < interiorEndY) {
        return 'interior';
      }
      return 'track';
    }
    
    return 'exterior';
  }
  
  getCornerType(x: number, y: number): { type: 'none' | 'inside' | 'outside', rotation: number } {
    const cellType = this.getCellType(x, y);
    if (cellType === 'exterior') return { type: 'none', rotation: 0 };
    
    // Check if this is a corner by examining neighbors
    const neighbors = {
      north: y > 0 ? this.getCellType(x, y - 1) : 'exterior',
      south: y < this.gridVNumber - 1 ? this.getCellType(x, y + 1) : 'exterior',
      east: x < this.gridHNumber - 1 ? this.getCellType(x + 1, y) : 'exterior',
      west: x > 0 ? this.getCellType(x - 1, y) : 'exterior'
    };
    
    const isTrack = (type: string) => type === 'track' || type === 'start';
    const isOffTrack = (type: string) => type === 'exterior' || type === 'interior';
    
    // Count track and off-track neighbors
    const trackNeighbors = [
      isTrack(neighbors.north),
      isTrack(neighbors.east), 
      isTrack(neighbors.south),
      isTrack(neighbors.west)
    ];
    
    const offTrackNeighbors = [
      isOffTrack(neighbors.north),
      isOffTrack(neighbors.east),
      isOffTrack(neighbors.south), 
      isOffTrack(neighbors.west)
    ];
    
    // Outside corner: track cell with exactly 2 adjacent off-track neighbors at 90° angle
    if (isTrack(cellType)) {
      // Check for L-shaped patterns (outside corners)
      if (offTrackNeighbors[0] && offTrackNeighbors[1] && !offTrackNeighbors[2] && !offTrackNeighbors[3]) {
        return { type: 'outside', rotation: 0 }; // Top-right corner (default)
      }
      if (offTrackNeighbors[1] && offTrackNeighbors[2] && !offTrackNeighbors[3] && !offTrackNeighbors[0]) {
        return { type: 'outside', rotation: 90 }; // Bottom-right corner
      }
      if (offTrackNeighbors[2] && offTrackNeighbors[3] && !offTrackNeighbors[0] && !offTrackNeighbors[1]) {
        return { type: 'outside', rotation: 180 }; // Bottom-left corner
      }
      if (offTrackNeighbors[3] && offTrackNeighbors[0] && !offTrackNeighbors[1] && !offTrackNeighbors[2]) {
        return { type: 'outside', rotation: 270 }; // Top-left corner
      }
    }
    
    // Inside corner: off-track cell with exactly 2 adjacent track neighbors at 90° angle
    if (isOffTrack(cellType)) {
      if (trackNeighbors[0] && trackNeighbors[1] && !trackNeighbors[2] && !trackNeighbors[3]) {
        return { type: 'inside', rotation: 0 }; // Top-right inside corner
      }
      if (trackNeighbors[1] && trackNeighbors[2] && !trackNeighbors[3] && !trackNeighbors[0]) {
        return { type: 'inside', rotation: 90 }; // Bottom-right inside corner
      }
      if (trackNeighbors[2] && trackNeighbors[3] && !trackNeighbors[0] && !trackNeighbors[1]) {
        return { type: 'inside', rotation: 180 }; // Bottom-left inside corner
      }
      if (trackNeighbors[3] && trackNeighbors[0] && !trackNeighbors[1] && !trackNeighbors[2]) {
        return { type: 'inside', rotation: 270 }; // Top-left inside corner
      }
    }
    
    return { type: 'none', rotation: 0 };
  }
  
  updateCarRotation() {
    console.log('🚗 updateCarRotation called');
    console.log('  - this.player exists:', !!this.player);
    console.log('  - this.player is Sprite:', this.player instanceof PIXI.Sprite);
    console.log('  - this.lastDirection:', this.lastDirection);
    
    if (this.player && this.player instanceof PIXI.Sprite && this.lastDirection) {
      // Car texture faces north by default, rotate based on direction
      const rotations = {
        'N': 0,    // North (default)
        'E': 90,   // East
        'S': 180,  // South  
        'W': 270   // West
      };
      
      const rotation = rotations[this.lastDirection as keyof typeof rotations] || 0;
      console.log('  - calculated rotation:', rotation, 'degrees');
      console.log('  - setting player.rotation to:', (rotation * Math.PI) / 180, 'radians');
      this.player.rotation = (rotation * Math.PI) / 180;
      console.log('  - player.rotation after setting:', this.player.rotation);
    } else {
      console.log('  - rotation skipped due to conditions not met');
    }
  }
  
  createStartFlag() {
    if (!this.texturesLoaded || !this.startflagTexture) return;
    
    // Remove existing flag if it exists
    if (this.startflagSprite) {
      this.trackContainer.removeChild(this.startflagSprite);
      this.startflagSprite.destroy();
    }
    
    // Only show flag when game is not active
    if (this.gameState === 'playing') return;
    
    // Place flag one space ahead of starting line (eastward)
    const flagX = this.startFinishPos.x + 1;
    const flagY = this.startFinishPos.y;
    
    this.startflagSprite = new PIXI.Sprite(this.startflagTexture);
    this.startflagSprite.x = flagX * this.squareSize;
    this.startflagSprite.y = flagY * this.squareSize;
    this.startflagSprite.width = this.squareSize;
    this.startflagSprite.height = this.squareSize;
    this.startflagSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    
    this.trackContainer.addChild(this.startflagSprite);
    console.log('🏁 Start flag placed at', flagX, flagY);
    console.log('🏁 Player position:', this.playerPos.x, this.playerPos.y);
    console.log('🏁 Start/finish position:', this.startFinishPos.x, this.startFinishPos.y);
    console.log('🏁 Distance to flag:', Math.abs(this.playerPos.x - flagX) + Math.abs(this.playerPos.y - flagY));
  }
  
  createCentralDisplay() {
    // Remove existing display if it exists
    if (this.centralDisplayContainer) {
      this.trackContainer.removeChild(this.centralDisplayContainer);
      this.centralDisplayContainer.destroy();
    }
    
    // Clear existing road strip
    for (const strip of this.centralDisplayStrip) {
      this.trackContainer.removeChild(strip);
      strip.destroy();
    }
    this.centralDisplayStrip = [];
    
    // Only create display if textures are loaded
    if (!this.texturesLoaded || !this.roadTexture) {
      console.log('⚠️ Textures not loaded yet, skipping central display');
      return;
    }
    
    // Calculate center of track
    const centerX = Math.floor(this.gridHNumber / 2);
    const centerY = Math.floor(this.gridVNumber / 2);
    
    // Create 4x1 road tile strip horizontally centered
    for (let i = -1; i <= 2; i++) {
      const roadSprite = new PIXI.Sprite(this.roadTexture);
      roadSprite.x = (centerX + i - 0.5) * this.squareSize;
      roadSprite.y = centerY * this.squareSize;
      roadSprite.width = this.squareSize;
      roadSprite.height = this.squareSize;
      roadSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      
      this.trackContainer.addChild(roadSprite);
      this.centralDisplayStrip.push(roadSprite);
    }
    
    // Create container for text
    this.centralDisplayContainer = new PIXI.Container();
    
    // Create arcade-style text
    this.centralLapText = new PIXI.Text('Hit flag to start', {
      fontFamily: 'Courier New, monospace',
      fontSize: 16,
      fill: 0xffffff,
      align: 'center'
    });
    
    // Center the text perfectly on the 4x1 road strip
    this.centralLapText.anchor.set(0.5);
    this.centralLapText.x = (centerX + 0.5) * this.squareSize; // Center of 4-tile strip
    this.centralLapText.y = centerY * this.squareSize + (this.squareSize / 2); // Perfect vertical center
    
    this.centralDisplayContainer.addChild(this.centralLapText);
    this.trackContainer.addChild(this.centralDisplayContainer);
    
    console.log('🏁 Central display created at', centerX, centerY);
  }
  
  updateCentralDisplay(message: string) {
    if (this.centralLapText) {
      this.centralLapText.text = message;
    }
  }
  
  ensurePlayerOnTop() {
    // Move player to the top of the rendering order so it appears above skid marks
    if (this.player && this.trackContainer) {
      this.trackContainer.removeChild(this.player);
      this.trackContainer.addChild(this.player);
    }
  }
  
  addSkidMark(x: number, y: number, direction: string) {
    if (!this.texturesLoaded) return;
    
    // Get the appropriate skid texture
    let skidTexture: PIXI.Texture;
    switch (direction) {
      case 'N': skidTexture = this.skidNTexture; break;
      case 'E': skidTexture = this.skidETexture; break;
      case 'S': skidTexture = this.skidSTexture; break;
      case 'W': skidTexture = this.skidWTexture; break;
      default: return;
    }
    
    // Create skid sprite
    const skidSprite = new PIXI.Sprite(skidTexture);
    skidSprite.x = x * this.squareSize;
    skidSprite.y = y * this.squareSize;
    skidSprite.width = this.squareSize;
    skidSprite.height = this.squareSize;
    skidSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    skidSprite.alpha = 1.0; // Start at full opacity
    
    // Add to track container (above ground tiles but below player)
    this.trackContainer.addChild(skidSprite);
    
    // Track the skid mark
    this.skidMarks.push({
      x, y, direction,
      sprite: skidSprite,
      opacity: 1.0
    });
    
    console.log('💨 Added skid mark at', x, y, 'facing', direction);
    
    // Ensure player sprite stays on top
    this.ensurePlayerOnTop();
  }
  
  fadeSkidMarks() {
    // Fade all skid marks by 1% opacity
    for (let i = this.skidMarks.length - 1; i >= 0; i--) {
      const skid = this.skidMarks[i];
      skid.opacity -= 0.01;
      skid.sprite.alpha = skid.opacity;
      
      // Remove skid marks that have faded to 0
      if (skid.opacity <= 0) {
        this.trackContainer.removeChild(skid.sprite);
        skid.sprite.destroy();
        this.skidMarks.splice(i, 1);
        console.log('🗑️ Removed faded skid mark at', skid.x, skid.y);
      }
    }
  }
  
  addOuchDot(x: number, y: number) {
    if (!this.texturesLoaded || !this.ouchTexture) return;
    
    // Check if there's already an ouch dot at this position
    const existingDot = this.ouchDots.find(dot => dot.x === x && dot.y === y);
    if (existingDot) {
      console.log('🔴 Ouch dot already exists at', x, y);
      return;
    }
    
    // Create ouch sprite
    const ouchSprite = new PIXI.Sprite(this.ouchTexture);
    ouchSprite.x = x * this.squareSize;
    ouchSprite.y = y * this.squareSize;
    ouchSprite.width = this.squareSize;
    ouchSprite.height = this.squareSize;
    ouchSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    
    // Add to track container (above ground tiles but below player)
    this.trackContainer.addChild(ouchSprite);
    
    // Track the ouch dot
    this.ouchDots.push({
      x, y,
      sprite: ouchSprite
    });
    
    console.log('🔴 Added ouch dot at', x, y);
    
    // Ensure player sprite stays on top
    this.ensurePlayerOnTop();
  }
  
  removeOuchDot(x: number, y: number) {
    const dotIndex = this.ouchDots.findIndex(dot => dot.x === x && dot.y === y);
    if (dotIndex !== -1) {
      const dot = this.ouchDots[dotIndex];
      this.trackContainer.removeChild(dot.sprite);
      dot.sprite.destroy();
      this.ouchDots.splice(dotIndex, 1);
      console.log('✅ Removed ouch dot at', x, y);
    }
  }
  
  clearAllOuchDots() {
    for (const dot of this.ouchDots) {
      this.trackContainer.removeChild(dot.sprite);
      dot.sprite.destroy();
    }
    this.ouchDots = [];
    console.log('🧹 Cleared all ouch dots');
  }
  
  resetPlayerToStart() {
    // Position player 2 spaces before the starting line (west of it)
    this.playerPos.x = this.startFinishPos.x - 2;
    this.playerPos.y = this.startFinishPos.y;
    this.lastPos = { x: this.startFinishPos.x - 2, y: this.startFinishPos.y };
    if (this.player) {
      this.player.x = (this.playerPos.x + 0.5) * this.squareSize;
      this.player.y = (this.playerPos.y + 0.5) * this.squareSize;
    }
    this.laps = 0;
    this.lastDirection = '';
    this.hasMoved = false;
    
    // Clear all skid marks
    for (const skid of this.skidMarks) {
      this.trackContainer.removeChild(skid.sprite);
      skid.sprite.destroy();
    }
    this.skidMarks = [];
    
    // Clear all ouch dots
    this.clearAllOuchDots();
    
    // Recreate start flag for new game
    this.createStartFlag();
    
    this.updateCarRotation();
  }
  
  setupTrack() {
    this.trackContainer = new PIXI.Container();
    app.stage.addChild(this.trackContainer);
    
    // Calculate start position first
    this.calculateStartFinishPosition();
    
    // Build the track
    this.rebuildTrack();
    
    // Create player sprite after track is built
    console.log('🏗️ Creating player: texturesLoaded =', this.texturesLoaded, 'carTexture exists =', !!this.carTexture);
    if (this.texturesLoaded && this.carTexture) {
      this.player = new PIXI.Sprite(this.carTexture);
      this.player.anchor.set(0.5, 0.5);
      this.player.width = this.squareSize * 0.8;
      this.player.height = this.squareSize * 0.8;
      this.player.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      console.log('✅ Created car sprite player');
    } else {
      // Fallback to graphics if no texture
      this.player = new PIXI.Graphics();
      this.player.beginFill(0xfbbf24);
      this.player.drawCircle(0, 0, this.squareSize * 0.4);
      this.player.endFill();
      console.log('⚠️ Created fallback graphics player');
    }
    this.trackContainer.addChild(this.player);
    
    // Position player at start
    this.resetPlayerToStart();
    
    // Position UI elements
    this.positionCenteredUI();
  }
  isTrackCell(x: number, y: number) {
    const cellType = this.getCellType(x, y);
    return cellType === 'track' || cellType === 'start';
  }
  
  isOnFlagLine(x: number, y: number): boolean {
    return this.flagLineSquares.some(flag => flag.x === x && flag.y === y);
  }
  
  checkTurnIndicator(fromPos: { x: number, y: number }, toPos: { x: number, y: number }, direction: string) {
    // Calculate track boundaries
    const trackStartX = Math.floor((this.gridHNumber - this.trackHNumber) / 2) - this.trackThickness;
    const trackStartY = Math.floor((this.gridVNumber - this.trackVNumber) / 2) - this.trackThickness;
    const interiorStartX = trackStartX + this.trackThickness;
    const interiorStartY = trackStartY + this.trackThickness;
    const interiorEndX = interiorStartX + this.trackHNumber;
    const interiorEndY = interiorStartY + this.trackVNumber;
    
    // Track turn state for perfect turn detection
    let correctTurnMade = false;
    let completingTurnMade = false;
    
    // 1. UPCOMING TURN - Approaching turn zone (barrel marker)
    // When reaching the square before they need to turn (interior boundary + distance offset)
    if (direction === 'E') {
      // Moving East, approaching right turn zone
      const targetX = interiorEndX - 1 + this.upcomingTurnDistance;
      if (fromPos.x < targetX && toPos.x === targetX) {
        this.playUpcomingTurnSound(direction);
      }
    } else if (direction === 'W') {
      // Moving West, approaching left turn zone  
      const targetX = interiorStartX - this.upcomingTurnDistance;
      if (fromPos.x > targetX && toPos.x === targetX) {
        this.playUpcomingTurnSound(direction);
      }
    } else if (direction === 'S') {
      // Moving South, approaching bottom turn zone
      const targetY = interiorEndY - 1 + this.upcomingTurnDistance;
      if (fromPos.y < targetY && toPos.y === targetY) {
        this.playUpcomingTurnSound(direction);
      }
    } else if (direction === 'N') {
      // Moving North, approaching top turn zone
      const targetY = interiorStartY - this.upcomingTurnDistance;
      if (fromPos.y > targetY && toPos.y === targetY) {
        this.playUpcomingTurnSound(direction);
      }
    }
    
    // 2. CORRECT TURN - Changing direction correctly (detecting perpendicular moves)
    const prevDirection = this.getDirection(this.lastPos, fromPos);
    if (prevDirection !== direction && prevDirection !== '') {
      // Player changed direction - this is a turn
      const isCorrectTurn = this.isCorrectTurnDirection(fromPos, toPos, prevDirection, direction);
      if (isCorrectTurn) {
        this.playCorrectTurnSound(direction);
        correctTurnMade = true;
      }
    }
    
    // 3. COMPLETING TURN - Passing barrel marker after turn (exiting turn zone + distance offset)
    if (direction === 'E' || direction === 'W') {
      // Exiting vertical turn zone
      const fromTargetX1 = interiorStartX + this.completingTurnDistance;
      const fromTargetX2 = interiorEndX - 1 + this.completingTurnDistance;
      const toTargetX1 = interiorStartX - this.completingTurnDistance;
      const toTargetX2 = interiorEndX + this.completingTurnDistance;
      if ((fromPos.x === fromTargetX1 || fromPos.x === fromTargetX2) && 
          (toPos.x < toTargetX1 || toPos.x >= toTargetX2)) {
        this.playCompletingTurnSound(direction);
        completingTurnMade = true;
      }
    }
    
    if (direction === 'N' || direction === 'S') {
      // Exiting horizontal turn zone
      const fromTargetY1 = interiorStartY + this.completingTurnDistance;
      const fromTargetY2 = interiorEndY - 1 + this.completingTurnDistance;
      const toTargetY1 = interiorStartY - this.completingTurnDistance;
      const toTargetY2 = interiorEndY + this.completingTurnDistance;
      if ((fromPos.y === fromTargetY1 || fromPos.y === fromTargetY2) && 
          (toPos.y < toTargetY1 || toPos.y >= toTargetY2)) {
        this.playCompletingTurnSound(direction);
        completingTurnMade = true;
      }
    }
    
    // 4. PERFECT TURN - Both correct turn and completing turn in same move
    if (correctTurnMade && completingTurnMade) {
      // Override previous sounds with perfect turn sound
      setTimeout(() => this.playPerfectTurnSound(direction), 50);
    }
  }
  
  isCorrectTurnDirection(fromPos: { x: number, y: number }, toPos: { x: number, y: number }, 
                        prevDirection: string, currentDirection: string): boolean {
    // Determine if the turn is in the correct clockwise direction
    // Based on position relative to track center
    const trackCenterX = Math.floor(this.gridHNumber / 2);
    const trackCenterY = Math.floor(this.gridVNumber / 2);
    
    // Simplified clockwise turn validation
    if (prevDirection === 'E' && currentDirection === 'S') return toPos.x > trackCenterX;
    if (prevDirection === 'S' && currentDirection === 'W') return toPos.y > trackCenterY;
    if (prevDirection === 'W' && currentDirection === 'N') return toPos.x < trackCenterX;
    if (prevDirection === 'N' && currentDirection === 'E') return toPos.y < trackCenterY;
    
    return false;
  }
  createUI() {
    this.uiContainer = new PIXI.Container();
    app.stage.addChild(this.uiContainer);
    
    // Create lap counter in corner (always visible when racing)
    this.lapText = new PIXI.Text('Lap: 1/4', {
      fontSize: 16,
      fill: 0xffffff,
      fontWeight: 'bold'
    });
    this.lapText.x = 10;
    this.lapText.y = 10;
    this.uiContainer.addChild(this.lapText);
    this.lapText.visible = false;
    
    // Create centered UI elements that show in track interior
    this.createCenteredStartUI();
    this.createCenteredWinUI();
    
    // Position UI elements in track center
    this.positionCenteredUI();
  }
  
  createCenteredStartUI() {
    // Container for start screen elements
    const startContainer = new PIXI.Container();
    
    // Small title
    const titleText = new PIXI.Text('GRID RACER', {
      fontSize: 20,
      fill: 0xffffff,
      fontWeight: 'bold',
      align: 'center'
    });
    titleText.x = -titleText.width / 2;
    titleText.y = -50;
    startContainer.addChild(titleText);
    
    // Instructions
    const instructionsText = new PIXI.Text('Arrow keys to move', {
      fontSize: 12,
      fill: 0xcccccc,
      align: 'center'
    });
    instructionsText.x = -instructionsText.width / 2;
    instructionsText.y = -20;
    startContainer.addChild(instructionsText);
    
    // Compact start button
    this.startButton = new PIXI.Graphics();
    this.startButton.beginFill(0x10b981);
    this.startButton.drawRect(-60, -15, 120, 30);
    this.startButton.endFill();
    this.startButton.eventMode = 'static';
    this.startButton.cursor = 'pointer';
    
    const startText = new PIXI.Text('START', {
      fontSize: 14,
      fill: 0xffffff,
      fontWeight: 'bold'
    });
    startText.x = -startText.width / 2;
    startText.y = -startText.height / 2;
    this.startButton.addChild(startText);
    
    startContainer.addChild(this.startButton);
    startContainer.y = 20;
    
    this.uiContainer.addChild(startContainer);
    this.startButton.on('pointerdown', () => this.startGame());
    
    // Store reference for positioning
    this.startContainer = startContainer;
  }
  
  createCenteredWinUI() {
    // Container for win screen elements
    this.winContainer = new PIXI.Container();
    
    // Win message
    const winText = new PIXI.Text('RACE COMPLETE!', {
      fontSize: 16,
      fill: 0x10b981,
      fontWeight: 'bold',
      align: 'center'
    });
    winText.x = -winText.width / 2;
    winText.y = -40;
    this.winContainer.addChild(winText);
    
    // Time display
    this.timeText = new PIXI.Text('', {
      fontSize: 12,
      fill: 0xffffff,
      align: 'center'
    });
    this.timeText.x = -this.timeText.width / 2;
    this.timeText.y = -15;
    this.winContainer.addChild(this.timeText);
    
    // Compact play again button
    this.playAgainButton = new PIXI.Graphics();
    this.playAgainButton.beginFill(0x10b981);
    this.playAgainButton.drawRect(-60, -12, 120, 24);
    this.playAgainButton.endFill();
    this.playAgainButton.eventMode = 'static';
    this.playAgainButton.cursor = 'pointer';
    
    const playAgainText = new PIXI.Text('PLAY AGAIN', {
      fontSize: 12,
      fill: 0xffffff,
      fontWeight: 'bold'
    });
    playAgainText.x = -playAgainText.width / 2;
    playAgainText.y = -playAgainText.height / 2;
    this.playAgainButton.addChild(playAgainText);
    
    this.winContainer.addChild(this.playAgainButton);
    this.winContainer.y = 15;
    this.winContainer.visible = false;
    
    this.uiContainer.addChild(this.winContainer);
    this.playAgainButton.on('pointerdown', () => this.resetGame());
  }
  
  positionCenteredUI() {
    // Calculate track interior center
    const trackStartX = Math.floor((this.gridHNumber - this.trackHNumber) / 2) - this.trackThickness;
    const trackStartY = Math.floor((this.gridVNumber - this.trackVNumber) / 2) - this.trackThickness;
    const interiorStartX = trackStartX + this.trackThickness;
    const interiorStartY = trackStartY + this.trackThickness;
    
    // Center of the interior area
    const centerX = (interiorStartX + this.trackHNumber / 2) * this.squareSize;
    const centerY = (interiorStartY + this.trackVNumber / 2) * this.squareSize;
    
    console.log('Positioning UI at center:', centerX, centerY);
    
    // Position UI containers at track center
    if (this.startContainer) {
      this.startContainer.x = centerX;
      this.startContainer.y = centerY;
    }
    
    if (this.winContainer) {
      this.winContainer.x = centerX;
      this.winContainer.y = centerY;
    }
  }
  setupKeyboard() {
    this.keyHandler = (e) => {
      // Handle mute button
      if (e.key === '`') {
        this.muzakMuted = !this.muzakMuted;
        console.log('Muzak', this.muzakMuted ? 'muted' : 'unmuted');
        return;
      }
      
      // Keep arrow keys as backup for testing
      let newX = this.playerPos.x;
      let newY = this.playerPos.y;
      let direction = '';
      
      switch(e.key) {
        case 'ArrowUp':
          newY--;
          direction = 'north';
          break;
        case 'ArrowDown':
          newY++;
          direction = 'south';
          break;
        case 'ArrowRight':
          newX++;
          direction = 'east';
          break;
        case 'ArrowLeft':
          newX--;
          direction = 'west';
          break;
        default:
          return;
      }
      
      this.processMovement(newX, newY, direction);
    };
    window.addEventListener('keydown', this.keyHandler);
  }

  setupChordInput() {
    this.chordInput = new ChordInputSystem();
    
    // Connect the dynamic debounce amount
    this.chordInput.setDebounceProvider(() => this.debounceAmount);
    
    this.chordInput.onChord((event: ChordInputEvent) => {
      // Resume audio context on first chord input if needed
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      // Calculate typing speed based on chord timing
      const currentTime = performance.now();
      if (this.lastKeyTime > 0) {
        const timeDiff = currentTime - this.lastKeyTime;
        if (timeDiff < 100) {
          this.typingSpeed = 4.0; // Very fast typing
        } else if (timeDiff < 200) {
          this.typingSpeed = 2.5; // Fast typing
        } else if (timeDiff < 400) {
          this.typingSpeed = 1.5; // Medium typing
        } else {
          this.typingSpeed = 1.0; // Slow/normal typing
        }
      }
      this.lastKeyTime = currentTime;
      
      let newX = this.playerPos.x;
      let newY = this.playerPos.y;
      
      // Convert chord direction to movement
      switch(event.direction) {
        case 'north':
          newY--;
          break;
        case 'south':
          newY++;
          break;
        case 'east':
          newX++;
          break;
        case 'west':
          newX--;
          break;
      }
      
      this.processMovement(newX, newY, event.direction);
    });
    
    // Handle invalid chord inputs
    this.chordInput.onInvalidInput((keys: string[]) => {
      console.log('🔴 Invalid chord input detected:', keys);
      
      // Only add ouch dot if we're in the playing state and player has moved
      if (this.gameState === 'playing' && this.hasMoved) {
        // Add ouch dot at the square the player just left (lastPos)
        this.addOuchDot(this.lastPos.x, this.lastPos.y);
      }
    });
  }

  processMovement(newX: number, newY: number, direction: string) {
    // Track keystrokes for race record
    if (this.gameState === 'playing') {
      this.currentRaceKeystrokes++;
      if (this.currentRaceRecord) {
        this.currentRaceRecord.totalKeystrokes = this.currentRaceKeystrokes;
        // Auto-save progress every 10 keystrokes
        if (this.currentRaceKeystrokes % 10 === 0) {
          this.saveRaceLogToStorage();
          this.updateRaceLogDisplay();
        }
      }
    }
    
    // Allow movement anywhere within bounds and play appropriate sound
    if (newX >= 0 && newX < this.gridHNumber && newY >= 0 && newY < this.gridVNumber) {
      const isOnTrack = this.isTrackCell(newX, newY);
      
      if (isOnTrack) {
        this.playOnTrackSound(direction);
        // Count correct keystrokes (on track)
        if (this.gameState === 'playing') {
          this.currentRaceCorrectKeystrokes++;
          if (this.currentRaceRecord) {
            this.currentRaceRecord.correctKeystrokes = this.currentRaceCorrectKeystrokes;
          }
        }
      } else {
        this.playOffTrackSound(direction);
      }
      
      // Check if hitting cancel flag
      if (this.cancelFlagSprite && newX === Math.floor(this.cancelFlagSprite.x / this.squareSize) && newY === Math.floor(this.cancelFlagSprite.y / this.squareSize) && this.gameState === 'playing') {
        this.cancelRace();
        return;
      }
      
      // Clear ouch dot from the square we're entering (if any)
      this.removeOuchDot(newX, newY);
      
      // Clear ouch dot from the square we're leaving with a correct direction (if any)
      if (this.hasMoved) {
        this.removeOuchDot(this.playerPos.x, this.playerPos.y);
      }
      
      this.movePlayer(newX, newY);
    }
    
    // Note: lastDirection and car rotation are now updated in movePlayer()
  }
  movePlayer(newX: number, newY: number) {
    this.lastPos = { x: this.playerPos.x, y: this.playerPos.y };
    const moveDirection = this.getDirection(this.lastPos, { x: newX, y: newY });
    
    // Check for turn indicator before updating position
    this.checkTurnIndicator(this.lastPos, { x: newX, y: newY }, moveDirection);
    
    this.playerPos.x = newX;
    this.playerPos.y = newY;
    
    // Add skid mark at the previous position
    this.addSkidMark(this.lastPos.x, this.lastPos.y, moveDirection);
    
    // Fade all existing skid marks by 1%
    this.fadeSkidMarks();
    
    // Update car rotation based on actual movement direction
    console.log('🎯 movePlayer: calculated moveDirection =', moveDirection);
    this.lastDirection = moveDirection;
    console.log('🎯 movePlayer: set this.lastDirection to', this.lastDirection);
    this.updateCarRotation();
    const targetX = (newX + 0.5) * this.squareSize;
    const targetY = (newY + 0.5) * this.squareSize;
    
    // Cancel previous animation if still running
    if (this.moveAnimation) {
      this.moveAnimation.active = false;
    }
    
    const startX = this.player.x;
    const startY = this.player.y;
    
    // Adaptive animation duration based on typing speed
    const baseDuration = 0.15; // Base duration in seconds
    const duration = baseDuration / this.typingSpeed; // Faster typing = shorter duration
    
    const startTime = performance.now();
    this.moveAnimation = {
      active: true,
      update: () => {
        if (!this.moveAnimation.active) return;
        const elapsed = (performance.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Smooth easing
        this.player.x = startX + (targetX - startX) * eased;
        this.player.y = startY + (targetY - startY) * eased;
        if (progress >= 1) {
          this.moveAnimation.active = false;
          this.moveAnimation = null;
          this.checkLap();
        }
      }
    };
    
    if (!this.hasMoved) {
      this.hasMoved = true;
    }
  }
  checkLap() {
    if (!this.hasMoved) return;
    
    // Check for start flag collision (outside of flag line check)
    const flagX = this.startFinishPos.x + 1;
    const flagY = this.startFinishPos.y;
    console.log('🔍 Checking flag collision - Player:', this.playerPos.x, this.playerPos.y, 'Flag:', flagX, flagY, 'GameState:', this.gameState);
    if (this.playerPos.x === flagX && this.playerPos.y === flagY && this.gameState !== 'playing') {
      console.log('🎉 FLAG COLLISION DETECTED! Starting game...');
      this.startGame();
      this.startTime = Date.now();
      
      // Create race record immediately
      this.currentRaceRecord = {
        date: new Date().toLocaleString(),
        startTime: this.startTime,
        totalKeystrokes: 0,
        correctKeystrokes: 0,
        status: 'active'
      };
      
      // Add to race log immediately so it shows in UI
      this.raceLog.push(this.currentRaceRecord);
      this.updateRaceLogDisplay();
      
      // Reset keystroke tracking
      this.currentRaceKeystrokes = 0;
      this.currentRaceCorrectKeystrokes = 0;
      console.log('Game started by touching start flag');
      
      // Remove the start flag
      if (this.startflagSprite) {
        this.trackContainer.removeChild(this.startflagSprite);
        this.startflagSprite.destroy();
        this.startflagSprite = undefined;
      }
      
      // Create cancel flag on outside grass
      this.createCancelFlag();
      
      // Update central display
      this.updateCentralDisplay('Lap 1/4');
      
      return; // Don't count this as a lap
    }
    
    // Check if player is on any flag line square for lap counting
    const isOnFlag = this.isOnFlagLine(this.playerPos.x, this.playerPos.y);
    const wasOnFlag = this.isOnFlagLine(this.lastPos.x, this.lastPos.y);
    
    if (isOnFlag) {
      // Determine direction of entry into flag line
      const currentDirection = this.getDirection(this.lastPos, this.playerPos);
      
      // Only count lap changes when entering flag line from a new direction and game is playing
      // Also ensure player has moved away from start position (hasMoved=true) to prevent immediate lap count
      if (!wasOnFlag && this.gameState === 'playing' && this.hasMoved && this.laps > 0) {
        // Player entering flag line from the West (left) - increment lap
        if (currentDirection === 'E') {
          this.laps++;
          if (this.lapText) {
            this.lapText.text = `Lap: ${Math.min(this.laps + 1, this.targetLaps)}/${this.targetLaps}`;
          }
          
          // Update central display with appropriate message
          if (this.laps < this.targetLaps - 1) {
            this.updateCentralDisplay(`Lap ${this.laps + 1}/${this.targetLaps}`);
          } else if (this.laps === this.targetLaps - 1) {
            this.updateCentralDisplay('Final Lap');
          }
          
          // Play lap count tone
          this.playLapCountTone(this.laps);
          
          if (this.laps >= this.targetLaps) {
            this.updateCentralDisplay('Complete!');
            // Play victory song after the lap tone
            setTimeout(() => this.playVictorySong(), 500);
            setTimeout(() => {
              this.updateCentralDisplay('Hit flag to start');
            }, 5000);
            this.endGame();
          }
        }
        // Player entering flag line from the East (right) - decrement lap
        else if (currentDirection === 'W') {
          this.laps = Math.max(0, this.laps - 1);
          if (this.lapText) {
            this.lapText.text = `Lap: ${Math.min(this.laps + 1, this.targetLaps)}/${this.targetLaps}`;
          }
          
          // Update central display when going backwards
          if (this.laps === 0) {
            this.updateCentralDisplay('Lap 1/4');
          } else if (this.laps < this.targetLaps - 1) {
            this.updateCentralDisplay(`Lap ${this.laps + 1}/${this.targetLaps}`);
          } else {
            this.updateCentralDisplay('Final Lap');
          }
        }
      }
    }
  }
  
  getDirection(from: {x: number, y: number}, to: {x: number, y: number}): string {
    if (to.x > from.x) return 'E';
    if (to.x < from.x) return 'W';
    if (to.y > from.y) return 'S';
    if (to.y < from.y) return 'N';
    return '';
  }
  
  getDirectionFromKey(key: string): string {
    switch(key) {
      case 'ArrowUp': return 'N';
      case 'ArrowDown': return 'S';
      case 'ArrowRight': return 'E';
      case 'ArrowLeft': return 'W';
      default: return '';
    }
  }
  startGame() {
    this.gameState = 'playing';
    
    // Hide start container if it exists (legacy UI)
    if (this.startContainer) {
      this.startContainer.visible = false;
    }
    
    // Show lap text if it exists
    if (this.lapText) {
      this.lapText.visible = true;
    }
    
    // Stop the muzak when race starts
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = 0;
    }
    
    console.log('Game started by touching start flag');
  }
  endGame() {
    this.gameState = 'win';
    const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
    
    // Handle UI elements safely
    if (this.timeText) {
      this.timeText.text = `Time: ${timeTaken}s`;
      this.timeText.x = -this.timeText.width / 2;
    }
    if (this.winContainer) {
      this.winContainer.visible = true;
    }
    if (this.lapText) {
      this.lapText.visible = false;
    }
    
    // Complete the race record and show confetti
    this.completeRace(timeTaken);
    this.showConfetti();
    
    // Reset game state after 5 seconds to prevent freezing
    setTimeout(() => {
      this.gameState = 'start';
      this.resetGame();
    }, 5000);
  }
  resetGame() {
    this.gameState = 'start';
    this.resetPlayerToStart();
    if (this.lapText) {
      this.lapText.text = 'Lap: 1/4';
      this.lapText.visible = false;
    }
    if (this.winContainer) {
      this.winContainer.visible = false;
    }
    if (this.startContainer) {
      this.startContainer.visible = true;
    }
    
    // Reset central display
    this.updateCentralDisplay('Hit flag to start');
    
    // Recreate start flag
    this.createStartFlag();
  }
  setupAnimationLoop() {
    this.animationTicker = () => {
      if (this.moveAnimation && this.moveAnimation.active) {
        this.moveAnimation.update();
      }
    };
    app.ticker.add(this.animationTicker);
  }
  
  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume audio context on first user interaction (required by browser autoplay policies)
      const resumeAudio = () => {
        if (this.audioContext && this.audioContext.state === 'suspended') {
          this.audioContext.resume().then(() => {
            console.log('🔊 Audio context resumed');
          });
        }
        // Remove listeners after first interaction
        document.removeEventListener('keydown', resumeAudio);
        document.removeEventListener('click', resumeAudio);
      };
      
      document.addEventListener('keydown', resumeAudio, { once: true });
      document.addEventListener('click', resumeAudio, { once: true });
    } catch (error) {
      console.warn('Audio context not available:', error);
      this.audioEnabled = false;
    }
  }
  
  getDirectionalFrequency(direction: string, baseFrequency: number): number {
    // Modulate frequency based on direction
    const modulations = {
      'N': 1.2,    // Higher pitch for North (up)
      'S': 0.8,    // Lower pitch for South (down)  
      'E': 1.1,    // Slightly higher for East (right)
      'W': 0.9     // Slightly lower for West (left)
    };
    return baseFrequency * (modulations[direction as keyof typeof modulations] || 1.0);
  }
  
  playOnTrackSound(direction: string) {
    if (!this.audioEnabled || !this.audioContext || !this.movementSoundsEnabled) return;
    
    try {
      // Car revving/rumble sound - lower tones
      const baseFreq = this.getDirectionalFrequency(direction, 120);
      
      // Create multiple oscillators for a richer "rumble" sound
      const oscillator1 = this.audioContext.createOscillator();
      const oscillator2 = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator1.connect(gainNode);
      oscillator2.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Set frequencies for rumble effect
      oscillator1.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
      oscillator2.frequency.setValueAtTime(baseFreq * 1.5, this.audioContext.currentTime);
      
      oscillator1.type = 'sawtooth';
      oscillator2.type = 'triangle';
      
      // Envelope for rumble effect
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
      
      oscillator1.start(this.audioContext.currentTime);
      oscillator2.start(this.audioContext.currentTime);
      oscillator1.stop(this.audioContext.currentTime + 0.3);
      oscillator2.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing on-track sound:', error);
    }
  }
  
  playOffTrackSound(direction: string) {
    if (!this.audioEnabled || !this.audioContext || !this.movementSoundsEnabled) return;
    
    try {
      // Troubled/bonky sound - higher, more dissonant tones
      const baseFreq = this.getDirectionalFrequency(direction, 300);
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Create a "bonk" sound with frequency modulation
      oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(baseFreq * 0.7, this.audioContext.currentTime + 0.1);
      
      oscillator.type = 'square'; // Harsher sound for off-track
      
      // Sharp attack and quick decay for "bonk" effect
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
    } catch (error) {
      console.warn('Error playing off-track sound:', error);
    }
  }
  
  playLapCountTone(lapNumber: number) {
    if (!this.audioEnabled || !this.audioContext || !this.lapCountSoundsEnabled) return;
    
    try {
      // High tone that increases in pitch with lap number
      const baseFreq = 440; // A4
      const lapFreq = baseFreq * Math.pow(1.2, lapNumber - 1); // Each lap 20% higher
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(lapFreq, this.audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Clear, bright tone for lap counting
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, this.audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.4);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.4);
    } catch (error) {
      console.warn('Error playing lap count tone:', error);
    }
  }
  
  playUpcomingTurnSound(direction: string) {
    if (!this.audioEnabled || !this.audioContext || !this.upcomingTurnSoundsEnabled) return;
    
    try {
      // Anticipatory warning - barrel marker approaching
      const baseFreq = this.getDirectionalFrequency(direction, 500);
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
      oscillator.type = 'triangle';
      
      // Gentle warning tone
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Error playing upcoming turn sound:', error);
    }
  }
  
  playCorrectTurnSound(direction: string) {
    if (!this.audioEnabled || !this.audioContext || !this.correctTurnSoundsEnabled) return;
    
    try {
      // Confirmation of correct turn direction
      const baseFreq = this.getDirectionalFrequency(direction, 700);
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
      oscillator.type = 'sine';
      
      // Quick positive confirmation
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, this.audioContext.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.15);
    } catch (error) {
      console.warn('Error playing correct turn sound:', error);
    }
  }
  
  playCompletingTurnSound(direction: string) {
    if (!this.audioEnabled || !this.audioContext || !this.completingTurnSoundsEnabled) return;
    
    try {
      // Passing barrel marker after turn
      const baseFreq = this.getDirectionalFrequency(direction, 600);
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
      oscillator.type = 'sawtooth';
      
      // Turn completion marker
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, this.audioContext.currentTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('Error playing completing turn sound:', error);
    }
  }
  
  playPerfectTurnSound(direction: string) {
    if (!this.audioEnabled || !this.audioContext || !this.perfectTurnSoundsEnabled) return;
    
    try {
      // Emphatic perfect turn sound - combines correct turn + completing turn
      const baseFreq = this.getDirectionalFrequency(direction, 800);
      
      // Three ascending tones for perfect turn
      const frequencies = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];
      
      frequencies.forEach((freq, i) => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        
        oscillator.frequency.setValueAtTime(freq, this.audioContext!.currentTime);
        oscillator.type = 'sine';
        
        const startTime = this.audioContext!.currentTime + (i * 0.08);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.12);
      });
    } catch (error) {
      console.warn('Error playing perfect turn sound:', error);
    }
  }
  
  playHeartbeat() {
    if (!this.audioEnabled || !this.audioContext || this.muzakMuted) return;
    
    try {
      // Simple ice cream truck style melody: C - E - G - C - G - E
      const melody = [
        { freq: 261.63, start: 0.0, duration: 0.4 },   // C4
        { freq: 329.63, start: 0.4, duration: 0.4 },   // E4
        { freq: 392.00, start: 0.8, duration: 0.4 },   // G4
        { freq: 523.25, start: 1.2, duration: 0.4 },   // C5
        { freq: 392.00, start: 1.6, duration: 0.4 },   // G4
        { freq: 329.63, start: 2.0, duration: 0.6 }    // E4 (longer)
      ];
      
      melody.forEach(note => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        
        oscillator.frequency.setValueAtTime(note.freq, this.audioContext!.currentTime);
        oscillator.type = 'square'; // Square wave for that classic ice cream truck sound
        
        // Muzak-style envelope - gentle and pleasant
        const startTime = this.audioContext!.currentTime + note.start;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.06, startTime + note.duration * 0.7);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + note.duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + note.duration);
      });
    } catch (error) {
      console.warn('Error playing muzak melody:', error);
    }
  }
  
  startHeartbeat() {
    // Clear any existing heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // Start heartbeat every 3 seconds when not playing
    this.heartbeatInterval = setInterval(() => {
      if (this.gameState !== 'playing') {
        this.playHeartbeat();
      }
    }, 3000);
  }
  
  createInfoBox() {
    // Create collapsible info panel similar to debug panel
    this.infoPanel = document.createElement('div');
    this.infoPanel.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      border-radius: 8px;
      border: 2px solid #374151;
      font-family: 'Courier New', monospace;
      min-width: 280px;
      max-width: 320px;
      z-index: 1000;
    `;
    
    // Header with toggle button
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #374151;
      border-radius: 6px 6px 0 0;
      cursor: pointer;
      user-select: none;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'Braille Steering';
    title.style.cssText = `
      margin: 0;
      color: #fbbf24;
      font-size: 16px;
      font-weight: bold;
    `;
    
    this.infoToggleButton = document.createElement('button');
    this.infoToggleButton.textContent = this.infoCollapsed ? '▶' : '▼';
    this.infoToggleButton.style.cssText = `
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      font-size: 14px;
      padding: 4px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    header.appendChild(title);
    header.appendChild(this.infoToggleButton);
    this.infoPanel.appendChild(header);
    
    // Content container
    this.infoContent = document.createElement('div');
    this.infoContent.style.cssText = `
      padding: 16px;
      display: ${this.infoCollapsed ? 'none' : 'block'};
      text-align: center;
    `;
    
    // Grasscorner image
    const img = document.createElement('img');
    img.src = 'public/grasscorner.png';
    img.style.cssText = `
      width: 32px;
      height: 32px;
      margin: 0 auto 15px auto;
      display: block;
      image-rendering: pixelated;
    `;
    this.infoContent.appendChild(img);
    
    // Compass legend container
    const compassContainer = document.createElement('div');
    compassContainer.style.cssText = `
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      grid-template-rows: auto auto auto;
      gap: 8px;
      align-items: center;
      justify-items: center;
      margin-bottom: 15px;
      font-size: 14px;
    `;
    
    // Create compass layout
    // Row 1: North
    compassContainer.appendChild(document.createElement('div')); // empty
    const northDiv = document.createElement('div');
    northDiv.innerHTML = '⠝ N ↑';
    northDiv.style.color = '#10b981';
    compassContainer.appendChild(northDiv);
    compassContainer.appendChild(document.createElement('div')); // empty
    
    // Row 2: West and East
    const westDiv = document.createElement('div');
    westDiv.innerHTML = '⠺ W ←';
    westDiv.style.color = '#10b981';
    compassContainer.appendChild(westDiv);
    
    const centerDiv = document.createElement('div');
    centerDiv.innerHTML = '✤';
    centerDiv.style.cssText = `
      font-size: 18px;
      color: #6b7280;
    `;
    compassContainer.appendChild(centerDiv);
    
    const eastDiv = document.createElement('div');
    eastDiv.innerHTML = '⠑ E →';
    eastDiv.style.color = '#10b981';
    compassContainer.appendChild(eastDiv);
    
    // Row 3: South
    compassContainer.appendChild(document.createElement('div')); // empty
    const southDiv = document.createElement('div');
    southDiv.innerHTML = '⠎ S ↓';
    southDiv.style.color = '#10b981';
    compassContainer.appendChild(southDiv);
    compassContainer.appendChild(document.createElement('div')); // empty
    
    this.infoContent.appendChild(compassContainer);
    
    // More button
    const moreButton = document.createElement('button');
    moreButton.textContent = 'More';
    moreButton.style.cssText = `
      background: #3b82f6;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-family: inherit;
      font-size: 12px;
      width: 100%;
    `;
    
    moreButton.addEventListener('mouseover', () => {
      moreButton.style.background = '#2563eb';
    });
    
    moreButton.addEventListener('mouseout', () => {
      moreButton.style.background = '#3b82f6';
    });
    
    moreButton.addEventListener('click', () => {
      this.openInfoModal();
    });
    
    this.infoContent.appendChild(moreButton);
    this.infoPanel.appendChild(this.infoContent);
    
    // Toggle functionality
    const toggleInfo = () => {
      this.infoCollapsed = !this.infoCollapsed;
      this.infoContent.style.display = this.infoCollapsed ? 'none' : 'block';
      this.infoToggleButton.textContent = this.infoCollapsed ? '▶' : '▼';
    };
    
    header.addEventListener('click', toggleInfo);
    this.infoToggleButton.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleInfo();
    });
    
    // Add to page
    document.body.appendChild(this.infoPanel);
  }
  
  openInfoModal() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: #1f2937;
      color: white;
      padding: 30px;
      border-radius: 12px;
      border: 2px solid #374151;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      position: relative;
    `;
    
    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
      position: absolute;
      top: 15px;
      right: 20px;
      background: none;
      border: none;
      color: #9ca3af;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.color = '#f3f4f6';
    });
    
    closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.color = '#9ca3af';
    });
    
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });
    
    // Modal title
    const title = document.createElement('h2');
    title.textContent = 'HOW TO PLAY';
    title.style.cssText = `
      margin: 0 0 25px 0;
      color: #fbbf24;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
    `;
    
    // Content sections
    const content = document.createElement('div');
    content.style.cssText = `
      line-height: 1.6;
      font-size: 16px;
    `;
    
    content.innerHTML = `
      <div style="margin-bottom: 20px;">
        <p>Braille uses multiple raised dots per character.<br>
        To type them, <strong style="color: #10b981;">press several keys at once</strong> — one for each dot.<br>
        Use the <span style="background: #374151; padding: 2px 6px; border-radius: 4px; font-family: monospace;">S D F J K L</span> keys to input the dots.</p>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>To drive, type the braille pattern for the compass direction.<br>
        Your racer will move in that direction.</p>
      </div>
      
      <div style="background: #374151; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center;">
        <div style="color: #9ca3af; font-size: 14px; margin-bottom: 10px;">CHORD COMBINATIONS</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; font-family: monospace;">
          <div><span style="color: #fbbf24;">W+I</span> → <span style="color: #10b981;">⠝ N ↑</span></div>
          <div><span style="color: #fbbf24;">D+L</span> → <span style="color: #10b981;">⠑ E →</span></div>
          <div><span style="color: #fbbf24;">S+K</span> → <span style="color: #10b981;">⠎ S ↓</span></div>
          <div><span style="color: #fbbf24;">A+J</span> → <span style="color: #10b981;">⠺ W ←</span></div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <p>The control bar lights will guide you toward the next direction.<br>
        Type <strong style="color: #10b981;">quickly and accurately</strong> — speed earns points,<br>
        but precision keeps your score alive.</p>
      </div>
      
      <div style="background: #1e3a8a; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
        <div style="font-size: 14px; color: #93c5fd;">
          <strong>TIP:</strong> Practice the chord combinations slowly at first, then build up speed as muscle memory develops.
        </div>
      </div>
    `;
    
    // Assemble modal
    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(content);
    overlay.appendChild(modal);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });
    
    // Close on Escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Add to page
    document.body.appendChild(overlay);
  }
  
  playVictorySong() {
    if (!this.audioEnabled || !this.audioContext) return;
    
    try {
      // Victory melody: C - E - G - C (do-mi-sol-do)
      const notes = [
        { freq: 261.63, start: 0.0, duration: 0.3 },   // C4
        { freq: 329.63, start: 0.3, duration: 0.3 },   // E4
        { freq: 392.00, start: 0.6, duration: 0.3 },   // G4
        { freq: 523.25, start: 0.9, duration: 0.6 }    // C5
      ];
      
      notes.forEach(note => {
        const oscillator = this.audioContext!.createOscillator();
        const gainNode = this.audioContext!.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext!.destination);
        
        oscillator.frequency.setValueAtTime(note.freq, this.audioContext!.currentTime);
        oscillator.type = 'triangle';
        
        // Envelope for musical note
        gainNode.gain.setValueAtTime(0, this.audioContext!.currentTime + note.start);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext!.currentTime + note.start + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + note.start + note.duration);
        
        oscillator.start(this.audioContext!.currentTime + note.start);
        oscillator.stop(this.audioContext!.currentTime + note.start + note.duration);
      });
    } catch (error) {
      console.warn('Error playing victory song:', error);
    }
  }
  
  destroy() {
    window.removeEventListener('keydown', this.keyHandler);
    if (this.moveAnimation) {
      this.moveAnimation.active = false;
      this.moveAnimation = null;
    }
    if (this.animationTicker) {
      app.ticker.remove(this.animationTicker);
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    if (this.debugPanel) {
      document.body.removeChild(this.debugPanel);
    }
    
    // Clean up chord input
    if (this.chordInput) {
      this.chordInput.destroy();
    }
    
    // Clean up info box
    const infoBox = document.querySelector('div[style*="bottom: 20px"]');
    if (infoBox) {
      document.body.removeChild(infoBox);
    }
  }
  
  loadRaceLogFromStorage() {
    const stored = localStorage.getItem('brailleRacerLog');
    if (stored) {
      try {
        this.raceLog = JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to load race log from storage:', error);
        this.raceLog = [];
      }
    }
  }
  
  saveRaceLogToStorage() {
    try {
      localStorage.setItem('brailleRacerLog', JSON.stringify(this.raceLog));
    } catch (error) {
      console.warn('Failed to save race log to storage:', error);
    }
  }
  
  clearRaceData() {
    if (confirm('Are you sure you want to clear all race data?')) {
      this.raceLog = [];
      localStorage.removeItem('brailleRacerLog');
      this.updateRaceLogDisplay();
      console.log('🗑️ Race data cleared');
    }
  }
  
  createCancelFlag() {
    if (!this.texturesLoaded || !this.startflagTexture) return;
    
    // Place cancel flag on outside grass (top-left corner)
    const cancelX = 2;
    const cancelY = 2;
    
    this.cancelFlagSprite = new PIXI.Sprite(this.startflagTexture);
    this.cancelFlagSprite.x = cancelX * this.squareSize;
    this.cancelFlagSprite.y = cancelY * this.squareSize;
    this.cancelFlagSprite.width = this.squareSize;
    this.cancelFlagSprite.height = this.squareSize;
    this.cancelFlagSprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    this.cancelFlagSprite.tint = 0xff4444; // Red tint for cancel
    
    this.trackContainer.addChild(this.cancelFlagSprite);
    console.log('🚩 Cancel flag placed at', cancelX, cancelY);
  }
  
  cancelRace() {
    if (this.currentRaceRecord) {
      this.currentRaceRecord.status = 'DNF'; // Did Not Finish
      this.currentRaceRecord.endTime = Date.now();
      this.currentRaceRecord.speed = 'DNF'; // No time, just DNF
      
      // Update final keystroke counts
      this.currentRaceRecord.totalKeystrokes = this.currentRaceKeystrokes;
      this.currentRaceRecord.correctKeystrokes = this.currentRaceCorrectKeystrokes;
      
      // Calculate accuracy even for DNF
      const accuracy = this.currentRaceRecord.totalKeystrokes > 0 ? 
        (this.currentRaceRecord.correctKeystrokes / this.currentRaceRecord.totalKeystrokes) * 100 : 100;
      this.currentRaceRecord.accuracy = Math.round(accuracy * 100) / 100;
      
      console.log('❌ Race cancelled - DNF');
    }
    
    // Just change game state to start - don't move the car
    this.gameState = 'start';
    
    // Remove cancel flag
    if (this.cancelFlagSprite) {
      this.trackContainer.removeChild(this.cancelFlagSprite);
      this.cancelFlagSprite.destroy();
      this.cancelFlagSprite = undefined;
    }
    
    // Update central display
    this.updateCentralDisplay('Hit flag to start');
    
    // Recreate start flag
    this.createStartFlag();
    
    // Save the DNF record and update display
    this.saveRaceLogToStorage();
    this.updateRaceLogDisplay();
    
    // Reset race tracking for next race
    this.currentRaceRecord = undefined;
    this.currentRaceKeystrokes = 0;
    this.currentRaceCorrectKeystrokes = 0;
  }
  
  completeRace(timeTaken: number) {
    if (this.currentRaceRecord) {
      this.currentRaceRecord.endTime = Date.now();
      this.currentRaceRecord.speed = timeTaken;
      this.currentRaceRecord.status = 'completed';
      
      // Update final keystroke counts
      this.currentRaceRecord.totalKeystrokes = this.currentRaceKeystrokes;
      this.currentRaceRecord.correctKeystrokes = this.currentRaceCorrectKeystrokes;
      
      const accuracy = this.currentRaceRecord.totalKeystrokes > 0 ? 
        (this.currentRaceRecord.correctKeystrokes / this.currentRaceRecord.totalKeystrokes) * 100 : 100;
      this.currentRaceRecord.accuracy = Math.round(accuracy * 100) / 100;
      
      // Update existing record in race log (don't add duplicate)
      // The record was already added when race started
      this.saveRaceLogToStorage();
      this.updateRaceLogDisplay();
      
      console.log('🏁 Race completed:', this.currentRaceRecord);
    }
    
    // Remove cancel flag
    if (this.cancelFlagSprite) {
      this.trackContainer.removeChild(this.cancelFlagSprite);
      this.cancelFlagSprite.destroy();
      this.cancelFlagSprite = undefined;
    }
    
    this.currentRaceRecord = undefined;
  }
  
  showConfetti() {
    // Simple confetti effect using DOM elements
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9999;
    `;
    
    // Create 50 confetti pieces
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#fcea2b', '#ff9ff3'][Math.floor(Math.random() * 6)]};
        left: ${Math.random() * 100}vw;
        top: -10px;
        transform: rotate(${Math.random() * 360}deg);
        animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
      `;
      
      confettiContainer.appendChild(confetti);
    }
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes confetti-fall {
        to {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(confettiContainer);
    
    // Clean up after 5 seconds
    setTimeout(() => {
      document.body.removeChild(confettiContainer);
      document.head.removeChild(style);
    }, 5000);
    
    console.log('🎉 Confetti displayed!');
  }
}
// Initialize the Pixi application
app = new PIXI.Application();

// Initialize and start the game
async function init() {
  try {
    console.log('Starting initialization...');
    
    // Start with default dimensions, will be resized by game
    await app.init({
      width: 600,
      height: 600,
      backgroundColor: 0x111827,
      antialias: true,
      resolution: 1
    });
    
    console.log('PIXI app initialized');
    document.body.appendChild(app.canvas);
    console.log('Canvas added to DOM');
    
    const game = new GridRacer();
    console.log('GridRacer instance created successfully!');
  } catch (error) {
    console.error('Error during initialization:', error);
    throw error;
  }
}

// Start the game
init().catch(error => {
  console.error('Failed to initialize game:', error);
});