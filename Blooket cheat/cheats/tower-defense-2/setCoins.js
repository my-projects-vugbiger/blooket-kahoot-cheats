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
    window.prompt = iframe.contentWindow.prompt.bind(window);
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
        const manager = scene.gameManager;

        if (!manager) {
            alert("❌ Game Manager not found! (Wait for game to load)");
            return;
        }

        const current = manager.coins;
        const input = prompt(`Current Coins: ${current}\n\nEnter new amount:`, "50000");
        
        if (input !== null) {
            const amount = parseInt(input);
            if (!isNaN(amount)) {
                manager.coins = amount;
                
                // User requested note added
                alert(`✅ Coins set to ${amount}!\n\nNote: Buy something to update the display counter.`);
            }
        }
    });
})();
