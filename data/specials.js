// ═══════════════════════════════════════════════════════════════════════════════
// SPECIAL MOVES DATA - All special abilities and their effects
// Centralized system for managing character abilities
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIAL MOVE DEFINITIONS
// Complete database of all special abilities
// ═══════════════════════════════════════════════════════════════════════════════

export const SPECIAL_MOVES = {
  // ═══════════════════════════════════════════════════════════════════════════════
  // PLAYER SPECIALS - Hero abilities
  // ═══════════════════════════════════════════════════════════════════════════════
  
  "Plant Blessing": {
    name: "Plant Blessing",
    type: "heal",
    category: "nature",
    power: 10,
    cost: 0,
    cooldown: 1,
    usageLimit: 1,
    
    // Visual and Audio
    animation: "nature_glow",
    sound: "healing_chime",
    color: "#4CAF50",
    
    // Mechanics
    targeting: "self",
    effect: "heal",
    description: "Channels nature's power, healing 10 HP",
    flavorText: "The forest's ancient energy flows through Timothy, mending wounds with the power of growth.",
    
    // Implementation
    execute: (caster, target, battleSystem) => {
      const healAmount = 10;
      battleSystem.setHP(caster, battleSystem.getHP(caster) + healAmount);
      battleSystem.floatHeal(caster, healAmount);
      return {
        success: true,
        message: `${caster.dataset.name} channels nature's power, healing ${healAmount} HP!`,
        healAmount: healAmount
      };
    }
  },

  "Luminous Veil": {
    name: "Luminous Veil",
    type: "heal",
    category: "light",
    power: 8,
    cost: 0,
    cooldown: 1,
    usageLimit: 1,
    
    // Visual and Audio
    animation: "light_burst",
    sound: "divine_heal",
    color: "#FFD700",
    
    // Mechanics
    targeting: "self",
    effect: "heal",
    description: "Heals for 8 HP with divine light",
    flavorText: "Divine radiance surrounds Magdaline, restoring her vitality with celestial energy.",
    
    // Implementation
    execute: (caster, target, battleSystem) => {
      const healAmount = 8;
      battleSystem.setHP(caster, battleSystem.getHP(caster) + healAmount);
      battleSystem.floatHeal(caster, healAmount);
      return {
        success: true,
        message: `${caster.dataset.name} heals for ${healAmount} HP with divine light!`,
        healAmount: healAmount
      };
    }
  },

  "Spark Trick": {
    name: "Spark Trick",
    type: "damage",
    category: "electric",
    power: 15,
    cost: 0,
    cooldown: 1,
    usageLimit: 1,
    
    // Visual and Audio
    animation: "electric_surge",
    sound: "lightning_crack",
    color: "#00BFFF",
    
    // Mechanics
    targeting: "enemy",
    effect: "damage",
    statusEffect: "stun",
    description: "Deals 15 electric damage with stunning power",
    flavorText: "Electricity crackles around Fizzwick as he channels raw lightning into a devastating attack.",
    
    // Implementation
    execute: (caster, target, battleSystem) => {
      const damage = 15;
      battleSystem.setHP(target, battleSystem.getHP(target) - damage);
      battleSystem.floatDamage(target, damage);
      return {
        success: true,
        message: `${caster.dataset.name} unleashes crackling energy for ${damage} damage!`,
        damage: damage,
        statusEffect: "stun"
      };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ENEMY SPECIALS - Villain abilities
  // ═══════════════════════════════════════════════════════════════════════════════

  "Skull Bash": {
    name: "Skull Bash",
    type: "damage",
    category: "physical",
    power: 12,
    cost: 0,
    cooldown: 1,
    usageLimit: 1,
    
    // Visual and Audio
    animation: "brutal_impact",
    sound: "bone_crack",
    color: "#8B0000",
    
    // Mechanics
    targeting: "enemy",
    effect: "damage",
    statusEffect: "stun",
    description: "Delivers a bone-crushing blow for 12 damage",
    flavorText: "Gwar's massive fist connects with devastating force, capable of stunning even the strongest foe.",
    
    // Implementation
    execute: (caster, target, battleSystem) => {
      const damage = 12;
      battleSystem.setHP(target, battleSystem.getHP(target) - damage);
      battleSystem.floatDamage(target, damage);
      return {
        success: true,
        message: `${caster.dataset.name} delivers a bone-crushing blow for ${damage} damage!`,
        damage: damage,
        statusEffect: "stun"
      };
    }
  },

  "Wildfire Curse": {
    name: "Wildfire Curse",
    type: "damage",
    category: "fire",
    power: 10,
    cost: 0,
    cooldown: 1,
    usageLimit: 1,
    
    // Visual and Audio
    animation: "flame_burst",
    sound: "fire_roar",
    color: "#FF4500",
    
    // Mechanics
    targeting: "enemy",
    effect: "damage",
    statusEffect: "burning",
    description: "Engulfs enemies in flames for 10 damage",
    flavorText: "Ancient flames dance around Mildred as she unleashes her burning wrath upon her foes.",
    
    // Implementation
    execute: (caster, target, battleSystem) => {
      const damage = 10;
      battleSystem.setHP(target, battleSystem.getHP(target) - damage);
      battleSystem.floatDamage(target, damage);
      return {
        success: true,
        message: `${caster.dataset.name} engulfs ${target.dataset.name} in flames for ${damage} damage!`,
        damage: damage,
        statusEffect: "burning"
      };
    }
  },

  "Panic Injection": {
    name: "Panic Injection",
    type: "damage",
    category: "psychic",
    power: 8,
    cost: 0,
    cooldown: 1,
    usageLimit: 1,
    
    // Visual and Audio
    animation: "psychic_wave",
    sound: "mind_break",
    color: "#800080",
    
    // Mechanics
    targeting: "enemy",
    effect: "damage",
    statusEffect: "confusion",
    damageType: "psychic",
    description: "Injects terror, dealing 8 psychic damage",
    flavorText: "Dr-Burgly's twisted medicine courses through his victim, inducing overwhelming panic and terror.",
    
    // Implementation
    execute: (caster, target, battleSystem) => {
      const damage = 8;
      battleSystem.setHP(target, battleSystem.getHP(target) - damage);
      battleSystem.floatDamage(target, damage);
      return {
        success: true,
        message: `${caster.dataset.name} injects terror, dealing ${damage} psychic damage!`,
        damage: damage,
        statusEffect: "confusion"
      };
    }
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // PET SPECIALS - Companion abilities
  // ═══════════════════════════════════════════════════════════════════════════════

  "Meowing Chirp": {
    name: "Meowing Chirp",
    type: "buff",
    category: "support",
    power: 3,
    cost: 0,
    cooldown: 1,
    usageLimit: 1,
    
    // Visual and Audio
    animation: "supportive_glow",
    sound: "cheerful_chirp",
    color: "#FFB6C1",
    
    // Mechanics
    targeting: "ally",
    effect: "buff",
    description: "Boosts ally attack by 3 points",
    flavorText: "Simon's encouraging chirp fills allies with determination and fighting spirit.",
    
    // Implementation
    execute: (caster, target, battleSystem) => {
      const currentAtk = battleSystem.getATK(target);
      target.querySelector(".atk").textContent = currentAtk + 3;
      return {
        success: true,
        message: `${caster.dataset.name} boosts ${target.dataset.name}'s attack!`,
        buffAmount: 3
      };
    }
  },

  "Vanishing Sting": {
    name: "Vanishing Sting",
    type: "damage",
    category: "shadow",
    power: 8,
    cost: 0,
    cooldown: 1,
    usageLimit: 1,
    
    // Visual and Audio
    animation: "shadow_strike",
    sound: "whisper_attack",
    color: "#2F2F2F",
    
    // Mechanics
    targeting: "enemy",
    effect: "damage",
    statusEffect: "stealth",
    description: "Hits and vanishes without trace",
    flavorText: "Thorn strikes from the shadows, leaving no trace of the attack save the pain.",
    
    // Implementation
    execute: (caster, target, battleSystem) => {
      const damage = 8;
      battleSystem.setHP(target, battleSystem.getHP(target) - damage);
      battleSystem.floatDamage(target, damage);
      return {
        success: true,
        message: `${caster.dataset.name} strikes from the shadows for ${damage} damage!`,
        damage: damage,
        statusEffect: "stealth"
      };
    }
  },

  "Haunted Stare": {
    name: "Haunted Stare",
    type: "debuff",
    category: "psychic",
    power: 4,
    cost: 0,
    cooldown: 1,
    usageLimit: 1,
    
    // Visual and Audio
    animation: "ghostly_gaze",
    sound: "haunting_whisper",
    color: "#483D8B",
    
    // Mechanics
    targeting: "enemy",
    effect: "debuff",
    description: "Haunts a target, lowering focus",
    flavorText: "Morris's fractured gaze pierces through time, unsettling the target's concentration.",
    
    // Implementation
    execute: (caster, target, battleSystem) => {
      const currentAtk = battleSystem.getATK(target);
      target.querySelector(".atk").textContent = Math.max(1, currentAtk - 4);
      return {
        success: true,
        message: `${caster.dataset.name} haunts ${target.dataset.name}, reducing their focus!`,
        debuffAmount: 4
      };
    }
  },

  "Flame Coil": {
    name: "Flame Coil",
    type: "damage",
    category: "fire",
    power: 5,
    cost: 0,
    cooldown: 1,
    usageLimit: 1,
    
    // Visual and Audio
    animation: "fire_ring",
    sound: "dragon_breath",
    color: "#DC143C",
    
    // Mechanics
    targeting: "all_enemies",
    effect: "damage",
    statusEffect: "burning",
    areaEffect: true,
    description: "Burns enemies in a ring of fire",
    flavorText: "The small dragon unleashes a ring of ancestral flame, honoring its ancient heritage.",
    
    // Implementation
    execute: (caster, targets, battleSystem) => {
      const damage = 5;
      let results = [];
      targets.forEach(target => {
        battleSystem.setHP(target, battleSystem.getHP(target) - damage);
        battleSystem.floatDamage(target, damage);
        results.push({
          target: target.dataset.name,
          damage: damage
        });
      });
      return {
        success: true,
        message: `${caster.dataset.name} burns enemies in a ring of fire for ${damage} damage each!`,
        results: results,
        statusEffect: "burning"
      };
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS EFFECTS SYSTEM
// Definitions for ongoing battle effects
// ═══════════════════════════════════════════════════════════════════════════════

export const STATUS_EFFECTS = {
  burning: {
    name: "Burning",
    type: "damage_over_time",
    duration: 3,
    tickDamage: 3,
    description: "Takes 3 damage per turn",
    color: "#FF4500",
    stackable: false,
    
    onApply: (target) => {
      target.classList.add("status-burning");
    },
    
    onTick: (target, battleSystem) => {
      const damage = 3;
      battleSystem.setHP(target, battleSystem.getHP(target) - damage);
      battleSystem.floatDamage(target, damage);
      return { damage: damage };
    },
    
    onRemove: (target) => {
      target.classList.remove("status-burning");
    }
  },

  bleeding: {
    name: "Bleeding",
    type: "damage_over_time",
    duration: 4,
    tickDamage: 2,
    description: "Takes 2 damage per turn",
    color: "#8B0000",
    stackable: false,
    
    onApply: (target) => {
      target.classList.add("status-bleeding");
    },
    
    onTick: (target, battleSystem) => {
      const damage = 2;
      battleSystem.setHP(target, battleSystem.getHP(target) - damage);
      battleSystem.floatDamage(target, damage);
      return { damage: damage };
    },
    
    onRemove: (target) => {
      target.classList.remove("status-bleeding");
    }
  },

  stunned: {
    name: "Stunned",
    type: "disable",
    duration: 2,
    description: "Cannot act for 2 turns",
    color: "#FFD700",
    stackable: false,
    
    onApply: (target) => {
      target.classList.add("status-stunned");
    },
    
    preventsAction: true,
    
    onRemove: (target) => {
      target.classList.remove("status-stunned");
    }
  },

  confusion: {
    name: "Confused",
    type: "disable",
    duration: 3,
    description: "50% chance to miss attacks",
    color: "#800080",
    stackable: false,
    
    onApply: (target) => {
      target.classList.add("status-confused");
    },
    
    modifyAccuracy: 0.5,
    
    onRemove: (target) => {
      target.classList.remove("status-confused");
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIAL MOVE UTILITIES
// Helper functions for managing special abilities
// ═══════════════════════════════════════════════════════════════════════════════

export const SpecialUtils = {
  // Get special move by name
  getSpecial(name) {
    return SPECIAL_MOVES[name] || null;
  },
  
  // Get all specials by category
  getSpecialsByCategory(category) {
    return Object.keys(SPECIAL_MOVES)
      .filter(key => SPECIAL_MOVES[key].category === category)
      .map(key => ({ key, ...SPECIAL_MOVES[key] }));
  },
  
  // Get all specials by type
  getSpecialsByType(type) {
    return Object.keys(SPECIAL_MOVES)
      .filter(key => SPECIAL_MOVES[key].type === type)
      .map(key => ({ key, ...SPECIAL_MOVES[key] }));
  },
  
  // Execute a special move
  async executeSpecial(specialName, caster, target, battleSystem) {
    const special = this.getSpecial(specialName);
    if (!special) return { success: false, error: "Special move not found" };
    
    // Check if special can be used
    if (caster.dataset.specialUsed === 'true') {
      return { success: false, error: "Special already used" };
    }
    
    // Execute the special
    const result = special.execute(caster, target, battleSystem);
    
    // Mark special as used
    caster.dataset.specialUsed = 'true';
    
    // Apply visual effects
    caster.classList.add("special-glow");
    battleSystem.floatSpecial(caster);
    
    // Clean up after delay
    setTimeout(() => {
      caster.classList.remove("special-glow");
    }, 1200);
    
    return result;
  },
  
  // Get random special by criteria
  getRandomSpecial(criteria = {}) {
    let filtered = Object.keys(SPECIAL_MOVES);
    
    if (criteria.type) {
      filtered = filtered.filter(key => SPECIAL_MOVES[key].type === criteria.type);
    }
    
    if (criteria.category) {
      filtered = filtered.filter(key => SPECIAL_MOVES[key].category === criteria.category);
    }
    
    if (filtered.length === 0) return null;
    
    const randomKey = filtered[Math.floor(Math.random() * filtered.length)];
    return { key: randomKey, ...SPECIAL_MOVES[randomKey] };
  },

  // Calculate special move effectiveness
  calculateEffectiveness(special, caster, target) {
    let effectiveness = 1.0;
    
    // Type advantages could be implemented here
    // Fire vs Ice, Electric vs Water, etc.
    
    return effectiveness;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT FOR MODULE SYSTEM
// Make available for import in other files
// ═══════════════════════════════════════════════════════════════════════════════

// For ES6 modules
export default {
  SPECIAL_MOVES,
  STATUS_EFFECTS,
  SpecialUtils
};

// For older browsers/Node.js compatibility
if (typeof window !== 'undefined') {
  window.SpecialsData = {
    SPECIAL_MOVES,
    STATUS_EFFECTS,
    SpecialUtils
  };
}