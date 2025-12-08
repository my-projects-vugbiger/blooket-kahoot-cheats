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
    console.log("🐌 Half Enemy Speed - Continuous Mode\n");
    
    if (!window.Phaser) {
        alert("Phaser not found!");
        return;
    }
    
    console.log("✓ Phaser", window.Phaser.VERSION);
    
    let totalSlowed = 0;
    window._processedSpeeds = window._processedSpeeds || new Set();
    
    // Hook group collection
    if (window.Phaser.GameObjects?.Group?.prototype && !window._groupHookedSpeed) {
        const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate || 
                              window.Phaser.GameObjects.Group.prototype.update;
        
        if (originalUpdate) {
            window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                if (!window._groups) window._groups = new Set();
                window._groups.add(this);
                return originalUpdate?.apply(this, args);
            };
            console.log("✓ Group hook installed");
            window._groupHookedSpeed = true;
        }
    }
    
    // Continuous monitoring every 5ms
    const monitor = setInterval(() => {
        if (!window._groups) return;
        
        window._groups.forEach(group => {
            if (!group.children?.entries) return;
            
            group.children.entries.forEach(enemy => {
                // Skip if already processed
                if (window._processedSpeeds.has(enemy)) return;
                
                // Halve speed if enemy has speed property
                if (enemy.speed !== undefined && enemy.speed !== null) {
                    const oldSpeed = enemy.speed;
                    enemy.speed *= 0.5;
                    window._processedSpeeds.add(enemy);
                    totalSlowed++;
                    
                    if (totalSlowed <= 10) {
                        console.log(`✓ Slowed enemy: ${oldSpeed} → ${enemy.speed}`);
                    }
                }
            });
        });
        
    }, 5);
    
    // Status check
    setTimeout(() => {
        console.log("\n=== STATUS ===");
        console.log(`Enemies slowed: ${totalSlowed}`);
        
        if (totalSlowed > 0) {
            console.log("\n✅ HALF SPEED ACTIVE!");
            alert(`✅ Half Enemy Speed Activated!\n\n${totalSlowed} enemies slowed!\n\n🔄 Continuous monitoring: New enemies auto-slowed every 5ms`);
        }
        
        console.log("\n🔄 Continuous monitoring active (every 5ms)");
    }, 2000);
    
    console.log("⏳ Monitoring started...");
    console.log("Play the game normally!");
    
    window._speedMonitor = monitor;
})();
