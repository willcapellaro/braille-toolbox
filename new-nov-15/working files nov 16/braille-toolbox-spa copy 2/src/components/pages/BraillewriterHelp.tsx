import React from 'react';
import { Typography, Button, Paper } from '@mui/material';

const BraillewriterHelp: React.FC = () => {
    return (
        <div className="flex flex-col items-center p-4">
            <Paper elevation={3} className="p-6 w-full max-w-2xl">
                <Typography variant="h4" component="h1" gutterBottom>
                    Braillewriter Help
                </Typography>
                <Typography variant="body1" paragraph>
                    A braillewriter is a device used to write in braille. It consists of a keyboard with six keys that correspond to the six dots in a braille cell. 
                    This guide will help you understand how to use a braillewriter effectively.
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                    Getting Started
                </Typography>
                <Typography variant="body1" paragraph>
                    To begin using a braillewriter, follow these steps:
                </Typography>
                <ol className="list-decimal list-inside mb-4">
                    <li>Familiarize yourself with the layout of the keys.</li>
                    <li>Practice pressing the keys to create different braille characters.</li>
                    <li>Start with simple words and gradually move to more complex sentences.</li>
                </ol>
                <Typography variant="h6" component="h2" gutterBottom>
                    Tips for Effective Writing
                </Typography>
                <Typography variant="body1" paragraph>
                    Here are some tips to enhance your braille writing skills:
                </Typography>
                <ul className="list-disc list-inside mb-4">
                    <li>Keep your hands relaxed while typing.</li>
                    <li>Use consistent pressure on the keys to ensure clear dots.</li>
                    <li>Regularly practice to improve your speed and accuracy.</li>
                </ul>
                <Button variant="contained" color="primary" href="/write-in-braille">
                    Try Writing in Braille
                </Button>
            </Paper>
        </div>
    );
};

export default BraillewriterHelp;