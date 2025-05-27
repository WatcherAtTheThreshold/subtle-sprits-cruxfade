console.log("=== BATTLE SHARED LOADING START ===");

// Simple character data for Level 1
const LEVEL_1_CHARACTERS = {
  magdaline: { name: "Magdaline", hp: 30, atk: 10, img: "images/Magdaline.png", desc: "Gentle healer. Touched by glimmering light.", special: "Luminous Veil", isPet: false },
  fizzwick: { name: "Fizzwick", hp: 30, atk: 10, img: "images/Fizzwick.png", desc: "Fast, clever, and full of sparks.", special: "Spark Trick", isPet: false },
  timothy: { name: "Timothy", hp: 30, atk: 10, img: "images/Timothy.png", desc: "Brave and kind. Searches for sprouting light.", special: "Plant Blessing", isPet: false }
};

const LEVEL_1_ENEMIES = [
  { name: "Gwar", hp: 30, atk: 10, img: "images/Gwar.png", desc: "Heavy brute. Follows the sound of war.", special: "Skull Bash", isPet: false },
  { name: "Mildred", hp: 30, atk: 10, img: "images/Mildred.png", desc: "Old fire. Unforgiving and wild.", special: "Wildfire Curse", isPet: false },
  { name: "Dr-Burgly", hp: 30, atk: 10, img: "images/Dr-Burgly.png", desc: "Mad medic. Stitches shadows together.", special: "Panic Injection", isPet: false }
];

// Simple battle state
const battleState = {
  selectedCharacter: null,
  
  getPlayerCharacterData() {
    try {
      const characterKey = sessionStorage.getItem('selectedCharacter');
      if (characterKey && LEVEL_1_CHARACTERS[characterKey]) {
        return LEVEL_1_CHARACTERS[characterKey];
      }
    } catch (e) {
      console.warn('Could not load character from session storage');
    }
    // Fallback to Magdaline
    return LEVEL_1_CHARACTERS.magdaline;
  }
};

// Simple roster utils
const RosterUtils = {
  getRandomEnemy() {
    const randomIndex = Math.floor(Math.random() * LEVEL_1_ENEMIES.length);
    return LEVEL_1_ENEMIES[randomIndex];
  }
};

// Export everything to window
window.BattleShared = {
  RosterUtils: RosterUtils
};

window.battleState = battleState;

console.log("=== BATTLE SHARED LOADING END ===");
