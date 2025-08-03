// ═══════════════════════════════════════════════════════════════════════════════
// REPLACE js/battle-shared.js with this simplified version
// ═══════════════════════════════════════════════════════════════════════════════

console.log("=== SIMPLE BATTLE SHARED START ===");

// This will be set up by data-loader.js, but provide fallback
if (!window.battleState) {
  window.battleState = {
    getPlayerCharacterData() {
      try {
        const characterKey = sessionStorage.getItem('selectedCharacter');
        const characterData = sessionStorage.getItem('characterData');
        
        if (characterKey && characterData) {
          return JSON.parse(characterData);
        }
        
        // Ultimate fallback
        return {
          name: "Magdaline", 
          hp: 30, 
          atk: 10, 
          img: "../images/Magdaline.png", 
          desc: "Gentle healer. Touched by glimmering light.", 
          special: "Luminous Veil", 
          isPet: false
        };
        
      } catch (e) {
        console.warn('Could not load character from session storage');
        return {
          name: "Magdaline", 
          hp: 30, 
          atk: 10, 
          img: "../images/Magdaline.png", 
          desc: "Gentle healer. Touched by glimmering light.", 
          special: "Luminous Veil", 
          isPet: false
        };
      }
    },
    
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
    }
  };
}

if (!window.BattleShared) {
  window.BattleShared = {
    RosterUtils: {
      getRandomEnemy() {
        const fallbackEnemies = [
          { name: "Gwar", hp: 30, atk: 10, img: "../images/Gwar.png", desc: "Heavy brute. Follows the sound of war.", special: "Skull Bash", isPet: false },
          { name: "Mildred", hp: 30, atk: 10, img: "../images/Mildred.png", desc: "Old fire. Unforgiving and wild.", special: "Wildfire Curse", isPet: false },
          { name: "Dr-Burgly", hp: 30, atk: 10, img: "../images/Dr-Burgly.png", desc: "Mad medic. Stitches shadows together.", special: "Panic Injection", isPet: false }
        ];
        return fallbackEnemies[Math.floor(Math.random() * fallbackEnemies.length)];
      },
      
      getEnemyTeam(count = 2) {
        const enemies = [];
        for (let i = 0; i < count; i++) {
          enemies.push(this.getRandomEnemy());
        }
        return enemies;
      },
      
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
    }
  };
}

console.log("=== SIMPLE BATTLE SHARED END ===");
