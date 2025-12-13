export interface GameState {
    score: number;
    lives: number;
    level: number;
    isPlaying: boolean;
    isPaused: boolean;
}
export interface Position {
    x: number;
    y: number;
}
export interface InmateState {
    id: string;
    position: Position;
    targetPosition: Position;
    speed: number;
    isEscaping: boolean;
    isCaught: boolean;
    health: number;
}
export interface SpotlightState {
    position: Position;
    targetPosition: Position;
    radius: number;
    intensity: number;
    isActive: boolean;
    boostActive: boolean;
    boostCooldown: number;
}
export declare enum InmateType {
    REGULAR = "regular",
    FAST = "fast",
    STRONG = "strong",
    SNEAKY = "sneaky"
}
export declare enum GameEvent {
    INMATE_ESCAPED = "inmate_escaped",
    INMATE_CAUGHT = "inmate_caught",
    LEVEL_COMPLETE = "level_complete",
    GAME_OVER = "game_over",
    SPOTLIGHT_BOOST = "spotlight_boost"
}
