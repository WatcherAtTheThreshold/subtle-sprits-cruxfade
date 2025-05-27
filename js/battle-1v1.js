console.log("=== BATTLE 1V1 ENHANCED SYSTEM LOADING ===");

// Enhanced 1v1 Battle System with actual combat mechanics
const Battle1v1System = {
  playerCard: null,
  enemyCard: null,
  battleInProgress: false,
  gameStarted: false,
  currentRound: 1,
  
  init() {
    console.log("Initializing enhanced 1v1 battle...");
    
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
    
    console.log("Battle initialized successfully!");
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
  
  // Special move effects
  async executeSpecialMove(attacker, target) {
    const specialName = attacker.querySelector(".special-move").textContent;
    const attackerName = attacker.querySelector(".name-tag").textContent;
    
    this.updateStatus(`${attackerName} uses ${specialName}!`);
    this.floatSpecial(attacker);
    attacker.classList.add("special-glow");
    
    await this.sleep(800);
    
    switch (specialName) {
      case "Luminous Veil":
        // Heal self for 8 HP
        const healAmount = 8;
        this.setHP(attacker, this.getHP(attacker) + healAmount);
        this.floatHeal(attacker, healAmount);
        this.updateStatus(`${attackerName} heals for ${healAmount} HP!`);
        break;
        
      case "Spark Trick":
        // Deal extra damage (15) and small chance to stun next turn
        const sparkDamage = 15;
        this.setHP(target, this.getHP(target) - sparkDamage);
        this.floatDamage(target, sparkDamage);
        this.updateStatus(`${attackerName} deals ${sparkDamage} electric damage!`);
        break;
        
      case "Plant Blessing":
        // Heal self for 10 HP
        const plantHeal = 10;
        this.setHP(attacker, this.getHP(attacker) + plantHeal);
        this.floatHeal(attacker, plantHeal);
        this.updateStatus(`${attackerName} heals for ${plantHeal} HP with nature's blessing!`);
        break;
        
      case "Skull Bash":
        // Heavy damage (12) 
        const bashDamage = 12;
        this.setHP(target, this.getHP(target) - bashDamage);
        this.floatDamage(target, bashDamage);
        this.updateStatus(`${attackerName} delivers a crushing blow for ${bashDamage} damage!`);
        break;
        
      case "Wildfire Curse":
        // Fire damage (10) with burning effect
        const fireDamage = 10;
        this.setHP(target, this.getHP(target) - fireDamage);
        this.floatDamage(target, fireDamage);
        this.updateStatus(`${attackerName} burns ${target.querySelector(".name-tag").textContent} for ${fireDamage} fire damage!`);
        break;
        
      case "Panic Injection":
        // Moderate damage (8) with confusion
        const panicDamage = 8;
        this.setHP(target, this.getHP(target) - panicDamage);
        this.floatDamage(target, panicDamage);
        this.updateStatus(`${attackerName} induces panic, dealing ${panicDamage} damage!`);
        break;
        
      default:
        // Generic special attack
        const genericDamage = 12;
        this.setHP(target, this.getHP(target) - genericDamage);
        this.floatDamage(target, genericDamage);
        this.updateStatus(`${attackerName} uses a powerful special attack for ${genericDamage} damage!`);
    }
    
    attacker.classList.remove("special-glow");
    attacker.dataset.specialUsed = 'true';
    await this.sleep(1000);
  },
  
  // Perform a single attack turn
  async performAttack(attacker, target) {
    const attackerName = attacker.querySelector(".name-tag").textContent;
    const targetName = target.querySelector(".name-tag").textContent;
    
    // Check if attacker is defeated
    if (this.getHP(attacker) <= 0) return false;
    
    // Highlight attacker
    attacker.classList.add("highlight-turn");
    this.updateStatus(`${attackerName}'s turn...`);
    await this.sleep(800);
    
    // Decide between normal attack and special (25% chance for special)
    const useSpecial = attacker.dataset.specialUsed === 'false' && Math.random() < 0.25;
    
    if (useSpecial) {
      await this.executeSpecialMove(attacker, target);
    } else {
      // Normal attack
      const damage = this.randomDamage(attacker);
      this.updateStatus(`${attackerName} attacks ${targetName}!`);
      await this.sleep(600);
      
      this.setHP(target, this.getHP(target) - damage);
      this.floatDamage(target, damage);
      this.updateStatus(`${attackerName} deals ${damage} damage!`);
      await this.sleep(800);
    }
    
    attacker.classList.remove("highlight-turn");
    
    // Check if target is defeated
    return this.getHP(target) > 0;
  },
  
  // Check for battle end
  checkBattleEnd() {
    const playerAlive = this.getHP(this.playerCard) > 0;
    const enemyAlive = this.getHP(this.enemyCard) > 0;
    
    if (!playerAlive || !enemyAlive) {
      this.battleInProgress = false;
      
      if (playerAlive) {
        this.updateStatus("🏆 VICTORY! 🏆");
        this.showRestartButton("Victory! Play Again?");
      } else {
        this.updateStatus("💀 DEFEAT... 💀");
        this.showRestartButton("Defeat! Try Again?");
      }
      
      return true;
    }
    
    return false;
  },
  
  // Main battle loop
  async executeBattle() {
    if (this.battleInProgress) return;
    
    this.battleInProgress = true;
    this.updateStatus(`Round ${this.currentRound} - BATTLE!`);
    
    await this.sleep(1000);
    
    while (this.battleInProgress) {
      // Player turn
      const enemyAlive = await this.performAttack(this.playerCard, this.enemyCard);
      if (this.checkBattleEnd()) break;
      
      if (enemyAlive) {
        await this.sleep(500); // Brief pause between turns
        
        // Enemy turn
        const playerAlive = await this.performAttack(this.enemyCard, this.playerCard);
        if (this.checkBattleEnd()) break;
        
        if (playerAlive) {
          await this.sleep(500);
          this.currentRound++;
          this.updateStatus(`Round ${this.currentRound}`);
          await this.sleep(800);
        }
      }
    }
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
  
  // Main start function
  start() {
    console.log("Starting enhanced 1v1 battle...");
    
    if (!this.gameStarted) {
      // First click - flip the cards
      this.gameStarted = true;
      
      // Flip the cards
      document.querySelectorAll('.card').forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('flipped');
        }, index * 200);
      });
      
      // Update button
      const battleButton = document.getElementById('battle-button');
      if (battleButton) {
        battleButton.textContent = 'Begin Combat!';
      }
      
      this.updateStatus("Cards revealed! Click again to fight!");
      
    } else {
      // Second click - start actual battle
      const battleButton = document.getElementById('battle-button');
      if (battleButton) {
        battleButton.style.display = 'none';
      }
      
      // Start the battle sequence
      this.executeBattle();
    }
    
    console.log("Battle start sequence initiated!");
  }
};

// Export to window
window.Battle1v1 = Battle1v1System;

console.log("Enhanced Battle1v1 system loaded successfully!");
