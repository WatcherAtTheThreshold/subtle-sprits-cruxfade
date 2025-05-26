// Character Select JavaScript
// Handles character selection, UI updates, and battle navigation

class CharacterSelect {
  constructor() {
    this.selectedCharacter = null;
    this.isTransitioning = false;
    this.elements = {};
    
    // Character data mapping
    this.characterData = {
      magdaline: {
        name: 'Magdaline',
        type: 'Healer',
        ability: 'Luminous Veil',
        description: 'Gentle healer. Touched by glimmering light. Special: Luminous Veil - Shields the team from the next hit.',
        fullImage: '../images/Magdaline.png',
        thumbImage: '../images/Magdaline-01.png'
      },
      fizzwick: {
        name: 'Fizzwick',
        type: 'Striker',
        ability: 'Spark Trick',
        description: 'Fast, clever, and full of sparks. Special: Spark Trick - Deals extra damage and stuns.',
        fullImage: '../images/Fizzwick.png',
        thumbImage: '../images/Fizzwick-01.png'
      },
      timothy: {
        name: 'Timothy',
        type: 'Support',
        ability: 'Plant Blessing',
        description: 'Brave and kind. Searches for sprouting light. Special: Plant Blessing - Heals allies over time.',
        fullImage: '../images/Timothy.png',
        thumbImage: '../images/Timothy-01.png'
      }
    };

    this.init();
  }

  // Initialize the character select screen
  init() {
    this.cacheElements();
    this.bindEvents();
    this.setDefaultCharacter();
    this.preloadImages();
  }

  // Cache DOM elements for performance
  cacheElements() {
    this.elements = {
      mainImage: document.getElementById('main-character-image'),
      characterName: document.getElementById('character-name'),
      characterDescription: document.getElementById('character-description'),
      characterType: document.getElementById('character-type'),
      characterAbility: document.getElementById('character-ability'),
      startButton: document.getElementById('start-battle-btn'),
      buttonText: this.elements.startButton?.querySelector('.button-text'),
      thumbnails: document.querySelectorAll('.character-thumb'),
      loadingOverlay: document.getElementById('loading-overlay')
    };
  }

  // Bind event listeners
  bindEvents() {
    // Character thumbnail selection
    this.elements.thumbnails.forEach(thumb => {
      thumb.addEventListener('click', (e) => this.selectCharacter(e));
      thumb.addEventListener('keydown', (e) => this.handleKeyboard(e));
    });

    // Battle start button
    if (this.elements.startButton) {
      this.elements.startButton.addEventListener('click', () => this.startBattle());
    }

    // Global keyboard navigation
    document.addEventListener('keydown', (e) => this.handleGlobalKeyboard(e));

    // Prevent context menu on mobile
    document.addEventListener('contextmenu', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
      }
    });

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleOrientationChange(), 100);
    });
  }

  // Set default character (Magdaline)
  setDefaultCharacter() {
    const defaultThumb = document.querySelector('[data-character="magdaline"]');
    if (defaultThumb) {
      this.updateCharacterDisplay('magdaline');
      this.selectedCharacter = 'magdaline';
      this.updateButtonState();
    }
  }

  // Preload character images for smooth transitions
  preloadImages() {
    Object.values(this.characterData).forEach(character => {
      const img = new Image();
      img.src = character.fullImage;
    });
  }

  // Handle character selection
  selectCharacter(event) {
    if (this.isTransitioning) return;

    const thumb = event.currentTarget;
    const characterKey = thumb.dataset.character;

    if (characterKey === this.selectedCharacter) return;

    this.isTransitioning = true;
    this.showLoading();

    // Update visual selection
    this.updateThumbnailSelection(thumb);

    // Smooth character transition
    setTimeout(() => {
      this.updateCharacterDisplay(characterKey);
      this.selectedCharacter = characterKey;
      this.updateButtonState();
      
      setTimeout(() => {
        this.hideLoading();
        this.isTransitioning = false;
      }, 300);
    }, 200);

    // Add haptic feedback for mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  // Update thumbnail selection visual state
  updateThumbnailSelection(selectedThumb) {
    this.elements.thumbnails.forEach(thumb => {
      thumb.classList.remove('selected');
    });
    selectedThumb.classList.add('selected');
  }

  // Update main character display
  updateCharacterDisplay(characterKey) {
    const character = this.characterData[characterKey];
    if (!character) return;

    // Fade out current character
    if (this.elements.mainImage) {
      this.elements.mainImage.style.opacity = '0';
      this.elements.mainImage.style.transform = 'scale(0.9)';
    }

    setTimeout(() => {
      // Update character information
      if (this.elements.mainImage) {
        this.elements.mainImage.src = character.fullImage;
        this.elements.mainImage.alt = character.name;
      }
      
      if (this.elements.characterName) {
        this.elements.characterName.textContent = character.name;
      }
      
      if (this.elements.characterDescription) {
        this.elements.characterDescription.textContent = character.description;
      }
      
      if (this.elements.characterType) {
        this.elements.characterType.textContent = character.type;
      }
      
      if (this.elements.characterAbility) {
        this.elements.characterAbility.textContent = character.ability;
      }

      // Fade in new character
      if (this.elements.mainImage) {
        this.elements.mainImage.style.opacity = '1';
        this.elements.mainImage.style.transform = 'scale(1)';
      }
    }, 100);
  }

  // Update start button state
  updateButtonState() {
    if (!this.elements.startButton) return;

    if (this.selectedCharacter) {
      const character = this.characterData[this.selectedCharacter];
      this.elements.startButton.disabled = false;
      
      const buttonText = this.elements.startButton.querySelector('.button-text') || this.elements.startButton;
      buttonText.textContent = `Battle as ${character.name}`;
      
      this.elements.startButton.classList.add('ready');
    } else {
      this.elements.startButton.disabled = true;
      
      const buttonText = this.elements.startButton.querySelector('.button-text') || this.elements.startButton;
      buttonText.textContent = 'Select a Character';
      
      this.elements.startButton.classList.remove('ready');
    }
  }

  // Handle keyboard navigation
  handleKeyboard(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectCharacter(event);
    }
  }

  // Handle global keyboard shortcuts
  handleGlobalKeyboard(event) {
    switch (event.key) {
      case 'Enter':
        if (this.selectedCharacter && !this.elements.startButton?.disabled) {
          event.preventDefault();
          this.startBattle();
        }
        break;
      
      case 'ArrowLeft':
      case 'ArrowRight':
        event.preventDefault();
        this.navigateCharacters(event.key === 'ArrowRight' ? 1 : -1);
        break;
      
      case '1':
        this.selectCharacterByIndex(0);
        break;
      case '2':
        this.selectCharacterByIndex(1);
        break;
      case '3':
        this.selectCharacterByIndex(2);
        break;
    }
  }

  // Navigate between characters with arrow keys
  navigateCharacters(direction) {
    const thumbs = Array.from(this.elements.thumbnails);
    const currentIndex = thumbs.findIndex(thumb => 
      thumb.dataset.character === this.selectedCharacter
    );
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = thumbs.length - 1;
    if (newIndex >= thumbs.length) newIndex = 0;
    
    const newThumb = thumbs[newIndex];
    if (newThumb) {
      newThumb.focus();
      this.selectCharacter({ currentTarget: newThumb });
    }
  }

  // Select character by number key
  selectCharacterByIndex(index) {
    const thumbs = Array.from(this.elements.thumbnails);
    if (thumbs[index]) {
      this.selectCharacter({ currentTarget: thumbs[index] });
    }
  }

  // Show loading overlay
  showLoading() {
    if (this.elements.loadingOverlay) {
      this.elements.loadingOverlay.style.display = 'flex';
      setTimeout(() => {
        this.elements.loadingOverlay.style.opacity = '1';
      }, 10);
    }
  }

  // Hide loading overlay
  hideLoading() {
    if (this.elements.loadingOverlay) {
      this.elements.loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        this.elements.loadingOverlay.style.display = 'none';
      }, 300);
    }
  }

  // Start battle - navigate to battle screen
  startBattle() {
    if (!this.selectedCharacter || this.elements.startButton?.disabled) return;

    // Store selected character for battle screen
    try {
      sessionStorage.setItem('selectedCharacter', this.selectedCharacter);
      sessionStorage.setItem('characterData', JSON.stringify(this.characterData[this.selectedCharacter]));
    } catch (e) {
      console.warn('SessionStorage not available, using fallback');
      // Fallback - could use URL parameters or other method
    }

    // Visual feedback
    this.elements.startButton.style.transform = 'scale(0.95)';
    this.elements.startButton.style.opacity = '0.8';

    // Show loading and navigate
    this.showLoading();
    
    setTimeout(() => {
      window.location.href = 'battle1v1-1.html';
    }, 800);
  }

  // Handle orientation changes on mobile
  handleOrientationChange() {
    // Recalculate layouts if needed
    if (window.innerWidth <= 768) {
      // Force a repaint to fix any layout issues
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    }
  }

  // Cleanup method (call when leaving page)
  destroy() {
    // Remove event listeners to prevent memory leaks
    this.elements.thumbnails?.forEach(thumb => {
      thumb.removeEventListener('click', this.selectCharacter);
      thumb.removeEventListener('keydown', this.handleKeyboard);
    });

    if (this.elements.startButton) {
      this.elements.startButton.removeEventListener('click', this.startBattle);
    }

    document.removeEventListener('keydown', this.handleGlobalKeyboard);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
  }
}

// Utility functions
const CharacterSelectUtils = {
  // Get selected character data (for other scripts)
  getSelectedCharacter() {
    try {
      return sessionStorage.getItem('selectedCharacter');
    } catch (e) {
      return null;
    }
  },

  // Get full character data (for other scripts)
  getCharacterData() {
    try {
      const data = sessionStorage.getItem('characterData');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  // Debug function to test character switching
  testCharacterSwitch(characterKey) {
    if (window.characterSelect) {
      const thumb = document.querySelector(`[data-character="${characterKey}"]`);
      if (thumb) {
        window.characterSelect.selectCharacter({ currentTarget: thumb });
      }
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Create global instance for debugging
  window.characterSelect = new CharacterSelect();
  
  // Expose utilities globally
  window.CharacterSelectUtils = CharacterSelectUtils;
  
  console.log('Character Select initialized');
  console.log('Use CharacterSelectUtils.testCharacterSwitch("charactername") to test');
});

// Handle page unload cleanup
window.addEventListener('beforeunload', function() {
  if (window.characterSelect) {
    window.characterSelect.destroy();
  }
});

// Service Worker registration (for offline support)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('SW registered: ', registration);
    }, function(registrationError) {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
