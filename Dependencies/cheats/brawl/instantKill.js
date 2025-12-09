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
    console.log("⚡ Instant Kill - Continuous Mode\n");
    
    if (!window.Phaser) {
        alert("❌ Phaser not found! Make sure you're in Monster Brawl.");
        return;
    }
    
    console.log("✓ Phaser", window.Phaser.VERSION);
    
    let totalModified = 0;
    window._processedInstantKill = window._processedInstantKill || new Set();
    
    // Hook group collection
    if (window.Phaser.GameObjects?.Group?.prototype && !window._groupHookedInstantKill) {
        const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate || 
                              window.Phaser.GameObjects.Group.prototype.update;
        
        if (originalUpdate) {
            window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                if (!window._groups) window._groups = new Set();
                window._groups.add(this);
                return originalUpdate?.apply(this, args);
            };
            console.log("✓ Group hook installed");
            window._groupHookedInstantKill = true;
        }
    }
    
    // Hook GameObjectFactory for immediate enemy modification
    if (window.Phaser.GameObjects?.GameObjectFactory?.prototype?.existing && !window._factoryHookedInstantKill) {
        const originalExisting = window.Phaser.GameObjects.GameObjectFactory.prototype.existing;
        
        window.Phaser.GameObjects.GameObjectFactory.prototype.existing = function(gameObject) {
            const result = originalExisting.apply(this, arguments);
            
            // Set HP to 1 for newly created enemies
            if (result && result.hp !== undefined && !window._processedInstantKill.has(result)) {
                result.hp = 1;
                window._processedInstantKill.add(result);
                console.log(`✓ Auto-set new enemy HP to 1`);
            }
            
            return result;
        };
        console.log("✓ GameObjectFactory.existing hooked");
        window._factoryHookedInstantKill = true;
    }
    
    // Continuous monitoring every 5ms
    const monitor = setInterval(() => {
        if (!window._groups) return;
        
        window._groups.forEach(group => {
            if (!group.children?.entries) return;
            
            group.children.entries.forEach(enemy => {
                // Skip if already processed
                if (window._processedInstantKill.has(enemy)) return;
                
                // Set HP to 1 if enemy has hp property
                if (enemy.hp !== undefined && enemy.hp !== null) {
                    const oldHp = enemy.hp;
                    enemy.hp = 1;
                    window._processedInstantKill.add(enemy);
                    totalModified++;
                    
                    if (totalModified <= 10) {
                        console.log(`✓ Enemy HP: ${oldHp} → 1`);
                    }
                }
            });
            
            // Hook the group's classType for future enemies
            if (group.classType?.prototype && !group.classType.prototype._instantKillHooked) {
                const methods = ['start', 'init', 'create'];
                
                methods.forEach(method => {
                    if (group.classType.prototype[method]) {
                        const original = group.classType.prototype[method];
                        
                        group.classType.prototype[method] = function(...args) {
                            const result = original.apply(this, args);
                            
                            if (this.hp !== undefined) {
                                this.hp = 1;
                            }
                            
                            return result;
                        };
                    }
                });
                
                group.classType.prototype._instantKillHooked = true;
            }
        });
        
    }, 5);
    
    // Status check after 2 seconds
    setTimeout(() => {
        console.log("\n=== STATUS ===");
        console.log(`Enemies modified: ${totalModified}`);
        
        if (totalModified > 0) {
            console.log("\n✅ INSTANT KILL ACTIVE!");
            alert(`✅ Instant Kill Activated!\n\n${totalModified} enemies now have 1 HP!\n\n🔄 Continuous monitoring: New enemies auto-modified every 5ms`);
        } else {
            console.log("\n⚠️ No enemies found yet");
            console.log("Play a bit and enemies will be modified automatically!");
        }
        
        console.log("\n🔄 Continuous monitoring active (every 5ms)");
        console.log("All enemies will die in one hit!");
    }, 2000);
    
    console.log("⏳ Monitoring started...");
    console.log("Play the game normally!");
    
    // Store interval ID
    window._instantKillMonitor = monitor;
})();
