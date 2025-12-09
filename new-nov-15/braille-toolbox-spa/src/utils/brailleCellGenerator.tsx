/**
 * Dynamic Braille Cell Generator
 * Uses the master SVG template to create braille characters on demand
 */

import React from 'react';

// Type definitions
type OutlineBoxSetting = 'off' | 'solid-light' | 'solid-dark' | 'outline-light' | 'outline-dark';
type GhostDotsSetting = 'off' | 'dot-light' | 'dot-dark' | 'outline-light' | 'outline-dark';

// Braille cell dimensions and structure from your master SVG
const BRAILLE_CELL_CONFIG = {
  width: 46,
  height: 70,
  dots: {
    1: { cx: 12, cy: 11, r: 7 },
    2: { cx: 12, cy: 34, r: 7 },
    3: { cx: 12, cy: 57, r: 7 },
    4: { cx: 33, cy: 11, r: 7 },
    5: { cx: 33, cy: 34, r: 7 },
    6: { cx: 33, cy: 57, r: 7 }
  }
};

// Enhanced options for braille cell display
interface BrailleCellOptions {
  fillColor?: string;
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  title?: string;
  outlineBox?: OutlineBoxSetting;
  ghostDots?: GhostDotsSetting;
  dotShadow?: boolean;
  padding?: number;
}

// Extended options for the SVG generation function
interface ExtendedBrailleCellOptions extends BrailleCellOptions {
  outlineBox: OutlineBoxSetting;
  ghostDots: GhostDotsSetting;
  dotShadow: boolean;
}

/**
 * Convert 6-digit dot pattern to array of active dots
 * @param pattern - String like "100000" or "110100"
 * @returns Array of dot numbers that should be filled
 */
export const patternToActiveDots = (pattern: string): number[] => {
  const activeDots: number[] = [];
  for (let i = 0; i < 6; i++) {
    if (pattern[i] === '1') {
      activeDots.push(i + 1);
    }
  }
  return activeDots;
};

/**
 * Generate SVG string for a braille character
 * @param pattern - 6-digit pattern like "100000"
 * @param options - Styling options
 * @returns Complete SVG string
 */
export const generateBrailleSVG = (
  pattern: string, 
  options: BrailleCellOptions | ExtendedBrailleCellOptions = {}
): string => {
  const {
    fillColor = '#222',
    backgroundColor = 'transparent',
    size = 'medium',
    className = '',
    title = `Braille pattern ${pattern}`,
    outlineBox = 'off',
    ghostDots = 'off',
    dotShadow = false,
    padding = 8
  } = options;

  // Size multipliers
  const sizeMultipliers = {
    small: 0.7,
    medium: 1.0,
    large: 1.4
  };
  const multiplier = sizeMultipliers[size];
  
  const width = BRAILLE_CELL_CONFIG.width * multiplier + (padding * 2);
  const height = BRAILLE_CELL_CONFIG.height * multiplier + (padding * 2);

  const activeDots = patternToActiveDots(pattern);

  // Generate elements for dots (including ghost dots, shadows, etc.)
  const dotElements = Array.from({ length: 6 }, (_, i) => {
    const dotNumber = i + 1;
    const isActive = activeDots.includes(dotNumber);
    const dot = BRAILLE_CELL_CONFIG.dots[dotNumber as keyof typeof BRAILLE_CELL_CONFIG.dots];
    
    const cx = dot.cx * multiplier + padding;
    const cy = dot.cy * multiplier + padding;
    const r = dot.r * multiplier;
    
    let elements = '';

    // Shadow effect
    if (dotShadow && isActive) {
      elements += `<circle cx="${cx + 1}" cy="${cy + 1}" r="${r}" fill="rgba(0,0,0,0.2)" />`;
    }

    // Ghost dots (show all possible dot positions)
    if (ghostDots !== 'off' && !isActive) {
      const ghostColor = ghostDots.includes('light') ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)';
      const ghostFill = ghostDots.includes('dot') ? ghostColor : 'none';
      const ghostStroke = ghostDots.includes('outline') ? ghostColor : 'none';
      
      elements += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${ghostFill}" stroke="${ghostStroke}" stroke-width="1" />`;
    }

    // Active dot
    if (isActive) {
      elements += `<circle id="${dotNumber}" fill="${fillColor}" cx="${cx}" cy="${cy}" r="${r}" />`;
    }

    return elements;
  }).join('\\n        ');

  // Outline box
  let outlineElement = '';
  if (outlineBox !== 'off') {
    const boxPadding = 2;
    const boxX = padding - boxPadding;
    const boxY = padding - boxPadding;
    const boxWidth = BRAILLE_CELL_CONFIG.width * multiplier + (boxPadding * 2);
    const boxHeight = BRAILLE_CELL_CONFIG.height * multiplier + (boxPadding * 2);
    
    const strokeColor = outlineBox.includes('light') ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)';
    const fillColor = outlineBox.includes('solid') ? 'rgba(0,0,0,0.05)' : 'none';
    
    outlineElement = `<rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" fill="${fillColor}" stroke="${strokeColor}" stroke-width="1" rx="2" />`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}px" height="${height}px" viewBox="0 0 ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="${className}">
    <title>${title}</title>
    <g id="braille-cell" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
        ${outlineElement}
        ${dotElements}
    </g>
</svg>`;
};

/**
 * React component that renders a dynamic braille character with settings
 */
export const DynamicBrailleCell: React.FC<{
  pattern: string;
  character?: string;
  size?: 'small' | 'medium' | 'large';
  fillColor?: string;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
  padding?: number;
  useSettings?: boolean; // Whether to use global settings
}> = ({ 
  pattern, 
  character, 
  size = 'medium', 
  fillColor, 
  backgroundColor = 'transparent',
  className = '',
  style = {},
  padding = 8,
  useSettings = true
}) => {
  // Default settings - will be enhanced with context integration later
  const settings: any = {};
  
  const effectiveFillColor = fillColor || (settings?.primaryHue ? 
    `hsl(${settings.primaryHue}, 80%, 50%)` : '#6200ea');
  
  const svgContent = generateBrailleSVG(pattern, {
    fillColor: effectiveFillColor,
    backgroundColor,
    size,
    className,
    title: character ? `Braille ${character}: ${pattern}` : `Braille pattern ${pattern}`,
    outlineBox: settings?.outlineBox || 'off',
    ghostDots: settings?.ghostDots || 'off',
    dotShadow: settings?.dotShadow || false,
    padding
  } as ExtendedBrailleCellOptions);

  return (
    <div 
      className={`braille-cell ${className}`}
      style={{
        display: 'inline-block',
        lineHeight: 0,
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      aria-label={character ? `Braille character ${character}` : `Braille pattern ${pattern}`}
    />
  );
};

/**
 * Create a data URL for use in img src
 * @param pattern - 6-digit pattern
 * @param options - Styling options
 * @returns Data URL string
 */
export const generateBrailleDataURL = (
  pattern: string, 
  options: BrailleCellOptions = {}
): string => {
  const svgContent = generateBrailleSVG(pattern, options);
  const encoded = btoa(unescape(encodeURIComponent(svgContent)));
  return `data:image/svg+xml;base64,${encoded}`;
};

/**
 * Utility: Get braille pattern from Unicode character
 * @param brailleChar - Unicode braille character like '⠁'
 * @returns 6-digit pattern string
 */
export const unicodeToDotPattern = (brailleChar: string): string => {
  if (brailleChar.length !== 1) return '000000';
  
  const codePoint = brailleChar.codePointAt(0);
  if (!codePoint || codePoint < 0x2800 || codePoint > 0x28FF) return '000000';
  
  const pattern = codePoint - 0x2800;
  
  // Convert to 6-digit binary pattern (braille dots 1-6)
  const dots = [];
  dots[0] = (pattern & 0x01) ? '1' : '0'; // dot 1
  dots[1] = (pattern & 0x02) ? '1' : '0'; // dot 2  
  dots[2] = (pattern & 0x04) ? '1' : '0'; // dot 3
  dots[3] = (pattern & 0x08) ? '1' : '0'; // dot 4
  dots[4] = (pattern & 0x10) ? '1' : '0'; // dot 5
  dots[5] = (pattern & 0x20) ? '1' : '0'; // dot 6
  
  return dots.join('');
};

/**
 * Utility: Convert dot pattern to Unicode braille character
 * @param pattern - 6-digit pattern like "100000"
 * @returns Unicode braille character
 */
export const dotPatternToUnicode = (pattern: string): string => {
  if (pattern.length !== 6) return '⠀';
  
  let codePoint = 0x2800;
  
  // Convert pattern to braille unicode offset
  if (pattern[0] === '1') codePoint |= 0x01; // dot 1
  if (pattern[1] === '1') codePoint |= 0x02; // dot 2
  if (pattern[2] === '1') codePoint |= 0x04; // dot 3
  if (pattern[3] === '1') codePoint |= 0x08; // dot 4
  if (pattern[4] === '1') codePoint |= 0x10; // dot 5
  if (pattern[5] === '1') codePoint |= 0x20; // dot 6
  
  return String.fromCodePoint(codePoint);
};

