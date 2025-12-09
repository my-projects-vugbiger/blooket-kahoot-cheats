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
    // 1. Setup UI helpers
    let iframe = document.createElement('iframe');
    document.body.append(iframe);
    window.alert = iframe.contentWindow.alert.bind(window);
    iframe.remove();
    
    // 2. Robust React Finder
    function searchDOM(element = document.body, depth = 0) {
        if (depth > 5) return null;
        const keys = Object.keys(element);
        const reactKey = keys.find(k => k.includes('react'));
        if (reactKey) {
            try {
                let fiber = element[reactKey];
                while (fiber) {
                    const node = fiber.stateNode || (fiber._owner ? fiber._owner.stateNode : null);
                    
                    if (node) {
                        // We know 'tiles' is a direct property on this component
                        if (node.tiles && Array.isArray(node.tiles)) return node;
                    }
                    fiber = fiber.return;
                }
            } catch (e) {}
        }
        for (const child of element.children) {
            const result = searchDOM(child, depth + 1);
            if (result) return result;
        }
        return null;
    }
    
    // 3. Execute Cheat
    const comp = searchDOM();
    
    if (!comp) { 
        alert("❌ Component not found! Make sure you are in-game."); 
        return; 
    }

    if (comp.tiles && comp.tiles.length > 0) {
        // The map is usually a 2D array (array of rows)
        // We map over every row, and fill it with 0 (Grass/Empty)
        // 0 = Empty, 3 = Rock/Tree/Obstacle usually
        
        comp.tiles = comp.tiles.map(row => {
            if (Array.isArray(row)) {
                // Keep the same length, fill with 0
                return new Array(row.length).fill(0);
            }
            return row;
        });

        // Force update if possible, though p5 draw loop should pick it up immediately
        if (comp.forceUpdate) comp.forceUpdate();

        alert("✅ All obstacles removed! You can now place towers anywhere.");
    } else {
        alert("⚠️ No map tiles found.");
    }

})();
