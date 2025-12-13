class ImageViewer {
    constructor() {
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
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.loadImage(files[0]);
            }
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
        const file = e.target.files[0];
        if (file) {
            this.loadImage(file);
        }
    }
    
    loadImage(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            alert('Please select a JPG or PNG image file.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            this.displayImage(imageUrl);
        };
        reader.onerror = () => {
            alert('Error reading file. Please try again.');
        };
        reader.readAsDataURL(file);
    }
    
    displayImage(imageUrl) {
        this.currentImage = imageUrl;
        
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
    
    updateImageLayout() {
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
    new ImageViewer();
});

