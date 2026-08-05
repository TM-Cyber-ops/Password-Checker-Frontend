 console.log(
            "%c🛡️ Cryptographic Evaluation Engine Live %c\nOwner/Author: TM-Cyber-ops (2026)", 
            "color: #58a6ff; font-weight: bold; font-size: 1.2rem;", 
            "color: #8b949e; font-size: 0.9rem;"
        );
        const passwordInput = document.getElementById('passwordInput');
        const toggleBtn = document.getElementById('toggleBtn');
        const progressBar = document.getElementById('progressBar');
        const entropyHero = document.getElementById('entropyHero');
        const classification = document.getElementById('classification');
        const gridData = document.getElementById('gridData');
        const mainContainer = document.getElementById('mainContainer');
        let debounceTimer;


        toggleBtn.addEventListener('click', () => {
            if (passwordInput.style.webkitTextSecurity === 'disc') {
                passwordInput.style.webkitTextSecurity = 'none';
                toggleBtn.innerText = '👁 Hide';
            } else {
                passwordInput.style.webkitTextSecurity = 'disc';
                toggleBtn.innerText = '👁 Show';
            }
        });


        passwordInput.addEventListener('input', () => {
            const activeSelector = document.getElementById('vectorSelector');
            if (activeSelector) {
                const currentText = document.getElementById('crackTimeDisplay') ? document.getElementById('crackTimeDisplay').innerText : '';
                if (activeSelector.selectedIndex === 1) window.currentVector = 'slow';
                else if (activeSelector.selectedIndex === 2) window.currentVector = 'online';
                else if (activeSelector.selectedIndex === 3) window.currentVector = 'throttled';
                else window.currentVector = 'fast';
            }
            clearTimeout(debounceTimer);
            const password = passwordInput.value;

            if (!password) {
                entropyHero.innerText = "Awaiting Input";
                entropyHero.style.color = "var(--text-muted)";
                classification.innerText = "System Idle";
                classification.style.color = "var(--text-muted)";
                progressBar.style.width = "0%";
                progressBar.style.backgroundColor = "var(--terminal-gray)";
                gridData.style.display = "none";
                mainContainer.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
                mainContainer.style.borderColor = "var(--border-muted)";
                return;
            }

            debounceTimer = setTimeout(async () => {
                entropyHero.innerText = "Analyzing search streams...";
                entropyHero.style.color = "var(--text-muted)";

                try {
                    const secureNetworkToken = btoa(password);

                    const response = await fetch('https://password-strength-checker-o8aq.onrender.com/analyze', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: secureNetworkToken })
                    });
                    
                    const data = await response.json();

                    if (data.status === "rejected" || data.status === "pwned") {
                        entropyHero.innerText = data.message;
                        entropyHero.style.color = "#ef4444";
                        classification.innerText = "REJECTED BY RULES PROTOCOL";
                        classification.style.color = "#ef4444";
                        progressBar.style.width = "100%";
                        progressBar.style.backgroundColor = "#ef4444";
                        gridData.style.display = "none";
                        mainContainer.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.2)";
                        mainContainer.style.borderColor = "#ef4444";
                    } else {
                        let targetColor = "#64748b";
                        let fillPercentage = "20%";
                        let strengthLabel = "Vulnerable";

                        if (data.color === "red") {
                            targetColor = "#f85149"; fillPercentage = "20%"; strengthLabel = "Cryptographically Weak";
                        } else if (data.color === "orange") {
                            targetColor = "#d29922"; fillPercentage = "40%"; strengthLabel = "Moderate / Guessable";
                        } else if (data.color === "blue") {
                            targetColor = "#58a6ff"; fillPercentage = "65%"; strengthLabel = "Secure Structural Array";
                        } else if (data.color === "darkgreen") {
                            targetColor = "#238636"; fillPercentage = "85%"; strengthLabel = "Highly Secure Passphrase";
                        } else if (data.color === "green") {
                            targetColor = "#2ea44f"; fillPercentage = "100%"; strengthLabel = "Maximum Enterprise Strength";
                        }

                        entropyHero.innerText = `Entropy: ${data.entropy_bits} Bits`;
                        entropyHero.style.color = targetColor;
                        classification.innerText = strengthLabel;
                        classification.style.color = targetColor;
                        
                        progressBar.style.width = fillPercentage;
                        progressBar.style.backgroundColor = targetColor;

                        mainContainer.style.boxShadow = `0 0 25px ${targetColor}2b`;
                        mainContainer.style.borderColor = targetColor;

                        gridData.innerHTML = `
                            <div class="grid-row"><span class="row-label">Character Length</span><span class="row-value" style="color: ${targetColor}">${data.length}</span></div>
                            <div class="grid-row"><span class="row-label">Active Pool Space</span><span class="row-value">${data.pool_size} choices [${data.pool_used}]</span></div>
                            <div class="grid-row"><span class="row-label">Patterns Flagged</span><span class="row-value">${data.patterns_flagged}</span></div>
                            <div class="grid-row"><span class="row-label">Total Combinations</span><span class="row-value">${data.combinations}</span></div>
                            <div class="grid-row" style="flex-direction: column; align-items: flex-start; gap: 8px; width: 100%;">
                                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                                    <span class="row-label">Brute-Force Vector</span>
                                    <select id="vectorSelector" 
                                            style="background: #161b22; color: #c9d1d9; border: 1px solid #30363d; border-radius: 4px; padding: 2px 6px; font-size: 0.75rem; font-family: sans-serif; cursor: pointer; outline: none;">             
                                        <option value="${data.crack_time}" ${window.currentVector === 'fast' || !window.currentVector ? 'selected' : ''}>Offline Fast Hash (GPU)</option>
                                        <option value="${data.time_offline_slow}" ${window.currentVector === 'slow' ? 'selected' : ''}>Offline Slow Hash (Bcrypt)</option>
                                        <option value="${data.time_online_unthrottled}" ${window.currentVector === 'online' ? 'selected' : ''}>Online Portal (No FW)</option>
                                        <option value="${data.time_online_throttled}" ${window.currentVector === 'throttled' ? 'selected' : ''}>Online Portal (Throttled)</option>
                                    </select>
                                </div>
                                <span id="crackTimeDisplay" class="row-value" style="color: ${targetColor}; text-align: left; font-size: 1rem; font-weight: bold; width: 100%; display: block;">
                                    ${window.currentVector === 'slow' ? data.time_offline_slow : 
                                      window.currentVector === 'online' ? data.time_online_unthrottled : 
                                      window.currentVector === 'throttled' ? data.time_online_throttled : data.crack_time}
                                </span>
                            </div>
                        `;
                        document.addEventListener('change', function(event) {
                            if (event.target && event.target.id === 'vectorSelector') {
                                const selector = event.target;
        
                                if (selector.selectedIndex === 0) window.currentVector = 'fast';
                                else if (selector.selectedIndex === 1) window.currentVector = 'slow';
                                else if (selector.selectedIndex === 2) window.currentVector = 'online';
                                else if (selector.selectedIndex === 3) window.currentVector = 'throttled';

                                const displayCard = document.getElementById('crackTimeDisplay');
                                if (displayCard) {
                                    displayCard.innerText = selector.value;
                                }
                            }
                        });
                        
                        gridData.style.display = "flex";
                    }
                } catch (error) {
                    entropyHero.innerText = "API Engine Unreachable";
                    entropyHero.style.color = "#ef4444";
                    classification.innerText = "Check backend connection parameters.";
                    gridData.style.display = "none";
                }
            }, 300);
        });
