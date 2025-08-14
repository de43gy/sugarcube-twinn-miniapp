// Inventory management system
window.InventorySystem = {
    addItem(itemId, quantity = 1) {
        const item = window.GameData.getItem(itemId);
        if (!item) {
            console.error(`Item ${itemId} not found`);
            return false;
        }
        
        const existingItem = State.variables.player.inventory.find(invItem => invItem.id === itemId);
        
        if (existingItem && item.stackable) {
            existingItem.quantity += quantity;
        } else {
            State.variables.player.inventory.push({
                id: itemId,
                quantity: quantity,
                ...item
            });
        }
        
        this.updateInventoryDisplay();
        return true;
    },
    
    removeItem(itemId, quantity = 1) {
        const itemIndex = State.variables.player.inventory.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return false;
        
        const item = State.variables.player.inventory[itemIndex];
        
        if (item.quantity > quantity) {
            item.quantity -= quantity;
        } else {
            State.variables.player.inventory.splice(itemIndex, 1);
        }
        
        this.updateInventoryDisplay();
        return true;
    },
    
    hasItem(itemId, quantity = 1) {
        const item = State.variables.player.inventory.find(item => item.id === itemId);
        return item && item.quantity >= quantity;
    },
    
    updateInventoryDisplay() {
        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList) return;
        
        inventoryList.innerHTML = '';
        
        if (State.variables.player.inventory.length === 0) {
            inventoryList.innerHTML = '<span class="italic text-gray-500">Пусто</span>';
        } else {
            State.variables.player.inventory.forEach(item => {
                const itemSpan = document.createElement('span');
                itemSpan.className = 'item';
                itemSpan.textContent = item.displayName;
                if (item.quantity > 1) {
                    itemSpan.textContent += ` (${item.quantity})`;
                }
                inventoryList.appendChild(itemSpan);
            });
        }
    }
};