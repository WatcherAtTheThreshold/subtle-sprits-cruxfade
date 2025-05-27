// ═══════════════════════════════════════════════════════════════════════════════
// BATTLE 1V1 SYSTEM - Complete Turn-Based Combat
// Enhanced version with proper scope handling and clean organization
// ═══════════════════════════════════════════════════════════════════════════════

console.log("=== LOADING BATTLE 1V1 SYSTEM ===");

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN BATTLE SYSTEM OBJECT
// Core battle state and initialization
// ═══════════════════════════════════════════════════════════════════════════════

const Battle1v1System = {
  // Battle state variables
  playerCard: null,
  enemyCard: null,
  battleInProgress: false,
  gameStarted: false,
  currentRound: 1,
  currentTurn: 'waiting', // 'waiting', 'round', 'ended'
  turnInProgress: false,
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION SYSTEM
  // Set up battle arena and load characters
  // ═══════════════════════════════════════════════════════════════════════════════
  
  init() {
    console.log("Initializing turn-based 1v1 battle...");
    
    // Check for required dependencies
    if (!window.BattleShared) {
      console.error("BattleShared not found!");
      return false;
    }
    
    // Get player character from session storage
    const playerCharacter = window.battleState.getPlayerCharacterData();
    if (!playerCharacter) {
      console.error("No player character found!");
      return false;
    }
    
    // Get random enemy for battle
    const enemyCharacter = window.BattleShared.RosterUtils.getRandomEnemy();
    if (!enemyCharacter) {
      console.error("No enemy found!");
      return false;
    }
    
    // Create battle cards and display them
    this.createBattleCards(playerCharacter, enemyCharacter);
    
    console.log("Turn-based battle initialized successfully!");
    return true;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // CARD CREATION SYSTEM
  // Build character cards for battle display
  // ═══════════════════════════════════════════════════════════════════════════════
  
  createBattleCards(playerData, enemyData) {
    const playerArea = document.getElementById("player-team");
    const enemyArea = document.getElementById("enemy-team");
    
    // Validate battle areas exist
    if (!playerArea || !enemyArea) {
      console.error("Battle areas not found!");
      return;
    }
    
    // Clear any existing cards
    playerArea.innerHTML = '';
    enemyArea.innerHTML = '';
    
    // Create and add player card
    this.playerCard = this.createCard(playerData, false);
    this.playerCard.dataset.specialUsed = 'false';
    playerArea.appendChild(this.playerCard);
    
    // Create and add enemy card
    this.enemyCard = this.createCard(enemyData, true);
    this.enemyCard.dataset.specialUsed = 'false';
    enemyArea.appendChild(this.enemyCard);
    
    console.log(`Battle setup: ${playerData.name} vs ${enemyData.name}`);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // INDIVIDUAL CARD BUILDER
  // Construct HTML structure for character cards
  // ═══════════════════════════════════════════════════════════════════════════════
  
  createCard(data, isEnemy) {
    const card = document.createElement("div");
    card.className = `card flip-container${isEnemy ? ' enemy' : ''}`;
    card.dataset.name = data.name;
    card.dataset.isPet = data.isPet || 'false';
    
    // Build card HTML structure
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="bust-container">
            <img src="${data.img}" alt="${data.name}">
          </div>
          <div class="name-tag">${data.name}</div>
          <div class="stat hp">${data.hp}</div>
          <div class="stat atk">${data.atk}</div>
          <div class="description">${data.desc}</div>
          <div class="special-move">${data.special}</div>
        </div>
        <div class="card-back"></div>
      </div>
    `;
    
    return card;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // BATTLE STAT UTILITIES
  // Get and set HP/ATK values with validation
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getHP(card) {
    return parseInt(card.querySelector(".hp").textContent);
  },
  
  setHP(card, value) {
    const newHP = Math.max(0, value);
    card.querySelector(".hp").textContent = newHP;
    
    // Handle knockout when HP reaches 0
    if (newHP <= 0 && !card.classList.contains("defeated")) {
      this.floatKO(card);
      card.classList.add("defeated");
    }
  },
  
  getATK(card) {
    return parseInt(card.querySelector(".atk").textContent);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // DAMAGE CALCULATION SYSTEM
  // Calculate random damage based on attack stats
  // ═══════════════════════════════════════════════════════════════════════════════
  
  randomDamage(card) {
    const atk = this.getATK(card);
    return Math.floor(Math.random() * (atk - 4)) + 5; // Range: 5 to (ATK-1)
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // FLOATING TEXT SYSTEM
  // Create and animate floating battle text
  // ═══════════════════════════════════════════════════════════════════════════════
  
  createFloatingText(card, text, className, styles = {}) {
    const tag = document.createElement("div");
    tag.className = `${className} floating-text-enhanced`;
    tag.textContent = text;
    
    // Apply base floating text styles
    Object.assign(tag.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontFamily: "'Bangers', cursive",
      fontWeight: "bold",
      pointerEvents: "none",
      zIndex: "9999",
      textShadow: "3px 3px 6px rgba(0, 0, 0, 0.9)",
      transition: "all 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      opacity: "1",
      display: "block",
      visibility: "visible",
      userSelect: "none",
      willChange: "transform, opacity",
      backfaceVisibility: "hidden",
      ...styles
    });
    
    // Ensure card supports floating text
    card.style.position = "relative";
    card.style.overflow = "visible";
    card.appendChild(tag);
    
    console.log(`Created floating text: "${text}"`);
    
    // Animate the floating text
    setTimeout(() => {
      tag.style.top = "-150px";
      tag.style.opacity = "0";
      tag.style.transform = "translate(-50%, -50%) scale(1.4)";
    }, 300);
    
    // Remove after animation completes
    setTimeout(() => {
      if (tag && tag.parentNode) {
        tag.remove();
      }
    }, 4500);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SPECIFIC FLOATING TEXT TYPES
  // Damage, healing, KO, and special move indicators
  // ═══════════════════════════════════════════════════════════════════════════════
  
  floatDamage(card, amount) {
    this.createFloatingText(card, `-${amount}`, "float-damage", {
      color: "#ff4444",
      fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
      fontWeight: "900"
    });
    
    // Add damage visual feedback
    card.classList.add("damage-glow");
    setTimeout(() => card.classList.remove("damage-glow"), 800);
  },
  
  floatHeal(card, amount) {
    this.createFloatingText(card, `+${amount}`, "float-heal", {
      color: "#4CAF50",
      fontSize: "clamp(1.3rem, 4vw, 2.2rem)",
      fontWeight: "800"
    });
  },
  
  floatKO(card) {
    this.createFloatingText(card, "KO!", "float-ko", {
      color: "#ff0000",
      fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
      fontWeight: "900"
    });
  },
  
  floatSpecial(card) {
    this.createFloatingText(card, "SPECIAL!", "float-special", {
      color: "#ffdd44",
      fontSize: "clamp(1.4rem, 5vw, 2.8rem)",
      fontWeight: "800"
    });
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // BATTLE BUTTON MANAGEMENT
  // Update button text and state based on battle phase
  // ═══════════════════════════════════════════════════════════════════════════════
  
  updateBattleButton() {
    const battleButton = document.getElementById('battle-button');
    if (!battleButton) return;
    
    const viewport = window.innerWidth <= 768;
    
    // Update button text based on current battle state
    switch (this.currentTurn) {
      case 'waiting':
        if (!this.gameStarted) {
          battleButton.textContent = viewport ? "Start" : "Start Battle";
        } else {
          battleButton.textContent = viewport ? "Begin!" : "Begin Combat!";
        }
        battleButton.style.display = 'inline-block';
        break;
        
      case 'round':
        battleButton.textContent = viewport ? "Fight!" : "Fight Round!";
        battleButton.style.display = 'inline-block';
        break;
        
      case 'ended':
        battleButton.style.display = 'none';
        break;
        
      default:
        battleButton.textContent = viewport ? "Continue" : "Continue Battle";
        battleButton.style.display = 'inline-block';
    }
    
    // Disable button during turn animations
    battleButton.disabled = this.turnInProgress;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // BATTLE STATUS DISPLAY
  // Update the main battle status text
  // ═══════════════════════════════════════════════════════════════════════════════
  
  updateStatus(message) {
    const status = document.getElementById("battle-status");
    if (status) {
      // Make text mobile-friendly
      const viewport = window.innerWidth;
      if (viewport <= 768 && message.length > 40) {
        status.textContent = message.substring(0, 37) + "...";
      } else {
        status.textContent = message;
      }
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TURN EXECUTION SYSTEM
  // Execute complete battle rounds with proper timing
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async startNextTurn() {
    if (this.turnInProgress) return;
    
    // Check if battle has ended
    if (this.checkBattleEnd()) return;
    
    this.turnInProgress = true;
    
    // Execute complete round (player + enemy)
    await this.executeFullRound();
    
    this.turnInProgress = false;
    this.updateBattleButton();
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // FULL ROUND EXECUTION
  // Player turn followed by enemy turn
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async executeFullRound() {
    // Execute player's turn
    await this.executePlayerTurn();
    
    // Check if battle ended after player's attack
    if (this.checkBattleEnd()) return;
    
    // Pause between turns for dramatic effect
    await this.sleep(1500);
    
    // Execute enemy's turn automatically
    await this.executeEnemyTurn();
    
    // Check if battle ended after enemy's attack
    if (this.checkBattleEnd()) return;
    
    // Prepare for next round
    this.currentRound++;
    this.updateStatus(`Round ${this.currentRound} complete - Click for next round!`);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PLAYER TURN EXECUTION
  // Handle player character's attack phase
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async executePlayerTurn() {
    const playerName = this.playerCard.querySelector(".name-tag").textContent;
    
    // Highlight player card and show status
    this.playerCard.classList.add("highlight-turn");
    this.updateStatus(`${playerName}'s turn - preparing attack...`);
    await this.sleep(1200);
    
    // Determine attack type (30% chance for special)
    const useSpecial = this.playerCard.dataset.specialUsed === 'false' && Math.random() < 0.3;
    
    if (useSpecial) {
      await this.executeSpecialMove(this.playerCard, this.enemyCard);
    } else {
      await this.executeNormalAttack(this.playerCard, this.enemyCard);
    }
    
    // Remove highlight and pause
    this.playerCard.classList.remove("highlight-turn");
    await this.sleep(1000);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ENEMY TURN EXECUTION  
  // Handle enemy character's attack phase
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async executeEnemyTurn() {
    const enemyName = this.enemyCard.querySelector(".name-tag").textContent;
    
    // Highlight enemy card and show status
    this.enemyCard.classList.add("highlight-turn");
    this.updateStatus(`${enemyName}'s turn - preparing counter-attack...`);
    await this.sleep(1200);
    
    // Determine attack type (25% chance for special)
    const useSpecial = this.enemyCard.dataset.specialUsed === 'false' && Math.random() < 0.25;
    
    if (useSpecial) {
      await this.executeSpecialMove(this.enemyCard, this.playerCard);
    } else {
      await this.executeNormalAttack(this.enemyCard, this.playerCard);
    }
    
    // Remove highlight and pause
    this.enemyCard.classList.remove("highlight-turn");
    await this.sleep(1000);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // NORMAL ATTACK EXECUTION
  // Standard damage-dealing attacks
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async executeNormalAttack(attacker, target) {
    const attackerName = attacker.querySelector(".name-tag").textContent;
    const targetName = target.querySelector(".name-tag").textContent;
    const damage = this.randomDamage(attacker);
    
    // Show attack message
    this.updateStatus(`${attackerName} attacks ${targetName}!`);
    await this.sleep(1000);
    
    // Apply damage and show floating text
    this.setHP(target, this.getHP(target) - damage);
    this.floatDamage(target, damage);
    this.updateStatus(`${attackerName} deals ${damage} damage to ${targetName}!`);
    await this.sleep(1500);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // SPECIAL MOVE EXECUTION
  // Character-specific special abilities
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async executeSpecialMove(attacker, target) {
    const specialName = attacker.querySelector(".special-move").textContent;
    const attackerName = attacker.querySelector(".name-tag").textContent;
    
    // Build up suspense for special move
    this.updateStatus(`${attackerName} charges up their special move...`);
    await this.sleep(1000);
    
    // Announce and execute special move
    this.updateStatus(`${attackerName} uses ${specialName}!`);
    this.floatSpecial(attacker);
    attacker.classList.add("special-glow");
    await this.sleep(1200);
    
    // Execute specific special move effects
    switch (specialName) {
      case "Luminous Veil":
        const healAmount = 8;
        this.setHP(attacker, this.getHP(attacker) + healAmount);
        this.floatHeal(attacker, healAmount);
        this.updateStatus(`${attackerName} heals for ${healAmount} HP with divine light!`);
        break;
        
      case "Spark Trick":
        const sparkDamage = 15;
        this.setHP(target, this.getHP(target) - sparkDamage);
        this.floatDamage(target, sparkDamage);
        this.updateStatus(`${attackerName} unleashes crackling energy for ${sparkDamage} damage!`);
        break;
        
      case "Plant Blessing":
        const plantHeal = 10;
        this.setHP(attacker, this.getHP(attacker) + plantHeal);
        this.floatHeal(attacker, plantHeal);
        this.updateStatus(`${attackerName} channels nature's power, healing ${plantHeal} HP!`);
        break;
        
      case "Skull Bash":
        const bashDamage = 12;
        this.setHP(target, this.getHP(target) - bashDamage);
        this.floatDamage(target, bashDamage);
        this.updateStatus(`${attackerName} delivers a bone-crushing blow for ${bashDamage} damage!`);
        break;
        
      case "Wildfire Curse":
        const fireDamage = 10;
        this.setHP(target, this.getHP(target) - fireDamage);
        this.floatDamage(target, fireDamage);
        this.updateStatus(`${attackerName} engulfs ${target.querySelector(".name-tag").textContent} in flames!`);
        break;
        
      case "Panic Injection":
        const panicDamage = 8;
        this.setHP(target, this.getHP(target) - panicDamage);
        this.floatDamage(target, panicDamage);
        this.updateStatus(`${attackerName} injects terror, dealing ${panicDamage} psychic damage!`);
        break;
        
      default:
        const genericDamage = 12;
        this.setHP(target, this.getHP(target) - genericDamage);
        this.floatDamage(target, genericDamage);
        this.updateStatus(`${attackerName} unleashes a devastating special attack!`);
    }
    
    // Clean up special move effects
    attacker.classList.remove("special-glow");
    attacker.dataset.specialUsed = 'true';
    await this.sleep(1800);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // BATTLE END DETECTION
  // Check for victory/defeat conditions
  // ═══════════════════════════════════════════════════════════════════════════════
  
  checkBattleEnd() {
    const playerAlive = this.getHP(this.playerCard) > 0;
    const enemyAlive = this.getHP(this.enemyCard) > 0;
    
    // Check if either character is defeated
    if (!playerAlive || !enemyAlive) {
      this.battleInProgress = false;
      this.currentTurn = 'ended';
      
      if (playerAlive) {
        this.updateStatus("🏆 VICTORY! 🏆");
        this.showRestartButton("Victory! Play Again?");
      } else {
        this.updateStatus("💀 DEFEAT... 💀");
        this.showRestartButton("Defeat! Try Again?");
      }
      
      this.updateBattleButton();
      return true;
    }
    
    return false;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // RESTART BUTTON SYSTEM
  // Display options after battle completion
  // ═══════════════════════════════════════════════════════════════════════════════
  
  showRestartButton(text) {
    const restartContainer = document.getElementById("restart-container");
    if (restartContainer) {
      restartContainer.innerHTML = `
        <button class="restart-button" onclick="window.location.reload()">
          ${text}
        </button>
        <button class="restart-button" onclick="window.location.href='../character-select.html'" style="margin-left: 1rem;">
          Choose New Character
        </button>
      `;
    }
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // Helper functions for timing and delays
  // ═══════════════════════════════════════════════════════════════════════════════
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // MAIN BATTLE CONTROL
  // Primary entry point for battle actions
  // ═══════════════════════════════════════════════════════════════════════════════
  
  start() {
    console.log("Starting turn-based 1v1 battle...");
    
    if (!this.gameStarted) {
      // First click: Flip cards and prepare for battle
      this.gameStarted = true;
      this.currentTurn = 'waiting';
      
      // Animate card flipping with stagger
      document.querySelectorAll('.card').forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('flipped');
        }, index * 200);
      });
      
      this.updateStatus("Cards revealed! Ready for combat!");
      
    } else if (this.currentTurn === 'waiting') {
      // Second click: Start actual battle
      this.battleInProgress = true;
      this.currentTurn = 'round';
      this.currentRound = 1;
      
      this.updateStatus(`Round ${this.currentRound} - Click to fight!`);
      
    } else if (this.battleInProgress && !this.turnInProgress) {
      // During battle: Execute next round
      this.startNextTurn();
    }
    
    // Update button state
    this.updateBattleButton();
    console.log(`Battle state: ${this.currentTurn}, In Progress: ${this.battleInProgress}`);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT SYSTEM
// Make battle system available globally
// ═══════════════════════════════════════════════════════════════════════════════

// Export to window for external access
window.Battle1v1 = Battle1v1System;

console.log("=== BATTLE 1V1 SYSTEM LOADED SUCCESSFULLY ===");
