// ═══════════════════════════════════════════════════════════════════════════════
// BATTLE UI - Card creation, animations, floating text, mobile handling
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// CARD CREATION
// ═══════════════════════════════════════════════════════════════════════════════

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
  const viewport = window.BattleCore.getViewportInfo();
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

// ═══════════════════════════════════════════════════════════════════════════════
// FLOATING TEXT EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

function createFloatingText(card, text, className, customStyles = {}) {
  const tag = document.createElement("div");
  tag.className = className;
  tag.textContent = text;
  
  // Ensure floating text stays within card bounds
  const cardRect = card.getBoundingClientRect();
  const viewport = window.BattleCore.getViewportInfo();
  
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

// ═══════════════════════════════════════════════════════════════════════════════
// MOBILE EVENT HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

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

function setupDesktopEventListeners() {
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

// ═══════════════════════════════════════════════════════════════════════════════
// RESPONSIVE AND ORIENTATION HANDLING
// ═══════════════════════════════════════════════════════════════════════════════

function handleOrientationChange() {
  // Delay to allow viewport to settle
  setTimeout(() => {
    const viewport = window.BattleCore.getViewportInfo();
    
    // Recalculate layout if needed
    if (viewport.isMobile) {
      // Ensure all floating elements are cleaned up
      cleanupFloatingElements();
    }
    
    // Update button text for new orientation
    updateBattleButton();
  }, 100);
}

function updateStatusDisplay() {
  const status = document.getElementById("battle-status");
  const specialInfo = document.getElementById("special-info");
  
  // Ensure text fits on mobile screens
  const viewport = window.BattleCore.getViewportInfo();
  if (viewport.isMobile && status) {
    const maxLength = viewport.width < 400 ? 30 : 50;
    if (status.textContent.length > maxLength) {
      status.textContent = status.textContent.substring(0, maxLength - 3) + "...";
    }
  }
}

function showVictoryMessage(message) {
  const status = document.getElementById("battle-status");
  const viewport = window.BattleCore.getViewportInfo();
  
  if (viewport.isMobile && message.length > 40) {
    status.textContent = message.substring(0, 37) + "...";
  } else {
    status.textContent = message;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BUTTON CREATION AND MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

function createRestartButton() {
  const viewport = window.BattleCore.getViewportInfo();
  const btn = document.createElement("button");
  btn.className = "restart-button";
  btn.textContent = viewport.isMobile ? "Restart" : "Restart Game";
  
  btn.onclick = () => {
    // Clear restart container
    const restartContainer = document.getElementById("restart-container");
    if (restartContainer) {
      restartContainer.innerHTML = "";
    }
    
    // Reset battle state
    window.BattleCore.roundCount = 1;
    window.BattleCore.gameStarted = false;
    
    // Reset UI state and rebuild teams
    const battleStatus = document.getElementById("battle-status");
    if (battleStatus) {
      battleStatus.textContent = "Round 1";
      battleStatus.classList.remove("victory-defeat");
    }
    
    const specialInfo = document.getElementById("special-info");
    if (specialInfo) {
      specialInfo.textContent = "";
      specialInfo.classList.add("hidden");
    }
    
    const battleButton = document.getElementById("battle-button");
    if (battleButton) {
      battleButton.textContent = viewport.isMobile ? "Start" : "Start Game";
      battleButton.style.display = "inline-block";
    }
    
    // Reset all card animations and rebuild teams
    resetCardAnimations();
    window.BattleCore.setupBoard();
  };
  
  return btn;
}

function updateBattleButton() {
  const battleButton = document.getElementById("battle-button");
  if (!battleButton) return;
  
  const viewport = window.BattleCore.getViewportInfo();
  
  if (!window.BattleCore.gameStarted) {
    battleButton.textContent = viewport.isMobile ? 
      (viewport.width < 400 ? "Start" : "Start Game") : 
      "Start Game";
  } else {
    battleButton.textContent = "Start Round";
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD ANIMATIONS AND EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════

function flipAllCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('flipped');
    }, index * 100); // Stagger the flips
  });
}

function resetCardAnimations() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    // Remove all animation classes
    card.classList.remove(
      'highlight-turn', 'special-glow', 'damage-glow', 
      'shrink-hit', 'active', 'flipped'
    );
    
    // Remove all status effect classes
    const statusClasses = [
      'status-burning', 'status-bleeding', 'status-stunned', 
      'status-paralyzed', 'status-shield', 'status-boosted',
      'status-confused', 'status-haunted', 'status-reflect', 
      'status-vanished'
    ];
    
    statusClasses.forEach(cls => card.classList.remove(cls));
    
    // Clear status effects data
    if (card.statusEffects) {
      card.statusEffects = {};
    }
    
    // Reset special usage
    card.dataset.specialUsed = 'false';
  });
}

function cleanupFloatingElements() {
  const floatingSelectors = [
    '.float-damage', '.float-ko', '.float-special', '.float-heal'
  ];
  
  floatingSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (el.parentNode) {
        el.remove();
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// VICTORY/DEFEAT DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

function displayBattleEnd(isVictory, customMessage = null) {
  const status = document.getElementById("battle-status");
  const specialInfo = document.getElementById("special-info");
  const viewport = window.BattleCore.getViewportInfo();
  
  let message = customMessage;
  if (!message) {
    message = isVictory ? 'Victory!' : 'Defeat...';
  }
  
  if (viewport.isMobile && message.length > 40) {
    status.textContent = message.substring(0, 37) + "...";
  } else {
    status.textContent = message;
  }
  
  status.classList.add("victory-defeat");
  
  if (specialInfo) {
    specialInfo.textContent = "";
    specialInfo.classList.add("hidden");
  }
  
  // Create and add restart button
  const restartContainer = document.getElementById("restart-container");
  if (restartContainer) {
    restartContainer.innerHTML = "";
    restartContainer.appendChild(createRestartButton());
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM BUILDING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

function clearTeams() {
  const playerArea = document.getElementById("player-team");
  const enemyArea = document.getElementById("enemy-team");
  
  if (playerArea) playerArea.innerHTML = '';
  if (enemyArea) enemyArea.innerHTML = '';
}

function addCardToTeam(cardData, isEnemy = false) {
  const teamSelector = isEnemy ? "#enemy-team" : "#player-team";
  const teamArea = document.querySelector(teamSelector);
  
  if (!teamArea) {
    console.error(`Team area not found: ${teamSelector}`);
    return null;
  }
  
  const card = createCard(cardData, isEnemy);
  teamArea.appendChild(card);
  return card;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION AND EVENT SETUP
// ═══════════════════════════════════════════════════════════════════════════════

function initializeBattleUI() {
  // Set up mobile or desktop event listeners
  if (window.BattleCore.isMobile()) {
    setupMobileEventListeners();
  } else {
    setupDesktopEventListeners();
  }
  
  // Handle orientation and resize events
  window.addEventListener('orientationchange', handleOrientationChange);
  window.addEventListener('resize', handleOrientationChange);
  
  // Prevent context menu on long press for mobile
  document.addEventListener('contextmenu', function(e) {
    if (window.BattleCore.isMobile() && e.target.closest('.card')) {
      e.preventDefault();
    }
  });
  
  // Prevent text selection on mobile
  if (window.BattleCore.isMobile()) {
    document.addEventListener('selectstart', function(e) {
      if (e.target.closest('.card')) {
        e.preventDefault();
      }
    });
  }
  
  // Initial button update
  updateBattleButton();
  
  // Initialize the board
  window.BattleCore.setupBoard();
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function updateAllCardVisuals() {
  // Update any responsive elements based on current viewport
  const viewport = window.BattleCore.getViewportInfo();
  
  // Clean up any orphaned floating elements
  cleanupFloatingElements();
  
  // Update button text
  updateBattleButton();
  
  // Update status display
  updateStatusDisplay();
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

// Export all UI functions to window.BattleUI
window.BattleUI = {
  // Card creation
  createCard,
  
  // Floating text effects
  floatDamage,
  floatKO,
  floatSpecial,
  floatHeal,
  createFloatingText,
  
  // Mobile interaction handling
  setupMobileEventListeners,
  setupDesktopEventListeners,
  
  // Layout and responsive utilities
  handleOrientationChange,
  updateStatusDisplay,
  showVictoryMessage,
  
  // Card animations
  flipAllCards,
  resetCardAnimations,
  cleanupFloatingElements,
  
  // Button management
  createRestartButton,
  updateBattleButton,
  
  // Battle end display
  displayBattleEnd,
  
  // Team building
  clearTeams,
  addCardToTeam,
  
  // Initialization
  initializeBattleUI,
  
  // Utilities
  updateAllCardVisuals
};