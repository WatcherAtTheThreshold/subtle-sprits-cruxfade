// ═══════════════════════════════════════════════════════════════════════════════
// BATTLE 1V1 - Specific logic for one-on-one battles (Level 1)
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// 1V1 BATTLE STATE MANAGER
// ═══════════════════════════════════════════════════════════════════════════════

class Battle1v1Manager {
  constructor() {
    this.playerCard = null;
    this.enemyCard = null;
    this.currentTurn = 'player'; // 'player' or 'enemy'
    this.battlePhase = 'setup'; // 'setup', 'battle', 'ended'
    this.turnCount = 1;
  }

  reset() {
    this.playerCard = null;
    this.enemyCard = null;
    this.currentTurn = 'player';
    this.battlePhase = 'setup';
    this.turnCount = 1;
  }

  // Get the currently active character
  getActiveCharacter() {
    return this.currentTurn === 'player' ? this.playerCard : this.enemyCard;
  }

  // Get the target character
  getTargetCharacter() {
    return this.currentTurn === 'player' ? this.enemyCard : this.playerCard;
  }

  // Switch turns
  nextTurn() {
    this.currentTurn = this.currentTurn === 'player' ? 'enemy' : 'player';
    if (this.currentTurn === 'player') {
      this.turnCount++;
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1V1 BOARD SETUP
// ═══════════════════════════════════════════════════════════════════════════════

const Board1v1 = {
  // Set up the 1v1 battle board
  setupBoard() {
    const playerArea = document.getElementById("player-team");
    const enemyArea = document.getElementById("enemy-team");
    
    if (!playerArea || !enemyArea) {
      console.error("Battle areas not found!");
      return false;
    }
    
    // Clear existing cards
    playerArea.innerHTML = '';
    enemyArea.innerHTML = '';

    // Get selected player character
    const selectedCharacterData = window.battleState.getPlayerCharacterData();
    if (!selectedCharacterData) {
      console.error("No player character selected!");
      return false;
    }

    // Get random enemy
    const enemyData = window.BattleShared.RosterUtils.getRandomEnemy(true);
    if (!enemyData) {
      console.error("No enemy available!");
      return false;
    }

    // Create player card
    window.battle1v1.playerCard = this.createBattleCard(selectedCharacterData, false);
    playerArea.appendChild(window.battle1v1.playerCard);

    // Create enemy card
    window.battle1v1.enemyCard = this.createBattleCard(enemyData, true);
    enemyArea.appendChild(window.battle1v1.enemyCard);

    // Update battle status
    this.updateBattleStatus(`${selectedCharacterData.name} vs ${enemyData.name}!`);
    
    console.log(`Battle setup: ${selectedCharacterData.name} vs ${enemyData.name}`);
    return true;
  },

  // Create a battle-ready card
  createBattleCard(characterData, isEnemy) {
    // Use BattleUI to create the card if available, otherwise create basic card
    let card;
    if (window.BattleUI && window.BattleUI.createCard) {
      card = window.BattleUI.createCard(characterData, isEnemy);
    } else {
      card = this.createBasicCard(characterData, isEnemy);
    }

    // Initialize battle-specific properties
    card.statusEffects = {};
    card.dataset.specialUsed = 'false';
    card.dataset.name = characterData.name;
    card.dataset.isPet = characterData.isPet || false;

    return card;
  },

  // Fallback card creation if BattleUI not available
  createBasicCard(data, isEnemy) {
    const card = document.createElement("div");
    card.className = `card flip-container${isEnemy ? ' enemy' : ''}`;
    card.dataset.name = data.name;
    card.dataset.isPet = data.isPet;
    card.dataset.specialUsed = "false";

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-front";
    
    const viewport = window.BattleShared.DeviceUtils.getViewportInfo();
    const maxDescLength = viewport.isMobile ? 60 : 100;
    const truncatedDesc = data.desc.length > maxDescLength ? 
      data.desc.substring(0, maxDescLength) + "..." : data.desc;
    
    front.innerHTML = `
      <div class="bust-container">
        <img src="${data.img}" alt="${data.name}" loading="lazy">
      </div>
      <div class="name-tag">${data.name}</div>
      <div class="stat hp">${data.hp}</div>
      <div class="stat atk">${data.atk}</div>
      <div class="description">${truncatedDesc}</div>
      <div class="special-move">${data.special}</div>
    `;

    const back = document.createElement("div");
    back.className = "card-back";

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    return card;
  },

  // Update battle status display
  updateBattleStatus(message) {
    const statusElement = document.getElementById("battle-status");
    if (statusElement) {
      const viewport = window.BattleShared.DeviceUtils.getViewportInfo();
      statusElement.textContent = window.BattleShared.DeviceUtils.truncateForMobile(message);
    }
  },

  // Update special info display
  updateSpecialInfo(message = "") {
    const specialInfoElement = document.getElementById("special-info");
    if (specialInfoElement) {
      if (message) {
        specialInfoElement.textContent = message;
        specialInfoElement.classList.remove("hidden");
      } else {
        specialInfoElement.textContent = "";
        specialInfoElement.classList.add("hidden");
      }
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1V1 TURN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

const Turn1v1 = {
  // Execute a single turn in 1v1 battle
  async executeTurn() {
    if (window.battle1v1.battlePhase !== 'battle') return;
    
    const activeCard = window.battle1v1.getActiveCharacter();
    const targetCard = window.battle1v1.getTargetCharacter();
    
    if (!activeCard || !targetCard) {
      console.error("Missing battle participants!");
      return;
    }

    // Check if active character is alive
    if (window.BattleShared.CardUtils.getHP(activeCard) <= 0) {
      window.battle1v1.nextTurn();
      return;
    }

    // Process status effects at start of turn
    window.BattleShared.StatusEffects.processStatusEffects(activeCard);
    
    // Check if character can act after status effects
    if (!window.BattleShared.StatusEffects.canAct(activeCard)) {
      await this.handleStunnedTurn(activeCard);
      window.battle1v1.nextTurn();
      return;
    }

    // Highlight active character
    activeCard.classList.add("highlight-turn");
    await this.delay(700);

    // Decide action (special move or normal attack)
    const useSpecial = activeCard.dataset.specialUsed === 'false' && Math.random() < 0.3;
    
    if (useSpecial) {
      await this.executeSpecialMove(activeCard, targetCard);
    } else {
      await this.executeNormalAttack(activeCard, targetCard);
    }

    // Remove highlight
    activeCard.classList.remove("highlight-turn");
    
    // Check for victory
    if (this.checkBattleEnd()) return;
    
    // Next turn
    window.battle1v1.nextTurn();
    await this.delay(500);
  },

  // Handle turn when character is stunned
  async handleStunnedTurn(card) {
    const characterName = window.BattleShared.CardUtils.getCharacterName(card);
    const message = `${characterName} is stunned and cannot act!`;
    Board1v1.updateBattleStatus(message);
    await this.delay(1200);
  },

  // Execute special move
  async executeSpecialMove(caster, target) {
    const specialName = window.BattleShared.CardUtils.getSpecialMove(caster);
    const casterName = window.BattleShared.CardUtils.getCharacterName(caster);
    
    if (!specialName) {
      // Fallback to normal attack if no special found
      await this.executeNormalAttack(caster, target);
      return;
    }

    // Update UI
    Board1v1.updateBattleStatus(`${casterName} uses their special move!`);
    Board1v1.updateSpecialInfo(`${specialName} — ${window.BattleShared.SPECIAL_EFFECTS[specialName] || "A mysterious effect..."}`);
    
    // Visual effects
    caster.classList.add("special-glow");
    caster.dataset.specialUsed = 'true';
    
    if (window.BattleUI && window.BattleUI.floatSpecial) {
      window.BattleUI.floatSpecial(caster);
    }
    
    await this.delay(800);
    
    // Execute the special move effect
    await this.applySpecialEffect(caster, target, specialName);
    
    await this.delay(400);
    caster.classList.remove("special-glow");
  },

  // Execute normal attack
  async executeNormalAttack(attacker, target) {
    const attackerName = window.BattleShared.CardUtils.getCharacterName(attacker);
    const targetName = window.BattleShared.CardUtils.getCharacterName(target);
    
    Board1v1.updateBattleStatus(`${attackerName} attacks ${targetName}...`);
    Board1v1.updateSpecialInfo("");
    
    await this.delay(600);

    // Calculate damage
    const damage = window.BattleShared.DamageUtils.calculateRandomDamage(attacker);
    
    // Apply damage (this handles shields, reflection, etc.)
    const actualDamage = window.BattleShared.DamageUtils.applyDamage(target, damage, attacker);
    
    if (actualDamage > 0) {
      Board1v1.updateBattleStatus(`${attackerName} hits for ${actualDamage} damage!`);
    } else {
      Board1v1.updateBattleStatus(`${attackerName}'s attack was blocked or reflected!`);
    }
    
    await this.delay(900);
  },

  // Apply special move effects (simplified for 1v1)
  async applySpecialEffect(caster, target, specialName) {
    switch (specialName) {
      case "Plant Blessing":
        // Heal self in 1v1
        window.BattleShared.DamageUtils.applyHealing(caster, 8);
        break;
      
      case "Luminous Veil":
        window.BattleShared.StatusEffects.addStatusEffect(caster, "shield", 2);
        break;
      
      case "Spark Trick":
        const damage = window.BattleShared.DamageUtils.applyDamage(target, 15, caster);
        if (damage > 0) {
          window.BattleShared.StatusEffects.addStatusEffect(target, "stunned", 1);
        }
        break;
      
      case "Meowing Chirp":
        // Boost own attack in 1v1
        const currentAtk = window.BattleShared.CardUtils.getATK(caster);
        window.BattleShared.CardUtils.setATK(caster, currentAtk + 3);
        window.BattleShared.StatusEffects.addStatusEffect(caster, "boosted", 3);
        break;
      
      case "Skull Bash":
        const bashDamage = window.BattleShared.DamageUtils.applyDamage(target, 12, caster);
        if (bashDamage > 0) {
          window.BattleShared.StatusEffects.addStatusEffect(target, "stunned", 1);
        }
        break;
      
      case "Wildfire Curse":
        window.BattleShared.StatusEffects.addStatusEffect(target, "burning", 3);
        break;
      
      case "Panic Injection":
        const currentAtk = window.BattleShared.CardUtils.getATK(target);
        window.BattleShared.CardUtils.setATK(target, Math.max(1, currentAtk - 5));
        window.BattleShared.StatusEffects.addStatusEffect(target, "confused", 3);
        break;
      
      case "Void Whisper":
        window.BattleShared.DamageUtils.applyDamage(target, 5, caster);
        break;
      
      case "Horn Sweep":
        window.BattleShared.DamageUtils.applyDamage(target, 10, caster);
        break;
      
      case "Ebon Fangs":
        const fangDamage = window.BattleShared.DamageUtils.applyDamage(target, 10, caster);
        if (fangDamage > 0) {
          window.BattleShared.StatusEffects.addStatusEffect(target, "bleeding", 3);
        }
        break;
      
      case "Static Shock":
        window.BattleShared.StatusEffects.addStatusEffect(target, "paralyzed", 2);
        break;
      
      case "Tectonic Slam":
        const slamDamage = window.BattleShared.DamageUtils.applyDamage(target, 8, caster);
        if (slamDamage > 0) {
          window.BattleShared.StatusEffects.addStatusEffect(target, "stunned", 1);
        }
        break;
      
      case "Spark Bomb":
        window.BattleShared.DamageUtils.applyDamage(target, 14, caster);
        break;
      
      case "Mirror Flash":
        window.BattleShared.StatusEffects.addStatusEffect(caster, "reflect", 2);
        break;
      
      case "Vanishing Sting":
        const stingDamage = window.BattleShared.DamageUtils.applyDamage(target, 8, caster);
        if (stingDamage > 0) {
          window.BattleShared.StatusEffects.addStatusEffect(caster, "vanished", 1);
        }
        break;
      
      case "Haunted Stare":
        const targetAtk = window.BattleShared.CardUtils.getATK(target);
        window.BattleShared.CardUtils.setATK(target, Math.max(1, targetAtk - 4));
        window.BattleShared.StatusEffects.addStatusEffect(target, "haunted", 3);
        break;
      
      case "Flame Coil":
        window.BattleShared.DamageUtils.applyDamage(target, 6, caster);
        window.BattleShared.StatusEffects.addStatusEffect(target, "burning", 2);
        break;
      
      default:
        // Unknown special - do normal attack damage
        window.BattleShared.DamageUtils.applyDamage(target, 
          window.BattleShared.DamageUtils.calculateRandomDamage(caster), caster);
        break;
    }
  },

  // Check if battle has ended
  checkBattleEnd() {
    const playerHP = window.BattleShared.CardUtils.getHP(window.battle1v1.playerCard);
    const enemyHP = window.BattleShared.CardUtils.getHP(window.battle1v1.enemyCard);
    
    if (playerHP <= 0 || enemyHP <= 0) {
      window.battle1v1.battlePhase = 'ended';
      
      if (playerHP > 0) {
        this.handleVictory();
      } else {
        this.handleDefeat();
      }
      return true;
    }
    return false;
  },

  // Handle player victory
  handleVictory() {
    Board1v1.updateBattleStatus("Victory! You defeated your opponent!");
    Board1v1.updateSpecialInfo("");
    
    // Mark enemy as defeated for future battles
    const enemyName = window.BattleShared.CardUtils.getCharacterName(window.battle1v1.enemyCard);
    if (!window.battleState.defeatedEnemyNames.includes(enemyName)) {
      window.battleState.defeatedEnemyNames.push(enemyName);
    }
    
    // Show restart/continue options
    this.showBattleEndOptions(true);
  },

  // Handle player defeat
  handleDefeat() {
    Board1v1.updateBattleStatus("Defeat... Your champion has fallen.");
    Board1v1.updateSpecialInfo("");
    
    // Show restart options
    this.showBattleEndOptions(false);
  },

  // Show battle end options
  showBattleEndOptions(isVictory) {
    if (window.BattleUI && window.BattleUI.displayBattleEnd) {
      const message = isVictory ? "Victory! Well fought!" : "Defeat... Try again?";
      window.BattleUI.displayBattleEnd(isVictory, message);
    } else {
      // Fallback - create simple restart button
      this.createSimpleRestartButton();
    }
  },

  // Create simple restart button if BattleUI not available
  createSimpleRestartButton() {
    const controlsArea = document.querySelector(".button-controls");
    if (!controlsArea) return;
    
    const restartBtn = document.createElement("button");
    restartBtn.className = "restart-button";
    restartBtn.textContent = "Battle Again";
    restartBtn.onclick = () => Battle1v1.restart();
    
    controlsArea.innerHTML = "";
    controlsArea.appendChild(restartBtn);
  },

  // Utility delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1V1 BATTLE CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════════

const Battle1v1 = {
  // Initialize 1v1 battle system
  init() {
    console.log("Initializing 1v1 Battle System");
    
    // Set up board
    if (!Board1v1.setupBoard()) {
      console.error("Failed to setup 1v1 board");
      return false;
    }
    
    // Reset battle state
    window.battle1v1.reset();
    window.battleState.reset();
    
    return true;
  },

  // Start the battle (called by battle button)
  async start() {
    const battleButton = document.getElementById("battle-button");
    
    if (window.battle1v1.battlePhase === 'setup') {
      // First click - flip cards and prepare for battle
      window.battle1v1.battlePhase = 'ready';
      window.battleState.gameStarted = true;
      
      if (battleButton) {
        const viewport = window.BattleShared.DeviceUtils.getViewportInfo();
        battleButton.textContent = viewport.isMobile ? "Fight!" : "Start Battle!";
      }
      
      // Flip cards
      if (window.BattleUI && window.BattleUI.flipAllCards) {
        window.BattleUI.flipAllCards();
      } else {
        // Fallback card flip
        document.querySelectorAll('.card').forEach(card => {
          card.classList.add('flipped');
        });
      }
      
      Board1v1.updateBattleStatus("Choose when to begin the battle!");
      return;
    }
    
    if (window.battle1v1.battlePhase === 'ready') {
      // Second click - start actual battle
      window.battle1v1.battlePhase = 'battle';
      
      if (battleButton) {
        battleButton.style.display = "none";
      }
      
      Board1v1.updateBattleStatus(`Turn ${window.battle1v1.turnCount} - Battle begins!`);
      
      // Start battle loop
      this.battleLoop();
    }
  },

  // Main battle loop
  async battleLoop() {
    while (window.battle1v1.battlePhase === 'battle') {
      // Update turn display
      const activeCharacterName = window.BattleShared.CardUtils.getCharacterName(
        window.battle1v1.getActiveCharacter()
      );
      Board1v1.updateBattleStatus(`Turn ${window.battle1v1.turnCount} - ${activeCharacterName}'s turn`);
      
      await Turn1v1.executeTurn();
      
      if (window.battle1v1.battlePhase === 'ended') break;
      
      // Small delay between turns
      await Turn1v1.delay(800);
    }
  },

  // Restart the battle
  restart() {
    // Reset battle state
    window.battle1v1.reset();
    window.battleState.reset();
    
    // Clear status effects from cards
    document.querySelectorAll('.card').forEach(card => {
      if (window.BattleShared.StatusEffects.clearAllStatusEffects) {
        window.BattleShared.StatusEffects.clearAllStatusEffects(card);
      }
      
      // Reset visual states
      card.classList.remove(
        'highlight-turn', 'special-glow', 'damage-glow', 
        'shrink-hit', 'active', 'defeated'
      );
      
      // Reset special usage
      card.dataset.specialUsed = 'false';
    });
    
    // Reset UI
    const battleButton = document.getElementById("battle-button");
    if (battleButton) {
      const viewport = window.BattleShared.DeviceUtils.getViewportInfo();
      battleButton.textContent = viewport.isMobile ? "Start" : "Start Battle";
      battleButton.style.display = "inline-block";
    }
    
    // Clear restart button
    const controlsArea = document.querySelector(".button-controls");
    if (controlsArea) {
      const restartBtn = controlsArea.querySelector(".restart-button");
      if (restartBtn) {
        restartBtn.remove();
      }
    }
    
    // Reinitialize
    this.init();
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS AND INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

// Create global 1v1 battle manager
window.battle1v1 = new Battle1v1Manager();

// Export 1v1 battle system
window.Battle1v1 = {
  // Core functions
  init: Battle1v1.init,
  start: Battle1v1.start,
  restart: Battle1v1.restart,
  
  // Components
  Board: Board1v1,
  Turn: Turn1v1,
  Manager: window.battle1v1,
  
  // Utilities
  battleLoop: Battle1v1.battleLoop
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Wait for BattleShared to be ready
  if (window.BattleShared) {
    console.log('Battle1v1 initialized');
  } else {
    console.warn('BattleShared not found - some features may not work');
  }
});