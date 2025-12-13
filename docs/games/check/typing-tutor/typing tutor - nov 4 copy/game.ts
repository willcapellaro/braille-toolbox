const GAME_WIDTH = 900;
const GAME_HEIGHT = 600;
const MOUNTAIN_WIDTH_RATIO = 0.6;
const TYPING_WIDTH_RATIO = 0.4;
const BLOCK_WIDTH = 90;
const BLOCK_HEIGHT = 40;
const BLOCK_COLORS = [0x8d5524, 0xa0522d, 0x6b8e23, 0x7b7b7b, 0x9c6615];
const AVATAR_SIZE = 44;
const AVATAR_SPEED = 8;
const BLOCKS_ON_SCREEN = 10;
const MAX_WORD_LENGTH = 8;
const WORDS_PER_LENGTH = 3;
const wordsByLength = {
  1: ["a", "i", "o"],
  2: ["at", "on", "it", "in", "an", "up", "go"],
  3: ["cat", "dog", "sun", "run", "map", "box", "top", "man"],
  4: ["game", "play", "jump", "rock", "clay", "ring", "wolf"],
  5: ["apple", "tiger", "block", "mount", "green", "heart", "plant"],
  6: ["climb", "planet", "rocket", "circle", "bridge", "forest"],
  7: ["picture", "journey", "monster", "diamond", "station", "sandbox"],
  8: ["elephant", "mountain", "computer", "triangle", "sandwich"]
};
const GameState = {
  LOADING: 0,
  READY: 1,
  PLAYING: 2
};
class BlockClimbTyper {
  constructor() {
    this.app = new PIXI.Application({
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: 0x181d2b,
      antialias: true,
      resolution: 1
    });
    document.body.appendChild(this.app.view);
    this.app.renderer.resizeTo = window;
    window.addEventListener('resize', () => this.onResize());
    this.state = GameState.LOADING;
    this.wordLength = 1;
    this.wordsTyped = 0;
    this.wordsAtCurrentLength = 0;
    this.currentWord = "";
    this.retryCount = 1;
    this.retryProgress = 0;
    this.typed = "";
    this.inputActive = false;
    this.avatarBlockIndex = 0;
    this.cameraOffset = 0;
    this.isClimbing = false;
    this.climbTargetY = 0;
    this.cursorBlink = 0;
    this.cursorVisible = true;
    this.lastTypedWrong = false;
    this.mountainBlocks = [];
    this.blockColors = BLOCK_COLORS;
    this.wordQueue = [];
    this.usedWords = {};
    this.createContainers();
    this.createLoadingScreen();
    this.loadAssets();
    this.app.ticker.add((delta) => this.update(delta));
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
  }
  createContainers() {
    this.mainContainer = new PIXI.Container();
    this.app.stage.addChild(this.mainContainer);
    this.mountainContainer = new PIXI.Container();
    this.typingContainer = new PIXI.Container();
    this.mainContainer.addChild(this.mountainContainer);
    this.mainContainer.addChild(this.typingContainer);
    this.mountainContainer.x = 0;
    this.typingContainer.x = GAME_WIDTH * MOUNTAIN_WIDTH_RATIO;
    this.mountainContainer.y = 0;
    this.typingContainer.y = 0;
  }
  createLoadingScreen() {
    this.loadingText = new PIXI.Text('Loading...', {
      fontFamily: 'monospace',
      fontSize: 36,
      fill: 0xffffff,
      align: 'center'
    });
    this.loadingText.anchor.set(0.5);
    this.loadingText.x = GAME_WIDTH / 2;
    this.loadingText.y = GAME_HEIGHT / 2;
    this.mainContainer.addChild(this.loadingText);
  }
  loadAssets() {
    setTimeout(() => {
      this.setState(GameState.READY);
    }, 400);
  }
  setState(state) {
    this.state = state;
    if (state === GameState.READY) {
      this.showReadyScreen();
    }
    if (state === GameState.PLAYING) {
      this.startGame();
    }
  }
  showReadyScreen() {
    if (this.loadingText) this.loadingText.visible = false;
    this.readyText = new PIXI.Text('BLOCK CLIMB TYPER\n\nPress any key to start', {
      fontFamily: 'monospace',
      fontSize: 36,
      fill: 0xffffff,
      align: 'center'
    });
    this.readyText.anchor.set(0.5);
    this.readyText.x = GAME_WIDTH / 2;
    this.readyText.y = GAME_HEIGHT / 2;
    this.mainContainer.addChild(this.readyText);
  }
  startGame() {
    if (this.readyText) this.readyText.visible = false;
    this.wordLength = 1;
    this.wordsTyped = 0;
    this.wordsAtCurrentLength = 0;
    this.retryCount = 1;
    this.retryProgress = 0;
    this.avatarBlockIndex = 0;
    this.cameraOffset = 0;
    this.isClimbing = false;
    this.typed = "";
    this.lastTypedWrong = false;
    this.usedWords = {};
    this.wordQueue = [];
    this.mountainBlocks = [];
    this.buildMountain();
    this.createMountainBackground();
    this.createTypingUI();
    this.pickNextWord();
    this.updateTypingUI();
    this.inputActive = true;
  }
  buildMountain() {
    this.mountainContainer.removeChildren();
    let blocksNeeded = Math.max(BLOCKS_ON_SCREEN, 30);
    let baseY = GAME_HEIGHT - BLOCK_HEIGHT;
    for (let i = 0; i < blocksNeeded; i++) {
      let color = this.blockColors[i % this.blockColors.length];
      let g = new PIXI.Graphics();
      g.beginFill(color);
      g.drawRect(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
      g.endFill();
      g.x = (GAME_WIDTH * MOUNTAIN_WIDTH_RATIO - BLOCK_WIDTH) / 2 + ((i % 2 === 0) ? 0 : 8);
      g.y = baseY - i * BLOCK_HEIGHT;
      this.mountainContainer.addChild(g);
      this.mountainBlocks.push(g);
    }
    this.createAvatar();
    this.mountainBaseY = baseY;
  }
  createMountainBackground() {
    if (this.mountainBg) this.mountainBg.destroy();
    this.mountainBg = new PIXI.Graphics();
    let gradTop = 0x7ec9e3;
    let gradBottom = 0x2a295d;
    let w = GAME_WIDTH * MOUNTAIN_WIDTH_RATIO;
    let h = GAME_HEIGHT;
    let steps = 32;
    for (let i = 0; i < steps; i++) {
      let t = i / (steps - 1);
      let color = PIXI.utils.rgb2hex([
        ((1 - t) * ((gradTop >> 16) & 0xff) + t * ((gradBottom >> 16) & 0xff)) / 255,
        ((1 - t) * ((gradTop >> 8) & 0xff) + t * ((gradBottom >> 8) & 0xff)) / 255,
        ((1 - t) * (gradTop & 0xff) + t * (gradBottom & 0xff)) / 255
      ]);
      this.mountainBg.beginFill(color);
      this.mountainBg.drawRect(0, (h / steps) * i, w, h / steps + 1);
      this.mountainBg.endFill();
    }
    this.mountainContainer.addChildAt(this.mountainBg, 0);
  }
  createAvatar() {
    if (this.avatar) this.avatar.destroy();
    this.avatar = new PIXI.Container();
    let body = new PIXI.Graphics();
    body.beginFill(0x3d3d5c);
    body.drawRect(-AVATAR_SIZE / 2, -AVATAR_SIZE / 2, AVATAR_SIZE, AVATAR_SIZE * 0.7);
    body.endFill();
    this.avatar.addChild(body);
    let head = new PIXI.Graphics();
    head.beginFill(0xf9e6b3);
    head.drawCircle(0, -AVATAR_SIZE * 0.55, AVATAR_SIZE * 0.25);
    head.endFill();
    this.avatar.addChild(head);
    let legL = new PIXI.Graphics();
    legL.lineStyle(4, 0x2d2d2d);
    legL.moveTo(-AVATAR_SIZE * 0.2, AVATAR_SIZE * 0.35);
    legL.lineTo(-AVATAR_SIZE * 0.2, AVATAR_SIZE * 0.7);
    this.avatar.addChild(legL);
    let legR = new PIXI.Graphics();
    legR.lineStyle(4, 0x2d2d2d);
    legR.moveTo(AVATAR_SIZE * 0.2, AVATAR_SIZE * 0.35);
    legR.lineTo(AVATAR_SIZE * 0.2, AVATAR_SIZE * 0.7);
    this.avatar.addChild(legR);
    let armL = new PIXI.Graphics();
    armL.lineStyle(3, 0x2d2d2d);
    armL.moveTo(-AVATAR_SIZE * 0.3, -AVATAR_SIZE * 0.1);
    armL.lineTo(-AVATAR_SIZE * 0.45, -AVATAR_SIZE * 0.3);
    this.avatar.addChild(armL);
    let armR = new PIXI.Graphics();
    armR.lineStyle(3, 0x2d2d2d);
    armR.moveTo(AVATAR_SIZE * 0.3, -AVATAR_SIZE * 0.1);
    armR.lineTo(AVATAR_SIZE * 0.45, -AVATAR_SIZE * 0.3);
    this.avatar.addChild(armR);
    let idx = this.avatarBlockIndex;
    let block = this.mountainBlocks[idx];
    this.avatar.x = block.x + BLOCK_WIDTH / 2;
    this.avatar.y = block.y + BLOCK_HEIGHT / 2 - 4;
    this.mountainContainer.addChild(this.avatar);
  }
  createTypingUI() {
    this.typingContainer.removeChildren();
    let w = GAME_WIDTH * TYPING_WIDTH_RATIO;
    let h = GAME_HEIGHT;
    let bg = new PIXI.Graphics();
    bg.beginFill(0x23243a);
    bg.drawRect(0, 0, w, h);
    bg.endFill();
    this.typingContainer.addChild(bg);
    this.wordText = new PIXI.Text('', {
      fontFamily: 'monospace',
      fontSize: 44,
      fill: 0xffffff,
      fontWeight: 'bold',
      align: 'center'
    });
    this.wordText.anchor.set(0.5, 0);
    this.wordText.x = w / 2;
    this.wordText.y = 38;
    this.typingContainer.addChild(this.wordText);
    this.retryIndicator = new PIXI.Text('', {
      fontFamily: 'monospace',
      fontSize: 22,
      fill: 0xffeb3b,
      fontWeight: 'bold'
    });
    this.retryIndicator.anchor.set(0, 0.5);
    this.retryIndicator.x = w / 2 + this.wordText.width / 2 + 16;
    this.retryIndicator.y = this.wordText.y + 24;
    this.typingContainer.addChild(this.retryIndicator);
    this.inputFieldBg = new PIXI.Graphics();
    this.inputFieldBg.beginFill(0x181d2b);
    this.inputFieldBg.lineStyle(3, 0x5cc8ff, 1);
    this.inputFieldBg.drawRoundedRect(w * 0.12, 120, w * 0.76, 56, 12);
    this.inputFieldBg.endFill();
    this.typingContainer.addChild(this.inputFieldBg);
    this.inputText = new PIXI.Text('', {
      fontFamily: 'monospace',
      fontSize: 38,
      fill: 0xffffff,
      align: 'left'
    });
    this.inputText.anchor.set(0, 0.5);
    this.inputText.x = w * 0.14;
    this.inputText.y = 148;
    this.typingContainer.addChild(this.inputText);
    this.cursor = new PIXI.Text('|', {
      fontFamily: 'monospace',
      fontSize: 38,
      fill: 0xffffff
    });
    this.cursor.anchor.set(0, 0.5);
    this.typingContainer.addChild(this.cursor);
    this.wordsStat = new PIXI.Text('', {
      fontFamily: 'monospace',
      fontSize: 24,
      fill: 0xb2f7ef
    });
    this.wordsStat.anchor.set(0, 0);
    this.wordsStat.x = w * 0.14;
    this.wordsStat.y = 200;
    this.typingContainer.addChild(this.wordsStat);
    this.lengthStat = new PIXI.Text('', {
      fontFamily: 'monospace',
      fontSize: 24,
      fill: 0xb2f7ef
    });
    this.lengthStat.anchor.set(1, 0);
    this.lengthStat.x = w * 0.86;
    this.lengthStat.y = 200;
    this.typingContainer.addChild(this.lengthStat);
  }
  pickNextWord() {
    if (!this.usedWords[this.wordLength]) this.usedWords[this.wordLength] = {};
    let pool = wordsByLength[this.wordLength].filter(w => !this.usedWords[this.wordLength][w]);
    if (pool.length === 0) {
      this.usedWords[this.wordLength] = {};
      pool = wordsByLength[this.wordLength].slice();
    }
    let word = pool[Math.floor(Math.random() * pool.length)];
    this.usedWords[this.wordLength][word] = true;
    this.currentWord = word;
    this.retryCount = 1;
    this.retryProgress = 0;
    this.typed = "";
    this.lastTypedWrong = false;
  }
  updateTypingUI() {
    let w = GAME_WIDTH * TYPING_WIDTH_RATIO;
    this.wordText.text = this.currentWord.toUpperCase();
    this.wordText.x = w / 2;
    this.retryIndicator.text = this.retryCount > 1 ? 'x' + this.retryCount : '';
    this.retryIndicator.x = w / 2 + this.wordText.width / 2 + 18;
    this.retryIndicator.y = this.wordText.y + 24;
    let displayTyped = '';
    let colors = [];
    let expected = this.currentWord.repeat(this.retryCount);
    for (let i = 0; i < this.typed.length; i++) {
      let correct = expected[i] && this.typed[i].toLowerCase() === expected[i].toLowerCase();
      colors.push(correct ? 0x6aff7e : 0xff4e4e);
    }
    for (let i = 0; i < this.typed.length; i++) {
      let char = this.typed[i];
      let col = colors[i];
      displayTyped += '[#' + col.toString(16).padStart(6, '0') + ']' + char + '[/#]';
    }
    this.inputText.text = displayTyped;
    let metrics = PIXI.TextMetrics.measureText(this.inputText.text, this.inputText.style);
    let xBase = w * 0.14;
    this.inputText.x = xBase;
    this.cursor.x = xBase + metrics.width + 2;
    this.cursor.y = 148;
    this.cursor.style.fill = this.lastTypedWrong ? 0xff4e4e : 0xffffff;
    this.cursor.visible = this.cursorVisible && this.inputActive;
    this.inputText.y = 148;
    this.inputFieldBg.clear();
    this.inputFieldBg.beginFill(0x181d2b);
    this.inputFieldBg.lineStyle(3, this.lastTypedWrong ? 0xff4e4e : 0x5cc8ff, 1);
    this.inputFieldBg.drawRoundedRect(w * 0.12, 120, w * 0.76, 56, 12);
    this.inputFieldBg.endFill();
    this.wordsStat.text = 'Words: ' + this.wordsTyped;
    this.lengthStat.text = 'Length: ' + this.wordLength;
  }
  onKeyDown(e) {
    if (this.state === GameState.LOADING) return;
    if (this.state === GameState.READY) {
      this.setState(GameState.PLAYING);
      return;
    }
    if (this.state !== GameState.PLAYING || !this.inputActive) return;
    if (this.isClimbing) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    let code = e.code;
    if (code === 'Backspace') {
      if (this.typed.length > 0) {
        this.typed = this.typed.slice(0, -1);
        this.lastTypedWrong = false;
        this.updateTypingUI();
      }
      return;
    }
    if (code.length === 1 || (code.startsWith('Key') || code.startsWith('Digit'))) {
      let ch = e.key;
      if (!/^[a-zA-Z0-9]$/.test(ch)) return;
      if (this.typed.length >= this.currentWord.length * this.retryCount) return;
      this.typed += ch;
      let expected = this.currentWord.repeat(this.retryCount);
      let soFar = this.typed;
      let correct = true;
      for (let i = 0; i < soFar.length; i++) {
        if (soFar[i].toLowerCase() !== expected[i].toLowerCase()) {
          correct = false;
          break;
        }
      }
      if (!correct) {
        this.lastTypedWrong = true;
        this.inputActive = false;
        this.updateTypingUI();
        setTimeout(() => {
          this.typed = "";
          this.retryCount++;
          this.retryProgress = 0;
          this.inputActive = true;
          this.lastTypedWrong = false;
          this.updateTypingUI();
        }, 420);
        return;
      }
      this.lastTypedWrong = false;
      this.updateTypingUI();
      if (this.typed.length === expected.length) {
        this.inputActive = false;
        setTimeout(() => {
          this.onWordSuccess();
        }, 160);
      }
    }
  }
  onWordSuccess() {
    this.wordsAtCurrentLength++;
    if (this.retryCount === 1) this.wordsTyped++;
    if (this.wordsAtCurrentLength >= WORDS_PER_LENGTH) {
      this.wordsAtCurrentLength = 0;
      if (this.wordLength < MAX_WORD_LENGTH) this.wordLength++;
    }
    this.avatarBlockIndex++;
    if (this.avatarBlockIndex >= this.mountainBlocks.length) {
      this.avatarBlockIndex = this.mountainBlocks.length - 1;
    }
    this.animateClimb();
    this.pickNextWord();
    this.updateTypingUI();
  }
  animateClimb() {
    this.isClimbing = true;
    let idx = this.avatarBlockIndex;
    let block = this.mountainBlocks[idx];
    let startY = this.avatar.y;
    let endY = block.y + BLOCK_HEIGHT / 2 - 4;
    let duration = 32;
    let t = 0;
    let startCamera = this.cameraOffset;
    let targetCamera = Math.max(0, (idx - 4) * BLOCK_HEIGHT);
    let animate = () => {
      t++;
      let f = Math.min(1, t / duration);
      this.avatar.y = startY + (endY - startY) * f;
      this.cameraOffset = startCamera + (targetCamera - startCamera) * f;
      this.mountainContainer.y = -this.cameraOffset;
      if (f < 1) {
        this.app.ticker.addOnce(animate);
      } else {
        this.isClimbing = false;
        this.inputActive = true;
        this.updateTypingUI();
      }
    };
    this.app.ticker.addOnce(animate);
  }
  update(delta) {
    if (this.state === GameState.PLAYING) {
      this.cursorBlink += delta;
      if (this.cursorBlink > 30) {
        this.cursorBlink = 0;
        this.cursorVisible = !this.cursorVisible;
        this.updateTypingUI();
      }
    }
    if (this.state === GameState.READY) {
      if (this.readyText) {
        let t = (Date.now() % 1400) / 1400;
        let alpha = 0.7 + 0.3 * Math.sin(t * Math.PI * 2);
        this.readyText.alpha = alpha;
      }
    }
  }
  onResize() {
    let w = window.innerWidth;
    let h = window.innerHeight;
    this.app.renderer.resize(w, h);
    this.mainContainer.x = 0;
    this.mainContainer.y = 0;
    this.typingContainer.x = w * MOUNTAIN_WIDTH_RATIO;
    if (this.inputFieldBg) this.updateTypingUI();
  }
}
new BlockClimbTyper();