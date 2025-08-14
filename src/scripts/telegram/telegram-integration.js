// Telegram Web App integration
window.TelegramIntegration = {
    tg: null,
    isReady: false,
    
    init() {
        try {
            if (window.Telegram && window.Telegram.WebApp) {
                this.tg = window.Telegram.WebApp;
                this.tg.ready();
                this.tg.expand();
                this.isReady = true;
                
                console.log('Telegram Web App SDK is ready!');
                console.log('Telegram WebApp data:', this.tg.initDataUnsafe);
                
                // Set up event listeners
                this.setupEventListeners();
                
                return true;
            } else {
                console.error('Telegram Web App SDK not found! Running in fallback mode.');
                console.log('Available window properties:', Object.keys(window));
                return false;
            }
        } catch (error) {
            console.error('Error initializing Telegram SDK:', error);
            return false;
        }
    },
    
    setupEventListeners() {
        if (!this.tg) return;
        
        // Handle main button if needed
        this.tg.onEvent('mainButtonClicked', () => {
            console.log('Main button clicked');
        });
        
        // Handle back button
        this.tg.onEvent('backButtonClicked', () => {
            console.log('Back button clicked');
            // You can implement navigation logic here
        });
    },
    
    showMainButton(text, callback) {
        if (!this.tg) return;
        
        this.tg.MainButton.setText(text);
        this.tg.MainButton.show();
        
        if (callback) {
            this.tg.onEvent('mainButtonClicked', callback);
        }
    },
    
    hideMainButton() {
        if (!this.tg) return;
        this.tg.MainButton.hide();
    },
    
    sendData(data) {
        if (!this.tg) return;
        this.tg.sendData(JSON.stringify(data));
    },
    
    getUserData() {
        if (!this.tg) return null;
        return this.tg.initDataUnsafe?.user || null;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.TelegramIntegration.init();
});