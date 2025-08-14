const fs = require('fs').promises;
const path = require('path');

async function build() {
    console.log('Starting simple build process...');
    
    try {
        // Ensure build directory exists
        await fs.mkdir('build', { recursive: true });
        
        // Create a working version by combining everything into a single HTML
        const html = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Призрак в поместье</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        
        :root {
            --bg-primary: #1a202c;
            --bg-secondary: #2d3748;
            --bg-tertiary: #4a5568;
            --text-primary: #e2e8f0;
            --text-secondary: #a0aec0;
            --text-accent: #63b3ed;
            --text-accent-hover: #90cdf4;
            --text-success: #68d391;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg-primary);
            color: var(--text-primary);
        }

        #story-display {
            min-height: 100vh;
        }

        #sidebar {
            display: none; /* SugarCube sidebar */
        }

        .passage {
            animation: fadeIn 1s ease-in-out;
            margin-bottom: 1.5rem;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .passage a {
            color: var(--text-accent);
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s ease;
        }

        .passage a:hover {
            color: var(--text-accent-hover);
            text-decoration: underline;
        }

        .button {
            display: inline-block;
            background-color: var(--bg-secondary);
            color: var(--text-primary);
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .button:hover {
            background-color: var(--bg-tertiary);
        }

        #game-ui {
            margin-top: 2rem;
            padding: 1rem;
            background-color: #1a1f29;
            border-radius: 0.5rem;
            box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
        }

        #game-ui h2 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }

        #inventory-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }

        #inventory-list .item {
            background-color: var(--bg-secondary);
            color: var(--text-primary);
            padding: 0.25rem 0.5rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
        }

        #location-display {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
    </style>
</head>
<body class="p-4 sm:p-8 md:p-12">
    <div id="story-display" class="max-w-3xl mx-auto bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl flex flex-col justify-center">
        <h1 class="text-4xl font-bold mb-6 text-center text-gray-100">Таинственное поместье</h1>
        
        <div id="passages" class="space-y-6">
            <!-- SugarCube story -->
        </div>

        <div id="game-ui">
            <h2>Инвентарь</h2>
            <div id="inventory-list">
                <!-- items -->
            </div>
            <h2 style="margin-top: 1rem;">Локация</h2>
            <div id="location-display">
                <!-- location -->
            </div>
        </div>
    </div>

    <!-- Telegram Web App SDK -->
    <script src="https://telegram.org/js/telegram-web-app.js"></script>

    <!-- SugarCube 2 -->
    <script src="https://unpkg.com/sugarcube-2@2.36.1/dist/sugarcube-2.min.js"></script>

    <!-- Game Data -->
    <script>
        window.GameData = {
            locations: {
                "entrance": {
                    "id": "entrance",
                    "name": "Вход в поместье",
                    "displayName": "Вход в поместье",
                    "description": "Ты стоишь перед воротами старого поместья, окутанного туманом. Давно ходили слухи, что здесь обитает призрак. Твоя цель — найти ключ и разгадать тайну, чтобы освободить его.",
                    "discovered": true
                },
                "library": {
                    "id": "library", 
                    "name": "Библиотека",
                    "displayName": "Библиотека",
                    "description": "Ты находишься в старой, пыльной библиотеке. Полки завалены книгами, а в центре комнаты стоит большой стол.",
                    "discovered": false
                },
                "dining_room": {
                    "id": "dining_room",
                    "name": "Столовая", 
                    "displayName": "Столовая",
                    "description": "Ты входишь в столовую. На длинном столе — запылённая посуда и потускневшие столовые приборы.",
                    "discovered": false
                }
            },
            items: {
                "old_key": {
                    "id": "old_key",
                    "name": "Старый ключ",
                    "displayName": "Старый ключ"
                },
                "ghost_journal": {
                    "id": "ghost_journal", 
                    "name": "Дневник призрака",
                    "displayName": "Дневник призрака"
                }
            }
        };
    </script>

    <!-- Twine Story Data -->
    <script type="text/twine-story">
        <tw-storydata name="Таинственное поместье" startnode="Начало" creator="Twine" creator-version="2.3.16" ifid="12345678-ABCD-EFGH-IJKL-9876543210AB" format="SugarCube" format-version="2.36.1" options="" tags="">
            
            <tw-passagedata pid="1" name="Начало" tags="nobr" position="50,100">
                <<set $player to { name: "Игрок", inventory: [] }>>
                <<set $currentLocation to "Вход в поместье">>
                <<set $hasKey to false>>
                <<set $hasJournal to false>>
                <p class="text-lg">Ты стоишь перед воротами старого поместья, окутанного туманом. Давно ходили слухи, что здесь обитает призрак. Твоя цель — найти ключ и разгадать тайну, чтобы освободить его.</p>
                <p class="mt-4">Ты заходишь в поместье. Вокруг темно и тихо.</p>
                <p class="mt-4">[[Идти в библиотеку->Библиотека]]</p>
                <p class="mt-2">[[Идти в столовую->Столовая]]</p>
            </tw-passagedata>
            
            <tw-passagedata pid="2" name="Библиотека" tags="nobr" position="250,100">
                <<set $currentLocation to "Библиотека">>
                <p class="text-lg">Ты находишься в старой, пыльной библиотеке. Полки завалены книгами, а в центре комнаты стоит большой стол.</p>
                
                <<if $hasKey>>
                    <p class="mt-4 text-green-400">У тебя уже есть ключ. Возможно, стоит поискать что-то ещё?</p>
                <<else>>
                    <p class="mt-4">Ты замечаешь, что одна из книг лежит не на своём месте.</p>
                    <p class="mt-2">[[Взять книгу->Найти ключ]]</p>
                <<endif>>
                
                <p class="mt-4">[[Вернуться в холл->Начало]]</p>
            </tw-passagedata>

            <tw-passagedata pid="3" name="Столовая" tags="nobr" position="450,100">
                <<set $currentLocation to "Столовая">>
                <p class="text-lg">Ты входишь в столовую. На длинном столе — запылённая посуда и потускневшие столовые приборы.</p>
                
                <<if $hasJournal>>
                    <p class="mt-4 text-green-400">Ты уже нашел дневник.</p>
                <<else>>
                    <p class="mt-4">Под скатертью ты нащупал что-то твердое. Похоже, это старый дневник!</p>
                    <p class="mt-2">[[Взять дневник->Найти дневник]]</p>
                <<endif>>
                
                <p class="mt-4">[[Вернуться в холл->Начало]]</p>
            </tw-passagedata>

            <tw-passagedata pid="4" name="Найти ключ" tags="nobr" position="250,200">
                <<set $hasKey to true>>
                <<set $player.inventory.push("Старый ключ")>>
                <p class="text-lg">Ты открываешь книгу, и из неё выпадает старый, потемневший ключ. Теперь он в твоём инвентаре!</p>
                <p class="mt-4">[[Вернуться в библиотеку->Библиотека]]</p>
            </tw-passagedata>

            <tw-passagedata pid="5" name="Найти дневник" tags="nobr" position="450,200">
                <<set $hasJournal to true>>
                <<set $player.inventory.push("Дневник призрака")>>
                <p class="text-lg">Ты находишь дневник, который, кажется, принадлежал призраку. Теперь ты можешь узнать его историю.</p>
                <p class="mt-4">[[Вернуться в столовую->Столовая]]</p>
            </tw-passagedata>

            <tw-passagedata pid="6" name="Script" tags="script" position="650,100">
                <<script>>
                    State.hooks.onNavigate.add(function (passage) {
                        if (passage.tags.includes('nobr')) {
                            const inventoryList = document.getElementById('inventory-list');
                            inventoryList.innerHTML = '';
                            if ($player.inventory.length === 0) {
                                inventoryList.innerHTML = '<span class="italic text-gray-500">Пусто</span>';
                            } else {
                                $player.inventory.forEach(item => {
                                    const itemSpan = document.createElement('span');
                                    itemSpan.className = 'item';
                                    itemSpan.textContent = item;
                                    inventoryList.appendChild(itemSpan);
                                });
                            }

                            const locationDisplay = document.getElementById('location-display');
                            locationDisplay.textContent = $currentLocation;
                        }
                    });
                <</script>>
            </tw-passagedata>

        </tw-storydata>
    </script>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.Telegram) {
                const tg = window.Telegram.WebApp;
                tg.ready();
                tg.expand();
                console.log('Telegram Web App SDK is ready!');
            } else {
                console.error('Telegram Web App SDK not found!');
            }
        });
    </script>
</body>
</html>`;

        await fs.writeFile('build/index.html', html);
        console.log('Simple build completed successfully!');
        console.log('Output: build/index.html');
        
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

build();