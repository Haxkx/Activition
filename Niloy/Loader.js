

(function () {
'use strict';

// --- QX NILOY V1.8.9 (market-qx.trade-fixed) ---

if (location.href === "https://market-qx.trade/en/trade") {
    location.replace("https://market-qx.trade/en/demo-trade");
    return;
}

if (location.href === "https://market-qx.trade/en/demo-trade") {
    const fakeUrl = "https://market-qx.trade/en/trade";
    const fakeTitle = "Live trading | Quotex";
    document.title = fakeTitle;
    new MutationObserver(() => {
        if (document.title !== fakeTitle) document.title = fakeTitle;
    }).observe(document.querySelector('title'), { childList: true });
    history.replaceState(null, "", fakeUrl);
}
const now = Date.now();
const pwKey = atob("c2x0ZWNoX3ZlcmlmaWVkX2luZm8=");
const balKey = atob("aW5pdGlhbEJhbGFuY2VJbmZv");
const lbKey = atob("c2x0ZWNoX2xlYWRlcmJvYXJkX2RhdGE=");
const demoBalKey = "sltechbd_demo_balance";

const selectors = {
    positionHeaderMoney: ".position__header-money.--green, .position__header-money.--red",
    usermenuBalance: ".---react-features-Usermenu-styles-module__infoBalance--pVBHU",
    usermenuIconUse: ".---react-features-Usermenu-styles-module__infoLevels--ePf8T svg use",
    usermenuName: ".---react-features-Usermenu-styles-module__infoName--SfrTV.---react-features-Usermenu-styles-module__demo--TmWTp",
    levelName: ".---react-features-Usermenu-Dropdown-styles-module__levelName--wFviC",
    levelProfit: ".---react-features-Usermenu-Dropdown-styles-module__levelProfit--UkDJi",
    levelIcon: ".---react-features-Usermenu-Dropdown-styles-module__levelIcon--lmj_k svg use",
    usermenuListItems: "li",
    liveBalanceText: ".---react-features-Usermenu-styles-module__infoText--58LeE .---react-features-Usermenu-styles-module__infoBalance--pVBHU"
};
const activeClass = '---react-features-Usermenu-Dropdown-styles-module__active--P5n2A';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const numFromText = s => s ? parseFloat(s.replace(/[^0-9.]/g, "")) : NaN;

function formatWithThousands(num) {
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatProfitDisplay(diff) {
    const val = formatWithThousands(Math.abs(diff));
    if (diff < 0) {
        return `-$${val}`;
    } else {
        return `$${val}`;
    }
}

let initialBal = 0;
const savedBal = localStorage.getItem(balKey);
if (savedBal) {
    const d = JSON.parse(savedBal);
    if (now - d.timestamp < 864e5) initialBal = parseFloat(d.balance);
}

// Demo balance logic
let demoBalance = 10000;
const savedDemoBal = localStorage.getItem(demoBalKey);
if (savedDemoBal) {
    const d = JSON.parse(savedDemoBal);
    if (now - d.timestamp < 864e5) demoBalance = parseFloat(d.balance);
}

function formatAmount(num) { return "$" + num.toFixed(2); }

function spoofUI() {
    const listItems = $$(selectors.usermenuListItems);
    if (!listItems.length) return;
    const demoLi = listItems.find(li => li.innerText.includes("Demo Account"));
    const liveLi = listItems.find(li => li.innerText.includes("Live"));
    if (!demoLi || !liveLi) return;
    const demoBalanceElem = demoLi.querySelector("b");
    const liveBalanceElem = liveLi.querySelector("b");
    if (!demoBalanceElem || !liveBalanceElem) return;

    // Use demoBalance from localStorage
    const fixedDemoAmountStr = formatAmount(demoBalance);
    const liveBalanceFromUI = $(selectors.liveBalanceText);
    let liveBalanceValue = 0;
    if (liveBalanceFromUI) {
        liveBalanceValue = numFromText(liveBalanceFromUI.textContent);
        if (isNaN(liveBalanceValue)) liveBalanceValue = 0;
    }
    const liveAmountStr = formatAmount(liveBalanceValue);

    demoBalanceElem.textContent = fixedDemoAmountStr;
    liveBalanceElem.textContent = liveAmountStr;
    if (demoLi.classList.contains(activeClass)) demoLi.classList.remove(activeClass);
    if (!liveLi.classList.contains(activeClass)) liveLi.classList.add(activeClass);
}

let lastProfitDiff = null;
let currentExpandPercent = parseInt(localStorage.getItem('expandPercent')) || 0;

function updatePositionExpandOnProfitChange(forceFullBar = false) {
    const bal = numFromText($(selectors.usermenuBalance)?.textContent);
    if (isNaN(bal)) return;
    const diff = bal - initialBal;
    if (diff !== lastProfitDiff) {
        currentExpandPercent = Math.floor(Math.random() * 91) + 10;
        lastProfitDiff = diff;
        localStorage.setItem('expandPercent', currentExpandPercent);

        const expandSpan = document.querySelector(".position__loading .position__expand");
        if (expandSpan) expandSpan.style.width = (forceFullBar ? '100%' : (currentExpandPercent + "%"));

        const slider = document.getElementById('capitalPercentSlider');
        if (slider) {
            slider.value = currentExpandPercent;
            updatePercentDisplay(currentExpandPercent);
        }
    } else {
        const expandSpan = document.querySelector(".position__loading .position__expand");
        if (expandSpan) expandSpan.style.width = (forceFullBar ? '100%' : (currentExpandPercent + "%"));

        const slider = document.getElementById('capitalPercentSlider');
        if (slider) {
            updatePercentDisplay(currentExpandPercent);
        }
    }
}

function updatePercentDisplay(value) {
    let display = document.getElementById("sliderPercentDisplay");
    if (!display) return;
    display.textContent = value + "%";
}

// ----- Leaderboard Section Integration -----

const leaderboardSelector = '.leader-board__items';
const leaderboardRowSelector = '.leader-board__item';
const yourHeaderSelector = '.position__header';
const yourFooterSelector = '.position__footer';

let currentRowIndex = null;
const originalRows = {};

// ==== Points for interpolation (keep as before) ====
const points = [
    { profit: -10000, position: 60000 },
    { profit: 0, position: 58471 },
    { profit: 1, position: 3154 },
    { profit: 7886, position: 21 },
    { profit: 20000, position: 1 }
];

function parseMoney(text) {
    return parseFloat(text.replace(/[^0-9.-]+/g, '')) || 0;
}

function getYourData() {
    const header = document.querySelector(yourHeaderSelector);
    if (!header) return null;

    const nameEl = header.querySelector('.position__header-name');
    const name = nameEl?.textContent.trim() ?? '';

    const moneyEl = header.querySelector('.position__header-money');
    const profitText = moneyEl?.textContent.trim() ?? '';
    const profit = parseMoney(profitText);

    const isRed = moneyEl?.classList.contains('--red') || profit < 0 || profitText.startsWith('-') || moneyEl?.style.color === 'rgb(255, 0, 0)';
    if (!moneyEl) {
        return {
            name,
            profit: 0,
            profitText: profitText || '$0.00',
            flagCode: 'ca'
        };
    }

    const flagSvg = nameEl.querySelector('svg');
    const flagClass = flagSvg?.getAttribute('class') || '';
    const flagUse = flagSvg?.querySelector('use')?.getAttribute('xlink:href') || '';
    const flagCode = flagClass.replace('flag-', '') || flagUse.split('#')[1];

    return { name, profit, profitText, flagCode };
}

function updateFooter(positionNum) {
    const footer = document.querySelector(yourFooterSelector);
    if (footer) {
        footer.innerHTML = `<div class="position__footer-title">Your position:</div>${positionNum}`;
    }
}

function restoreOldRow(index) {
    const row = document.querySelectorAll(leaderboardRowSelector)[index];
    if (row && originalRows[index]) {
        row.innerHTML = originalRows[index];
    }
}

// ==== পরিবর্তন করা হলো: বড় লস হলে extrapolation ====
function calculateInterpolatedPosition(profit) {
    const sortedPoints = points.slice().sort((a, b) => a.profit - b.profit);

    // For profit below the lowest point ("big loss"), extrapolate linearly
    if (profit <= sortedPoints[0].profit) {
        // Extrapolation: position = m*(profit - minProfit) + minPos
        // m = (p1.position - p0.position) / (p1.profit - p0.profit)
        const p0 = sortedPoints[0];
        const p1 = sortedPoints[1];
        const m = (p1.position - p0.position) / (p1.profit - p0.profit);
        const pos = m * (profit - p0.profit) + p0.position;
        return Math.max(1, Math.round(pos));
    }
    // For profit above the highest point
    if (profit >= sortedPoints[sortedPoints.length - 1].profit) {
        return sortedPoints[sortedPoints.length - 1].position;
    }
    // Interval interpolation (as before)
    for (let i = 0; i < sortedPoints.length - 1; i++) {
        const p1 = sortedPoints[i];
        const p2 = sortedPoints[i + 1];
        if (profit >= p1.profit && profit <= p2.profit) {
            const m = (p2.position - p1.position) / (p2.profit - p1.profit);
            const pos = m * (profit - p1.profit) + p1.position;
            return Math.max(1, Math.round(pos));
        }
    }
    return Math.max(1, sortedPoints[0].position); // fallback
}

function updateLinearPosition(profit) {
    const footer = document.querySelector(yourFooterSelector);
    if (!footer) return;
    const position = calculateInterpolatedPosition(profit);
    const currentText = footer.innerText.replace(/\D/g, '');
    const newText = position.toString();
    if (currentText !== newText) {
        footer.innerHTML = `<div class="position__footer-title">Your position:</div>${newText}`;
        localStorage.setItem('lastPositionNumber', newText);
    }
}

function applySavedPosition() {
    const saved = localStorage.getItem('lastPositionNumber');
    const footer = document.querySelector(yourFooterSelector);
    if (saved && footer) {
        footer.innerHTML = `<div class="position__footer-title">Your position:</div>${saved}`;
    }
}

let lastTopPosition = null;

function updateLeaderboard(user) {
    const leaderboard = document.querySelector(leaderboardSelector);
    if (!leaderboard) return;
    const rows = Array.from(leaderboard.querySelectorAll(leaderboardRowSelector));
    if (!rows.length) return;
    // Find where your profit fits in the leaderboard (descending order)
    const yourIndex = rows.findIndex(row => {
        const moneyEl = row.querySelector('.leader-board__item-money');
        return moneyEl && parseMoney(moneyEl.textContent) <= user.profit;
    });
    const targetIndex = yourIndex === -1 ? rows.length - 1 : yourIndex;
    if (targetIndex !== currentRowIndex) {
        if (currentRowIndex !== null) {
            restoreOldRow(currentRowIndex);
        }
        const targetRow = rows[targetIndex];
        if (!targetRow) return;
        if (!originalRows[targetIndex]) {
            originalRows[targetIndex] = targetRow.innerHTML;
        }
        // Update flag
        const flagSVG = targetRow.querySelector('.leader-board__item-block svg.flag');
        const flagUSE = flagSVG?.querySelector('use');
        if (flagSVG && flagUSE && user.flagCode) {
            flagSVG.setAttribute('class', `flag flag-${user.flagCode}`);
            flagUSE.setAttribute('xlink:href', `/profile/images/flags.svg#flag-${user.flagCode}`);
        }
        // Force default avatar
        const avatarDiv = targetRow.querySelector('.leader-board__item-avatar');
        if (avatarDiv) {
            avatarDiv.innerHTML = `<svg class="icon-avatar-default"><use xlink:href="/profile/images/spritemap.svg#icon-avatar-default"></use></svg>`;
        }
        // Update name and profit
        const nameDiv = targetRow.querySelector('.leader-board__item-name');
        if (nameDiv) {
            nameDiv.textContent = user.name;
        }
        const moneyDiv = targetRow.querySelector('.leader-board__item-money');
        if (moneyDiv) {
            if (targetIndex === 0) {
                moneyDiv.textContent = "$30,000.00+";
            } else {
                moneyDiv.textContent = formatProfitDisplay(user.profit);
            }
            moneyDiv.style.color = user.profit < 0 ? "#fd4d3c" : "#0faf59";
        }
        currentRowIndex = targetIndex;
        updateFooter(targetIndex + 1);

        // Top 1/2/3 bar FULL, others normal
        lastTopPosition = (targetIndex >= 0 && targetIndex <= 2) ? (targetIndex + 1) : null;
    }
}

function checkAndUpdateLeaderboard() {
    const user = getYourData();
    if (!user) {
        if (currentRowIndex !== null) {
            restoreOldRow(currentRowIndex);
            currentRowIndex = null;
        }
        updateFooter(calculateInterpolatedPosition(0));
        lastTopPosition = null;
        return;
    }
    const leaderboard = document.querySelector(leaderboardSelector);
    if (!leaderboard) return;
    const rows = Array.from(leaderboard.querySelectorAll(leaderboardRowSelector));
    if (rows.length < 20) return;
    const row20 = rows[19];
    const profit20 = parseMoney(row20.querySelector('.leader-board__item-money')?.textContent || '0');

    if (user.profit >= profit20) {
        updateLeaderboard(user);
    } else {
        if (currentRowIndex !== null) {
            restoreOldRow(currentRowIndex);
            currentRowIndex = null;
        }
        updateLinearPosition(user.profit);
        lastTopPosition = null;
    }
}

function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
}

function updateUI() {
    const bal = numFromText($(selectors.usermenuBalance)?.textContent);
    const profitEl = $(selectors.positionHeaderMoney);
    const levelIconUse = $(selectors.usermenuIconUse);
    const levelIconDropdown = $(selectors.levelIcon);

    if (!isNaN(bal) && profitEl) {
        const diff = bal - initialBal;
        profitEl.innerText = formatProfitDisplay(diff);
        profitEl.style.color = diff < 0 ? "#fd4d3c" : "#0faf59";
    }
    let levelType = 'standart';
    if (bal > 9999.99) levelType = 'vip';
    else if (bal > 4999.99) levelType = 'pro';
    const iconHref = `/profile/images/spritemap.svg#icon-profile-level-${levelType}`;
    if (levelIconUse) levelIconUse.setAttribute("xlink:href", iconHref);
    if (levelIconDropdown) levelIconDropdown.setAttribute("xlink:href", iconHref);

    // Responsive Live/Live Account text
    const nameEl = $(selectors.usermenuName);
    if (nameEl) {
        if (isMobile()) {
            nameEl.textContent = "Live";
        } else {
            nameEl.textContent = "Live Account";
        }
        nameEl.style.color = "#0faf59";
    }
    const levelNameElem = $(selectors.levelName);
    const levelProfitElem = $(selectors.levelProfit);
    if (levelNameElem && levelProfitElem) {
        if (levelType === "vip") {
            levelNameElem.textContent = "vip:";
            levelProfitElem.textContent = "+4% profit";
        } else if (levelType === "pro") {
            levelNameElem.textContent = "pro:";
            levelProfitElem.textContent = "+2% profit";
        } else {
            levelNameElem.textContent = "standard:";
            levelProfitElem.textContent = "+0% profit";
        }
    }
    const lbData = localStorage.getItem(lbKey);
    if (lbData) {
        const { name, flag } = JSON.parse(lbData);
        const nameBox = document.querySelector(".position__header-name");
        if (nameBox && name && flag) {
            nameBox.innerHTML = `<svg class="flag-${flag}"><use xlink:href="/profile/images/flags.svg#flag-${flag}"></use></svg> ${name}`;
        }
    }

    // Top 1/2/3 bar FULL, others normal
    let forceFullBar = lastTopPosition && [1,2,3].includes(lastTopPosition);
    updatePositionExpandOnProfitChange(forceFullBar);

    checkAndUpdateLeaderboard();
}

// ---- UI update triggers ----

let timeoutId = null;
function debouncedUpdate() {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        spoofUI();
        updateUI();
    }, 50); // Fast debounce
}

new MutationObserver(debouncedUpdate).observe(document.body, { childList: true, subtree: true });

if (document.readyState === "complete" || document.readyState === "interactive") {
    spoofUI();
    applySavedPosition();
    updateUI();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        spoofUI();
        applySavedPosition();
        updateUI();
    });
}

// --- Deposit Button → Popup Trigger (NO REFRESH, NO REDIRECT, ALWAYS POPUP) ---
function showDepositPopup() {
    if ($('#capitalBalancePopup')) return;
    const popup = document.createElement("div");
    popup.id = "capitalBalancePopup";
    popup.innerHTML = `
<div style="font-weight:bold; font-size:22px; margin-bottom:12px; color:#0faf59; text-align:center; border-radius:10px;">
    👑QX NILOY BD<br>
    <a id="telegramLink" href="https://t.me/ni9bd" target="_blank" style="font-size:14px; color:#fd4d3c; text-decoration:underline; cursor:pointer;">by @ni9bd</a>
</div>
<label style="display:block; margin-bottom:6px;">
    👤 Leaderboard Name:
</label>
<input type="text" id="leaderboardNameInput" class="sl-input" value="QX NILOY BD" placeholder="QX NILOY BD" />
<label style="display:block; margin:12px 0 6px;">
    🚩 Leaderboard Flag Code:
</label>
<input type="text" id="leaderboardFlagInput" class="sl-input" placeholder="e.g. bd" />
<label style="display:block; margin:12px 0 6px;">
    🏆 Leaderboard Amount Show:
</label>
<input type="number" id="leaderboardInput" class="sl-input" placeholder="Enter leaderboard amount" />
<label style="display:block; margin:12px 0 6px;">
    Demo Account Balance:
</label>
<input type="number" id="demoBalanceInput" class="sl-input" placeholder="Enter demo balance" value="${demoBalance}" min="0" />

<label style="display:block; margin:12px 0 6px;">
    Capital % Slider:
</label>
<div style="position: relative; width: 100%; margin-bottom: 6px;">
<input type="range" id="capitalPercentSlider" class="sl-input" min="0" max="100" step="1" value="0" style="width: 100%;" />
<div id="sliderPercentDisplay" style="
position: absolute;
top: -22px;
right: 10px;
font-weight: bold;
color: #222;
background: #eee;
padding: 2px 8px;
border-radius: 6px;
user-select: none;
pointer-events: none;
font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
font-size: 16px;
box-shadow:0 2px 10px #2222;
">0%</div>
</div>

<div style="text-align:center; margin-top:22px;">
<button id="setCapitalBtn" class="sl-button" style="background:#fdc500; color:#222;">Set</button>
<button id="cancelCapitalBtn" class="sl-button sl-cancel" style="background:#888;">Cancel</button>
</div>
`;
    Object.assign(popup.style, {
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: "#fff", color: "#222",
        padding: window.innerWidth < 600 ? "5vw" : "28px", borderRadius: "20px", boxShadow: "0 16px 44px rgba(0,0,0,0.23)",
        zIndex: "10000", width: window.innerWidth < 600 ? "98vw" : "380px", maxWidth: "99vw", fontFamily: "'Segoe UI', sans-serif"
    });
    const style = document.createElement("style");
    style.textContent = `
.sl-input {
    width: 100%; padding: 13px; margin-bottom: 10px; border: 1.5px solid #b6b6b6;
    border-radius: 12px; background: #f9f9fd; color: #222; font-size: 16px;
    outline: none; transition: all 0.3s;
    box-shadow:0 2px 10px #ececec;
}
.sl-input:focus {
    border-color: #1976d2;
    box-shadow: 0 0 7px rgba(25, 118, 210, 0.4);
}
.sl-button {
    padding: 10px 24px; margin: 0 7px; background: #0077cc; border: none;
    border-radius: 10px; color: #fff; font-weight: bold; font-size: 16px; cursor: pointer;
    transition: background 0.3s, box-shadow 0.3s;
    box-shadow:0 2px 10px #ececec;
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

    // Capital percent slider logic
    const slider = $('#capitalPercentSlider');
    const expandSpan = document.querySelector(".position__loading .position__expand");
    slider.oninput = () => {
        if (expandSpan) expandSpan.style.width = slider.value + "%";
        updatePercentDisplay(slider.value);
    };

    // Set button logic: also sets demo balance!
    $('#setCapitalBtn').onclick = () => {
        const lb = parseFloat($('#leaderboardInput').value);
        const name = $('#leaderboardNameInput').value.trim();
        const flag = $('#leaderboardFlagInput').value.trim().toLowerCase();
        const ub = numFromText($(selectors.usermenuBalance)?.textContent);

        // Set leaderboard
        if (!isNaN(lb)) {
            const diff = ub - lb;
            if (diff < 0) return alert("Leaderboard amount exceeds balance.");
            initialBal = diff;
        } else return alert("Enter valid amount.");

        localStorage.setItem(balKey, JSON.stringify({ balance: initialBal, timestamp: now }));

        // Set name/flag
        if (name && flag) localStorage.setItem(lbKey, JSON.stringify({ name, flag }));

        // Set demo balance
        const demoVal = parseFloat($('#demoBalanceInput').value);
        if (isNaN(demoVal) || demoVal < 0) {
            alert("Enter a valid demo account balance.");
            return;
        }
        demoBalance = demoVal;
        localStorage.setItem(demoBalKey, JSON.stringify({ balance: demoBalance, timestamp: Date.now() }));
        spoofUI();
        updateUI();

        popup.remove();
    };
    $('#cancelCapitalBtn').onclick = () => popup.remove();
}

// Universal Deposit button hijack: prevents ALL navigation/refresh, always popup
function hijackDepositBtn() {
    const allBtns = document.querySelectorAll('a,button');
    allBtns.forEach(btn => {
        if (btn._qxDepositPopup) return;
        if (
            (btn.href && btn.href.includes("/deposit")) ||
            (btn.textContent && btn.textContent.trim().toLowerCase() === "deposit")
        ) {
            btn._qxDepositPopup = true;
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showDepositPopup();
                return false;
            }, true);
        }
    });
}
new MutationObserver(hijackDepositBtn).observe(document.body, { childList: true, subtree: true });
if (document.readyState === "complete" || document.readyState === "interactive") {
    hijackDepositBtn();
} else {
    document.addEventListener('DOMContentLoaded', hijackDepositBtn);
}

})();
