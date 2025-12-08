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
    console.log("💉 Factory: Making Blooks OP...");

    let foundFactories = null;

    // Deep Scanner
    function scanDeep(obj, depth = 0) {
        if (depth > 8 || foundFactories) return;
        if (!obj || typeof obj !== 'object') return;

        // Identify the factories array
        if (obj.factories && Array.isArray(obj.factories) && obj.factories.length > 0) {
            const sample = obj.factories[0];
            if (sample.cash && Array.isArray(sample.cash) && sample.name) {
                foundFactories = obj.factories;
                return;
            }
        }

        // React Traversal
        if (Array.isArray(obj)) {
            obj.forEach(item => scanDeep(item, depth + 1));
        } else {
            if (obj.props) scanDeep(obj.props, depth + 1);
            if (obj.children) scanDeep(obj.children, depth + 1);
            if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
            if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
        }
    }

    // Start Scan from React Roots
    const root = document.querySelector('#app') || document.body;
    function traverseDOM(node) {
        if (foundFactories) return;
        const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
        if (k) {
            scanDeep(node[k]);
        }
        for (const child of node.children) traverseDOM(child);
    }
    traverseDOM(root);

    if (foundFactories) {
        let count = 0;
        foundFactories.forEach(factory => {
            // Set insane stats
            factory.cash = [1e9, 1e9, 1e9, 1e9, 1e9]; // 1 Billion
            factory.time = [0.01, 0.01, 0.01, 0.01, 0.01]; // Instant
            count++;
        });

        let iframe = document.createElement('iframe');
        document.body.append(iframe);
        iframe.contentWindow.alert(`✅ Made ${count} blooks OP!\n\nIMPORTANT: Buy an upgrade or a new blook to force the stats to update.`);
        iframe.remove();
    } else {
        alert("❌ Could not find factories. Make sure you have at least one blook!");
    }
})();
