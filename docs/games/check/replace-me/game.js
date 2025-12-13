const WIDTH = 1024;
const HEIGHT = 600;
const TRACK_WIDTH = 800;
const TRACK_HEIGHT = 100;
const TRACK_X = 112;
const TRACK_Y = 240;                    // First track moved up
const TRACK2_Y = TRACK_Y + 140;         // Second track below first
const RUNNER_START_X = TRACK_X;
const RUNNER_Y = TRACK_Y + TRACK_HEIGHT / 2 + 10;
const RUNNER2_Y = TRACK2_Y + TRACK_HEIGHT / 2 + 10;  // Second runner position
const RUNNER_WIDTH = 32;
const RUNNER_HEIGHT = 64;
const MAX_SPEED = 12;
const ACCEL_CYCLE = [2, 1.5, 1, 0.8, 0.6, 0.4, 0.3, 0.25, 0.22, 0.2];
const ACCEL_BONUS = 0.1;
const DRAG_BAD = -0.2;
const FRICTION = 0.5;
const DECEL_STUMBLE = 2;
const STAGGER_TIME = 500;
const STUMBLE_COOLDOWN = 2000;
const SEQ = [49, 50, 51];           // Regular keys: 1, 2, 3
const SEQ_NUMPAD = [97, 98, 99];      // Numpad keys: 1, 2, 3
const SEQ2 = [52, 53, 54];           // Regular keys: 4, 5, 6 (second runner)
const SEQ2_NUMPAD = [100, 101, 102];  // Numpad keys: 4, 5, 6 (second runner)
const REVERSE_SEQ = [51, 50, 49];
const IDEAL_OVERLAP_MIN = 80;  // Reduced from 100 - more forgiving
const IDEAL_OVERLAP_MAX = 250; // Increased from 200 - more forgiving
const PRESS_MIN = 30;          // Reduced from 50 - allow faster inputs
const PRESS_MAX = 600;         // Increased from 400 - allow slower inputs
const SEQ_TIMEOUT = 1500;      // Increased from 1000 - more time between sequences
const HOLD_TIMEOUT = 400;
const RHYTHM_WINDOW = 400;     // Increased from 300 - more forgiving rhythm
const REVERSE_DECEL = 1;
const HARDSTOP_HOLD = 500;
class Game {
    constructor() {
        this.app = new PIXI.Application({
            width: WIDTH,
            height: HEIGHT,
            backgroundColor: 0x6bb6ff,
            antialias: true,
            resolution: 1
        });
        document.body.appendChild(this.app.view);
        this.state = 'title';
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        this.keysDown = {};
        this.inputBuffer = [];
        this.rhythmBuffer = [];
        this.bestTime = localStorage.getItem('undulationDashBest') || null;
        this._bindKeys();
        this._setupTitle();
        this.app.ticker.add((d) => this.update(d));
    }
    _bindKeys() {
        window.addEventListener('keydown', e => {
            if (e.repeat) return;
            if (this.state === 'title' && e.code === 'Space') this._setupReady();
            else if (this.state === 'finish') {
                if (e.code === 'Space') this._setupReady();
                else if (e.code === 'Escape') this._setupTitle();
            }
            if (this.state === 'racing') {
                if (SEQ.includes(e.keyCode) || SEQ_NUMPAD.includes(e.keyCode)) {
                    this._onKeyPress(e.keyCode, 1); // Runner 1
                } else if (SEQ2.includes(e.keyCode) || SEQ2_NUMPAD.includes(e.keyCode)) {
                    this._onKeyPress(e.keyCode, 2); // Runner 2
                }
            }
            this.keysDown[e.keyCode] = Date.now();
        });
        window.addEventListener('keyup', e => {
            delete this.keysDown[e.keyCode];
        });
    }
    _setupTitle() {
        this.state = 'title';
        this.container.removeChildren();
        if (this.undulationIndicator) {
            this.undulationIndicator.visible = false;
        }
        if (this.undulationIndicator2) {
            this.undulationIndicator2.visible = false;
        }
        let title = new PIXI.Text('UNDULATION DASH', { fontFamily: 'monospace', fontSize: 60, fill: 0xff4444, align: 'center', fontWeight: 'bold' });
        title.anchor.set(0.5);
        title.x = WIDTH / 2;
        title.y = 130;
        this.container.addChild(title);
        let inst = new PIXI.Text('Roll keys 1-2-3 in rhythm to sprint!\nPress SPACE to Start', { fontFamily: 'monospace', fontSize: 28, fill: 0xffffff, align: 'center' });
        inst.anchor.set(0.5);
        inst.x = WIDTH / 2;
        inst.y = 260;
        this.container.addChild(inst);
        if (this.bestTime) {
            let best = new PIXI.Text('Personal Best: ' + this.bestTime + 's', { fontFamily: 'monospace', fontSize: 26, fill: 0xffff99 });
            best.anchor.set(0.5);
            best.x = WIDTH / 2;
            best.y = 320;
            this.container.addChild(best);
        }
    }
    _setupReady() {
        this.state = 'ready';
        this.container.removeChildren();
        if (this.undulationIndicator) {
            this.undulationIndicator.visible = false;
        }
        if (this.undulationIndicator2) {
            this.undulationIndicator2.visible = false;
        }
        this._drawTrack();
        this._makeRunner();
        this._makeRunner2(); // Add second runner
        this._makeWave();
        this._makeWave2(); // Add second wave
        this._makeUI();
        this.startSignal = new PIXI.Text('READY', { fontFamily: 'monospace', fontSize: 60, fill: 0xffffff, align: 'center' });
        this.startSignal.anchor.set(0.5);
        this.startSignal.x = WIDTH / 2;
        this.startSignal.y = 200;
        this.container.addChild(this.startSignal);
        this.countdown = 0;
        this.readyStart = Date.now();
        this.gun = new PIXI.Graphics();
        this.gun.beginFill(0x222222).drawRect(0, 0, 24, 10).endFill();
        this.gun.beginFill(0x888888).drawRect(20, 2, 10, 6).endFill();
        this.gun.x = WIDTH / 2 + 140;
        this.gun.y = 160;
        this.container.addChild(this.gun);
        this.raceStartTime = null;
        this.staggerTimer = 0;
        this.stumbleCooldown = 0;
    }
    _setupRace() {
        this.state = 'racing';
        if (this.startSignal) {
            this.startSignal.text = '';
        }
        if (this.gun) {
            this.gun.clear();
        }
        this.runnerState = 'running';
        this.runnerAnim = 0;
        this.runnerAnimTime = 0;
        this.runner.x = RUNNER_START_X;
        this.runnerSpeed = 0;
        this.runnerAccelBonus = 0;
        this.runnerCycle = 0;
        this.runnerDist = 0;
        this.seqStep = 0;
        this.seqDir = 1; // Always forward only
        this.inputBuffer = [];
        this.rhythmBuffer = [];
        this.lastInputTime = Date.now();
        this.lastGoodInput = Date.now();
        this.staggerTimer = 0;
        this.stumbleCooldown = 0;
        this.coastTimer = 0;
        this.hardStopTimer = 0;
        this.raceStartTime = Date.now();
        this.finished = false;
        this.finishTime = null;
        this.userStartedMoving = false; // Add flag to prevent auto-movement
        
        // Second runner state variables
        this.runner2Speed = 0;
        this.runner2AccelBonus = 0;
        this.runner2Cycle = 0;
        this.runner2Dist = 0;
        this.seqStep2 = 0;
        this.seqDir2 = 1;
        this.inputBuffer2 = [];
        this.rhythmBuffer2 = [];
        this.lastInputTime2 = Date.now();
        this.lastGoodInput2 = Date.now();
        this.staggerTimer2 = 0;
        this.stumbleCooldown2 = 0;
        this.coastTimer2 = 0;
        this.hardStopTimer2 = 0;
        this.userStartedMoving2 = false;
        this.runner2WaveBob = 0;
        this.runner2StaggerFlash = 0;
        this.waveJitter2 = false;
        this.waveRhythm2 = 1;
        this.waveAnim2 = 0;
        
        // Show undulation indicators during race
        if (this.undulationIndicator) {
            this.undulationIndicator.visible = true;
            this._updateUndulationIndicator();
        }
        if (this.undulationIndicator2) {
            this.undulationIndicator2.visible = true;
            this._updateUndulationIndicator2();
        }
        this.runnerWaveBob = 0;
        this.runnerStaggerFlash = 0;
        this.waveJitter = false;
        this.waveAnim = 0;
        this.waveRhythm = 1;
        this.footDusts = [];
        this.medalShow = null;
        this.timeText.text = '00:00.0';
        this.distText.text = 'Distance: 0.0m / 100m';
        this.speedBar.width = 0;
        this.speedBar.tint = 0x33ff33;
    }
    _setupFinish() {
        this.state = 'finish';
        this.finished = true;
        let t = ((this.finishTime - this.raceStartTime) / 1000).toFixed(2);
        let medal, medalColor;
        if (t < 10) { medal = 'GOLD'; medalColor = 0xffe066; }
        else if (t < 12) { medal = 'SILVER'; medalColor = 0xc0c0ff; }
        else { medal = 'BRONZE'; medalColor = 0xff9966; }
        if (!this.bestTime || t < parseFloat(this.bestTime)) {
            this.bestTime = t;
            localStorage.setItem('undulationDashBest', t);
        }
        let box = new PIXI.Graphics();
        box.beginFill(0x000000, 0.8).drawRoundedRect(WIDTH / 2 - 170, 120, 340, 220, 30).endFill();
        this.container.addChild(box);
        let tt = new PIXI.Text('FINISH!', { fontFamily: 'monospace', fontSize: 54, fill: 0xffffff });
        tt.anchor.set(0.5);
        tt.x = WIDTH / 2;
        tt.y = 160;
        this.container.addChild(tt);
        let time = new PIXI.Text('Time: ' + t + 's', { fontFamily: 'monospace', fontSize: 40, fill: 0xffffff });
        time.anchor.set(0.5);
        time.x = WIDTH / 2;
        time.y = 210;
        this.container.addChild(time);
        let med = new PIXI.Text(medal, { fontFamily: 'monospace', fontSize: 38, fill: medalColor, fontWeight: 'bold' });
        med.anchor.set(0.5);
        med.x = WIDTH / 2;
        med.y = 260;
        this.container.addChild(med);
        let pb = new PIXI.Text('Personal Best: ' + this.bestTime + 's', { fontFamily: 'monospace', fontSize: 24, fill: 0xffff99 });
        pb.anchor.set(0.5);
        pb.x = WIDTH / 2;
        pb.y = 298;
        this.container.addChild(pb);
        let again = new PIXI.Text('Press SPACE to Restart\nESC for Title', { fontFamily: 'monospace', fontSize: 28, fill: 0xffffff, align: 'center' });
        again.anchor.set(0.5);
        again.x = WIDTH / 2;
        again.y = 350;
        this.container.addChild(again);
    }
    _drawTrack() {
        // First track background
        let bg1 = new PIXI.Graphics();
        bg1.beginFill(0x5a8a3a).drawRect(TRACK_X - 50, TRACK_Y - 40, TRACK_WIDTH + 100, TRACK_HEIGHT + 80).endFill();
        this.container.addChild(bg1);
        
        // First track
        let track1 = new PIXI.Graphics();
        track1.beginFill(0x4cbb17);
        track1.drawRect(TRACK_X, TRACK_Y, TRACK_WIDTH, TRACK_HEIGHT);
        track1.endFill();
        this.container.addChild(track1);
        
        // Second track background
        let bg2 = new PIXI.Graphics();
        bg2.beginFill(0x5a8a3a).drawRect(TRACK_X - 50, TRACK2_Y - 40, TRACK_WIDTH + 100, TRACK_HEIGHT + 80).endFill();
        this.container.addChild(bg2);
        
        // Second track
        let track2 = new PIXI.Graphics();
        track2.beginFill(0x4cbb17);
        track2.drawRect(TRACK_X, TRACK2_Y, TRACK_WIDTH, TRACK_HEIGHT);
        track2.endFill();
        this.container.addChild(track2);
        
        // Lane markings for both tracks
        for (let trackY of [TRACK_Y, TRACK2_Y]) {
            for (let i = 0; i <= 4; ++i) {
                let lx = TRACK_X + i * (TRACK_WIDTH / 4);
                let line = new PIXI.Graphics();
                line.lineStyle(i === 0 ? 6 : 2, 0xffffff, 1);
                line.moveTo(lx, trackY);
                line.lineTo(lx, trackY + TRACK_HEIGHT);
                this.container.addChild(line);
            }
        }
        
        // Finish lines for both tracks
        for (let trackY of [TRACK_Y, TRACK2_Y]) {
            let finish = new PIXI.Graphics();
            finish.lineStyle(10, 0xffffff, 1);
            finish.moveTo(TRACK_X + TRACK_WIDTH, trackY - 10);
            finish.lineTo(TRACK_X + TRACK_WIDTH, trackY + TRACK_HEIGHT + 10);
            this.container.addChild(finish);
        }
        
        // Finish text
        let finishText = new PIXI.Text('100m', { fontFamily: 'monospace', fontSize: 22, fill: 0xffffff });
        finishText.anchor.set(0.5, 0);
        finishText.x = TRACK_X + TRACK_WIDTH + 30;
        finishText.y = TRACK_Y + TRACK_HEIGHT / 2 - 18;
        this.container.addChild(finishText);
        
        // Track labels
        let track1Label = new PIXI.Text('Player 1: 1-2-3', { fontFamily: 'monospace', fontSize: 16, fill: 0xffffff });
        track1Label.x = TRACK_X - 45;
        track1Label.y = TRACK_Y;
        this.container.addChild(track1Label);
        
        let track2Label = new PIXI.Text('Player 2: 4-5-6', { fontFamily: 'monospace', fontSize: 16, fill: 0xffffff });
        track2Label.x = TRACK_X - 45;
        track2Label.y = TRACK2_Y;
        this.container.addChild(track2Label);
        
        // Crowd for both tracks
        let crowd = new PIXI.Graphics();
        for (let trackY of [TRACK_Y, TRACK2_Y]) {
            for (let i = 0; i < 30; ++i) {
                let cx = TRACK_X - 50 + Math.random() * (TRACK_WIDTH + 100);
                let cy = trackY - 38 + Math.random() * 30;
                let c = [0x333366, 0x224466, 0x6699cc][Math.floor(Math.random() * 3)];
                crowd.beginFill(c).drawCircle(cx, cy, 8 + Math.random() * 8).endFill();
            }
        }
        this.container.addChild(crowd);
    }
    _makeRunner() {
        this.runner = new PIXI.Container();
        this.runner.x = RUNNER_START_X;
        this.runner.y = RUNNER_Y;
        this.runnerMain = new PIXI.Graphics();
        this._drawRunnerIdle();
        this.runner.addChild(this.runnerMain);
        this.container.addChild(this.runner);
    }
    _makeRunner2() {
        this.runner2 = new PIXI.Container();
        this.runner2.x = RUNNER_START_X;
        this.runner2.y = RUNNER2_Y;
        this.runner2Main = new PIXI.Graphics();
        this._drawRunner2Idle();
        this.runner2.addChild(this.runner2Main);
        this.container.addChild(this.runner2);
    }
    _drawRunnerIdle() {
        this.runnerMain.clear();
        this.runnerMain.beginFill(0xffffff).drawRect(8, 18, 16, 30).endFill();
        this.runnerMain.beginFill(0xff2222).drawRect(8, 48, 16, 12).endFill();
        this.runnerMain.beginFill(0xff2222).drawRect(8, 12, 16, 8).endFill();
        this.runnerMain.beginFill(0x222222).drawRect(8, 60, 6, 14).endFill();
        this.runnerMain.beginFill(0x222222).drawRect(18, 60, 6, 14).endFill();
        this.runnerMain.beginFill(0xffffff).drawRect(10, 8, 12, 6).endFill();
        this.runnerMain.beginFill(0xffcccc).drawRect(13, 0, 6, 10).endFill();
        this.runnerMain.beginFill(0x222222).drawRect(4, 22, 6, 8).endFill();
        this.runnerMain.beginFill(0x222222).drawRect(22, 22, 6, 8).endFill();
    }
    _drawRunnerAnim(frame, bob, stagger, flash) {
        this.runnerMain.clear();
        let c = flash ? 0xff3333 : 0xff2222;
        let yb = bob ? 5 * Math.sin(this.waveAnim * 2.2) : 0;
        let lean = stagger ? (frame % 2 === 0 ? -6 : 6) : 0;
        let f = frame % 4;
        let legL = [60, 68, 60, 66][f];
        let legR = [66, 62, 68, 60][f];
        this.runnerMain.beginFill(0xffffff).drawRect(8 + lean, 18 + yb, 16, 30).endFill();
        this.runnerMain.beginFill(c).drawRect(8 + lean, 48 + yb, 16, 12).endFill();
        this.runnerMain.beginFill(c).drawRect(8 + lean, 12 + yb, 16, 8).endFill();
        this.runnerMain.beginFill(0x222222).drawRect(8 + lean, legL + yb, 6, 14).endFill();
        this.runnerMain.beginFill(0x222222).drawRect(18 + lean, legR + yb, 6, 14).endFill();
        this.runnerMain.beginFill(0xffffff).drawRect(10 + lean, 8 + yb, 12, 6).endFill();
        this.runnerMain.beginFill(0xffcccc).drawRect(13 + lean, 0 + yb, 6, 10).endFill();
        let armL = [22, 18, 22, 28][f];
        let armR = [22, 28, 22, 18][f];
        this.runnerMain.beginFill(0x222222).drawRect(4 + lean, armL + yb, 6, 8).endFill();
        this.runnerMain.beginFill(0x222222).drawRect(22 + lean, armR + yb, 6, 8).endFill();
    }
    _drawRunner2Idle() {
        this.runner2Main.clear();
        // Different colors for second runner (blue instead of red)
        this.runner2Main.beginFill(0xffffff).drawRect(8, 18, 16, 30).endFill();
        this.runner2Main.beginFill(0x2222ff).drawRect(8, 48, 16, 12).endFill(); // Blue shirt
        this.runner2Main.beginFill(0x2222ff).drawRect(8, 12, 16, 8).endFill();  // Blue hat
        this.runner2Main.beginFill(0x222222).drawRect(8, 60, 6, 14).endFill();
        this.runner2Main.beginFill(0x222222).drawRect(18, 60, 6, 14).endFill();
        this.runner2Main.beginFill(0xffffff).drawRect(10, 8, 12, 6).endFill();
        this.runner2Main.beginFill(0xffcccc).drawRect(13, 0, 6, 10).endFill();
        this.runner2Main.beginFill(0x222222).drawRect(4, 22, 6, 8).endFill();
        this.runner2Main.beginFill(0x222222).drawRect(22, 22, 6, 8).endFill();
    }
    _drawRunner2Anim(frame, bob, stagger, flash) {
        this.runner2Main.clear();
        let c = flash ? 0x3333ff : 0x2222ff; // Blue colors
        let yb = bob ? 5 * Math.sin(this.waveAnim2 * 2.2) : 0;
        let lean = stagger ? (frame % 2 === 0 ? -6 : 6) : 0;
        let f = frame % 4;
        let legL = [60, 68, 60, 66][f];
        let legR = [66, 62, 68, 60][f];
        this.runner2Main.beginFill(0xffffff).drawRect(8 + lean, 18 + yb, 16, 30).endFill();
        this.runner2Main.beginFill(c).drawRect(8 + lean, 48 + yb, 16, 12).endFill();
        this.runner2Main.beginFill(c).drawRect(8 + lean, 12 + yb, 16, 8).endFill();
        this.runner2Main.beginFill(0x222222).drawRect(8 + lean, legL + yb, 6, 14).endFill();
        this.runner2Main.beginFill(0x222222).drawRect(18 + lean, legR + yb, 6, 14).endFill();
        this.runner2Main.beginFill(0xffffff).drawRect(10 + lean, 8 + yb, 12, 6).endFill();
        this.runner2Main.beginFill(0xffcccc).drawRect(13 + lean, 0 + yb, 6, 10).endFill();
        let armL = stagger ? 28 : 30;
        let armR = stagger ? 30 : 28;
        this.runner2Main.beginFill(0x222222).drawRect(4 + lean, armL + yb, 6, 8).endFill();
        this.runner2Main.beginFill(0x222222).drawRect(22 + lean, armR + yb, 6, 8).endFill();
    }
    _drawRunner2Stagger(frame) {
        this._drawRunner2Anim(frame, false, true, true);
    }
    _drawRunnerStagger(frame) {
        this._drawRunnerAnim(frame, false, true, true);
    }
    _makeWave() {
        this.wave = new PIXI.Graphics();
        this.wave.x = RUNNER_START_X + RUNNER_WIDTH / 2 - 25;
        this.wave.y = RUNNER_Y + RUNNER_HEIGHT + 10;
        this.container.addChild(this.wave);
    }
    _makeWave2() {
        this.wave2 = new PIXI.Graphics();
        this.wave2.x = RUNNER_START_X + RUNNER_WIDTH / 2 - 25;
        this.wave2.y = RUNNER2_Y + RUNNER_HEIGHT + 10;
        this.container.addChild(this.wave2);
    }
    _makeUI() {
        this.distText = new PIXI.Text('Distance: 0.0m / 100m', { fontFamily: 'monospace', fontSize: 26, fill: 0xffffff });
        this.distText.x = 32;
        this.distText.y = 30;
        this.container.addChild(this.distText);
        this.speedBarBack = new PIXI.Graphics();
        this.speedBarBack.beginFill(0x222222).drawRect(32, 68, 200, 12).endFill();
        this.container.addChild(this.speedBarBack);
        this.speedBar = new PIXI.Graphics();
        this.speedBar.beginFill(0x33ff33).drawRect(32, 68, 0, 12).endFill();
        this.container.addChild(this.speedBar);
        this.timeText = new PIXI.Text('00:00.0', { fontFamily: 'monospace', fontSize: 32, fill: 0xffffff });
        this.timeText.anchor.set(1, 0);
        this.timeText.x = WIDTH - 32;
        this.timeText.y = 32;
        this.container.addChild(this.timeText);
        
        // Create undulation indicator
        this._makeUndulationIndicator();
        this._makeUndulationIndicator2(); // Add second indicator
    }
    _makeUndulationIndicator() {
        // Container for the whole indicator
        this.undulationIndicator = new PIXI.Container();
        this.undulationIndicator.x = WIDTH / 2 - 150; // Move left for player 1
        this.undulationIndicator.y = 150;
        this.container.addChild(this.undulationIndicator);
        
        // Background panel
        this.undulationBg = new PIXI.Graphics();
        this.undulationBg.beginFill(0x000000, 0.7);
        this.undulationBg.drawRoundedRect(-120, -40, 240, 80, 10);
        this.undulationBg.endFill();
        this.undulationIndicator.addChild(this.undulationBg);
        
        // Direction arrow
        this.directionArrow = new PIXI.Graphics();
        this.undulationIndicator.addChild(this.directionArrow);
        
        // Sequence step indicators (3 circles for 1-2-3)
        this.stepIndicators = [];
        for (let i = 0; i < 3; i++) {
            let circle = new PIXI.Graphics();
            circle.x = (i - 1) * 30; // -30, 0, 30
            circle.y = 10;
            this.stepIndicators.push(circle);
            this.undulationIndicator.addChild(circle);
        }
        
        // Direction text
        this.directionText = new PIXI.Text('', { 
            fontFamily: 'monospace', 
            fontSize: 14, 
            fill: 0xffffff,
            align: 'center'
        });
        this.directionText.anchor.set(0.5);
        this.directionText.x = 0;
        this.directionText.y = -25;
        this.undulationIndicator.addChild(this.directionText);
        
        // Status text for reverse availability
        this.statusText = new PIXI.Text('', { 
            fontFamily: 'monospace', 
            fontSize: 10, 
            fill: 0xffff99,
            align: 'center'
        });
        this.statusText.anchor.set(0.5);
        this.statusText.x = 0;
        this.statusText.y = -40;
        this.undulationIndicator.addChild(this.statusText);
        
        // Key labels
        this.keyLabels = [];
        const keyNames = ['1 / Num1', '2 / Num2', '3 / Num3']; // Show both options
        for (let i = 0; i < 3; i++) {
            let label = new PIXI.Text(keyNames[i], {
                fontFamily: 'monospace',
                fontSize: 10, // Slightly smaller to fit both key names
                fill: 0xcccccc
            });
            label.anchor.set(0.5);
            label.x = (i - 1) * 30;
            label.y = 25;
            this.keyLabels.push(label);
            this.undulationIndicator.addChild(label);
        }
        
        // Timing feedback indicator
        this.timingFeedback = new PIXI.Graphics();
        this.timingFeedback.y = -10;
        this.undulationIndicator.addChild(this.timingFeedback);
        
        this._updateUndulationIndicator();
    }
    _makeUndulationIndicator2() {
        // Container for the second player's indicator
        this.undulationIndicator2 = new PIXI.Container();
        this.undulationIndicator2.x = WIDTH / 2 + 150; // Move right for player 2
        this.undulationIndicator2.y = 150;
        this.container.addChild(this.undulationIndicator2);
        
        // Background panel
        this.undulationBg2 = new PIXI.Graphics();
        this.undulationBg2.beginFill(0x000000, 0.7);
        this.undulationBg2.drawRoundedRect(-120, -40, 240, 80, 10);
        this.undulationBg2.endFill();
        this.undulationIndicator2.addChild(this.undulationBg2);
        
        // Direction arrow
        this.directionArrow2 = new PIXI.Graphics();
        this.undulationIndicator2.addChild(this.directionArrow2);
        
        // Sequence step indicators (3 circles for 4-5-6)
        this.stepIndicators2 = [];
        for (let i = 0; i < 3; i++) {
            let circle = new PIXI.Graphics();
            circle.x = (i - 1) * 30; // -30, 0, 30
            circle.y = 10;
            this.stepIndicators2.push(circle);
            this.undulationIndicator2.addChild(circle);
        }
        
        // Direction text
        this.directionText2 = new PIXI.Text('', { 
            fontFamily: 'monospace', 
            fontSize: 14, 
            fill: 0xffffff,
            align: 'center'
        });
        this.directionText2.anchor.set(0.5);
        this.directionText2.x = 0;
        this.directionText2.y = -25;
        this.undulationIndicator2.addChild(this.directionText2);
        
        // Status text
        this.statusText2 = new PIXI.Text('', { 
            fontFamily: 'monospace', 
            fontSize: 10, 
            fill: 0xffff99,
            align: 'center'
        });
        this.statusText2.anchor.set(0.5);
        this.statusText2.x = 0;
        this.statusText2.y = -40;
        this.undulationIndicator2.addChild(this.statusText2);
        
        // Key labels for player 2
        this.keyLabels2 = [];
        const keyNames2 = ['4 / Num4', '5 / Num5', '6 / Num6'];
        for (let i = 0; i < 3; i++) {
            let label = new PIXI.Text(keyNames2[i], {
                fontFamily: 'monospace',
                fontSize: 10,
                fill: 0xcccccc
            });
            label.anchor.set(0.5);
            label.x = (i - 1) * 30;
            label.y = 25;
            this.keyLabels2.push(label);
            this.undulationIndicator2.addChild(label);
        }
        
        // Timing feedback indicator for player 2
        this.timingFeedback2 = new PIXI.Graphics();
        this.timingFeedback2.y = -10;
        this.undulationIndicator2.addChild(this.timingFeedback2);
        
        this._updateUndulationIndicator2();
    }
    _updateUndulationIndicator() {
        if (!this.undulationIndicator) return;
        
        // Always show forward movement only
        this.statusText.text = 'FORWARD ONLY';
        this.statusText.style.fill = 0x33ff33;
        
        // Update direction arrow and text
        this.directionArrow.clear();
        // Forward arrow (right)
        this.directionArrow.beginFill(0x33ff33);
        this.directionArrow.moveTo(-15, -15);
        this.directionArrow.lineTo(0, -15);
        this.directionArrow.lineTo(15, -5);
        this.directionArrow.lineTo(0, 5);
        this.directionArrow.lineTo(-15, 5);
        this.directionArrow.closePath();
        this.directionArrow.endFill();
        this.directionText.text = 'FORWARD: 1→2→3';
        this.directionText.style.fill = 0x33ff33;
        
        // Update step indicators - always use forward sequence
        for (let i = 0; i < 3; i++) {
            const circle = this.stepIndicators[i];
            circle.clear();
            
            // Highlight current step
            if (i === this.seqStep) {
                circle.lineStyle(3, 0x33ff33);
                circle.beginFill(0x33ff33, 0.3);
                circle.drawCircle(0, 0, 12);
            } else {
                circle.lineStyle(2, 0x666666);
                circle.beginFill(0x333333);
                circle.drawCircle(0, 0, 10);
            }
            circle.endFill();
        }
        
        // Update timing feedback based on rhythm
        this.timingFeedback.clear();
        if (this.userStartedMoving && this.waveRhythm !== undefined) {
            const barWidth = 100;
            const barHeight = 6;
            const rhythmColor = this.waveRhythm > 0.7 ? 0x33ff33 :  // Green for good rhythm (was 0.8)
                               this.waveRhythm > 0.4 ? 0xffff33 :  // Yellow for okay rhythm (was 0.6) 
                               0xff3333;                           // Red for poor rhythm
            
            // Background bar
            this.timingFeedback.beginFill(0x333333);
            this.timingFeedback.drawRect(-barWidth/2, 0, barWidth, barHeight);
            this.timingFeedback.endFill();
            
            // Rhythm indicator bar
            this.timingFeedback.beginFill(rhythmColor);
            this.timingFeedback.drawRect(-barWidth/2, 0, barWidth * this.waveRhythm, barHeight);
            this.timingFeedback.endFill();
        }
    }
    _showInputFeedback(isCorrect, timing) {
        if (!this.undulationIndicator) return;
        
        // Create temporary feedback flash
        const flash = new PIXI.Graphics();
        flash.beginFill(isCorrect ? 0x33ff33 : 0xff3333, 0.5);
        flash.drawCircle(0, 0, 50);
        flash.endFill();
        this.undulationIndicator.addChild(flash);
        
        // Animate the flash
        let alpha = 0.8;
        let scale = 1;
        const animate = () => {
            alpha -= 0.05;
            scale += 0.02;
            flash.alpha = alpha;
            flash.scale.set(scale);
            
            if (alpha <= 0) {
                this.undulationIndicator.removeChild(flash);
            } else {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
    _updateUndulationIndicator2() {
        if (!this.undulationIndicator2) return;
        
        // Always show forward movement only for player 2
        this.statusText2.text = 'PLAYER 2 - FORWARD ONLY';
        this.statusText2.style.fill = 0x3333ff; // Blue theme for player 2
        
        // Update direction arrow and text
        this.directionArrow2.clear();
        // Forward arrow (right) in blue
        this.directionArrow2.beginFill(0x3333ff);
        this.directionArrow2.moveTo(-15, -15);
        this.directionArrow2.lineTo(0, -15);
        this.directionArrow2.lineTo(15, -5);
        this.directionArrow2.lineTo(0, 5);
        this.directionArrow2.lineTo(-15, 5);
        this.directionArrow2.closePath();
        this.directionArrow2.endFill();
        this.directionText2.text = 'FORWARD: 4→5→6';
        this.directionText2.style.fill = 0x3333ff;
        
        // Update step indicators - always use forward sequence for player 2
        for (let i = 0; i < 3; i++) {
            const circle = this.stepIndicators2[i];
            circle.clear();
            
            // Highlight current step
            if (i === this.seqStep2) {
                circle.lineStyle(3, 0x3333ff);
                circle.beginFill(0x3333ff, 0.3);
                circle.drawCircle(0, 0, 12);
            } else {
                circle.lineStyle(2, 0x666666);
                circle.beginFill(0x333333);
                circle.drawCircle(0, 0, 10);
            }
            circle.endFill();
        }
        
        // Update timing feedback based on rhythm for player 2
        this.timingFeedback2.clear();
        if (this.userStartedMoving2 && this.waveRhythm2 !== undefined) {
            const barWidth = 100;
            const barHeight = 6;
            const rhythmColor = this.waveRhythm2 > 0.7 ? 0x3333ff :  // Blue for good rhythm
                               this.waveRhythm2 > 0.4 ? 0xffff33 :  // Yellow for okay rhythm
                               0xff3333;                            // Red for poor rhythm
            
            // Background bar
            this.timingFeedback2.beginFill(0x333333);
            this.timingFeedback2.drawRect(-barWidth/2, 0, barWidth, barHeight);
            this.timingFeedback2.endFill();
            
            // Rhythm indicator bar
            this.timingFeedback2.beginFill(rhythmColor);
            this.timingFeedback2.drawRect(-barWidth/2, 0, barWidth * this.waveRhythm2, barHeight);
            this.timingFeedback2.endFill();
        }
    }
    _showInputFeedback2(isCorrect, timing) {
        if (!this.undulationIndicator2) return;
        
        // Create temporary feedback flash for player 2
        const flash = new PIXI.Graphics();
        flash.beginFill(isCorrect ? 0x3333ff : 0xff3333, 0.5);
        flash.drawCircle(0, 0, 50);
        flash.endFill();
        this.undulationIndicator2.addChild(flash);
        
        // Animate the flash
        let alpha = 0.8;
        let scale = 1;
        const animate = () => {
            alpha -= 0.05;
            scale += 0.02;
            flash.alpha = alpha;
            flash.scale.set(scale);
            
            if (alpha <= 0) {
                this.undulationIndicator2.removeChild(flash);
            } else {
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
    _onKeyPress(keyCode, runnerNum) {
        let now = Date.now();
        
        if (runnerNum === 1) {
            // Runner 1 (keys 1,2,3)
            let mappedKeyCode = keyCode;
            if (SEQ_NUMPAD.includes(keyCode)) {
                let numpadIndex = SEQ_NUMPAD.indexOf(keyCode);
                mappedKeyCode = SEQ[numpadIndex];
            }
            
            let expected = SEQ[this.seqStep];
            let isSeq = (mappedKeyCode === expected);
            let isHardStop = (this.keysDown[49] && this.keysDown[50] && this.keysDown[51]) || 
                             (this.keysDown[97] && this.keysDown[98] && this.keysDown[99]);
            
            if (isHardStop) {
                if (!this.hardStopTimer) this.hardStopTimer = now;
                else if (now - this.hardStopTimer > HARDSTOP_HOLD) {
                    this.runnerSpeed = 0;
                    this.hardStopTimer = 0;
                    this.seqStep = 0;
                    this._updateUndulationIndicator();
                    return;
                }
            } else this.hardStopTimer = 0;
            
            if (isSeq) {
                if (!this.userStartedMoving) {
                    this.userStartedMoving = true;
                    this.raceStartTime = Date.now();
                }
                let prevTime = this.inputBuffer.length ? this.inputBuffer[this.inputBuffer.length - 1].time : now;
                let dt = now - prevTime;
                this.inputBuffer.push({ key: mappedKeyCode, time: now });
                if (this.inputBuffer.length > 5) this.inputBuffer.shift();
                this.rhythmBuffer.push(dt);
                if (this.rhythmBuffer.length > 5) this.rhythmBuffer.shift();
                this.lastInputTime = now;
                if (dt < PRESS_MIN || dt > PRESS_MAX) {
                    this._stumble();
                    this._showInputFeedback(false, dt);
                    return;
                }
                this.seqStep += 1;
                if (this.seqStep === 3) {
                    this._cycleAccel();
                    this.seqStep = 0;
                }
                this._updateUndulationIndicator();
                this._showInputFeedback(true, dt);
                this.waveRhythm = this._rhythmScore();
            } else {
                this._stumble();
                this._showInputFeedback(false, 0);
            }
        } else if (runnerNum === 2) {
            // Runner 2 (keys 4,5,6)
            let mappedKeyCode = keyCode;
            if (SEQ2_NUMPAD.includes(keyCode)) {
                let numpadIndex = SEQ2_NUMPAD.indexOf(keyCode);
                mappedKeyCode = SEQ2[numpadIndex];
            }
            
            let expected = SEQ2[this.seqStep2];
            let isSeq = (mappedKeyCode === expected);
            let isHardStop = (this.keysDown[52] && this.keysDown[53] && this.keysDown[54]) || 
                             (this.keysDown[100] && this.keysDown[101] && this.keysDown[102]);
            
            if (isHardStop) {
                if (!this.hardStopTimer2) this.hardStopTimer2 = now;
                else if (now - this.hardStopTimer2 > HARDSTOP_HOLD) {
                    this.runner2Speed = 0;
                    this.hardStopTimer2 = 0;
                    this.seqStep2 = 0;
                    return;
                }
            } else this.hardStopTimer2 = 0;
            
            if (isSeq) {
                if (!this.userStartedMoving2) {
                    this.userStartedMoving2 = true;
                }
                let prevTime = this.inputBuffer2.length ? this.inputBuffer2[this.inputBuffer2.length - 1].time : now;
                let dt = now - prevTime;
                this.inputBuffer2.push({ key: mappedKeyCode, time: now });
                if (this.inputBuffer2.length > 5) this.inputBuffer2.shift();
                this.rhythmBuffer2.push(dt);
                if (this.rhythmBuffer2.length > 5) this.rhythmBuffer2.shift();
                this.lastInputTime2 = now;
                if (dt < PRESS_MIN || dt > PRESS_MAX) {
                    this._stumble2();
                    this._showInputFeedback2(false, dt); // Show negative feedback for bad timing
                    return;
                }
                this.seqStep2 += 1;
                if (this.seqStep2 === 3) {
                    this._cycleAccel2();
                    this.seqStep2 = 0;
                }
                this._updateUndulationIndicator2(); // Update indicator after step change
                this._showInputFeedback2(true, dt); // Show positive feedback
                this.waveRhythm2 = this._rhythmScore2();
            } else {
                this._stumble2();
                this._showInputFeedback2(false, 0); // Show negative feedback
            }
        }
    }
    _cycleAccel() {
        let n = Math.min(this.runnerCycle, ACCEL_CYCLE.length - 1);
        let accel = ACCEL_CYCLE[n];
        let rhythm = this._rhythmScore();
        if (rhythm > 0.8) accel += ACCEL_BONUS;
        this.runnerSpeed += accel * (this.staggerTimer > 0 ? 0.5 : 1);
        if (this.runnerSpeed > MAX_SPEED) this.runnerSpeed = MAX_SPEED;
        this.runnerCycle += 1;
        this.lastGoodInput = Date.now();
        this._makeDust();
    }
    _cycleReverse() {
        this.runnerSpeed -= REVERSE_DECEL;
        if (this.runnerSpeed < 0) this.runnerSpeed = 0;
        this.lastGoodInput = Date.now();
    }
    _stumble() {
        let now = Date.now();
        if (now - this.stumbleCooldown < STUMBLE_COOLDOWN) return;
        this.runnerSpeed -= DECEL_STUMBLE;
        if (this.runnerSpeed < 0) this.runnerSpeed = 0;
        this.staggerTimer = STAGGER_TIME;
        this.stumbleCooldown = now;
        this.runnerStaggerFlash = 200;
    }
    _rhythmScore() {
        if (this.rhythmBuffer.length < 2) return 1; // More forgiving - only need 2 inputs instead of 3
        let ideal = 180; // Increased from 150 - slightly slower ideal rhythm
        let acc = 0;
        for (let i = 0; i < this.rhythmBuffer.length; ++i) {
            let d = Math.abs(this.rhythmBuffer[i] - ideal);
            acc += Math.max(0, 1 - d / 300); // Increased tolerance from 200 to 300
        }
        return acc / this.rhythmBuffer.length;
    }
    _rhythmScore2() {
        if (this.rhythmBuffer2.length < 2) return 1;
        let ideal = 180;
        let acc = 0;
        for (let i = 0; i < this.rhythmBuffer2.length; ++i) {
            let d = Math.abs(this.rhythmBuffer2[i] - ideal);
            acc += Math.max(0, 1 - d / 300);
        }
        return acc / this.rhythmBuffer2.length;
    }
    _cycleAccel2() {
        let n = Math.min(this.runner2Cycle, ACCEL_CYCLE.length - 1);
        let accel = ACCEL_CYCLE[n];
        let rhythm = this._rhythmScore2();
        if (rhythm > 0.7) accel += ACCEL_BONUS;
        this.runner2Speed += accel * (this.staggerTimer2 > 0 ? 0.5 : 1);
        if (this.runner2Speed > MAX_SPEED) this.runner2Speed = MAX_SPEED;
        this.runner2Cycle += 1;
        this.lastGoodInput2 = Date.now();
    }
    _stumble2() {
        let now = Date.now();
        if (now - this.stumbleCooldown2 < STUMBLE_COOLDOWN) return;
        this.runner2Speed -= DECEL_STUMBLE;
        if (this.runner2Speed < 0) this.runner2Speed = 0;
        this.staggerTimer2 = STAGGER_TIME;
        this.stumbleCooldown2 = now;
        this.runner2StaggerFlash = 200;
    }
    _makeDust() {
        let n = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < n; ++i) {
            let d = new PIXI.Graphics();
            let x = this.runner.x + 10 + Math.random() * 12;
            let y = this.runner.y + RUNNER_HEIGHT - 4 + Math.random() * 6;
            let r = 3 + Math.random() * 3;
            d.beginFill(0xffe066, 0.7).drawCircle(0, 0, r).endFill();
            d.x = x;
            d.y = y;
            d.alpha = 0.8;
            d.life = 0.35 + Math.random() * 0.25;
            this.container.addChild(d);
            this.footDusts.push(d);
        }
    }
    update(delta) {
        if (this.state === 'ready') {
            let t = Date.now() - this.readyStart;
            if (this.startSignal) {
                if (t < 1000) this.startSignal.text = 'READY';
                else if (t < 2000) this.startSignal.text = 'SET';
                else if (t < 2800) { 
                    this.startSignal.text = 'GO!'; 
                    if (this.gun) {
                        this.gun.clear(); 
                        this._drawGunBang();
                    }
                }
            }
            if (t >= 2800 && !this.raceStartTime) { this._setupRace(); }
        }
        if (this.state === 'racing') {
            let now = Date.now();
            let dt = delta / 60;
            if (this.staggerTimer > 0) {
                this.staggerTimer -= dt * 1000 / 60;
                if (this.staggerTimer < 0) this.staggerTimer = 0;
            }
            if (this.runnerStaggerFlash > 0) {
                this.runnerStaggerFlash -= dt * 1000 / 60;
                if (this.runnerStaggerFlash < 0) this.runnerStaggerFlash = 0;
            }
            let noInput = now - this.lastInputTime;
            // Only check for input timeout if user has started moving
            if (this.userStartedMoving && noInput > SEQ_TIMEOUT) this._stumble();
            else if (this.userStartedMoving && noInput > 500) {
                this.runnerSpeed -= FRICTION * dt;
                if (this.runnerSpeed < 0) this.runnerSpeed = 0;
            }
            if (this.runnerSpeed > MAX_SPEED) this.runnerSpeed = MAX_SPEED;
            let rhythm = this._rhythmScore();
            this.waveRhythm = rhythm;
            if (rhythm > 0.7) { // Reduced from 0.8 - easier to get speed bonus
                this.runnerSpeed += ACCEL_BONUS * dt;
                this.waveJitter = false;
            } else if (rhythm < 0.4 && this.runnerSpeed > 0.5) { // Reduced from 0.6 - less harsh penalty
                this.runnerSpeed += DRAG_BAD * dt;
                this.waveJitter = true;
            } else this.waveJitter = false;
            
            // Only move if user has started the movement sequence
            if (this.userStartedMoving) {
                this.runnerDist += this.runnerSpeed * dt * (TRACK_WIDTH / 100);
                if (this.runnerDist < 0) this.runnerDist = 0;
                if (this.runnerDist > TRACK_WIDTH) this.runnerDist = TRACK_WIDTH;
                this.runner.x = RUNNER_START_X + this.runnerDist;
            }
            this.wave.x = this.runner.x + RUNNER_WIDTH / 2 - 25;
            this.waveAnim += dt * (1 + this.runnerSpeed / MAX_SPEED * 2);
            if (this.footDusts.length) {
                for (let i = this.footDusts.length - 1; i >= 0; --i) {
                    let d = this.footDusts[i];
                    d.life -= dt * 0.016;
                    d.alpha -= dt * 0.04;
                    d.y += dt * 0.8;
                    if (d.life <= 0 || d.alpha <= 0) {
                        this.container.removeChild(d);
                        this.footDusts.splice(i, 1);
                    }
                }
            }
            this._drawWave();
            let frame = Math.floor(this.waveAnim * (0.8 + this.runnerSpeed / MAX_SPEED * 2)) % 4;
            if (this.staggerTimer > 0) this._drawRunnerStagger(frame);
            else this._drawRunnerAnim(frame, rhythm > 0.8, false, this.runnerStaggerFlash > 0);
            this.distText.text = 'Distance: ' + (this.runnerDist * 100 / TRACK_WIDTH).toFixed(1) + 'm / 100m';
            let t = ((now - this.raceStartTime) / 1000).toFixed(1);
            this.timeText.text = t.length < 5 ? '00:0' + t : '00:' + t;
            this.speedBar.clear();
            this.speedBar.beginFill(this.waveJitter ? 0xffcc33 : 0x33ff33).drawRect(32, 68, 200 * this.runnerSpeed / MAX_SPEED, 12).endFill();
            if (!this.finished && this.runnerDist >= TRACK_WIDTH) {
                this.finishTime = now;
                this._setupFinish();
            }
            
            // Second Runner Logic - completely separate
            let noInput2 = now - this.lastInputTime2;
            // Only check for input timeout if user has started moving
            if (this.userStartedMoving2 && noInput2 > SEQ_TIMEOUT) this._stumble2();
            else if (this.userStartedMoving2 && noInput2 > 500) {
                this.runner2Speed -= FRICTION * dt;
                if (this.runner2Speed < 0) this.runner2Speed = 0;
            }
            if (this.runner2Speed > MAX_SPEED) this.runner2Speed = MAX_SPEED;
            let rhythm2 = this._rhythmScore2();
            this.waveRhythm2 = rhythm2;
            if (rhythm2 > 0.7) { // Speed bonus threshold
                this.runner2Speed += ACCEL_BONUS * dt;
                this.waveJitter2 = false;
            } else if (rhythm2 < 0.4 && this.runner2Speed > 0.5) { // Speed penalty threshold
                this.runner2Speed += DRAG_BAD * dt;
                this.waveJitter2 = true;
            } else this.waveJitter2 = false;
            
            // Only move second runner if user has started the movement sequence
            if (this.userStartedMoving2) {
                this.runner2Dist += this.runner2Speed * dt * (TRACK_WIDTH / 100);
                if (this.runner2Dist < 0) this.runner2Dist = 0;
                if (this.runner2Dist > TRACK_WIDTH) this.runner2Dist = TRACK_WIDTH;
                this.runner2.x = RUNNER_START_X + this.runner2Dist;
            }
            this.wave2.x = this.runner2.x + RUNNER_WIDTH / 2 - 25;
            this.waveAnim2 += dt * (1 + this.runner2Speed / MAX_SPEED * 2);
            
            // Handle second runner's stagger effects
            if (this.staggerTimer2 > 0) {
                this.staggerTimer2 -= dt * 1000 / 60;
                if (this.staggerTimer2 < 0) this.staggerTimer2 = 0;
            }
            if (this.runner2StaggerFlash > 0) {
                this.runner2StaggerFlash -= dt * 1000 / 60;
                if (this.runner2StaggerFlash < 0) this.runner2StaggerFlash = 0;
            }
            
            // Draw second runner's wave and animation
            this._drawWave2();
            let frame2 = Math.floor(this.waveAnim2 * (0.8 + this.runner2Speed / MAX_SPEED * 2)) % 4;
            if (this.staggerTimer2 > 0) this._drawRunner2Stagger(frame2);
            else this._drawRunner2Anim(frame2, rhythm2 > 0.7, false, this.runner2StaggerFlash > 0);
        }
    }
    _drawWave() {
        this.wave.clear();
        let amp = this.waveJitter ? 16 : 10;
        let color = this.waveJitter ? 0xffcc33 : 0x33ff33;
        this.wave.lineStyle(5, color, 1);
        let pts = [];
        for (let i = 0; i <= 50; ++i) {
            let x = i;
            let phase = this.waveAnim * (this.waveJitter ? 1.5 : 1.1);
            let y = Math.sin((x / 50) * Math.PI * 2 + phase) * amp;
            if (this.waveJitter) y += (Math.random() - 0.5) * 8;
            pts.push({ x, y });
        }
        this.wave.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; ++i) {
            this.wave.lineTo(pts[i].x, pts[i].y);
        }
    }
    _drawWave2() {
        this.wave2.clear();
        let amp = this.waveJitter2 ? 16 : 10;
        let color = this.waveJitter2 ? 0xffcc33 : 0x3333ff; // Blue theme for player 2
        this.wave2.lineStyle(5, color, 1);
        let pts = [];
        for (let i = 0; i <= 50; ++i) {
            let x = i;
            let phase = this.waveAnim2 * (this.waveJitter2 ? 1.5 : 1.1);
            let y = Math.sin((x / 50) * Math.PI * 2 + phase) * amp;
            if (this.waveJitter2) y += (Math.random() - 0.5) * 8;
            pts.push({ x, y });
        }
        this.wave2.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; ++i) {
            this.wave2.lineTo(pts[i].x, pts[i].y);
        }
    }
    _drawGunBang() {
        this.gun.beginFill(0x222222).drawRect(0, 0, 24, 10).endFill();
        this.gun.beginFill(0x888888).drawRect(20, 2, 10, 6).endFill();
        this.gun.beginFill(0xffff33).drawCircle(34, 5, 12).endFill();
    }
}
new Game();