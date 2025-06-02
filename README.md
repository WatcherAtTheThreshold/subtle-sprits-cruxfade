# 🌫️ Subtle Spirits: Cruxfade

_A progressive card battler that grows from simple duels to epic team battles._

**Play it live:** https://watcheratthethreshold.github.io/subtle-sprits-cruxfade/

Subtle Spirits: Cruxfade is a web-based turn-based card battle game with a unique progression system. Start with simple 1v1 duels, gradually building your team through pets and companions, until you're commanding epic 4v4 battles against powerful bosses.

---

## 🎮 Game Concept

### **Progressive Complexity Campaign**
- **Level 1**: Learn the basics with 1v1 battles → earn items
- **Level 2**: Add a pet companion for 2v2 tactical combat  
- **Level 3**: Recruit a full companion for 3v3 strategic depth
- **Level 4**: Master 4v4 team battles and face the final boss

### **Roguelike Elements**
- Item rewards between battles enhance your characters
- Randomized enemy encounters keep each run fresh
- Character choices affect your entire campaign

---

## ✨ Current Features

✅ **Character Selection**: Choose from 3 unique heroes (Magdaline, Fizzwick, Timothy)  
✅ **1v1 Battle System**: Complete turn-based combat with special moves  
✅ **4v4 Battle System**: Full team combat mechanics  
✅ **Special Abilities**: One-time powerful moves per character  
✅ **Status Effects**: Burning, stunning, healing over time  
✅ **Mobile Responsive**: Touch-friendly design for all devices  
✅ **Floating Combat Text**: Dynamic damage/heal feedback  
✅ **Atmospheric Design**: Misty backgrounds and polished UI  

---

## 🚧 In Development

📋 **2v2 & 3v3 Battle Systems**: Bridge between solo and team combat  
📋 **Item/Reward System**: Equipment and stat boosts between battles  
📋 **Campaign Progression**: Level-to-level flow with persistent upgrades  
📋 **Pet & Companion Selection**: Choose your team members  
📋 **Boss Battles**: Unique encounters with special mechanics  

---

## 📁 Project Structure

```plaintext
subtle-spirits-cruxfade/
├── 🎮 Core Pages
│   ├── index.html                    # Start screen
│   ├── character-select.html         # Character selection
│   └── battles/
│       ├── battle1v1-1.html         # Level 1 battles  
│       ├── battle4v4.html           # Level 4 battles
│       └── battle1.html             # [Legacy - to remove]
│
├── 🎨 Styles  
│   ├── styles.css                   # Global layout & typography
│   ├── character-select-styles.css  # Character selection UI
│   ├── battle-shared.css            # Core card & battle styling
│   ├── battle-1v1.css              # 1v1 specific enhancements
│   └── battle-styles.css            # [Legacy - to consolidate]
│
├── ⚙️ Scripts
│   ├── character-select.js          # Character selection logic
│   ├── battle-shared.js             # Shared battle utilities  
│   ├── battle-1v1.js               # 1v1 battle system
│   ├── battle-core.js               # 4v4 battle system
│   ├── battle-ui.js                 # UI components for battles
│   └── game.js                      # [Legacy - to remove]
│
├── 📊 Data
│   ├── characters.js                # Player character definitions
│   ├── enemies.js                   # Enemy types by level
│   ├── specials.js                  # Special moves & effects
│   ├── items.js                     # Equipment & consumables  
│   └── data-loader.js               # Data management system
│
├── 🎨 Assets
│   ├── images/
│   │   ├── [Character portraits]    # Main character art
│   │   ├── [Enemy sprites]          # Opponent designs
│   │   └── mist-overlay.webp        # Background atmosphere
│   └── music/
│       └── ChosenOne.mp3            # Title screen audio
│
└── 📚 Documentation
    └── README.md                    # This file
```

---

## 🎯 Development Roadmap

### **Phase 1: Code Cleanup** _(Next Priority)_
- [ ] Consolidate redundant battle systems  
- [ ] Remove legacy files (`game.js`, `battle1.html`, etc.)
- [ ] Standardize CSS organization
- [ ] Finalize data structure

### **Phase 2: Core Progression Loop**  
- [ ] Perfect Level 1 flow (1v1 → items → boss)
- [ ] Implement item rewards system
- [ ] Build 2v2 battle system  
- [ ] Add pet selection mechanics

### **Phase 3: Full Campaign**
- [ ] Create 3v3 battle system
- [ ] Design companion selection
- [ ] Build level progression flow
- [ ] Add boss encounters with unique mechanics

### **Phase 4: Polish & Content**  
- [ ] Balance gameplay and difficulty curve  
- [ ] Add more characters, enemies, and items
- [ ] Implement save/progress system
- [ ] Audio and visual polish

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Grid & Flexbox
- **Architecture**: Modular JavaScript with data separation
- **Deployment**: GitHub Pages
- **Assets**: Original pixel art and web-optimized graphics

---

## 🎮 How to Play

1. **Visit** the live game link above
2. **Choose** your character (Magdaline, Fizzwick, or Timothy)  
3. **Battle** through increasingly complex encounters
4. **Collect** items and build your team
5. **Master** the progression from 1v1 to epic 4v4 battles

---

## 🧙‍♂️ Credits

**Created by Jessop Hunt**  
_Built with passion, strategic thinking, and lots of iterative design._

Original character designs, code architecture, and game concept.  
Special thanks to the web development community for inspiration and resources.

---

## 📜 License

This project is currently in development and not licensed for redistribution.  
Feel free to explore the code for learning purposes.  
Please reach out before using assets or concepts commercially.

---

## 🌟 What Makes This Special

**Progressive Tutorial Design**: Instead of overwhelming players with complexity, the game naturally teaches mechanics by adding one layer at a time.

**Meaningful Progression**: Each level isn't just "more HP" - it fundamentally changes how you play, from solo tactics to team strategy.

**Roguelike Replayability**: Different character choices and item combinations create unique runs through the same progression framework.

This isn't just another card game - it's a **card battle adventure** with a carefully crafted learning curve that transforms novices into tactical masters.

---

_May your spirits be subtle, and your victories decisive._ ⚔️
