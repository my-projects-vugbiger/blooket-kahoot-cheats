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
    console.log("🎨 Highlight Answers Active (Green = Correct, Red = Wrong)\n");
    
    const answerDatabase = {};

    // 1. AUTOMATICALLY SKIP FEEDBACK
    function autoContinue() {
        const feedbackContainer = document.querySelector('[class*="feedbackContainer"]');
        const feedbackText = document.querySelector('[class*="feedbackText"]');
        
        const isFeedback = feedbackContainer || 
                           (feedbackText && feedbackText.offsetParent !== null);

        if (isFeedback) {
            if (feedbackContainer) {
                feedbackContainer.click();
            } else {
                document.body.click();
            }
            
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            });
            document.dispatchEvent(event);
        }
    }

    // 2. LEARN ANSWERS (Same robust logic as before)
    function learn() {
        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        
        wrappers.forEach(wrapper => {
            const questionTextEl = wrapper.querySelector('[class*="questionText"]');
            if (!questionTextEl) return;

            const question = questionTextEl.textContent.trim();

            // MC Check
            const correctBtn = Array.from(wrapper.querySelectorAll('[class*="answerButton"]')).find(btn => 
                btn.innerHTML.includes('fa-check') || 
                (btn.style.backgroundColor && btn.style.backgroundColor.includes('rgb(139, 220, 111)')) ||
                (btn.querySelector('[class*="answerFront"]') && btn.querySelector('[class*="answerFront"]').style.backgroundColor.includes('rgb(139, 220, 111)'))
            );

            if (correctBtn) {
                const answerTextEl = correctBtn.querySelector('[class*="answerText"]');
                if (answerTextEl) {
                    const answer = answerTextEl.textContent.trim();
                    if (!answerDatabase[question]) {
                        answerDatabase[question] = [answer];
                        console.log(`✓ Learned: "${question}" → "${answer}"`);
                    }
                }
            }

            // Typing Check
            const rawTypingEls = Array.from(wrapper.querySelectorAll('[class*="typingFeedbackAnswer"]'));
            const realTypingAnswers = rawTypingEls.filter(el => {
                const cls = el.getAttribute('class') || "";
                return !cls.includes('Answers') && !cls.includes('Icon');
            });

            if (realTypingAnswers.length > 0) {
                const answer = realTypingAnswers[0].textContent.trim();
                if (!answerDatabase[question]) {
                    answerDatabase[question] = [answer];
                    console.log(`✓ Learned: "${question}" → "${answer}"`);
                }
            }
        });
    }

    // 3. HIGHLIGHT CORRECT ANSWER
    function highlight() {
        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        if (wrappers.length === 0) return;

        // Active question is last wrapper
        const activeWrapper = wrappers[wrappers.length - 1];
        
        // Don't highlight during feedback/slideOut
        if (activeWrapper.className.includes('slideOut')) return;

        const questionTextEl = activeWrapper.querySelector('[class*="questionText"]');
        if (!questionTextEl) return;

        const question = questionTextEl.textContent.trim();

        if (answerDatabase[question]) {
            const knownAnswer = answerDatabase[question][0];

            // --- MC HIGHLIGHTING ---
            const buttons = activeWrapper.querySelectorAll('[class*="answerButton"]');
            if (buttons.length > 0) {
                buttons.forEach(btn => {
                    const textEl = btn.querySelector('[class*="answerText"]');
                    if (!textEl) return;

                    const text = textEl.textContent.trim();
                    const front = btn.querySelector('[class*="answerFront"]');
                    const back = btn.querySelector('[class*="answerBack"]');
                    
                    // Define Colors
                    const correctColor = '#00ff00'; // Lime Green
                    const wrongColor = '#ff0000';   // Red

                    if (text === knownAnswer) {
                        // Make Correct GREEN
                        if (front) {
                            front.style.backgroundColor = correctColor;
                            front.style.color = 'black'; // Ensure text is readable
                        }
                        if (back) back.style.backgroundColor = '#00cc00'; // Darker green for 3D effect
                    } else {
                        // Make Wrong RED
                        if (front) {
                            front.style.backgroundColor = wrongColor;
                            front.style.opacity = '0.7'; // Dim it slightly
                        }
                        if (back) back.style.backgroundColor = '#cc0000';
                    }
                });
            }

            // --- TYPING HIGHLIGHTING ---
            const input = activeWrapper.querySelector('input[class*="typingAnswerInput"]');
            if (input) {
                // 1. Change Placeholder
                input.setAttribute('placeholder', `ANSWER: ${knownAnswer}`);
                
                // 2. Change Subheader Text (Usually says "not case sensitive")
                const subHeader = activeWrapper.querySelector('[class*="typingAnswerSubheader"]');
                if (subHeader) {
                    subHeader.textContent = `ANSWER: ${knownAnswer}`;
                    subHeader.style.color = '#00ff00';
                    subHeader.style.fontWeight = 'bold';
                    subHeader.style.fontSize = '20px';
                }
            }
        }
    }

    // Loop
    setInterval(() => {
        autoContinue();
        learn();
        highlight();
    }, 100); // 100ms is plenty for visual updates

    console.log("✅ Highlighting Active. Play manually to populate database.");
})();
