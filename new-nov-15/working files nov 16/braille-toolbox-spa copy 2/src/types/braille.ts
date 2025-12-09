export type BrailleCharacter = {
    dots: string; // Binary representation of the braille character (e.g., "100000")
    character: string; // The corresponding character (e.g., "a", "b", "c")
    description?: string; // Optional description or meaning of the character
};

export type BraillePattern = {
    pattern: string; // The braille pattern as a string of dots
    meaning: string; // The meaning or corresponding text for the pattern
};

export type BrailleContraction = {
    contraction: string; // The braille contraction
    meaning: string; // The meaning of the contraction
};