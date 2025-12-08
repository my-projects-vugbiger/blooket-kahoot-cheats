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
    console.log("💉 Factory: Setting Upgrade Prices to 0...");

    let foundFactories = null;

    // Deep Scanner for the 'factories' array
    function scanDeep(obj, depth = 0) {
        if (depth > 8 || foundFactories) return;
        if (!obj || typeof obj !== 'object') return;

        // Check for the factories array structure
        if (obj.factories && Array.isArray(obj.factories) && obj.factories.length > 0) {
            const sample = obj.factories[0];
            // Blooks have 'price' array and 'level'
            if (sample.price && Array.isArray(sample.price) && sample.level !== undefined) {
                foundFactories = obj.factories;
                return;
            }
        }

        // Traverse React structures
        if (Array.isArray(obj)) {
            obj.forEach(item => scanDeep(item, depth + 1));
        } else {
            if (obj.props) scanDeep(obj.props, depth + 1);
            if (obj.children) scanDeep(obj.children, depth + 1);
            if (obj.memoizedProps) scanDeep(obj.memoizedProps, depth + 1);
            if (obj.memoizedState) scanDeep(obj.memoizedState, depth + 1);
        }
    }

    // Start scanning from React root
    const root = document.querySelector('#app') || document.body;
    function traverseDOM(node) {
        if (foundFactories) return;
        const k = Object.keys(node).find(key => key.startsWith('__reactFiber'));
        if (k) scanDeep(node[k]);
        for (const child of node.children) traverseDOM(child);
    }
    traverseDOM(root);

    if (foundFactories) {
        let count = 0;
        foundFactories.forEach(factory => {
            // Verify it has prices
            if (factory.price) {
                // Set all future upgrade prices to 0
                factory.price = [0, 0, 0, 0, 0];
                count++;
            }
        });

        let iframe = document.createElement('iframe');
        document.body.append(iframe);
        iframe.contentWindow.alert(`✅ Set upgrades to FREE for ${count} blooks!\n\nIMPORTANT: Click on a blook to refresh the upgrade menu.`);
        iframe.remove();
    } else {
        alert("❌ Could not find factories. Make sure you have at least one blook placed!");
    }
})();
