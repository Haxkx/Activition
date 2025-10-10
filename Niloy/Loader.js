(function() {
    'use strict';

    // --- QX NILOY V1.8.9 (market-qx.trade-fixed) ---
    // This is a self-executing anonymous function that modifies the UI of the market-qx.trade website,
    // particularly for demo trading, leaderboard manipulation, and balance spoofing.

    // Configuration
    const CONFIG = {
        // Decoded storage keys
        STORAGE_KEYS: {
            VERIFIED_INFO: 'sltech_verified_info',
            INITIAL_BALANCE: 'initialBalanceInfo',
            LEADERBOARD_DATA: 'sltech_leaderboard_data',
            DEMO_BALANCE: 'sltechbd_demo_balance',
            EXPAND_PERCENT: 'expandPercent',
            LAST_POSITION: 'lastPositionNumber'
        },
        // URLs
        BASE_URL: 'https://market-qx.trade',
        LIVE_TRADE_URL: '/en/trade',
        DEMO_TRADE_URL: '/en/demo-trade',
        // Default values
        DEFAULT_DEMO_BALANCE: 10000.00,
        // Time constants
        ONE_DAY_MS: 86400000 // 24 hours in milliseconds
    };

    // CSS selectors for various UI elements
    const SELECTORS = {
        positionHeaderMoney: '.position__header-money.--green, .position__header-money.--red',
        usermenuBalance: '.---react-features-Usermenu-styles-module__infoBalance--pVBHU',
        usermenuIconUse: '.---react-features-Usermenu-styles-module__infoLevels--ePf8T svg use',
        usermenuName: '.---react-features-Usermenu-styles-module__infoName--SfrTV.---react-features-Usermenu-styles-module__demo--TmWTp',
        levelName: '.---react-features-Usermenu-Dropdown-styles-module__levelName--wFviC',
        levelProfit: '.---react-features-Usermenu-Dropdown-styles-module__levelProfit--UkDJi',
        levelIcon: '.---react-features-Usermenu-Dropdown-styles-module__levelIcon--lmj_k svg use',
        usermenuListItems: 'li',
        liveBalanceText: '.---react-features-Usermenu-styles-module__infoText--58LeE .---react-features-Usermenu-styles-module__infoBalance--pVBHU',
        positionLoading: '.position__loading .position__expand',
        leaderboardItems: '.leader-board__items',
        leaderboardItem: '.leader-board__item',
        positionHeader: '.position__header',
        positionFooter: '.position__footer'
    };

    const ACTIVE_CLASS = '---react-features-Usermenu-Dropdown-styles-module__active--P5n2A';

    // -------------------- UTILITY FUNCTIONS --------------------
    
    // DOM utility functions
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => [...document.querySelectorAll(selector)];

    // Extract number from text
    function extractNumberFromText(text) {
        return text ? parseFloat(text.replace(/[^0-9.]/g, '')) : NaN;
    }

    // Format numbers with thousands separators and two decimal places
    function formatWithThousands(num) {
        return num.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }

    // Format profit/loss display
    function formatProfitDisplay(difference) {
        const value = formatWithThousands(Math.abs(difference));
        return difference < 0 ? `-$${value}` : `$${value}`;
    }

    // Format amount with dollar sign and two decimals
    function formatAmount(num) {
        return `$${num.toFixed(2)}`;
    }

    // Detect mobile devices
    function isMobileDevice() {
        return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
    }

    // -------------------- URL REDIRECTION & DEMO TO LIVE SPOOF --------------------
    
    function setupUrlSpoofing() {
        const currentUrl = window.location.href;
        const liveTradeUrl = CONFIG.BASE_URL + CONFIG.LIVE_TRADE_URL;
        const demoTradeUrl = CONFIG.BASE_URL + CONFIG.DEMO_TRADE_URL;
        
        // Redirect from live trade to demo trade page
        if (currentUrl === liveTradeUrl) {
            window.location.replace(demoTradeUrl);
            return;
        }
        
        // Spoof URL and title for demo trade page to appear as live trading
        if (currentUrl === demoTradeUrl) {
            const fakeTitle = 'Live trading | Quotex';
            document.title = fakeTitle;

            // Ensure title stays consistent using MutationObserver
            const titleElement = document.querySelector('title');
            if (titleElement) {
                new MutationObserver(() => {
                    if (document.title !== fakeTitle) {
                        document.title = fakeTitle;
                    }
                }).observe(titleElement, { childList: true });
            }

            // Change browser history to show fake URL
            history.replaceState(null, '', liveTradeUrl);
        }
    }

    // -------------------- BALANCE MANAGEMENT --------------------
    
    function setupBalanceManagement() {
        const now = Date.now();
        let initialBalance = 0;
        let demoBalance = CONFIG.DEFAULT_DEMO_BALANCE;

        // Load initial balance from localStorage
        const savedBalance = localStorage.getItem(CONFIG.STORAGE_KEYS.INITIAL_BALANCE);
        if (savedBalance) {
            try {
                const balanceData = JSON.parse(savedBalance);
                if (now - balanceData.timestamp < CONFIG.ONE_DAY_MS) {
                    initialBalance = parseFloat(balanceData.balance);
                }
            } catch (error) {
                console.error('Error loading initial balance:', error);
            }
        }

        // Load demo balance from localStorage
        const savedDemoBalance = localStorage.getItem(CONFIG.STORAGE_KEYS.DEMO_BALANCE);
        if (savedDemoBalance) {
            try {
                const demoData = JSON.parse(savedDemoBalance);
                if (now - demoData.timestamp < CONFIG.ONE_DAY_MS) {
                    demoBalance = parseFloat(demoData.balance);
                }
            } catch (error) {
                console.error('Error loading demo balance:', error);
            }
        }

        // Spoof UI to show live/demo account balances
        function spoofAccountBalances() {
            const listItems = $$(SELECTORS.usermenuListItems);
            if (!listItems.length) return;

            const demoListItem = listItems.find(li => li.innerText.includes('Demo Account'));
            const liveListItem = listItems.find(li => li.innerText.includes('Live'));
            
            if (!demoListItem || !liveListItem) return;

            const demoBalanceElement = demoListItem.querySelector('b');
            const liveBalanceElement = liveListItem.querySelector('b');
            
            if (!demoBalanceElement || !liveBalanceElement) return;

            // Update demo and live balance text
            demoBalanceElement.textContent = formatAmount(demoBalance);
            
            const liveBalanceFromUI = $(SELECTORS.liveBalanceText);
            let liveBalanceValue = 0;
            
            if (liveBalanceFromUI) {
                liveBalanceValue = extractNumberFromText(liveBalanceFromUI.textContent);
                if (isNaN(liveBalanceValue)) liveBalanceValue = 0;
            }
            
            liveBalanceElement.textContent = formatAmount(liveBalanceValue);

            // Toggle active class for live/demo account
            demoListItem.classList.remove(ACTIVE_CLASS);
            liveListItem.classList.add(ACTIVE_CLASS);
        }

        return {
            initialBalance,
            demoBalance,
            spoofAccountBalances,
            setInitialBalance: (balance) => {
                initialBalance = parseFloat(balance) || 0;
                localStorage.setItem(CONFIG.STORAGE_KEYS.INITIAL_BALANCE, JSON.stringify({
                    balance: initialBalance,
                    timestamp: Date.now()
                }));
            },
            setDemoBalance: (balance) => {
                demoBalance = parseFloat(balance) || CONFIG.DEFAULT_DEMO_BALANCE;
                localStorage.setItem(CONFIG.STORAGE_KEYS.DEMO_BALANCE, JSON.stringify({
                    balance: demoBalance,
                    timestamp: Date.now()
                }));
            }
        };
    }

    // -------------------- PROFIT EXPAND SYSTEM --------------------
    
    function setupProfitExpandSystem() {
        let lastProfitDifference = null;
        let currentExpandPercent = parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.EXPAND_PERCENT)) || 0;

        // Update position expand bar and slider based on profit change
        function updatePositionExpand(forceFullBar = false) {
            const balanceElement = $(SELECTORS.usermenuBalance);
            if (!balanceElement) return;
            
            const currentBalance = extractNumberFromText(balanceElement.textContent);
            if (isNaN(currentBalance)) return;

            const balanceManager = setupBalanceManagement();
            const difference = currentBalance - balanceManager.initialBalance;
            
            if (difference !== lastProfitDifference) {
                currentExpandPercent = Math.floor(Math.random() * 91) + 10; // Random 10-100%
                lastProfitDifference = difference;
                localStorage.setItem(CONFIG.STORAGE_KEYS.EXPAND_PERCENT, currentExpandPercent.toString());
            }

            const expandElement = $(SELECTORS.positionLoading);
            if (expandElement) {
                expandElement.style.width = forceFullBar ? '100%' : `${currentExpandPercent}%`;
            }

            const slider = $('#capitalPercentSlider');
            if (slider) {
                slider.value = currentExpandPercent;
                updatePercentDisplay(currentExpandPercent);
            }
        }

        // Update percentage display for slider
        function updatePercentDisplay(value) {
            const display = $('#sliderPercentDisplay');
            if (display) {
                display.textContent = `${value}%`;
            }
        }

        return {
            updatePositionExpand,
            updatePercentDisplay,
            getExpandPercent: () => currentExpandPercent,
            setExpandPercent: (percent) => {
                currentExpandPercent = parseInt(percent) || 0;
                localStorage.setItem(CONFIG.STORAGE_KEYS.EXPAND_PERCENT, currentExpandPercent.toString());
                updatePercentDisplay(currentExpandPercent);
                
                const expandElement = $(SELECTORS.positionLoading);
                if (expandElement) {
                    expandElement.style.width = `${currentExpandPercent}%`;
                }
            }
        };
    }

    // -------------------- LEADERBOARD SYSTEM --------------------
    
    function setupLeaderboardSystem() {
        let currentRowIndex = null;
        const originalRows = {};
        let lastTopPosition = null;

        // Points for leaderboard position interpolation
        const positionPoints = [
            { profit: -10000, position: 60000 },
            { profit: 0, position: 58471 },
            { profit: 1, position: 3154 },
            { profit: 7886, position: 21 },
            { profit: 20000, position: 1 },
        ];

        // Parse money values from text
        function parseMoneyValue(text) {
            return parseFloat(text.replace(/[^0-9.-]+/g, '')) || 0;
        }

        // Get user data from header
        function getUserData() {
            const header = $(SELECTORS.positionHeader);
            if (!header) return null;

            const nameElement = header.querySelector('.position__header-name');
            const name = nameElement?.textContent.trim() || '';

            const moneyElement = header.querySelector('.position__header-money');
            const profitText = moneyElement?.textContent.trim() || '';
            const profit = parseMoneyValue(profitText);

            // Extract flag code
            const flagSvg = nameElement?.querySelector('svg');
            const flagClass = flagSvg?.getAttribute('class') || '';
            const flagUse = flagSvg?.querySelector('use')?.getAttribute('xlink:href') || '';
            const flagCode = flagClass.replace('flag-', '') || flagUse.split('#')[1] || 'ca';

            return { 
                name, 
                profit, 
                profitText, 
                flagCode 
            };
        }

        // Update footer with position number
        function updatePositionFooter(positionNumber) {
            const footer = $(SELECTORS.positionFooter);
            if (footer) {
                footer.innerHTML = `<div class="position__footer-title">Your position:</div>${positionNumber}`;
            }
        }

        // Restore original leaderboard row
        function restoreOriginalRow(index) {
            const rows = $$(SELECTORS.leaderboardItem);
            if (rows[index] && originalRows[index]) {
                rows[index].innerHTML = originalRows[index];
            }
        }

        // Calculate leaderboard position based on profit
        function calculatePosition(profit) {
            const sortedPoints = [...positionPoints].sort((a, b) => a.profit - b.profit);

            // Extrapolate for large losses
            if (profit <= sortedPoints[0].profit) {
                const point1 = sortedPoints[0];
                const point2 = sortedPoints[1];
                const slope = (point2.position - point1.position) / (point2.profit - point1.profit);
                const position = slope * (profit - point1.profit) + point1.position;
                return Math.max(1, Math.round(position));
            }

            // For profit above the highest point
            if (profit >= sortedPoints[sortedPoints.length - 1].profit) {
                return sortedPoints[sortedPoints.length - 1].position;
            }

            // Linear interpolation between points
            for (let i = 0; i < sortedPoints.length - 1; i++) {
                const currentPoint = sortedPoints[i];
                const nextPoint = sortedPoints[i + 1];
                
                if (profit >= currentPoint.profit && profit <= nextPoint.profit) {
                    const slope = (nextPoint.position - currentPoint.position) / (nextPoint.profit - currentPoint.profit);
                    const position = slope * (profit - currentPoint.profit) + currentPoint.position;
                    return Math.max(1, Math.round(position));
                }
            }
            
            return Math.max(1, sortedPoints[0].position);
        }

        // Update footer with calculated position
        function updateCalculatedPosition(profit) {
            const footer = $(SELECTORS.positionFooter);
            if (!footer) return;
            
            const position = calculatePosition(profit);
            const currentText = footer.innerText.replace(/\D/g, '');
            const newText = position.toString();
            
            if (currentText !== newText) {
                footer.innerHTML = `<div class="position__footer-title">Your position:</div>${newText}`;
                localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_POSITION, newText);
            }
        }

        // Apply saved leaderboard position
        function applySavedPosition() {
            const savedPosition = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_POSITION);
            const footer = $(SELECTORS.positionFooter);
            
            if (savedPosition && footer) {
                footer.innerHTML = `<div class="position__footer-title">Your position:</div>${savedPosition}`;
            }
        }

        // Update leaderboard with user data
        function updateLeaderboardDisplay(userData) {
            const leaderboard = $(SELECTORS.leaderboardItems);
            if (!leaderboard) return;
            
            const rows = Array.from(leaderboard.querySelectorAll(SELECTORS.leaderboardItem));
            if (!rows.length) return;

            // Find where user fits in leaderboard
            const userIndex = rows.findIndex(row => {
                const moneyElement = row.querySelector('.leader-board__item-money');
                return moneyElement && parseMoneyValue(moneyElement.textContent) <= userData.profit;
            });
            
            const targetIndex = userIndex === -1 ? rows.length - 1 : userIndex;

            if (targetIndex !== currentRowIndex) {
                if (currentRowIndex !== null) {
                    restoreOriginalRow(currentRowIndex);
                }
                
                const targetRow = rows[targetIndex];
                if (!targetRow) return;
                
                if (!originalRows[targetIndex]) {
                    originalRows[targetIndex] = targetRow.innerHTML;
                }

                // Update flag
                const flagSvg = targetRow.querySelector('.leader-board__item-block svg.flag');
                const flagUse = flagSvg?.querySelector('use');
                if (flagSvg && flagUse && userData.flagCode) {
                    flagSvg.setAttribute('class', `flag flag-${userData.flagCode}`);
                    flagUse.setAttribute('xlink:href', `/profile/images/flags.svg#flag-${userData.flagCode}`);
                }

                // Set default avatar
                const avatarDiv = targetRow.querySelector('.leader-board__item-avatar');
                if (avatarDiv) {
                    avatarDiv.innerHTML = `
                        <svg class="icon-avatar-default">
                            <use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use>
                        </svg>`;
                }

                // Update name and profit
                const nameDiv = targetRow.querySelector('.leader-board__item-name');
                if (nameDiv) {
                    nameDiv.textContent = userData.name;
                }

                const moneyDiv = targetRow.querySelector('.leader-board__item-money');
                if (moneyDiv) {
                    moneyDiv.textContent = targetIndex === 0 ? '$30,000.00+' : formatProfitDisplay(userData.profit);
                    moneyDiv.style.color = userData.profit < 0 ? '#fd4d3c' : '#0faf59';
                }

                currentRowIndex = targetIndex;
                updatePositionFooter(targetIndex + 1);
                lastTopPosition = targetIndex >= 0 && targetIndex <= 2 ? targetIndex + 1 : null;
            }
        }

        // Check and update leaderboard based on user data
        function updateLeaderboard() {
            const userData = getUserData();
            if (!userData) {
                if (currentRowIndex !== null) {
                    restoreOriginalRow(currentRowIndex);
                    currentRowIndex = null;
                }
                updatePositionFooter(calculatePosition(0));
                lastTopPosition = null;
                return;
            }

            const leaderboard = $(SELECTORS.leaderboardItems);
            if (!leaderboard) return;
            
            const rows = Array.from(leaderboard.querySelectorAll(SELECTORS.leaderboardItem));
            if (rows.length < 20) return;

            const twentiethRow = rows[19];
            const twentiethProfit = parseMoneyValue(
                twentiethRow.querySelector('.leader-board__item-money')?.textContent || '0'
            );

            if (userData.profit >= twentiethProfit) {
                updateLeaderboardDisplay(userData);
            } else {
                if (currentRowIndex !== null) {
                    restoreOriginalRow(currentRowIndex);
                    currentRowIndex = null;
                }
                updateCalculatedPosition(userData.profit);
                lastTopPosition = null;
            }
        }

        return {
            updateLeaderboard,
            applySavedPosition,
            getLastTopPosition: () => lastTopPosition,
            setUserData: (name, flag) => {
                const userData = {
                    name: name || "You",
                    flag: flag || 'bd'
                };
                localStorage.setItem(CONFIG.STORAGE_KEYS.LEADERBOARD_DATA, JSON.stringify(userData));
                updateLeaderboard();
            }
        };
    }

    // -------------------- MAIN UI UPDATE FUNCTION --------------------
    
    function updateMainUI() {
        const balanceManager = setupBalanceManagement();
        const profitExpandSystem = setupProfitExpandSystem();
        const leaderboardSystem = setupLeaderboardSystem();

        const balanceElement = $(SELECTORS.usermenuBalance);
        const profitElement = $(SELECTORS.positionHeaderMoney);
        const levelIconUse = $(SELECTORS.usermenuIconUse);
        const levelIconDropdown = $(SELECTORS.levelIcon);

        // Update profit display
        if (balanceElement && profitElement) {
            const currentBalance = extractNumberFromText(balanceElement.textContent);
            if (!isNaN(currentBalance)) {
                const difference = currentBalance - balanceManager.initialBalance;
                profitElement.innerText = formatProfitDisplay(difference);
                profitElement.style.color = difference < 0 ? '#fd4d3c' : '#0faf59';
            }
        }

        // Determine user level based on balance
        const currentBalance = extractNumberFromText(balanceElement?.textContent) || 0;
        let accountLevel = 'standard';
        
        if (currentBalance > 9999.99) {
            accountLevel = 'vip';
        } else if (currentBalance > 4999.99) {
            accountLevel = 'pro';
        }

        // Update level icons
        const iconHref = `/profile/images/spritemap.svg#icon-profile-level-${accountLevel}`;
        if (levelIconUse) levelIconUse.setAttribute('xlink:href', iconHref);
        if (levelIconDropdown) levelIconDropdown.setAttribute('xlink:href', iconHref);

        // Update account name (responsive)
        const nameElement = $(SELECTORS.usermenuName);
        if (nameElement) {
            nameElement.textContent = isMobileDevice() ? 'Live' : 'Live Account';
            nameElement.style.color = '#0faf59';
        }

        // Update level name and profit bonus
        const levelNameElement = $(SELECTORS.levelName);
        const levelProfitElement = $(SELECTORS.levelProfit);
        
        if (levelNameElement && levelProfitElement) {
            if (accountLevel === 'vip') {
                levelNameElement.textContent = 'vip:';
                levelProfitElement.textContent = '+4% profit';
            } else if (accountLevel === 'pro') {
                levelNameElement.textContent = 'pro:';
                levelProfitElement.textContent = '+2% profit';
            } else {
                levelNameElement.textContent = 'standard:';
                levelProfitElement.textContent = '+0% profit';
            }
        }

        // Update leaderboard name and flag
        const leaderboardData = localStorage.getItem(CONFIG.STORAGE_KEYS.LEADERBOARD_DATA);
        if (leaderboardData) {
            try {
                const { name, flag } = JSON.parse(leaderboardData);
                const nameBox = $('.position__header-name');
                if (nameBox && name && flag) {
                    nameBox.innerHTML = `
                        <svg class="flag-${flag}">
                            <use xlink:href="/profile/images/flags.svg#flag-${flag}"></use>
                        </svg> 
                        ${name}
                    `;
                }
            } catch (error) {
                console.error('Error parsing leaderboard data:', error);
            }
        }

        // Force full bar for top 1/2/3 leaderboard positions
        const lastTopPosition = leaderboardSystem.getLastTopPosition();
        const forceFullBar = lastTopPosition && [1, 2, 3].includes(lastTopPosition);
        profitExpandSystem.updatePositionExpand(forceFullBar);

        leaderboardSystem.updateLeaderboard();
    }

    // -------------------- SETTINGS POPUP --------------------
    
    function setupSettingsPopup() {
        function createSettingsPopup() {
            if ($('#capitalBalancePopup')) return;

            const balanceManager = setupBalanceManagement();
            const profitExpandSystem = setupProfitExpandSystem();

            // Create popup for setting leaderboard and demo balance
            const popup = document.createElement('div');
            popup.id = 'capitalBalancePopup';
            popup.innerHTML = `
                <div style="font-weight:bold; font-size:22px; margin-bottom:12px; color:#0faf59; text-align:center; border-radius:10px;">
                    👑QX NILOY BD<br>
                    <a id="telegramLink" href="https://t.me/ni9bd" target="_blank" style="font-size:14px; color:#fd4d3c; text-decoration:underline; cursor:pointer;">by @ni9bd</a>
                </div>
                <label style="display:block; margin-bottom:6px;">👤 Leaderboard Name:</label>
                <input type="text" id="leaderboardNameInput" class="sl-input" value="QX NILOY BD" placeholder="QX NILOY BD" />
                <label style="display:block; margin:12px 0 6px;">🚩 Leaderboard Flag Code:</label>
                <input type="text" id="leaderboardFlagInput" class="sl-input" placeholder="e.g. bd" />
                <label style="display:block; margin:12px 0 6px;">🏆 Leaderboard Amount Show:</label>
                <input type="number" id="leaderboardInput" class="sl-input" placeholder="Enter leaderboard amount" />
                <label style="display:block; margin:12px 0 6px;">Demo Account Balance:</label>
                <input type="number" id="demoBalanceInput" class="sl-input" placeholder="Enter demo balance" value="${balanceManager.demoBalance}" min="0" />
                <label style="display:block; margin:12px 0 6px;">Capital % Slider:</label>
                <div style="position: relative; width: 100%; margin-bottom: 6px;">
                    <input type="range" id="capitalPercentSlider" class="sl-input" min="0" max="100" step="1" value="${profitExpandSystem.getExpandPercent()}" style="width: 100%;" />
                    <div id="sliderPercentDisplay" style="
                        position: absolute; top: -22px; right: 10px; font-weight: bold; color: #222;
                        background: #eee; padding: 2px 8px; border-radius: 6px; user-select: none;
                        pointer-events: none; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px;
                        box-shadow:0 2px 10px #2222;">${profitExpandSystem.getExpandPercent()}%</div>
                </div>
                <div style="text-align:center; margin-top:22px;">
                    <button id="setCapitalBtn" class="sl-button" style="background:#fdc500; color:#222;">Set</button>
                    <button id="cancelCapitalBtn" class="sl-button sl-cancel" style="background:#888;">Cancel</button>
                </div>
            `;

            // Style popup
            const isMobile = isMobileDevice();
            Object.assign(popup.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#fff',
                color: '#222',
                padding: isMobile ? '5vw' : '28px',
                borderRadius: '20px',
                boxShadow: '0 16px 44px rgba(0,0,0,0.23)',
                zIndex: '10000',
                width: isMobile ? '98vw' : '380px',
                maxWidth: '99vw',
                fontFamily: "'Segoe UI', sans-serif",
            });

            // Add popup styles
            const style = document.createElement('style');
            style.textContent = `
                .sl-input {
                    width: 100%; padding: 13px; margin-bottom: 10px; border: 1.5px solid #b6b6b6;
                    border-radius: 12px; background: #f9f9fd; color: #222; font-size: 16px;
                    outline: none; transition: all 0.3s; box-shadow:0 2px 10px #ececec;
                }
                .sl-input:focus {
                    border-color: #1976d2; box-shadow: 0 0 7px rgba(25, 118, 210, 0.4);
                }
                .sl-button {
                    padding: 10px 24px; margin: 0 7px; background: #0077cc; border: none;
                    border-radius: 10px; color: #fff; font-weight: bold; font-size: 16px; cursor: pointer;
                    transition: background 0.3s, box-shadow 0.3s; box-shadow:0 2px 10px #ececec;
                }
                .sl-button:hover { background: #005fa3; }
                .sl-button.sl-cancel { background: #888; }
                .sl-button.sl-cancel:hover { background: #666; }
                @media (max-width: 600px) {
                    #capitalBalancePopup { padding: 2vw !important; width: 98vw !important; }
                    .sl-input, .sl-button { font-size: 18px !important; }
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(popup);

            // Slider logic
            const slider = $('#capitalPercentSlider');
            const expandElement = $(SELECTORS.positionLoading);
            
            slider.oninput = () => {
                if (expandElement) {
                    expandElement.style.width = `${slider.value}%`;
                }
                profitExpandSystem.updatePercentDisplay(slider.value);
            };

            // Set button logic
            $('#setCapitalBtn').onclick = () => {
                const leaderboardAmount = parseFloat($('#leaderboardInput').value);
                const leaderboardName = $('#leaderboardNameInput').value.trim();
                const leaderboardFlag = $('#leaderboardFlagInput').value.trim().toLowerCase();
                
                const currentBalanceElement = $(SELECTORS.usermenuBalance);
                const currentBalance = extractNumberFromText(currentBalanceElement?.textContent) || 0;

                // Validate and set leaderboard amount
                if (!isNaN(leaderboardAmount)) {
                    const difference = currentBalance - leaderboardAmount;
                    if (difference < 0) {
                        alert('Leaderboard amount exceeds balance.');
                        return;
                    }
                    balanceManager.setInitialBalance(difference);
                } else {
                    alert('Enter valid amount.');
                    return;
                }

                // Set name and flag
                if (leaderboardName && leaderboardFlag) {
                    const leaderboardSystem = setupLeaderboardSystem();
                    leaderboardSystem.setUserData(leaderboardName, leaderboardFlag);
                }

                // Set demo balance
                const demoBalanceValue = parseFloat($('#demoBalanceInput').value);
                if (isNaN(demoBalanceValue) || demoBalanceValue < 0) {
                    alert('Enter a valid demo account balance.');
                    return;
                }
                balanceManager.setDemoBalance(demoBalanceValue);

                // Set slider value
                profitExpandSystem.setExpandPercent(slider.value);

                // Update UI and close popup
                balanceManager.spoofAccountBalances();
                updateMainUI();
                popup.remove();
                style.remove();
            };

            // Cancel button logic
            $('#cancelCapitalBtn').onclick = () => {
                popup.remove();
                style.remove();
            };
        }

        return { createSettingsPopup };
    }

    // -------------------- DEPOSIT BUTTON INTERCEPTION --------------------
    
    function setupDepositInterception() {
        function interceptDepositButtons() {
            const allElements = document.querySelectorAll('a, button');
            allElements.forEach(element => {
                if (element._qxDepositPopup) return;
                
                const isDepositButton = 
                    (element.href && element.href.includes('/deposit')) ||
                    (element.textContent && element.textContent.trim().toLowerCase() === 'deposit');
                
                if (isDepositButton) {
                    element._qxDepositPopup = true;
                    element.addEventListener('click', function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        
                        const settingsPopup = setupSettingsPopup();
                        settingsPopup.createSettingsPopup();
                        
                        return false;
                    }, true);
                }
            });
        }

        // Observe DOM for deposit button changes
        new MutationObserver(interceptDepositButtons).observe(document.body, { 
            childList: true, 
            subtree: true 
        });

        return { interceptDepositButtons };
    }

    // -------------------- MAIN INITIALIZATION --------------------
    
    function initializeMod() {
        console.log('🚀 Initializing QX NILOY Mod...');
        
        // Setup URL spoofing first
        setupUrlSpoofing();
        
        // Initialize all systems
        const balanceManager = setupBalanceManagement();
        const leaderboardSystem = setupLeaderboardSystem();
        const depositInterceptor = setupDepositInterception();
        
        // Debounced UI update
        let updateTimeout = null;
        function debouncedUpdate() {
            if (updateTimeout) clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                balanceManager.spoofAccountBalances();
                updateMainUI();
            }, 50);
        }

        // Observe DOM changes for real-time updates
        new MutationObserver(debouncedUpdate).observe(document.body, { 
            childList: true, 
            subtree: true 
        });

        // Initial setup
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            balanceManager.spoofAccountBalances();
            leaderboardSystem.applySavedPosition();
            updateMainUI();
            depositInterceptor.interceptDepositButtons();
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                balanceManager.spoofAccountBalances();
                leaderboardSystem.applySavedPosition();
                updateMainUI();
                depositInterceptor.interceptDepositButtons();
            });
        }

        console.log('✅ QX NILOY Mod initialized successfully');
    }

    // Start the mod
    initializeMod();
})();
