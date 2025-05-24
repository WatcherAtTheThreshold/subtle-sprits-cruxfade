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

const specialEffects = {
  "Plant Blessing": "Heals allies over time.",
  "Luminous Veil": "Shields the team from the next hit.",
  "Spark Trick": "Deals extra damage and stuns.",
  "Encouraging Chirp": "Boosts morale, raising attack.",
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
  front.innerHTML = `
    <div class="bust-container"><img src="${data.img}" alt="${data.name}"></div>
    <div class="name-tag">${data.name}</div>
    <div class="stat hp">${data.hp}</div>
    <div class="stat atk">${data.atk}</div>
    <div class="description">${data.desc}</div>
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
    alert("All enemy mains defeated! You win the war 🏆");
    return;
  }

  playerTeam.forEach(data => playerArea.appendChild(createCard(data, false)));
  const shuffledMains = [...availableMains].sort(() => 0.5 - Math.random()).slice(0, 3);
  const pet = enemyPets[Math.floor(Math.random() * enemyPets.length)];
  [pet, ...shuffledMains].forEach(data => enemyArea.appendChild(createCard(data, true)));

  setTimeout(() => {
    document.querySelectorAll('.card').forEach(card => card.classList.add('flipped'));
  }, 1000);
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

function floatDamage(card, amt) {
  const tag = document.createElement("div");
  tag.className = "float-damage";
  tag.textContent = `-${amt}`;
  card.appendChild(tag);

  // Add shrink-hit animation
  card.classList.add("shrink-hit");
  setTimeout(() => card.classList.remove("shrink-hit"), 250);

  // Animate the damage text
  setTimeout(() => tag.style.top = '-30px', 50);
  setTimeout(() => tag.style.opacity = '0', 50);
  setTimeout(() => tag.remove(), 1000);
}

function floatKO(card) {
  const tag = document.createElement("div");
  tag.className = "float-ko";
  tag.textContent = "KO!";
  card.appendChild(tag);
  setTimeout(() => tag.style.top = '-30px', 50);
  setTimeout(() => tag.style.opacity = '0', 50);
  setTimeout(() => tag.remove(), 1000);
}

function floatSpecial(card) {
  const tag = document.createElement("div");
  tag.className = "float-special";
  tag.textContent = "Special!";
  card.appendChild(tag);
  setTimeout(() => tag.style.top = '-40px', 50);
  setTimeout(() => tag.style.opacity = '0', 50);
  setTimeout(() => tag.remove(), 1000);
}

function randomDamage(card) {
  const atk = getATK(card);
  const isPet = card.dataset.isPet === 'true';
  return isPet ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * (atk - 4)) + 5;
}

async function performTurn(card, opponents) {
  if (getHP(card) <= 0 || getLiving(opponents).length === 0) return;

  const status = document.getElementById("battle-status");
  const specialInfo = document.getElementById("special-info");
  const useSpecial = card.dataset.specialUsed === 'false' && Math.random() < 0.25;
  const name = card.querySelector(".name-tag").textContent;

  card.classList.add("highlight-turn");
  await new Promise(r => setTimeout(r, 700));

  if (useSpecial) {
    status.textContent = `${name} uses their special!`;
    const specialName = card.querySelector(".special-move").textContent;
    specialInfo.classList.remove("hidden");
    specialInfo.textContent = `Special: ${specialName} — ${specialEffects[specialName] || "A mysterious effect..."}`;
    card.classList.add("special-glow");
    card.dataset.specialUsed = 'true';
    floatSpecial(card);
    await new Promise(r => setTimeout(r, 1200));
    card.classList.remove("special-glow");
  } else {
    specialInfo.classList.add("hidden");
    specialInfo.innerHTML = "&nbsp;";
    const target = getLiving(opponents)[Math.floor(Math.random() * getLiving(opponents).length)];
    const targetName = target.querySelector(".name-tag").textContent;
    const dmg = randomDamage(card);

    status.textContent = `${name} targets ${targetName}...`;
    await new Promise(r => setTimeout(r, 600));

    status.textContent = `${name} hits ${targetName} for ${dmg}`;
    floatDamage(target, dmg);
    target.classList.add("damage-glow");
    setHP(target, getHP(target) - dmg);
    await new Promise(r => setTimeout(r, 900));
    target.classList.remove("damage-glow");
  }

  card.classList.remove("highlight-turn");
  await new Promise(r => setTimeout(r, 300));
}

async function startBattle() {
  document.getElementById("battle-button").style.display = "none";

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
    document.getElementById("battle-status").textContent = p ? 'Victory!' : 'Defeat...';
    document.getElementById("special-info").textContent = "";

    if (p) {
      const defeatedEnemies = Array.from(document.querySelectorAll("#enemy-team .card.defeated"))
        .filter(card => card.dataset.isPet === 'false')
        .map(card => card.dataset.name);

      defeatedEnemyNames.push(...defeatedEnemies.filter(n => !defeatedEnemyNames.includes(n)));
    }

    const btn = document.createElement("button");
    btn.className = "restart-button";
    btn.textContent = "Restart Game";
    btn.onclick = () => {
      document.getElementById("restart-container").innerHTML = "";
      roundCount = 1;
      buildTeams();
      document.getElementById("battle-status").textContent = "Round 1";
      document.getElementById("special-info").textContent = "&nbsp;";
      document.getElementById("special-info").classList.add("hidden");
      document.getElementById("battle-button").style.display = "inline-block";
    };
    document.getElementById("restart-container").appendChild(btn);
    return true;
  }
  return false;
}

buildTeams();

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
