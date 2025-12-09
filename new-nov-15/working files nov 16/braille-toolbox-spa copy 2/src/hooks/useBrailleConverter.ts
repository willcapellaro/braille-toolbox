import { useState, useCallback } from 'react';
import { convertTextToBraille, convertBrailleToText } from '../utils/brailleConverter';

const useBrailleConverter = () => {
    const [brailleOutput, setBrailleOutput] = useState('');
    const [textOutput, setTextOutput] = useState('');

    const convertToBraille = useCallback((inputText: string) => {
        const convertedBraille = convertTextToBraille(inputText);
        setBrailleOutput(convertedBraille);
        return convertedBraille;
    }, []);

    const convertToText = useCallback((inputBraille: string) => {
        const convertedText = convertBrailleToText(inputBraille);
        setTextOutput(convertedText);
        return convertedText;
    }, []);

    const reset = useCallback(() => {
        setBrailleOutput('');
        setTextOutput('');
    }, []);

    return {
        brailleOutput,
        textOutput,
        convertToBraille,
        convertToText,
        reset,
    };
};

export default useBrailleConverter;