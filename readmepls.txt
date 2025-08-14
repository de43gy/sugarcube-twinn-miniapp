The issue you're describing—where the Telegram Mini App displays raw text with unprocessed SugarCube markup (e.g., [[link->target]] appearing as plain text instead of clickable hyperlinks, and all content dumped at the bottom without an interactive interface)—is a common symptom of SugarCube not initializing or rendering the story properly. Based on analyzing the provided code files, the deployed page content, and how Twine/SugarCube works, here are the key problems and step-by-step fixes.
Key Problems Identified

Missing SugarCube Engine Script: Your project uses SugarCube syntax (e.g., <<widget>>, <<set>>, <<display>>, <<if>>, and link markup like [[text->target]]), but the core SugarCube library (which parses and renders this into an interactive UI) is not included in the HTML. Without it, the browser treats the story data as plain text. Your custom scripts (e.g., sugarcube-macros.js) assume SugarCube is loaded (they call Macro.add), but it isn't.
Incorrect Story Data Placement in HTML: In build.js, the story passages are wrapped inside <script type="text/twine-story"><tw-storydata>...</tw-storydata></script>. This is non-standard—SugarCube expects <tw-storydata hidden>...</tw-storydata> as a direct child of <body>, not inside a <script> tag. This prevents SugarCube from detecting and processing the story.
Build Process Issues:

The build combines passages correctly but injects them in the wrong format.
No <script> for SugarCube is added, and custom JS (e.g., game-data.js, inventory.js) may not execute if dependencies fail.
The start passage ("Начало" or "StoryInit") isn't rendering, leading to raw markup dump.


Telegram Mini App Specifics: Telegram Web Apps run in an iframe-like environment with restrictions on JS execution and styling. If JS fails (e.g., due to missing libraries or errors), content falls back to plain text. Clickable links require SugarCube's rendering. Your telegram-integration.js initializes the Telegram SDK correctly, but the game logic doesn't run without SugarCube.
Other Minor Issues:

No error handling in JS for missing GameData or failed loads.
Custom UI elements (e.g., #game-ui, #inventory-list) in game-ui.js won't appear if SugarCube doesn't render the passage.
The page title in the deployed site is "Призрак в поместье", but your code uses "Таинственное поместье"—this might indicate a mismatched build or cached old version.



Step-by-Step Fixes
To resolve this, update your source files, rebuild, and redeploy. Test locally first (open build/index.html in a browser) before pushing to the server.
1. Add the SugarCube Library

Download SugarCube 2.36.1 (matches your format-version in build.js) from https://www.motoslave.net/sugarcube/2/ (get sugarcube-2.min.js).
Place it in src/scripts/sugarcube-2.min.js.
In src/index.html, add this just before the closing </body> tag (after your other scripts):
text<script src="scripts/sugarcube-2.min.js"></script>

Alternatively, use a CDN for testing: <script src="https://cdnjs.cloudflare.com/ajax/libs/sugarcube/2.36.1/sugarcube.min.js"></script>. But for production, host it locally to avoid network issues in Telegram.



2. Fix Story Data Injection in build.js

Open src/build.js and modify the buildStoryData() method. Remove the <script type="text/twine-story"> wrapper and add the hidden attribute to <tw-storydata>. Update the return statement like this:
textreturn `
<tw-storydata name="Таинственное поместье" startnode="1" creator="Twine" creator-version="2.3.16" ifid="12345678-ABCD-EFGH-IJKL-9876543210AB" format="SugarCube" format-version="2.36.1" options="" tags="" zoom="1" hidden>
${xmlPassages}
</tw-storydata>
<script role="script" id="twine-user-script" type="text/twine-javascript"></script>
`;

Notes:

startnode="1": Set this to the pid of your starting passage (e.g., "StoryInit" or "Начало"). In your code, passages start at pid=1, so adjust if "Начало" isn't first.
The empty <script id="twine-user-script"> is optional but standard for user macros (your sugarcube-macros.js handles this separately).
In convertToTwineFormat(), ensure pid starts at 1 and increments correctly. Set startnode to the pid of :: Начало or :: StoryInit (whichever is the entry point).





3. Update src/index.html Structure

Ensure it has a proper skeleton with placeholders. A minimal working version (based on your provided snippets) should look like this:
text<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Таинственное поместье</title>
    <link rel="stylesheet" href="styles/tailwind.css"> <!-- If you have Tailwind -->
    <script src="https://telegram.org/js/telegram-web-app.js"></script> <!-- For Telegram SDK -->
</head>
<body class="bg-gray-900 text-white p-4">
    <!-- Story content will be injected here by build system -->
    <div id="passage" class="passage"></div> <!-- SugarCube will render here -->
    <div id="game-ui">
        <h2>Инвентарь</h2>
        <div id="inventory-list">Пусто</div>
        <h2>Локация</h2>
        <div id="location-display">Загрузка...</div>
    </div>
    <script src="scripts/game-data.js"></script>
    <script src="scripts/inventory.js"></script>
    <script src="scripts/location.js"></script>
    <script src="scripts/sugarcube-macros.js"></script>
    <script src="scripts/telegram-integration.js"></script>
    <script src="scripts/game-ui.js"></script>
    <!-- Add SugarCube here as per step 1 -->
</body>
</html>

SugarCube will automatically create and manage the interactive content in a #passages div (it injects it). Your custom UI divs will appear alongside.



4. Handle JS Initialization and Errors

In story-init.tw (your :: StoryInit), add console logging for debugging:
text<<script>>
console.log('StoryInit running...');
// Your existing code
<</script>>

In telegram-integration.js, add error handling:
textinit() {
    if (window.Telegram && window.Telegram.WebApp) {
        // Your code
    } else {
        console.error('Telegram SDK failed to load');
    }
}

In the browser console (or Telegram dev tools), check for errors like "Macro is undefined" or "GameData not found" after fixes.

5. Rebuild and Redeploy

Run npm run build (or node build.js if not using npm).
Verify locally: Open build/index.html in Chrome. It should show an interactive start screen with clickable links (e.g., navigation from "Вход_в_поместье").
Update deploy.yml: Ensure it deploys the new build/scripts/sugarcube-2.min.js.
Push to main branch to trigger deploy.
Clear Telegram cache: In Telegram, go to Settings > Data and Storage > Storage Usage > Clear Cache.

6. Test in Telegram

Open your Mini App in Telegram.
If still broken, use Telegram's web inspector (right-click > Inspect) to check console errors.
Expected behavior: Clickable links, dynamic updates to inventory/location, and no raw markup.

If these fixes don't resolve it, provide the full console logs from the deployed site or the exact content of src/index.html for further debugging. Your game structure (locations, events, inventory) looks solid otherwise—once SugarCube runs, it should work as intended!