// ═══════════════════════════════════════════════════════════════════════════════
// CHARACTERS DATA - Player character definitions
// All playable characters with stats, images, and abilities
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN CHARACTERS - Primary player choices
// Balanced for Level 1 encounters
// ═══════════════════════════════════════════════════════════════════════════════

export const PLAYER_CHARACTERS = {
  magdaline: {
    // Basic Information
    name: "Magdaline",
    type: "Healer",
    rarity: "common",
    isPet: false,
    
    // Combat Stats
    hp: 30,
    atk: 10,
    speed: 6,
    defense: 8,
    
    // Visual Assets
    img: "../images/Magdaline.png",
    portraitImg: "../images/Magdaline-01.png",
    
    // Character Lore
    desc: "Gentle healer. Touched by glimmering light.",
    backstory: "A compassionate soul who discovered her healing powers during a moment of great need. The light that flows through her brings hope to allies and fear to those who embrace darkness.",
    
    // Combat Abilities
    special: {
      name: "Luminous Veil",
      description: "Heals for 8 HP with divine light",
      type: "heal",
      power: 8,
      cost: 0,
      cooldown: 1,
      usageLimit: 1
    },
    
    // Character Progression
    level: 1,
    experience: 0,
    unlockLevel: 1
  },

  fizzwick: {
    // Basic Information
    name: "Fizzwick",
    type: "Striker",
    rarity: "common",
    isPet: false,
    
    // Combat Stats
    hp: 30,
    atk: 10,
    speed: 9,
    defense: 5,
    
    // Visual Assets
    img: "../images/Fizzwick.png",
    portraitImg: "../images/Fizzwick-01.png",
    
    // Character Lore
    desc: "Fast, clever, and full of sparks.",
    backstory: "A quick-witted trickster whose body crackles with electrical energy. Once a simple tinker, an accident with a lightning rod gave him powers beyond his wildest dreams.",
    
    // Combat Abilities
    special: {
      name: "Spark Trick",
      description: "Deals 15 electric damage with stunning power",
      type: "damage",
      power: 15,
      cost: 0,
      cooldown: 1,
      usageLimit: 1,
      effect: "stun"
    },
    
    // Character Progression
    level: 1,
    experience: 0,
    unlockLevel: 1
  },

  timothy: {
    // Basic Information
    name: "Timothy",
    type: "Support",
    rarity: "common",
    isPet: false,
    
    // Combat Stats
    hp: 30,
    atk: 10,
    speed: 7,
    defense: 7,
    
    // Visual Assets
    img: "../images/Timothy.png",
    portraitImg: "../images/Timothy-01.png",
    
    // Character Lore
    desc: "Brave and kind. Searches for sprouting light.",
    backstory: "A nature-loving warrior who believes in the power of growth and renewal. His connection to the earth allows him to channel the forest's healing energy in battle.",
    
    // Combat Abilities
    special: {
      name: "Plant Blessing",
      description: "Channels nature's power, healing 10 HP",
      type: "heal",
      power: 10,
      cost: 0,
      cooldown: 1,
      usageLimit: 1
    },
    
    // Character Progression
    level: 1,
    experience: 0,
    unlockLevel: 1
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PET CHARACTERS - Companion spirits (Future expansion)
// Smaller support characters that assist main fighters
// ═══════════════════════════════════════════════════════════════════════════════

export const PET_CHARACTERS = {
  simon: {
    // Basic Information
    name: "Simon",
    type: "Support Pet",
    rarity: "common",
    isPet: true,
    
    // Combat Stats
    hp: 15,
    atk: 5,
    speed: 8,
    defense: 3,
    
    // Visual Assets
    img: "../images/Simon.png",
    
    // Character Lore
    desc: "Pet spirit. Encourages and uplifts allies.",
    backstory: "A playful spirit companion who brings joy and courage to battle through cheerful sounds and positive energy.",
    
    // Combat Abilities
    special: {
      name: "Meowing Chirp",
      description: "Boosts ally attack by 3 points",
      type: "buff",
      power: 3,
      cost: 0,
      cooldown: 1,
      usageLimit: 1,
      target: "ally"
    },
    
    // Character Progression
    level: 1,
    experience: 0,
    unlockLevel: 3
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHARACTER UTILITIES
// Helper functions for character management
// ═══════════════════════════════════════════════════════════════════════════════

export const CharacterUtils = {
  // Get character by key
  getCharacter(key) {
    return PLAYER_CHARACTERS[key] || PET_CHARACTERS[key] || null;
  },
  
  // Get all available characters for selection
  getAvailableCharacters() {
    return Object.keys(PLAYER_CHARACTERS).map(key => ({
      key,
      ...PLAYER_CHARACTERS[key]
    }));
  },
  
  // Get characters by type
  getCharactersByType(type) {
    const all = { ...PLAYER_CHARACTERS, ...PET_CHARACTERS };
    return Object.keys(all)
      .filter(key => all[key].type === type)
      .map(key => ({ key, ...all[key] }));
  },
  
  // Get character combat stats
  getCombatStats(key) {
    const character = this.getCharacter(key);
    if (!character) return null;
    
    return {
      hp: character.hp,
      atk: character.atk,
      speed: character.speed,
      defense: character.defense,
      special: character.special
    };
  },
  
  // Check if character is unlocked
  isUnlocked(key, playerLevel = 1) {
    const character = this.getCharacter(key);
    return character ? playerLevel >= character.unlockLevel : false;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT FOR MODULE SYSTEM
// Make available for import in other files
// ═══════════════════════════════════════════════════════════════════════════════

// For ES6 modules
export default {
  PLAYER_CHARACTERS,
  PET_CHARACTERS,
  CharacterUtils
};

// For older browsers/Node.js compatibility
if (typeof window !== 'undefined') {
  window.CharacterData = {
    PLAYER_CHARACTERS,
    PET_CHARACTERS,
    CharacterUtils
  };
}