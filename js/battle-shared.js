// ═══════════════════════════════════════════════════════════════════════════════
// BATTLE SHARED - Common utilities, character data, mechanics across all battle types
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// CHARACTER DATA - LEVEL 1 ROSTER
// ═══════════════════════════════════════════════════════════════════════════════

const LEVEL_1_PLAYER_ROSTER = [
  { name: "Timothy", hp: 30, atk: 10, img: "images/Timothy.png", fullImg: "images/Timothy-01.png", desc: "Brave and kind. Searches for sprouting light.", special: "Plant Blessing", isPet: false },
  { name: "Magdaline", hp: 30, atk: 10, img: "images/Magdaline.png", fullImg: "images/Magdaline-01.png", desc: "Gentle healer. Touched by glimmering light.", special: "Luminous Veil", isPet: false },
  { name: "Fizzwick", hp: 30, atk: 10, img: "images/Fizzwick.png", fullImg: "images/Fizzwick-01.png", desc: "Fast, clever, and full of sparks.", special: "Spark Trick", isPet: false },
  { name: "Simon", hp: 10, atk: 5, img: "images/Simon.png", fullImg: "images/Simon.png", desc: "Pet spirit. Encourages and uplifts allies.", special: "Meowing Chirp", isPet: true }
];

const LEVEL_1_ENEMY_MAINS = [
  { name: "Gwar", hp: 30, atk: 10, img: "images/Gwar.png", fullImg: "images/Gwar.png", desc: "Heavy brute. Follows the sound of war.", special: "Skull Bash", isPet: false },
  { name: "Mildred", hp: 30, atk: 10, img: "images/Mildred.png", fullImg: "images/Mildred.png", desc: "Old fire. Unforgiving and wild.", special: "Wildfire Curse", isPet: false },
  { name: "Dr-Burgly", hp: 30, atk: 10, img: "images/Dr-Burgly.png", fullImg: "images/Dr-Burgly.png", desc: "Mad medic. Stitches shadows together.", special: "Panic Injection", isPet: false },
  { name: "Shelindra", hp: 30, atk: 10, img: "images/Shelindra.png", fullImg: "images/Shelindra.png", desc: "Dark oracle. Pierces truth with silence.", special: "Void Whisper", isPet: false },//
  { name: "Bill", hp: 30, atk: 10, img: "images/Bill.png", fullImg: "images/Bill.png", desc: "Wandering blade. Kind eyes, sharp horns.", special: "Horn Sweep", isPet: false },
  { name: "Draxel", hp: 30, atk: 10, img: "images/Draxel.png", fullImg: "images/Draxel.png", desc: "Shrouded hunter. Lurks at the edge.", special: "Ebon Fangs", isPet: false },
  { name: "Xavier", hp: 30, atk: 10, img: "images/Xavier.png", fullImg: "images/Xavier.png", desc: "Unstable energy. Crackles when provoked.", special: "Static Shock", isPet: false },
  { name: "Tong", hp: 30, atk: 10, img: "images/Tong.png", fullImg: "images/Tong.png", desc: "Massive brute. Calm until riled.", special: "Tectonic Slam", isPet: false },
  { name: "Tim_blue", hp: 30, atk: 10, img: "images/Tim_blue.png", fullImg: "images/Tim_blue.png", desc: "Experimental bot. Built for mischief.", special: "Spark Bomb", isPet: false },
  { name: "Tim_pink", hp: 30, atk: 10, img: "images/Tim_pink.png", fullImg: "images/Tim_pink.png", desc: "Colorful copy. Brighter than real.", special: "Mirror Flash", isPet: false }
];

const LEVEL_1_ENEMY_PETS = [
  { name: "Thorn", hp: 10, atk: 5, img: "images/Thorn.png", fullImg: "images/Thorn.png", desc: "Vengeful whisper. Strikes when unseen.", special: "Vanishing Sting", isPet: true },
  { name: "Morris", hp: 10, atk: 5, img: "images/Morris.png", fullImg: "images/Morris.png", desc: "Cursed wanderer. Carries broken time.", special: "Haunted Stare", isPet: true },
  { name: "Dragon", hp: 10, atk: 5, img: "images/Dragon.png", fullImg: "images/Dragon.png", desc: "Ancient flame. Silent guardian.", special: "Flame Coil", isPet: true }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIAL MOVE EFFECTS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

const SPECIAL_EFFECTS = {
  // Player specials
  "Plant Blessing": "Heals allies over time.",
  "Luminous Veil": "Shields the team from the next hit.", 
  "Spark Trick": "Deals extra damage and stuns.",
  "Meowing Chirp": "Boosts morale, raising attack.",
  
  // Enemy specials
  "Skull Bash": "Stuns and damages the target.",
  "Wildfire Curse": "Applies burning damage over time.",
  "Panic Injection": "Confuses and weakens.",
  "Void Whisper": "Drains hope and lowers defense.",
  "Horn Sweep": "Hits all enemies in a wide arc.",
  "Ebon Fangs": "Pierces armor and causes bleeding.",
  "Static Shock": "Paralyzes one opponent.",
  "Tectonic Slam": "Shakes the battlefield.",
  "Spark Bomb": "Deals explosive damage.",
  "Mirror Flash": "Reflects incoming attacks.",
  "Vanishing Sting": "Hits and vanishes without trace.",
  "Haunted Stare": "Haunts a target, lowering focus.",
  "Flame Coil": "Burns enemies in a ring of fire."
};

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL BATTLE STATE MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

class BattleState {
  constructor() {
    this.currentLevel = 1;
    this.roundCount = 1;
    this.battleCount = 1;
    this.defeatedEnemyNames = [];
    this.gameStarted = false;
    this.isProcessingTurn = false;
    this.selectedPlayerCharacter = null;
  }

  reset() {
    this.roundCount = 1;
    this.gameStarted = false;
    this.isProcessingTurn = false;
  }

  nextBattle() {
    this.battleCount++;
    this.reset();
  }

  nextLevel() {
    this.currentLevel++;
    this.battleCount = 1;
    this.defeatedEnemyNames = [];
    this.reset();
  }

  // Get character data from session storage (from character select)
  loadSelectedCharacter() {
    try {
      const characterKey = sessionStorage.getItem('selectedCharacter');
      const characterData = sessionStorage.getItem('characterData');
      
      if (characterKey && characterData) {
        this.selectedPlayerCharacter = {
          key: characterKey,
          data: JSON.parse(characterData)
        };
        return true;
      }
    } catch (e) {
      console.warn('Could not load selected character from session storage');
    }
    
    // Fallback to Magdaline if no selection found
    this.selectedPlayerCharacter = {
      key: 'magdaline',
      data: LEVEL_1_PLAYER_ROSTER.find(char => char.name === 'Magdaline')
    };
    return false;
  }

  getPlayerCharacterData() {
    if (!this.selectedPlayerCharacter) {
      this.loadSelectedCharacter();
    }
    return this.selectedPlayerCharacter.data;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEVICE AND VIEWPORT UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const DeviceUtils = {
  isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: this.isMobile(),
      isLandscape: window.innerWidth > window.innerHeight,
      isSmallScreen: window.innerWidth < 480
    };
  },

  // Mobile-safe text truncation
  truncateForMobile(text, maxLength = null) {
    const viewport = this.getViewportInfo();
    if (!maxLength) {
      maxLength = viewport.isMobile ? (viewport.isSmallScreen ? 35 : 50) : 100;
    }
    return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
  },

  // Get appropriate font sizes for mobile
  getResponsiveFontSize(base = '1rem') {
    const viewport = this.getViewportInfo();
    if (viewport.isSmallScreen) return `calc(${base} * 0.8)`;
    if (viewport.isMobile) return `calc(${base} * 0.9)`;
    return base;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CARD DATA UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const CardUtils = {
  // Safe HP getter with validation
  getHP(card) {
    if (!card) return 0;
    const hpElement = card.querySelector(".hp");
    if (!hpElement) return 0;
    const hp = parseInt(hpElement.textContent) || 0;
    return Math.max(0, hp);
  },

  // Safe HP setter with validation and effects
  setHP(card, val, skipEffects = false) {
    if (!card) return;
    const hpElement = card.querySelector(".hp");
    if (!hpElement) return;
    
    const newHP = Math.max(0, Math.floor(val));
    const oldHP = this.getHP(card);
    hpElement.textContent = newHP;
    
    // Trigger KO effects if needed
    if (newHP <= 0 && oldHP > 0 && !card.classList.contains("defeated") && !skipEffects) {
      this.markAsDefeated(card);
    }
    
    return newHP;
  },

  // Safe ATK getter
  getATK(card) {
    if (!card) return 0;
    const atkElement = card.querySelector(".atk");
    if (!atkElement) return 0;
    return parseInt(atkElement.textContent) || 0;
  },

  // Safe ATK setter
  setATK(card, val) {
    if (!card) return;
    const atkElement = card.querySelector(".atk");
    if (!atkElement) return;
    atkElement.textContent = Math.max(1, Math.floor(val));
  },

  // Get living (non-defeated) cards from a collection
  getLiving(cards) {
    if (!cards) return [];
    return Array.from(cards).filter(card => 
      card && this.getHP(card) > 0 && !card.classList.contains("defeated")
    );
  },

  // Mark card as defeated with effects
  markAsDefeated(card) {
    if (!card || card.classList.contains("defeated")) return;
    
    card.classList.add("defeated");
    
    // Trigger floating KO text if BattleUI is available
    if (window.BattleUI && window.BattleUI.floatKO) {
      window.BattleUI.floatKO(card);
    }
  },

  // Get card's character name safely
  getCharacterName(card) {
    if (!card) return "Unknown";
    const nameElement = card.querySelector(".name-tag");
    return nameElement ? nameElement.textContent.trim() : "Unknown";
  },

  // Check if card is a pet
  isPet(card) {
    return card && card.dataset.isPet === 'true';
  },

  // Get special move name
  getSpecialMove(card) {
    if (!card) return null;
    const specialElement = card.querySelector(".special-move");
    return specialElement ? specialElement.textContent.trim() : null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM AND OPPONENT UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

const TeamUtils = {
  // Get all team members for a given card
  getTeamMembers(card) {
    if (!card) return [];
    const isPlayerCard = card.closest("#player-team") !== null;
    const teamSelector = isPlayerCard ? "#player-team .card" : "#enemy-team .card";
    return Array.from(document.querySelectorAll(teamSelector));
  },

  // Get opponent team for a given card
  getOpponentTeam(card) {
    if (!card) return [];
    const isPlayerCard = card.closest("#player-team") !== null;
    const teamSelector = isPlayerCard ? "#enemy-team .card" : "#player-team .card";
    return Array.from(document.querySelectorAll(teamSelector));
  },

  // Check if card belongs to player team
  isPlayerCard(card) {
    return card && card.closest("#player-team") !== null;
  },

  // Get random living opponent
  getRandomLivingOpponent(card) {
    const opponents = this.getOpponentTeam(card);
    const livingOpponents = CardUtils.getLiving(opponents);
    if (livingOpponents.length === 0) return null;
    return livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
  },

  // Get all living teammates (excluding self)
  getLivingTeammates(card) {
    const teammates = this.getTeamMembers(card);
    const livingTeammates = CardUtils.getLiving(teammates);
    return livingTeammates.filter(teammate => teammate !== card);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DAMAGE CALCULATION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

const DamageUtils = {
  // Calculate random damage based on card's attack
  calculateRandomDamage(card) {
    if (!card) return 0;
    
    const atk = CardUtils.getATK(card);
    const isPet = CardUtils.isPet(card);
    
    if (isPet) {
      // Pets do 3-5 damage
      return Math.floor(Math.random() * 3) + 3;
    } else {
      // Regular characters do 5 to (ATK-1) damage
      const minDamage = 5;
      const maxDamage = Math.max(minDamage, atk - 1);
      return Math.floor(Math.random() * (maxDamage - minDamage + 1)) + minDamage;
    }
  },

  // Apply damage with all modifiers and effects
  applyDamage(target, baseDamage, source = null, damageType = 'normal') {
    if (!target || baseDamage <= 0) return 0;
    
    let finalDamage = Math.floor(baseDamage);
    
    // Check for damage reduction effects
    if (target.statusEffects) {
      // Shield blocks damage completely
      if (target.statusEffects.shield) {
        StatusEffects.removeStatusEffect(target, "shield");
        return 0; // No damage dealt
      }
      
      // Reflect damage back to source
      if (target.statusEffects.reflect && source) {
        StatusEffects.removeStatusEffect(target, "reflect");
        // Apply half damage back to source
        this.applyDamage(source, Math.floor(finalDamage / 2), null, 'reflected');
        return 0; // No damage to original target
      }
    }
    
    // Apply damage
    const newHP = CardUtils.setHP(target, CardUtils.getHP(target) - finalDamage);
    
    // Trigger visual effects if BattleUI is available
    if (window.BattleUI) {
      if (window.BattleUI.floatDamage) {
        window.BattleUI.floatDamage(target, finalDamage);
      }
      
      // Add damage glow effect
      target.classList.add("damage-glow");
      setTimeout(() => target.classList.remove("damage-glow"), 900);
    }
    
    return finalDamage;
  },

  // Apply healing
  applyHealing(target, healAmount) {
    if (!target || healAmount <= 0) return 0;
    
    const currentHP = CardUtils.getHP(target);
    const newHP = CardUtils.setHP(target, currentHP + Math.floor(healAmount), true);
    const actualHealing = newHP - currentHP;
    
    // Trigger visual effects if BattleUI is available
    if (window.BattleUI && window.BattleUI.floatHeal && actualHealing > 0) {
      window.BattleUI.floatHeal(target, actualHealing);
    }
    
    return actualHealing;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS EFFECT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

const StatusEffects = {
  // Add status effect to card
  addStatusEffect(card, effect, duration = 3) {
    if (!card) return;
    
    if (!card.statusEffects) card.statusEffects = {};
    card.statusEffects[effect] = Math.max(1, Math.floor(duration));
    
    // Add visual indicator
    card.classList.add(`status-${effect}`);
  },

  // Remove status effect from card
  removeStatusEffect(card, effect) {
    if (!card || !card.statusEffects) return;
    
    delete card.statusEffects[effect];
    card.classList.remove(`status-${effect}`);
  },

  // Process all status effects on a card (called at start of turn)
  processStatusEffects(card) {
    if (!card || !card.statusEffects) return;
    
    const effects = Object.keys(card.statusEffects);
    for (const effect of effects) {
      this.applyStatusEffect(card, effect);
      
      // Decrease duration
      card.statusEffects[effect]--;
      if (card.statusEffects[effect] <= 0) {
        this.removeStatusEffect(card, effect);
      }
    }
  },

  // Apply the actual effect of a status
  applyStatusEffect(card, effect) {
    switch (effect) {
      case "burning":
        DamageUtils.applyDamage(card, 3, null, 'burning');
        break;
        
      case "bleeding":
        DamageUtils.applyDamage(card, 2, null, 'bleeding');
        break;
        
      case "stunned":
      case "paralyzed":
      case "confused":
        // These prevent actions (handled in canAct)
        break;
        
      case "shield":
      case "boosted":
      case "reflect":
      case "vanished":
      case "haunted":
        // These have passive effects handled elsewhere
        break;
    }
  },

  // Check if card can act this turn
  canAct(card) {
    if (!card || !card.statusEffects) return true;
    return !card.statusEffects.stunned && 
           !card.statusEffects.paralyzed && 
           !card.statusEffects.vanished;
  },

  // Get status effect description for UI
  getStatusDescription(effect) {
    const descriptions = {
      burning: "Taking fire damage each turn",
      bleeding: "Losing HP from wounds",
      stunned: "Cannot act this turn",
      paralyzed: "Cannot move or attack",
      confused: "Attack reduced, unpredictable",
      shield: "Protected from next attack",
      boosted: "Attack power increased",
      reflect: "Next attack will be reflected",
      vanished: "Cannot be targeted easily",
      haunted: "Focus and power reduced"
    };
    return descriptions[effect] || "Unknown effect";
  },

  // Clear all status effects from card
  clearAllStatusEffects(card) {
    if (!card || !card.statusEffects) return;
    
    const effects = Object.keys(card.statusEffects);
    effects.forEach(effect => this.removeStatusEffect(card, effect));
    card.statusEffects = {};
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// CHARACTER SELECTION AND ROSTER MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

const RosterUtils = {
  // Get player character by name
  getPlayerCharacter(name) {
    return LEVEL_1_PLAYER_ROSTER.find(char => 
      char.name.toLowerCase() === name.toLowerCase()
    );
  },

  // Get random enemy from current level
  getRandomEnemy(excludeDefeated = true) {
    let availableEnemies = [...LEVEL_1_ENEMY_MAINS];
    
    if (excludeDefeated && window.battleState) {
      availableEnemies = availableEnemies.filter(enemy => 
        !window.battleState.defeatedEnemyNames.includes(enemy.name)
      );
    }
    
    if (availableEnemies.length === 0) {
      // Fall back to all enemies if none available
      availableEnemies = [...LEVEL_1_ENEMY_MAINS];
    }
    
    return availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
  },

  // Get random pet
  getRandomPet(isEnemy = true) {
    const petRoster = isEnemy ? LEVEL_1_ENEMY_PETS : LEVEL_1_PLAYER_ROSTER.filter(char => char.isPet);
    return petRoster[Math.floor(Math.random() * petRoster.length)];
  },

// Create a fresh copy of character data (for battle instances)
createCharacterInstance(characterData) {
  return {
    ...characterData,
    // Reset any battle-specific properties
    statusEffects: {},
    specialUsed: false
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS AND INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

// Create global battle state instance
window.battleState = new BattleState();

// Export all utilities and data to window for use by battle-specific files
window.BattleShared = {
  // Data
  LEVEL_1_PLAYER_ROSTER,
  LEVEL_1_ENEMY_MAINS,
  LEVEL_1_ENEMY_PETS,
  SPECIAL_EFFECTS,
  
  // Classes
  BattleState,
  
  // Utilities
  DeviceUtils,
  CardUtils,
  TeamUtils,
  DamageUtils,
  StatusEffects,
  RosterUtils,
  
  // Global state
  battleState: window.battleState
};

// Initialize shared components
document.addEventListener('DOMContentLoaded', function() {
  // Load selected character if available
  window.battleState.loadSelectedCharacter();
  
  console.log('BattleShared initialized');
  console.log('Selected character:', window.battleState.selectedPlayerCharacter);
});
