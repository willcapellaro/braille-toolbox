import * as THREE from 'three';
import { WordLibrary, UserManager } from './userData.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.orb = null;
        this.currentWord = '';
        this.currentWordIndex = 0;
        this.typedChars = '';
        this.stars = [];
        this.animationId = null;
        
        this.wordLibrary = new WordLibrary();
        this.userManager = new UserManager();
        
        // Braille character mapping (Unicode Braille patterns)
        this.brailleMapping = {
            'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋', 'g': '⠛', 'h': '⠓',
            'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏',
            'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
            'y': '⠽', 'z': '⠵'
        };
        
        // Braille learning properties
        this.brailleChar = null;
        this.brailleSymbol = null;
        this.brailleIndex = -1;

        // Game state
        this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameOver'
        this.score = 0;
        this.lives = 3;
        this.streak = 0;
        this.maxStreak = 0;
        this.wordsCompleted = 0;
        this.currentLevel = 3; // Start with 3-letter words
        this.mode = 'beginner';
        this.isPaused = false;
        
        // Timing
        this.startTime = null;
        this.currentWordStartTime = null;
        this.totalTime = 0;
        
        // For WPM calculation
        this.charactersTyped = 0;
        this.typedWord = '';
        
        // Level progression
        this.wordsPerLevel = 5;
        this.levelProgress = 0;
        
        // Animation properties
        this.orbTargetScale = 1;
        this.orbCurrentScale = 1;
        this.orbScaleSpeed = 0.1;
        
        // Initialize
        this.init();
    }

    init() {
        if (!this.canvas) {
            console.error('Canvas not provided to Game constructor');
            return;
        }

        // Create scene
        this.scene = new THREE.Scene();

        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setClearColor(0x000511, 1);

        // Create orb
        this.createOrb();
        this.createStarField();

        // Bind resize handler
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Start animation loop
        this.animate();
    }
    
    initialize(mode, userManager) {
        this.mode = mode;
        this.userManager = userManager;
        
        // Update game state based on user progress
        const progress = this.userManager.getProgressForMode(mode);
        if (progress) {
            this.currentLevel = progress.level;
        }
        
        this.startGame();
    }

    createOrb() {
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        
        // Create gradient material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                colorA: { value: new THREE.Color(0x00ffff) },
                colorB: { value: new THREE.Color(0xff6b9d) },
                colorC: { value: new THREE.Color(0xffd93d) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                void main() {
                    vUv = uv;
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 colorA;
                uniform vec3 colorB;
                uniform vec3 colorC;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    float wave = sin(vPosition.y * 4.0 + time) * 0.5 + 0.5;
                    float pulse = sin(time * 2.0) * 0.5 + 0.5;
                    
                    vec3 color = mix(colorA, colorB, wave);
                    color = mix(color, colorC, pulse * 0.3);
                    
                    // Add some rim lighting
                    float rim = 1.0 - abs(dot(normalize(vPosition), vec3(0.0, 0.0, 1.0)));
                    color += rim * 0.5;
                    
                    gl_FragColor = vec4(color, 0.8);
                }
            `,
            transparent: true
        });

        this.orb = new THREE.Mesh(geometry, material);
        this.scene.add(this.orb);
    }

    createStarField() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 100;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true
        });

        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    setMode(mode) {
        this.mode = mode;
        this.currentLevel = 3; // Reset to 3-letter words for new mode
        this.levelProgress = 0;
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.streak = 0;
        this.wordsCompleted = 0;
        this.charactersTyped = 0;
        this.startTime = Date.now();
        this.levelProgress = 0;
        
        // Set up keyboard event listeners
        this.setupKeyboardListeners();
        
        this.nextWord();
        this.updateUI();
    }

    setupKeyboardListeners() {
        // Remove any existing listeners to prevent duplicates
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
        }
        
        // Create bound handler to maintain 'this' context
        this.keydownHandler = (event) => {
            if (this.gameState === 'playing' && !this.isPaused) {
                this.handleKeyPress(event);
            }
        };
        
        document.addEventListener('keydown', this.keydownHandler);
    }

    restart() {
        this.startGame();
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    convertWordToBrailleFormat(word) {
        // Convert word to lowercase for consistency
        const lowerWord = word.toLowerCase();
        this.originalWord = lowerWord;
        
        // For Braille mode, replace one character with Braille
        if (this.mode === 'braille' && lowerWord.length > 1) {
            const randomIndex = Math.floor(Math.random() * lowerWord.length);
            const char = lowerWord[randomIndex];
            if (this.brailleMapping[char]) {
                // Store Braille info for learning display
                this.brailleChar = char;
                this.brailleSymbol = this.brailleMapping[char];
                this.brailleIndex = randomIndex;
                
                // Return word with Braille character substituted
                return lowerWord.slice(0, randomIndex) + this.brailleMapping[char] + lowerWord.slice(randomIndex + 1);
            }
        } else {
            // Reset Braille properties for non-Braille modes
            this.brailleChar = null;
            this.brailleSymbol = null;
            this.brailleIndex = -1;
        }
        
        return lowerWord;
    }

    nextWord() {
        if (this.gameState !== 'playing') return;
        
        // Get word based on current mode and level
        const baseWord = this.wordLibrary.getRandomWord(this.mode, this.currentLevel);
        console.log('NEW WORD - Base:', baseWord);
        this.currentWord = this.convertWordToBrailleFormat(baseWord);
        console.log('NEW WORD - Display:', this.currentWord, 'Original:', this.originalWord, 'Mode:', this.mode);
        this.typedWord = '';
        
        // Update input indicator for non-Braille modes
        if (this.mode !== 'braille') {
            const inputIndicator = document.getElementById('input-indicator');
            if (inputIndicator) {
                inputIndicator.textContent = 'Type the word above... (Tab to skip)';
            }
        }
        
        this.updateWordDisplay();
    }

    handleKeyPress(event) {
        if (event.key === 'Backspace') {
            this.typedWord = this.typedWord.slice(0, -1);
        } else if (event.key === 'Enter') {
            this.submitWord();
        } else if (event.key === 'Tab') {
            // Skip to next word with Tab
            event.preventDefault();
            this.skipWord();
        } else if (event.key.length === 1 && /[a-zA-Z\s]/.test(event.key)) {
            this.typedWord += event.key.toLowerCase();
        }
        
        this.updateWordDisplay();
        
        // Auto-submit when word is complete
        const compareWord = this.originalWord;
        console.log('AUTO-SUBMIT CHECK - Typed:', this.typedWord.toLowerCase(), 'Target:', compareWord, 'OriginalWord exists:', !!this.originalWord, 'Match:', this.typedWord.toLowerCase() === compareWord);
        if (compareWord && this.typedWord.toLowerCase() === compareWord) {
            console.log('AUTO-SUBMITTING!');
            setTimeout(() => this.submitWord(), 100);
        }
    }

    submitWord() {
        // Always compare against the original word (the target word to type)
        const compareWord = this.originalWord;
        const typedWordLower = this.typedWord.toLowerCase();
        
        console.log('SUBMIT - Typed:', typedWordLower, 'Target:', compareWord, 'OriginalWord exists:', !!this.originalWord, 'Match:', typedWordLower === compareWord);
        
        if (compareWord && typedWordLower === compareWord) {
            this.correctWord();
        } else {
            this.incorrectWord();
        }
    }

    skipWord() {
        // Skip current word without penalty
        console.log('Skipping word:', this.currentWord);
        this.showSkipNotification();
        this.nextWord();
        this.updateUI();
    }

    showSkipNotification() {
        // Show brief notification that word was skipped
        const notification = document.createElement('div');
        notification.className = 'skip-notification';
        notification.textContent = 'Word Skipped';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 193, 61, 0.9);
            color: #000;
            padding: 10px 20px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 1.2em;
            z-index: 1000;
            animation: fadeInOut 1.5s ease-in-out;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 1500);
    }

    correctWord() {
        this.score += 100 + (this.streak * 10);
        this.streak++;
        this.maxStreak = Math.max(this.maxStreak, this.streak);
        this.wordsCompleted++;
        this.charactersTyped += this.currentWord.length;
        this.levelProgress++;

        // Animate orb success
        this.animateOrb('success');

        // Update user manager stats in real time
        if (this.userManager) {
            this.userManager.updateStats(this.mode, {
                wordsCompleted: 1,
                accuracy: 100,
                wpm: this.calculateWPM(),
                currentLevel: this.currentLevel
            });
        }

        // Check for level progression
        if (this.levelProgress >= this.wordsPerLevel) {
            this.levelProgress = 0;
            if (this.currentLevel < 12) {
                this.currentLevel++;
                this.animateLevelUp();
                this.showProgressNotification(`Level Up! Now typing ${this.currentLevel}-letter words!`);
            }
        }

        this.nextWord();
        this.updateUI();
    }

    showProgressNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #00ffff, #ff6b9d);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 1.5em;
            font-weight: bold;
            z-index: 1000;
            animation: popIn 2s ease-out forwards;
        `;

        // Add animation keyframes if they don't exist
        if (!document.getElementById('progress-animations')) {
            const style = document.createElement('style');
            style.id = 'progress-animations';
            style.textContent = `
                @keyframes popIn {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                    30% { transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }

    incorrectWord() {
        this.lives--;
        this.streak = 0;
        
        // Animate orb failure
        this.animateOrb('failure');

        // Update user manager stats in real time
        if (this.userManager) {
            this.userManager.updateStats(this.mode, {
                wordsCompleted: 1,
                accuracy: 0,
                wpm: this.calculateWPM(),
                currentLevel: this.currentLevel
            });
        }
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            this.nextWord();
        }
        
        this.updateUI();
    }

    calculateWPM() {
        if (!this.startTime) return 0;
        
        const timeElapsed = (Date.now() - this.startTime) / 1000 / 60; // Convert to minutes
        const wordsTyped = this.charactersTyped / 5; // Standard: 5 characters = 1 word
        
        return Math.round(wordsTyped / timeElapsed) || 0;
    }

    animateOrb(type) {
        if (!this.orb) return;

        if (type === 'success') {
            // Green pulse
            this.orb.material.uniforms.colorA.value.setHex(0x00ff00);
            this.orbTargetScale = 1.2;
        } else if (type === 'failure') {
            // Red pulse
            this.orb.material.uniforms.colorA.value.setHex(0xff0000);
            this.orbTargetScale = 0.8;
        }

        // Reset after animation
        setTimeout(() => {
            if (this.orb) {
                this.orb.material.uniforms.colorA.value.setHex(0x00ffff);
                this.orbTargetScale = 1;
            }
        }, 500);
    }

    animateLevelUp() {
        if (!this.orb) return;

        // Create dramatic level-up animation
        const startScale = this.orb.scale.x;
        const targetScale = startScale * 1.5;
        const duration = 2000;
        const startTime = Date.now();

        // Change colors through the spectrum
        const colors = [0x00ffff, 0xff6b9d, 0xffd93d, 0x9b59b6, 0x2ecc71];
        let colorIndex = 0;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Use elastic easing for dramatic effect
            const easedProgress = progress < 0.5 ? 
                this.easeOutElastic(progress * 2) * 0.5 : 
                0.5 + this.easeOutQuart((progress - 0.5) * 2) * 0.5;

            const currentScale = startScale + (targetScale - startScale) * easedProgress;
            this.orb.scale.set(currentScale, currentScale, currentScale);

            // Cycle through colors
            if (Math.floor(progress * colors.length) > colorIndex) {
                colorIndex = Math.floor(progress * colors.length);
                if (colorIndex < colors.length) {
                    this.orb.material.uniforms.colorA.value.setHex(colors[colorIndex]);
                }
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Reset to normal state
                this.orb.scale.set(1, 1, 1);
                this.orb.material.uniforms.colorA.value.setHex(0x00ffff);
            }
        };

        animate();
    }

    easeOutElastic(t) {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }
    
    updateWordDisplay() {
        document.getElementById('current-word').textContent = this.currentWord;
        document.getElementById('typed-word').textContent = this.typedWord;
        
        // Color feedback
        const currentWordEl = document.getElementById('current-word');
        const typedWordEl = document.getElementById('typed-word');
        
        if (this.typedWord.length > 0) {
            const compareWord = this.originalWord;
            console.log('COLOR CHECK - Typed:', this.typedWord.toLowerCase(), 'Target:', compareWord, 'StartsWith:', compareWord ? compareWord.startsWith(this.typedWord.toLowerCase()) : 'NO TARGET');
            if (compareWord && compareWord.startsWith(this.typedWord.toLowerCase())) {
                typedWordEl.style.color = '#4CAF50';
            } else {
                typedWordEl.style.color = '#ff4444';
            }
        }
        
        // Show Braille learning info
        const inputIndicator = document.getElementById('input-indicator');
        if (inputIndicator) {
            if (this.mode === 'braille' && this.brailleChar && this.brailleSymbol) {
                inputIndicator.innerHTML = `Type: "${this.originalWord}" • Learn: <strong>${this.brailleChar}</strong> = <strong>${this.brailleSymbol}</strong> (Tab to skip)`;
            } else {
                inputIndicator.textContent = 'Type the word above... (Tab to skip)';
            }
        }
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        
        // Update progress indicator in real-time
        if (this.userManager) {
            const stats = this.userManager.getStats(this.mode);
            document.getElementById('level').textContent = this.currentLevel;
            document.getElementById('level-progress').textContent = `${this.levelProgress}/${this.wordsPerLevel}`;
            document.getElementById('accuracy').textContent = `${stats.accuracy}%`;
            document.getElementById('wpm').textContent = this.calculateWPM();
            document.getElementById('words-completed').textContent = stats.wordsCompleted;
            document.getElementById('best-wpm').textContent = stats.bestWPM;
            document.getElementById('total-accuracy').textContent = `${stats.accuracy}%`;
        }
    }

    gameOver() {
        this.gameState = 'gameOver';
        
        // Calculate final stats
        const finalWPM = this.calculateWPM();
        const finalAccuracy = this.wordsCompleted > 0 ? Math.round((this.wordsCompleted / (this.wordsCompleted + (3 - this.lives))) * 100) : 0;
        
        // Update final user stats
        if (this.userManager) {
            this.userManager.updateStats(this.mode, {
                gamesPlayed: 1,
                accuracy: finalAccuracy,
                wpm: finalWPM,
                bestWPM: finalWPM,
                currentLevel: this.currentLevel
            });
            this.userManager.saveStats();
        }
        
        // Show game over screen with stats
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-wpm').textContent = finalWPM;
        document.getElementById('final-accuracy').textContent = finalAccuracy + '%';
        document.getElementById('final-level').textContent = this.currentLevel;
        
        // Switch to game over screen
        document.querySelector('.screen.active').classList.remove('active');
        document.getElementById('game-over-screen').classList.add('active');
    }

    animate() {
        if (this.gameState === 'playing' && !this.isPaused) {
            // Update orb animation
            if (this.orb) {
                this.orb.rotation.y += 0.01;
                this.orb.rotation.x += 0.005;
                
                // Update time uniform for shader
                this.orb.material.uniforms.time.value += 0.016;
                
                // Smooth scale animation
                this.orbCurrentScale += (this.orbTargetScale - this.orbCurrentScale) * this.orbScaleSpeed;
                this.orb.scale.setScalar(this.orbCurrentScale);
            }
            
            // Animate stars
            if (this.stars) {
                this.stars.rotation.y += 0.0005;
                this.stars.rotation.x += 0.0002;
            }
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
        
        // Continue animation loop
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    onWindowResize() {
        if (!this.camera || !this.renderer || !this.canvas) return;
        
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    destroy() {
        // Clean up keyboard listeners
        if (this.keydownHandler) {
            document.removeEventListener('keydown', this.keydownHandler);
            this.keydownHandler = null;
        }
        
        // Clean up animation and renderer
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.scene) {
            this.scene.traverse((object) => {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
    }
}