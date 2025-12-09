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
    console.log("🧠 Learn Auto Answer v23 (UNBLOCKED)\n");
    
    const answerDatabase = {};

    // 1. AUTOMATICALLY SKIP FEEDBACK
    function autoContinue() {
        const feedbackContainer = document.querySelector('[class*="feedbackContainer"]');
        const feedbackText = document.querySelector('[class*="feedbackText"]');
        
        // Check if feedback is actually visible/present
        // We don't check body.textContent anymore because it lingers
        const isFeedback = feedbackContainer || 
                           (feedbackText && feedbackText.offsetParent !== null); // visible check

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

    // 2. LEARN FROM VISIBLE ANSWERS
    function learn() {
        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        
        wrappers.forEach(wrapper => {
            const questionTextEl = wrapper.querySelector('[class*="questionText"]');
            if (!questionTextEl) return;

            const question = questionTextEl.textContent.trim();

            // --- CHECK 1: Multiple Choice ---
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
                        console.log(`✓ Learned (MC): "${question}" → "${answer}"`);
                    }
                }
            }

            // --- CHECK 2: Typing Questions ---
            const rawTypingEls = Array.from(wrapper.querySelectorAll('[class*="typingFeedbackAnswer"]'));
            
            // Filter carefully using getAttribute to avoid SVG crash
            const realTypingAnswers = rawTypingEls.filter(el => {
                const cls = el.getAttribute('class') || "";
                return !cls.includes('Answers') && !cls.includes('Icon');
            });

            if (realTypingAnswers.length > 0) {
                const answer = realTypingAnswers[0].textContent.trim();
                
                if (!answerDatabase[question]) {
                    answerDatabase[question] = [answer];
                    console.log(`✓ Learned (Typing): "${question}" → "${answer}"`);
                }
            }
        });
    }

    // 3. ANSWER ACTIVE QUESTION
    function answer() {
        const wrappers = document.querySelectorAll('[class*="questionWrapper"]');
        if (wrappers.length === 0) return;

        // The active question is usually the last one, but verify it's not sliding out
        let activeWrapper = wrappers[wrappers.length - 1];
        if (activeWrapper.className.includes('slideOut') && wrappers.length > 1) {
            // If the last one is sliding out, maybe we shouldn't act yet, 
            // OR if there's another one, that's the slideIn? 
            // Usually Blooket appends the NEW wrapper last. 
            // We'll stick to last for now, but remove the blocker.
        }

        const questionTextEl = activeWrapper.querySelector('[class*="questionText"]');
        if (!questionTextEl) return;

        const question = questionTextEl.textContent.trim();

        if (answerDatabase[question]) {
            const knownAnswer = answerDatabase[question][0];

            // --- MC Handling ---
            const buttons = activeWrapper.querySelectorAll('[class*="answerButton"]');
            if (buttons.length > 0) {
                for (const btn of buttons) {
                    const btnTextEl = btn.querySelector('[class*="answerText"]');
                    // Ensure we don't click disabled buttons
                    if (btnTextEl && btnTextEl.textContent.trim() === knownAnswer && !btn.className.includes('Disabled')) {
                        console.log(`🎯 Answering (MC): "${question}"`);
                        btn.click();
                        return;
                    }
                }
            }

            // --- Typing Handling ---
            const input = activeWrapper.querySelector('input[class*="typingAnswerInput"]');
            if (input && !input.disabled) {
                
                // 1. Fill the box if it's wrong/empty
                if (input.value !== knownAnswer) {
                    console.log(`🎯 Typing: "${knownAnswer}"`);
                    
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(input, knownAnswer);
                    
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // 2. Click submit (Always try to click if input is visible/enabled)
                // We used to only click if we changed value, but if the first click failed, we got stuck.
                // Now we try clicking submit every cycle until the input disappears/disables.
                const submitBtn = activeWrapper.querySelector('button[class*="typingAnswerButton"]');
                if (submitBtn) {
                    // Small throttle to avoid 1000 clicks/sec
                    if (!submitBtn._lastClick || Date.now() - submitBtn._lastClick > 200) {
                        console.log(`🎯 Submitting Typing...`);
                        submitBtn.click();
                        submitBtn._lastClick = Date.now();
                    }
                }
            }
        }
    }

    setInterval(() => {
        autoContinue();
        learn();
        answer();
    }, 50);

    console.log("✅ Script Active. Unblocked & Aggressive Typing.");
})();
