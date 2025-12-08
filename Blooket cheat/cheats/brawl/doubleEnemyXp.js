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
    console.log("💎 Double Enemy XP - Continuous Mode\n");
    
    if (!window.Phaser) {
        alert("Phaser not found!");
        return;
    }
    
    console.log("✓ Phaser", window.Phaser.VERSION);
    
    let totalModified = 0;
    window._processedEnemies = window._processedEnemies || new Set();
    
    // Hook group collection
    if (window.Phaser.GameObjects?.Group?.prototype && !window._groupHooked) {
        const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate || 
                              window.Phaser.GameObjects.Group.prototype.update;
        
        if (originalUpdate) {
            window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                if (!window._groups) window._groups = new Set();
                window._groups.add(this);
                return originalUpdate?.apply(this, args);
            };
            console.log("✓ Group hook installed");
            window._groupHooked = true;
        }
    }
    
    // Continuous monitoring every 5ms
    const monitor = setInterval(() => {
        if (!window._groups) return;
        
        window._groups.forEach(group => {
            if (!group.children?.entries) return;
            
            group.children.entries.forEach(enemy => {
                // Skip if already processed
                if (window._processedEnemies.has(enemy)) return;
                
                // Double XP if enemy has val property
                if (enemy.val !== undefined && enemy.val !== null) {
                    const oldVal = enemy.val;
                    enemy.val *= 2;
                    window._processedEnemies.add(enemy);
                    totalModified++;
                    
                    if (totalModified <= 10) {
                        console.log(`✓ Doubled enemy: ${oldVal} → ${enemy.val}`);
                    }
                }
            });
        });
        
    }, 5);
    
    // Status check
    setTimeout(() => {
        console.log("\n=== STATUS ===");
        console.log(`Enemies modified: ${totalModified}`);
        
        if (totalModified > 0) {
            console.log("\n✅ DOUBLE XP ACTIVE!");
            alert(`✅ Double Enemy XP Activated!\n\n${totalModified} enemies modified!\n\n🔄 Continuous monitoring: New enemies auto-doubled every 5ms`);
        }
        
        console.log("\n🔄 Continuous monitoring active (every 5ms)");
    }, 2000);
    
    console.log("⏳ Monitoring started...");
    console.log("Play the game normally!");
    
    window._xpMonitor = monitor;
})();
