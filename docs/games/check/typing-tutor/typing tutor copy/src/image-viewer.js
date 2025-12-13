if (window.debugLog) window.debugLog('[ImageViewer] Script loading, defining ImageViewer class');

class ImageViewer {
    constructor() {
        if (window.debugLog) window.debugLog('[ImageViewer] Constructor called');
        this.imageElement = document.getElementById('imageElement');
        this.imageWrapper = document.getElementById('imageWrapper');
        this.imageContainer = document.getElementById('imageContainer');
        this.dropZone = document.getElementById('dropZone');
        this.controlPanel = document.getElementById('controlPanel');
        this.panelToggle = document.getElementById('panelToggle');
        this.uploadButton = document.getElementById('uploadButton');
        this.viewModeToggle = document.getElementById('viewModeToggle');
        this.fileInput = document.getElementById('fileInput');
        this.viewModeIcon = document.getElementById('viewModeIcon');
        
        // Depthy state
        this.depthy = null;
        this.depthyActive = false;
        this.modeSelect = document.getElementById('modeSelect');
        this.cssCodeToggle = document.getElementById('cssCodeToggle');
        this.cssCodeBlock = document.getElementById('cssCodeBlock');
        
        this.isPanelOpen = false;
        this.viewMode = 'fit'; // 'actual', 'fit', or 'fill'
        this.currentImage = null;
        
        // Initialize view mode icon
        this.updateViewModeIcon();
        
        this.init();
    }

    notify(message, details = null) {
        console.error('[Notify]', message, details);
        const host = document.getElementById('notifications');
        if (!host) return;
        const el = document.createElement('div');
        el.className = 'notification';
        el.textContent = message + (details ? '\n' + JSON.stringify(details, null, 2) : '');
        el.style.whiteSpace = 'pre-wrap';
        el.style.maxHeight = '300px';
        el.style.overflow = 'auto';
        host.appendChild(el);
        setTimeout(() => {
            if (el && el.parentNode === host) host.removeChild(el);
        }, 10000);
    }
    
    init() {
        // Drag and drop handlers
        this.setupDragAndDrop();
        
        // Button handlers
        this.panelToggle.addEventListener('click', () => this.togglePanel());
        this.uploadButton.addEventListener('click', () => this.fileInput.click());
        this.viewModeToggle.addEventListener('click', () => this.toggleViewMode());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        if (this.modeSelect) {
            this.modeSelect.addEventListener('change', (e) => {
                const value = e.target.value;
                if (value === 'actual' || value === 'fit' || value === 'fill') {
                    this.viewMode = value;
                    this.updateViewModeIcon();
                    this.updateImageLayout();
                }
            });
        }
        if (this.cssCodeToggle && this.cssCodeBlock) {
            this.cssCodeToggle.addEventListener('click', () => {
                const expanded = this.cssCodeToggle.getAttribute('aria-expanded') === 'true';
                this.cssCodeToggle.setAttribute('aria-expanded', (!expanded).toString());
                if (expanded) {
                    this.cssCodeBlock.setAttribute('hidden', '');
                } else {
                    this.cssCodeBlock.removeAttribute('hidden');
                    this.updateCssTooltip();
                }
            });
        }
        
        // Window resize handler
        window.addEventListener('resize', () => {
            if (this.currentImage) {
                this.updateImageLayout();
            }
        });
        
        // Prevent default drag behaviors
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }
    
    setupDragAndDrop() {
        console.error('[DragDrop] setupDragAndDrop called');
        // Helper to process file lists (single or paired color+depth)
        const handleFiles = (fileList) => {
            console.error('[DragDrop] handleFiles called with', fileList.length, 'files');
            const files = Array.from(fileList).filter(f => /^image\/(jpeg|jpg|png)$/.test(f.type));
            console.error('[DragDrop] Received files:', Array.from(fileList).map(f => `${f.name} (${f.type || 'unknown type'})`));
            console.error('[DragDrop] Filtered image files:', files.map(f => `${f.name} (${f.type})`));
            if (files.length === 0) return;
            if (files.length === 1) {
                this.loadImage(files[0]);
            } else {
                this.loadImageOrDepthPair(files);
            }
        };

        // Handle drag events on the drop zone and container
        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dropZone.classList.add('drag-over');
        };
        
        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Only hide if we're leaving the drop zone area
            if (!this.dropZone.contains(e.relatedTarget)) {
                this.dropZone.classList.remove('drag-over');
            }
        };
        
        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.dropZone.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        };
        
        // Add listeners to both drop zone and container
        this.dropZone.addEventListener('dragover', handleDragOver);
        this.dropZone.addEventListener('dragleave', handleDragLeave);
        this.dropZone.addEventListener('drop', handleDrop);
        
        this.imageContainer.addEventListener('dragover', handleDragOver);
        this.imageContainer.addEventListener('dragleave', handleDragLeave);
        this.imageContainer.addEventListener('drop', handleDrop);
    }
    
    handleFileSelect(e) {
        const files = Array.from(e.target.files || []);
        console.log('[FileInput] Selected files:', files.map(f => f.name));
        if (files.length === 0) return;
        if (files.length === 1) this.loadImage(files[0]);
        else this.loadImageOrDepthPair(files);
    }
    
    loadImage(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            this.notify('Please select a JPG or PNG image file.');
            return;
        }
        console.log('[Flat] Loading single image:', file.name, file.type, file.size);
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            this.displayImage(imageUrl);
        };
        reader.onerror = () => {
            this.notify('Error reading file. Please try again.');
        };
        reader.readAsDataURL(file);
    }
    
    displayImage(imageUrl) {
        // Switch to flat image mode
        this.depthyActive = false;
        this.currentImage = imageUrl;
        
        // Ensure <img> is visible
        this.imageElement.style.display = 'block';
        
        // Always start in fit mode for new images
        this.viewMode = 'fit';
        this.updateViewModeIcon();
        if (this.modeSelect) this.modeSelect.value = 'fit';
        this.updateCssTooltip();
        
        // Animate image appearance
        this.imageWrapper.style.opacity = '0';
        this.imageWrapper.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.imageElement.src = imageUrl;
            this.imageElement.onload = () => {
                this.dropZone.classList.add('hidden');
                this.updateImageLayout();
                
                // Animate image in
                requestAnimationFrame(() => {
                    this.imageWrapper.style.opacity = '1';
                    this.imageWrapper.style.transform = 'scale(1)';
                });
            };
        }, 150);
    }

    // Pair color + depth files by filename: depth identified by "∂map"
    loadImageOrDepthPair(files) {
        const isDepthName = (name) => name && name.includes('∂map');
        const depthFile = files.find(f => isDepthName(f.name));
        const colorFile = files.find(f => !isDepthName(f.name));
        console.log('[DepthPair] Pairing files:', files.map(f => f.name));
        console.log('[DepthPair] Chosen color:', colorFile && colorFile.name, 'depth:', depthFile && depthFile.name);
        if (depthFile && colorFile) {
            Promise.all([this.readFileAsDataURL(colorFile), this.readFileAsDataURL(depthFile)])
                .then(([colorUrl, depthUrl]) => {
                    console.log('[DepthPair] Data URLs ready. color length:', colorUrl && colorUrl.length, 'depth length:', depthUrl && depthUrl.length);
                    this.displayDepthy(colorUrl, depthUrl);
                })
                .catch(() => alert('Error reading files. Please try again.'));
        } else {
            this.loadImage(files[0]);
        }
    }

    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Initialize Depthy viewer on the wrapper using color + depth URLs
    displayDepthy(colorUrl, depthUrl) {
        const debug = {
            hasPIXI: !!window.PIXI,
            DepthyViewer: typeof window.DepthyViewer,
            colorUrl: colorUrl ? colorUrl.substring(0, 50) + '...' : 'null',
            depthUrl: depthUrl ? depthUrl.substring(0, 50) + '...' : 'null'
        };
        if (window.debugLog) window.debugLog('[Depthy] displayDepthy called: ' + JSON.stringify(debug));
        console.log('[Depthy] displayDepthy called', debug);
        
        if (!window.PIXI) {
            console.error('[Depthy] PIXI not available!');
            this.notify('PIXI library not loaded. Cannot initialize depth view.', {
                hasPIXI: !!window.PIXI,
                hasDepthyViewer: typeof window.DepthyViewer,
                windowKeys: Object.keys(window).filter(k => k.includes('PIXI') || k.includes('Depthy'))
            });
            return;
        }
        
        if (typeof window.DepthyViewer !== 'function') {
            console.error('[Depthy] DepthyViewer not available!', typeof window.DepthyViewer);
            this.notify('DepthyViewer class not loaded. Cannot initialize depth view.', {
                hasPIXI: !!window.PIXI,
                DepthyViewerType: typeof window.DepthyViewer,
                windowKeys: Object.keys(window).filter(k => k.includes('PIXI') || k.includes('Depthy'))
            });
            return;
        }
        
        this.depthyActive = true;
        this.currentImage = colorUrl;

        // Hide <img> element when using Depthy
        this.imageElement.src = '';
        this.imageElement.style.display = 'none';

        // Remove previous Depthy canvas if present
        if (this.depthy && this.depthy.getCanvas && this.depthy.getCanvas()) {
            const canvas = this.depthy.getCanvas();
            if (canvas && canvas.parentNode === this.imageWrapper) {
                this.imageWrapper.removeChild(canvas);
            }
        }
        this.depthy = null;

        // Animate appearance
        this.imageWrapper.style.opacity = '0';
        this.imageWrapper.style.transform = 'scale(0.98)';

        // Instantiate DepthyViewer
        requestAnimationFrame(() => {
            try {
                const size = { width: this.imageWrapper.clientWidth, height: this.imageWrapper.clientHeight };
                console.log('[Depthy] wrapper size', size, 'imageWrapper:', this.imageWrapper);
                this.depthy = new window.DepthyViewer(this.imageWrapper, {
                    size: size,
                    fit: 'contain',
                    hover: true,
                    orient: 2,
                    quality: false
                });

                console.log('[Depthy] DepthyViewer created', this.depthy);
                const p1 = this.depthy.setImage(colorUrl);
                const p2 = this.depthy.setDepthmap(depthUrl, false);
                Promise.allSettled([p1, p2]).then((results) => {
                    console.log('[Depthy] setImage/setDepthmap results', results);
                    this.dropZone.classList.add('hidden');
                    setTimeout(() => {
                        this.imageWrapper.style.opacity = '1';
                        this.imageWrapper.style.transform = 'scale(1)';
                    }, 150);

                    this.updateCssTooltip();
                }).catch((err) => {
                    console.error('[Depthy] setImage/setDepthmap failed', err);
                    this.notify('Depth view failed to initialize. Falling back to flat image.');
                    this.depthyActive = false;
                    this.displayImage(colorUrl);
                });
            } catch (e) {
                const errDetails = `[Depthy] Constructor failed: ${e.name}: ${e.message}`;
                if (window.debugLog) window.debugLog(errDetails);
                if (window.debugLog && e.stack) window.debugLog('[Depthy] Stack: ' + e.stack.split('\n').slice(0, 3).join(' | '));
                console.error('[Depthy] Constructor failed:', e);
                console.error('[Depthy] Error name:', e.name);
                console.error('[Depthy] Error message:', e.message);
                console.error('[Depthy] Error stack:', e.stack);
                this.notify(`Depth view failed: ${e.message || e.name || 'Unknown error'}`, {
                    errorName: e.name,
                    errorMessage: e.message,
                    errorStack: e.stack ? e.stack.split('\n').slice(0, 5).join('\n') : 'No stack',
                    hasPIXI: !!window.PIXI,
                    DepthyViewerType: typeof window.DepthyViewer
                });
                this.depthyActive = false;
                this.displayImage(colorUrl);
            }
        });
    }
    
    updateImageLayout() {
        // If Depthy is active, size the canvas via Depthy options and stop
        if (this.depthyActive && this.depthy) {
            this.imageWrapper.classList.remove('fit-mode', 'fill-mode', 'actual-mode');
            this.imageWrapper.classList.add('fit-mode');
            const size = { width: this.imageWrapper.clientWidth, height: this.imageWrapper.clientHeight };
            try { this.depthy.setOptions({ size: size, fit: 'contain' }); } catch (e) {}
            this.updateCssTooltip();
            return;
        }

        // Remove existing classes
        this.imageWrapper.classList.remove('fit-mode', 'fill-mode', 'actual-mode');
        
        // Clear any inline styles that might interfere
        this.imageElement.style.width = '';
        this.imageElement.style.height = '';
        this.imageElement.style.maxWidth = '';
        this.imageElement.style.maxHeight = '';
        this.imageElement.style.objectFit = '';
        this.imageElement.style.minWidth = '';
        this.imageElement.style.minHeight = '';
        
        // Get image container dimensions
        const containerRect = this.imageContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Get image natural dimensions
        const imgWidth = this.imageElement.naturalWidth;
        const imgHeight = this.imageElement.naturalHeight;
        
        if (imgWidth <= 0 || imgHeight <= 0) {
            // Fallback if image dimensions not available
            this.imageElement.style.maxWidth = '100%';
            this.imageElement.style.maxHeight = '100%';
            this.imageElement.style.width = 'auto';
            this.imageElement.style.height = 'auto';
            this.imageElement.style.objectFit = 'contain';
            return;
        }
        
        // Add appropriate class and set styles based on view mode
        if (this.viewMode === 'actual') {
            // Actual Size mode: show image at true pixel size with black bars if needed
            this.imageWrapper.classList.add('actual-mode');
            this.imageElement.style.width = `${imgWidth}px`;
            this.imageElement.style.height = `${imgHeight}px`;
            this.imageElement.style.maxWidth = 'none';
            this.imageElement.style.maxHeight = 'none';
            this.imageElement.style.objectFit = 'none';
        } else if (this.viewMode === 'fit') {
            // Fit mode (contain): entire image visible, proportions preserved, no cropping
            this.imageWrapper.classList.add('fit-mode');
            
            // Calculate scale to fit image within available space while maintaining aspect ratio
            const scaleX = containerWidth / imgWidth;
            const scaleY = containerHeight / imgHeight;
            const scale = Math.min(scaleX, scaleY); // Use the smaller scale to fit within bounds
            
            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;
            
            this.imageElement.style.width = `${scaledWidth}px`;
            this.imageElement.style.height = `${scaledHeight}px`;
            this.imageElement.style.maxWidth = 'none';
            this.imageElement.style.maxHeight = 'none';
            this.imageElement.style.objectFit = 'contain';
        } else {
            // Fill mode (cover): frame completely filled, proportions preserved, may be cropped
            this.imageWrapper.classList.add('fill-mode');
            
            // Calculate aspect ratios
            const imgAspect = imgWidth / imgHeight;
            const containerAspect = containerWidth / containerHeight;
            
            if (imgAspect > containerAspect) {
                // Image is wider - fit to container height, width will extend beyond
                this.imageElement.style.height = `${containerHeight}px`;
                this.imageElement.style.width = 'auto';
            } else {
                // Image is taller - fit to container width, height will extend beyond
                this.imageElement.style.width = `${containerWidth}px`;
                this.imageElement.style.height = 'auto';
            }
            this.imageElement.style.objectFit = 'none';
            this.imageElement.style.minWidth = 'none';
            this.imageElement.style.minHeight = 'none';
        }

        // Update tooltip showing applied CSS
        this.updateCssTooltip();
    }
    
    toggleViewMode() {
        // Animate transition
        this.imageWrapper.style.opacity = '0.7';
        this.imageWrapper.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            // Cycle through: actual -> fit -> fill -> actual
            if (this.viewMode === 'actual') {
                this.viewMode = 'fit';
            } else if (this.viewMode === 'fit') {
                this.viewMode = 'fill';
            } else {
                this.viewMode = 'actual';
            }
            
            this.updateViewModeIcon();
            this.updateImageLayout();
            if (this.modeSelect) this.modeSelect.value = this.viewMode;
            
            // Animate back in
            requestAnimationFrame(() => {
                this.imageWrapper.style.opacity = '1';
                this.imageWrapper.style.transform = 'scale(1)';
            });
        }, 150);
    }

    updateCssTooltip() {
        const pre = document.getElementById('cssTooltipCode');
        if (!pre) return;
        const styles = window.getComputedStyle(this.imageElement);
        const width = this.imageElement.style.width || styles.width;
        const height = this.imageElement.style.height || styles.height;
        const objectFit = this.imageElement.style.objectFit || styles.objectFit || 'none';
        const overflow = this.imageWrapper.classList.contains('fill-mode') ? 'auto' : 'hidden';

        let comment = '';
        if (this.viewMode === 'actual') {
            comment = '/* Actual Size: image at natural pixel size with black bars */';
        } else if (this.viewMode === 'fit') {
            comment = '/* Fit (contain): entire image visible, aspect ratio preserved */';
        } else {
            comment = '/* Fill (cover): container filled, edges may overflow/crop */';
        }

        const code = `${comment}\n.image-wrapper {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    overflow: ${overflow};\n}\n\n.image-wrapper img {\n    width: ${width};\n    height: ${height};\n    object-fit: ${objectFit};\n}`;
        pre.textContent = code;
    }
    
    updateViewModeIcon() {
        // Update icon based on view mode
        if (this.viewMode === 'actual') {
            // Actual Size icon (1:1 ratio / square)
            this.viewModeIcon.innerHTML = `
                <rect x="6" y="6" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none" rx="1"></rect>
            `;
            this.viewModeToggle.classList.remove('active');
        } else if (this.viewMode === 'fit') {
            // Fit icon (contain - arrows pointing inward)
            this.viewModeIcon.innerHTML = `
                <path d="M8 3v5m0 0H3m5 0h5M16 3v5m0 0h5m-5 0h-5M8 21v-5m0 0H3m5 0h5M16 21v-5m0 0h5m-5 0h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            `;
            this.viewModeToggle.classList.remove('active');
        } else {
            // Fill icon (cover - arrows pointing outward)
            this.viewModeIcon.innerHTML = `
                <path d="M3 8h5m0 0V3m0 5v5M21 8h-5m0 0V3m0 5v5M3 16h5m0 0v5m0-5v-5M21 16h-5m0 0v5m0-5v-5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            `;
            this.viewModeToggle.classList.add('active');
        }
    }
    
    togglePanel() {
        this.isPanelOpen = !this.isPanelOpen;
        
        // Animate panel
        if (this.isPanelOpen) {
            this.controlPanel.classList.add('open');
            this.imageContainer.classList.add('panel-open');
            this.panelToggle.classList.add('active');
            
            // Animate image refit when panel opens
            this.imageWrapper.style.opacity = '0.9';
            setTimeout(() => {
                this.updateImageLayout();
                requestAnimationFrame(() => {
                    this.imageWrapper.style.opacity = '1';
                });
            }, 150);
        } else {
            this.controlPanel.classList.remove('open');
            this.imageContainer.classList.remove('panel-open');
            this.panelToggle.classList.remove('active');
            
            // Animate image refit when panel closes
            this.imageWrapper.style.opacity = '0.9';
            setTimeout(() => {
                this.updateImageLayout();
                requestAnimationFrame(() => {
                    this.imageWrapper.style.opacity = '1';
                });
            }, 150);
        }
        
        // Update toolbar position
        const toolbar = document.querySelector('.toolbar');
        if (this.isPanelOpen) {
            toolbar.classList.add('panel-open');
        } else {
            toolbar.classList.remove('panel-open');
        }
    }
}

// Initialize the image viewer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const globals = {
        PIXI: typeof window.PIXI,
        DepthyViewer: typeof window.DepthyViewer,
        ImageViewer: typeof ImageViewer
    };
    if (window.debugLog) window.debugLog('[Boot] DOMContentLoaded - globals: ' + JSON.stringify(globals));
    console.log('[Boot] DOMContentLoaded fired', globals);
    
    const viewer = new ImageViewer();
    if (window.debugLog) window.debugLog('[Boot] ImageViewer instance created');
    console.log('[Boot] ImageViewer instance created', viewer);
    
    // Auto-load test parallax pair on startup
    const colorUrl = 'test-images/glassbutt2.jpeg';
    const depthUrl = encodeURI('test-images/glassbutt2-∂map.png');
    if (window.debugLog) window.debugLog('[Boot] Attempting auto depth load: ' + colorUrl + ' / ' + depthUrl);
    console.log('[Boot] Attempting auto depth load', { colorUrl, depthUrl });
    
    // Delay slightly to ensure everything is initialized
    setTimeout(() => {
        try {
            if (window.debugLog) window.debugLog('[Boot] Calling displayDepthy now');
            console.log('[Boot] Calling displayDepthy now');
            viewer.displayDepthy(colorUrl, depthUrl);
        } catch (e) {
            const errMsg = '[Boot] Auto depth load failed: ' + e.message;
            if (window.debugLog) window.debugLog(errMsg);
            console.error('[Boot] Auto depth load failed (sync)', e);
            console.error('[Boot] Stack:', e.stack);
        }
    }, 100);
});

