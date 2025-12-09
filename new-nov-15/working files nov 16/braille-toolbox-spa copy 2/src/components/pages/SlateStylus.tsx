import React from 'react';
import { useState } from 'react';
import BrailleCell from '../common/BrailleCell';

const SlateStylus: React.FC = () => {
    const [isFlipped, setIsFlipped] = useState(false);

    const toggleFlip = () => {
        setIsFlipped(prev => !prev);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-2xl font-bold mb-4">Slate & Stylus</h1>
            <p className="mb-4">
                This page provides a reference for using a slate and stylus to write braille.
                Click the button below to toggle the orientation of the braille cell.
            </p>
            <button 
                onClick={toggleFlip} 
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                {isFlipped ? 'Show Normal' : 'Flip Braille'}
            </button>
            <BrailleCell isFlipped={isFlipped} />
            <div className="mt-4">
                <p>Use the slate and stylus to create braille characters by pressing dots into the paper.</p>
                <p>Refer to the braille patterns for guidance on which dots to press.</p>
            </div>
        </div>
    );
};

export default SlateStylus;