// Centralized color configuration using web color names
// Edit all game colors here in one place

export const GameColors = {
    // Background and UI
    background: 'black',           // Main game background
    canvasBorder: 'white',            // Canvas border color
    uiText: 'yellow',                   // Score, lives, level text
    keyLabels: 'yellow',                // Spotlight key number labels
    gameOver: 'magenta',                 // Game over text
    
    // Spotlights
    spotlightBase: 'grey',         // Spotlight base circle
    spotlightActive: 'cyan',          // Active spotlight center
    spotlightInactive: 'brown',         // Inactive spotlight center  
    spotlightBeam: 'dodgerblue',            // Spotlight light cone
    spotlightBoost: 'blue',            // Boost effect color
    spotlightBeamLine: 'tan',         // Direction indicator line
    
    // Inmates
    inmateRegular: 'orange',           // Regular inmate color
    inmateFast: 'magenta',            // Fast inmate color
    inmateStrong: 'cyan',             // Strong inmate color
    inmateSneaky: 'lime',             // Sneaky inmate color
    inmateFrozen: 'lightblue',        // Frozen state fill
    inmateDirection: 'orange',         // Direction arrow
    inmateHealthBar: 'red',           // Health indicator
    inmateTimer: 'red',               // Freeze timer ring
    
    // Policemen
    policeman: 'blue',                // Policeman color
    policemanDirection: 'lightblue',  // Policeman direction arrow
    policemanVision: 'lightblue',     // Vision range circle
    dropOffZone: 'darkgreen',         // Drop-off zone box
    
    // Battery System
    batteryHigh: 'green',            // Battery level > 60%
    batteryMedium: 'yellow',         // Battery level 30-60%
    batteryLow: 'red',               // Battery level < 30%
    batteryBackground: 'darkgray',   // Battery meter background
    
    // HTML/CSS Colors
    htmlBackground: 'purple',       // HTML body background
    htmlText: 'purple',                 // HTML text color
    htmlBorder: 'silver',              // HTML borders
    instructionsBackground: 'brown', // Instructions box
    instructionsTitle: 'blue',         // Instructions title
};

// Helper function to convert web color names to hex for PIXI.js
export function webColorToHex(colorName: string): number {
    // Create a temporary element to get computed color
    const tempElement = document.createElement('div');
    tempElement.style.color = colorName;
    document.body.appendChild(tempElement);
    
    const computedColor = getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);
    
    // Parse RGB values and convert to hex
    const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);  
        const b = parseInt(rgbMatch[3]);
        return (r << 16) | (g << 8) | b;
    }
    
    // Fallback to white if parsing fails
    return 0xffffff;
}