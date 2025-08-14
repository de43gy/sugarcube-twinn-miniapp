// Location management system
window.LocationSystem = {
    currentLocation: 'entrance',
    
    moveToLocation(locationId) {
        const location = window.GameData.getLocation(locationId);
        if (!location) {
            console.error(`Location ${locationId} not found`);
            return false;
        }
        
        this.currentLocation = locationId;
        State.variables.currentLocation = locationId;
        
        // Add to visited locations if not already there
        if (!State.variables.gameState.visitedLocations.includes(locationId)) {
            State.variables.gameState.visitedLocations.push(locationId);
        }
        
        // Mark location as discovered
        location.discovered = true;
        
        this.updateLocationDisplay();
        return true;
    },
    
    getCurrentLocation() {
        return window.GameData.getLocation(this.currentLocation);
    },
    
    getAvailableConnections() {
        const location = this.getCurrentLocation();
        if (!location) return [];
        
        return location.connections.filter(connection => {
            return window.GameData.validateConditions(connection.conditions || [], State.variables.gameState);
        });
    },
    
    updateLocationDisplay() {
        const locationDisplay = document.getElementById('location-display');
        if (!locationDisplay) return;
        
        const location = this.getCurrentLocation();
        locationDisplay.textContent = location ? location.displayName : 'Неизвестная локация';
    }
};