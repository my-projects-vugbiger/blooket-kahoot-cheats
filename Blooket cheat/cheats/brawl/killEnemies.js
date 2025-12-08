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
    console.log("💀 Kill All Enemies - Starting...\n");
    
    if (!window.Phaser) {
        alert("❌ Phaser not found! Make sure you're in Monster Brawl.");
        return;
    }
    
    console.log("✓ Phaser", window.Phaser.VERSION);
    
    // First, ensure we have groups collected
    if (!window._groups || window._groups.size === 0) {
        console.log("⏳ Collecting groups first...");
        
        // Hook group collection
        if (window.Phaser.GameObjects?.Group?.prototype) {
            const originalUpdate = window.Phaser.GameObjects.Group.prototype.preUpdate || 
                                  window.Phaser.GameObjects.Group.prototype.update;
            
            if (originalUpdate && !window._groupHookedKill) {
                window.Phaser.GameObjects.Group.prototype.preUpdate = function(...args) {
                    if (!window._groups) window._groups = new Set();
                    window._groups.add(this);
                    return originalUpdate?.apply(this, args);
                };
                window._groupHookedKill = true;
            }
        }
        
        // Wait a moment for groups to be collected
        setTimeout(killAllEnemies, 500);
    } else {
        killAllEnemies();
    }
    
    function killAllEnemies() {
        console.log("\n=== KILLING ALL ENEMIES (WITH XP DROPS) ===\n");
        
        if (!window._groups || window._groups.size === 0) {
            alert("❌ No groups found! Play a bit first, then run this script again.");
            return;
        }
        
        let totalKilled = 0;
        let killedWithXP = 0;
        let totalAttempted = 0;
        
        const groups = Array.from(window._groups);
        console.log(`Checking ${groups.length} groups...\n`);
        
        groups.forEach((group, groupIndex) => {
            if (!group.children?.entries) return;
            
            const children = group.children.entries;
            if (children.length === 0) return;
            
            children.forEach((enemy, enemyIndex) => {
                // Skip if this looks like the player
                const texture = enemy.texture?.key || "";
                if (texture.includes('player')) return;
                
                totalAttempted++;
                
                // PRIORITY METHOD: receiveDamage - This properly kills enemies and drops XP
                if (typeof enemy.receiveDamage === 'function' && enemy.hp !== undefined) {
                    try {
                        const hp = enemy.hp || 9999;
                        enemy.receiveDamage(hp, 1);
                        totalKilled++;
                        killedWithXP++;
                        
                        if (killedWithXP <= 5) {
                            console.log(`✓ Killed enemy (HP: ${hp}) - XP will drop`);
                        }
                        return;
                    } catch (e) {
                        console.log(`  ⚠️ receiveDamage failed:`, e.message);
                    }
                }
                
                // Fallback 1: Try setting HP to 0 and calling die()
                if (enemy.hp !== undefined) {
                    try {
                        const oldHp = enemy.hp;
                        enemy.hp = 0;
                        
                        // Look for death/kill methods
                        if (typeof enemy.die === 'function') {
                            enemy.die();
                            totalKilled++;
                            killedWithXP++;
                            
                            if (killedWithXP <= 5) {
                                console.log(`✓ Killed via die() method`);
                            }
                            return;
                        } else if (typeof enemy.death === 'function') {
                            enemy.death();
                            totalKilled++;
                            killedWithXP++;
                            
                            if (killedWithXP <= 5) {
                                console.log(`✓ Killed via death() method`);
                            }
                            return;
                        }
                    } catch (e) {}
                }
                
                // Fallback 2: Look for onDeath or onKill callbacks
                if (enemy.body) {
                    try {
                        // Trigger collision with huge damage
                        if (typeof enemy.receiveDamage === 'function') {
                            enemy.receiveDamage(99999, 1);
                            totalKilled++;
                            killedWithXP++;
                            return;
                        }
                    } catch (e) {}
                }
                
                // Last resort: Make invisible but don't destroy (so game logic can handle death)
                try {
                    enemy.hp = 0;
                    enemy.setVisible(false);
                    enemy.setActive(false);
                    
                    // Try to trigger any death events
                    if (enemy.emit) {
                        enemy.emit('death');
                        enemy.emit('killed');
                    }
                    
                    totalKilled++;
                    
                    if (totalKilled <= 5) {
                        console.log(`✓ Disabled enemy (may not drop XP)`);
                    }
                } catch (e) {}
            });
        });
        
        // Summary
        console.log("\n\n=== SUMMARY ===");
        console.log(`Enemies found: ${totalAttempted}`);
        console.log(`Enemies killed: ${totalKilled}`);
        console.log(`Killed with XP drops: ${killedWithXP}`);
        
        if (killedWithXP > 0) {
            console.log("\n✅ SUCCESS!");
            alert(`✅ Killed All Enemies!\n\n${killedWithXP} enemies eliminated!\n💎 XP should drop normally!`);
        } else if (totalKilled > 0) {
            console.log("\n⚠️ Killed enemies but XP drops not guaranteed");
            alert(`⚠️ Killed ${totalKilled} enemies!\n\nHowever, XP drops may not work properly.\nTry using Instant Kill for guaranteed one-hit kills with XP!`);
        } else {
            console.log("\n⚠️ No enemies found");
            alert("⚠️ No enemies found on screen!\nMake sure you're actively playing.");
        }
    }
    
})();
