import { Container } from 'pixi.js';
import { Position } from './types';
export declare class Spotlight {
    container: Container;
    private graphics;
    private lightCone;
    x: number;
    y: number;
    private targetX;
    private targetY;
    private radius;
    private baseRadius;
    private intensity;
    private rotationSpeed;
    private isStationary;
    private isActiveState;
    private boostActive;
    private boostDuration;
    private boostCooldown;
    private lastBoostTime;
    private boostStartTime;
    constructor(x: number, y: number, radius: number);
    private draw;
    setTarget(x: number, y: number): void;
    update(): void;
    activateBoost(): void;
    private deactivateBoost;
    isInmateCaught(inmate: {
        x: number;
        y: number;
    }): boolean;
    setStationary(stationary: boolean): void;
    setActive(active: boolean): void;
    isActive(): boolean;
    getPosition(): Position;
    getRadius(): number;
    isBoostActive(): boolean;
    getBoostCooldownRemaining(): number;
}
