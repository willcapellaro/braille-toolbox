import braillePatterns from '../data/braillePatterns.json';
import contractions from '../data/contractions.json';

const brailleService = {
    getBrailleCharacter: (input: string): string => {
        const brailleChar = braillePatterns[input];
        return brailleChar ? brailleChar : '';
    },

    getContraction: (input: string): string => {
        const contraction = contractions[input];
        return contraction ? contraction : '';
    },

    convertTextToBraille: (text: string): string => {
        return text.split('').map(char => {
            return brailleService.getBrailleCharacter(char) || char;
        }).join('');
    },

    convertBrailleToText: (braille: string): string => {
        // Implement reverse conversion logic if needed
        return '';
    },

    getAllBraillePatterns: (): Record<string, string> => {
        return braillePatterns;
    },

    getAllContractions: (): Record<string, string> => {
        return contractions;
    }
};

export default brailleService;