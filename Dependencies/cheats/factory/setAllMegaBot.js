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
    console.log("🏭 Factory: Setting all to Mega Bots...");

    let targetObj = null;

    // 1. Scan for the factories container
    function scanDeep(obj, depth = 0) {
        if (depth > 8 || targetObj) return;
        if (!obj || typeof obj !== 'object') return;

        if (obj.factories && Array.isArray(obj.factories)) {
            targetObj = obj;
            return;
        }

        if (Array.isArray(obj)) {
            obj.forEach(item => scanDeep(item, depth + 1));
        } else {
            if (obj.props) scanDeep(obj.props, depth + 1);
            if (obj.children) scanDeep(obj.children, depth + 1);
            if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
            if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
        }
    }

    // 2. Start Traversal
    const root = document.querySelector('#app') || document.body;
    function traverseDOM(node) {
        if (targetObj) return;
        const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
        if (k) scanDeep(node[k]);
        for (const child of node.children) traverseDOM(child);
    }
    traverseDOM(root);

    // 3. Execute Hack
    if (targetObj) {
        // Define Mega Bot Stats
        const megaBot = {
            name: "Mega Bot",
            color: "#d71f27",
            class: "🤖",
            rarity: "Legendary",
            cash: [80000, 430000, 4200000, 62000000, 1000000000],
            time: [5, 5, 3, 3, 3],
            price: [7000000, 120000000, 1900000000, 35000000000],
            active: false,
            level: 4,
            bonus: 5.0
        };

        // Modify the array in-place to preserve references
        const arr = targetObj.factories;
        arr.length = 0; // Clear current blooks
        
        // Fill with 10 Mega Bots
        for (let i = 0; i < 10; i++) {
            // Important: spread ...megaBot to create a unique copy for each slot
            arr.push({ ...megaBot });
        }

        let iframe = document.createElement('iframe');
        document.body.append(iframe);
        iframe.contentWindow.alert("✅ Factory replaced with 10 Mega Bots!\n\nIMPORTANT: Buy an upgrade or click a blook to refresh the visuals.");
        iframe.remove();

    } else {
        alert("❌ Could not find factories container. Place at least one blook first.");
    }
})();
