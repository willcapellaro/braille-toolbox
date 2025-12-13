import * as THREE from 'three';
import { UIManager } from './uiManager.js';

// Initialize the game shell when the page loads
window.addEventListener('DOMContentLoaded', () => {
    try {
        const uiManager = new UIManager();
        
        // Make UI manager globally accessible for debugging
        window.uiManager = uiManager;
        
        console.log('AstroType game shell initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize AstroType game shell:', error);
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; 
                        background: #000; color: #fff; font-family: Arial, sans-serif; text-align: center;">
                <div>
                    <h1>🚀 AstroType</h1>
                    <p>Game initialization failed. Please refresh the page.</p>
                    <button onclick="location.reload()" 
                            style="background: #00ffff; color: #000; border: none; padding: 10px 20px; 
                                   border-radius: 5px; cursor: pointer; margin-top: 20px;">
                        Refresh
                    </button>
                </div>
            </div>
        `;
    }
});