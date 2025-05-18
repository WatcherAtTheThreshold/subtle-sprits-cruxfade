
const playerTeam = ['Timothy', 'Magdaline', 'Fizzwick', 'Simon'];
const enemyCharacters = ['Gwar', 'Mildred', 'Dr-Burgly', 'Shelindra', 'Bill', 'Draxel', 'Xavier', 'Tong', 'Tim_blue', 'Tim_pink'];
const enemyPets = ['Thorn', 'Morris', 'Dragon'];

function getRandomEnemies(count) {
  const shuffled = [...enemyCharacters].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
function getRandomPet() {
  const pick = enemyPets[Math.floor(Math.random() * enemyPets.length)];
  return pick;
}

function createCard(name, isEnemy = false, isPet = false) {
  const card = document.createElement('div');
  card.className = 'card' + (isEnemy ? ' enemy' : '');
  const role = isPet ? 'Pet companion' : isEnemy ? 'Enemy combatant' : 'Ally combatant';
  const imageSrc = `images/${name}.png`;

  card.innerHTML = `
    <div class="stat hp">HP: ${isPet ? 10 : 30}</div>
    <div class="stat atk">ATK: ${isPet ? 5 : 10}</div>
    <div class="bust-container"><img src="${imageSrc}" alt="${name}"></div>
    <div class="name-tag">${name}</div>
    <div class="description">${role}</div>
  `;
  return card;
}

function setupGrid() {
  const grid = document.getElementById('card-grid');
  grid.innerHTML = '';
  playerTeam.forEach(name => grid.appendChild(createCard(name)));
  const enemies = getRandomEnemies(3);
  enemies.forEach(name => grid.appendChild(createCard(name, true)));
  const pet = getRandomPet();
  grid.appendChild(createCard(pet, true, true));
}

function startBattle() {
  document.getElementById('battle-status').innerText = "Battle Started!";
}

window.onload = setupGrid;
