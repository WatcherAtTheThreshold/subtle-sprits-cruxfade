// ═══════════════════════════════════════════════════════════════════════════════
// BATTLE CORE - Core battle logic, status effects, damage calculation
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// CHARACTER DATA
// ═══════════════════════════════════════════════════════════════════════════════

const playerTeam = [
  { name: "Timothy", hp: 30, atk: 10, img: "images/Timothy.png", desc: "Brave and kind. Searches for sprouting light.", special: "Plant Blessing", isPet: false },
  { name: "Magdaline", hp: 30, atk: 10, img: "images/Magdaline.png", desc: "Gentle healer. Touched by glimmering light.", special: "Luminous Veil", isPet: false },
  { name: "Fizzwick", hp: 30, atk: 10, img: "images/Fizzwick.png", desc: "Fast, clever, and full of sparks.", special: "Spark Trick", isPet: false },
  { name: "Simon", hp: 10, atk: 5, img: "images/Simon.png", desc: "Pet spirit. Encourages and uplifts allies.", special: "Meowing Chirp", isPet: true }
];

const enemyMains = [
  { name: "Gwar", hp: 30, atk: 10, img: "images/Gwar.png", desc: "Heavy brute. Follows the sound of war.", special: "Skull Bash", isPet: false },
  { name: "Mildred", hp: 30, atk: 10, img: "images/Mildred.png", desc: "Old fire. Unforgiving and wild.", special: "Wildfire Curse", isPet: false },
  { name: "Dr-Burgly", hp: 30, atk: 10, img: "images/Dr-Burgly.png", desc: "Mad medic. Stitches shadows together.", special: "Panic Injection", isPet: false },
  { name: "Shelindra", hp: 30, atk: 10, img: "images/Shelindra.png", desc: "Dark oracle. Pierces truth with silence.", special: "Void Whisper", isPet: false },
  { name: "Bill", hp: 30, atk: 10, img: "images/Bill.png", desc: "Wandering blade. Kind eyes, sharp horns.", special: "Horn Sweep", isPet: false },
  { name: "Draxel", hp: 30, atk: 10, img: "images/Draxel.png", desc: "Shrouded hunter. Lurks at the edge.", special: "Ebon Fangs", isPet: false },
  { name: "Xavier", hp: 30, atk: 10, img: "images/Xavier.png", desc: "Unstable energy. Crackles when provoked.", special: "Static Shock", isPet: false },
  { name: "Tong", hp: 30, atk: 10, img: "images/Tong.png", desc: "Massive brute. Calm until riled.", special: "Tectonic Slam", isPet: false },
  { name: "Tim_blue", hp: 30, atk: 10, img: "images/Tim_blue.png", desc: "Experimental bot. Built for mischief.", special: "Spark Bomb", isPet: false },
  { name: "Tim_pink", hp: 30, atk: 10, img: "images/Tim_pink.png", desc: "Colorful copy. Brighter than real.", special: "Mirror Flash", isPet: false }
];

const enemyPets = [
  { name: "Thorn", hp: 10, atk: 5, img: "images/Thorn.png", desc: "Vengeful whisper. Strikes when unseen.", special: "Vanishing Sting", isPet: true },
  { name: "Morris", hp: 10, atk: 5, img: "images/Morris.png", desc: "Cursed wanderer. Carries broken time.", special: "Haunted Stare", isPet: true },
  { name: "Dragon", hp: 10, atk: 5, img: "images/Dragon.png", desc: "Ancient flame. Silent guardian.", special: "Flame Coil", isPet: true }
];

// Special move effects descriptions
const specialEffects = {
  "Plant Blessing": "Heals allies over time.",
  "Luminous Veil": "Shields the team from the next hit.", 
  "Spark Trick": "Deals extra damage and stuns.",
  "Meowing Chirp": "Boosts morale, raising attack.",
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
// GLOBAL BATTLE STATE
// ═══════════════════════════════════════════════════════════════════════════════

window.BattleCore = {
  roundCount: 1,
  defeatedEnemyNames: [],
  gameStarted: false
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Mobile detection and viewport utilities
function isMobile() {
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function getViewportInfo() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: isMobile(),
    isLandscape: window.innerWidth > window.innerHeight
  };
}

// Card data accessors
function getHP(card) {
  return parseInt(card.querySelector(".hp").textContent);
}

function setHP(card, val) {
  const newHP = Math.max(0, val);
  card.querySelector(".hp").textContent = newHP;
  if (newHP <= 0 && !card.classList.contains("defeated")) {
    window.BattleUI.floatKO(card);
    card.classList.add("defeated");
  }
}

function getATK(card) {
  return parseInt(card.querySelector(".atk").textContent);
}

function getLiving(cards) {
  return cards.filter(c => getHP(c) > 0 && !c.classList.contains("defeated"));
}

// Team helper functions
function getTeamMembers(card) {
  const isPlayerCard = card.closest("#player-team") !== null;
  const teamSelector = isPlayerCard ? "#player-team .card" : "#enemy-team .card";
  return Array.from(document.querySelectorAll(teamSelector));
}

function getOpponentTeam(card) {
  const isPlayerCard = card.closest("#player-team") !== null;
  const teamSelector = isPlayerCard ? "#enemy-team .card" : "#player-team .card";
  return Array.from(document.querySelectorAll(teamSelector));
}

// Damage calculation
function randomDamage(card) {
  const atk = getATK(card);
  const isPet = card.dataset.isPet === 'true';
  return isPet ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * (atk - 4)) + 5;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOARD SETUP
// ═══════════════════════════════════════════════════════════════════════════════

function setupBoard() {
  const playerArea = document.getElementById("player-team");
  const enemyArea = document.getElementById("enemy-team");
  
  if (!playerArea || !enemyArea) {
    console.error("Team areas not found!");
    return;
  }
  
  playerArea.innerHTML = '';
  enemyArea.innerHTML = '';

  const availableMains = enemyMains.filter(e => !window.BattleCore.defeatedEnemyNames.includes(e.name));
  if (availableMains.length < 3) {
    window.BattleUI.displayBattleEnd(true, "All enemy mains defeated! You win the war 🏆");
    return;
  }

  // Add player team
  playerTeam.forEach(data => {
    const card = window.BattleUI.createCard(data, false);
    playerArea.appendChild(card);
  });
  
  // Add enemy team (3 random mains + 1 random pet)
  const shuffledMains = [...availableMains].sort(() => 0.5 - Math.random()).slice(0, 3);
  const pet = enemyPets[Math.floor(Math.random() * enemyPets.length)];
  [pet, ...shuffledMains].forEach(data => {
    const card = window.BattleUI.createCard(data, true);
    enemyArea.appendChild(card);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS EFFECT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

function addStatusEffect(card, effect, duration = 3) {
  if (!card.statusEffects) card.statusEffects = {};
  card.statusEffects[effect] = duration;
  
  // Visual indicator
  card.classList.add(`status-${effect}`);
}

function removeStatusEffect(card, effect) {
  if (card.statusEffects) {
    delete card.statusEffects[effect];
    card.classList.remove(`status-${effect}`);
  }
}

function processStatusEffects(card) {
  if (!card.statusEffects) return;
  
  const effects = Object.keys(card.statusEffects);
  for (const effect of effects) {
    switch (effect) {
      case "burning":
        const burnDamage = 3;
        window.BattleUI.floatDamage(card, burnDamage);
        setHP(card, getHP(card) - burnDamage);
        break;
      case "bleeding":
        const bleedDamage = 2;
        window.BattleUI.floatDamage(card, bleedDamage);
        setHP(card, getHP(card) - bleedDamage);
        break;
      case "stunned":
      case "paralyzed":
      case "confused":
        // These prevent actions (handled in canAct)
        break;
    }
    
    // Decrease duration
    card.statusEffects[effect]--;
    if (card.statusEffects[effect] <= 0) {
      removeStatusEffect(card, effect);
    }
  }
}

function canAct(card) {
  if (!card.statusEffects) return true;
  return !card.statusEffects.stunned && !card.statusEffects.paralyzed;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SPECIAL MOVE EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

async function executeSpecialMove(card, specialName, opponents) {
  const teammates = getTeamMembers(card);
  const livingTeammates = getLiving(teammates);
  const livingOpponents = getLiving(opponents);
  
  switch (specialName) {
    case "Plant Blessing":
      livingTeammates.forEach(ally => {
        if (ally !== card) {
          const healAmount = 5;
          setHP(ally, getHP(ally) + healAmount);
          window.BattleUI.floatHeal(ally, healAmount);
        }
      });
      break;
      
    case "Luminous Veil":
      livingTeammates.forEach(ally => {
        addStatusEffect(ally, "shield", 1);
      });
      break;
      
    case "Spark Trick":
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const damage = 15;
        window.BattleUI.floatDamage(target, damage);
        target.classList.add("damage-glow");
        setHP(target, getHP(target) - damage);
        setTimeout(() => target.classList.remove("damage-glow"), 900);
        addStatusEffect(target, "stunned", 2);
      }
      break;
      
    case "Meowing Chirp":
      livingTeammates.forEach(ally => {
        if (ally !== card) {
          const currentAtk = getATK(ally);
          ally.querySelector(".atk").textContent = currentAtk + 3;
          addStatusEffect(ally, "boosted", 3);
        }
      });
      break;
      
    case "Skull Bash":
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const damage = 12;
        window.BattleUI.floatDamage(target, damage);
        target.classList.add("damage-glow");
        setHP(target, getHP(target) - damage);
        setTimeout(() => target.classList.remove("damage-glow"), 900);
        addStatusEffect(target, "stunned", 2);
      }
      break;
      
    case "Wildfire Curse":
      livingOpponents.forEach(enemy => {
        addStatusEffect(enemy, "burning", 3);
      });
      break;
      
    case "Panic Injection":
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const currentAtk = getATK(target);
        target.querySelector(".atk").textContent = Math.max(1, currentAtk - 5);
        addStatusEffect(target, "confused", 3);
      }
      break;
      
    case "Void Whisper":
      livingOpponents.forEach(enemy => {
        const drainAmount = 3;
        setHP(enemy, getHP(enemy) - drainAmount);
        window.BattleUI.floatDamage(enemy, drainAmount);
      });
      break;
      
    case "Horn Sweep":
      livingOpponents.forEach(enemy => {
        const damage = 8;
        window.BattleUI.floatDamage(enemy, damage);
        enemy.classList.add("damage-glow");
        setHP(enemy, getHP(enemy) - damage);
        setTimeout(() => enemy.classList.remove("damage-glow"), 900);
      });
      break;
      
    case "Ebon Fangs":
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const damage = 10;
        window.BattleUI.floatDamage(target, damage);
        target.classList.add("damage-glow");
        setHP(target, getHP(target) - damage);
        setTimeout(() => target.classList.remove("damage-glow"), 900);
        addStatusEffect(target, "bleeding", 3);
      }
      break;
      
    case "Static Shock":
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        addStatusEffect(target, "paralyzed", 2);
      }
      break;
      
    case "Tectonic Slam":
      livingOpponents.forEach(enemy => {
        const damage = 6;
        window.BattleUI.floatDamage(enemy, damage);
        enemy.classList.add("damage-glow");
        setHP(enemy, getHP(enemy) - damage);
        setTimeout(() => enemy.classList.remove("damage-glow"), 900);
        addStatusEffect(enemy, "stunned", 1);
      });
      break;
      
    case "Spark Bomb":
      livingOpponents.forEach(enemy => {
        const damage = 12;
        window.BattleUI.floatDamage(enemy, damage);
        enemy.classList.add("damage-glow");
        setHP(enemy, getHP(enemy) - damage);
        setTimeout(() => enemy.classList.remove("damage-glow"), 900);
      });
      break;
      
    case "Mirror Flash":
      addStatusEffect(card, "reflect", 2);
      break;
      
    case "Vanishing Sting":
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const damage = 8;
        window.BattleUI.floatDamage(target, damage);
        target.classList.add("damage-glow");
        setHP(target, getHP(target) - damage);
        setTimeout(() => target.classList.remove("damage-glow"), 900);
        addStatusEffect(card, "vanished", 1);
      }
      break;
      
    case "Haunted Stare":
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const currentAtk = getATK(target);
        target.querySelector(".atk").textContent = Math.max(1, currentAtk - 4);
        addStatusEffect(target, "haunted", 4);
      }
      break;
      
    case "Flame Coil":
      livingOpponents.forEach(enemy => {
        const damage = 5;
        window.BattleUI.floatDamage(enemy, damage);
        enemy.classList.add("damage-glow");
        setHP(enemy, getHP(enemy) - damage);
        setTimeout(() => enemy.classList.remove("damage-glow"), 900);
        addStatusEffect(enemy, "burning", 2);
      });
      break;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN BATTLE TURN LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

async function performTurn(card, opponents) {
  if (getHP(card) <= 0 || getLiving(opponents).length === 0) return;
  
  // Process status effects first
  processStatusEffects(card);
  
  // Check if card can act
  if (!canAct(card)) {
    const status = document.getElementById("battle-status");
    const name = card.querySelector(".name-tag").textContent;
    const viewport = getViewportInfo();
    const message = `${name} is stunned and cannot act!`;
    
    if (viewport.isMobile && message.length > 35) {
      status.textContent = `${name} is stunned!`;
    } else {
      status.textContent = message;
    }
    
    await new Promise(r => setTimeout(r, 1000));
    return;
  }

  const status = document.getElementById("battle-status");
  const specialInfo = document.getElementById("special-info");
  const useSpecial = card.dataset.specialUsed === 'false' && Math.random() < 0.25;
  const name = card.querySelector(".name-tag").textContent;

  card.classList.add("highlight-turn");
  await new Promise(r => setTimeout(r, 700));

  if (useSpecial) {
    const specialName = card.querySelector(".special-move").textContent;
    const viewport = getViewportInfo();
    
    if (viewport.isMobile) {
      status.textContent = `${name} uses special!`;
      specialInfo.textContent = `${specialName}`;
    } else {
      status.textContent = `${name} uses their special!`;
      specialInfo.textContent = `Special: ${specialName} — ${specialEffects[specialName] || "A mysterious effect..."}`;
    }
    
    specialInfo.classList.remove("hidden");
    card.classList.add("special-glow");
    card.dataset.specialUsed = 'true';
    window.BattleUI.floatSpecial(card);
    
    await new Promise(r => setTimeout(r, 800));
    await executeSpecialMove(card, specialName, opponents);
    await new Promise(r => setTimeout(r, 400));
    card.classList.remove("special-glow");
  } else {
    specialInfo.classList.add("hidden");
    specialInfo.innerHTML = "&nbsp;";
    const livingOpponents = getLiving(opponents);
    if (livingOpponents.length === 0) return;
    
    const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
    const targetName = target.querySelector(".name-tag").textContent;
    const viewport = getViewportInfo();
    
    let dmg = randomDamage(card);
    if (target.statusEffects && target.statusEffects.shield) {
      const message = viewport.isMobile ? 
        `${name} vs ${targetName} - Blocked!` :
        `${name} attacks ${targetName}, but the shield blocks it!`;
      status.textContent = message;
      removeStatusEffect(target, "shield");
      await new Promise(r => setTimeout(r, 1000));
    } else {
      const targetMessage = viewport.isMobile ? 
        `${name} → ${targetName}...` :
        `${name} targets ${targetName}...`;
      status.textContent = targetMessage;
      await new Promise(r => setTimeout(r, 600));

      const hitMessage = viewport.isMobile ?
        `${name} hits for ${dmg}!` :
        `${name} hits ${targetName} for ${dmg}`;
      status.textContent = hitMessage;
      window.BattleUI.floatDamage(target, dmg);
      target.classList.add("damage-glow");
      setHP(target, getHP(target) - dmg);
      await new Promise(r => setTimeout(r, 900));
      target.classList.remove("damage-glow");
    }
  }

  card.classList.remove("highlight-turn");
  await new Promise(r => setTimeout(r, 300));
}

// ═══════════════════════════════════════════════════════════════════════════════
// VICTORY/DEFEAT CHECKING
// ═══════════════════════════════════════════════════════════════════════════════

function checkVictory(players, enemies) {
  const p = getLiving(players).length > 0;
  const e = getLiving(enemies).length > 0;

  if (!p || !e) {
    const message = p ? 'Victory!' : 'Defeat...';
    window.BattleUI.displayBattleEnd(p, message);

    if (p) {
      const defeatedEnemies = Array.from(document.querySelectorAll("#enemy-team .card.defeated"))
        .filter(card => card.dataset.isPet === 'false')
        .map(card => card.dataset.name);

      window.BattleCore.defeatedEnemyNames.push(...defeatedEnemies.filter(n => !window.BattleCore.defeatedEnemyNames.includes(n)));
    }

    return true;
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN BATTLE EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════

async function executeBattleRound() {
  let allCards = Array.from(document.querySelectorAll(".card"));
  allCards = getLiving(allCards).sort(() => Math.random() - 0.5);

  for (const c of allCards) {
    const isPlayer = c.closest("#player-team") !== null;
    const oppCards = Array.from(document.querySelectorAll(isPlayer ? "#enemy-team .card" : "#player-team .card"));
    const liveOpponents = getLiving(oppCards);
    if (liveOpponents.length === 0) break;

    await performTurn(c, liveOpponents);

    const pCards = Array.from(document.querySelectorAll("#player-team .card"));
    const eCards = Array.from(document.querySelectorAll("#enemy-team .card"));
    if (checkVictory(pCards, eCards)) return true;

    await new Promise(r => setTimeout(r, 500));
  }

  window.BattleCore.roundCount++;
  document.getElementById("battle-status").textContent = `Round ${window.BattleCore.roundCount}`;
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// START BATTLE FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

async function startBattle() {
  const battleButton = document.getElementById("battle-button");
  
  if (!window.BattleCore.gameStarted) {
    // First click - flip the cards and change button text
    window.BattleCore.gameStarted = true;
    window.BattleUI.updateBattleButton();
    window.BattleUI.flipAllCards();
    return;
  }
  
  // Subsequent clicks - start the actual battle
  battleButton.style.display = "none";
  await executeBattleRound();
  
  // Show button again if battle isn't over
  if (!document.querySelector(".restart-button")) {
    battleButton.style.display = "inline-block";
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// Export core functions for use by other modules
window.BattleCore = {
  ...window.BattleCore,
  
  // Data
  playerTeam,
  enemyMains,
  enemyPets,
  specialEffects,
  
  // Utilities
  isMobile,
  getViewportInfo,
  getHP,
  setHP,
  getATK,
  getLiving,
  getTeamMembers,
  getOpponentTeam,
  randomDamage,
  
  // Board management
  setupBoard,
  
  // Status effects
  addStatusEffect,
  removeStatusEffect,
  processStatusEffects,
  canAct,
  
  // Battle execution
  executeSpecialMove,
  performTurn,
  checkVictory,
  executeBattleRound,
  startBattle
};