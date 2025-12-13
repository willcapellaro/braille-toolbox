import { Graphics } from 'pixi.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.speed = 5;
        this.maxSpeed = 10;
        this.acceleration = 0.5;
        this.deceleration = 0.3;
        this.currentSpeed = 0;
        
        // Create sprite
        this.sprite = new Graphics();
        this.createSprite();
        this.updatePosition();
    }

    createSprite() {
        this.sprite.clear();
        
        // Car body (rectangle)
        this.sprite.rect(-this.width/2, -this.height/2, this.width, this.height);
        this.sprite.fill(0x00FF00); // Green car
        
        // Car details
        this.sprite.rect(-this.width/2 + 5, -this.height/2 + 10, this.width - 10, 15);
        this.sprite.fill(0x87CEEB); // Light blue windshield
        
        // Wheels
        this.sprite.rect(-this.width/2 - 3, -this.height/2 + 5, 6, 12);
        this.sprite.fill(0x333333); // Dark wheels
        this.sprite.rect(-this.width/2 - 3, this.height/2 - 17, 6, 12);
        this.sprite.fill(0x333333);
        
        this.sprite.rect(this.width/2 - 3, -this.height/2 + 5, 6, 12);
        this.sprite.fill(0x333333);
        this.sprite.rect(this.width/2 - 3, this.height/2 - 17, 6, 12);
        this.sprite.fill(0x333333);
    }

    update(deltaTime) {
        // Apply current speed to position
        // Natural deceleration
        if (this.currentSpeed > 0) {
            this.currentSpeed = Math.max(0, this.currentSpeed - this.deceleration * deltaTime);
        } else if (this.currentSpeed < 0) {
            this.currentSpeed = Math.min(0, this.currentSpeed + this.deceleration * deltaTime);
        }
        
        this.updatePosition();
    }

    updatePosition() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    moveLeft() {
        this.x = Math.max(this.width/2, this.x - this.speed);
        this.updatePosition();
    }

    moveRight() {
        // Assuming screen width is available through bounds checking
        this.x = this.x + this.speed;
        this.updatePosition();
    }

    accelerate() {
        this.currentSpeed = Math.min(this.maxSpeed, this.currentSpeed + this.acceleration);
    }

    brake() {
        this.currentSpeed = Math.max(-this.maxSpeed/2, this.currentSpeed - this.acceleration * 1.5);
    }

    getBounds() {
        return {
            x: this.x - this.width/2,
            y: this.y - this.height/2,
            width: this.width,
            height: this.height
        };
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.currentSpeed = 0;
        this.updatePosition();
    }
}