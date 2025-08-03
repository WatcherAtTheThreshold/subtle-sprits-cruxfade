// ═══════════════════════════════════════════════════════════════════════════════
// DATA LOADER - Central data management system
// Loads and manages all game data from separate files
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// DATA LOADER CLASS
// Manages loading, caching, and accessing game data
// ═══════════════════════════════════════════════════════════════════════════════

class GameDataLoader {
  constructor() {
    this.isLoaded = false;
    this.loadingPromise = null;
    this.data = {
      characters: null,
      enemies: null,
      specials: null,
      items: null
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // LOADING SYSTEM
  // Asynchronously load all data files
  // ═══════════════════════════════════════════════════════════════════════════════

  async loadAllData() {
    if (this.isLoaded) return this.data;
    if (this.loadingPromise) return this.loadingPromise;

    this.loadingPromise = this._performLoad();
    return this.loadingPromise;
  }

  async _performLoad() {
    console.log("Loading game data...");

    try {
      // For now, we'll use the data from window objects
      // In the future, these could be dynamic imports or fetch requests
      
      await this._loadCharacterData();
      await this._loadEnemyData();
      await this._loadSpecialsData();
      await this._loadItemsData();

      this.isLoaded = true;
      console.log("All game data loaded successfully!");
      
      return this.data;
    } catch (error) {
      console.error("Failed to load game data:", error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INDIVIDUAL DATA LOADERS
  // Load specific data categories
  // ═══════════════════════════════════════════════════════════════════════════════

  async _loadCharacterData() {
    // Check if data is available in window (loaded via script tags)
    if (window.CharacterData) {
      this.data.characters = window.CharacterData;
      console.log("✓ Character data loaded");
      return;
    }

    // Fallback: Use embedded data
    this.data.characters = {
      PLAYER_CHARACTERS: {
        magdaline: {
          name: "Magdaline",
          type: "Healer",
          hp: 30,
          atk: 10,
          img: "../images/Magdaline.png",
          desc: "Gentle healer. Touched by glimmering light.",
          special: "Luminous Veil",
          isPet: false
        },
        fizzwick: {
          name: "Fizzwick",
          type: "Striker",
          hp: 30,
          atk: 10,
          img: "../images/Fizzwick.png",
          desc: "Fast, clever, and full of sparks.",
          special: "Spark Trick",
          isPet: false
        },
        timothy: {
          name: "Timothy",
          type: "Support",
          hp: 30,
          atk: 10,
          img: "../images/Timothy.png",
          desc: "Brave and kind. Searches for sprouting light.",
          special: "Plant Blessing",
          isPet: false
        }
      },
      CharacterUtils: {
        getCharacter: (key) => this.data.characters.PLAYER_CHARACTERS[key] || null,
        getAvailableCharacters: () => Object.keys(this.data.characters.PLAYER_CHARACTERS)
          .map(key => ({ key, ...this.data.characters.PLAYER_CHARACTERS[key] }))
      }
    };
    
    console.log("✓ Character data loaded (fallback)");
  }

  async _loadEnemyData() {
    if (window.EnemyData) {
      this.data.enemies = window.EnemyData;
      console.log("✓ Enemy data loaded");
      return;
    }

    // Fallback: Use embedded data
    this.data.enemies = {
      LEVEL_1_ENEMIES: {
        gwar: {
          name: "Gwar",
          hp: 30,
          atk: 10,
          img: "../images/Gwar.png",
          desc: "Heavy brute. Follows the sound of war.",
          special: "Skull Bash",
          isPet: false
        },
        mildred: {
          name: "Mildred",
          hp: 30,
          atk: 10,
          img: "../images/Mildred.png",
          desc: "Old fire. Unforgiving and wild.",
          special: "Wildfire Curse",
          isPet: false
        },
        drBurgly: {
          name: "Dr-Burgly",
          hp: 30,
          atk: 10,
          img: "../images/Dr-Burgly.png",
          desc: "Mad medic. Stitches shadows together.",
          special: "Panic Injection",
          isPet: false
        }
      },
      EnemyUtils: {
        getRandomEnemy: (level = 1) => {
          const enemies = Object.keys(this.data.enemies.LEVEL_1_ENEMIES)
            .map(key => ({ key, ...this.data.enemies.LEVEL_1_ENEMIES[key] }));
          return enemies[Math.floor(Math.random() * enemies.length)];
        }
      }
    };
    
    console.log("✓ Enemy data loaded (fallback)");
  }

  async _loadSpecialsData() {
    if (window.SpecialsData) {
      this.data.specials = window.SpecialsData;
      console.log("✓ Specials data loaded");
      return;
    }

    // Fallback: Basic specials data
    this.data.specials = {
      SPECIAL_MOVES: {
        "Luminous Veil": {
          name: "Luminous Veil",
          type: "heal",
          power: 8,
          description: "Heals for 8 HP with divine light"
        },
        "Spark Trick": {
          name: "Spark Trick",
          type: "damage",
          power: 15,
          description: "Deals 15 electric damage with stunning power"
        },
        "Plant Blessing": {
          name: "Plant Blessing",
          type: "heal",
          power: 10,
          description: "Channels nature's power, healing 10 HP"
        }
      },
      SpecialUtils: {
        getSpecial: (name) => this.data.specials.SPECIAL_MOVES[name] || null
      }
    };
    
    console.log("✓ Specials data loaded (fallback)");
  }

  async _loadItemsData() {
    if (window.ItemsData) {
      this.data.items = window.ItemsData;
      console.log("✓ Items data loaded");
      return;
    }

    // Fallback: Basic items data (for future use)
    this.data.items = {
      CONSUMABLE_ITEMS: {},
      EQUIPMENT_ITEMS: {},
      COLLECTIBLE_ITEMS: {},
      ItemUtils: {
        getItem: (key) => null
      }
    };
    
    console.log("✓ Items data loaded (fallback)");
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // DATA ACCESS METHODS
  // Easy access to loaded data
  // ═══════════════════════════════════════════════════════════════════════════════

  // Character data access
  getPlayerCharacters() {
    return this.data.characters?.PLAYER_CHARACTERS || {};
  }

  getPlayerCharacter(key) {
    return this.data.characters?.CharacterUtils?.getCharacter(key) || null;
  }

  getAvailableCharacters() {
    return this.data.characters?.CharacterUtils?.getAvailableCharacters() || [];
  }

  // Enemy data access
  getEnemies(level = 1) {
    return this.data.enemies?.LEVEL_1_ENEMIES || {};
  }

  getRandomEnemy(level = 1) {
    return this.data.enemies?.EnemyUtils?.getRandomEnemy(level) || null;
  }

  // Special moves access
  getSpecialMove(name) {
    return this.data.specials?.SpecialUtils?.getSpecial(name) || null;
  }

  getAllSpecials() {
    return this.data.specials?.SPECIAL_MOVES || {};
  }

  // Items access
  getItem(key) {
    return this.data.items?.ItemUtils?.getItem(key) || null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITY METHODS
  // Helper functions for data management
  // ═══════════════════════════════════════════════════════════════════════════════

  isDataLoaded() {
    return this.isLoaded;
  }

  // Get loading progress (for loading screens)
  getLoadingProgress() {
    const loaded = Object.values(this.data).filter(d => d !== null).length;
    const total = Object.keys(this.data).length;
    return Math.round((loaded / total) * 100);
  }

  // Validate data integrity
  validateData() {
    const issues = [];
    
    // Check characters
    const characters = this.getPlayerCharacters();
    if (Object.keys(characters).length === 0) {
      issues.push("No player characters loaded");
    }
    
    // Check enemies
    const enemies = this.getEnemies();
    if (Object.keys(enemies).length === 0) {
      issues.push("No enemies loaded");
    }
    
    // Check specials
    const specials = this.getAllSpecials();
    if (Object.keys(specials).length === 0) {
      issues.push("No special moves loaded");
    }
    
    return {
      valid: issues.length === 0,
      issues: issues
    };
  }

  // Debug information
  getDebugInfo() {
    return {
      isLoaded: this.isLoaded,
      loadingProgress: this.getLoadingProgress(),
      characterCount: Object.keys(this.getPlayerCharacters()).length,
      enemyCount: Object.keys(this.getEnemies()).length,
      specialCount: Object.keys(this.getAllSpecials()).length,
      validation: this.validateData()
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL DATA MANAGER
// Singleton instance for global access
// ═══════════════════════════════════════════════════════════════════════════════

// Create global instance
const gameDataLoader = new GameDataLoader();

// Initialize data loading when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await gameDataLoader.loadAllData();
    console.log("Game data initialization complete!");
    
    // Trigger custom event for other systems
    window.dispatchEvent(new CustomEvent('gameDataLoaded', {
      detail: gameDataLoader.getDebugInfo()
    }));
  } catch (error) {
    console.error("Failed to initialize game data:", error);
    
    // Trigger error event
    window.dispatchEvent(new CustomEvent('gameDataError', {
      detail: { error: error.message }
    }));
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// COMPATIBILITY LAYER
// Bridge between new data system and existing code
// ═══════════════════════════════════════════════════════════════════════════════

// Update existing battleState to use new data system
if (typeof window !== 'undefined') {
  // Enhanced battleState that uses the new data loader
  window.battleState = {
    selectedCharacter: null,
    
    async getPlayerCharacterData() {
      await gameDataLoader.loadAllData();
      
      try {
        const characterKey = sessionStorage.getItem('selectedCharacter');
        if (characterKey) {
          const character = gameDataLoader.getPlayerCharacter(characterKey);
          if (character) return character;
        }
      } catch (e) {
        console.warn('Could not load character from session storage');
      }
      
      // Fallback to first available character
      const available = gameDataLoader.getAvailableCharacters();
      return available.length > 0 ? available[0] : null;
    }
  };

  // Enhanced BattleShared with new data system
  window.BattleShared = {
    ...window.BattleShared,
    
    RosterUtils: {
      async getRandomEnemy() {
        await gameDataLoader.loadAllData();
        return gameDataLoader.getRandomEnemy(1);
      }
    },
    
    // Add data loader access
    DataLoader: gameDataLoader
  };

  // Global access to data loader
  window.GameData = gameDataLoader;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT FOR MODULE SYSTEM
// Make available for import in other files
// ═══════════════════════════════════════════════════════════════════════════════

// For ES6 modules
export default gameDataLoader;

// Also export the class for creating additional instances
export { GameDataLoader };

console.log("Data loader system initialized!");