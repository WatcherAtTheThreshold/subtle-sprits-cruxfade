
document.addEventListener('DOMContentLoaded', function () {
  const characters = document.querySelectorAll('.character-option');
  const startButton = document.getElementById('start-button');

  characters.forEach(character => {
    character.addEventListener('click', () => {
      const name = character.dataset.name;
      localStorage.setItem('selectedPlayer', name);

      characters.forEach(c => c.classList.remove('selected'));
      character.classList.add('selected');

      startButton.textContent = `Play as ${name}`;
      startButton.disabled = false;
    });
  });

  startButton.addEventListener('click', () => {
    window.location.href = 'battle1v1.html';
  });
});
