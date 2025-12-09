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
    // 1. SETUP UI
    let iframe = document.createElement('iframe');
    document.body.append(iframe);
    window.alert = iframe.contentWindow.alert.bind(window);
    iframe.remove();

    // 2. TRAP THE SCENE
    function withScene(callback) {
        if (window._SCENE && window._SCENE.sys && window._SCENE.sys.isActive()) {
            callback(window._SCENE);
            return;
        }
        let found = false;
        const originalUpdate = window.Phaser.Scenes.SceneManager.prototype.update;
        window.Phaser.Scenes.SceneManager.prototype.update = function(time, delta) {
            originalUpdate.call(this, time, delta);
            if (found) return;
            for (const scene of this.scenes) {
                if (scene.sys.isActive() && scene.sys.settings.key !== 'Boot') {
                    window._SCENE = scene;
                    found = true;
                    window.Phaser.Scenes.SceneManager.prototype.update = originalUpdate;
                    callback(scene);
                    return;
                }
            }
        };
    }

    // 3. EXECUTE CHEAT
    withScene((scene) => {
        const service = scene.towerService;

        if (!service || !service.towers) {
            alert("❌ Tower Service not found!");
            return;
        }

        const towersDict = service.towers;
        let totalUpgraded = 0;

        // Iterate over dictionary keys (basic, aliens, etc.)
        Object.keys(towersDict).forEach(typeKey => {
            const group = towersDict[typeKey];

            // Get Array of Towers from Group
            let towers = [];
            if (group.getChildren) towers = group.getChildren();
            else if (group.children && group.children.entries) towers = group.children.entries;
            else if (Array.isArray(group)) towers = group;

            towers.forEach(tower => {
                // 1. Update Internal Counters (Instant Reload)
                // Setting cd to 0 usually makes it fire, but fullCd controls the reset time
                tower.cd = 0; 
                tower.fullCd = 1; // 1 frame reload

                // 2. Update Stats Object (The important part!)
                if (tower.stats) {
                    tower.stats.dmg = 1000000;      // Massive Damage
                    tower.stats.range = 1000;       // Map-wide Range
                    tower.stats.fireRate = 50;      // Ultra Fast
                    tower.stats.ghostDetect = true; // Hit Ghosts
                    tower.stats.maxTargets = 1000;  // Hit everything at once
                    
                    // Multi-projectile towers
                    if (tower.stats.numProjectiles) {
                        tower.stats.numProjectiles = 100;
                    }
                }

                // 3. Update Visuals
                if (tower.rangeCircle) {
                    tower.rangeCircle.radius = 1000;
                }
                
                totalUpgraded++;
            });
        });

        if (totalUpgraded > 0) {
            alert(`✅ Upgraded ${totalUpgraded} towers (DMG, Range, Ghost Hit)!`);
        } else {
            alert("⚠️ No active towers found.");
        }
    });
})();
