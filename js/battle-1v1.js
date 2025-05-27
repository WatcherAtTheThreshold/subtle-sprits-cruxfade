console.log("=== BATTLE 1V1 SIMPLE VERSION LOADING ===");

// Simple 1v1 Battle System
const Battle1v1System = {
  playerCard: null,
  enemyCard: null,
  
  init() {
    console.log("Initializing simple 1v1 battle...");
    
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
    playerArea.appendChild(this.playerCard);
    
    // Create enemy card  
    this.enemyCard = this.createSimpleCard(enemyData, true);
    enemyArea.appendChild(this.enemyCard);
    
    console.log(`Battle: ${playerData.name} vs ${enemyData.name}`);
  },
  
  createSimpleCard(data, isEnemy) {
    const card = document.createElement("div");
    card.className = `card flip-container${isEnemy ? ' enemy' : ''}`;
    
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
  
  start() {
    console.log("Starting battle...");
    // For now, just flip the cards
    document.querySelectorAll('.card').forEach(card => {
      card.classList.add('flipped');
    });
  }
};

// Export to window
window.Battle1v1 = Battle1v1System;

console.log("Battle1v1 simple system loaded successfully!");
