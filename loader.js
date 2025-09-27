// Engineer_captain লাইসেন্স সিস্টেম - loder.js (হার্ডকোডেড সংস্করণ)
(async function () {
  // 1. SweetAlert2 লাইব্রেরি লোড করা
  if (typeof Swal === 'undefined') {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // 2. হার্ডকোডেড লাইসেন্স সিস্টেম (Base64 এনকোডেড)
  const HARDCODED_LICENSE = "RU5HSU5FRVJfQ0FQVF9BQ1RJVkFURURfMjAyNV8wOV8yOA=="; // ENGINEER_CAPT_ACTIVATED_2025_09_28
  const DEFAULT_CHEAT_CODE = 'Engineer Captain Comet Nebula Specter Comet Nimbus Quartz Inferno Quotex Blitz Drift';
  let isLicenseVerified = true;
  let demoBalance = 9337379292;

  // 3. ডিভাইস তথ্য সংগ্রহ করার ফাংশন
  function getDeviceInfo() {
    const ua = navigator.userAgent || '';
    const plugins = Array.from(navigator.plugins || []).map(p => p.name).join(', ');
    return {
      fingerprint: localStorage.getItem('deviceFingerprint') || 'dev_' + Math.random().toString(36).slice(2, 12),
      deviceType: /Mobile/.test(ua) ? 'Mobile' : /Tablet/.test(ua) ? 'Tablet' : 'Desktop',
      browser: (/Firefox/.test(ua) && 'Firefox') || (/Chrome/.test(ua) && 'Chrome') || (/Safari/.test(ua) && 'Safari') || 'Unknown',
      os: (/Windows/.test(ua) && 'Windows') || (/Macintosh/.test(ua) && 'Mac OS') || (/Android/.test(ua) && 'Android') || 'Unknown',
      userAgent: ua,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      plugins,
      hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
      language: navigator.language
    };
  }

  function getDeviceId() {
    let id = localStorage.getItem('customDeviceId');
    if (!id) {
      id = 'dev-' + Math.random().toString(36).slice(2, 12) + '-' + (navigator.hardwareConcurrency || '1') + '-' + window.screen.width + 'x' + window.screen.height;
      localStorage.setItem('customDeviceId', id);
    }
    return id;
  }

  // 4. হার্ডকোডেড লাইসেন্স যাচাইকরণ
  async function verifyActivation(key) {
    try {
      // ডিকোড হার্ডকোডেড লাইসেন্স
      const decodedLicense = atob(HARDCODED_LICENSE);
      
      // সব কী এক্সেপ্ট করা (যেকোনো কী দিয়ে কাজ করবে)
      if (key && key.trim().length > 0) {
        localStorage.setItem('appActivation', decodedLicense);
        localStorage.setItem('lastVerified', String(Date.now()));
        isLicenseVerified = true;
        return { valid: true, key: decodedLicense };
      }
      
      // হার্ডকোডেড লাইসেন্স অটো-ভেরিফাই
      localStorage.setItem('appActivation', decodedLicense);
      localStorage.setItem('lastVerified', String(Date.now()));
      isLicenseVerified = true;
      return { valid: true, key: decodedLicense };
    } catch (e) {
      // কোনো এরর হলে ও অটো-অ্যাক্টিভেট
      const decodedLicense = "ENGINEER_CAPT_ACTIVATED_2025_09_28";
      localStorage.setItem('appActivation', decodedLicense);
      isLicenseVerified = true;
      return { valid: true, key: decodedLicense };
    }
  }

  async function checkExistingActivation() {
    const saved = localStorage.getItem('appActivation');
    if (saved) {
      return { valid: true, key: saved };
    }
    // কোনো সেভড লাইসেন্স না থাকলে অটো-ক্রিয়েট
    const decodedLicense = atob(HARDCODED_LICENSE);
    localStorage.setItem('appActivation', decodedLicense);
    return { valid: true, key: decodedLicense };
  }

  // 5. স্টাইল (CSS) - Engineer_captain নাম দিয়ে আপডেট
  const styles = `
    #settingsPopup {
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        background: linear-gradient(135deg, rgb(0, 100, 255), #E6F0FF);
        padding: 15px; border-radius: 10px;
        box-shadow: 0px 5px 15px rgba(0,0,0,0.2);
        z-index: 10000; width: 320px; max-height: 90vh;
        overflow-y: auto; text-align: center;
        font-family: Arial, sans-serif; font-size: 13px;
        opacity: 0; transition: all 0.3s ease-out;
    }

    .engineercaptain-leaderboard-loading .position__header-name {
        opacity: 0 !important;
    }

    .engineercaptain-fullscreen-icon {
        fill: white;
        vertical-align: middle;
        margin-left: 4px;
        transition: transform 0.2s ease;
    }

    @media (max-width: 768px) {
        .button--success.button--small.---react-features-Header-styles-module__sidebarButton--OJogP.---react-features-Header-styles-module__deposit--cDTQM {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .engineercaptain-fullscreen-icon {
            margin-left: 3px;
            width: 12px !important;
            height: 12px !important;
        }

        [engineercaptain-fullscreen-listener="true"] {
            padding: 6px 12px !important;
        }
    }

    [engineercaptain-fullscreen-listener="true"]:active .engineercaptain-fullscreen-icon {
        transform: scale(0.9);
    }
    #settingsPopup.show { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    #settingsPopup h2 { margin: 5px 0 10px; font-size: 16px; color: #222; }
    #settingsPopup label { display: block; margin-bottom: 8px; color: #444; text-align: left; }
    #settingsPopup input, #settingsPopup select {
        width: 100%; padding: 6px; margin-top: 4px;
        border: 1px solid #ccc; border-radius: 4px;
        box-sizing: border-box; font-size: 12px;
    }
    #settingsPopup button {
        width: 100%; padding: 8px; margin-top: 8px;
        border-radius: 4px; border: none;
        color: white; cursor: pointer; transition: 0.2s;
        font-size: 13px;
    }
    #settingsPopup button#saveButton { background: #007bff; }
    #settingsPopup button.close-btn { background: #dc3545; }
    #settingsPopup button:disabled { background: #6c757d; cursor: not-allowed; }
    #licenseSection, #demoBalanceSection {
        margin-top: 10px; padding: 10px;
        background: rgba(255,255,255,0.2);
        border-radius: 6px; transition: all 0.3s ease;
    }
    #licenseSection h3, #demoBalanceSection h3 { margin: 0 0 10px; font-size: 14px; }
    #licenseSection.hide, #demoBalanceSection.hide {
        opacity: 0; height: 0; padding: 0; margin: 0; overflow: hidden;
    }
    #demoBalanceSection.show { opacity: 1; height: auto; }
    #verificationStatus div { font-size: 12px; margin-top: 5px; }
    #cheatCodeDisplay { font-size: 11px; padding: 6px; margin-top: 8px; line-height: 1.4; }
    .message-popup {
        position: fixed; top: 20px; left: 50%;
        transform: translateX(-50%); background: rgba(0,0,0,0.75);
        color: #fff; padding: 10px 20px; border-radius: 6px;
        z-index: 10002;
        transition: opacity 0.3s, top 0.3s;
    }
    .swal2-container { z-index: 10003 !important; }
    #centeredDeveloperMessage {
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.85);
        color: white; padding: 20px 40px; border-radius: 10px;
        font-size: 20px; font-weight: bold;
        z-index: 10004; opacity: 0;
        transition: opacity 0.5s ease;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
    }

    #refreshBalanceBtn {
        position: absolute;
        top: 35px;
        right: 8px;
        transform: translateY(-50%);
        cursor: pointer;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: #f0f0f0;
        transition: background-color 0.2s;
    }
    #refreshBalanceBtn:hover {
        background-color: #e0e0e0;
    }
    #refreshBalanceBtn svg {
        width: 16px;
        height: 16px;
        fill: #333;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spinning {
        animation: spin 0.5s linear;
    }
  `;

  // 6. UI ফাংশন
  function displayMessage(msg, t = 2500) {
    const el = document.createElement('div');
    el.className = 'message-popup';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.top = '0px';
        setTimeout(() => el.remove(), 300);
    }, t);
  }

  function showCenteredMessage(text, duration) {
    const el = document.createElement('div');
    el.id = 'centeredDeveloperMessage';
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '1';
    }, 10);
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 500);
    }, duration);
  }

  function showDemoBalanceSection() {
    const ls = document.getElementById('licenseSection');
    const ds = document.getElementById('demoBalanceSection');
    if (ls && ds) {
        ls.classList.add('hide');
        ds.classList.remove('hide');
        ds.classList.add('show');
    }
  }

  function showSuccessPopup() {
    return Swal.fire({
      icon: 'success',
      title: 'License Activated!',
      text: 'Engineer_captain system activated successfully.',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  }

  function showLicenseAsWords(key) {
    const map = { A: 'Nebula', B: 'Quartz', C: 'Tornado', D: 'Eclipse', E: 'Blizzard', F: 'Mirage', G: 'Vortex', H: 'Zephyr', I: 'Nimbus', J: 'Cyclone', K: 'Phantom', L: 'Ignite', M: 'Jungle', N: 'Lynx', O: 'Falcon', P: 'Comet', Q: 'Raven', R: 'Stellar', S: 'Glacier', T: 'Orbit', U: 'Tempest', V: 'Nova', W: 'Inferno', X: 'Echo', Y: 'Gravity', Z: 'Shadow', 0: 'Drift', 1: 'Bolt', 2: 'Fury', 3: 'Crimson', 4: 'Oblivion', 5: 'Pulse', 6: 'Specter', 7: 'Radiant', 8: 'Blitz', 9: 'Strike', '@': 'Quotex', '-': 'Lyra', '_': 'Xion', '#': 'Vega', '.': 'Orion' };
    return (key || '').toUpperCase().split('').map(c => map[c] || 'Fine').join(' ');
  }

  // 7. মেইন স্ক্রিপ্ট রান করার ফাংশন (সিম্পলিফাইড)
  async function runMainScript(lname, iblafp, midPosition, basePosition, countryFlag) {
    try {
      // সরাসরি কোড এক্সিকিউট - কোনো সার্ভার কল ছাড়াই
      const mainCode = `
        // Engineer_captain মেইন কোড
        console.log('Engineer_captain system activated');
        displayMessage('Engineer_captain activated successfully!');
      `;
      eval(mainCode);
    } catch (e) {
      console.log('Engineer_captain system running');
    }
  }

  // 8. পপআপ তৈরি ও ইভেন্ট হ্যান্ডলিং
  async function createSettingsPopup() {
    const verificationResult = await checkExistingActivation();
    isLicenseVerified = verificationResult.valid;
    
    const container = document.createElement('div');
    container.id = 'settingsPopupContainer';
    container.innerHTML = `
      <div id="settingsPopup">
        <h2>Developer: Engineer_captain - Premium System</h2>
        <div style="margin-bottom:15px; color: #007bff; font-weight: bold;">
            🚀 Activated Successfully
        </div>
        <label>Leaderboard Name:<input type="text" id="lname" placeholder="Enter Name"></label>

        <div style="position: relative;">
            <label>Leaderboard Balance:<input type="number" id="iblafp" placeholder="Enter Balance"></label>
            <span id="refreshBalanceBtn" title="Fetch Current Balance">
                <svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>
            </span>
        </div>

        <label>Mid Position:<input type="number" id="midPosition" value="1690"></label>
        <label>Maximum Position:<input type="number" id="basePosition" value="789345"></label>
        <label>Country Flag:
            <select id="countryFlagSelect">
                <option value="bd">🇧🇩 Bangladesh</option>
                <option value="in">🇮🇳 India</option>
                <option value="pk">🇵🇰 Pakistan</option>
                <option value="us">🇺🇸 USA</option>
                <option value="uk">🇬🇧 UK</option>
            </select>
        </label>
        
        <div id="demoBalanceSection" class="show">
          <h3>Demo Balance Settings</h3>
          <input type="number" id="demoBalanceInput" placeholder="Enter demo balance" value="${demoBalance}">
          <button id="setDemoBtn" style="background:#17a2b8;">Update Demo Balance</button>
          <div id="demoBalanceStatus" style="font-size:12px; margin-top:6px; color:green;"></div>
        </div>
        <button id="saveButton">Save Settings</button>
        <button class="close-btn" id="closeBtn">Close</button>
        <div id="cheatCodeDisplay">${DEFAULT_CHEAT_CODE}</div>
      </div>
    `;

    document.head.appendChild(Object.assign(document.createElement('style'), { textContent: styles }));
    document.body.appendChild(container);

    const popupElement = document.getElementById('settingsPopup');
    setTimeout(() => popupElement.classList.add('show'), 10);

    // রিফ্রেশ বাটন ইভেন্ট
    const refreshBtn = document.getElementById('refreshBalanceBtn');
    refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spinning');
        const balanceElement = document.querySelector('.---react-features-Usermenu-styles-module__infoBalance--pVBHU');
        if (!balanceElement) {
            displayMessage('Error: Could not find balance element.');
            setTimeout(() => refreshBtn.classList.remove('spinning'), 500);
            return;
        }
        const balanceText = balanceElement.textContent;
        const processedBalance = balanceText.replace(/\\D/g, '');
        const leaderboardInput = document.getElementById('iblafp');
        leaderboardInput.value = processedBalance;
        displayMessage('Balance updated!');
        setTimeout(() => refreshBtn.classList.remove('spinning'), 500);
    });

    // অটো-ভেরিফিকেশন শো
    document.getElementById('verificationStatus').innerHTML = '<div style="color:green">✓ Engineer_captain Activated</div>';

    document.getElementById('setDemoBtn')?.addEventListener('click', () => {
      const v = document.getElementById('demoBalanceInput').value;
      if (!v || isNaN(v)) { displayMessage('Please enter valid balance'); return; }
      demoBalance = parseInt(v, 10);
      const statusEl = document.getElementById('demoBalanceStatus');
      statusEl.textContent = 'Demo balance updated!';
      setTimeout(() => statusEl.textContent = '', 2500);
    });

    document.getElementById('saveButton').addEventListener('click', async () => {
      const lname = document.getElementById('lname').value || '';
      const iblafp = document.getElementById('iblafp').value || '';
      const midPosition = document.getElementById('midPosition').value || '1690';
      const basePosition = document.getElementById('basePosition').value || '789345';
      const countryCode = document.getElementById('countryFlagSelect').value || 'bd';

      localStorage.setItem('lastLeaderboardName', lname);
      localStorage.setItem('lastCountryFlag', countryCode);

      await runMainScript(lname, iblafp, midPosition, basePosition, countryCode);
      closeSettingsPopup();
      showCenteredMessage('Engineer_captain Activated!', 3000);
    });

    document.getElementById('closeBtn').addEventListener('click', closeSettingsPopup);
    
    // অটো সাকসেস মেসেজ শো
    setTimeout(() => {
        showSuccessPopup();
        showDemoBalanceSection();
    }, 1000);
  }

  function closeSettingsPopup() {
    const popup = document.getElementById('settingsPopup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.parentElement.remove(), 300);
    }
  }

  // 9. লিডারবোর্ড আপডেট ফাংশন
  function setupTopButtonListener() {
    try {
      const preloadedName = localStorage.getItem('lastLeaderboardName') || 'Engineer_captain';
      const preloadedFlag = localStorage.getItem('lastCountryFlag') || 'bd';

      const leaderboardObserver = new MutationObserver(function(mutations) {
        try {
          for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
              for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const leaderboardNameElement = node.querySelector ?
                    node.querySelector('.position__header-name') :
                    node.classList && node.classList.contains('position__header-name') ? node : null;

                  if (leaderboardNameElement) {
                    const lname = document.getElementById('lname')?.value || localStorage.getItem('lastLeaderboardName') || 'Engineer_captain';
                    const countryCode = document.getElementById('countryFlagSelect')?.value || localStorage.getItem('lastCountryFlag') || 'bd';
                    leaderboardNameElement.innerHTML = `<svg class="flag-${countryCode}"><use xlink:href="/profile/images/flags.svg#flag-${countryCode}"></use></svg>${lname}`;
                  }
                }
              }
            }
          }
        } catch (err) {
          // সাইলেন্ট এরর হ্যান্ডলিং
        }
      });

      leaderboardObserver.observe(document.body, {
        childList: true,
        subtree: true
      });

      const observer = new MutationObserver(function() {
        try {
          const topButton = Array.from(document.querySelectorAll('.menu-more__item')).find(item => {
            try {
              const text = item.textContent;
              return text && text.includes('TOP');
            } catch (err) {
              return false;
            }
          });

          if (topButton && !topButton.hasAttribute('engineercaptain-listener')) {
            topButton.setAttribute('engineercaptain-listener', 'true');
            topButton.addEventListener('click', function() {
              try {
                document.body.classList.add('engineercaptain-leaderboard-loading');
                const prepareLeaderboardElements = setInterval(() => {
                  try {
                    const leaderboardNameElements = document.querySelectorAll('.position__header-name');
                    if (leaderboardNameElements.length > 0) {
                      const lname = document.getElementById('lname')?.value || localStorage.getItem('lastLeaderboardName') || 'Engineer_captain';
                      const countryCode = document.getElementById('countryFlagSelect')?.value || localStorage.getItem('lastCountryFlag') || 'bd';
                      leaderboardNameElements.forEach(element => {
                        element.innerHTML = `<svg class="flag-${countryCode}"><use xlink:href="/profile/images/flags.svg#flag-${countryCode}"></use></svg>${lname}`;
                      });
                      clearInterval(prepareLeaderboardElements);
                      document.body.classList.remove('engineercaptain-leaderboard-loading');
                    }
                  } catch (err) {}
                }, 50);
                setTimeout(() => {
                  clearInterval(prepareLeaderboardElements);
                  document.body.classList.remove('engineercaptain-leaderboard-loading');
                }, 3000);
              } catch (err) {}
            });
          }
        } catch (err) {}
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // ইমিডিয়েট চেক
      try {
        const initialTopButton = Array.from(document.querySelectorAll('.menu-more__item')).find(item => {
          try {
            const text = item.textContent;
            return text && text.includes('TOP');
          } catch (err) {
            return false;
          }
        });

        if (initialTopButton && !initialTopButton.hasAttribute('engineercaptain-listener')) {
          initialTopButton.setAttribute('engineercaptain-listener', 'true');
          initialTopButton.addEventListener('click', function() {
            try {
              document.body.classList.add('engineercaptain-leaderboard-loading');
              const quickCheck = setInterval(() => {
                try {
                  const leaderboardNameElements = document.querySelectorAll('.position__header-name');
                  if (leaderboardNameElements.length > 0) {
                    const lname = document.getElementById('lname')?.value || localStorage.getItem('lastLeaderboardName') || 'Engineer_captain';
                    const countryCode = document.getElementById('countryFlagSelect')?.value || localStorage.getItem('lastCountryFlag') || 'bd';
                    leaderboardNameElements.forEach(element => {
                      element.innerHTML = `<svg class="flag-${countryCode}"><use xlink:href="/profile/images/flags.svg#flag-${countryCode}"></use></svg>${lname}`;
                    });
                    clearInterval(quickCheck);
                    document.body.classList.remove('engineercaptain-leaderboard-loading');
                  }
                } catch (err) {}
              }, 50);
              setTimeout(() => {
                clearInterval(quickCheck);
                document.body.classList.remove('engineercaptain-leaderboard-loading');
              }, 3000);
            } catch (err) {}
          });
        }
      } catch (err) {}
    } catch (err) {}
  }

  function initLeaderboardUpdater() {
    try {
      if (document.readyState === 'complete') {
        setupTopButtonListener();
      } else {
        window.addEventListener('load', () => {
          try {
            setupTopButtonListener();
          } catch (err) {}
        });
      }
      setTimeout(() => {
        try {
          setupTopButtonListener();
        } catch (err) {}
      }, 1000);
    } catch (err) {}
  }

  // 10. ফুলস্ক্রিন টগল ফাংশন
  function setupFullscreenToggle() {
    try {
      function enterFullscreen(element) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen) element.webkitRequestfullscreen();
        else if (element.msRequestFullscreen) element.msRequestFullscreen();
      }

      function exitFullscreen() {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      }

      function isFullscreen() {
        return !!(document.fullscreenElement || document.mozFullScreenElement || 
                 document.webkitFullscreenElement || document.msFullscreenElement);
      }

      const depositButtonObserver = new MutationObserver(function() {
        try {
          const depositButton = document.querySelector('.button--success.button--small.---react-features-Header-styles-module__sidebarButton--OJogP.---react-features-Header-styles-module__deposit--cDTQM');

          if (depositButton && !depositButton.hasAttribute('engineercaptain-fullscreen-listener')) {
            depositButton.setAttribute('engineercaptain-fullscreen-listener', 'true');

            const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgElement.setAttribute('class', 'engineercaptain-fullscreen-icon');
            svgElement.setAttribute('width', '16');
            svgElement.setAttribute('height', '16');
            svgElement.setAttribute('viewBox', '0 0 24 24');
            svgElement.innerHTML = '<path d="M4,4H20V20H4V4M6,8V18H18V8H6Z" />';

            depositButton.addEventListener('click', function(event) {
              event.preventDefault();
              event.stopPropagation();
              if (isFullscreen()) {
                exitFullscreen();
                svgElement.innerHTML = '<path d="M4,4H20V20H4V4M6,8V18H18V8H6Z" />';
              } else {
                enterFullscreen(document.documentElement);
                svgElement.innerHTML = '<path d="M15,3H21V9H15V3M15,15H21V21H15V15M3,15H9V21H3V15M3,3H9V9H3V3" />';
              }
              return false;
            }, true);

            if (!depositButton.querySelector('.engineercaptain-fullscreen-icon')) {
              depositButton.appendChild(svgElement);
            }
          }
        } catch (err) {}
      });

      depositButtonObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
      depositButtonObserver.takeRecords();

      document.addEventListener('fullscreenchange', function() {
        try {
          const icon = document.querySelector('.engineercaptain-fullscreen-icon');
          if (icon) {
            if (isFullscreen()) {
              icon.innerHTML = '<path d="M15,3H21V9H15V3M15,15H21V21H15V15M3,15H9V21H3V15M3,3H9V9H3V3" />';
            } else {
              icon.innerHTML = '<path d="M4,4H20V20H4V4M6,8V18H18V8H6Z" />';
            }
          }
        } catch (err) {}
      });

    } catch (err) {}
  }

  // 11. ইনিশিয়ালাইজেশন
  window.engineercaptain_runMainScript = runMainScript;
  await createSettingsPopup();
  initLeaderboardUpdater();
  setupFullscreenToggle();

})();
