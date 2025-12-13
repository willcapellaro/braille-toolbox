import { UserManager } from './userData.js';
import { Game } from './game.js';

export class UIManager {
    constructor() {
        this.userManager = new UserManager();
        this.game = null;
        this.currentScreen = 'main-menu';
        this.currentMissionIndex = 0;
        this.missions = [
            {
                id: 'beginner',
                title: 'Stellar Basics',
                description: 'Master A-J keys • Progress from 3 to 12 letter words',
                difficulty: 'Beginner',
                progression: '3→12 letter progression'
            },
            {
                id: 'intermediate',
                title: 'Galaxy Explorer',
                description: 'Navigate A-T keys • Advanced word challenges',
                difficulty: 'Intermediate',
                progression: 'Focus on K-T keys • 3→12 letters'
            },
            {
                id: 'advanced',
                title: 'Cosmic Master',
                description: 'Full A-Z alphabet • Ultimate typing challenge',
                difficulty: 'Advanced',
                progression: 'Complete mastery • 3→12 letters'
            },
            {
                id: 'braille',
                title: 'Braille Bridge',
                description: 'Learn Braille patterns • Visual accessibility training',
                difficulty: 'Learning',
                progression: 'Braille character introduction'
            }
        ];
        
        this.setupEventListeners();
        this.initializeUI();
    }
    
    initializeUI() {
        // Check if user exists and update UI accordingly
        const user = this.userManager.getCurrentUser();
        if (user) {
            this.showUserInfo(user);
        } else {
            this.showGuestSection();
        }
        
        // Initialize mission display
        this.updateMissionDisplay();
        
        // Show main menu initially
        this.showScreen('main-menu');
    }
    
    setupEventListeners() {
        // Main menu events
        document.getElementById('guest-btn').addEventListener('click', () => {
            this.handleGuestLogin();
        });
        
        document.getElementById('start-mission-btn').addEventListener('click', () => {
            this.startSelectedMission();
        });
        
        document.getElementById('instructions-btn').addEventListener('click', () => {
            this.showScreen('instructions');
        });
        
        // Mission selector events
        document.getElementById('prev-mission').addEventListener('click', () => {
            this.changeMission(-1);
        });
        
        document.getElementById('next-mission').addEventListener('click', () => {
            this.changeMission(1);
        });
        
        // Navigation events
        document.getElementById('back-to-menu').addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        document.getElementById('back-from-instructions').addEventListener('click', () => {
            this.showScreen('main-menu');
        });
        
        // Game selection events
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.getAttribute('data-mode');
                this.startGame(mode);
            });
        });
        
        // Game control events
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.pauseGame();
        });
        
        document.getElementById('resume-btn').addEventListener('click', () => {
            this.resumeGame();
        });
        
        document.getElementById('quit-btn').addEventListener('click', () => {
            this.quitGame();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('back-to-selection').addEventListener('click', () => {
            this.backToSelection();
        });
        
        // Global keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            } else if (this.currentScreen === 'main-menu') {
                if (e.key === 'ArrowLeft') {
                    this.changeMission(-1);
                } else if (e.key === 'ArrowRight') {
                    this.changeMission(1);
                } else if (e.key === 'Enter' && !document.getElementById('start-mission-btn').disabled) {
                    this.startSelectedMission();
                }
            }
        });
    }
    
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
        
        // Update UI based on current screen
        if (screenId === 'game-selection') {
            this.updateGameSelection();
        }
    }
    
    handleGuestLogin() {
        const user = this.userManager.createGuestUser();
        this.showUserInfo(user);
    }
    
    showUserInfo(user) {
        document.getElementById('guest-section').classList.add('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        document.getElementById('start-mission-btn').disabled = false;
        
        document.getElementById('player-name').textContent = user.name;
        document.getElementById('user-best-wpm').textContent = user.stats.bestWPM;
        document.getElementById('games-played').textContent = user.stats.gamesPlayed;
    }
    
    showGuestSection() {
        document.getElementById('guest-section').classList.remove('hidden');
        document.getElementById('user-info').classList.add('hidden');
        document.getElementById('start-mission-btn').disabled = true;
    }
    
    updateGameSelection() {
        const user = this.userManager.getCurrentUser();
        if (user) {
            document.getElementById('current-player').textContent = user.name;
            
            // Update progress indicators for each mode
            this.updateModeProgress('beginner', user);
            this.updateModeProgress('intermediate', user);
            this.updateModeProgress('advanced', user);
        }
    }
    
    updateModeProgress(mode, user) {
        const progress = user.stats.modeProgress[mode];
        const modeElement = document.querySelector(`[data-mode="${mode}"]`);
        
        if (mode === 'beginner' && progress) {
            const levelText = modeElement.querySelector('.progression');
            if (progress.level === 4) {
                levelText.textContent = '4-letter words unlocked!';
                levelText.style.color = '#4CAF50';
            } else {
                levelText.textContent = `${progress.wordsCompleted}/10 words to unlock 4-letter`;
            }
        }
    }
    
    startGame(mode) {
        const user = this.userManager.getCurrentUser();
        if (!user) {
            alert('Please select Guest Player first!');
            return;
        }
        
        this.showScreen('game-screen');
        
        // Initialize the game with the selected mode
        const gameCanvas = document.querySelector('#game-container canvas') || 
                          document.createElement('canvas');
        if (!gameCanvas.parentNode) {
            document.getElementById('game-container').appendChild(gameCanvas);
        }
        
        this.game = new Game(gameCanvas);
        this.game.initialize(mode, this.userManager);
        
        // Update mode indicator
        const modeNames = {
            'beginner': 'Stellar Basics',
            'intermediate': 'Galaxy Explorer', 
            'advanced': 'Cosmic Master',
            'braille': 'Braille Bridge'
        };
        
        document.getElementById('current-mode').textContent = modeNames[mode];
        
        // Update progress indicator
        const progress = this.userManager.getProgressForMode(mode);
        if (progress) {
            const wordsNeeded = 15 - progress.levelProgress;
            document.getElementById('progress-indicator').textContent = 
                `Level ${progress.level} • ${wordsNeeded} words to next level`;
        } else {
            document.getElementById('progress-indicator').textContent = 'Ready to launch!';
        }
    }
    
    pauseGame() {
        if (this.game) {
            this.game.pause();
            document.getElementById('pause-screen').classList.remove('hidden');
        }
    }
    
    resumeGame() {
        if (this.game) {
            this.game.resume();
            document.getElementById('pause-screen').classList.add('hidden');
        }
    }
    
    quitGame() {
        if (this.game) {
            this.game.destroy();
            this.game = null;
        }
        this.showScreen('main-menu');
        // Refresh mission display to show updated progress
        this.updateMissionDisplay();
    }
    
    restartGame() {
        if (this.game) {
            this.game.restart();
            document.getElementById('game-over').classList.add('hidden');
        }
    }
    
    backToSelection() {
        if (this.game) {
            this.game.destroy();
            this.game = null;
        }
        this.showScreen('main-menu');
        // Refresh mission display to show updated progress
        this.updateMissionDisplay();
    }
    
    changeMission(direction) {
        this.currentMissionIndex += direction;
        
        // Wrap around
        if (this.currentMissionIndex < 0) {
            this.currentMissionIndex = this.missions.length - 1;
        } else if (this.currentMissionIndex >= this.missions.length) {
            this.currentMissionIndex = 0;
        }
        
        this.updateMissionDisplay();
    }
    
    updateMissionDisplay() {
        const mission = this.missions[this.currentMissionIndex];
        
        document.getElementById('mission-title').textContent = mission.title;
        document.getElementById('mission-description').textContent = mission.description;
        document.getElementById('mission-difficulty').textContent = mission.difficulty;
        document.getElementById('mission-progression').textContent = mission.progression;
        
        // Update progress for current user if logged in
        const user = this.userManager.getCurrentUser();
        if (user) {
            const progress = this.userManager.getProgressForMode(mission.id);
            const progressElement = document.getElementById('mission-progression');
            
            if (progress) {
                const wordsNeeded = Math.max(0, 15 - progress.levelProgress);
                const currentLevel = progress.level;
                const maxLevel = 12;
                
                console.log(`Mission display - ${mission.id}: Level ${currentLevel}, Progress: ${progress.levelProgress}, Words needed: ${wordsNeeded}`);
                
                if (currentLevel >= maxLevel) {
                    progressElement.textContent = 'Master Level Achieved!';
                    progressElement.style.color = '#FFD700';
                } else if (wordsNeeded === 0) {
                    progressElement.textContent = `Level ${currentLevel} • Ready to advance!`;
                    progressElement.style.color = '#4CAF50';
                } else {
                    progressElement.textContent = `Level ${currentLevel} • ${wordsNeeded} words to Level ${currentLevel + 1}`;
                    progressElement.style.color = '#ff6b9d';
                }
            } else {
                progressElement.textContent = mission.progression;
                progressElement.style.color = '#ff6b9d';
            }
        }
        
        // Update navigation buttons
        document.getElementById('prev-mission').disabled = false;
        document.getElementById('next-mission').disabled = false;
    }
    
    startSelectedMission() {
        const user = this.userManager.getCurrentUser();
        if (!user) {
            alert('Please select Guest Player first!');
            return;
        }
        
        const mission = this.missions[this.currentMissionIndex];
        this.startGame(mission.id);
    }
    
    handleEscapeKey() {
        if (this.currentScreen === 'game-screen') {
            if (this.game && this.game.gameState === 'playing') {
                // Quit current game and return to main menu
                this.quitGame();
            }
        } else if (this.currentScreen === 'instructions' || this.currentScreen === 'game-selection') {
            // Return to main menu from other screens
            this.showScreen('main-menu');
        }
        // On main menu, Escape does nothing (or could minimize/close if in electron)
    }
    
    // Called by the game when it ends
    onGameEnd(gameData) {
        this.userManager.updateUserStats(gameData);
        
        // Update UI with new stats if we're on relevant screens
        const user = this.userManager.getCurrentUser();
        if (user && this.currentScreen === 'main-menu') {
            this.showUserInfo(user);
        }
    }
}