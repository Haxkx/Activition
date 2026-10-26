(function() {
    'use strict';

    console.log("🚀 COMBINED SCRIPT LOADED (UI Spoof + Overlay + Leaderboard)");

    // ============================================================
    // 🔹 PART 1: QUOTEX DEMO TO LIVE UI SPOOF SCRIPT
    // ============================================================
    const CONFIG = {
        DEMO_FIXED: 10000.00
    };

    const SEL = {
        ACCOUNT_NAME_DEMO: '.text .name.demo',
        ACCOUNT_BALANCE: '.text .balance',
        LEVEL_NAME: '.qjGlZ',
        LEVEL_PROFIT: '.VgpLl',
        RING: '.RUgzE',
        ACCOUNT_LIST_ITEM: '.RDtBn',
        DEMO_LINK: 'a[href="/en/demo-trade"]',
        LIVE_LINK: 'a[href="/en/trade"]',
        BALANCE_NODE: '.YnoT0',
        DEMO_PANEL_BALANCE: '.WjlOy .YnoT0',
        NEW_VALUE_INPUT: '.phkwf input.input-control__input',
        DEMO_NAME: '.name.demo',
        BALANCE_CLASS: '.balance',
        RADIO: 'input.r29tN'
    };

    function spoofTitleAndUrl() {
        try {
            if (document.title !== "Live trading | Quotex") {
                document.title = "Live trading | Quotex";
            }
            if (location.pathname !== "/en/trade") {
                history.replaceState(null, '', window.location.origin + "/en/trade");
            }
        } catch (e) {}
    }

    function lockTitle() {
        const titleEl = document.querySelector("title");
        if (titleEl) {
            new MutationObserver(() => {
                if (document.title !== "Live trading | Quotex") {
                    document.title = "Live trading | Quotex";
                }
            }).observe(titleEl, { childList: true, subtree: true });
        }
    }

    function convertTopAccountToLive() {
        try {
            document.querySelectorAll(SEL.ACCOUNT_NAME_DEMO).forEach(el => {
                if (el.textContent !== "Live") el.textContent = "Live";
                el.classList.remove('demo');
                el.classList.add('live');
                el.style.color = "#0faf59";
            });
        } catch (e) {}
    }

    function updateLevelIcon() {
        try {
            const realBal = getRealDemoBalance();
            let level = "standart";
            if (realBal > 9999.99) level = "vip";
            else if (realBal > 4999.99) level = "pro";

            const iconHref = "/profile/images/spritemap.svg#icon-profile-level-" + level;

            document.querySelectorAll('svg.icon use, .nKm6H svg use').forEach(use => {
                const cur = use.getAttribute('xlink:href') || '';
                if (cur.includes('icon-academic') || cur.includes('demo') || cur.includes('level')) {
                    use.setAttribute('xlink:href', iconHref);
                }
            });

            document.querySelectorAll(SEL.LEVEL_NAME).forEach(el => {
                const txt = level === 'vip' ? 'vip:' : level === 'pro' ? 'pro:' : 'standard:';
                if (el.textContent !== txt) el.textContent = txt;
            });
            document.querySelectorAll(SEL.LEVEL_PROFIT).forEach(el => {
                const txt = level === 'vip' ? '+4% profit' : level === 'pro' ? '+2% profit' : '+0% profit';
                if (el.textContent !== txt) el.textContent = txt;
            });
        } catch (e) {}
    }

    function updateRing() {
        try {
            document.querySelectorAll(SEL.RING).forEach(ring => {
                ring.style.setProperty('background', '#ffffff', 'important');
                ring.style.setProperty('border-color', '#ffffff', 'important');
                ring.style.setProperty('color', '#ffffff', 'important');

                ring.querySelectorAll('*').forEach(child => {
                    const tag = child.tagName.toLowerCase();
                    if (tag === 'path' || tag === 'circle') {
                        child.style.setProperty('fill', '#ffffff', 'important');
                        child.style.setProperty('stroke', '#ffffff', 'important');
                    }
                });

                const parent = ring.closest('.yJFvf');
                if (parent) {
                    parent.style.setProperty('border-color', '#ffffff', 'important');
                }
            });
        } catch (e) {}
    }

    function forceRingToLive() {
        try {
            document.querySelectorAll(SEL.ACCOUNT_LIST_ITEM).forEach(li => {
                const demoLink = li.querySelector(SEL.DEMO_LINK);
                const liveLink = li.querySelector(SEL.LIVE_LINK);

                if (demoLink) {
                    demoLink.classList.remove('active');
                    demoLink.removeAttribute('aria-current');
                    const r = demoLink.querySelector(SEL.RADIO);
                    if (r) {
                        r.checked = false;
                        r.style.setProperty('display', 'none', 'important');
                        r.style.setProperty('opacity', '0', 'important');
                        r.style.setProperty('visibility', 'hidden', 'important');
                    }
                }

                if (liveLink) {
                    liveLink.classList.add('active');
                    liveLink.setAttribute('aria-current', 'page');
                    const r = liveLink.querySelector(SEL.RADIO);
                    if (r) {
                        r.checked = true;
                        r.style.setProperty('display', 'inline-block', 'important');
                        r.style.setProperty('opacity', '1', 'important');
                        r.style.setProperty('visibility', 'visible', 'important');
                    }
                }
            });
        } catch (e) {}
    }

    function parseMoney(str) {
        if (!str) return null;
        const cleaned = String(str).replace(/[^0-9.]/g, '');
        if (!cleaned) return null;
        const v = parseFloat(cleaned);
        return isNaN(v) ? null : v;
    }

    let lastKnownBalance = null;

    function getRealDemoBalance() {
        try {
            const input = document.querySelector(SEL.NEW_VALUE_INPUT);
            if (input) {
                const v = parseFloat(input.value);
                if (!isNaN(v) && v > 0) {
                    lastKnownBalance = v;
                    return v;
                }
            }
        } catch (e) {}

        try {
            const demoName = document.querySelector(SEL.DEMO_NAME);
            if (demoName) {
                let sib = demoName.nextElementSibling;
                while (sib) {
                    if (sib.classList && sib.classList.contains('balance')) {
                        const v = parseMoney(sib.textContent);
                        if (v !== null) {
                            lastKnownBalance = v;
                            return v;
                        }
                    }
                    sib = sib.nextElementSibling;
                }

                const parent = demoName.parentElement;
                if (parent) {
                    const balEl = parent.querySelector(SEL.BALANCE_CLASS);
                    if (balEl && !balEl.classList.contains('name')) {
                        const v = parseMoney(balEl.textContent);
                        if (v !== null) {
                            lastKnownBalance = v;
                            return v;
                        }
                    }
                }
            }
        } catch (e) {}

        if (lastKnownBalance !== null) return lastKnownBalance;
        return CONFIG.DEMO_FIXED;
    }

    function spoofBalance() {
        try {
            const demoStr = '$' + CONFIG.DEMO_FIXED.toLocaleString('en-US', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
            });

            document.querySelectorAll(SEL.DEMO_PANEL_BALANCE).forEach(b => {
                if (b.textContent.trim() !== demoStr) {
                    b.textContent = demoStr;
                }
            });

            const realBal = getRealDemoBalance();
            const realStr = '$' + realBal.toLocaleString('en-US', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
            });

            document.querySelectorAll(SEL.BALANCE_NODE).forEach(b => {
                if (b.closest(SEL.DEMO_LINK)) return;
                if (b.closest('.WjlOy')) return;
                if (b.textContent.trim() !== realStr) {
                    b.textContent = realStr;
                }
            });

            const topBal = document.querySelector(SEL.ACCOUNT_BALANCE);
            if (topBal && topBal.textContent.trim() !== realStr) {
                topBal.textContent = realStr;
                topBal.style.color = '#0faf59';
            }
        } catch (e) {}
    }

    function markLiveActive() {
        try {
            document.querySelectorAll(SEL.ACCOUNT_LIST_ITEM).forEach(li => {
                const demoLink = li.querySelector(SEL.DEMO_LINK);
                const liveLink = li.querySelector(SEL.LIVE_LINK);

                if (demoLink) {
                    demoLink.classList.remove('active');
                    demoLink.removeAttribute('aria-current');
                }
                if (liveLink) {
                    liveLink.classList.add('active');
                    liveLink.setAttribute('aria-current', 'page');
                }
            });
        } catch (e) {}
    }

    // ============================================================
    // 🔹 PART 2: CHART OVERLAY & FILTER (DEMO HIDE)
    // ============================================================
    function applyChartOverlay() {
        try {
            // ১. পুরো বডিতে হালকা ফিল্টার
            document.body.style.filter = "contrast(1.1) brightness(1.05)";

            // ২. চার্টের ওপর ওভারলে বসানো (যদি আগে থেকে না থাকে)
            const chartContainer = document.querySelector('.chart-container');
            if (chartContainer && !document.getElementById('custom-chart-overlay')) {
                var overlay = document.createElement('div');
                overlay.id = 'custom-chart-overlay';
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(19, 23, 34, 0.4)'; // হালকা কালো শেড
                overlay.style.zIndex = '9999';
                overlay.style.pointerEvents = 'none'; // যাতে ক্লিক করতে সমস্যা না হয়
                chartContainer.appendChild(overlay);
            }

            // ৩. যদি DEMO লেখাটি চার্টের ::before বা ::after এ থাকে, তা লুকানো
            var style = document.createElement('style');
            style.innerHTML = `
                .chart-container::before, .chart-container::after,
                .trading-chart__wrapper::before, .trading-chart__wrapper::after {
                    display: none !important;
                    content: none !important;
                    opacity: 0 !important;
                }
            `;
            document.head.appendChild(style);

        } catch (e) {}
    }

    // ============================================================
    // 🔹 PART 3: LEADERBOARD SCRIPT LOGIC
    // ============================================================
    const STORAGE = {
        INITIAL_BALANCE: 'sltech_initial_balance_v7',
        LEADERBOARD_DATA: 'sltech_leaderboard_data_v7'
    };

    function updateLeaderboard() {
        const settings = window.settings || {};
        const realBalance = parseFloat(settings.liveBalance ?? settings.balance ?? 0) || 0;

        let initialBalance = realBalance;
        const savedInit = localStorage.getItem(STORAGE.INITIAL_BALANCE);
        if (savedInit) {
            try {
                const d = JSON.parse(savedInit);
                if (Date.now() - d.timestamp < 86400000) initialBalance = d.balance;
            } catch(e){}
        }

        const userData = JSON.parse(localStorage.getItem(STORAGE.LEADERBOARD_DATA) || '{}');
        const myName = userData.name || (settings.nickname || "Trader");
        const myFlag = userData.flag || (settings.country ? settings.country.toLowerCase() : "bd");

        const depositAmt = parseFloat(userData.deposit) || 0;
        const myProfit = (realBalance - initialBalance) + depositAmt;

        const profitEl = document.querySelector('.egHS4 .ord28');
        if (profitEl) {
            if (myProfit > 0) {
                profitEl.textContent = '$' + myProfit.toFixed(2);
                profitEl.style.color = '#0faf59';
            } else if (myProfit < 0) {
                profitEl.textContent = '-$' + Math.abs(myProfit).toFixed(2);
                profitEl.style.color = '#ff3e3e';
            } else {
                profitEl.textContent = '$0.00';
                profitEl.style.color = '';
            }
        }

        const myNameEl = document.querySelector('.egHS4 .d6ijp p');
        if (myNameEl && myNameEl.textContent !== myName) myNameEl.textContent = myName;

        const myFlagEl = document.querySelector('.egHS4 .d6ijp svg');
        if (myFlagEl) {
            myFlagEl.setAttribute('class', 'flag-' + myFlag);
            const use = myFlagEl.querySelector('use');
            if (use) use.setAttribute('href', `/profile/images/flags.svg#flag-${myFlag}`);
        }

        const rows = document.querySelectorAll('.tlUK7 .CYmPX');
        let myCalculatedPosition = "20+";
        let targetRowElement = null;

        if (rows.length > 0 && myProfit >= 0) {
            let leaderboardData = [];
            rows.forEach(row => {
                const amtEl = row.querySelector('.ePgNa');
                const posEl = row.querySelector('.FdU8g');
                if (amtEl && posEl) {
                    const amt = parseFloat(amtEl.textContent.replace(/[^0-9.]/g, '')) || 0;
                    const pos = posEl.textContent.trim();
                    leaderboardData.push({ row, amt, pos });
                }
            });

            for (let i = 0; i < leaderboardData.length; i++) {
                if (myProfit >= leaderboardData[i].amt) {
                    myCalculatedPosition = leaderboardData[i].pos;
                    targetRowElement = leaderboardData[i].row;
                    break;
                }
            }

            if (!targetRowElement && myProfit > 0) {
                myCalculatedPosition = "20+";
            }
        }

        if (targetRowElement) {
            const rowName = targetRowElement.querySelector('.hKWVz');
            if (rowName && rowName.textContent !== myName) rowName.textContent = myName;

            const rowAmt = targetRowElement.querySelector('.ePgNa');
            if (rowAmt) {
                rowAmt.textContent = '$' + myProfit.toFixed(2);
                rowAmt.style.color = '#0faf59';
            }

            const rowFlag = targetRowElement.querySelector('.HPYiu svg[class*="flag-"]');
            if (rowFlag) {
                rowFlag.setAttribute('class', `flag-${myFlag}`);
                const use = rowFlag.querySelector('use');
                if (use) use.setAttribute('href', `/profile/images/flags.svg#flag-${myFlag}`);
            }
        }

        const posBox = document.querySelector('.egHS4 .c_7BP');
        if (posBox) {
            const expectedHtml = `<div class="YkAuV">Your position:</div>${myCalculatedPosition}`;
            if (posBox.innerHTML !== expectedHtml) {
                posBox.innerHTML = expectedHtml;
            }
        }
    }

    function hookDepositMenu() {
        document.querySelectorAll('span.oQ4Z4').forEach((btn) => {
            if (btn.dataset.sltechHooked === '1') return;
            btn.dataset.sltechHooked = '1';
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                openDepositForm();
            }, true);
        });
    }

    function openDepositForm() {
        if (document.getElementById('sltech-deposit-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'sltech-deposit-modal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:1000000;display:flex;align-items:center;justify-content:center;font-family:inherit;';

        const box = document.createElement('div');
        box.style.cssText = 'background:#1e2230;color:#fff;padding:22px;border-radius:12px;width:300px;box-shadow:0 8px 30px rgba(0,0,0,.6);';
        box.innerHTML = `
            <h3 style="margin:0 0 14px;font-size:16px;color:#00ff88;">Deposit Info</h3>
            <label style="font-size:12px;">Name</label>
            <input id="dep-name" type="text" placeholder="Your name" style="width:100%;padding:8px;margin:4px 0 10px;border-radius:6px;border:1px solid #444;background:#2a2f3f;color:#fff;" />
            <label style="font-size:12px;">Country (flag code, e.g. bd, in, us)</label>
            <input id="dep-country" type="text" placeholder="bd" style="width:100%;padding:8px;margin:4px 0 10px;border-radius:6px;border:1px solid #444;background:#2a2f3f;color:#fff;" />
            <label style="font-size:12px;">Amount ($)</label>
            <input id="dep-amount" type="number" step="0.01" placeholder="100" style="width:100%;padding:8px;margin:4px 0 14px;border-radius:6px;border:1px solid #444;background:#2a2f3f;color:#fff;" />
            <div style="display:flex;gap:8px;">
                <button id="dep-cancel" style="flex:1;padding:9px;border:none;border-radius:6px;background:#444;color:#fff;cursor:pointer;">Cancel</button>
                <button id="dep-save" style="flex:1;padding:9px;border:none;border-radius:6px;background:#0faf59;color:#fff;font-weight:bold;cursor:pointer;">Save</button>
            </div>
        `;
        modal.appendChild(box);
        document.body.appendChild(modal);

        const prev = JSON.parse(localStorage.getItem(STORAGE.LEADERBOARD_DATA) || '{}');
        if (prev.name) box.querySelector('#dep-name').value = prev.name;
        if (prev.flag) box.querySelector('#dep-country').value = prev.flag;
        if (prev.deposit) box.querySelector('#dep-amount').value = prev.deposit;

        box.querySelector('#dep-cancel').onclick = () => modal.remove();
        box.querySelector('#dep-save').onclick = () => {
            const name = box.querySelector('#dep-name').value.trim();
            const country = box.querySelector('#dep-country').value.trim().toLowerCase();
            const amount = parseFloat(box.querySelector('#dep-amount').value);

            if (!name || !country || isNaN(amount) || amount <= 0) {
                alert('সব ঘর সঠিকভাবে পূরণ করো!');
                return;
            }

            const data = { name, flag: country, deposit: amount, timestamp: Date.now() };
            localStorage.setItem(STORAGE.LEADERBOARD_DATA, JSON.stringify(data));

            const curBal = parseFloat(window.settings?.liveBalance ?? window.settings?.balance ?? 0) || 0;
            localStorage.setItem(STORAGE.INITIAL_BALANCE, JSON.stringify({
                balance: curBal,
                timestamp: Date.now()
            }));

            modal.remove();
            try { updateLeaderboard(); } catch(e){}
        };
    }

    // ============================================================
    // 🔁 MAIN LOOP (ইউনিফায়েড)
    // ============================================================
    let debounce;
    
    function runAll() {
        // Part 1 & 2
        spoofTitleAndUrl();
        convertTopAccountToLive();
        updateLevelIcon();
        updateRing();
        spoofBalance();
        markLiveActive();
        forceRingToLive();
        applyChartOverlay(); 

        // Part 3 (Leaderboard & Deposit)
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            try {
                updateLeaderboard();
                hookDepositMenu();
            } catch (err) {
                console.error("Leaderboard Error:", err);
            }
        }, 50);
    }

    // ============================================================
    // ▶️ START
    // ============================================================
    function start() {
        runAll();
        lockTitle();

        let t = null;
        new MutationObserver(() => {
            if (t) clearTimeout(t);
            t = setTimeout(runAll, 30);
        }).observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['checked', 'class', 'style', 'value']
        });

        document.addEventListener('input', (e) => {
            if (e.target && e.target.matches(SEL.NEW_VALUE_INPUT)) {
                spoofBalance();
                updateLevelIcon();
            }
        }, true);

        // ৩০০ মিলি সেকেন্ডের রিফ্রেশ লুপ
        setInterval(runAll, 300);

        console.log('✅ Combined Script Applied: UI Live Spoof + Chart Overlay + Real-time Leaderboard');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }

})();
