// ═══════════════════════════════════════════════════════════════════════════════
// TURN-BASED BATTLE SYSTEM WITH PLAYER CONTROL
// Enhanced version with click-to-proceed mechanics
// ═══════════════════════════════════════════════════════════════════════════════

console.log("=== TURN-BASED BATTLE 1V1 SYSTEM LOADING ===");

// Enhanced Battle System with Turn Control
const Battle1v1System = {
  playerCard: null,
  enemyCard: null,
  battleInProgress: false,
  gameStarted: false,
  currentRound: 1,
  currentTurn: 'waiting', // 'waiting', 'player', 'enemy', 'ended'
  turnInProgress: false,
  
  init() {
    console.log("Initializing turn-based 1v1 battle...");
    
    if (!window.BattleShared) {
      console.error("BattleShared not found!");
      return false;
    }
    
    // Get player character
    const playerCharacter = window.battleState.getPlayerCharacterData();
    if (!playerCharacter) {
      console.error("No player character found!");
      return false;
    }
    
    // Get random enemy
    const enemyCharacter = window.BattleShared.RosterUtils.getRandomEnemy();
    if (!enemyCharacter) {
      console.error("No enemy found!");
      return false;
    }
    
    // Create cards and add to page
    this.createBattleCards(playerCharacter, enemyCharacter);
    
    console.log("Turn-based battle initialized successfully!");
    return true;
  },
  
  createBattleCards(playerData, enemyData) {
    const playerArea = document.getElementById("player-team");
    const enemyArea = document.getElementById("enemy-team");
    
    if (!playerArea || !enemyArea) {
      console.error("Battle areas not found!");
      return;
    }
    
    // Clear areas
    playerArea.innerHTML = '';
    enemyArea.innerHTML = '';
    
    // Create player card
    this.playerCard = this.createSimpleCard(playerData, false);
    this.playerCard.dataset.specialUsed = 'false';
    playerArea.appendChild(this.playerCard);
    
    // Create enemy card  
    this.enemyCard = this.createSimpleCard(enemyData, true);
    this.enemyCard.dataset.specialUsed = 'false';
    enemyArea.appendChild(this.enemyCard);
    
    console.log(`Battle: ${playerData.name} vs ${enemyData.name}`);
  },
  
  createSimpleCard(data, isEnemy) {
    const card = document.createElement("div");
    card.className = `card flip-container${isEnemy ? ' enemy' : ''}`;
    card.dataset.name = data.name;
    card.dataset.isPet = data.isPet || 'false';
    
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
  
  // Utility functions for battle mechanics
  getHP(card) {
    return parseInt(card.querySelector(".hp").textContent);
  },
  
  setHP(card, value) {
    const newHP = Math.max(0, value);
    card.querySelector(".hp").textContent = newHP;
    
    if (newHP <= 0 && !card.classList.contains("defeated")) {
      this.floatKO(card);
      card.classList.add("defeated");
    }
  },
  
  getATK(card) {
    return parseInt(card.querySelector(".atk").textContent);
  },
  
  // Floating text effects
  floatDamage(card, amount) {
    this.createFloatingText(card, `-${amount}`, "float-damage", {
      color: "#ff4444",
      fontSize: "clamp(1.2rem, 4vw, 2rem)"
    });
    
    // Add visual feedback
    card.classList.add("damage-glow");
    setTimeout(() => card.classList.remove("damage-glow"), 600);
  },
  
  floatHeal(card, amount) {
    this.createFloatingText(card, `+${amount}`, "float-heal", {
      color: "#4CAF50",
      fontSize: "clamp(1rem, 3vw, 1.8rem)"
    });
  },
  
  floatKO(card) {
    this.createFloatingText(card, "KO!", "float-ko", {
      color: "#ff0000",
      fontSize: "clamp(2rem, 6vw, 4rem)",
      fontWeight: "900"
    });
  },
  
  floatSpecial(card) {
    this.createFloatingText(card, "SPECIAL!", "float-special", {
      color: "#ffdd44",
      fontSize: "clamp(1.2rem, 4vw, 2.2rem)"
    });
  },
  
  createFloatingText(card, text, className, styles = {}) {
    const tag = document.createElement("div");
    tag.className = className;
    tag.textContent = text;
    
    Object.assign(tag.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontFamily: "'Bangers', cursive",
      fontWeight: "bold",
      pointerEvents: "none",
      zIndex: "1000",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
      transition: "all 0.8s ease-out",
      ...styles
    });
    
    card.appendChild(tag);
    
    // Animate
    setTimeout(() => {
      tag.style.top = "-30px";
      tag.style.opacity = '0';
    }, 50);
    
    setTimeout(() => {
      if (tag.parentNode) {
        tag.remove();
      }
    }, 1000);
  },
  
  // Calculate random damage
  randomDamage(card) {
    const atk = this.getATK(card);
    return Math.floor(Math.random() * (atk - 4)) + 5; // 5 to (ATK-1)
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TURN-BASED BATTLE CONTROL SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════
  
  // Update battle button based on current state
  updateBattleButton() {
    const battleButton = document.getElementById('battle-button');
    if (!battleButton) return;
    
    const viewport = window.innerWidth <= 768;
    
    switch (this.currentTurn) {
      case 'waiting':
        if (!this.gameStarted) {
          battleButton.textContent = viewport ? "Start" : "Start Battle";
          battleButton.style.display = 'inline-block';
        } else {
          battleButton.textContent = viewport ? "Begin!" : "Begin Combat!";
          battleButton.style.display = 'inline-block';
        }
        break;
        
      case 'player':
        battleButton.textContent = viewport ? "Attack!" : "Your Attack!";
        battleButton.style.display = 'inline-block';
        break;
        
      case 'enemy':
        battleButton.textContent = viewport ? "Enemy Turn" : "Enemy's Turn";
        battleButton.style.display = 'inline-block';
        break;
        
      case 'ended':
        battleButton.style.display = 'none';
        break;
        
      default:
        battleButton.textContent = viewport ? "Continue" : "Continue Battle";
        battleButton.style.display = 'inline-block';
    }
    
    // Disable button if turn is in progress
    battleButton.disabled = this.turnInProgress;
  },
  
  // Start the next turn phase
  async startNextTurn() {
    if (this.turnInProgress) return;
    
    // Check for battle end
    if (this.checkBattleEnd()) return;
    
    this.turnInProgress = true;
    
    if (this.currentTurn === 'player') {
      await this.executePlayerTurn();
    } else if (this.currentTurn === 'enemy') {
      await this.executeEnemyTurn();
    }
    
    this.turnInProgress = false;
    this.updateBattleButton();
  },
  
  // Execute player's turn
  async executePlayerTurn() {
    const playerName = this.playerCard.querySelector(".name-tag").textContent;
    
    // Highlight player card
    this.playerCard.classList.add("highlight-turn");
    this.updateStatus(`${playerName}'s turn - preparing attack...`);
    await this.sleep(800);
    
    // Decide between normal attack and special (30% chance for special)
    const useSpecial = this.playerCard.dataset.specialUsed === 'false' && Math.random() < 0.3;
    
    if (useSpecial) {
      await this.executeSpecialMove(this.playerCard, this.enemyCard);
    } else {
      await this.executeNormalAttack(this.playerCard, this.enemyCard);
    }
    
    this.playerCard.classList.remove("highlight-turn");
    
    // Switch to enemy turn or end battle
    if (this.getHP(this.enemyCard) > 0) {
      this.currentTurn = 'enemy';
      this.updateStatus(`${playerName} finished! Click for enemy turn.`);
    }
  },
  
  // Execute enemy's turn
  async executeEnemyTurn() {
    const enemyName = this.enemyCard.querySelector(".name-tag").textContent;
    
    // Highlight enemy card
    this.enemyCard.classList.add("highlight-turn");
    this.updateStatus(`${enemyName}'s turn - preparing attack...`);
    await this.sleep(800);
    
    // Decide between normal attack and special (25% chance for special)
    const useSpecial = this.enemyCard.dataset.specialUsed === 'false' && Math.random() < 0.25;
    
    if (useSpecial) {
      await this.executeSpecialMove(this.enemyCard, this.playerCard);
    } else {
      await this.executeNormalAttack(this.enemyCard, this.playerCard);
    }
    
    this.enemyCard.classList.remove("highlight-turn");
    
    // Switch to player turn or end battle
    if (this.getHP(this.playerCard) > 0) {
      this.currentRound++;
      this.currentTurn = 'player';
      this.updateStatus(`Round ${this.currentRound} - Your turn!`);
    }
  },
  
  // Execute normal attack
  async executeNormalAttack(attacker, target) {
    const attackerName = attacker.querySelector(".name-tag").textContent;
    const targetName = target.querySelector(".name-tag").textContent;
    const damage = this.randomDamage(attacker);
    
    this.updateStatus(`${attackerName} attacks ${targetName}!`);
    await this.sleep(600);
    
    this.setHP(target, this.getHP(target) - damage);
    this.floatDamage(target, damage);
    this.updateStatus(`${attackerName} deals ${damage} damage!`);
    await this.sleep(1000);
  },
  
  // Special move effects (enhanced from previous version)
  async executeSpecialMove(attacker, target) {
    const specialName = attacker.querySelector(".special-move").textContent;
    const attackerName = attacker.querySelector(".name-tag").textContent;
    
    this.updateStatus(`${attackerName} uses ${specialName}!`);
    this.floatSpecial(attacker);
    attacker.classList.add("special-glow");
    
    await this.sleep(800);
    
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
        this.updateStatus(`${attackerName} engulfs ${target.querySelector(".name-tag").textContent} in flames for ${fireDamage} damage!`);
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
        this.updateStatus(`${attackerName} unleashes a devastating special attack for ${genericDamage} damage!`);
    }
    
    attacker.classList.remove("special-glow");
    attacker.dataset.specialUsed = 'true';
    await this.sleep(1200);
  },
  
  // Check for battle end
  checkBattleEnd() {
    const playerAlive = this.getHP(this.playerCard) > 0;
    const enemyAlive = this.getHP(this.enemyCard) > 0;
    
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
  
  // Update battle status text
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
  
  // Show restart button
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
  
  // Utility sleep function
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // MAIN BATTLE CONTROL FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════════
  
  // Main start function - handles different battle states
  start() {
    console.log("Starting turn-based 1v1 battle...");
    
    if (!this.gameStarted) {
      // First click - flip the cards
      this.gameStarted = true;
      this.currentTurn = 'waiting';
      
      // Flip the cards with stagger
      document.querySelectorAll('.card').forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('flipped');
        }, index * 200);
      });
      
      this.updateStatus("Cards revealed! Ready for combat!");
      
    } else if (this.currentTurn === 'waiting') {
      // Second click - start actual battle
      this.battleInProgress = true;
      this.currentTurn = 'player';
      this.currentRound = 1;
      
      this.updateStatus(`Round ${this.currentRound} - Your turn! Click to attack!`);
      
    } else if (this.battleInProgress && !this.turnInProgress) {
      // During battle - execute next turn
      this.startNextTurn();
    }
    
    this.updateBattleButton();
    console.log(`Battle state: ${this.currentTurn}, In Progress: ${this.battleInProgress}`);
  }
};

// Export to window
window.Battle1v1 = Battle1v1System;

console.log("Turn-based Battle1v1 system loaded successfully!");
