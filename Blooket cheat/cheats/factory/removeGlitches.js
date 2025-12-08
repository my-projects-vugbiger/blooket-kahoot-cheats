/**
 * @license AGPL-3.0
 * Blooket Cheats
 * Copyright (C) 2025-present redhorse26
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * Source: [https://github.com/redhorse26/Blooket-Cheats/tree/main/cheats](https://github.com/redhorse26/Blooket-Cheats/tree/main/cheats)
*/
(() => {
    console.clear();
    console.log("🛡️ HUNTING GLITCH STRINGS IN MEMORY...");

    const glitchNames = [
        "Lunch Break", "Ad Spam", "Error 37", "Night Time", "#LOL", 
        "Jokester", "Slow Mo", "Dance Party", "Vortex", "Reverse", "Flip", "Micro"
    ];

    let foundCount = 0;
    let visited = new Set();

    // Helper to clear an object if it looks like glitch state
    function clearState(obj, key) {
        console.log(`%c🔥 FOUND GLITCH: "${obj[key]}" in key "${key}"`, "color: red; font-weight: bold;");
        console.log("   Object:", obj);

        // 1. Clear the specific string
        obj[key] = ""; 

        // 2. Clear common associated arrays if they exist nearby
        if (Array.isArray(obj.ads)) obj.ads = [];
        if (Array.isArray(obj.hazards)) obj.hazards = [];
        if (typeof obj.lol === 'boolean') obj.lol = false;
        if (typeof obj.night === 'boolean') obj.night = false;
        if (typeof obj.joke === 'boolean') obj.joke = false;
        if (typeof obj.slow === 'boolean') obj.slow = false;
        if (typeof obj.dance === 'boolean') obj.dance = false;
        if (typeof obj.color === 'string') obj.color = "";
        
        foundCount++;
    }

    function scanDeep(obj, depth = 0) {
        if (!obj || typeof obj !== 'object' || depth > 10) return;
        if (visited.has(obj)) return;
        visited.add(obj);

        // Check all keys in this object
        for (const key in obj) {
            const val = obj[key];

            // 1. Match String Values
            if (typeof val === 'string') {
                // Check against all glitch names
                for (const gName of glitchNames) {
                    if (val === gName) {
                        clearState(obj, key);
                        // Don't return, keep scanning in case there are others
                    }
                }
            }

            // 2. Recurse
            // Skip massive react internals to save time, but keep 'props' and 'state'
            if (key.startsWith('_') && key !== '_owner') continue;
            
            if (typeof val === 'object') {
                scanDeep(val, depth + 1);
            }
        }
    }

    // Start scan from React Root
    const root = document.querySelector('#app') || document.body;
    function traverseDOM(node) {
        const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
        if (k) {
            const fiber = node[k];
            // Scan Hooks (State)
            if (fiber.memoizedState) scanDeep(fiber.memoizedState);
            // Scan Props
            if (fiber.memoizedProps) scanDeep(fiber.memoizedProps);
        }
        for (const child of node.children) traverseDOM(child);
    }
    traverseDOM(root);

    if (foundCount > 0) {
        let iframe = document.createElement('iframe');
        document.body.append(iframe);
        iframe.contentWindow.alert(`✅ Found and cleared ${foundCount} glitch objects in memory!`);
        iframe.remove();
    } else {
        alert("❌ No active glitch strings found in memory. \n(Wait until you actually have a glitch active, then run this!)");
    }
})();
