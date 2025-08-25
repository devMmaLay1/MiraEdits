// ===== MOBILE-FIRST VIDEO MODAL JAVASCRIPT =====

class MobileVideoModal {
    constructor() {
        // Modal elements
        this.modal = null;
        this.overlay = null;
        this.container = null;
        this.closeBtn = null;
        this.video = null;
        this.videoContainer = null;

        // Video controls
        this.playBtn = null;
        this.volumeBtn = null;
        this.progressBar = null;
        this.progressFill = null;
        this.timeDisplay = null;
        this.fullscreenBtn = null;

        // Content elements
        this.title = null;
        this.category = null;
        this.description = null;
        this.tools = null;
        this.scrollableContent = null;

        // State management
        this.currentProject = null;
        this.projects = [];
        this.isPlaying = false;
        this.isDragging = false;
        this.lastVolume = 1;

        // Mobile-specific properties
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.isSwipeToClose = false;
        
        // Event handler references for cleanup
        this.currentErrorHandler = null;
        this.currentLoadedHandler = null;
        this.currentCanPlayHandler = null;
        this.loadTimeout = null;
        this.controlsTimeout = null;

        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
        this.collectProjects();
        console.log('Mobile Video Modal initialized with', this.projects.length, 'projects');
    }

    createModal() {
        // Create modal HTML structure
        const modalHTML = `
            <div class="video-modal" id="videoModal" aria-hidden="true">
                <div class="video-modal__overlay"></div>
                <div class="video-modal__container">
                    <!-- Close Button -->
                    <button class="video-modal__close touch-target" aria-label="Close video">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <!-- Video Section -->
                    <div class="video-modal__video-section">
                        <div class="video-modal__video-container">
                            <video 
                                class="video-modal__video"
                                playsinline
                                preload="metadata"
                                poster=""
                            >
                                <source src="" type="video/mp4">
                                <source src="" type="video/webm">
                                Your browser doesn't support HTML5 video.
                            </video>
                            
                            <!-- Video Controls Overlay -->
                            <div class="video-modal__controls">
                                <button class="video-modal__play-btn touch-target" aria-label="Play video">
                                    <i class="fas fa-play"></i>
                                </button>
                                
                                <div class="video-modal__controls-bar">
                                    <div class="video-modal__progress">
                                        <div class="video-modal__progress-fill"></div>
                                        <div class="video-modal__progress-handle touch-target"></div>
                                    </div>
                                    
                                    <div class="video-modal__controls-main">
                                        <button class="video-modal__volume-btn touch-target" aria-label="Toggle volume">
                                            <i class="fas fa-volume-up"></i>
                                        </button>
                                        
                                        <span class="video-modal__time">0:00 / 0:00</span>
                                        
                                        <button class="video-modal__fullscreen-btn touch-target" aria-label="Toggle fullscreen">
                                            <i class="fas fa-expand"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Loading Spinner -->
                            <div class="video-modal__loading">
                                <div class="video-modal__loading-spinner"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Scrollable Content Section -->
                    <div class="video-modal__content">
                        <div class="video-modal__header">
                            <h3 class="video-modal__title"></h3>
                            <p class="video-modal__category"></p>
                        </div>
                        
                        <div class="video-modal__details">
                            <div class="video-modal__description">
                                <h4>Description</h4>
                                <p class="description-text"></p>
                            </div>
                            
                            <div class="video-modal__tools">
                                <h4>Tools Used</h4>
                                <div class="tools-list"></div>
                            </div>
                            
                            <div class="video-modal__meta">
                                <div class="video-modal__date"></div>
                                <div class="video-modal__duration"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert modal into DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Get references to all elements
        this.modal = document.getElementById('videoModal');
        this.overlay = this.modal.querySelector('.video-modal__overlay');
        this.container = this.modal.querySelector('.video-modal__container');
        this.closeBtn = this.modal.querySelector('.video-modal__close');
        this.video = this.modal.querySelector('.video-modal__video');
        this.videoContainer = this.modal.querySelector('.video-modal__video-container');

        // Video controls
        this.playBtn = this.modal.querySelector('.video-modal__play-btn');
        this.volumeBtn = this.modal.querySelector('.video-modal__volume-btn');
        this.progressBar = this.modal.querySelector('.video-modal__progress');
        this.progressFill = this.modal.querySelector('.video-modal__progress-fill');
        this.timeDisplay = this.modal.querySelector('.video-modal__time');
        this.fullscreenBtn = this.modal.querySelector('.video-modal__fullscreen-btn');

        // Content elements
        this.title = this.modal.querySelector('.video-modal__title');
        this.category = this.modal.querySelector('.video-modal__category');
        this.description = this.modal.querySelector('.description-text');
        this.tools = this.modal.querySelector('.tools-list');
        this.scrollableContent = this.modal.querySelector('.video-modal__content');
    }

    bindEvents() {
        // Close modal events
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (this.isOpen()) {
                if (e.key === 'Escape') this.close();
                if (e.key === ' ') {
                    e.preventDefault();
                    this.togglePlay();
                }
            }
        });

        // Video control events
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.video.addEventListener('click', () => this.handleVideoClick());
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // Progress bar events
        this.progressBar.addEventListener('click', (e) => this.seekTo(e));
        this.progressBar.addEventListener('touchstart', (e) => this.startDragging(e));
        document.addEventListener('touchmove', (e) => this.handleDragging(e));
        document.addEventListener('touchend', () => this.stopDragging());

        // Video events
        this.video.addEventListener('loadstart', () => this.showLoading());
        this.video.addEventListener('canplay', () => this.hideLoading());
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('play', () => this.onPlay());
        this.video.addEventListener('pause', () => this.onPause());
        this.video.addEventListener('ended', () => this.onEnded());
        this.video.addEventListener('error', () => this.onError());

        // Mobile swipe to close
        this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.container.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        // Prevent body scroll when modal is open
        this.modal.addEventListener('touchmove', (e) => {
            if (e.target === this.modal || e.target === this.overlay) {
                e.preventDefault();
            }
        });
    }

    collectProjects() {
        // Get all project elements and add click handlers
        this.projects = Array.from(document.querySelectorAll('.work__project'));

        this.projects.forEach((project, index) => {
            project.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Project clicked:', project.querySelector('.work__project-title')?.textContent);
                this.openProject(project, index);
            });

            // Add touch feedback
            project.addEventListener('touchstart', () => {
                project.style.transform = 'scale(0.98)';
            });

            project.addEventListener('touchend', () => {
                project.style.transform = '';
            });
        });

        console.log('Collected', this.projects.length, 'video projects');
        console.log('Projects found:', this.projects.map(p => p.querySelector('.work__project-title')?.textContent));
    }

    openProject(projectElement, index = 0) {
        this.currentProject = projectElement;

        // Extract project data
        const projectData = this.extractProjectData(projectElement);

        // Clear any previous error states
        this.clearErrorState();
        
        // Reset video state
        this.isPlaying = false;
        
        // Populate modal content
        this.populateModal(projectData);

        // Show modal
        this.show();

        // Load and prepare video (but don't auto-play)
        this.loadVideo(projectData.videoSrc);

        console.log('Opened project:', projectData.title, 'with video:', projectData.videoSrc);
    }

    extractProjectData(projectElement) {
        // Get data from project element
        const title = projectElement.querySelector('.work__project-title')?.textContent || 'Untitled Project';
        const category = projectElement.querySelector('.work__project-category')?.textContent || 'Video Project';

        // Get video source from video element or generate based on project
        let videoSrc = '';
        const videoElement = projectElement.querySelector('video source');
        
        if (videoElement && videoElement.src) {
            // Get the current video source from the project
            const currentSrc = videoElement.src;
            
            // Map problematic videos to working ones
            videoSrc = this.getWorkingVideoSource(currentSrc, title, category);
        } else {
            // Fallback to generating video based on title and category
            videoSrc = this.getVideoByTitleAndCategory(title, category);
        }

        // Generate description and tools based on category
        const projectData = this.generateProjectDetails(title, category);

        console.log('Extracted project data:', { title, category, videoSrc });

        return {
            title,
            category,
            videoSrc,
            description: projectData.description,
            tools: projectData.tools,
            date: 'August 2025'
        };
    }

    getWorkingVideoSource(originalSrc, title, category) {
        // Map of available working videos
        const workingVideos = [
            'assets/videos/Backyard_4K_Living_Background.mp4',
            'assets/videos/generate-video-hover.mp4', 
            'assets/videos/magnific-upscaler-video.webm',
            'assets/videos/v3-home-video-with-logos.webm'
        ];

        // Check if original source is a working video
        const filename = originalSrc.split('/').pop();
        
        // Skip problematic videos (hero-background files are only 0.2KB)
        if (filename === 'hero-background.mp4' || filename === 'hero-background.webm') {
            return this.getVideoByTitleAndCategory(title, category);
        }
        
        // If original source is in working videos, use it
        if (workingVideos.some(video => video.includes(filename))) {
            return originalSrc;
        }
        
        // Otherwise, get appropriate video for title/category
        return this.getVideoByTitleAndCategory(title, category);
    }

    getVideoByTitleAndCategory(title, category) {
        // Smart mapping based on project title and category
        const titleLower = title.toLowerCase();
        const categoryLower = category.toLowerCase();
        
        // Title-based mapping (most specific)
        if (titleLower.includes('apex') || titleLower.includes('valorant') || titleLower.includes('gaming')) {
            return 'assets/videos/Backyard_4K_Living_Background.mp4';
        }
        
        if (titleLower.includes('fortnite') || titleLower.includes('cod') || titleLower.includes('call of duty')) {
            return 'assets/videos/generate-video-hover.mp4';
        }
        
        if (titleLower.includes('music') || titleLower.includes('beat') || titleLower.includes('visual')) {
            return 'assets/videos/magnific-upscaler-video.webm';
        }
        
        if (titleLower.includes('brand') || titleLower.includes('corporate') || titleLower.includes('commercial')) {
            return 'assets/videos/v3-home-video-with-logos.webm';
        }
        
        if (titleLower.includes('transition') || titleLower.includes('montage') || titleLower.includes('cinematic')) {
            return 'assets/videos/generate-video-hover.mp4';
        }
        
        // Category-based fallback
        switch (categoryLower) {
            case 'gaming':
                return 'assets/videos/Backyard_4K_Living_Background.mp4';
            case 'montages':
                return 'assets/videos/generate-video-hover.mp4';
            case 'music':
            case 'music videos':
                return 'assets/videos/magnific-upscaler-video.webm';
            case 'commercial':
                return 'assets/videos/v3-home-video-with-logos.webm';
            default:
                // Default fallback to the largest, most stable video
                return 'assets/videos/Backyard_4K_Living_Background.mp4';
        }
    }

    generateProjectDetails(title, category) {
        // Generate realistic project details based on category
        const details = {
            gaming: {
                description: `This gaming highlight reel showcases intense gameplay moments with precise editing, dynamic transitions, and synchronized sound design. Each clip demonstrates exceptional skills and strategic gameplay, enhanced with color grading and motion graphics to create an engaging viewing experience. The editing style emphasizes fast-paced action while maintaining narrative flow.`,
                tools: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Audition']
            },
            montages: {
                description: `A collection of seamless transitions and dynamic effects that demonstrate advanced video editing techniques and creative storytelling. This montage features innovative editing approaches, creative use of motion graphics, and sophisticated color grading to create a visually stunning piece that showcases technical expertise and artistic vision.`,
                tools: ['Adobe Premiere Pro', 'After Effects', 'Cinema 4D', 'Photoshop']
            },
            music: {
                description: `An immersive music video featuring stunning visuals synchronized perfectly with the beat. Advanced effects and color grading create a unique atmospheric experience that complements the musical composition. The editing incorporates rhythm-based cuts, creative transitions, and visual effects that enhance the emotional impact of the music.`,
                tools: ['DaVinci Resolve', 'After Effects', 'Pro Tools', 'Cinema 4D']
            },
            commercial: {
                description: `A compelling brand story that combines elegant motion graphics, smooth transitions, and professional color grading to create an impactful corporate narrative. This commercial showcases product features through cinematic shots, detailed close-ups, and professional motion graphics that highlight key benefits and brand values.`,
                tools: ['Adobe Premiere Pro', 'After Effects', 'Photoshop', 'Illustrator']
            }
        };

        const categoryKey = category.toLowerCase();
        return details[categoryKey] || details.commercial;
    }

    getVideoForThumbnail(thumbnailSrc) {
        // Map thumbnail images to their corresponding videos
        const videoMap = {
            'projectthumbnail1.webp': 'assets/videos/magnific-upscaler-video.webm',
            'videothumbnail1.webp': 'assets/videos/Backyard_4K_Living_Background.mp4'
        };

        const filename = thumbnailSrc.split('/').pop();
        return videoMap[filename] || 'assets/videos/hero-background.mp4';
    }

    populateModal(data) {
        this.title.textContent = data.title;
        this.category.textContent = data.category;
        this.description.textContent = data.description;

        // Populate tools with logos
        this.tools.innerHTML = '';
        data.tools.forEach(tool => {
            const toolElement = document.createElement('div');
            toolElement.className = 'tool-item';

            const logoSrc = this.getToolLogo(tool);
            const toolName = this.getToolDisplayName(tool);

            toolElement.innerHTML = `
                <img src="${logoSrc}" alt="${toolName}" class="tool-logo" loading="lazy">
                <span class="tool-name">${toolName}</span>
            `;

            this.tools.appendChild(toolElement);
        });

        // Set date
        const dateElement = this.modal.querySelector('.video-modal__date');
        if (dateElement) {
            dateElement.textContent = `Created: ${data.date}`;
        }
    }

    getToolLogo(toolName) {
        // Map tool names to their corresponding logo images
        const toolLogos = {
            'Adobe Premiere Pro': 'assets/images/adobe-logo.svg',
            'After Effects': 'assets/images/adobe-after-effects-Download-Adobe-After-Effects.jpg',
            'DaVinci Resolve': 'assets/images/DaVinci Resolve.webp',
            'Photoshop': 'assets/images/250px-Adobe_Photoshop_CC_icon.svg.png',
            'Cinema 4D': 'assets/images/Cinema 4D.webp',
            'Pro Tools': 'assets/images/Pro Tools.png',
            'CapCut': 'assets/images/CapCut.png',
            'Audition': 'assets/images/adobe-logo.svg', // Use generic Adobe logo
            'Illustrator': 'assets/images/adobe-logo.svg' // Use generic Adobe logo
        };

        return toolLogos[toolName] || 'assets/images/adobe-logo.svg'; // Default to Adobe logo
    }

    getToolDisplayName(toolName) {
        // Clean up tool names for display
        const displayNames = {
            'Adobe Premiere Pro': 'Premiere Pro',
            'After Effects': 'After Effects',
            'DaVinci Resolve': 'DaVinci Resolve',
            'Photoshop': 'Photoshop',
            'Cinema 4D': 'Cinema 4D',
            'Pro Tools': 'Pro Tools',
            'CapCut': 'CapCut',
            'Audition': 'Audition',
            'Illustrator': 'Illustrator'
        };

        return displayNames[toolName] || toolName;
    }

    loadVideo(videoSrc) {
        if (!videoSrc) {
            console.error('No video source provided');
            this.onError();
            return;
        }

        console.log('Loading video:', videoSrc);
        this.showLoading();

        // Clear any existing error states
        this.clearErrorState();
        
        // Reset video element state
        this.video.currentTime = 0;
        this.isPlaying = false;

        // Set video source based on file type
        const mp4Source = this.video.querySelector('source[type="video/mp4"]');
        const webmSource = this.video.querySelector('source[type="video/webm"]');

        // Check if we're loading the same video
        const currentMp4 = mp4Source.src;
        const currentWebm = webmSource.src;
        const isSameVideo = (videoSrc === currentMp4) || (videoSrc === currentWebm);
        
        if (isSameVideo && this.video.readyState >= 2) {
            // Video is already loaded and ready
            console.log('Video already loaded, skipping reload');
            this.hideLoading();
            this.showControls();
            return;
        }

        // Clear both sources first
        mp4Source.src = '';
        webmSource.src = '';

        if (videoSrc.endsWith('.webm')) {
            webmSource.src = videoSrc;
            console.log('Setting WebM source:', videoSrc);
        } else if (videoSrc.endsWith('.mp4')) {
            mp4Source.src = videoSrc;
            console.log('Setting MP4 source:', videoSrc);
        } else {
            // Default to MP4 if no extension specified
            mp4Source.src = videoSrc;
            console.log('Setting video source (assuming MP4):', videoSrc);
        }

        // Set poster image
        this.video.poster = this.getPosterForVideo(videoSrc);

        // Remove any existing event listeners to prevent duplicates
        this.video.removeEventListener('error', this.currentErrorHandler);
        this.video.removeEventListener('loadeddata', this.currentLoadedHandler);
        this.video.removeEventListener('canplay', this.currentCanPlayHandler);
        
        // Create new event handlers
        this.currentErrorHandler = () => {
            console.warn('Video error occurred for:', videoSrc);
            this.handleVideoLoadError(videoSrc);
        };
        
        this.currentLoadedHandler = () => {
            console.log('Video loadeddata event for:', videoSrc);
            this.hideLoading();
            this.showControls();
        };
        
        this.currentCanPlayHandler = () => {
            console.log('Video can play:', videoSrc);
            this.hideLoading();
            this.showControls();
        };

        // Add event listeners
        this.video.addEventListener('error', this.currentErrorHandler);
        this.video.addEventListener('loadeddata', this.currentLoadedHandler);
        this.video.addEventListener('canplay', this.currentCanPlayHandler);

        // Load video
        this.video.load();

        // Set timeout for loading (15 seconds for better mobile support)
        clearTimeout(this.loadTimeout);
        this.loadTimeout = setTimeout(() => {
            if (this.video.readyState === 0) {
                console.warn('Video loading timeout for:', videoSrc);
                this.handleVideoLoadError(videoSrc);
            }
        }, 15000);
    }

    handleVideoLoadError(failedVideoSrc) {
        console.error('Video load failed:', failedVideoSrc);
        
        // Try fallback video if this wasn't already a fallback
        if (!failedVideoSrc.includes('Backyard_4K_Living_Background.mp4')) {
            console.log('Trying fallback video...');
            this.loadVideo('assets/videos/Backyard_4K_Living_Background.mp4');
            return;
        }
        
        // If fallback also failed, show error
        this.onError();
    }

    clearErrorState() {
        // Remove any existing error messages
        const existingError = this.videoContainer.querySelector('.video-modal__error');
        if (existingError) {
            existingError.remove();
        }
    }

    getPosterForVideo(videoSrc) {
        // Return appropriate poster image for video
        if (videoSrc.includes('magnific-upscaler')) {
            return 'assets/videos/projectthumbnail1.webp';
        }
        return 'assets/videos/videothumbnail1.webp';
    }

    show() {
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Add show class for animations
        setTimeout(() => {
            this.modal.classList.add('show');
        }, 10);

        // Reset scroll position
        this.scrollableContent.scrollTop = 0;

        // Ensure controls are visible when modal opens (video not playing yet)
        this.showControls();

        console.log('Video modal opened');
    }

    close() {
        // Clear any pending control timeouts
        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
            this.controlsTimeout = null;
        }

        // Pause video but don't clear source
        if (this.video) {
            this.video.pause();
            this.video.currentTime = 0; // Reset to beginning
            this.video.removeAttribute('data-playing');
        }

        // Hide modal
        this.modal.classList.remove('show');

        setTimeout(() => {
            this.modal.setAttribute('aria-hidden', 'true');
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
            
            // Clear any error states but preserve video sources
            this.clearErrorState();
            
            // Reset video state without clearing sources
            this.isPlaying = false;
            this.hideLoading();
            
            // Reset play button and ensure controls are visible for next open
            if (this.playBtn) {
                this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.playBtn.setAttribute('aria-label', 'Play video');
            }
            
            // Ensure controls are ready for next time
            this.showControls();
        }, 300);

        console.log('Video modal closed - video sources preserved');
    }

    isOpen() {
        return this.modal.getAttribute('aria-hidden') === 'false';
    }

    // Video control methods
    togglePlay() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    handleVideoClick() {
        // Mobile-first video click behavior
        if (this.isPlaying) {
            // If video is playing, show controls temporarily then hide them
            this.showControls();
            console.log('Video tapped while playing - showing controls temporarily');

            // Clear any existing timeout
            if (this.controlsTimeout) {
                clearTimeout(this.controlsTimeout);
            }

            // Hide controls again after 3 seconds
            this.controlsTimeout = setTimeout(() => {
                if (this.isPlaying) {
                    this.hideControls();
                    console.log('Auto-hiding controls after 3 seconds');
                }
            }, 3000);
        } else {
            // If video is paused, toggle play/pause
            this.togglePlay();
        }
    }

    toggleMute() {
        if (this.video.muted) {
            this.video.muted = false;
            this.video.volume = this.lastVolume;
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            this.lastVolume = this.video.volume;
            this.video.muted = true;
            this.volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    }

    async toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await this.videoContainer.requestFullscreen();
                this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            } else {
                await document.exitFullscreen();
                this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        } catch (error) {
            console.log('Fullscreen not supported:', error);
        }
    }

    seekTo(e) {
        if (this.video.duration) {
            const rect = this.progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.video.currentTime = pos * this.video.duration;
        }
    }

    startDragging(e) {
        this.isDragging = true;
        this.handleDragging(e);
    }

    handleDragging(e) {
        if (!this.isDragging || !this.video.duration) return;

        e.preventDefault();
        const touch = e.touches[0];
        const rect = this.progressBar.getBoundingClientRect();
        const pos = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));

        this.video.currentTime = pos * this.video.duration;
        this.updateProgress();
    }

    stopDragging() {
        this.isDragging = false;
    }

    updateProgress() {
        if (this.video.duration && !this.isDragging) {
            const progress = (this.video.currentTime / this.video.duration) * 100;
            this.progressFill.style.width = `${progress}%`;

            // Update time display
            const current = this.formatTime(this.video.currentTime);
            const total = this.formatTime(this.video.duration);
            this.timeDisplay.textContent = `${current} / ${total}`;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Video event handlers
    onPlay() {
        this.isPlaying = true;
        this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.playBtn.setAttribute('aria-label', 'Pause video');
        this.video.setAttribute('data-playing', 'true');

        // Completely hide controls when video starts playing
        this.hideControls();
        console.log('Video playing - controls completely hidden');
    }

    onPause() {
        this.isPlaying = false;
        this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.playBtn.setAttribute('aria-label', 'Play video');
        this.video.removeAttribute('data-playing');

        // Show controls when video is paused
        this.showControls();
        console.log('Video paused - controls shown');
    }

    onEnded() {
        this.isPlaying = false;
        this.playBtn.innerHTML = '<i class="fas fa-redo"></i>';
        this.playBtn.setAttribute('aria-label', 'Replay video');
        this.video.removeAttribute('data-playing');

        // Show controls when video ends
        this.showControls();
        console.log('Video ended - controls shown');
    }

    // Controls visibility methods
    hideControls() {
        const controls = this.modal.querySelector('.video-modal__controls');
        if (controls) {
            controls.classList.remove('show');
            controls.classList.add('hidden');
            console.log('Controls completely hidden');
        }
    }

    showControls() {
        const controls = this.modal.querySelector('.video-modal__controls');
        if (controls) {
            controls.classList.remove('hidden');
            controls.classList.add('show');
            console.log('Controls shown');
        }
    }

    onError() {
        this.hideLoading();
        console.error('Video failed to load - showing error message');

        // Clear any existing error messages
        this.clearErrorState();

        // Show enhanced error message with retry option
        const errorMsg = document.createElement('div');
        errorMsg.className = 'video-modal__error';
        errorMsg.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Video Unavailable</h4>
                <p>This video could not be loaded. This might be due to:</p>
                <ul>
                    <li>Network connectivity issues</li>
                    <li>Video file not found</li>
                    <li>Browser compatibility</li>
                </ul>
                <div class="error-actions">
                    <button class="retry-btn touch-target" onclick="window.mobileVideoModal.retryVideo()">
                        <i class="fas fa-redo"></i> Try Again
                    </button>
                    <button class="close-btn touch-target" onclick="window.mobileVideoModal.close()">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        `;
        
        this.videoContainer.appendChild(errorMsg);
        
        // Store current video source for retry
        this.failedVideoSrc = this.getCurrentVideoSrc();
    }

    retryVideo() {
        console.log('Retrying video load...');
        this.clearErrorState();
        
        // Try to reload the current video or fallback
        const videoSrc = this.failedVideoSrc || 'assets/videos/Backyard_4K_Living_Background.mp4';
        this.loadVideo(videoSrc);
    }

    getCurrentVideoSrc() {
        const mp4Source = this.video.querySelector('source[type="video/mp4"]');
        const webmSource = this.video.querySelector('source[type="video/webm"]');
        
        return mp4Source.src || webmSource.src || '';
    }

    showLoading() {
        const loading = this.modal.querySelector('.video-modal__loading');
        if (loading) loading.style.display = 'flex';
    }

    hideLoading() {
        const loading = this.modal.querySelector('.video-modal__loading');
        if (loading) loading.style.display = 'none';
    }

    // Mobile touch handlers for swipe to close
    handleTouchStart(e) {
        if (e.target === this.container || e.target.closest('.video-modal__content')) {
            this.touchStartY = e.touches[0].clientY;
            this.touchStartTime = Date.now();
            this.isSwipeToClose = false;
        }
    }

    handleTouchMove(e) {
        if (this.touchStartY === 0) return;

        const currentY = e.touches[0].clientY;
        const deltaY = currentY - this.touchStartY;

        // Only allow swipe down to close
        if (deltaY > 50 && this.scrollableContent.scrollTop === 0) {
            this.isSwipeToClose = true;
            // Add visual feedback
            this.container.style.transform = `translateY(${Math.min(deltaY * 0.5, 100)}px)`;
            this.container.style.opacity = Math.max(0.5, 1 - (deltaY / 300));
        }
    }

    handleTouchEnd(e) {
        if (this.isSwipeToClose) {
            const deltaY = e.changedTouches[0].clientY - this.touchStartY;
            const deltaTime = Date.now() - this.touchStartTime;

            // Close if swipe is significant or fast
            if (deltaY > 100 || (deltaY > 50 && deltaTime < 300)) {
                this.close();
            } else {
                // Reset position
                this.container.style.transform = '';
                this.container.style.opacity = '';
            }
        }

        // Reset touch tracking
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.isSwipeToClose = false;
    }
}

// Initialize the mobile video modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing Mobile Video Modal...');
    try {
        window.mobileVideoModal = new MobileVideoModal();
        console.log('Mobile Video Modal system ready');
    } catch (error) {
        console.error('Error initializing Mobile Video Modal:', error);
    }
});