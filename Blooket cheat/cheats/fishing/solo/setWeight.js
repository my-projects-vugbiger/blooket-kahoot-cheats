/**
 * @license AGPL-3.0
 * Blooket Cheats (Modified Version)
 * Copyright (C) 2023-present 05Konz
 * Copyright (C) 2025-present redhorse26
 * 
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
 * Source of original work: [https://github.com/Blooket-Council/Blooket-Cheats/tree/main](https://github.com/Blooket-Council/Blooket-Cheats/tree/main)
 * Source of this modified work: [https://github.com/redhorse26/Blooket-Cheats/tree/main/cheats](https://github.com/redhorse26/Blooket-Cheats/tree/main/cheats)
*/
(() => {
    console.clear();
    console.log("🎣 Fishing Frenzy: Universal Weight Setter...");

    let gameData = null;

    function scanDeep(obj, depth = 0) {
        if (depth > 8 || gameData) return;
        if (!obj || typeof obj !== 'object') return;

        // Signature Check: Look for the unique keys found in your log
        // { id, firstQuestion, startNumCorrects, weight }
        if (obj.weight !== undefined && obj.startNumCorrects !== undefined && obj.hwCorrectsGoal !== undefined) {
            console.log("%c🔥 FOUND GAME DATA!", "color: lime; font-weight: bold;");
            console.log("   Current Weight:", obj.weight);
            gameData = obj;
            return;
        }

        // Traversal
        if (Array.isArray(obj)) {
            obj.forEach(item => scanDeep(item, depth + 1));
        } else {
            if (obj.props) scanDeep(obj.props, depth + 1);
            if (obj.children) scanDeep(obj.children, depth + 1); // Props children often hold the data
            if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
            if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
        }
    }

    const root = document.querySelector('#app') || document.body;
    function traverseDOM(node) {
        if (gameData) return;
        const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
        if (k) scanDeep(node[k]);
        for (const child of node.children) traverseDOM(child);
    }
    traverseDOM(root);

    if (gameData) {
        let iframe = document.createElement('iframe');
        document.body.append(iframe);
        const input = iframe.contentWindow.prompt(`Current Weight: ${gameData.weight}\n\nEnter new Weight:`, "100000");
        iframe.remove();

        if (input) {
            const newWeight = parseFloat(input);
            // Modify in-place (By Reference)
            gameData.weight = newWeight;
            
            alert(`✅ Weight set to ${newWeight}!\n\nIMPORTANT: Catch a fish or answer a question to force the UI to update.`);
        }
    } else {
        alert("❌ Could not find Game Data object. \nMake sure you are in the game and have caught at least one fish.");
    }
})();
