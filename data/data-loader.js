// ═══════════════════════════════════════════════════════════════════════════════
// REPLACE data/data-loader.js with this simplified version
// ═══════════════════════════════════════════════════════════════════════════════

console.log("=== SIMPLE DATA LOADER START ===");

// Wait for data files to load, then set up the battle system
window.DataManager = {
  
  // Check if all data is loaded
  isReady() {
    return window.CharacterData && 
           window.EnemyData && 
           window.SpecialsData;
  },
  
  // Get player character data
  getPlayerCharacter(key) {
    if (window.CharacterData?.PLAYER_CHARACTERS?.[key]) {
      return window.CharacterData.PLAYER_CHARACTERS[key];
    }
    
    // Fallback data
    const fallback = {
      magdaline: { name: "Magdaline", hp: 30, atk: 10, img: "../images/Magdaline.png", desc: "Gentle healer. Touched by glimmering light.", special: "Luminous Veil", isPet: false },
      fizzwick: { name: "Fizzwick", hp: 30, atk: 10, img: "../images/Fizzwick.png", desc: "Fast, clever, and full of sparks.", special: "Spark Trick", isPet: false },
      timothy: { name: "Timothy", hp: 30, atk: 10, img: "../images/Timothy.png", desc: "Brave and kind. Searches for sprouting light.", special: "Plant Blessing", isPet: false }
    };
    
    return fallback[key] || fallback.magdaline;
  },
  
  // Get random enemy
  getRandomEnemy() {
    if (window.EnemyData?.LEVEL_1_ENEMIES) {
      const enemies = Object.values(window.EnemyData.LEVEL_1_ENEMIES);
      return enemies[Math.floor(Math.random() * enemies.length)];
    }
    
    // Fallback enemies
    const fallback = [
      { name: "Gwar", hp: 30, atk: 10, img: "../images/Gwar.png", desc: "Heavy brute. Follows the sound of war.", special: "Skull Bash", isPet: false },
      { name: "Mildred", hp: 30, atk: 10, img: "../images/Mildred.png", desc: "Old fire. Unforgiving and wild.", special: "Wildfire Curse", isPet: false },
      { name: "Dr-Burgly", hp: 30, atk: 10, img: "../images/Dr-Burgly.png", desc: "Mad medic. Stitches shadows together.", special: "Panic Injection", isPet: false }
    ];
    
    return fallback[Math.floor(Math.random() * fallback.length)];
  },
  
  // Get enemy team for multi-enemy battles
  getEnemyTeam(count = 2) {
    const enemies = [];
    for (let i = 0; i < count; i++) {
      enemies.push(this.getRandomEnemy());
    }
    return enemies;
  },
  
  // Get Simon ally
  getSimonAlly() {
    return {
      name: "Simon", 
      hp: 15, 
      atk: 6, 
      img: "../images/Simon.png", 
      desc: "Loyal pet spirit. Ready to fight alongside you!", 
      special: "Meowing Chirp", 
      isPet: true
    };
  },
  
  // Get boss enemy
  getBossEnemy() {
    return {
      name: "Shadow Lord",
      hp: 50,
      atk: 15,
      img: "../images/Xavier.png",
      desc: "Master of darkness. The source of all evil in Cruxfade.",
      special: "Dark Vortex",
      isPet: false
    };
  }
};

// Set up battle systems once DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  
  // Enhanced battle state
  window.battleState = {
    getPlayerCharacterData() {
      try {
        const characterKey = sessionStorage.getItem('selectedCharacter');
        const characterData = sessionStorage.getItem('characterData');
        
        // Use session storage data if available
        if (characterKey && characterData) {
          return JSON.parse(characterData);
        }
        
        // Otherwise get from data manager
        return window.DataManager.getPlayerCharacter(characterKey) || 
               window.DataManager.getPlayerCharacter('magdaline');
        
      } catch (e) {
        console.warn('Using fallback character data');
        return window.DataManager.getPlayerCharacter('magdaline');
      }
    },
    
    getSimonAlly() {
      return window.DataManager.getSimonAlly();
    }
  };
  
  // Enhanced battle shared
  window.BattleShared = {
    RosterUtils: {
      getRandomEnemy() {
        return window.DataManager.getRandomEnemy();
      },
      
      getEnemyTeam(count = 2) {
        return window.DataManager.getEnemyTeam(count);
      },
      
      getBossEnemy() {
        return window.DataManager.getBossEnemy();
      }
    }
  };
  
  console.log("✓ Data manager and battle systems ready");
});

console.log("=== SIMPLE DATA LOADER END ===");
