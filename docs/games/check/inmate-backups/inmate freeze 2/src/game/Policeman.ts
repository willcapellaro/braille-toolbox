import { Container, Graphics } from 'pixi.js';
import { Position } from './types';
import { Inmate } from './Inmate';
import { GameColors, webColorToHex } from './colors';

export class Policeman {
    public x: number;
    public y: number;
    private targetX: number;
    private targetY: number;
    private speed: number;
    private size: number;
    private color: number;
    private graphics: Graphics;
    private container: Container;
    private id: string;
    private lastDirectionChange: number;
    private directionChangeInterval: number;
    private capturedInmates: Inmate[] = [];
    
    // Vision and targeting system
    private visionRange: number = 150; // How far policeman can see
    private targetInmate: Inmate | null = null; // Current target inmate
    private isHunting: boolean = false; // Whether actively hunting a frozen inmate
    
    // Prisoner capacity and drop-off system
    private maxCapacity: number = 10; // Maximum prisoners before needing drop-off
    private isReturningToDropOff: boolean = false; // Whether heading to drop-off
    private dropOffX: number = 1050; // Drop-off zone X coordinate (middle right)
    private dropOffY: number = 400; // Drop-off zone Y coordinate (middle height)
    
    // Movement bounds (top 3/4 of screen)
    private minX: number = 50;
    private maxX: number = 1150;
    private minY: number = 50;
    private maxY: number = 600; // 3/4 of 800px height
    
    constructor(gameContainer: Container, startX: number, startY: number) {
        this.x = startX;
        this.y = startY;
        this.speed = 0.8 + Math.random() * 0.4; // Slightly slower than inmates
        this.size = 12; // Slightly larger than regular inmates (8)
        this.color = webColorToHex(GameColors.policeman);
        this.id = `policeman_${Date.now()}_${Math.random()}`;
        
        // Random movement timing
        this.lastDirectionChange = Date.now();
        this.directionChangeInterval = 2000 + Math.random() * 3000; // 2-5 seconds
        
        // Set initial random target
        this.setRandomTarget();
        
        // Create graphics
        this.graphics = new Graphics();
        this.container = new Container();
        this.container.addChild(this.graphics);
        gameContainer.addChild(this.container);
        
        this.draw();
    }
    
    private setRandomTarget(): void {
        // Only set random targets when not hunting
        if (!this.isHunting) {
            this.targetX = this.minX + Math.random() * (this.maxX - this.minX);
            this.targetY = this.minY + Math.random() * (this.maxY - this.minY);
        }
        this.lastDirectionChange = Date.now();
    }
    
    private findFrozenInmateInRange(inmates: Inmate[]): Inmate | null {
        let closestInmate: Inmate | null = null;
        let closestDistance = this.visionRange;
        
        for (const inmate of inmates) {
            // Only target frozen, uncaptured inmates
            if (inmate.isFrozenState() && !inmate.isCapturedState()) {
                const dx = this.x - inmate.x;
                const dy = this.y - inmate.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < closestDistance) {
                    closestInmate = inmate;
                    closestDistance = distance;
                }
            }
        }
        
        return closestInmate;
    }
    
    private setTargetInmate(inmate: Inmate | null): void {
        this.targetInmate = inmate;
        if (inmate) {
            this.isHunting = true;
            this.targetX = inmate.x;
            this.targetY = inmate.y;
        } else {
            this.isHunting = false;
            this.setRandomTarget(); // Resume random movement
        }
    }
    
    public update(inmates: Inmate[] = []): void {
        // Check if at capacity and need to return to drop-off
        if (this.capturedInmates.length >= this.maxCapacity && !this.isReturningToDropOff) {
            this.startReturningToDropOff();
        }
        
        // Handle different states
        if (this.isReturningToDropOff) {
            this.updateReturnToDropOff();
        } else {
            // Normal patrol/hunting behavior
            this.updateNormalBehavior(inmates);
        }
        
        // Keep within bounds
        this.x = Math.max(this.minX, Math.min(this.maxX, this.x));
        this.y = Math.max(this.minY, Math.min(this.maxY, this.y));
        
        // Update captured inmates positions
        this.updateCapturedInmates();
        
        this.draw();
    }
    
    private updateNormalBehavior(inmates: Inmate[]): void {
        // Vision system: look for frozen inmates (only if not at capacity)
        if (this.capturedInmates.length < this.maxCapacity) {
            const frozenInmateInRange = this.findFrozenInmateInRange(inmates);
            
            // Update target based on vision
            if (frozenInmateInRange) {
                // Found a frozen inmate, start hunting
                this.setTargetInmate(frozenInmateInRange);
            } else if (this.targetInmate && (!this.targetInmate.isFrozenState() || this.targetInmate.isCapturedState())) {
                // Current target is no longer frozen or was captured, stop hunting
                this.setTargetInmate(null);
            }
        } else {
            // At capacity, stop hunting
            this.setTargetInmate(null);
        }
        
        // Update target position if hunting
        if (this.isHunting && this.targetInmate) {
            this.targetX = this.targetInmate.x;
            this.targetY = this.targetInmate.y;
        }
        
        // Check if it's time to change direction (only when not hunting)
        if (!this.isHunting && Date.now() - this.lastDirectionChange > this.directionChangeInterval) {
            this.setRandomTarget();
            this.directionChangeInterval = 2000 + Math.random() * 3000; // New random interval
        }
        
        // Move towards target
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            // Move faster when hunting
            const moveSpeed = this.isHunting ? this.speed * 1.5 : this.speed;
            this.x += (dx / distance) * moveSpeed;
            this.y += (dy / distance) * moveSpeed;
        } else if (!this.isHunting) {
            // Close enough to random target, set new one
            this.setRandomTarget();
        }
        
        // Keep within bounds
        this.x = Math.max(this.minX, Math.min(this.maxX, this.x));
        this.y = Math.max(this.minY, Math.min(this.maxY, this.y));
        
        // Update captured inmates positions
        this.updateCapturedInmates();
        
        this.draw();
    }
    
    private updateCapturedInmates(): void {
        const followDistance = 25; // Distance between followers
        
        for (let i = 0; i < this.capturedInmates.length; i++) {
            const inmate = this.capturedInmates[i];
            let targetX, targetY;
            
            if (i === 0) {
                // First inmate follows policeman directly
                const angle = Math.atan2(this.y - inmate.y, this.x - inmate.x);
                targetX = this.x - Math.cos(angle) * followDistance;
                targetY = this.y - Math.sin(angle) * followDistance;
            } else {
                // Subsequent inmates follow the previous inmate
                const prevInmate = this.capturedInmates[i - 1];
                const angle = Math.atan2(prevInmate.y - inmate.y, prevInmate.x - inmate.x);
                targetX = prevInmate.x - Math.cos(angle) * followDistance;
                targetY = prevInmate.y - Math.sin(angle) * followDistance;
            }
            
            // Move inmate towards target position
            const dx = targetX - inmate.x;
            const dy = targetY - inmate.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 2) {
                const moveSpeed = this.speed * 1.1; // Slightly faster to keep up
                inmate.x += (dx / distance) * moveSpeed;
                inmate.y += (dy / distance) * moveSpeed;
                
                // Update inmate's target for its own drawing
                inmate.setTarget(targetX, targetY);
            }
        }
    }
    
    public checkInmateCollision(inmate: Inmate): boolean {
        const dx = this.x - inmate.x;
        const dy = this.y - inmate.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance < (this.size + inmate.getSize());
    }
    
    public captureInmate(inmate: Inmate): void {
        if (!this.capturedInmates.includes(inmate) && this.capturedInmates.length < this.maxCapacity) {
            this.capturedInmates.push(inmate);
            inmate.setCaptured(true);
        }
    }
    
    public getCapturedCount(): number {
        return this.capturedInmates.length;
    }
    
    public getPosition(): Position {
        return { x: this.x, y: this.y };
    }
    
    public getId(): string {
        return this.id;
    }
    
    public destroy(): void {
        if (this.container && this.container.parent) {
            this.container.parent.removeChild(this.container);
        }
        this.container.destroy();
    }
    
    private startReturningToDropOff(): void {
        this.isReturningToDropOff = true;
        this.isHunting = false;
        this.targetInmate = null;
        this.targetX = this.dropOffX;
        this.targetY = this.dropOffY;
        console.log(`Policeman at capacity (${this.capturedInmates.length}), returning to drop-off`);
    }

    private updateReturnToDropOff(): void {
        // Move towards drop-off zone
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 10) {
            // Move at normal speed towards drop-off
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            // Arrived at drop-off, reset for more patrolling
            this.dropOffPrisoners();
        }
    }

    private dropOffPrisoners(): Inmate[] {
        const inmatesForRemoval = [...this.capturedInmates]; // Copy the array
        
        // Clear the captured inmates array
        this.capturedInmates = [];
        
        // Reset state for normal patrolling
        this.isReturningToDropOff = false;
        this.setRandomTarget();
        
        console.log(`Dropped off ${inmatesForRemoval.length} prisoners`);
        return inmatesForRemoval;
    }

    public isAtDropOffZone(): boolean {
        const dx = this.x - this.dropOffX;
        const dy = this.y - this.dropOffY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= 10;
    }

    public attemptDropOff(): Inmate[] {
        if (this.isAtDropOffZone() && this.isReturningToDropOff) {
            return this.dropOffPrisoners();
        }
        return [];
    }
    
    private draw(): void {
        this.graphics.clear();
        
        // Draw policeman body
        this.graphics.beginFill(this.color);
        this.graphics.drawCircle(0, 0, this.size);
        this.graphics.endFill();
        
        // Draw direction indicator
        const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        const indicatorLength = this.size + 4;
        
        this.graphics.lineStyle(2, webColorToHex(GameColors.policemanDirection));
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(
            Math.cos(angle) * indicatorLength,
            Math.sin(angle) * indicatorLength
        );
        
        // Draw badge or identifier
        this.graphics.beginFill(0xffffff, 0.8); // White badge
        this.graphics.drawCircle(0, 0, this.size * 0.4);
        this.graphics.endFill();
        
        // Draw vision range when hunting (debug/visual aid)
        if (this.isHunting && !this.isReturningToDropOff) {
            this.graphics.lineStyle(1, webColorToHex(GameColors.policemanVision), 0.3);
            this.graphics.drawCircle(0, 0, this.visionRange);
        }
        
        // Draw capacity indicator
        if (this.capturedInmates.length > 0) {
            // Draw prisoner count above policeman
            const countText = `${this.capturedInmates.length}/${this.maxCapacity}`;
            // Note: For simplicity, we'll just draw a colored circle to indicate capacity status
            const capacityColor = this.capturedInmates.length >= this.maxCapacity ? 0xff0000 : 0x00ff00;
            this.graphics.beginFill(capacityColor, 0.7);
            this.graphics.drawCircle(-8, -this.size - 8, 4);
            this.graphics.endFill();
        }
        
        // Update container position
        this.container.x = this.x;
        this.container.y = this.y;
    }
}