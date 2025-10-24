(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        BINANCE_ID: '98580046',
        STORAGE_KEYS: {
            TRANSACTIONS: 'quotex_custom_transactions_v2',
            BALANCE: 'quotex_current_balance_v2',
            INITIAL_BALANCE: 'initialBalanceInfo',
            LEADERBOARD_DATA: 'sltech_leaderboard_data',
            EXPAND_PERCENT: 'expandPercent',
            UNLIMITED_MODE: 'unlimited_mode'
        },
        DEFAULT_BALANCE: 10000.00
    };

    // -------------------- URL REDIRECTION & DEMO TO LIVE SPOOF --------------------
    function setupDemoToLiveSpoof() {
        try {
            const baseUrl = window.location.origin;

            if (location.pathname === "/en/trade") {
                location.replace(baseUrl + "/en/demo-trade");
                return;
            }

            if (location.pathname === "/en/demo-trade") {
                const liveUrl = baseUrl + "/en/trade";
                document.title = "Live trading | Quotex";

                const titleElement = document.querySelector("title") || document.createElement("title");
                const observerConfig = { childList: true, subtree: true };
                new MutationObserver(() => {
                    if (document.title !== "Live trading | Quotex") {
                        document.title = "Live trading | Quotex";
                    }
                }).observe(titleElement, observerConfig);

                history.replaceState(null, '', liveUrl);
            }
        } catch (error) {
            console.error("Demo→Live spoof error:", error);
        }
    }

    // -------------------- MAIN MOD FUNCTIONS --------------------
    function initializeMod() {
        console.log('🚀 Initializing Quotex Mod...');

        setupDemoToLiveSpoof();
        convertDemoToLiveUI();
        setupBalanceTracking();
        setupAccountSwitcher();
        setupProfitCalculator();
        setupLeaderboardSystem();
        setupSettingsPopup();
        setupTransactionSystem();
        startPageMonitoring();

        console.log('✅ Quotex Mod: All features activated successfully');
    }

    // -------------------- DEMO TO LIVE UI CONVERSION --------------------
    function convertDemoToLiveUI() {
        try {
            document.title = "Live trading | Quotex";
            const liveUrl = window.location.origin + "/en/trade";
            history.replaceState(null, '', liveUrl);

            const demoIndicators = document.querySelectorAll('[class*="demo"], [class*="Demo"]');
            demoIndicators.forEach(element => {
                if (element.textContent && (element.textContent.includes("Demo") || element.textContent.includes("demo"))) {
                    element.textContent = element.textContent.replace(/demo/gi, "Live");
                    element.style.color = "#0faf59";
                }
            });

            const accountNameElements = document.querySelectorAll('.---react-features-Usermenu-styles-module__infoName--SfrTV');
            accountNameElements.forEach(element => {
                if (element.textContent && (element.textContent.includes("Demo") || element.textContent.toLowerCase().includes("demo"))) {
                    element.textContent = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent) ? "Live" : "Live Account";
                    element.style.color = "#0faf59";
                    element.classList.remove("---react-features-Usermenu-styles-module__demo--TmWTp");
                }
            });

            console.log('✅ Demo page converted to Live UI');

        } catch (error) {
            console.error("UI conversion error:", error);
        }
    }

    // -------------------- BALANCE TRACKING --------------------
    function setupBalanceTracking() {
        const now = Date.now();
        let initialBalance = 0;
        const storedBalance = localStorage.getItem(CONFIG.STORAGE_KEYS.INITIAL_BALANCE);

        if (storedBalance) {
            try {
                const data = JSON.parse(storedBalance);
                if (now - data.timestamp < 86400000) {
                    initialBalance = parseFloat(data.balance);
                }
            } catch (e) {
                console.error("Balance parsing error:", e);
            }
        }

        function formatNumber(num) {
            const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
            return Math.abs(num).toLocaleString("en-US", options);
        }

        function updateProfitDisplay() {
            const currentBalanceElement = document.querySelector(".---react-features-Usermenu-styles-module__infoBalance--pVBHU");
            const profitElement = document.querySelector(".position__header-money.--green, .position__header-money.--red, .position__header-money");

            if (!currentBalanceElement || !profitElement) return;

            const currentBalanceText = currentBalanceElement.textContent || '';
            const currentBalance = parseFloat(currentBalanceText.replace(/[^0-9.-]/g, '')) || 0;
            const profitLoss = currentBalance - initialBalance;

            if (profitLoss === 0) {
                profitElement.innerText = "$0.00";
            } else if (profitLoss > 0) {
                profitElement.innerText = '$' + formatNumber(profitLoss);
                profitElement.style.color = "#0faf59";
            } else {
                profitElement.innerText = '-$' + formatNumber(profitLoss);
                profitElement.style.color = "#ff3e3e";
            }
        }

        // FIXED: Level icon display - Always show level icon for all account types
        function updateAccountDisplay() {
            const currentBalanceElement = document.querySelector(".---react-features-Usermenu-styles-module__infoBalance--pVBHU");
            if (!currentBalanceElement) return;

            const currentBalanceText = currentBalanceElement.textContent || '';
            const currentBalance = parseFloat(currentBalanceText.replace(/[^0-9.-]/g, '')) || 0;
            let accountLevel = "standart";

            if (currentBalance > 9999.99) {
                accountLevel = "vip";
            } else if (currentBalance > 4999.99) {
                accountLevel = "pro";
            }

            // FIXED: Always show level icon for standard accounts too
            const levelIcon1 = document.querySelector(".---react-features-Usermenu-styles-module__infoLevels--ePf8T svg use");
            const levelIcon2 = document.querySelector(".---react-features-Usermenu-Dropdown-styles-module__levelIcon--lmj_k svg use");
            const levelHref = "/profile/images/spritemap.svg#icon-profile-level-" + accountLevel;

            // Direct attribute setting
            if (levelIcon1) {
                levelIcon1.setAttribute("xlink:href", levelHref);
                const parentSvg = levelIcon1.closest('svg');
                if (parentSvg) {
                    parentSvg.style.display = 'block';
                    parentSvg.style.visibility = 'visible';
                }
            }

            if (levelIcon2) {
                levelIcon2.setAttribute("xlink:href", levelHref);
            }

            // Force create level container if it doesn't exist (especially for standard accounts)
            const userMenuInfo = document.querySelector(".---react-features-Usermenu-styles-module__info--xO2c5");
            if (userMenuInfo) {
                let levelContainer = document.querySelector(".---react-features-Usermenu-styles-module__infoLevels--ePf8T");
                if (!levelContainer) {
                    levelContainer = document.createElement("div");
                    levelContainer.className = "---react-features-Usermenu-styles-module__infoLevels--ePf8T";
                    levelContainer.innerHTML = `
                        <svg width="16" height="16">
                            <use xlink:href="${levelHref}"></use>
                        </svg>
                    `;
                    userMenuInfo.insertBefore(levelContainer, userMenuInfo.firstChild);
                } else {
                    // Update existing container
                    const useElement = levelContainer.querySelector('use');
                    if (useElement) {
                        useElement.setAttribute("xlink:href", levelHref);
                    }
                }

                // Force show the level container
                levelContainer.style.display = "flex";
                levelContainer.style.visibility = "visible";
                levelContainer.style.opacity = "1";
            }

            const accountNameElement = document.querySelector(".---react-features-Usermenu-styles-module__infoName--SfrTV.---react-features-Usermenu-styles-module__demo--TmWTp");
            if (accountNameElement) {
                accountNameElement.textContent = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent) ? "Live" : "Live Account";
                accountNameElement.style.color = "#0faf59";
                accountNameElement.classList.remove("---react-features-Usermenu-styles-module__demo--TmWTp");
            }

            const levelNameElement = document.querySelector(".---react-features-Usermenu-Dropdown-styles-module__levelName--wFviC");
            const levelProfitElement = document.querySelector(".---react-features-Usermenu-Dropdown-styles-module__levelProfit--UkDJi");

            if (levelNameElement && levelProfitElement) {
                if (accountLevel === "vip") {
                    levelNameElement.textContent = "vip:";
                    levelProfitElement.textContent = "+4% profit";
                } else if (accountLevel === "pro") {
                    levelNameElement.textContent = "pro:";
                    levelProfitElement.textContent = "+2% profit";
                } else {
                    levelNameElement.textContent = "standart:";
                    levelProfitElement.textContent = "+0% profit";
                }
            }
        }

        function updateAccountLevel() {
            updateAccountDisplay();
        }

        return {
            updateProfitDisplay,
            updateAccountDisplay,
            updateAccountLevel,
            setInitialBalance: (balance) => {
                initialBalance = parseFloat(balance) || 0;
                localStorage.setItem(CONFIG.STORAGE_KEYS.INITIAL_BALANCE, JSON.stringify({
                    balance: initialBalance,
                    timestamp: Date.now()
                }));
                updateProfitDisplay();
            },
            getInitialBalance: () => initialBalance,
            formatCurrency: formatNumber
        };
    }

    // -------------------- ACCOUNT SWITCHER --------------------
    function setupAccountSwitcher() {
        function switchToLiveAccount() {
            const menuItems = [...document.querySelectorAll('li')];
            if (!menuItems.length) return;

            const demoItem = menuItems.find(item => item.textContent && item.textContent.includes("Demo Account"));
            const liveItem = menuItems.find(item => item.textContent && item.textContent.includes("Live"));

            if (!demoItem || !liveItem) return;

            const demoBalance = demoItem.querySelector('b');
            const liveBalance = liveItem.querySelector('b');

            if (!demoBalance || !liveBalance) return;

            demoBalance.textContent = '$10000.00';

            const mainBalanceElement = document.querySelector(".---react-features-Usermenu-styles-module__infoBalance--pVBHU");
            let currentBalance = 0;

            if (mainBalanceElement && mainBalanceElement.textContent) {
                currentBalance = parseFloat(mainBalanceElement.textContent.replace(/[^0-9.-]/g, '')) || 0;
            }

            liveBalance.textContent = '$' + currentBalance.toFixed(2);

            const activeClass = "---react-features-Usermenu-Dropdown-styles-module__active--P5n2A";
            if (demoItem.classList.contains(activeClass)) {
                demoItem.classList.remove(activeClass);
            }

            if (!liveItem.classList.contains(activeClass)) {
                liveItem.classList.add(activeClass);
            }
        }

        return { updateAccountDisplay: switchToLiveAccount };
    }

    // -------------------- PROFIT CALCULATOR --------------------
    function setupProfitCalculator() {
        let lastProfitChange = null;
        let expandPercent = parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.EXPAND_PERCENT)) || 0;

        function updateExpandPercent() {
            const balanceElement = document.querySelector(".---react-features-Usermenu-styles-module__infoBalance--pVBHU");
            const balanceTracker = setupBalanceTracking();
            const initialBalance = balanceTracker.getInitialBalance();

            const currentBalance = balanceElement?.textContent ? parseFloat(balanceElement.textContent.replace(/[^0-9.-]/g, '')) : 0;
            const profitChange = currentBalance - initialBalance;

            if (profitChange !== lastProfitChange) {
                expandPercent = Math.floor(Math.random() * 91) + 10;
                lastProfitChange = profitChange;
                localStorage.setItem(CONFIG.STORAGE_KEYS.EXPAND_PERCENT, expandPercent.toString());
            }

            const expandBar = document.querySelector(".position__loading .position__expand");
            if (expandBar) {
                expandBar.style.width = expandPercent + '%';
            }
        }

        function updateSliderDisplay(percent) {
            const display = document.getElementById("sliderPercentDisplay");
            if (display) {
                display.textContent = percent + '%';
            }
        }

        return {
            updateProfitCalculation: updateExpandPercent,
            updateSliderDisplay,
            getExpandPercent: () => expandPercent,
            setExpandPercent: (percent) => {
                expandPercent = parseInt(percent) || 0;
                localStorage.setItem(CONFIG.STORAGE_KEYS.EXPAND_PERCENT, expandPercent.toString());
                updateSliderDisplay(expandPercent);

                const expandBar = document.querySelector(".position__loading .position__expand");
                if (expandBar) {
                    expandBar.style.width = expandPercent + '%';
                }
            }
        };
    }

    // -------------------- LEADERBOARD SYSTEM --------------------
    function setupLeaderboardSystem() {
        let currentPositionIndex = null;
        const originalItems = {};

        const positionData = [
            { profit: -10000, position: 60000 },
            { profit: 0, position: 58503 },
            { profit: 1, position: 3154 },
            { profit: 7902, position: 21 },
            { profit: 20000, position: 1 }
        ];

        function getCurrentUserData() {
            const header = document.querySelector(".position__header");
            if (!header) return null;

            const moneyElement = header.querySelector(".position__header-money");
            const profitText = moneyElement?.textContent || '0';
            const profit = parseFloat(profitText.replace(/[^0-9.-]+/g, '')) || 0;

            let userData = {};
            try {
                userData = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.LEADERBOARD_DATA)) || {};
            } catch (e) {
                console.error("Leaderboard data parsing error:", e);
            }

            return {
                name: userData.name || "You",
                profit: profit,
                flagCode: userData.flag || 'bd'
            };
        }

        function calculatePosition(profit) {
            const sortedData = [...positionData].sort((a, b) => a.profit - b.profit);

            if (profit <= sortedData[0].profit) {
                return sortedData[0].position;
            }

            if (profit >= sortedData[sortedData.length - 1].profit) {
                return sortedData[sortedData.length - 1].position;
            }

            for (let i = 0; i < sortedData.length - 1; i++) {
                const current = sortedData[i];
                const next = sortedData[i + 1];

                if (profit >= current.profit && profit <= next.profit) {
                    const ratio = (next.position - current.position) / (next.profit - current.profit);
                    return Math.round(ratio * (profit - current.profit) + current.position);
                }
            }

            return sortedData[0].position;
        }

        function updatePositionFooter(position) {
            const footer = document.querySelector(".position__footer");
            if (!footer) return;

            footer.innerHTML = `
                <span style="color: var(--color-black-50); font-weight: 500;">Your position:</span>
                <span style="font-weight: 700;">${position}</span>
            `;
        }

        function restoreItem(index) {
            const items = document.querySelectorAll(".leader-board__item");
            if (items[index] && originalItems[index]) {
                items[index].innerHTML = originalItems[index];
            }
        }

        function updateLeaderboardItem(userData) {
            const itemsContainer = document.querySelector(".leader-board__items");
            if (!itemsContainer) return;

            const items = Array.from(itemsContainer.querySelectorAll(".leader-board__item"));
            if (!items.length) return;

            let targetIndex = items.findIndex(item => {
                const money = item.querySelector(".leader-board__item-money");
                const itemProfit = money ? (parseFloat(money.textContent.replace(/[^0-9.-]+/g, '')) || 0) : 0;
                return itemProfit <= userData.profit;
            });

            if (targetIndex === -1) targetIndex = items.length - 1;

            if (currentPositionIndex !== targetIndex) {
                if (currentPositionIndex !== null) {
                    restoreItem(currentPositionIndex);
                }

                const targetItem = items[targetIndex];
                if (!originalItems[targetIndex]) {
                    originalItems[targetIndex] = targetItem.innerHTML;
                }

                const flagSvg = targetItem.querySelector(".leader-board__item-block svg.flag");
                const flagUse = flagSvg?.querySelector("use");
                if (flagSvg && flagUse && userData.flagCode) {
                    flagSvg.setAttribute("class", "flag flag-" + userData.flagCode);
                    try {
                        flagUse.setAttribute("xlink:href", "/profile/images/flags.svg#flag-" + userData.flagCode);
                    } catch (e) {}
                }

                const avatar = targetItem.querySelector(".leader-board__item-avatar");
                if (avatar) {
                    avatar.innerHTML = `
                        <svg class="icon-avatar-default">
                        <use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use>
                        </svg>
                    `;
                }

                const nameElement = targetItem.querySelector(".leader-board__item-name");
                if (nameElement) {
                    nameElement.textContent = userData.name;
                }

                const moneyElement = targetItem.querySelector(".leader-board__item-money");
                if (moneyElement) {
                    const balanceTracker = setupBalanceTracking();
                    moneyElement.textContent = '$' + balanceTracker.formatCurrency(userData.profit);
                    moneyElement.style.color = userData.profit < 0 ? "#fd4d3c" : "#0faf59";
                }

                currentPositionIndex = targetIndex;
                updatePositionFooter(targetIndex + 1);
            }
        }

        function updateLeaderboardPosition() {
            const userData = getCurrentUserData();
            if (!userData) {
                if (currentPositionIndex !== null) {
                    restoreItem(currentPositionIndex);
                    currentPositionIndex = null;
                }
                updatePositionFooter(calculatePosition(0));
                return;
            }

            const itemsContainer = document.querySelector(".leader-board__items");
            if (!itemsContainer) return;

            const items = Array.from(itemsContainer.querySelectorAll(".leader-board__item"));
            if (!items.length) return;

            const lastItem = items[items.length - 1];
            const lastMoneyElement = lastItem.querySelector(".leader-board__item-money");
            const lastProfitText = lastMoneyElement?.textContent || '0';
            const lastProfit = parseFloat(lastProfitText.replace(/[^0-9.-]+/g, '')) || 0;

            if (userData.profit >= lastProfit) {
                updateLeaderboardItem(userData);
            } else {
                updatePositionFooter(calculatePosition(userData.profit));
            }
        }

        function initLeaderboardObserver() {
            const itemsContainer = document.querySelector(".leader-board__items");
            if (!itemsContainer) {
                setTimeout(initLeaderboardObserver, 1000);
                return;
            }

            const observer = new MutationObserver(updateLeaderboardPosition);
            observer.observe(itemsContainer, {
                childList: true,
                subtree: true
            });

            updateLeaderboardPosition();
            setInterval(updateLeaderboardPosition, 2000);
        }

        setTimeout(initLeaderboardObserver, 2000);

        return {
            updateLeaderboard: updateLeaderboardPosition,
            setUserData: (name, flag) => {
                const userData = {
                    name: name || "You",
                    flag: flag || 'bd'
                };
                localStorage.setItem(CONFIG.STORAGE_KEYS.LEADERBOARD_DATA, JSON.stringify(userData));
                updateLeaderboardPosition();
            }
        };
    }

    // -------------------- SETTINGS POPUP --------------------
    function setupSettingsPopup() {
        function createSettingsPopup() {
            if (document.querySelector("#capitalBalancePopup")) return;

            const popup = document.createElement("div");
            popup.id = "capitalBalancePopup";
            popup.innerHTML = `
                <div style="font-weight:bold; font-size:18px; margin-bottom:14px; color:#222; text-align:center;">
                    👑 HACKER CAPTAIN BD
                    <div style="font-size:13px; margin-top:4px;">
                        by <a href="https://t.me/Engineer_captain" target="_blank" style="color:#0077cc; text-decoration:underline;">@Engineer_captain</a>
                    </div>
                </div>
                <label style="display:block; margin-bottom:6px;">👤 Leaderboard Name:</label>
                <input type="text" id="leaderboardNameInput" class="sl-input" placeholder="e.g. HACKER CAPTAIN" />
                <label style="display:block; margin:12px 0 6px;">🚩 Leaderboard Flag Code:</label>
                <input type="text" id="leaderboardFlagInput" class="sl-input" placeholder="e.g. bd" />
                <label style="display:block; margin:12px 0 6px;">🏆 Leaderboard Amount Show:</label>
                <input type="number" id="leaderboardInput" class="sl-input" placeholder="Enter leaderboard amount" />
                <label style="display:block; margin:12px 0 6px;">💯 Capital % Slider:</label>
                <div style="position: relative; width: 100%; margin-bottom: 6px;">
                    <input type="range" id="capitalPercentSlider" class="sl-input" min="0" max="100" step="1" value="0" style="width: 100%;" />
                    <div id="sliderPercentDisplay" style="
                        position: absolute;
                        top: -22px;
                        right: 10px;
                        font-weight: bold;
                        color: #0077cc;
                        background: rgba(0,0,0,0.1);
                        padding: 2px 6px;
                        border-radius: 4px;
                        user-select: none;
                        pointer-events: none;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        font-size: 14px;
                    ">0%</div>
                </div>
                <div style="display: flex; align-items: center; margin: 12px 0;">
                    <input type="checkbox" id="unlimitedMode" style="margin-right: 8px;" />
                    <label for="unlimitedMode" style="font-weight: bold; color: #28a745;">🎯 Unlimited Withdrawal Mode</label>
                </div>
                <div style="text-align:center; margin-top:20px;">
                    <button id="setCapitalBtn" class="sl-button">Set</button>
                    <button id="cancelCapitalBtn" class="sl-button sl-cancel">Cancel</button>
                </div>
            `;

            Object.assign(popup.style, {
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(12px)",
                color: "#111",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
                zIndex: "10000",
                width: "360px",
                fontFamily: "'Segoe UI', sans-serif",
                animation: "slFadeZoom 0.4s ease"
            });

            const styles = document.createElement("style");
            styles.textContent = `
                @keyframes slFadeZoom {
                    from { opacity: 0; transform: scale(0.8) translate(-50%, -50%); }
                    to { opacity: 1; transform: scale(1) translate(-50%, -50%); }
                }
                .sl-input {
                    width: 100%; padding: 12px; margin-bottom: 10px; border: 1px solid #ccc;
                    border-radius: 10px; background: #f9f9f9; color: #333; font-size: 15px;
                    outline: none; transition: all 0.3s;
                }
                .sl-input:focus {
                    border-color: #0077cc;
                    box-shadow: 0 0 5px rgba(0, 119, 204, 0.4);
                }
                .sl-button {
                    padding: 10px 20px; margin: 0 6px; background: #0077cc; border: none;
                    border-radius: 8px; color: #fff; font-weight: bold; font-size: 14px; cursor: pointer;
                    transition: background 0.3s;
                }
                .sl-button:hover { background: #005fa3; }
                .sl-button.sl-cancel { background: #888; }
                .sl-button.sl-cancel:hover { background: #666; }
            `;
            document.head.appendChild(styles);
            document.body.appendChild(popup);

            const popupSlider = document.getElementById("capitalPercentSlider");
            const popupDisplay = document.getElementById("sliderPercentDisplay");
            const unlimitedCheckbox = document.getElementById("unlimitedMode");
            const profitCalculator = setupProfitCalculator();

            // Load current settings
            const currentPercent = profitCalculator.getExpandPercent();
            popupSlider.value = currentPercent;
            popupDisplay.textContent = currentPercent + '%';

            const unlimitedMode = localStorage.getItem(CONFIG.STORAGE_KEYS.UNLIMITED_MODE) === 'true';
            unlimitedCheckbox.checked = unlimitedMode;

            popupSlider.oninput = function() {
                popupDisplay.textContent = this.value + '%';
                const expandBar = document.querySelector(".position__loading .position__expand");
                if (expandBar) {
                    expandBar.style.width = this.value + '%';
                }
            };

            document.getElementById("setCapitalBtn").onclick = function() {
                const leaderboardAmountInput = document.getElementById("leaderboardInput").value;
                const leaderboardName = document.getElementById("leaderboardNameInput").value.trim();
                const leaderboardFlag = document.getElementById("leaderboardFlagInput").value.trim().toLowerCase();
                const sliderValue = parseInt(popupSlider.value) || 0;
                const unlimitedMode = unlimitedCheckbox.checked;

                const currentBalanceElement = document.querySelector(".---react-features-Usermenu-styles-module__infoBalance--pVBHU");
                let currentBalance = 0;

                if (currentBalanceElement && currentBalanceElement.textContent) {
                    currentBalance = parseFloat(currentBalanceElement.textContent.replace(/[^0-9.-]/g, '')) || 0;
                }

                if (leaderboardAmountInput !== '') {
                    const leaderboardAmount = parseFloat(leaderboardAmountInput);
                    if (!isNaN(leaderboardAmount)) {
                        if (!unlimitedMode && leaderboardAmount > currentBalance) {
                            alert("Leaderboard amount exceeds current balance!");
                            return;
                        }
                        const newInitialBalance = currentBalance - leaderboardAmount;
                        const balanceTracker = setupBalanceTracking();
                        balanceTracker.setInitialBalance(newInitialBalance);
                    }
                }

                if (leaderboardName || leaderboardFlag) {
                    const leaderboardSystem = setupLeaderboardSystem();
                    leaderboardSystem.setUserData(leaderboardName, leaderboardFlag);

                    const positionHeader = document.querySelector(".position__header-name");
                    if (positionHeader && leaderboardName && leaderboardFlag) {
                        positionHeader.innerHTML = `
                            <svg class="flag-${leaderboardFlag}">
                            <use xlink:href="/profile/images/flags.svg#flag-${leaderboardFlag}"></use>
                            </svg>
                            ${leaderboardName}
                        `;
                    }
                }

                // Save unlimited mode
                localStorage.setItem(CONFIG.STORAGE_KEYS.UNLIMITED_MODE, unlimitedMode.toString());

                profitCalculator.setExpandPercent(sliderValue);
                popup.remove();
                styles.remove();
                console.log('Settings applied successfully - Unlimited Mode:', unlimitedMode);
            };

            document.getElementById("cancelCapitalBtn").onclick = function() {
                popup.remove();
                styles.remove();
            };
        }

        function interceptDeposits() {
            const elements = document.querySelectorAll("a,button");
            elements.forEach(el => {
                if (el._intercepted) return;
                if ((el.href && el.href.includes("/deposit")) || (el.textContent && el.textContent.trim().toLowerCase() === "deposit")) {
                    el._intercepted = true;
                    el.addEventListener("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const transactionSystem = getTransactionSystem();
                        if (transactionSystem) {
                            transactionSystem.showMainMenu();
                        }
                        return false;
                    }, true);
                }
            });
        }

        function getTransactionSystem() {
            if (window.customTransactionManager) {
                return window.customTransactionManager;
            }
            return null;
        }

        const interceptObserver = new MutationObserver(interceptDeposits);
        interceptObserver.observe(document.body, { childList: true, subtree: true });

        if (document.readyState === "complete" || document.readyState === "interactive") {
            interceptDeposits();
        } else {
            document.addEventListener("DOMContentLoaded", interceptDeposits);
        }

        document.addEventListener("keydown", function(event) {
            if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 's') {
                event.preventDefault();
                createSettingsPopup();
            }
        });

        return { createSettingsPopup };
    }

    // -------------------- TRANSACTION SYSTEM --------------------
    function setupTransactionSystem() {
        class TransactionManager {
            constructor() {
                this.transactions = [];
                this.currentBalance = CONFIG.DEFAULT_BALANCE;
                this.init();
            }

            init() {
                this.loadTransactions();
                this.loadBalance();
                this.injectStyles();
                this.overrideDepositButtons();
                this.handlePageSpecificContent();
                this.setupPageMonitoring();
                window.customTransactionManager = this;
                console.log('✅ Custom Transaction System Loaded');
            }

            loadTransactions() {
                try {
                    const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.TRANSACTIONS);
                    if (stored) {
                        this.transactions = JSON.parse(stored);
                        this.transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    }
                } catch (e) {
                    console.error('Error loading transactions:', e);
                    this.transactions = [];
                }
            }

            loadBalance() {
                try {
                    const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.BALANCE);
                    if (stored) {
                        this.currentBalance = parseFloat(stored) || CONFIG.DEFAULT_BALANCE;
                    }
                } catch (e) {
                    console.error('Error loading balance:', e);
                    this.currentBalance = CONFIG.DEFAULT_BALANCE;
                }
            }

            saveTransactions() {
                this.transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                localStorage.setItem(CONFIG.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.transactions));
            }

            saveBalance() {
                localStorage.setItem(CONFIG.STORAGE_KEYS.BALANCE, this.currentBalance.toString());
            }

            isUnlimitedMode() {
                return localStorage.getItem(CONFIG.STORAGE_KEYS.UNLIMITED_MODE) === 'true';
            }

            injectStyles() {
                if (document.getElementById('custom-transaction-styles')) return;

                const styles = document.createElement('style');
                styles.id = 'custom-transaction-styles';
                styles.textContent = `
                    .custom-transaction-popup {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0,0,0,0.6);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 10000;
                        font-family: 'Segoe UI', sans-serif;
                    }
                    .custom-popup-content {
                        background: white;
                        border-radius: 12px;
                        width: 90%;
                        max-width: 400px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                        animation: customSlideIn 0.3s ease;
                    }
                    @keyframes customSlideIn {
                        from { transform: translateY(-20px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    .custom-popup-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 16px 20px;
                        border-bottom: 1px solid #eee;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border-radius: 12px 12px 0 0;
                    }
                    .custom-popup-header h3 {
                        margin: 0;
                        font-size: 18px;
                    }
                    .custom-close-btn {
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: white;
                    }
                    .custom-popup-body {
                        padding: 20px;
                    }
                    .custom-btn-group {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        gap: 10px;
                        margin-bottom: 20px;
                    }
                    .custom-btn {
                        padding: 12px;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: all 0.3s;
                        text-align: center;
                        font-size: 14px;
                    }
                    .custom-btn-deposit {
                        background: linear-gradient(45deg, #28a745, #20c997);
                        color: white;
                    }
                    .custom-btn-withdraw {
                        background: linear-gradient(45deg, #dc3545, #e83e8c);
                        color: white;
                    }
                    .custom-btn-leaderboard {
                        background: linear-gradient(45deg, #0077cc, #005fa3);
                        color: white;
                    }
                    .custom-btn-success {
                        background: #28a745;
                        color: white;
                    }
                    .custom-btn:hover {
                        opacity: 0.9;
                        transform: translateY(-1px);
                    }
                    .custom-form-section {
                        margin-bottom: 20px;
                    }
                    .custom-form-section h4 {
                        margin: 0 0 15px 0;
                        color: #333;
                        text-align: center;
                    }
                    .custom-input-group {
                        margin-bottom: 15px;
                    }
                    .custom-input-group label {
                        display: block;
                        margin-bottom: 5px;
                        font-weight: 600;
                        color: #555;
                    }
                    .custom-input, .custom-select {
                        width: 100%;
                        padding: 12px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        font-size: 14px;
                        box-sizing: border-box;
                    }
                    .custom-status-success { color: #28a745; }
                    .custom-status-pending { color: #e74c3c; font-weight: bold; }
                    .custom-status-failed { color: #dc3545; }
                    .custom-message {
                        padding: 12px;
                        border-radius: 6px;
                        margin-bottom: 15px;
                        text-align: center;
                        font-weight: 500;
                    }
                    .custom-message-success {
                        background: #d4edda;
                        color: #155724;
                        border: 1px solid #c3e6cb;
                    }
                    .custom-message-error {
                        background: #f8d7da;
                        color: #721c24;
                        border: 1px solid #f5c6cb;
                    }
                    .custom-message-info {
                        background: #d1ecf1;
                        color: #0c5460;
                        border: 1px solid #bee5eb;
                    }
                    .custom-binance-success {
                        text-align: center;
                        padding: 20px;
                        background: #f8fff9;
                        border-radius: 8px;
                        border: 1px solid #28a745;
                    }
                    .custom-binance-id {
                        background: #f1f3f4;
                        padding: 8px 12px;
                        border-radius: 4px;
                        font-family: monospace;
                        margin: 10px 0;
                    }
                    .custom-transaction-row {
                        display: flex;
                        align-items: center;
                        padding: 12px 0;
                        border-bottom: 1px solid #e1e5e9;
                        font-size: 14px;
                    }
                    .custom-transaction-row:last-child {
                        border-bottom: none;
                    }
                    .custom-transaction-order {
                        flex: 1;
                        font-weight: bold;
                        color: #333;
                    }
                    .custom-transaction-date {
                        flex: 1;
                        color: #666;
                    }
                    .custom-transaction-status {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }
                    .custom-transaction-type {
                        flex: 1;
                        text-transform: capitalize;
                    }
                    .custom-transaction-method {
                        flex: 1;
                        color: #666;
                    }
                    .custom-transaction-amount {
                        flex: 1;
                        font-weight: bold;
                        text-align: right;
                    }
                    .custom-transaction-amount.deposit {
                        color: #28a745 !important;
                    }
                    .custom-transaction-amount.withdraw {
                        color: #e74c3c !important;
                    }
                    .custom-transaction-amount.withdraw-success {
                        color: #e74c3c !important;
                        font-weight: 800;
                    }
                    .custom-transaction-amount.withdraw-pending {
                        color: #e74c3c !important;
                        font-weight: 800;
                    }
                    .custom-balance-display {
                        padding: 10px 15px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        text-align: center;
                        font-weight: bold;
                    }
                    .custom-balance-amount {
                        font-size: 24px;
                        margin: 5px 0;
                    }
                    .custom-status-pending-red {
                        color: #e74c3c;
                        font-weight: bold;
                    }
                    
                    .custom-withdraw-success-status {
                        color: #e74c3c !important;
                        font-weight: bold;
                    }
                    .custom-withdraw-amount-red {
                        color: #e74c3c !important;
                        font-weight: 800;
                    }
                    
                    .custom-withdrawal-section {
                        margin: 20px 0;
                        padding: 15px;
                        background: #f8f9fa;
                        border-radius: 8px;
                        border: 1px solid #e1e5e9;
                    }
                    .custom-withdrawal-section h4 {
                        margin: 0 0 15px 0;
                        color: #333;
                        font-size: 16px;
                    }

                    /* REALISTIC WITHDRAWAL PENDING STYLES */
                    .realistic-withdrawal-pending {
                        background: #ffffff;
                        border-radius: 12px;
                        padding: 20px;
                        margin: 15px 0;
                        border: 1px solid #e1e5e9;
                        font-family: 'Segoe UI', sans-serif;
                    }
                    .withdrawal-header {
                        font-size: 18px;
                        font-weight: 700;
                        color: #1a1a1a;
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    .withdrawal-order-info {
                        background: #f8f9fa;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        border-left: 4px solid #0077cc;
                    }
                    .order-number {
                        font-weight: 700;
                        color: #1a1a1a;
                        font-size: 16px;
                    }
                    .order-date {
                        color: #666;
                        font-size: 14px;
                        margin-top: 5px;
                    }
                    .withdrawal-status {
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        border-radius: 8px;
                        padding: 15px;
                        margin-bottom: 15px;
                        text-align: center;
                    }
                    .status-title {
                        font-weight: 700;
                        color: #856404;
                        font-size: 16px;
                        margin-bottom: 8px;
                    }
                    .status-description {
                        color: #666;
                        font-size: 14px;
                        line-height: 1.4;
                    }
                    .withdrawal-details {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                        margin-bottom: 15px;
                    }
                    .detail-item {
                        padding: 12px;
                        background: #f8f9fa;
                        border-radius: 6px;
                        text-align: center;
                    }
                    .detail-label {
                        font-size: 12px;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .detail-value {
                        font-weight: 700;
                        color: #1a1a1a;
                        font-size: 14px;
                    }
                    .withdrawal-amount {
                        color: #e74c3c !important;
                        font-weight: 800;
                    }
                    .cancel-button {
                        width: 100%;
                        padding: 12px;
                        background: #6c757d;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background 0.3s;
                    }
                    .cancel-button:hover {
                        background: #5a6268;
                    }

                    /* FIXED: Transaction page colors - Deposit GREEN, Withdraw RED */
                    .---react-ui-TransactionsScreenItem-styles-module__transactions-item__amount--v9Gal.---react-ui-TransactionsScreenItem-styles-module__green--jGuz_ {
                        color: #28a745 !important;
                        font-weight: 800 !important;
                    }
                    
                    .---react-ui-TransactionsScreenItem-styles-module__transactions-item__amount--v9Gal.---react-ui-TransactionsScreenItem-styles-module__red--jGuz_ {
                        color: #e74c3c !important;
                        font-weight: 800 !important;
                    }
                    
                    /* Target specific transaction elements */
                    b[class*="amount"]:contains("+"),
                    [class*="amount"]:contains("+$") {
                        color: #28a745 !important;
                        font-weight: 800 !important;
                    }
                    
                    b[class*="amount"]:contains("-"),
                    [class*="amount"]:contains("-$") {
                        color: #e74c3c !important;
                        font-weight: 800 !important;
                    }

                    .---react-ui-TransactionsScreenItem-styles-module__green--jGuz_ {
                        color: #28a745 !important;
                    }

                    .---react-ui-TransactionsScreenItem-styles-module__red--jGuz_ {
                        color: #e74c3c !important;
                    }

                    /* FIXED: Level icon styles - Always show level icon */
                    .---react-features-Usermenu-styles-module__infoLevels--ePf8T {
                        display: flex !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }
                    
                    .---react-features-Usermenu-styles-module__infoLevels--ePf8T svg {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }
                    
                    /* Force level icon to show even if Quotex hides it */
                    .---react-features-Usermenu-styles-module__info--xO2c5 > div:first-child {
                        display: flex !important;
                        visibility: visible !important;
                    }

                    /* Unlimited mode indicator */
                    .unlimited-mode-badge {
                        background: linear-gradient(45deg, #28a745, #20c997);
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 10px;
                        font-weight: bold;
                        margin-left: 5px;
                    }
                `;
                document.head.appendChild(styles);
            }

            overrideDepositButtons() {
                const overrideButton = (button) => {
                    if (!button._customHandler) {
                        button._customHandler = true;
                        button.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            this.showMainMenu();
                        });
                    }
                };

                const findAndOverride = () => {
                    document.querySelectorAll('a, button').forEach(button => {
                        const text = button.textContent?.toLowerCase();
                        const href = button.href?.toLowerCase();

                        if (text && text.includes('deposit') || (href && href.includes('deposit'))) {
                            overrideButton(button);
                        }
                    });
                };

                findAndOverride();

                const observer = new MutationObserver(findAndOverride);
                observer.observe(document.body, { childList: true, subtree: true });
            }

            showMainMenu() {
                if (document.getElementById('customTransactionPopup')) return;

                const unlimitedMode = this.isUnlimitedMode();
                const popup = document.createElement('div');
                popup.id = 'customTransactionPopup';
                popup.className = 'custom-transaction-popup';
                popup.innerHTML = `
                    <div class="custom-popup-content">
                        <div class="custom-popup-header">
                            <h3>💰 Transaction Manager ${unlimitedMode ? '<span class="unlimited-mode-badge">UNLIMITED</span>' : ''}</h3>
                            <button class="custom-close-btn">&times;</button>
                        </div>
                        <div class="custom-popup-body">
                            <div class="custom-balance-display">
                                <div>Current Balance</div>
                                <div class="custom-balance-amount">$${this.currentBalance.toFixed(2)}</div>
                                ${unlimitedMode ? '<div style="font-size: 12px; margin-top: 5px;">🎯 Unlimited Withdrawal Mode Active</div>' : ''}
                            </div>
                            <div class="custom-btn-group">
                                <button class="custom-btn custom-btn-deposit" id="customDepositBtn">
                                    💳 Deposit
                                </button>
                                <button class="custom-btn custom-btn-withdraw" id="customWithdrawBtn">
                                    🏧 Withdraw
                                </button>
                                <button class="custom-btn custom-btn-leaderboard" id="customLeaderboardBtn">
                                    🏆 Leaderboard
                                </button>
                            </div>
                            <div id="customTransactionContent"></div>
                        </div>
                    </div>
                `;

                document.body.appendChild(popup);
                this.setupMenuHandlers();
            }

            setupMenuHandlers() {
                document.getElementById('customDepositBtn').onclick = () => this.showDepositFlow();
                document.getElementById('customWithdrawBtn').onclick = () => this.showWithdrawFlow();
                document.getElementById('customLeaderboardBtn').onclick = () => this.showLeaderboardSettings();
                document.querySelector('.custom-close-btn').onclick = () => this.closePopup();

                document.getElementById('customTransactionPopup').onclick = (e) => {
                    if (e.target.id === 'customTransactionPopup') {
                        this.closePopup();
                    }
                };
            }

            showDepositFlow() {
                const content = document.getElementById('customTransactionContent');
                content.innerHTML = `
                    <div class="custom-form-section">
                        <h4>💳 Deposit Funds</h4>
                        <div class="custom-input-group">
                            <label>Amount ($):</label>
                            <input type="number" id="customDepositAmount" class="custom-input" 
                                   placeholder="Enter amount" min="1" step="0.01" value="10.00">
                        </div>
                        <div class="custom-input-group">
                            <label>Payment Method:</label>
                            <select id="customDepositMethod" class="custom-select">
                                <option value="Binance Pay">Binance Pay</option>
                                <option value="Credit Card">Credit/Debit Card</option>
                                <option value="Crypto">Cryptocurrency</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>
                        <div class="custom-input-group">
                            <label>Transaction Status:</label>
                            <select id="customDepositStatus" class="custom-select">
                                <option value="success">Successed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <button class="custom-btn custom-btn-success" id="customProcessDeposit" 
                                style="width: 100%; margin-top: 10px;">
                            Process Deposit
                        </button>
                    </div>
                `;

                document.getElementById('customProcessDeposit').onclick = () => this.processDeposit();
            }

            showWithdrawFlow() {
                const unlimitedMode = this.isUnlimitedMode();
                const maxAmount = unlimitedMode ? 999999.99 : this.currentBalance;

                const content = document.getElementById('customTransactionContent');
                content.innerHTML = `
                    <div class="custom-form-section">
                        <h4>🏧 Withdraw Funds ${unlimitedMode ? '🎯' : ''}</h4>
                        ${unlimitedMode ? '<div class="custom-message custom-message-success">Unlimited Mode: You can withdraw any amount!</div>' : ''}
                        <div class="custom-input-group">
                            <label>Binance User ID:</label>
                            <input type="text" id="customWithdrawUserId" class="custom-input" 
                                   value="${this.generateBinanceId()}" readonly>
                            <small style="color: #666; font-size: 12px;">Your verified Binance ID</small>
                        </div>
                        <div class="custom-input-group">
                            <label>Amount ($):</label>
                            <input type="number" id="customWithdrawAmount" class="custom-input" 
                                   placeholder="Enter amount" min="1" step="0.01" max="${maxAmount}">
                            <small style="color: #666; font-size: 12px;">Available: $${this.currentBalance.toFixed(2)} ${unlimitedMode ? '(Unlimited)' : ''}</small>
                        </div>
                        <div class="custom-input-group">
                            <label>Withdrawal Status:</label>
                            <select id="customWithdrawStatus" class="custom-select">
                                <option value="success">Successed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <button class="custom-btn custom-btn-success" id="customProcessWithdraw" 
                                style="width: 100%; margin-top: 10px;">
                            Process Withdrawal
                        </button>
                    </div>
                `;

                document.getElementById('customProcessWithdraw').onclick = () => this.processWithdraw();
            }

            // FIXED: Generate 8-digit Binance ID
            generateBinanceId() {
                return Math.floor(10000000 + Math.random() * 90000000).toString();
            }

            showLeaderboardSettings() {
                const settingsPopup = setupSettingsPopup();
                this.closePopup();
                settingsPopup.createSettingsPopup();
            }

            processDeposit() {
                const amount = parseFloat(document.getElementById('customDepositAmount').value);
                const method = document.getElementById('customDepositMethod').value;
                const status = document.getElementById('customDepositStatus').value;

                if (!amount || amount <= 0) {
                    this.showMessage('Please enter a valid amount', 'error');
                    return;
                }

                const transaction = {
                    id: Date.now().toString(),
                    type: 'deposit',
                    amount: amount,
                    method: method,
                    status: status,
                    timestamp: new Date().toISOString(),
                    binanceId: this.generateBinanceId(),
                    displayAmount: `+$${amount.toFixed(2)}`
                };

                if (status === 'success') {
                    this.currentBalance += amount;
                    this.saveBalance();
                    this.showBinanceSuccess(amount);
                } else if (status === 'pending') {
                    this.showMessage(`Deposit of $${amount.toFixed(2)} is pending...`, 'info');
                } else {
                    this.showMessage(`Deposit of $${amount.toFixed(2)} failed!`, 'error');
                }

                this.transactions.unshift(transaction);
                this.saveTransactions();
                this.updatePageContent();
                this.updatePopupBalance();
            }

            processWithdraw() {
                const userId = document.getElementById('customWithdrawUserId').value;
                const amount = parseFloat(document.getElementById('customWithdrawAmount').value);
                const status = document.getElementById('customWithdrawStatus').value;

                if (!amount || amount <= 0) {
                    this.showMessage('Please enter a valid amount', 'error');
                    return;
                }

                const unlimitedMode = this.isUnlimitedMode();

                if (!unlimitedMode && amount > this.currentBalance) {
                    this.showMessage('Insufficient balance for withdrawal', 'error');
                    return;
                }

                const transaction = {
                    id: Date.now().toString(),
                    type: 'withdraw',
                    amount: amount,
                    userId: userId,
                    status: status,
                    timestamp: new Date().toISOString(),
                    binanceId: this.generateBinanceId(),
                    displayAmount: `-$${amount.toFixed(2)}`,
                    method: 'Binance Pay'
                };

                if (status === 'success') {
                    if (!unlimitedMode) {
                        this.currentBalance -= amount;
                    }
                    this.saveBalance();
                    this.showBinanceWithdrawSuccess(amount, userId);
                } else if (status === 'pending') {
                    // Show realistic pending withdrawal UI
                    this.showRealisticPendingWithdrawal(amount, transaction.binanceId);
                } else {
                    this.showMessage(`Withdrawal of $${amount.toFixed(2)} failed!`, 'error');
                }

                this.transactions.unshift(transaction);
                this.saveTransactions();
                this.updatePageContent();
                this.updatePopupBalance();
            }

            showRealisticPendingWithdrawal(amount, orderId) {
                const content = document.getElementById('customTransactionContent');
                const transactionDate = new Date().toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });

                const pendingHTML = `
                    <div class="realistic-withdrawal-pending">
                        <div class="withdrawal-header">Transactions</div>
                        
                        <div class="withdrawal-order-info">
                            <div class="order-number">${orderId}</div>
                            <div class="order-date">${transactionDate}</div>
                        </div>
                        
                        <div class="withdrawal-status">
                            <div class="status-title">Waiting confirmation</div>
                            <div class="status-description">
                                The withdrawal is currently being processed on the side of the financial operator. 
                                Please wait - the funds should be received within 48 hours.
                            </div>
                        </div>
                        
                        <div class="withdrawal-details">
                            <div class="detail-item">
                                <div class="detail-label">Amount</div>
                                <div class="detail-value withdrawal-amount">-${amount.toFixed(2)}$</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Method</div>
                                <div class="detail-value">Binance Pay</div>
                            </div>
                        </div>
                        
                        <div class="withdrawal-details">
                            <div class="detail-item">
                                <div class="detail-label">Type</div>
                                <div class="detail-value">Payout</div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Status</div>
                                <div class="detail-value" style="color: #e74c3c; font-weight: bold;">Pending</div>
                            </div>
                        </div>
                        
                        <button class="cancel-button">Cancel</button>
                    </div>
                `;

                content.innerHTML = pendingHTML;

                // Add cancel button functionality
                const cancelBtn = content.querySelector('.cancel-button');
                cancelBtn.onclick = () => {
                    this.showMessage('Withdrawal cancellation requested', 'info');
                    setTimeout(() => {
                        this.showWithdrawFlow();
                    }, 2000);
                };
            }

            showBinanceSuccess(amount) {
                const content = document.getElementById('customTransactionContent');
                const successHTML = `
                    <div class="custom-binance-success">
                        <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                        <div style="font-weight: bold; color: #28a745; margin-bottom: 10px;">
                            Binance Pay Deposit Successful!
                        </div>
                        <div class="custom-binance-id">
                            Transaction ID: ${this.generateBinanceId()}
                        </div>
                        <div style="color: #28a745; font-weight: bold; font-size: 24px; margin: 10px 0;">
                            +$${amount.toFixed(2)}
                        </div>
                        <div style="color: #666; font-size: 14px;">
                            Funds have been added to your trading account
                        </div>
                    </div>
                `;

                content.innerHTML = successHTML;
            }

            showBinanceWithdrawSuccess(amount, userId) {
                const content = document.getElementById('customTransactionContent');
                const successHTML = `
                    <div class="custom-binance-success">
                        <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
                        <div style="font-weight: bold; color: #28a745; margin-bottom: 10px;">
                            Binance Pay Withdrawal Successful!
                        </div>
                        <div class="custom-binance-id">
                            Sent to User ID: ${userId}
                        </div>
                        <div style="color: #e74c3c; font-weight: bold; font-size: 24px; margin: 10px 0;">
                            -$${amount.toFixed(2)}
                        </div>
                        <div style="color: #666; font-size: 14px;">
                            Funds have been sent to your Binance account
                        </div>
                    </div>
                `;

                content.innerHTML = successHTML;
            }

            updatePopupBalance() {
                const balanceDisplay = document.querySelector('.custom-balance-amount');
                if (balanceDisplay) {
                    balanceDisplay.textContent = `$${this.currentBalance.toFixed(2)}`;
                }
            }

            showMessage(message, type = 'info') {
                const messageDiv = document.createElement('div');
                messageDiv.className = `custom-message custom-message-${type}`;
                messageDiv.innerHTML = message;

                const content = document.getElementById('customTransactionContent');
                content.insertBefore(messageDiv, content.firstChild);

                setTimeout(() => {
                    if (messageDiv.parentNode) {
                        messageDiv.parentNode.removeChild(messageDiv);
                    }
                }, 5000);
            }

            closePopup() {
                const popup = document.getElementById('customTransactionPopup');
                if (popup) {
                    popup.remove();
                }
            }

            // FIXED: Proper color coding for transaction amounts
            forceCorrectColorsForTransactions() {
                const transactionAmounts = document.querySelectorAll('b, [class*="amount"], .---react-ui-TransactionsScreenItem-styles-module__transactions-item__amount--v9Gal');

                transactionAmounts.forEach(element => {
                    const text = element.textContent || '';
                    if (text.includes('+') || text.includes('+$')) {
                        // Deposit - GREEN
                        element.style.color = '#28a745';
                        element.style.fontWeight = '800';
                    } else if (text.includes('-') || text.includes('-$')) {
                        // Withdraw - RED
                        element.style.color = '#e74c3c';
                        element.style.fontWeight = '800';
                    }
                });

                // Also fix status text from "Success" to "Successed"
                const statusElements = document.querySelectorAll('[class*="status"], [class*="Status"]');
                statusElements.forEach(element => {
                    if (element.textContent === 'Success') {
                        element.textContent = 'Successed';
                    }
                });
            }

            handlePageSpecificContent() {
                const currentPath = window.location.pathname;

                if (currentPath.includes('/withdrawal') || currentPath.includes('/transactions')) {
                    setTimeout(() => {
                        this.injectWithdrawalContent();
                        this.forceCorrectColorsForTransactions();
                    }, 1000);
                } else if (currentPath.includes('/balance')) {
                    setTimeout(() => this.injectTransactionsContent(), 1000);
                }
            }

            injectWithdrawalContent() {
                const container = document.querySelector('.transactions-list__header');
                if (container && !document.querySelector('.custom-withdrawal-section')) {
                    this.createWithdrawalSection();
                }
            }

            createWithdrawalSection() {
                const existingSection = document.querySelector('.custom-withdrawal-section');
                if (existingSection) existingSection.remove();

                const transactionsList = document.querySelector('.transactions-list__header');
                if (!transactionsList) return;

                const section = document.createElement('div');
                section.className = 'custom-withdrawal-section';

                // FIXED: Show transactions in correct order (newest first)
                const withdrawals = this.transactions
                    .filter(t => t.type === 'withdraw')
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                if (withdrawals.length === 0) {
                    section.innerHTML = `
                        <div style="padding: 20px; text-align: center; color: #666;">
                            No withdrawal transactions yet
                        </div>
                    `;
                } else {
                    section.innerHTML = `
                        <div style="margin: 10px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                            <h4 style="margin: 0 0 15px 0; color: #333;">Custom Withdrawals</h4>
                            ${withdrawals.slice(0, 5).map(transaction => {
                                const amountClass = 'custom-transaction-amount withdraw-success custom-withdraw-amount-red';
                                const statusText = transaction.status === 'success' ? 'Successed' : 
                                                transaction.status === 'pending' ? 'Pending' : 'Failed';
                                const statusClass = transaction.status === 'success' || transaction.status === 'pending' ? 
                                    'custom-withdraw-success-status' : 'custom-status-failed';

                                return `
                                <div class="custom-transaction-row">
                                    <div class="custom-transaction-order">${transaction.binanceId}</div>
                                    <div class="custom-transaction-date">${new Date(transaction.timestamp).toLocaleDateString()}</div>
                                    <div class="custom-transaction-status">
                                        <span class="${statusClass}">${statusText}</span>
                                    </div>
                                    <div class="custom-transaction-type">Withdrawal</div>
                                    <div class="custom-transaction-method">${transaction.method || 'Binance Pay'}</div>
                                    <div class="${amountClass}">${transaction.displayAmount}</div>
                                </div>
                            `}).join('')}
                        </div>
                    `;
                }

                transactionsList.parentNode.insertBefore(section, transactionsList.nextSibling);
            }

            injectTransactionsContent() {
                const container = document.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item--imQKR');
                if (container && !document.querySelector('.custom-transactions-section')) {
                    this.createTransactionsSection();
                }
            }

            createTransactionsSection() {
                const existingSection = document.querySelector('.custom-transactions-section');
                if (existingSection) existingSection.remove();

                const existingTransaction = document.querySelector('.---react-ui-TransactionsScreenItem-styles-module__transactions-item--imQKR');
                if (!existingTransaction) return;

                const section = document.createElement('div');
                section.className = 'custom-transactions-section';

                // FIXED: Show latest transactions first
                const latestTransactions = this.transactions.slice(0, 10);

                if (latestTransactions.length === 0) {
                    section.innerHTML = `
                        <div style="padding: 20px; text-align: center; color: #666;">
                            No custom transactions yet
                        </div>
                    `;
                } else {
                    section.innerHTML = latestTransactions.map(transaction => {
                        const amountClass = transaction.type === 'deposit' ? 'green' : 'red';
                        const statusText = transaction.status === 'success' ? 'Successed' : 
                                        transaction.status === 'pending' ? 'Pending' : 'Failed';
                        const statusClass = transaction.status === 'success' ? 'success' : 
                                          transaction.status === 'pending' ? 'pending' : 'failed';

                        return `
                        <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item--imQKR">
                            <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__id--Ttk2j">${transaction.binanceId}</div>
                            <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__date--n6Gnu">${new Date(transaction.timestamp).toLocaleString()}</div>
                            <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status--iqTzO">
                                <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-block--srWT8">
                                    <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-icon--iGg0J ---react-ui-TransactionsScreenItem-styles-module__${statusClass}--ZBMVh">
                                        <svg class="icon-check-tiny">
                                            <use xlink:href="/profile/images/spritemap.svg#icon-check-tiny"></use>
                                        </svg>
                                    </div>
                                    <span class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__status-text--JmjRX ---react-ui-TransactionsScreenItem-styles-module__check-tiny--sfm6I">
                                        ${statusText}
                                    </span>
                                </div>
                            </div>
                            <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__type--yRiVa">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</div>
                            <div class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__method--oY8r8">${transaction.method || 'Binance Pay'}</div>
                            <b class="---react-ui-TransactionsScreenItem-styles-module__transactions-item__amount--v9Gal ---react-ui-TransactionsScreenItem-styles-module__${amountClass}--jGuz_">
                                ${transaction.displayAmount}
                            </b>
                        </div>
                    `}).join('');
                }

                existingTransaction.parentNode.insertBefore(section, existingTransaction.nextSibling);
            }

            updatePageContent() {
                this.createWithdrawalSection();
                this.createTransactionsSection();
                this.forceCorrectColorsForTransactions();
            }

            setupPageMonitoring() {
                let lastUrl = window.location.href;

                const observer = new MutationObserver(() => {
                    if (window.location.href !== lastUrl) {
                        lastUrl = window.location.href;
                        setTimeout(() => {
                            this.handlePageSpecificContent();
                            this.forceCorrectColorsForTransactions();
                        }, 1000);
                    }
                });

                observer.observe(document, { subtree: true, childList: true });

                const domObserver = new MutationObserver(() => {
                    this.handlePageSpecificContent();
                    this.forceCorrectColorsForTransactions();
                });

                domObserver.observe(document.body, { childList: true, subtree: true });

                setTimeout(() => {
                    this.forceCorrectColorsForTransactions();
                }, 2000);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => new TransactionManager());
        } else {
            new TransactionManager();
        }
    }

    // -------------------- PAGE MONITORING --------------------
    function startPageMonitoring() {
        const balanceTracker = setupBalanceTracking();
        const accountSwitcher = setupAccountSwitcher();
        const profitCalculator = setupProfitCalculator();

        let debounceTimer = null;

        function debounceUpdates() {
            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                try {
                    balanceTracker.updateAccountDisplay();
                    accountSwitcher.updateAccountDisplay();
                    balanceTracker.updateProfitDisplay();
                    balanceTracker.updateAccountLevel();
                    profitCalculator.updateProfitCalculation();
                } catch (error) {
                    console.error('Display update error:', error);
                }
            }, 120);
        }

        const pageObserver = new MutationObserver(debounceUpdates);
        pageObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        window.addEventListener("load", () => {
            setTimeout(() => {
                balanceTracker.updateAccountDisplay();
                accountSwitcher.updateAccountDisplay();
                balanceTracker.updateProfitDisplay();
                balanceTracker.updateAccountLevel();
            }, 800);
        });

        setInterval(() => {
            balanceTracker.updateAccountDisplay();
            accountSwitcher.updateAccountDisplay();
            balanceTracker.updateProfitDisplay();
            balanceTracker.updateAccountLevel();
            profitCalculator.updateProfitCalculation();
        }, 3000);
    }

    // -------------------- INITIALIZE ALL SYSTEMS --------------------
    function initializeAllSystems() {
        console.log('🚀 Initializing All Systems...');
        initializeMod();
        console.log('✅ All Systems Activated Successfully');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAllSystems);
    } else {
        initializeAllSystems();
    }

})();