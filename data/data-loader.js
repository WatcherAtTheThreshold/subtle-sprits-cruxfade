// Create or replace data/data-loader.js
console.log("=== IMPROVED DATA LOADER START ===");

// Global data storage
window.GameData = {
  characters: {},
  enemies: [],
  specials: {},
  items: {},
  loaded: false
};

// Enhanced data loader with fallback system
window.DataLoader = {
  
  // Load all data files with proper error handling
  async loadAllData() {
    console.log("Loading game data...");
    
    try {
      // Try to load each data file
      await Promise.allSettled([
        this.loadCharacters(),
        this.loadEnemies(), 
        this.loadSpecials(),
        this.loadItems()
      ]);
      
      window.GameData.loaded = true;
      console.log("✓ Game data loaded successfully");
      this.logDataStatus();
      
    } catch (error) {
      console.warn("Some data files failed to load, using fallbacks:", error);
      this.setupFallbackData();
    }
  },
  
  // Load character data
  async loadCharacters() {
    if (window.CharacterData && window.CharacterData.PLAYER_CHARACTERS) {
      window.GameData.characters = window.CharacterData.PLAYER_CHARACTERS;
      console.log("✓ Characters loaded from data file");
    } else {
      // Fallback character data
      window.GameData.characters = {
        magdaline: { 
          name: "Magdaline", 
          hp: 30, 
          atk: 10, 
          img: "../images/Magdaline.png", 
          desc: "Gentle healer. Touched by glimmering light.", 
          special: "Luminous Veil", 
          isPet: false 
        },
        fizzwick: { 
          name: "Fizzwick", 
          hp: 30, 
          atk: 10, 
          img: "../images/Fizzwick.png", 
          desc: "Fast, clever, and full of sparks.", 
          special: "Spark Trick", 
          isPet: false 
        },
        timothy: { 
          name: "Timothy", 
          hp: 30, 
          atk: 10, 
          img: "../images/Timothy.png", 
          desc: "Brave and kind. Searches for sprouting light.", 
          special: "Plant Blessing", 
          isPet: false 
        }
      };
      console.log("⚠ Using fallback character data");
    }
  },
  
  // Load enemy data  
  async loadEnemies() {
    if (window.EnemyData && window.EnemyData.LEVEL_1_ENEMIES) {
      window.GameData.enemies = Object.values(window.EnemyData.LEVEL_1_ENEMIES);
      console.log("✓ Enemies loaded from data file");
    } else {
      // Fallback enemy data
      window.GameData.enemies = [
        { name: "Gwar", hp: 30, atk: 10, img: "../images/Gwar.png", desc: "Heavy brute. Follows the sound of war.", special: "Skull Bash", isPet: false },
        { name: "Mildred", hp: 30, atk: 10, img: "../images/Mildred.png", desc: "Old fire. Unforgiving and wild.", special: "Wildfire Curse", isPet: false },
        { name: "Dr-Burgly", hp: 30, atk: 10, img: "../images/Dr-Burgly.png", desc: "Mad medic. Stitches shadows together.", special: "Panic Injection", isPet: false }
      ];
      console.log("⚠ Using fallback enemy data");
    }
  },
  
  // Load special moves
  async loadSpecials() {
    if (window.SpecialData && window.SpecialData.SPECIAL_MOVES) {
      window.GameData.specials = window.SpecialData.SPECIAL_MOVES;
      console.log("✓ Specials loaded from data file");
    } else {
      window.GameData.specials = {};
      console.log("⚠ No special moves data file found");
    }
  },
  
  // Load items
  async loadItems() {
    if (window.ItemData && window.ItemData.ITEMS) {
      window.GameData.items = window.ItemData.ITEMS;
      console.log("✓ Items loaded from data file");
    } else {
      window.GameData.items = {};
      console.log("⚠ No items data file found");
    }
  },
  
  // Setup fallback data if files completely fail
  setupFallbackData() {
    window.GameData = {
      characters: {
        magdaline: { name: "Magdaline", hp: 30, atk: 10, img: "../images/Magdaline.png", desc: "Gentle healer. Touched by glimmering light.", special: "Luminous Veil", isPet: false },
        fizzwick: { name: "Fizzwick", hp: 30, atk: 10, img: "../images/Fizzwick.png", desc: "Fast, clever, and full of sparks.", special: "Spark Trick", isPet: false },
        timothy: { name: "Timothy", hp: 30, atk: 10, img: "../images/Timothy.png", desc: "Brave and kind. Searches for sprouting light.", special: "Plant Blessing", isPet: false }
      },
      enemies: [
        { name: "Gwar", hp: 30, atk: 10, img: "../images/Gwar.png", desc: "Heavy brute. Follows the sound of war.", special: "Skull Bash", isPet: false },
        { name: "Mildred", hp: 30, atk: 10, img: "../images/Mildred.png", desc: "Old fire. Unforgiving and wild.", special: "Wildfire Curse", isPet: false },
        { name: "Dr-Burgly", hp: 30, atk: 10, img: "../images/Dr-Burgly.png", desc: "Mad medic. Stitches shadows together.", special: "Panic Injection", isPet: false }
      ],
      specials: {},
      items: {},
      loaded: true
    };
    console.log("✓ Fallback data system activated");
  },
  
  // Log current data status
  logDataStatus() {
    console.log("=== GAME DATA STATUS ===");
    console.log(`Characters: ${Object.keys(window.GameData.characters).length}`);
    console.log(`Enemies: ${window.GameData.enemies.length}`);
    console.log(`Specials: ${Object.keys(window.GameData.specials).length}`);
    console.log(`Items: ${Object.keys(window.GameData.items).length}`);
    console.log("========================");
  },
  
  // Get character by key
  getCharacter(key) {
    return window.GameData.characters[key] || null;
  },
  
  // Get random enemy
  getRandomEnemy() {
    const enemies = window.GameData.enemies;
    return enemies[Math.floor(Math.random() * enemies.length)];
  },
  
  // Get multiple random enemies
  getEnemyTeam(count = 2) {
    const enemies = [...window.GameData.enemies];
    const team = [];
    
    for (let i = 0; i < count && enemies.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * enemies.length);
      team.push(enemies.splice(randomIndex, 1)[0]);
    }
    
    return team;
  }
};

// Auto-load data when this script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => window.DataLoader.loadAllData(), 100);
  });
} else {
  setTimeout(() => window.DataLoader.loadAllData(), 100);
}

console.log("=== IMPROVED DATA LOADER END ===");
