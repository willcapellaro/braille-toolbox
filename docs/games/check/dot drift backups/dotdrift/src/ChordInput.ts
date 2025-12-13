// ===========================================
// CHORD CONFIGURATION - Edit these mappings
// ===========================================

interface ChordConfig {
  [direction: string]: string[];
}

const CHORD_MAPPINGS: ChordConfig = {
  'north': ['s', 'f', 'j', 'k'],
  'east': ['f', 'k'], 
  'west': ['d', 'j', 'k', 'l'],
  'south': ['j', 'd', 'j']
};

// Debounce timing (milliseconds)
const RELEASE_DEBOUNCE_MS = 50;

// ===========================================
// CHORD INPUT SYSTEM
// ===========================================

export type ChordDirection = 'north' | 'east' | 'west' | 'south';

export interface ChordInputEvent {
  direction: ChordDirection;
  keys: string[];
  timestamp: number;
}

export class ChordInput {
  private keysDown: Set<string> = new Set();
  private releaseTimer: number | null = null;
  private onChordCallback: ((event: ChordInputEvent) => void) | null = null;
  private isEnabled: boolean = true;

  constructor() {
    this.setupEventListeners();
  }

  // Set callback for chord events
  onChord(callback: (event: ChordInputEvent) => void): void {
    this.onChordCallback = callback;
  }

  // Enable/disable chord input
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.keysDown.clear();
      this.clearReleaseTimer();
    }
  }

  // Get current keys that are pressed
  getCurrentKeys(): string[] {
    return Array.from(this.keysDown);
  }

  // Check if any keys are currently pressed
  hasKeysDown(): boolean {
    return this.keysDown.size > 0;
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    // Clear keys when window loses focus
    window.addEventListener('blur', () => {
      this.keysDown.clear();
      this.clearReleaseTimer();
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    const key = event.key.toLowerCase();
    
    // Only track keys that are part of our chord system
    if (this.isChordKey(key)) {
      event.preventDefault();
      this.keysDown.add(key);
      
      // Cancel any pending release timer when new keys are pressed
      this.clearReleaseTimer();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    const key = event.key.toLowerCase();
    
    if (this.keysDown.has(key)) {
      event.preventDefault();
      this.keysDown.delete(key);
      
      // Start release timer when keys are released
      this.startReleaseTimer();
    }
  }

  private isChordKey(key: string): boolean {
    return Object.values(CHORD_MAPPINGS).some(chord => chord.includes(key));
  }

  private startReleaseTimer(): void {
    this.clearReleaseTimer();
    
    this.releaseTimer = window.setTimeout(() => {
      // Only process if we had keys down and they're now released
      if (this.keysDown.size === 0) {
        this.processChordRelease();
      }
    }, RELEASE_DEBOUNCE_MS);
  }

  private clearReleaseTimer(): void {
    if (this.releaseTimer !== null) {
      clearTimeout(this.releaseTimer);
      this.releaseTimer = null;
    }
  }

  private processChordRelease(): void {
    // We need to check against the keys that were just released
    // Since keysDown is now empty, we need to track what was pressed
    // Let's modify our approach to track the last pressed keys
  }

  // Updated approach with proper state tracking
  private lastPressedKeys: string[] = [];

  private handleKeyDownUpdated(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    const key = event.key.toLowerCase();
    
    if (this.isChordKey(key)) {
      event.preventDefault();
      
      if (!this.keysDown.has(key)) {
        this.keysDown.add(key);
        this.lastPressedKeys = Array.from(this.keysDown);
      }
      
      this.clearReleaseTimer();
    }
  }

  private handleKeyUpUpdated(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    const key = event.key.toLowerCase();
    
    if (this.keysDown.has(key)) {
      event.preventDefault();
      this.keysDown.delete(key);
      
      // When all keys are released, start the debounce timer
      if (this.keysDown.size === 0 && this.lastPressedKeys.length > 0) {
        this.startReleaseTimer();
      }
    }
  }

  private processChordReleaseUpdated(): void {
    if (this.lastPressedKeys.length === 0) return;

    // Check if the released keys match any chord pattern
    const direction = this.matchChord(this.lastPressedKeys);
    
    if (direction && this.onChordCallback) {
      const event: ChordInputEvent = {
        direction,
        keys: [...this.lastPressedKeys],
        timestamp: Date.now()
      };
      
      this.onChordCallback(event);
    }

    // Reset for next chord
    this.lastPressedKeys = [];
  }

  private matchChord(keys: string[]): ChordDirection | null {
    const keySet = new Set(keys);
    
    for (const [direction, requiredKeys] of Object.entries(CHORD_MAPPINGS)) {
      // Check if the pressed keys exactly match the required keys
      if (requiredKeys.length === keySet.size && 
          requiredKeys.every(key => keySet.has(key))) {
        return direction as ChordDirection;
      }
    }
    
    return null;
  }

  // Override the original event handlers with updated versions
  private setupEventListenersUpdated(): void {
    document.addEventListener('keydown', this.handleKeyDownUpdated.bind(this));
    document.addEventListener('keyup', this.handleKeyUpUpdated.bind(this));
    
    window.addEventListener('blur', () => {
      this.keysDown.clear();
      this.lastPressedKeys = [];
      this.clearReleaseTimer();
    });
  }

  // Update release timer to use updated method
  private startReleaseTimerUpdated(): void {
    this.clearReleaseTimer();
    
    this.releaseTimer = window.setTimeout(() => {
      this.processChordReleaseUpdated();
    }, RELEASE_DEBOUNCE_MS);
  }

  // Public method to get chord mappings for display
  getChordMappings(): ChordConfig {
    return { ...CHORD_MAPPINGS };
  }
  
  // Public method to get a formatted string of a chord
  getChordString(direction: ChordDirection): string {
    const keys = CHORD_MAPPINGS[direction];
    return keys ? keys.map(k => k.toUpperCase()).join('+') : '';
  }

  // Clean up method
  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDownUpdated.bind(this));
    document.removeEventListener('keyup', this.handleKeyUpUpdated.bind(this));
    this.clearReleaseTimer();
    this.keysDown.clear();
    this.lastPressedKeys = [];
    this.onChordCallback = null;
  }
}

// Let's clean this up and use the updated approach properly
export class ChordInputSystem {
  private keysDown: Set<string> = new Set();
  private lastChordKeys: string[] = [];
  private releaseTimer: number | null = null;
  private onChordCallback: ((event: ChordInputEvent) => void) | null = null;
  private isEnabled: boolean = true;
  private getDebounceAmount: (() => number) | null = null;

  constructor() {
    this.setupEventListeners();
  }

  // Set a function to get the current debounce amount
  setDebounceProvider(provider: () => number): void {
    this.getDebounceAmount = provider;
  }

  onChord(callback: (event: ChordInputEvent) => void): void {
    this.onChordCallback = callback;
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.reset();
    }
  }

  getCurrentKeys(): string[] {
    return Array.from(this.keysDown);
  }

  hasKeysDown(): boolean {
    return this.keysDown.size > 0;
  }

  getChordMappings(): ChordConfig {
    return { ...CHORD_MAPPINGS };
  }
  
  getChordString(direction: ChordDirection): string {
    const keys = CHORD_MAPPINGS[direction];
    return keys ? keys.map(k => k.toUpperCase()).join('+') : '';
  }

  private setupEventListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    
    window.addEventListener('blur', () => {
      this.reset();
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    const key = event.key.toLowerCase();
    
    if (this.isChordKey(key)) {
      event.preventDefault();
      
      if (!this.keysDown.has(key)) {
        this.keysDown.add(key);
        this.lastChordKeys = Array.from(this.keysDown);
      }
      
      this.clearReleaseTimer();
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    const key = event.key.toLowerCase();
    
    if (this.keysDown.has(key)) {
      event.preventDefault();
      this.keysDown.delete(key);
      
      // When all keys are released, start the debounce timer
      if (this.keysDown.size === 0 && this.lastChordKeys.length > 0) {
        this.startReleaseTimer();
      }
    }
  }

  private isChordKey(key: string): boolean {
    return Object.values(CHORD_MAPPINGS).some(chord => chord.includes(key));
  }

  private startReleaseTimer(): void {
    this.clearReleaseTimer();
    
    const debounceMs = this.getDebounceAmount ? this.getDebounceAmount() : RELEASE_DEBOUNCE_MS;
    
    this.releaseTimer = window.setTimeout(() => {
      this.processChordRelease();
    }, debounceMs);
  }

  private clearReleaseTimer(): void {
    if (this.releaseTimer !== null) {
      clearTimeout(this.releaseTimer);
      this.releaseTimer = null;
    }
  }

  private processChordRelease(): void {
    if (this.lastChordKeys.length === 0) return;

    const direction = this.matchChord(this.lastChordKeys);
    
    if (direction && this.onChordCallback) {
      const event: ChordInputEvent = {
        direction,
        keys: [...this.lastChordKeys],
        timestamp: Date.now()
      };
      
      this.onChordCallback(event);
    }

    this.lastChordKeys = [];
  }

  private matchChord(keys: string[]): ChordDirection | null {
    const keySet = new Set(keys);
    
    for (const [direction, requiredKeys] of Object.entries(CHORD_MAPPINGS)) {
      if (requiredKeys.length === keySet.size && 
          requiredKeys.every(key => keySet.has(key))) {
        return direction as ChordDirection;
      }
    }
    
    return null;
  }

  private reset(): void {
    this.keysDown.clear();
    this.lastChordKeys = [];
    this.clearReleaseTimer();
  }

  destroy(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.clearReleaseTimer();
    this.reset();
    this.onChordCallback = null;
  }
}