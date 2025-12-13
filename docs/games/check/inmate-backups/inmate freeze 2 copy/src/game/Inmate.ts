import { Container, Graphics } from 'pixi.js';
import { Position, InmateType } from './types';
import { GameColors, webColorToHex } from './colors';

export class Inmate {
    public container: Container;
    private graphics: Graphics;
    
    public x: number;
    public y: number;
    private targetX: number;
    private targetY: number;
    private speed: number;
    private health: number;
    private maxHealth: number;
    private type: InmateType;
    private id: string;
    
    // Pathfinding
    private waypoints: Position[] = [];
    private currentWaypointIndex: number = 0;
    private hasReachedExitFlag: boolean = false;
    private isFrozen: boolean = false;
    private freezeStartTime: number = 0;
    private freezeDurationToCatch: number = 5000; // 1 second to catch
    private isCaptured: boolean = false; // New: captured by policeman
    
    // Visual properties
    private color: number;
    private size: number;

    constructor(type: InmateType = InmateType.REGULAR) {
        this.container = new Container();
        this.graphics = new Graphics();
        this.container.addChild(this.graphics);
        
        this.id = `inmate_${Date.now()}_${Math.random()}`;
        this.type = type;
        
        // Set properties based on type
        this.setupInmateType();
        
        // Start position (top of screen, random X)
        this.x = 200 + Math.random() * 800;
        this.y = -20;
        
        // Set up waypoints for pathfinding
        this.setupWaypoints();
        
        this.targetX = this.waypoints[0].x;
        this.targetY = this.waypoints[0].y;
        
        this.draw();
    }

    private setupInmateType(): void {
        switch (this.type) {
            case InmateType.REGULAR:
                this.speed = 1 + Math.random() * 0.5;
                this.health = 1;
                this.maxHealth = 1;
                this.color = webColorToHex(GameColors.inmateRegular);
                this.size = 8;
                break;
                
            case InmateType.FAST:
                this.speed = 2 + Math.random() * 0.5;
                this.health = 1;
                this.maxHealth = 1;
                this.color = webColorToHex(GameColors.inmateFast);
                this.size = 6;
                break;
                
            case InmateType.STRONG:
                this.speed = 0.7 + Math.random() * 0.3;
                this.health = 3;
                this.maxHealth = 3;
                this.color = webColorToHex(GameColors.inmateStrong);
                this.size = 12;
                break;
                
            case InmateType.SNEAKY:
                this.speed = 1.2 + Math.random() * 0.3;
                this.health = 2;
                this.maxHealth = 2;
                this.color = webColorToHex(GameColors.inmateSneaky);
                this.size = 7;
                break;
        }
    }

    private setupWaypoints(): void {
        // Create a path with some randomness - top to bottom
        const numWaypoints = 3 + Math.floor(Math.random() * 3);
        const screenWidth = 1200;
        const screenHeight = 800;
        
        // First waypoint - enter the screen from top
        this.waypoints.push({
            x: this.x + (Math.random() - 0.5) * 200,
            y: 100 + Math.random() * 100
        });
        
        // Middle waypoints - navigate downward through the level
        for (let i = 1; i < numWaypoints - 1; i++) {
            this.waypoints.push({
                x: 200 + Math.random() * 800,
                y: (screenHeight / numWaypoints) * (i + 1) + (Math.random() - 0.5) * 100
            });
        }
        
        // Final waypoint - exit at the bottom of screen
        this.waypoints.push({
            x: 400 + Math.random() * 400,
            y: screenHeight + 50
        });
    }

    private draw(): void {
        this.graphics.clear();
        
        // Draw inmate body with frozen effect if frozen
        if (this.isFrozen) {
            // Frozen inmates appear light blue with original color outline
            this.graphics.beginFill(webColorToHex(GameColors.inmateFrozen), 0.8);
            this.graphics.lineStyle(2, this.color, 0.8); // Original color outline
        } else {
            this.graphics.beginFill(this.color);
        }
        
        this.graphics.drawCircle(0, 0, this.size);
        this.graphics.endFill();
        
        // Draw freeze timer if frozen
        if (this.isFrozen) {
            const elapsed = Date.now() - this.freezeStartTime;
            const progress = Math.min(elapsed / this.freezeDurationToCatch, 1.0);
            
            // Draw progress circle around inmate
            this.graphics.lineStyle(3, webColorToHex(GameColors.inmateTimer));
            this.graphics.arc(0, 0, this.size + 5, 0, progress * Math.PI * 2);
        }
        
        // Draw health indicator if damaged
        if (this.health < this.maxHealth) {
            this.graphics.lineStyle(2, webColorToHex(GameColors.inmateHealthBar));
            this.graphics.moveTo(-this.size, -this.size - 8);
            this.graphics.lineTo(-this.size + (this.size * 2 * (this.health / this.maxHealth)), -this.size - 8);
        }
        
        // Draw direction indicator only if not frozen
        if (!this.isFrozen) {
            const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
            const indicatorLength = this.size + 3;
            
            this.graphics.lineStyle(2, webColorToHex(GameColors.inmateDirection));
            this.graphics.moveTo(0, 0);
            this.graphics.lineTo(
                Math.cos(angle) * indicatorLength,
                Math.sin(angle) * indicatorLength
            );
        }
        
        // Update container position
        this.container.x = this.x;
        this.container.y = this.y;
    }

    public update(): void {
        // Don't move if frozen or captured
        if (this.isFrozen || this.isCaptured) {
            this.draw(); // Still update visual appearance
            return;
        }

        // Move towards current target waypoint
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            // Move towards target
            const moveX = (dx / distance) * this.speed;
            const moveY = (dy / distance) * this.speed;
            
            this.x += moveX;
            this.y += moveY;
        } else {
            // Reached waypoint, move to next one
            this.currentWaypointIndex++;
            
            if (this.currentWaypointIndex >= this.waypoints.length) {
                // Reached the exit
                this.hasReachedExitFlag = true;
            } else {
                // Set new target
                this.targetX = this.waypoints[this.currentWaypointIndex].x;
                this.targetY = this.waypoints[this.currentWaypointIndex].y;
            }
        }
        
        this.draw();
    }

    public takeDamage(damage: number = 1): boolean {
        this.health -= damage;
        if (this.health <= 0) {
            return true; // Inmate is caught/eliminated
        }
        return false;
    }

    public hasReachedExit(): boolean {
        return this.hasReachedExitFlag;
    }

    public getPosition(): Position {
        return { x: this.x, y: this.y };
    }

    public getType(): InmateType {
        return this.type;
    }

    public getId(): string {
        return this.id;
    }

    public getHealth(): number {
        return this.health;
    }

    public getMaxHealth(): number {
        return this.maxHealth;
    }

    public getSpeed(): number {
        return this.speed;
    }

    public freeze(): void {
        if (!this.isFrozen) {
            this.isFrozen = true;
            this.freezeStartTime = Date.now();
        }
    }

    public unfreeze(): void {
        this.isFrozen = false;
        this.freezeStartTime = 0;
    }

    public isFrozenState(): boolean {
        return this.isFrozen;
    }

    public canBeCaught(): boolean {
        if (!this.isFrozen) return false;
        return (Date.now() - this.freezeStartTime) >= this.freezeDurationToCatch;
    }

    public setTarget(x: number, y: number): void {
        this.targetX = x;
        this.targetY = y;
    }

    public setCaptured(captured: boolean): void {
        this.isCaptured = captured;
        if (captured) {
            this.unfreeze(); // Unfreeze when captured
        }
    }

    public isCapturedState(): boolean {
        return this.isCaptured;
    }

    public getSize(): number {
        return this.size;
    }
}