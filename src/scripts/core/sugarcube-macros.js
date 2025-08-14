// Custom SugarCube macros for the game
Macro.add('addToInventory', {
    handler: function() {
        const itemId = this.args[0];
        const quantity = this.args[1] || 1;
        
        if (window.InventorySystem) {
            window.InventorySystem.addItem(itemId, quantity);
        }
    }
});

Macro.add('removeFromInventory', {
    handler: function() {
        const itemId = this.args[0];
        const quantity = this.args[1] || 1;
        
        if (window.InventorySystem) {
            window.InventorySystem.removeItem(itemId, quantity);
        }
    }
});

Macro.add('hasItem', {
    handler: function() {
        const itemId = this.args[0];
        const quantity = this.args[1] || 1;
        
        if (window.InventorySystem) {
            return window.InventorySystem.hasItem(itemId, quantity);
        }
        return false;
    }
});

// Initialize game data when SugarCube is ready
$(document).on(':storyready', function() {
    console.log('SugarCube story ready, setting up game data...');
    
    // Make game data available to SugarCube with the actual loaded data
    if (window.GameData) {
        State.variables.gameData = {
            locations: window.GameData.locations,
            items: window.GameData.items,
            characters: window.GameData.characters || {},
            quests: window.GameData.quests || {},
            validateConditions: window.GameData.validateConditions.bind(window.GameData)
        };
        console.log('Game data set in SugarCube:', State.variables.gameData);
    } else {
        console.error('GameData not available!');
    }
    
    // Initialize systems
    if (window.InventorySystem) {
        window.InventorySystem.updateInventoryDisplay();
    }
    
    if (window.LocationSystem) {
        window.LocationSystem.updateLocationDisplay();
    }
});

// Update UI on passage navigation  
$(document).on(':passageend', function() {
    // Update displays after each passage
    setTimeout(() => {
        if (window.InventorySystem) {
            window.InventorySystem.updateInventoryDisplay();
        }
        
        if (window.LocationSystem) {
            window.LocationSystem.updateLocationDisplay();
        }
    }, 100);
});