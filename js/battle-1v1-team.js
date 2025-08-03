// ═══════════════════════════════════════════════════════════════════════════════
// BATTLE 1V1 TEAM SYSTEM - Extended team battle (Hero + Simon vs 2 Enemies)
// Builds on the working 1v1 system but supports small teams
// ═══════════════════════════════════════════════════════════════════════════════

console.log("=== LOADING BATTLE 1V1 TEAM SYSTEM ===");

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN TEAM BATTLE SYSTEM OBJECT
// Extends 1v1 mechanics for small team combat
// ═══════════════════════════════════════════════════════════════════════════════

const Battle1v1TeamSystem = {
  // Battle state variables
  playerTeam: [],
  enemyTeam: [],
  battleInProgress: false,
  gameStarted: false,
  currentRound: 1,
  currentTurn: 'waiting',
  turnInProgress: false,
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION SYSTEM
  // Set up team battle arena and load characters
  // ═══════════════════════════════════════════════════════════════════════════════
  
  init() {
    console.log("Initializing team battle (Hero + Simon vs 2 Enemies)...");
    
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
    
    // Get Simon ally
    const simonAlly = window.battleState.getSimonAlly();
    if (!simonAlly) {
      console.error("No Simon ally found!");
      return false;
    }
    
    // Get enemy team (2 enemies)
    const enemyTeam = window.BattleShared.RosterUtils.getEnemyTeam();
    if (!enemyTeam || enemyTeam.length < 2) {
      console.error("Not enough enemies found!");
      return false;
    }
    
    // Create battle teams and display them
    this.createBattleTeams(playerCharacter, simonAlly, enemyTeam);
    
    console.log("Team battle initialized successfully!");
    return true;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // TEAM CREATION SYSTEM
  // Build character teams for battle display
  // ═══════════════════════════════════════════════════════════════════════════════
  
  createBattleTeams(playerData, simonData, enemyData) {
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
    
    // Create and add player team (Hero + Simon)
    const playerCard = this.createCard(playerData, false);
    playerCard.dataset.specialUsed = 'false';
    playerArea.appendChild(playerCard);
    this.playerTeam.push(playerCard);
    
    const simonCard = this.createCard(simonData, false);
    simonCard.dataset.specialUsed = 'false';
    playerArea.appendChild(simonCard);
    this.playerTeam.push(simonCard);
    
    // Create and add enemy team (2 enemies)
    enemyData.forEach(enemyData => {
      const enemyCard = this.createCard(enemyData, true);
      enemyCard.dataset.specialUsed = 'false';
      enemyArea.appendChild(enemyCard);
      this.enemyTeam.push(enemyCard);
    });
    
    console.log(`Team battle setup: ${playerData.name} + ${simonData.name} vs ${enemyData.map(e => e.name).join(' + ')}`);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // INDIVIDUAL CARD BUILDER
  // Construct HTML structure for character cards (same as 1v1)
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
  // BATTLE STAT UTILITIES (same as 1v1)
  // ═══════════════════════════════════════════════════════════════════════════════
  
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
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // DAMAGE CALCULATION SYSTEM (same as 1v1)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  randomDamage(card) {
    const atk = this.getATK(card);
    const isPet = card.dataset.isPet === 'true';
    return isPet ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * (atk - 4)) + 5;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // FLOATING TEXT SYSTEM (same as 1v1)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  createFloatingText(card, text, className, styles = {}) {
    const tag = document.createElement("div");
    tag.className = `${className} floating-text-enhanced`;
    tag.textContent = text;
    
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
    
    card.style.position = "relative";
    card.style.overflow = "visible";
    card.appendChild(tag);
    
    setTimeout(() => {
      tag.style.top = "-150px";
      tag.style.opacity = "0";
      tag.style.transform = "translate(-50%, -50%) scale(1.4)";
    }, 300);
    
    setTimeout(() => {
      if (tag && tag.parentNode) {
        tag.remove();
      }
    }, 4500);
  },
  
  floatDamage(card, amount) {
    this.createFloatingText(card, `-${amount}`, "float-damage", {
      color: "#ff4444",
      fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
      fontWeight: "900"
    });
    
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
  // TEAM MANAGEMENT UTILITIES
  // Helper functions for managing teams
  // ═══════════════════════════════════════════════════════════════════════════════
  
  getLivingTeamMembers(team) {
    return team.filter(card => this.getHP(card) > 0 && !card.classList.contains("defeated"));
  },
  
  getAllLivingCharacters() {
    return [...this.getLivingTeamMembers(this.playerTeam), ...this.getLivingTeamMembers(this.enemyTeam)];
  },
  
  getRandomTarget(team) {
    const living = this.getLivingTeamMembers(team);
    return living.length > 0 ? living[Math.floor(Math.random() * living.length)] : null;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // BATTLE BUTTON MANAGEMENT (same as 1v1)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  updateBattleButton() {
    const battleButton = document.getElementById('battle-button');
    if (!battleButton) return;
    
    const viewport = window.innerWidth <= 768;
    
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
    
    battleButton.disabled = this.turnInProgress;
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // BATTLE STATUS DISPLAY (same as 1v1)
  // ═══════════════════════════════════════════════════════════════════════════════
  
  updateStatus(message) {
    const status = document.getElementById("battle-status");
    if (status) {
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
  // Execute complete battle rounds with all living characters
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async startNextTurn() {
    if (this.turnInProgress) return;
    
    if (this.checkBattleEnd()) return;
    
    this.turnInProgress = true;
    
    await this.executeFullRound();
    
    this.turnInProgress = false;
    this.updateBattleButton();
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // FULL ROUND EXECUTION
  // All living characters take turns in random order
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async executeFullRound() {
    // Get all living characters and randomize turn order
    const allLiving = this.getAllLivingCharacters();
    const turnOrder = allLiving.sort(() => Math.random() - 0.5);
    
    this.updateStatus(`Round ${this.currentRound} - ${turnOrder.length} fighters ready!`);
    await this.sleep(1500);
    
    // Execute each character's turn
    for (const character of turnOrder) {
      // Check if battle ended
      if (this.checkBattleEnd()) return;
      
      // Determine if this character is a player or enemy
      const isPlayerCharacter = this.playerTeam.includes(character);
      const opponentTeam = isPlayerCharacter ? this.enemyTeam : this.playerTeam;
      
      // Execute turn
      if (isPlayerCharacter) {
        await this.executePlayerCharacterTurn(character, opponentTeam);
      } else {
        await this.executeEnemyCharacterTurn(character, this.playerTeam);
      }
      
      // Check if battle ended after this turn
      if (this.checkBattleEnd()) return;
      
      // Brief pause between turns
      await this.sleep(800);
    }
    
    // Prepare for next round
    this.currentRound++;
    this.updateStatus(`Round ${this.currentRound} complete - Click for next round!`);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // PLAYER CHARACTER TURN EXECUTION
  // Handle player team member's attack phase
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async executePlayerCharacterTurn(character, opponentTeam) {
    const characterName = character.querySelector(".name-tag").textContent;
    
    // Highlight character and show status
    character.classList.add("highlight-turn");
    this.updateStatus(`${characterName}'s turn - preparing attack...`);
    await this.sleep(1200);
    
    // Determine attack type
    const useSpecial = character.dataset.specialUsed === 'false' && Math.random() < 0.3;
    
    if (useSpecial) {
      await this.executeSpecialMove(character, opponentTeam);
    } else {
      await this.executeNormalAttack(character, opponentTeam);
    }
    
    character.classList.remove("highlight-turn");
    await this.sleep(1000);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // ENEMY CHARACTER TURN EXECUTION  
  // Handle enemy team member's attack phase
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async executeEnemyCharacterTurn(character, opponentTeam) {
    const characterName = character.querySelector(".name-tag").textContent;
    
    // Highlight character and show status
    character.classList.add("highlight-turn");
    this.updateStatus(`${characterName}'s turn - preparing counter-attack...`);
    await this.sleep(1200);
    
    // Determine attack type (enemies slightly less likely to use specials)
    const useSpecial = character.dataset.specialUsed === 'false' && Math.random() < 0.25;
    
    if (useSpecial) {
      await this.executeSpecialMove(character, opponentTeam);
    } else {
      await this.executeNormalAttack(character, opponentTeam);
    }
    
    character.classList.remove("highlight-turn");
    await this.sleep(1000);
  },
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // NORMAL ATTACK EXECUTION
  // Standard damage-dealing attacks with random targeting
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async executeNormalAttack(attacker, opponentTeam) {
    const attackerName = attacker.querySelector(".name-tag").textContent;
    const target = this.getRandomTarget(opponentTeam);
    
    if (!target) {
      this.updateStatus(`${attackerName} has no valid targets!`);
      await this.sleep(1000);
      return;
    }
    
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
  // Character-specific special abilities with enhanced effects
  // ═══════════════════════════════════════════════════════════════════════════════
  
  async executeSpecialMove(attacker, opponentTeam) {
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
        const target1 = this.getRandomTarget(opponentTeam);
        if (target1) {
          const sparkDamage = 15;
          this.setHP(target1, this.getHP(target1) - sparkDamage);
          this.floatDamage(target1, sparkDamage);
          this.updateStatus(`${attackerName} unleashes crackling energy for ${sparkDamage} damage!`);
        }
        break;
        
      case "Plant Blessing":
        const plantHeal = 10;
        this.setHP(attacker, this.getHP(attacker) + plantHeal);
        this.floatHeal(attacker, plantHeal);
        this.updateStatus(`${attackerName} channels nature's power, healing ${plantHeal} HP!`);
        break;
        
      case "Meowing Chirp": // Simon's special
        // Boost all living allies' attack
        const allyTeam = this.playerTeam.includes(attacker) ? this.playerTeam : this.enemyTeam;
        const livingAllies = this.getLivingTeamMembers(allyTeam);
        livingAllies.forEach(ally => {
          if (ally !== attacker) {
            const currentAtk = this.getATK(ally);
            ally.querySelector(".atk").textContent = currentAtk + 3;
          }
        });
        this.updateStatus(`${attackerName} boosts team morale! Attack increased!`);
        break;
        
      case "Skull Bash":
        const target2 = this.getRandomTarget(opponentTeam);
        if (target2) {
          const bashDamage = 12;
          this.setHP(target2, this.getHP(target2) - bashDamage);
          this.floatDamage(target2, bashDamage);
          this.updateStatus(`${attackerName} delivers a bone-crushing blow for ${bashDamage} damage!`);
        }
        break;
        
      case "Wildfire Curse":
        const target3 = this.getRandomTarget(opponentTeam);
        if (target3) {
          const fireDamage = 10;
          this.setHP(target3, this.getHP(target3) - fireDamage);
          this.floatDamage(target3, fireDamage);
          this.updateStatus(`${attackerName} engulfs ${target3.querySelector(".name-tag").textContent} in flames!`);
        }
        break;
        
      case "Panic Injection":
        const target4 = this.getRandomTarget(opponentTeam);
        if (target4) {
          const panicDamage = 8;
          this.setHP(target4, this.getHP(target4) - panicDamage);
          this.floatDamage(target4, panicDamage);
          this.updateStatus(`${attackerName} injects terror, dealing ${panicDamage} psychic damage!`);
        }
        break;
        
      default:
        const targetDefault = this.getRandomTarget(opponentTeam);
        if (targetDefault) {
          const genericDamage = 12;
          this.setHP(targetDefault, this.getHP(targetDefault) - genericDamage);
          this.floatDamage(targetDefault, genericDamage);
          this.updateStatus(`${attackerName} unleashes a devastating special attack!`);
        }
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
    const livingPlayers = this.getLivingTeamMembers(this.playerTeam);
    const livingEnemies = this.getLivingTeamMembers(this.enemyTeam);
    
    // Check if either team is defeated
    if (livingPlayers.length === 0 || livingEnemies.length === 0) {
      this.battleInProgress = false;
      this.currentTurn = 'ended';
      
      if (livingPlayers.length > 0) {
        this.updateStatus("🏆 VICTORY! Your team prevails! 🏆");
        this.showRestartButton("Victory! Continue Adventure?");
      } else {
        this.updateStatus("💀 DEFEAT... Your team has fallen... 💀");
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
  
// Replace the showRestartButton method in battle-1v1-team.js (around line 650)
showRestartButton(text) {
  const restartContainer = document.getElementById("restart-container");
  if (restartContainer) {
    const isVictory = text.includes("Victory");
    restartContainer.innerHTML = `
      <button class="restart-button" onclick="window.location.reload()">
        ${text}
      </button>
      <button class="restart-button" onclick="window.location.href='../character-select.html'" style="margin-left: 1rem;">
        Choose New Character
      </button>
      ${isVictory ? '<button class="restart-button" onclick="window.location.href=\'battle1v1-3.html\'" style="margin-left: 1rem; background: #4CAF50;">Final Battle →</button>' : ''}
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
    console.log("Starting team battle...");
    
    if (!this.gameStarted) {
      // First click: Flip cards and prepare for battle
      this.gameStarted = true;
      this.currentTurn = 'waiting';
      
      // Animate card flipping with stagger
      const allCards = [...this.playerTeam, ...this.enemyTeam];
      allCards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('flipped');
        }, index * 200);
      });
      
      this.updateStatus("Teams assembled! Ready for combat!");
      
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
window.Battle1v1Team = Battle1v1TeamSystem;

console.log("=== BATTLE 1V1 TEAM SYSTEM LOADED SUCCESSFULLY ===");
