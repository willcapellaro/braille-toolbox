export class InputManager {
    constructor() {
        this.keys = {};
        this.keyHandlers = {};
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            const keyCode = event.code;
            
            if (!this.keys[keyCode]) {
                this.keys[keyCode] = true;
                this.triggerKeyDown(keyCode);
            }
            
            // Prevent default behavior for game keys
            if (this.isGameKey(keyCode)) {
                event.preventDefault();
            }
        });

        document.addEventListener('keyup', (event) => {
            const keyCode = event.code;
            this.keys[keyCode] = false;
            this.triggerKeyUp(keyCode);
        });
    }

    isGameKey(keyCode) {
        const gameKeys = [
            'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
            'KeyR', 'KeyP', 'Escape'
        ];
        return gameKeys.includes(keyCode);
    }

    onKeyDown(keyCode, callback) {
        if (!this.keyHandlers[keyCode]) {
            this.keyHandlers[keyCode] = { down: [], up: [] };
        }
        this.keyHandlers[keyCode].down.push(callback);
    }

    onKeyUp(keyCode, callback) {
        if (!this.keyHandlers[keyCode]) {
            this.keyHandlers[keyCode] = { down: [], up: [] };
        }
        this.keyHandlers[keyCode].up.push(callback);
    }

    triggerKeyDown(keyCode) {
        if (this.keyHandlers[keyCode] && this.keyHandlers[keyCode].down) {
            this.keyHandlers[keyCode].down.forEach(callback => callback());
        }
    }

    triggerKeyUp(keyCode) {
        if (this.keyHandlers[keyCode] && this.keyHandlers[keyCode].up) {
            this.keyHandlers[keyCode].up.forEach(callback => callback());
        }
    }

    isKeyPressed(keyCode) {
        return this.keys[keyCode] || false;
    }

    // Continuous key checking for smooth movement
    isMovingLeft() {
        return this.isKeyPressed('ArrowLeft');
    }

    isMovingRight() {
        return this.isKeyPressed('ArrowRight');
    }

    isAccelerating() {
        return this.isKeyPressed('ArrowUp');
    }

    isBraking() {
        return this.isKeyPressed('ArrowDown');
    }
}