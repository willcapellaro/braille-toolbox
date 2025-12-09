export type BrailleCharacter = {
  id: string;
  dots: string; // Binary representation of the braille dots
  character: string; // Corresponding character for the braille representation
};

export type BraillePattern = {
  id: string;
  pattern: BrailleCharacter[];
};

export type Contraction = {
  id: string;
  contraction: string; // Braille contraction
  meaning: string; // Meaning of the contraction
};

export type DotDecoderContent = {
  pattern: string; // Binary pattern
  meaning: string; // Meaning of the pattern
};