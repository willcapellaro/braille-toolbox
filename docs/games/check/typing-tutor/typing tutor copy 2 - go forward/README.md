# Image Viewer

A modern, interactive image viewer with drag-and-drop functionality, view mode toggling, and a slide-out control panel.

## Features

- **Drag and Drop**: Drag any JPG or PNG image into the window to view it
- **View Modes**: Toggle between "fit" (contain) and "fill" (cover) view modes
- **Control Panel**: Slide-out panel for additional controls (ready for future features)
- **Smooth Animations**: All transitions are smoothly animated
- **Responsive**: Adapts to window size changes
- **No Scrolling**: Interface doesn't scroll, but images can be scrolled in fill mode

## Getting Started

### Option 1: Simple HTTP Server

```bash
npm start
```

This will start a local server at `http://localhost:8080`

### Option 2: Any Local Server

You can use any local web server to serve the files:
- Python: `python -m http.server 8080`
- Node.js: `npx http-server . -p 8080`
- VS Code: Use the "Live Server" extension

## Usage

1. **Load an Image**: 
   - Drag and drop a JPG or PNG file into the window
   - Or click the upload button (second button from top) to select a file

2. **Toggle View Mode**: 
   - Click the fit/fill toggle button (bottom button) to switch between:
     - **Fit Mode**: Image is contained within the viewport (no scrolling)
     - **Fill Mode**: Image fills the viewport (scrollable if larger)

3. **Open Control Panel**: 
   - Click the left caret button (top button) to open/close the side panel
   - When open, the toolbar buttons move left and the image refits

## Project Structure

```
.
├── index.html          # Main HTML file
├── src/
│   └── image-viewer.js # Main application logic
├── styles/
│   └── main.css        # Styles and animations
├── package.json        # Project configuration
└── README.md          # This file
```

## Browser Support

Modern browsers with support for:
- ES6+ JavaScript
- CSS3 Transitions
- FileReader API
- Drag and Drop API

## Future Enhancements

The control panel is ready for additional features such as:
- Image filters
- Zoom controls
- Image metadata
- Export options
- And more!

