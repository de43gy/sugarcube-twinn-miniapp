// Game data loader and manager
window.GameData = {
    locations: {},
    items: {},
    characters: {},
    quests: {},
    
    async loadData() {
        try {
            // Load locations
            const locationsResponse = await fetch('./src/data/locations/locations.json');
            this.locations = await locationsResponse.json();
            console.log('Locations loaded:', Object.keys(this.locations)); // Should log ['entrance', 'dining_room', 'library']
            
            // Load items  
            const itemsResponse = await fetch('./src/data/items/items.json');
            this.items = await itemsResponse.json();
            console.log('Items loaded:', Object.keys(this.items));
            
            console.log('Game data loaded successfully');
            return true;
        } catch (error) {
            console.error('Failed to load game data:', error);
            return false;
        }
    },
    
    getLocation(id) {
        return this.locations[id];
    },
    
    getItem(id) {
        return this.items[id];
    },
    
    // Helper method to validate conditions
    validateConditions(conditions, gameState) {
        return conditions.every(condition => {
            switch (condition.type) {
                case 'has_item':
                    return gameState.player.inventory.some(item => item.id === condition.item);
                case 'not_has_item':
                    return !gameState.player.inventory.some(item => item.id === condition.item);
                case 'visited_location':
                    return gameState.visitedLocations.includes(condition.location);
                case 'has_knowledge':
                    return gameState.discoveredSecrets.includes(condition.knowledge);
                default:
                    return true;
            }
        });
    }
};