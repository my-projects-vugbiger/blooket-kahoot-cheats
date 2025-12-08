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
    let iframe = document.createElement('iframe');
    document.body.append(iframe);
    window.prompt = iframe.contentWindow.prompt.bind(window);
    iframe.remove();
    
    function searchDOM(element = document.body, depth = 0) {
        if (depth > 5) return null;
        const keys = Object.keys(element);
        const reactKey = keys.find(k => k.includes('react'));
        if (reactKey) {
            try {
                let fiber = element[reactKey];
                while (fiber) {
                    if (fiber._owner && fiber._owner.stateNode && fiber._owner.stateNode.state) {
                        const state = fiber._owner.stateNode.state;
                        if (state.round !== undefined) return fiber._owner.stateNode;
                    }
                    if (fiber.stateNode && fiber.stateNode.state) {
                        const state = fiber.stateNode.state;
                        if (state.round !== undefined) return fiber.stateNode;
                    }
                    fiber = fiber.return;
                }
            } catch (e) {}
        }
        for (const child of element.children) {
            const result = searchDOM(child, depth + 1);
            if (result) return result;
        }
        return null;
    }
    
    const comp = searchDOM();
    if (!comp) { alert("❌ Component not found!"); return; }
    
    const round = parseInt(prompt("What round do you want to set to?")) || 0;
    comp.setState({ round });
    alert(`✅ Round set to ${round}!`);
})();
