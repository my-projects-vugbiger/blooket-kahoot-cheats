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
        const enemyService = scene.enemyService;

        if (!enemyService) {
            alert("❌ Enemy Service not found! (Wait for game to load)");
            return;
        }

        const current = enemyService.waveNum;
        const input = prompt(`Current Wave: ${current}\n\nEnter new wave number:`, "50");
        
        if (input !== null) {
            const amount = parseInt(input);
            if (!isNaN(amount)) {
                // Set the wave number
                enemyService.waveNum = amount;
                
                alert(`✅ Round/Wave set to ${amount}!\n\nNote: You must finish the current wave for the game to jump to the new round.`);
                
                // Optional: Reset wave state to force next wave logic
                if (enemyService.isWaveActive === false) {
                    // If between waves, this might help the UI update immediately
                    if (scene.hud && scene.hud.updateWave) scene.hud.updateWave();
                }
            }
        }
    });
})();
