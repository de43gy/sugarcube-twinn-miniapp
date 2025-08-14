# sugarcube-twinn-miniapp

A prototype for a Telegram Mini App game. This project is a testing ground for integrating the Twin and Sugar Cube 2 concepts for Telegram Mini App.

## New Modular Architecture

The project has been restructured into a scalable, modular architecture suitable for complex game development:

### Project Structure
```
src/
├── data/               # Game data (JSON files)
│   ├── characters/     # NPC definitions and dialogues
│   ├── locations/      # Location descriptions and connections
│   ├── items/          # Item definitions and stats
│   ├── quests/         # Quest chains and objectives
│   └── economy/        # Economic system data
├── passages/           # Twine story passages
│   ├── core/           # Core game passages
│   ├── locations/      # Location-specific passages
│   ├── characters/     # Character interactions
│   └── systems/        # Game mechanics passages
├── scripts/            # JavaScript modules
│   ├── core/           # Core game systems
│   ├── systems/        # Game mechanics (inventory, etc.)
│   └── telegram/       # Telegram integration
└── styles/             # Modular CSS
    ├── themes/         # Visual themes
    └── components/     # UI component styles
```

## Development Commands

```bash
# Build the project
npm run build

# Build and run local development server
npm run dev

# Clean build directory
npm run clean
```

## Features

- **Data-Driven Design**: Game content stored in JSON files for easy editing
- **Modular Systems**: Separate modules for inventory, locations, quests, etc.
- **Scalable Architecture**: Designed to handle complex games with many entities
- **Build System**: Automatically combines modular files into single HTML
- **Telegram Integration**: Full Telegram Web App SDK support

## Adding New Content

### New Locations
1. Add location data to `src/data/locations/locations.json`
2. Create passage file in `src/passages/locations/`

### New Items  
1. Add item data to `src/data/items/items.json`
2. Items automatically work with inventory system

### New Characters
1. Add character data to `src/data/characters/`
2. Create dialogue passages in `src/passages/characters/`

The build system will automatically include all new content in the final game.