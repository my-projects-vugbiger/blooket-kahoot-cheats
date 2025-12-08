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
    console.log("❤️ Reset Health\n");
    
    // Hook Phaser to get scene
    if (window.Phaser?.GameObjects?.Group?.prototype && !window._healthHook) {
        const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate || 
                              window.Phaser.GameObjects.Group.prototype.update;
        
        if (originalUpdate) {
            window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                if (!window._scene && this.scene) {
                    window._scene = this.scene;
                }
                return originalUpdate?.apply(this, args);
            };
            window._healthHook = true;
        }
    }
    
    setTimeout(() => {
        if (!window._scene?.eventBus) {
            alert("❌ Scene not found! Move around and try again.");
            return;
        }
        
        try {
            // Trigger respawn event
            const respawnEvent = window._scene.eventBus._events?.respawn;
            
            if (respawnEvent?.fn) {
                console.log("✓ Found respawn event");
                respawnEvent.fn();
                console.log("✅ Health reset!");
                alert("✅ Health Reset!\n\nYour health is now full!");
            } else if (respawnEvent && typeof respawnEvent === 'function') {
                respawnEvent();
                console.log("✅ Health reset!");
                alert("✅ Health Reset!\n\nYour health is now full!");
            } else {
                // Try emitting directly
                window._scene.eventBus.emit('respawn');
                console.log("✅ Respawn event emitted!");
                alert("✅ Health Reset!\n\nRespawn triggered!");
            }
        } catch (e) {
            console.log("❌ Error:", e);
            alert(`❌ Error: ${e.message}`);
        }
        
    }, 1000);
    
    console.log("⏳ Getting scene...");
})();
