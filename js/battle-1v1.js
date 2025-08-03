import { characters } from '../data/characters.js';
import { enemies } from '../data/enemies.js';
import { specials } from '../data/specials.js';
import { items } from '../data/items.js';

console.log("Characters:", characters);
console.log("Enemies:", enemies);
console.log("Specials:", specials);
console.log("Items:", items);

// Example init function
export function startBattle() {
  console.log("Starting 1v1 battle...");
}
