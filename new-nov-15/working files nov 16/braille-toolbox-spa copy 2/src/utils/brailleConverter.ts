// Braille conversion utilities ported from original braille.js
interface BrailleCharMapping {
  [key: string]: string;
}

const brailleCharMappings: BrailleCharMapping = {
  'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑', 'f': '⠋',
  'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚', 'k': '⠅', 'l': '⠇',
  'm': '⠍', 'n': '⠝', 'o': '⠕', 'p': '⠏', 'q': '⠟', 'r': '⠗',
  's': '⠎', 't': '⠞', 'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭',
  'y': '⠽', 'z': '⠵',
  '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉', '4': '⠼⠙', '5': '⠼⠑',
  '6': '⠼⠋', '7': '⠼⠛', '8': '⠼⠓', '9': '⠼⠊', '0': '⠼⠚',
  ' ': '⠀', '.': '⠲', ',': '⠂', '?': '⠦', '!': '⠖', ':': '⠒',
  ';': '⠆', '-': '⠤', '"': '⠦', "'": '⠄'
};

const BrCharHelper = (character: string, alt: string): string => {
  return `<span class="braille-char" data-char="${character}" aria-label="${alt}">${brailleCharMappings[character] || character}</span>`;
};

export const convertTextToBraille = (message: string): string => {
  if (!message) return '';
  
  let result = '';
  let prevCharNum = false;
  let inQuote = false;

  for (let i = 0; i < message.length; i++) {
    const myChar = message.charAt(i);
    
    if (myChar >= 'a' && myChar <= 'z') {
      // a to z
      result += BrCharHelper(myChar, myChar);
      prevCharNum = false;
    } else if (myChar >= 'A' && myChar <= 'Z') {
      // A to Z - add capital sign
      result += BrCharHelper('cap', 'Capital') + BrCharHelper(myChar.toLowerCase(), myChar);
      prevCharNum = false;
    } else if (myChar > '0' && myChar <= '9') {
      if (!prevCharNum) {
        result += BrCharHelper('num', 'Number');
      }
      // Numbers use the same patterns as letters a-j
      const numberMap: { [key: string]: string } = {
        '1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e',
        '6': 'f', '7': 'g', '8': 'h', '9': 'i', '0': 'j'
      };
      result += BrCharHelper(numberMap[myChar], myChar);
      prevCharNum = true;
    } else {
      switch (myChar) {
        case ' ':
          result += BrCharHelper(' ', 'Space');
          prevCharNum = false;
          break;
        case '0':
          if (!prevCharNum) {
            result += BrCharHelper('num', 'Number');
          }
          result += BrCharHelper('j', '0');
          prevCharNum = true;
          break;
        case '\n':
          result += '<br>';
          prevCharNum = false;
          break;
        case '.':
          if (prevCharNum) {
            result += BrCharHelper('dec', '.');
          } else {
            result += BrCharHelper('.', 'Period');
          }
          prevCharNum = false;
          break;
        case ',':
          result += BrCharHelper(',', 'Comma');
          prevCharNum = false;
          break;
        case '?':
          result += BrCharHelper('?', 'Question mark');
          prevCharNum = false;
          break;
        case '!':
          result += BrCharHelper('!', 'Exclamation mark');
          prevCharNum = false;
          break;
        case '"':
          if (!inQuote) {
            result += BrCharHelper('open-quote', 'Open quote');
            inQuote = true;
          } else {
            result += BrCharHelper('close-quote', 'Close quote');
            inQuote = false;
          }
          prevCharNum = false;
          break;
        default:
          result += myChar;
          prevCharNum = false;
      }
    }
  }

  return result;
};

export const convertBrailleToText = (braille: string): string => {
  // Implement reverse conversion if needed
  const reverseMappings: { [key: string]: string } = {};
  Object.entries(brailleCharMappings).forEach(([text, brailleChar]) => {
    reverseMappings[brailleChar] = text;
  });
  
  let result = '';
  for (const char of braille) {
    result += reverseMappings[char] || char;
  }
  
  return result;
};

export const getContractionMeaning = (braille: string): string => {
  // This would map braille contractions to their meanings
  const contractions: { [key: string]: string } = {
    '⠁': 'a (also "and" in some contexts)',
    '⠃': 'b (also "but" as a word)',
    '⠋': 'f (also "from" as a word)',
    '⠞': 't (also "the" when followed by ⠓)',
    // Add more contractions as needed
  };
  
  return contractions[braille] || '';
};