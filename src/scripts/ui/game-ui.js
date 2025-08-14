// Game UI initialization for SugarCube integration
window.GameUI = {
    initialized: false,
    
    init() {
        if (this.initialized) return;
        
        // Wait for SugarCube to be ready
        $(document).on(':storyready', () => {
            this.setupCustomUI();
            this.setupInventoryUpdater();
            this.setupLocationUpdater();
        });
        
        this.initialized = true;
    },
    
    setupCustomUI() {
        // Add game title if it doesn't exist
        if (!document.querySelector('.game-title')) {
            const title = document.createElement('h1');
            title.className = 'game-title';
            title.textContent = 'Таинственное поместье';
            document.body.insertBefore(title, document.body.firstChild);
        }
        
        // Create custom UI panel
        const uiPanel = document.createElement('div');
        uiPanel.id = 'game-ui';
        uiPanel.innerHTML = `
            <h2>Инвентарь</h2>
            <div id="inventory-list">
                <!-- Inventory items will be populated by JavaScript -->
            </div>
            <h2 style="margin-top: 1rem;">Локация</h2>
            <div id="location-display">
                <!-- Current location will be populated by JavaScript -->
            </div>
        `;
        
        // Insert after the story content
        const story = document.getElementById('story');
        if (story) {
            story.parentNode.insertBefore(uiPanel, story.nextSibling);
        } else {
            document.body.appendChild(uiPanel);
        }
    },
    
    setupInventoryUpdater() {
        // Update inventory display when it changes
        $(document).on(':passageend', () => {
            this.updateInventoryDisplay();
        });
    },
    
    setupLocationUpdater() {
        // Update location display when it changes
        $(document).on(':passageend', () => {
            this.updateLocationDisplay();
        });
    },
    
    updateInventoryDisplay() {
        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList || !State.variables.player) return;
        
        const inventory = State.variables.player.inventory || [];
        if (inventory.length === 0) {
            inventoryList.innerHTML = '<p>Пусто</p>';
        } else {
            inventoryList.innerHTML = inventory.map(item => 
                `<div class="inventory-item">${item.name || item.id} ${item.quantity > 1 ? `(${item.quantity})` : ''}</div>`
            ).join('');
        }
    },
    
    updateLocationDisplay() {
        const locationDisplay = document.getElementById('location-display');
        if (!locationDisplay || !State.variables.gameData || !State.variables.currentLocation) return;
        
        const location = State.variables.gameData.locations[State.variables.currentLocation];
        if (location) {
            locationDisplay.innerHTML = `<p>${location.displayName || location.name}</p>`;
        }
    }
};

// Initialize when the script loads
window.GameUI.init();