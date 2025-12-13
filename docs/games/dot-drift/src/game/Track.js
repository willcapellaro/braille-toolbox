import { Container, Graphics } from 'pixi.js';

export class Track {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.container = new Container();
        this.obstacles = [];
        this.trackMarkers = [];
        this.scrollOffset = 0;
        
        // Track properties
        this.trackWidth = width * 0.8;
        this.trackLeft = (width - this.trackWidth) / 2;
        this.trackRight = this.trackLeft + this.trackWidth;
        
        this.createTrack();
        this.generateObstacles();
    }

    createTrack() {
        // Create track background
        const trackBg = new Graphics();
        trackBg.rect(this.trackLeft, 0, this.trackWidth, this.height);
        trackBg.fill(0x444444); // Dark gray track
        this.container.addChild(trackBg);
        
        // Create track borders
        const leftBorder = new Graphics();
        leftBorder.rect(this.trackLeft - 5, 0, 5, this.height);
        leftBorder.fill(0xFFFFFF); // White borders
        this.container.addChild(leftBorder);
        
        const rightBorder = new Graphics();
        rightBorder.rect(this.trackRight, 0, 5, this.height);
        rightBorder.fill(0xFFFFFF);
        this.container.addChild(rightBorder);
        
        // Create lane markers
        this.createLaneMarkers();
    }

    createLaneMarkers() {
        const markerHeight = 40;
        const markerGap = 60;
        const numMarkers = Math.ceil(this.height / (markerHeight + markerGap)) + 2;
        
        for (let i = 0; i < numMarkers; i++) {
            const marker = new Graphics();
            marker.rect(-2, 0, 4, markerHeight);
            marker.fill(0xFFFF00); // Yellow lane markers
            marker.x = this.width / 2;
            marker.y = i * (markerHeight + markerGap) - markerHeight;
            this.trackMarkers.push(marker);
            this.container.addChild(marker);
        }
    }

    generateObstacles() {
        // Generate initial obstacles
        for (let i = 0; i < 5; i++) {
            this.createObstacle(i * 200 - 200);
        }
    }

    createObstacle(yPosition) {
        const obstacle = new Graphics();
        const obstacleWidth = 60;
        const obstacleHeight = 40;
        
        // Random position within track bounds
        const x = this.trackLeft + Math.random() * (this.trackWidth - obstacleWidth);
        
        obstacle.rect(0, 0, obstacleWidth, obstacleHeight);
        obstacle.fill(0xFF0000); // Red obstacles
        obstacle.x = x;
        obstacle.y = yPosition;
        
        this.obstacles.push({
            sprite: obstacle,
            bounds: {
                x: x,
                y: yPosition,
                width: obstacleWidth,
                height: obstacleHeight
            }
        });
        
        this.container.addChild(obstacle);
    }

    update(speed) {
        this.scrollOffset += speed;
        
        // Update lane markers
        this.trackMarkers.forEach(marker => {
            marker.y += speed;
            
            // Reset marker position when it goes off screen
            if (marker.y > this.height + 20) {
                marker.y = -60;
            }
        });
        
        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.sprite.y += speed;
            obstacle.bounds.y += speed;
            
            // Remove obstacles that have gone off screen
            if (obstacle.sprite.y > this.height + 50) {
                this.container.removeChild(obstacle.sprite);
                this.obstacles.splice(index, 1);
            }
        });
        
        // Generate new obstacles
        if (this.obstacles.length < 3) {
            this.createObstacle(-100 - Math.random() * 200);
        }
    }

    checkCollision(playerBounds) {
        // Check collision with track boundaries
        if (playerBounds.x < this.trackLeft || 
            playerBounds.x + playerBounds.width > this.trackRight) {
            return true;
        }
        
        // Check collision with obstacles
        for (let obstacle of this.obstacles) {
            if (this.isColliding(playerBounds, obstacle.bounds)) {
                return true;
            }
        }
        
        return false;
    }

    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    reset() {
        this.scrollOffset = 0;
        
        // Reset lane markers
        this.trackMarkers.forEach((marker, index) => {
            marker.y = index * 100 - 40;
        });
        
        // Clear obstacles
        this.obstacles.forEach(obstacle => {
            this.container.removeChild(obstacle.sprite);
        });
        this.obstacles = [];
        
        // Generate new obstacles
        this.generateObstacles();
    }
}