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

let roundCount = 1;
let defeatedEnemyNames = [];
let gameStarted = false;

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

// Mobile-aware utility functions
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

function createCard(data, isEnemy) {
  const flipContainer = document.createElement("div");
  flipContainer.className = "card flip-container" + (isEnemy ? " enemy" : "");
  flipContainer.dataset.name = data.name;
  flipContainer.dataset.isPet = data.isPet;
  flipContainer.dataset.specialUsed = "false";

  const inner = document.createElement("div");
  inner.className = "card-inner";

  const front = document.createElement("div");
  front.className = "card-front";
  
  // Mobile-friendly text truncation
  const viewport = getViewportInfo();
  const maxDescLength = viewport.isMobile ? 60 : 100;
  const truncatedDesc = data.desc.length > maxDescLength ? 
    data.desc.substring(0, maxDescLength) + "..." : data.desc;
  
  front.innerHTML = `
    <div class="bust-container"><img src="${data.img}" alt="${data.name}" loading="lazy"></div>
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
  flipContainer.appendChild(inner);

  return flipContainer;
}

function buildTeams() {
  const playerArea = document.getElementById("player-team");
  const enemyArea = document.getElementById("enemy-team");
  playerArea.innerHTML = '';
  enemyArea.innerHTML = '';

  const availableMains = enemyMains.filter(e => !defeatedEnemyNames.includes(e.name));
  if (availableMains.length < 3) {
    showVictoryMessage("All enemy mains defeated! You win the war 🏆");
    return;
  }

  playerTeam.forEach(data => playerArea.appendChild(createCard(data, false)));
  const shuffledMains = [...availableMains].sort(() => 0.5 - Math.random()).slice(0, 3);
  const pet = enemyPets[Math.floor(Math.random() * enemyPets.length)];
  [pet, ...shuffledMains].forEach(data => enemyArea.appendChild(createCard(data, true)));
}

function getHP(card) {
  return parseInt(card.querySelector(".hp").textContent);
}

function setHP(card, val) {
  const newHP = Math.max(0, val);
  card.querySelector(".hp").textContent = newHP;
  if (newHP <= 0 && !card.classList.contains("defeated")) {
    floatKO(card);
    card.classList.add("defeated");
  }
}

function getATK(card) {
  return parseInt(card.querySelector(".atk").textContent);
}

function getLiving(cards) {
  return cards.filter(c => getHP(c) > 0 && !c.classList.contains("defeated"));
}

// Mobile-safe floating text functions
function createFloatingText(card, text, className, customStyles = {}) {
  const tag = document.createElement("div");
  tag.className = className;
  tag.textContent = text;
  
  // Ensure floating text stays within card bounds
  const cardRect = card.getBoundingClientRect();
  const viewport = getViewportInfo();
  
  // Apply custom styles
  Object.assign(tag.style, {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontWeight: "bold",
    pointerEvents: "none",
    zIndex: "1000",
    transition: "all 0.8s ease-out",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
    maxWidth: "80%",
    textAlign: "center",
    wordBreak: "break-word",
    ...customStyles
  });
  
  card.appendChild(tag);
  
  // Mobile-safe animation
  const moveDistance = viewport.isMobile ? -20 : -30;
  setTimeout(() => {
    tag.style.top = `${moveDistance}px`;
    tag.style.opacity = '0';
  }, 50);
  
  setTimeout(() => {
    if (tag.parentNode) {
      tag.remove();
    }
  }, 1000);
  
  return tag;
}

function floatDamage(card, amt) {
  createFloatingText(card, `-${amt}`, "float-damage", {
    color: "#ff4444",
    fontSize: "clamp(0.8rem, 2.5vw, 1.5rem)"
  });

  // Add shrink-hit animation
  card.classList.add("shrink-hit");
  setTimeout(() => card.classList.remove("shrink-hit"), 250);
}

function floatKO(card) {
  createFloatingText(card, "KO!", "float-ko", {
    color: "#ff0000",
    fontSize: "clamp(1rem, 3vw, 2rem)"
  });
}

function floatSpecial(card) {
  createFloatingText(card, "Special!", "float-special", {
    color: "#ffdd44",
    fontSize: "clamp(0.7rem, 2.2vw, 1.3rem)",
    top: "40%"
  });
}

function floatHeal(card, amt) {
  createFloatingText(card, `+${amt}`, "float-heal", {
    color: "#4CAF50",
    fontSize: "clamp(0.8rem, 2.5vw, 18px)",
    top: "30%"
  });
}

function randomDamage(card) {
  const atk = getATK(card);
  const isPet = card.dataset.isPet === 'true';
  return isPet ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * (atk - 4)) + 5;
}

// Helper function to get all team members (living and dead)
function getTeamMembers(card) {
  const isPlayerCard = card.closest("#player-team") !== null;
  const teamSelector = isPlayerCard ? "#player-team .card" : "#enemy-team .card";
  return Array.from(document.querySelectorAll(teamSelector));
}

// Helper function to get opponent team members
function getOpponentTeam(card) {
  const isPlayerCard = card.closest("#player-team") !== null;
  const teamSelector = isPlayerCard ? "#enemy-team .card" : "#player-team .card";
  return Array.from(document.querySelectorAll(teamSelector));
}

// Apply status effects
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

// Mobile-friendly status display
function updateStatusDisplay() {
  const status = document.getElementById("battle-status");
  const specialInfo = document.getElementById("special-info");
  
  // Ensure text fits on mobile screens
  const viewport = getViewportInfo();
  if (viewport.isMobile) {
    const maxLength = viewport.width < 400 ? 30 : 50;
    if (status.textContent.length > maxLength) {
      status.textContent = status.textContent.substring(0, maxLength - 3) + "...";
    }
  }
}

// Execute special move effects
async function executeSpecialMove(card, specialName, opponents) {
  const teammates = getTeamMembers(card);
  const livingTeammates = getLiving(teammates);
  const livingOpponents = getLiving(opponents);
  
  switch (specialName) {
    case "Plant Blessing":
      // Heals allies over time
      livingTeammates.forEach(ally => {
        if (ally !== card) {
          const healAmount = 5;
          setHP(ally, getHP(ally) + healAmount);
          floatHeal(ally, healAmount);
        }
      });
      break;
      
    case "Luminous Veil":
      // Shields the team from the next hit
      livingTeammates.forEach(ally => {
        addStatusEffect(ally, "shield", 1);
      });
      break;
      
    case "Spark Trick":
      // Deals extra damage and stuns
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const damage = 15; // Higher damage than normal
        floatDamage(target, damage);
        target.classList.add("damage-glow");
        setHP(target, getHP(target) - damage);
        setTimeout(() => target.classList.remove("damage-glow"), 900);
        addStatusEffect(target, "stunned", 2);
      }
      break;
      
    case "Meowing Chirp": // Simon's move
      // Boosts morale, raising attack
      livingTeammates.forEach(ally => {
        if (ally !== card) {
          const currentAtk = getATK(ally);
          ally.querySelector(".atk").textContent = currentAtk + 3;
          addStatusEffect(ally, "boosted", 3);
        }
      });
      break;
      
    case "Skull Bash":
      // Stuns and damages the target
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const damage = 12;
        floatDamage(target, damage);
        target.classList.add("damage-glow");
        setHP(target, getHP(target) - damage);
        setTimeout(() => target.classList.remove("damage-glow"), 900);
        addStatusEffect(target, "stunned", 2);
      }
      break;
      
    case "Wildfire Curse":
      // Applies burning damage over time
      livingOpponents.forEach(enemy => {
        addStatusEffect(enemy, "burning", 3);
      });
      break;
      
    case "Panic Injection":
      // Confuses and weakens
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const currentAtk = getATK(target);
        target.querySelector(".atk").textContent = Math.max(1, currentAtk - 5);
        addStatusEffect(target, "confused", 3);
      }
      break;
      
    case "Void Whisper":
      // Drains hope and lowers defense (reduces HP)
      livingOpponents.forEach(enemy => {
        const drainAmount = 3;
        setHP(enemy, getHP(enemy) - drainAmount);
        floatDamage(enemy, drainAmount);
      });
      break;
      
    case "Horn Sweep":
      // Hits all enemies in a wide arc
      livingOpponents.forEach(enemy => {
        const damage = 8;
        floatDamage(enemy, damage);
        enemy.classList.add("damage-glow");
        setHP(enemy, getHP(enemy) - damage);
        setTimeout(() => enemy.classList.remove("damage-glow"), 900);
      });
      break;
      
    case "Ebon Fangs":
      // Pierces armor and causes bleeding
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const damage = 10;
        floatDamage(target, damage);
        target.classList.add("damage-glow");
        setHP(target, getHP(target) - damage);
        setTimeout(() => target.classList.remove("damage-glow"), 900);
        addStatusEffect(target, "bleeding", 3);
      }
      break;
      
    case "Static Shock":
      // Paralyzes one opponent
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        addStatusEffect(target, "paralyzed", 2);
      }
      break;
      
    case "Tectonic Slam":
      // Shakes the battlefield - hits all enemies
      livingOpponents.forEach(enemy => {
        const damage = 6;
        floatDamage(enemy, damage);
        enemy.classList.add("damage-glow");
        setHP(enemy, getHP(enemy) - damage);
        setTimeout(() => enemy.classList.remove("damage-glow"), 900);
        addStatusEffect(enemy, "stunned", 1);
      });
      break;
      
    case "Spark Bomb":
      // Deals explosive damage
      livingOpponents.forEach(enemy => {
        const damage = 12;
        floatDamage(enemy, damage);
        enemy.classList.add("damage-glow");
        setHP(enemy, getHP(enemy) - damage);
        setTimeout(() => enemy.classList.remove("damage-glow"), 900);
      });
      break;
      
    case "Mirror Flash":
      // Reflects incoming attacks (defensive buff)
      addStatusEffect(card, "reflect", 2);
      break;
      
    case "Vanishing Sting":
      // Hits and vanishes without trace
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const damage = 8;
        floatDamage(target, damage);
        target.classList.add("damage-glow");
        setHP(target, getHP(target) - damage);
        setTimeout(() => target.classList.remove("damage-glow"), 900);
        // Card becomes temporarily untargetable
        addStatusEffect(card, "vanished", 1);
      }
      break;
      
    case "Haunted Stare":
      // Haunts a target, lowering focus
      if (livingOpponents.length > 0) {
        const target = livingOpponents[Math.floor(Math.random() * livingOpponents.length)];
        const currentAtk = getATK(target);
        target.querySelector(".atk").textContent = Math.max(1, currentAtk - 4);
        addStatusEffect(target, "haunted", 4);
      }
      break;
      
    case "Flame Coil":
      // Burns enemies in a ring of fire
      livingOpponents.forEach(enemy => {
        const damage = 5;
        floatDamage(enemy, damage);
        enemy.classList.add("damage-glow");
        setHP(enemy, getHP(enemy) - damage);
        setTimeout(() => enemy.classList.remove("damage-glow"), 900);
        addStatusEffect(enemy, "burning", 2);
      });
      break;
  }
}

// Process status effects at the start of each turn
function processStatusEffects(card) {
  if (!card.statusEffects) return;
  
  const effects = Object.keys(card.statusEffects);
  for (const effect of effects) {
    switch (effect) {
      case "burning":
        const burnDamage = 3;
        floatDamage(card, burnDamage);
        setHP(card, getHP(card) - burnDamage);
        break;
      case "bleeding":
        const bleedDamage = 2;
        floatDamage(card, bleedDamage);
        setHP(card, getHP(card) - bleedDamage);
        break;
      case "stunned":
      case "paralyzed":
      case "confused":
        // These prevent actions (handled in performTurn)
        break;
    }
    
    // Decrease duration
    card.statusEffects[effect]--;
    if (card.statusEffects[effect] <= 0) {
      removeStatusEffect(card, effect);
    }
  }
}

// Check if a card can act (not stunned/paralyzed)
function canAct(card) {
  if (!card.statusEffects) return true;
  return !card.statusEffects.stunned && !card.statusEffects.paralyzed;
}

// Mobile-friendly message display
function showVictoryMessage(message) {
  const status = document.getElementById("battle-status");
  const viewport = getViewportInfo();
  
  if (viewport.isMobile && message.length > 40) {
    status.textContent = message.substring(0, 37) + "...";
  } else {
    status.textContent = message;
  }
}

// Main turn execution function
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
    
    // Mobile-friendly status messages
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
    floatSpecial(card);
    
    await new Promise(r => setTimeout(r, 800));
    
    // Execute the actual special move effect
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
    
    // Check if target has shield
    let dmg = randomDamage(card);
    if (target.statusEffects && target.statusEffects.shield) {
      const message = viewport.isMobile ? 
        `${name} vs ${targetName} - Blocked!` :
        `${name} attacks ${targetName}, but the shield blocks it!`;
      status.textContent = message;
      removeStatusEffect(target, "shield");
      await new Promise(r => setTimeout(r, 1000));
    } else {
      // Mobile-friendly combat messages
      const targetMessage = viewport.isMobile ? 
        `${name} → ${targetName}...` :
        `${name} targets ${targetName}...`;
      status.textContent = targetMessage;
      await new Promise(r => setTimeout(r, 600));

      const hitMessage = viewport.isMobile ?
        `${name} hits for ${dmg}!` :
        `${name} hits ${targetName} for ${dmg}`;
      status.textContent = hitMessage;
      floatDamage(target, dmg);
      target.classList.add("damage-glow");
      setHP(target, getHP(target) - dmg);
      await new Promise(r => setTimeout(r, 900));
      target.classList.remove("damage-glow");
    }
  }

  card.classList.remove("highlight-turn");
  await new Promise(r => setTimeout(r, 300));
  
  // Update status display for mobile
  updateStatusDisplay();
}

async function startBattle() {
  const battleButton = document.getElementById("battle-button");
  
  if (!gameStarted) {
    // First click - flip the cards and change button text
    gameStarted = true;
    battleButton.textContent = "Start Round";
    
    // Flip all cards with a slight delay for better mobile UX
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('flipped');
      }, index * 100); // Stagger the flips
    });
    return;
  }
  
  // Subsequent clicks - start the actual battle
  battleButton.style.display = "none";

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
    if (checkVictory(pCards, eCards)) return;

    await new Promise(r => setTimeout(r, 500));
  }

  roundCount++;
  document.getElementById("battle-status").textContent = `Round ${roundCount}`;
  document.getElementById("battle-button").style.display = "inline-block";
}

function checkVictory(players, enemies) {
  const p = getLiving(players).length > 0;
  const e = getLiving(enemies).length > 0;

  if (!p || !e) {
    const viewport = getViewportInfo();
    const message = p ? 'Victory!' : 'Defeat...';
    const statusElement = document.getElementById("battle-status");
    statusElement.textContent = message;
    statusElement.classList.add("victory-defeat");
    document.getElementById("special-info").textContent = "";

    if (p) {
      const defeatedEnemies = Array.from(document.querySelectorAll("#enemy-team .card.defeated"))
        .filter(card => card.dataset.isPet === 'false')
        .map(card => card.dataset.name);

      defeatedEnemyNames.push(...defeatedEnemies.filter(n => !defeatedEnemyNames.includes(n)));
    }

    const btn = document.createElement("button");
    btn.className = "restart-button";
    btn.textContent = viewport.isMobile ? "Restart" : "Restart Game";
    btn.onclick = () => {
      document.getElementById("restart-container").innerHTML = "";
      roundCount = 1;
      gameStarted = false;
      buildTeams();
      const battleStatus = document.getElementById("battle-status");
      battleStatus.textContent = "Round 1";
      battleStatus.classList.remove("victory-defeat");
      document.getElementById("special-info").textContent = "&nbsp;";
      document.getElementById("special-info").classList.add("hidden");
      const battleButton = document.getElementById("battle-button");
      battleButton.textContent = "Start Game";
      battleButton.style.display = "inline-block";
    };
    document.getElementById("restart-container").appendChild(btn);
    return true;
  }
  return false;
}

// Enhanced mobile touch handling
function setupMobileEventListeners() {
  let touchStartTime = 0;
  let lastTap = 0;
  
  document.addEventListener('touchstart', function(e) {
    touchStartTime = Date.now();
  }, { passive: true });
  
  document.addEventListener('touchend', function(e) {
    const touchDuration = Date.now() - touchStartTime;
    const currentTime = Date.now();
    const tapDelay = currentTime - lastTap;
    
    // Prevent double-tap zoom
    if (tapDelay < 500 && tapDelay > 0) {
      e.preventDefault();
      return false;
    }
    
    lastTap = currentTime;
    
    // Handle card selection with touch
    if (touchDuration < 200) { // Quick tap
      const card = e.target.closest('.card');
      if (card) {
        e.preventDefault();
        
        // Remove 'active' from all other cards
        document.querySelectorAll('.card.active').forEach(c => {
          if (c !== card) c.classList.remove('active');
        });

        // Toggle active on touched card
        card.classList.toggle('active');
      } else {
        // Touched outside any card — remove all active
        document.querySelectorAll('.card.active').forEach(c => c.classList.remove('active'));
      }
    }
  }, { passive: false });
}

// Handle orientation changes
function handleOrientationChange() {
  // Delay to allow viewport to settle
  setTimeout(() => {
    const viewport = getViewportInfo();
    
    // Recalculate layout if needed
    if (viewport.isMobile) {
      // Ensure all floating elements are cleaned up
      document.querySelectorAll('.float-damage, .float-ko, .float-special, .float-heal').forEach(el => {
        if (el.parentNode) {
          el.remove();
        }
      });
    }
    
    // Update button text for new orientation
    const battleButton = document.getElementById("battle-button");
    if (battleButton && viewport.isMobile && !gameStarted) {
      battleButton.textContent = viewport.width < 400 ? "Start" : "Start Game";
    }
  }, 100);
}

// Initialize the game
function initializeGame() {
  buildTeams();
  
  // Set up mobile-specific event listeners
  if (isMobile()) {
    setupMobileEventListeners();
  } else {
    // Desktop click handling
    document.addEventListener('click', function (e) {
      if (e.target.closest('.card')) {
        const card = e.target.closest('.card');

        // Remove 'active' from all other cards
        document.querySelectorAll('.card.active').forEach(c => {
          if (c !== card) c.classList.remove('active');
        });

        // Toggle active on clicked card
        card.classList.toggle('active');
      } else {
        // Clicked outside any card — remove all active
        document.querySelectorAll('.card.active').forEach(c => c.classList.remove('active'));
      }
    });
  }
  
  // Handle orientation and resize events
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', handleOrientationChange);
  
  // Prevent context menu on long press for mobile
  document.addEventListener('contextmenu', function(e) {
    if (isMobile() && e.target.closest('.card')) {
      e.preventDefault();
    }
  });
  
  // Prevent text selection on mobile
  if (isMobile()) {
    document.addEventListener('selectstart', function(e) {
      if (e.target.closest('.card')) {
        e.preventDefault();
      }
    });
  }
}

// Start the game when the page loads
document.addEventListener('DOMContentLoaded', initializeGame);

// Fallback initialization if DOMContentLoaded already fired
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGame);
} else {
  initializeGame();
}
