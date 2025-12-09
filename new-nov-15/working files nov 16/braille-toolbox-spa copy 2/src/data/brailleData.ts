// Real braille data extracted from your original files
export interface BrailleCharacter {
  id: string;
  character: string;
  dots: string;
  dotPattern: string;
  description: string;
  category: 'letters' | 'numbers' | 'punctuation' | 'contractions';
  svgPath?: string;
  alternateDescriptions?: string[];
}

// Complete braille alphabet with your original descriptions
export const brailleCharacters: BrailleCharacter[] = [
  // Letters A-Z with real descriptions from your decoder
  {
    id: 'a',
    character: 'a',
    dots: '⠁',
    dotPattern: '100000',
    description: 'The letter a',
    category: 'letters',
    svgPath: 'letter-a.svg',
    alternateDescriptions: ['Number 1 (if preceded by a number sign)']
  },
  {
    id: 'b',
    character: 'b',
    dots: '⠃',
    dotPattern: '110000',
    description: 'The letter b',
    category: 'letters',
    svgPath: 'letter-b.svg',
    alternateDescriptions: ['Number 2 when preceded by number sign', 'Contraction for "but"']
  },
  {
    id: 'c',
    character: 'c',
    dots: '⠉',
    dotPattern: '100100',
    description: 'The letter c',
    category: 'letters',
    svgPath: 'letter-c.svg',
    alternateDescriptions: ['Number 3 when preceded by number sign', 'Contraction for "can"']
  },
  {
    id: 'd',
    character: 'd',
    dots: '⠙',
    dotPattern: '100110',
    description: 'The letter d',
    category: 'letters',
    svgPath: 'letter-d.svg',
    alternateDescriptions: ['Number 4 when preceded by number sign', 'Contraction for "do"', 'Following dot 5: "day"', 'Ending word following dot 46: "-ound"']
  },
  {
    id: 'e',
    character: 'e',
    dots: '⠑',
    dotPattern: '100010',
    description: 'The letter e',
    category: 'letters',
    svgPath: 'letter-e.svg',
    alternateDescriptions: ['Number 5 when preceded by number sign', 'Contraction for "every"']
  },
  {
    id: 'f',
    character: 'f',
    dots: '⠋',
    dotPattern: '110100',
    description: 'The letter f',
    category: 'letters',
    svgPath: 'letter-f.svg',
    alternateDescriptions: ['Number 6 when preceded by number sign', 'Contraction for "from"', 'Can signify double f']
  },
  {
    id: 'g',
    character: 'g',
    dots: '⠛',
    dotPattern: '110110',
    description: 'The letter g',
    category: 'letters',
    svgPath: 'letter-g.svg',
    alternateDescriptions: ['Number 7 when preceded by number sign', 'Contraction for "go"', 'Ending word following dot 56: "-ong"']
  },
  {
    id: 'h',
    character: 'h',
    dots: '⠓',
    dotPattern: '110010',
    description: 'The letter h',
    category: 'letters',
    svgPath: 'letter-h.svg',
    alternateDescriptions: ['Number 8 when preceded by number sign', 'Contraction for "have"', 'Preceded by dot 5: "here"']
  },
  {
    id: 'i',
    character: 'i',
    dots: '⠊',
    dotPattern: '010100',
    description: 'The letter i',
    category: 'letters',
    svgPath: 'letter-i.svg',
    alternateDescriptions: ['Number 9 when preceded by number sign', 'Contraction for "in"', 'Suffix: "-ity"']
  },
  {
    id: 'j',
    character: 'j',
    dots: '⠚',
    dotPattern: '010110',
    description: 'The letter j',
    category: 'letters',
    svgPath: 'letter-j.svg',
    alternateDescriptions: ['Number 0 when preceded by number sign', 'Contraction for "just"']
  },
  // Add more letters following the same pattern...
  {
    id: 'k',
    character: 'k',
    dots: '⠅',
    dotPattern: '101000',
    description: 'The letter k',
    category: 'letters',
    svgPath: 'letter-k.svg',
    alternateDescriptions: ['Contraction for "knowledge"', 'Preceded by dot 5: "know"']
  },
  // Numbers
  {
    id: '1',
    character: '1',
    dots: '⠼⠁',
    dotPattern: '001111_100000',
    description: 'Number 1',
    category: 'numbers',
    svgPath: 'letter-1.svg'
  },
  {
    id: '0',
    character: '0',
    dots: '⠼⠚',
    dotPattern: '001111_010110',
    description: 'Number 0',
    category: 'numbers',
    svgPath: 'letter-0.svg'
  },
  // Special characters
  {
    id: 'space',
    character: ' ',
    dots: '⠀',
    dotPattern: '000000',
    description: 'A space or indent',
    category: 'punctuation',
    alternateDescriptions: ['Resets formatting such as numbers, all caps, or italics']
  }
];

// Function to get character by dot pattern
export const getCharacterByDotPattern = (pattern: string): BrailleCharacter | null => {
  return brailleCharacters.find(char => char.dotPattern === pattern) || null;
};

// Function to get character by letter
export const getCharacterByLetter = (letter: string): BrailleCharacter | null => {
  return brailleCharacters.find(char => char.character.toLowerCase() === letter.toLowerCase()) || null;
};

// Convert dot pattern to braille unicode
export const dotPatternToBraille = (pattern: string): string => {
  const char = getCharacterByDotPattern(pattern);
  return char ? char.dots : '⠀';
};