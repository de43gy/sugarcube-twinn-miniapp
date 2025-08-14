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
    // Make game data available to SugarCube
    State.variables.gameData = window.GameData;
    
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