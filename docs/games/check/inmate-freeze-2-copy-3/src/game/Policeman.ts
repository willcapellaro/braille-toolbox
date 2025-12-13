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
    private visionRange: number = 450; // How far policeman can see
    private visionAngle: number = Math.PI / 2; // 90 degree vision cone (45 degrees each side)
    private targetInmate: Inmate | null = null; // Current target inmate
    private isHunting: boolean = false; // Whether actively hunting a frozen inmate
    
    // Flashlight targeting system
    private flashlightRange: number = 120; // Shorter range for flashlight
    private flashlightAngle: number = Math.PI / 6; // 30 degree flashlight cone (15 degrees each side)
    private flashlightTarget: Inmate | null = null; // Current flashlight target
    private isFlashlightHunting: boolean = false; // Whether hunting with flashlight
    
    // Spotlight attention system
    private spotlightTarget: { x: number, y: number } | null = null;
    private spotlightAttentionDuration: number = 3000; // 3 seconds
    private spotlightAttentionStartTime: number = 0;
    private isPayingAttentionToSpotlight: boolean = false;
    
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
    
    public notifySpotlightActivated(spotlightX: number, spotlightY: number): void {
        // Only respond if not at capacity, not returning to drop-off, and NOT currently hunting
        if (!this.isReturningToDropOff && this.capturedInmates.length < this.maxCapacity && !this.isHunting) {
            this.spotlightTarget = { x: spotlightX, y: spotlightY };
            this.isPayingAttentionToSpotlight = true;
            this.spotlightAttentionStartTime = Date.now();
            
            // Set target towards the spotlight
            this.targetX = spotlightX;
            this.targetY = spotlightY;
        }
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
        
        // Calculate policeman's facing direction
        const facingAngle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        
        for (const inmate of inmates) {
            // Only target frozen, uncaptured inmates
            if (inmate.isFrozenState() && !inmate.isCapturedState()) {
                const dx = inmate.x - this.x;
                const dy = inmate.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.visionRange) {
                    // Calculate angle to inmate relative to facing direction
                    const angleToInmate = Math.atan2(dy, dx);
                    let angleDifference = angleToInmate - facingAngle;
                    
                    // Normalize angle difference to [-π, π]
                    while (angleDifference > Math.PI) angleDifference -= 2 * Math.PI;
                    while (angleDifference < -Math.PI) angleDifference += 2 * Math.PI;
                    
                    // Check if inmate is within vision cone
                    if (Math.abs(angleDifference) <= this.visionAngle / 2) {
                        if (distance < closestDistance) {
                            closestInmate = inmate;
                            closestDistance = distance;
                        }
                    }
                }
            }
        }
        
        return closestInmate;
    }
    
    private findInmateInFlashlight(inmates: Inmate[]): Inmate | null {
        let closestInmate: Inmate | null = null;
        let closestDistance = this.flashlightRange;
        
        // Calculate policeman's facing direction
        const facingAngle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        
        for (const inmate of inmates) {
            // Target any uncaptured inmate (frozen or not)
            if (!inmate.isCapturedState()) {
                const dx = inmate.x - this.x;
                const dy = inmate.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.flashlightRange) {
                    // Calculate angle to inmate relative to facing direction
                    const angleToInmate = Math.atan2(dy, dx);
                    let angleDifference = angleToInmate - facingAngle;
                    
                    // Normalize angle difference to [-π, π]
                    while (angleDifference > Math.PI) angleDifference -= 2 * Math.PI;
                    while (angleDifference < -Math.PI) angleDifference += 2 * Math.PI;
                    
                    // Check if inmate is within flashlight cone
                    if (Math.abs(angleDifference) <= this.flashlightAngle / 2) {
                        if (distance < closestDistance) {
                            closestInmate = inmate;
                            closestDistance = distance;
                        }
                    }
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
    
    private setFlashlightTarget(inmate: Inmate | null): void {
        this.flashlightTarget = inmate;
        if (inmate) {
            this.isFlashlightHunting = true;
            this.targetX = inmate.x;
            this.targetY = inmate.y;
        } else {
            this.isFlashlightHunting = false;
            if (!this.isHunting) {
                this.setRandomTarget(); // Resume random movement only if not vision hunting
            }
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
        // PRIORITY 1: Vision system - look for FROZEN inmates (chase mode has highest priority)
        if (this.capturedInmates.length < this.maxCapacity) {
            const frozenInmateInRange = this.findFrozenInmateInRange(inmates);
            
            if (frozenInmateInRange) {
                // Found a frozen inmate, enter VISION CHASE MODE (overrides everything)
                this.isPayingAttentionToSpotlight = false;
                this.spotlightTarget = null;
                this.setFlashlightTarget(null); // Stop flashlight hunting
                this.setTargetInmate(frozenInmateInRange);
            } else if (this.targetInmate && (!this.targetInmate.isFrozenState() || this.targetInmate.isCapturedState())) {
                // Current vision target is no longer frozen or was captured, exit vision chase mode
                this.setTargetInmate(null);
            }
        }
        
        // PRIORITY 2: Flashlight system - look for ANY inmates in flashlight cone (only if not vision hunting)
        if (this.capturedInmates.length < this.maxCapacity && !this.isHunting) {
            const inmateInFlashlight = this.findInmateInFlashlight(inmates);
            
            if (inmateInFlashlight) {
                // Found an inmate in flashlight, enter FLASHLIGHT CHASE MODE
                this.isPayingAttentionToSpotlight = false;
                this.spotlightTarget = null;
                this.setFlashlightTarget(inmateInFlashlight);
            } else if (this.flashlightTarget && this.flashlightTarget.isCapturedState()) {
                // Current flashlight target was captured, stop flashlight hunting
                this.setFlashlightTarget(null);
            }
        } else if (this.capturedInmates.length >= this.maxCapacity) {
            // At capacity, stop all hunting and spotlight attention
            this.setTargetInmate(null);
            this.setFlashlightTarget(null);
            this.isPayingAttentionToSpotlight = false;
            this.spotlightTarget = null;
        }
        
        // PRIORITY 3: Check if attention to spotlight has expired (only if not hunting)
        if (this.isPayingAttentionToSpotlight && !this.isHunting && !this.isFlashlightHunting) {
            if (Date.now() - this.spotlightAttentionStartTime > this.spotlightAttentionDuration) {
                this.isPayingAttentionToSpotlight = false;
                this.spotlightTarget = null;
                // Resume normal behavior
                this.setRandomTarget();
            }
        }
        
        // PRIORITY 4: Update target position based on current state
        if (this.isHunting && this.targetInmate) {
            // VISION CHASE MODE: Follow the frozen target inmate
            this.targetX = this.targetInmate.x;
            this.targetY = this.targetInmate.y;
        } else if (this.isFlashlightHunting && this.flashlightTarget) {
            // FLASHLIGHT CHASE MODE: Follow the flashlight target inmate
            this.targetX = this.flashlightTarget.x;
            this.targetY = this.flashlightTarget.y;
        } else if (this.isPayingAttentionToSpotlight && this.spotlightTarget) {
            // SPOTLIGHT ATTENTION: Look towards spotlight
            this.targetX = this.spotlightTarget.x;
            this.targetY = this.spotlightTarget.y;
        }
        
        // PRIORITY 5: Random patrol behavior (only when not hunting and not paying attention)
        if (!this.isHunting && !this.isFlashlightHunting && !this.isPayingAttentionToSpotlight && Date.now() - this.lastDirectionChange > this.directionChangeInterval) {
            this.setRandomTarget();
            this.directionChangeInterval = 2000 + Math.random() * 3000; // New random interval
        }
        
        // MOVEMENT: Move towards target with appropriate speed
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            let moveSpeed = this.speed;
            
            if (this.isHunting) {
                // VISION CHASE MODE: Fastest movement (frozen inmates)
                moveSpeed = this.speed * 2.0;
            } else if (this.isFlashlightHunting) {
                // FLASHLIGHT CHASE MODE: Fast movement (any inmates)
                moveSpeed = this.speed * 1.5;
            } else if (this.isPayingAttentionToSpotlight) {
                // SPOTLIGHT ATTENTION: Slow turning movement
                moveSpeed = this.speed * 0.3;
            }
            // Normal patrol uses base speed
            
            this.x += (dx / distance) * moveSpeed;
            this.y += (dy / distance) * moveSpeed;
        } else if (!this.isHunting && !this.isFlashlightHunting && !this.isPayingAttentionToSpotlight) {
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
            
            // Clear targets if we just captured our target
            if (this.targetInmate === inmate) {
                this.setTargetInmate(null);
            }
            if (this.flashlightTarget === inmate) {
                this.setFlashlightTarget(null);
            }
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
        
        // Use different colors for different states
        let directionColor;
        if (this.isHunting) {
            directionColor = webColorToHex(GameColors.inmateHealthBar); // Red for vision chase mode
        } else if (this.isFlashlightHunting) {
            directionColor = webColorToHex(GameColors.batteryMedium); // Yellow for flashlight chase mode
        } else if (this.isPayingAttentionToSpotlight) {
            directionColor = webColorToHex(GameColors.spotlightBeam); // Blue for spotlight attention
        } else {
            directionColor = webColorToHex(GameColors.policemanDirection); // Light blue for normal patrol
        }
        
        this.graphics.lineStyle(this.isHunting || this.isFlashlightHunting ? 3 : 2, directionColor); // Thicker line for chase modes
        this.graphics.moveTo(0, 0);
        this.graphics.lineTo(
            Math.cos(angle) * indicatorLength,
            Math.sin(angle) * indicatorLength
        );
        
        // Draw badge or identifier
        this.graphics.beginFill(0xffffff, 0.8); // White badge
        this.graphics.drawCircle(0, 0, this.size * 0.4);
        this.graphics.endFill();
        
        // Draw vision range (triangular forward-facing cone) - always visible
        if (!this.isReturningToDropOff) {
            // Calculate facing direction
            const facingAngle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
            
            // Draw main vision triangle with different opacity based on state
            let opacity = 0.15;
            let lineOpacity = 0.4;
            
            if (this.isHunting) {
                opacity = 0.3;
                lineOpacity = 0.7;
            } else if (this.isPayingAttentionToSpotlight) {
                opacity = 0.2;
                lineOpacity = 0.5;
            }
            
            // Main vision triangle points
            const leftAngle = facingAngle - this.visionAngle / 2;
            const rightAngle = facingAngle + this.visionAngle / 2;
            
            const leftX = Math.cos(leftAngle) * this.visionRange;
            const leftY = Math.sin(leftAngle) * this.visionRange;
            const rightX = Math.cos(rightAngle) * this.visionRange;
            const rightY = Math.sin(rightAngle) * this.visionRange;
            
            // Draw filled vision cone triangle
            this.graphics.beginFill(webColorToHex(GameColors.policemanVision), opacity);
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(leftX, leftY);
            this.graphics.lineTo(rightX, rightY);
            this.graphics.closePath();
            this.graphics.endFill();
            
            // Draw vision cone outline
            this.graphics.lineStyle(1, webColorToHex(GameColors.policemanVision), lineOpacity);
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(leftX, leftY);
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(rightX, rightY);
            this.graphics.moveTo(leftX, leftY);
            this.graphics.lineTo(rightX, rightY);
            
            // Draw flashlight cone (smaller, brighter, always visible)
            const flashLeftAngle = facingAngle - this.flashlightAngle / 2;
            const flashRightAngle = facingAngle + this.flashlightAngle / 2;
            
            const flashLeftX = Math.cos(flashLeftAngle) * this.flashlightRange;
            const flashLeftY = Math.sin(flashLeftAngle) * this.flashlightRange;
            const flashRightX = Math.cos(flashRightAngle) * this.flashlightRange;
            const flashRightY = Math.sin(flashRightAngle) * this.flashlightRange;
            
            // Flashlight fill - brighter when hunting with it
            const flashOpacity = this.isFlashlightHunting ? 0.4 : 0.25;
            const flashLineOpacity = this.isFlashlightHunting ? 0.8 : 0.6;
            
            this.graphics.beginFill(webColorToHex(GameColors.batteryMedium), flashOpacity); // Yellow flashlight
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(flashLeftX, flashLeftY);
            this.graphics.lineTo(flashRightX, flashRightY);
            this.graphics.closePath();
            this.graphics.endFill();
            
            // Flashlight outline
            this.graphics.lineStyle(1, webColorToHex(GameColors.batteryMedium), flashLineOpacity);
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(flashLeftX, flashLeftY);
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(flashRightX, flashRightY);
            this.graphics.moveTo(flashLeftX, flashLeftY);
            this.graphics.lineTo(flashRightX, flashRightY);
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
        
        // Draw spotlight attention indicator
        if (this.isPayingAttentionToSpotlight) {
            // Draw a small indicator showing policeman is looking at spotlight
            this.graphics.beginFill(webColorToHex(GameColors.spotlightActive), 0.8);
            this.graphics.drawCircle(8, -this.size - 8, 3);
            this.graphics.endFill();
        }
        
        // Update container position
        this.container.x = this.x;
        this.container.y = this.y;
    }
}