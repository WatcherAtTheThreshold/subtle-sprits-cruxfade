// ═══════════════════════════════════════════════════════════════════════════════
// ITEMS DATA - Equipment, consumables, and collectibles
// Future expansion for character customization and strategy
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// CONSUMABLE ITEMS - Single-use battle items
// Healing potions, damage boosters, utility items
// ═══════════════════════════════════════════════════════════════════════════════

export const CONSUMABLE_ITEMS = {
  healingPotion: {
    name: "Healing Potion",
    type: "consumable",
    category: "healing",
    rarity: "common",
    
    // Item Properties
    stackable: true,
    maxStack: 5,
    usesInBattle: 1,
    
    // Visual Assets
    icon: "../images/items/healing-potion.png",
    color: "#FF69B4",
    
    // Effects
    effect: {
      type: "heal",
      power: 15,
      target: "self",
      description: "Restores 15 HP instantly"
    },
    
    // Lore and Description
    description: "A magical elixir that restores vitality",
    flavorText: "Brewed by forest sprites, this potion glimmers with life-giving energy.",
    
    // Economy
    buyPrice: 50,
    sellPrice: 25,
    
    // Implementation
    use: (user, battleSystem) => {
      const healAmount = 15;
      const currentHP = battleSystem.getHP(user);
      const maxHP = user.dataset.maxHP || 30;
      const newHP = Math.min(maxHP, currentHP + healAmount);
      
      battleSystem.setHP(user, newHP);
      battleSystem.floatHeal(user, newHP - currentHP);
      
      return {
        success: true,
        message: `${user.dataset.name} drinks a healing potion and recovers ${newHP - currentHP} HP!`,
        healAmount: newHP - currentHP
      };
    }
  },

  energyElixir: {
    name: "Energy Elixir",
    type: "consumable",
    category: "buff",
    rarity: "uncommon",
    
    // Item Properties
    stackable: true,
    maxStack: 3,
    usesInBattle: 1,
    
    // Visual Assets
    icon: "../images/items/energy-elixir.png",
    color: "#FFD700",
    
    // Effects
    effect: {
      type: "buff",
      power: 5,
      target: "self",
      duration: 3,
      description: "Increases attack by 5 for 3 turns"
    },
    
    // Lore and Description
    description: "A stimulating brew that enhances combat prowess",
    flavorText: "This golden liquid pulses with concentrated energy, awakening the warrior within.",
    
    // Economy
    buyPrice: 100,
    sellPrice: 50,
    
    // Implementation
    use: (user, battleSystem) => {
      const currentATK = battleSystem.getATK(user);
      user.querySelector(".atk").textContent = currentATK + 5;
      
      return {
        success: true,
        message: `${user.dataset.name} drinks an energy elixir and feels empowered!`,
        buffAmount: 5,
        duration: 3
      };
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EQUIPMENT ITEMS - Permanent character upgrades
// Weapons, armor, accessories for customization
// ═══════════════════════════════════════════════════════════════════════════════

export const EQUIPMENT_ITEMS = {
  ironSword: {
    name: "Iron Sword",
    type: "equipment",
    category: "weapon",
    slot: "mainHand",
    rarity: "common",
    
    // Equipment Properties
    level: 1,
    durability: 100,
    maxDurability: 100,
    
    // Visual Assets
    icon: "../images/items/iron-sword.png",
    color: "#C0C0C0",
    
    // Stat Modifications
    stats: {
      atk: 3,
      speed: 1
    },
    
    // Special Properties
    effects: [],
    
    // Lore and Description
    description: "A reliable blade forged from quality iron",
    flavorText: "Though simple in design, this sword has served many warriors faithfully in battle.",
    
    // Economy
    buyPrice: 200,
    sellPrice: 100,
    
    // Requirements
    requirements: {
      level: 1,
      type: ["Striker", "Support"]
    }
  },

  leatherArmor: {
    name: "Leather Armor",
    type: "equipment",
    category: "armor",
    slot: "chest",
    rarity: "common",
    
    // Equipment Properties
    level: 1,
    durability: 80,
    maxDurability: 80,
    
    // Visual Assets
    icon: "../images/items/leather-armor.png",
    color: "#8B4513",
    
    // Stat Modifications
    stats: {
      defense: 2,
      hp: 5
    },
    
    // Special Properties
    effects: [],
    
    // Lore and Description
    description: "Sturdy leather protection for beginning adventurers",
    flavorText: "Crafted from the hide of forest beasts, this armor provides basic but reliable protection.",
    
    // Economy
    buyPrice: 150,
    sellPrice: 75,
    
    // Requirements
    requirements: {
      level: 1,
      type: ["any"]
    }
  },

  mysticAmulet: {
    name: "Mystic Amulet",
    type: "equipment",
    category: "accessory",
    slot: "neck",
    rarity: "rare",
    
    // Equipment Properties
    level: 2,
    durability: 200,
    maxDurability: 200,
    
    // Visual Assets
    icon: "../images/items/mystic-amulet.png",
    color: "#9370DB",
    
    // Stat Modifications
    stats: {
      hp: 10,
      specialPower: 1.2
    },
    
    // Special Properties
    effects: [
      {
        name: "Mystic Resonance",
        description: "Special moves have 20% increased effectiveness",
        trigger: "special_move"
      }
    ],
    
    // Lore and Description
    description: "An ancient amulet that amplifies magical energies",
    flavorText: "This mysterious pendant hums with otherworldly power, enhancing the wearer's supernatural abilities.",
    
    // Economy
    buyPrice: 500,
    sellPrice: 250,
    
    // Requirements
    requirements: {
      level: 2,
      type: ["Healer", "Caster"]
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// COLLECTIBLE ITEMS - Rare finds and quest rewards
// Story items, rare materials, trophies
// ═══════════════════════════════════════════════════════════════════════════════

export const COLLECTIBLE_ITEMS = {
  ancientCoin: {
    name: "Ancient Coin",
    type: "collectible",
    category: "currency",
    rarity: "uncommon",
    
    // Item Properties
    stackable: true,
    maxStack: 999,
    
    // Visual Assets
    icon: "../images/items/ancient-coin.png",
    color: "#DAA520",
    
    // Lore and Description
    description: "A coin from a long-lost civilization",
    flavorText: "These coins bear the mark of an empire that fell to darkness centuries ago. They still hold mysterious power.",
    
    // Economy
    value: 10,
    
    // Special Properties
    uses: [
      "Shop currency",
      "Upgrade materials",
      "Quest requirements"
    ]
  },

  crystalShard: {
    name: "Crystal Shard",
    type: "collectible",
    category: "material",
    rarity: "rare",
    
    // Item Properties
    stackable: true,
    maxStack: 50,
    
    // Visual Assets
    icon: "../images/items/crystal-shard.png",
    color: "#00FFFF",
    
    // Lore and Description
    description: "A fragment of pure magical energy",
    flavorText: "These crystalline fragments pulse with raw magic, sought after by enchanters and alchemists alike.",
    
    // Economy
    buyPrice: 200,
    sellPrice: 100,
    
    // Special Properties
    uses: [
      "Equipment enhancement",
      "Special move upgrades",
      "Rare crafting recipes"
    ]
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM UTILITIES
// Helper functions for item management and usage
// ═══════════════════════════════════════════════════════════════════════════════

export const ItemUtils = {
  // Get item by key from any category
  getItem(key) {
    return CONSUMABLE_ITEMS[key] || 
           EQUIPMENT_ITEMS[key] || 
           COLLECTIBLE_ITEMS[key] || 
           null;
  },
  
  // Get items by category
  getItemsByCategory(category) {
    const allItems = { ...CONSUMABLE_ITEMS, ...EQUIPMENT_ITEMS, ...COLLECTIBLE_ITEMS };
    return Object.keys(allItems)
      .filter(key => allItems[key].category === category)
      .map(key => ({ key, ...allItems[key] }));
  },
  
  // Get items by type
  getItemsByType(type) {
    const allItems = { ...CONSUMABLE_ITEMS, ...EQUIPMENT_ITEMS, ...COLLECTIBLE_ITEMS };
    return Object.keys(allItems)
      .filter(key => allItems[key].type === type)
      .map(key => ({ key, ...allItems[key] }));
  },
  
  // Get items by rarity
  getItemsByRarity(rarity) {
    const allItems = { ...CONSUMABLE_ITEMS, ...EQUIPMENT_ITEMS, ...COLLECTIBLE_ITEMS };
    return Object.keys(allItems)
      .filter(key => allItems[key].rarity === rarity)
      .map(key => ({ key, ...allItems[key] }));
  },
  
  // Use a consumable item
  useItem(itemKey, user, battleSystem) {
    const item = CONSUMABLE_ITEMS[itemKey];
    if (!item) return { success: false, error: "Item not found" };
    if (item.type !== "consumable") return { success: false, error: "Item not consumable" };
    
    return item.use(user, battleSystem);
  },
  
  // Equip an item
  equipItem(itemKey, character) {
    const item = EQUIPMENT_ITEMS[itemKey];
    if (!item) return { success: false, error: "Equipment not found" };
    if (item.type !== "equipment") return { success: false, error: "Item not equipment" };
    
    // Check requirements
    if (item.requirements) {
      if (item.requirements.level && character.level < item.requirements.level) {
        return { success: false, error: "Level requirement not met" };
      }
      
      if (item.requirements.type && 
          item.requirements.type !== "any" && 
          !item.requirements.type.includes(character.type)) {
        return { success: false, error: "Class requirement not met" };
      }
    }
    
    // Apply stat modifications
    if (item.stats) {
      Object.keys(item.stats).forEach(stat => {
        character[stat] = (character[stat] || 0) + item.stats[stat];
      });
    }
    
    return {
      success: true,
      message: `${character.name} equips ${item.name}!`,
      item: item
    };
  },
  
  // Calculate item value
  calculateValue(itemKey, quantity = 1) {
    const item = this.getItem(itemKey);
    if (!item) return 0;
    
    const baseValue = item.buyPrice || item.value || 0;
    return baseValue * quantity;
  },
  
  // Generate random loot
  generateLoot(level = 1, rarity = "common", count = 1) {
    const rarityItems = this.getItemsByRarity(rarity);
    const levelAppropriate = rarityItems.filter(item => 
      !item.level || item.level <= level
    );
    
    if (levelAppropriate.length === 0) return [];
    
    const loot = [];
    for (let i = 0; i < count; i++) {
      const randomItem = levelAppropriate[Math.floor(Math.random() * levelAppropriate.length)];
      loot.push({
        ...randomItem,
        quantity: randomItem.stackable ? Math.floor(Math.random() * 3) + 1 : 1
      });
    }
    
    return loot;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT FOR MODULE SYSTEM
// Make available for import in other files
// ═══════════════════════════════════════════════════════════════════════════════

// For ES6 modules
export default {
  CONSUMABLE_ITEMS,
  EQUIPMENT_ITEMS,
  COLLECTIBLE_ITEMS,
  ItemUtils
};

// For older browsers/Node.js compatibility
if (typeof window !== 'undefined') {
  window.ItemsData = {
    CONSUMABLE_ITEMS,
    EQUIPMENT_ITEMS,
    COLLECTIBLE_ITEMS,
    ItemUtils
  };
}