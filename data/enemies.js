// ═══════════════════════════════════════════════════════════════════════════════
// ENEMIES DATA - Enemy character definitions
// All enemy types organized by level and difficulty
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 1 ENEMIES - Beginner opponents
// Balanced for new players, moderate challenge
// ═══════════════════════════════════════════════════════════════════════════════

export const LEVEL_1_ENEMIES = {
  gwar: {
    // Basic Information
    name: "Gwar",
    type: "Brute",
    rarity: "common",
    isPet: false,
    level: 1,
    
    // Combat Stats
    hp: 30,
    atk: 10,
    speed: 4,
    defense: 9,
    
    // Visual Assets
    img: "../images/Gwar.png",
    
    // Character Lore
    desc: "Heavy brute. Follows the sound of war.",
    backstory: "A massive warrior whose love of battle is matched only by his simple nature. The sound of clashing weapons draws him like a moth to flame.",
    personality: "Aggressive, simple-minded, enjoys conflict",
    
    // Combat Abilities
    special: {
      name: "Skull Bash",
      description: "Delivers a bone-crushing blow for 12 damage",
      type: "damage",
      power: 12,
      cost: 0,
      cooldown: 1,
      usageLimit: 1,
      effect: "stun"
    },
    
    // AI Behavior
    aiType: "aggressive",
    specialChance: 0.25,
    preferredTargets: ["lowest_hp", "player"]
  },

  mildred: {
    // Basic Information
    name: "Mildred",
    type: "Caster",
    rarity: "common",
    isPet: false,
    level: 1,
    
    // Combat Stats
    hp: 25,
    atk: 12,
    speed: 7,
    defense: 6,
    
    // Visual Assets
    img: "../images/Mildred.png",
    
    // Character Lore
    desc: "Old fire. Unforgiving and wild.",
    backstory: "An ancient flame spirit whose anger has burned for centuries. Her fire magic is unpredictable and dangerous to friend and foe alike.",
    personality: "Volatile, unforgiving, chaotic",
    
    // Combat Abilities
    special: {
      name: "Wildfire Curse",
      description: "Engulfs enemies in flames for 10 damage",
      type: "damage",
      power: 10,
      cost: 0,
      cooldown: 1,
      usageLimit: 1,
      effect: "burning",
      areaEffect: false
    },
    
    // AI Behavior
    aiType: "chaotic",
    specialChance: 0.3,
    preferredTargets: ["random", "highest_atk"]
  },

  drBurgly: {
    // Basic Information
    name: "Dr-Burgly",
    type: "Manipulator",
    rarity: "common",
    isPet: false,
    level: 1,
    
    // Combat Stats
    hp: 28,
    atk: 8,
    speed: 6,
    defense: 7,
    
    // Visual Assets
    img: "../images/Dr-Burgly.png",
    
    // Character Lore
    desc: "Mad medic. Stitches shadows together.",
    backstory: "A deranged doctor who experiments with dark magic and forbidden medicine. His treatments are often worse than the original ailment.",
    personality: "Sadistic, scientific, unpredictable",
    
    // Combat Abilities
    special: {
      name: "Panic Injection",
      description: "Injects terror, dealing 8 psychic damage",
      type: "damage",
      power: 8,
      cost: 0,
      cooldown: 1,
      usageLimit: 1,
      effect: "confusion",
      damageType: "psychic"
    },
    
    // AI Behavior
    aiType: "tactical",
    specialChance: 0.35,
    preferredTargets: ["support", "highest_hp"]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// LEVEL 2 ENEMIES - Intermediate opponents (Future expansion)
// More challenging foes with complex abilities
// ═══════════════════════════════════════════════════════════════════════════════

export const LEVEL_2_ENEMIES = {
  shelindra: {
    // Basic Information
    name: "Shelindra",
    type: "Oracle",
    rarity: "uncommon",
    isPet: false,
    level: 2,
    
    // Combat Stats
    hp: 35,
    atk: 12,
    speed: 8,
    defense: 7,
    
    // Visual Assets
    img: "../images/Shelindra.png",
    
    // Character Lore
    desc: "Dark oracle. Pierces truth with silence.",
    backstory: "A mysterious seer who speaks in riddles and sees through the veil of reality. Her silent gaze can drain the hope from even the bravest warrior.",
    personality: "Mysterious, calculating, ominous",
    
    // Combat Abilities
    special: {
      name: "Void Whisper",
      description: "Drains hope and lowers defense",
      type: "debuff",
      power: 3,
      cost: 0,
      cooldown: 1,
      usageLimit: 1,
      effect: "defense_down",
      damageType: "psychic"
    },
    
    // AI Behavior
    aiType: "support_killer",
    specialChance: 0.4,
    preferredTargets: ["healer", "support"]
  },

  bill: {
    // Basic Information
    name: "Bill",
    type: "Wanderer",
    rarity: "uncommon",
    isPet: false,
    level: 2,
    
    // Combat Stats
    hp: 32,
    atk: 14,
    speed: 9,
    defense: 8,
    
    // Visual Assets
    img: "../images/Bill.png",
    
    // Character Lore
    desc: "Wandering blade. Kind eyes, sharp horns.",
    backstory: "A conflicted warrior whose gentle nature belies his deadly skill with a blade. He fights reluctantly but with devastating efficiency.",
    personality: "Reluctant, skilled, conflicted",
    
    // Combat Abilities
    special: {
      name: "Horn Sweep",
      description: "Hits all enemies in a wide arc",
      type: "damage",
      power: 8,
      cost: 0,
      cooldown: 1,
      usageLimit: 1,
      areaEffect: true,
      targeting: "all_enemies"
    },
    
    // AI Behavior
    aiType: "balanced",
    specialChance: 0.3,
    preferredTargets: ["balanced"]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENEMY PETS - Companion creatures
// Smaller enemies that support main foes
// ═══════════════════════════════════════════════════════════════════════════════

export const ENEMY_PETS = {
  thorn: {
    // Basic Information
    name: "Thorn",
    type: "Shadow Pet",
    rarity: "common",
    isPet: true,
    level: 1,
    
    // Combat Stats
    hp: 12,
    atk: 6,
    speed: 10,
    defense: 2,
    
    // Visual Assets
    img: "../images/Thorn.png",
    
    // Character Lore
    desc: "Vengeful whisper. Strikes when unseen.",
    backstory: "A shadow spirit that feeds on negative emotions. It appears as a dark whisper in the corner of one's vision.",
    personality: "Sneaky, vengeful, elusive",
    
    // Combat Abilities
    special: {
      name: "Vanishing Sting",
      description: "Hits and vanishes without trace",
      type: "damage",
      power: 8,
      cost: 0,
      cooldown: 1,
      usageLimit: 1,
      effect: "stealth"
    },
    
    // AI Behavior
    aiType: "hit_and_run",
    specialChance: 0.4,
    preferredTargets: ["weakest", "isolated"]
  },

  morris: {
    // Basic Information
    name: "Morris",
    type: "Cursed Pet",
    rarity: "common",
    isPet: true,
    level: 1,
    
    // Combat Stats
    hp: 10,
    atk: 4,
    speed: 5,
    defense: 4,
    
    // Visual Assets
    img: "../images/Morris.png",
    
    // Character Lore
    desc: "Cursed wanderer. Carries broken time.",
    backstory: "Once a normal creature, Morris was caught in a temporal anomaly that fractured his existence across multiple timelines.",
    personality: "Confused, lost, haunting",
    
    // Combat Abilities
    special: {
      name: "Haunted Stare",
      description: "Haunts a target, lowering focus",
      type: "debuff",
      power: 4,
      cost: 0,
      cooldown: 1,
      usageLimit: 1,
      effect: "attack_down"
    },
    
    // AI Behavior
    aiType: "debuffer",
    specialChance: 0.35,
    preferredTargets: ["strongest", "threat"]
  },

  dragon: {
    // Basic Information
    name: "Dragon",
    type: "Ancient Pet",
    rarity: "rare",
    isPet: true,
    level: 2,
    
    // Combat Stats
    hp: 18,
    atk: 8,
    speed: 7,
    defense: 6,
    
    // Visual Assets
    img: "../images/Dragon.png",
    
    // Character Lore
    desc: "Ancient flame. Silent guardian.",
    backstory: "A miniature dragon bound to serve dark masters. Despite its size, it retains the pride and fire of its ancient lineage.",
    personality: "Proud, loyal, fierce",
    
    // Combat Abilities
    special: {
      name: "Flame Coil",
      description: "Burns enemies in a ring of fire",
      type: "damage",
      power: 5,
      cost: 0,
      cooldown: 1,
      usageLimit: 1,
      effect: "burning",
      areaEffect: true
    },
    
    // AI Behavior
    aiType: "guardian",
    specialChance: 0.3,
    preferredTargets: ["threat_to_master", "closest"]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENEMY UTILITIES
// Helper functions for enemy management and AI
// ═══════════════════════════════════════════════════════════════════════════════

export const EnemyUtils = {
  // Get enemies by level
  getEnemiesByLevel(level) {
    switch (level) {
      case 1:
        return Object.keys(LEVEL_1_ENEMIES).map(key => ({
          key,
          ...LEVEL_1_ENEMIES[key]
        }));
      case 2:
        return Object.keys(LEVEL_2_ENEMIES).map(key => ({
          key,
          ...LEVEL_2_ENEMIES[key]
        }));
      default:
        return [];
    }
  },
  
  // Get random enemy for level
  getRandomEnemy(level = 1) {
    const enemies = this.getEnemiesByLevel(level);
    if (enemies.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * enemies.length);
    return enemies[randomIndex];
  },
  
  // Get enemy pets
  getEnemyPets() {
    return Object.keys(ENEMY_PETS).map(key => ({
      key,
      ...ENEMY_PETS[key]
    }));
  },
  
  // Get random pet
  getRandomPet() {
    const pets = this.getEnemyPets();
    if (pets.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * pets.length);
    return pets[randomIndex];
  },
  
  // Get enemy by key
  getEnemy(key) {
    return LEVEL_1_ENEMIES[key] || 
           LEVEL_2_ENEMIES[key] || 
           ENEMY_PETS[key] || 
           null;
  },
  
  // Get enemies by AI type
  getEnemiesByAI(aiType, level = 1) {
    const enemies = this.getEnemiesByLevel(level);
    return enemies.filter(enemy => enemy.aiType === aiType);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT FOR MODULE SYSTEM
// Make available for import in other files
// ═══════════════════════════════════════════════════════════════════════════════

// For ES6 modules
export default {
  LEVEL_1_ENEMIES,
  LEVEL_2_ENEMIES,
  ENEMY_PETS,
  EnemyUtils
};

// For older browsers/Node.js compatibility
if (typeof window !== 'undefined') {
  window.EnemyData = {
    LEVEL_1_ENEMIES,
    LEVEL_2_ENEMIES,
    ENEMY_PETS,
    EnemyUtils
  };
}