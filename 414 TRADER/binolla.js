// ==UserScript==
// @name         Replace Demo Account Box Icon
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Demo অ্যাকাউন্টের বক্স আইকনকে Real অ্যাকাউন্টের USD আইকনের মতো করে
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // প্রধান ফাংশন: আইকন প্রতিস্থাপন করবে
    function replaceDemoBoxIcon() {
        // 1. ডেমো অ্যাকাউন্টের সেই বিশেষ SVG আইকন যুক্ত ডিভটি খুঁজে বের করা
        //    এখানে 'sc-eZuMGc jBcTyS' ক্লাসের ভেতরের প্রথম ডিভটা (SVG ওয়ালা) টার্গেট করব
        const demoIconContainer = document.querySelector('#user-account-dropdown-trigger .sc-biptUy.hZjnOy .sc-eZuMGc.jBcTyS');

        if (demoIconContainer) {
            // 2. চেক করুন যে ইতিমধ্যে প্রতিস্থাপিত হয়েছে কিনা (যাতে বারবার কাজ না হয়)
            if (demoIconContainer.querySelector('img[src*="usd.svg"]')) {
                return; // 이미 পরিবর্তন হয়ে গেছে, কাজ করার দরকার নেই
            }

            // 3. পুরানো SVG কন্টেন্ট সরিয়ে ফেলা
            demoIconContainer.innerHTML = '';

            // 4. একটি নতুন ইমেজ এলিমেন্ট তৈরি করা, Real অ্যাকাউন্টের আইকনের পাথ দিয়ে
            const newIconImg = document.createElement('img');
            newIconImg.src = '/static/common/images/currencies/usd.svg';
            newIconImg.alt = 'USD';
            // Real অ্যাকাউন্টের ইমেজের মতোই স্টাইল দেওয়া (যদি প্রয়োজন হয়)
            newIconImg.style.width = '100%';
            newIconImg.style.height = '100%';

            // 5. নতুন আইকনকে কন্টেনারে যোগ করা
            demoIconContainer.appendChild(newIconImg);

            console.log('Demo অ্যাকাউন্টের বক্স আইকন সফলভাবে Real অ্যাকাউন্টের USD আইকনে পরিবর্তন করা হয়েছে।');
        } else {
            // এলিমেন্ট এখনো লোড হয়নি, আবার চেষ্টা করা
            setTimeout(replaceDemoBoxIcon, 500);
        }
    }

    // পেজ লোড হলে ফাংশনটি চালানো
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', replaceDemoBoxIcon);
    } else {
        replaceDemoBoxIcon();
    }

    // DOM-এ কোন পরিবর্তন হলে আবার চেক করার জন্য পর্যবেক্ষক
    const observer = new MutationObserver(function(mutations) {
        // পেজে নতুন নোড যোগ হলে চেক করুন
        for (let mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                // একটু দেরি করে চালানো, নিশ্চিত হতে যে সবকিছু লোড হয়েছে
                setTimeout(replaceDemoBoxIcon, 100);
                break;
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();