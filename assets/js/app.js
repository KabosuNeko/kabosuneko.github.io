// Shared app logic: theme, clock, toast, email copy, Nadeshiko click-react, corner characters.
(function() {
    'use strict';

    // ---------- Theme ----------
    var themeMode = localStorage.getItem('theme') || 'auto';

    function getAutoTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
    }

    function applyTheme() {
        var theme = themeMode === 'auto' ? getAutoTheme() : themeMode;
        document.documentElement.setAttribute('data-theme', theme);
        var btn = document.getElementById('themeToggle');
        if (btn) {
            btn.textContent = themeMode === 'auto' ? 'A' : (themeMode === 'day' ? '☀' : '☾');
            btn.setAttribute('aria-label', 'Color theme: ' + themeMode + ' (click to change)');
        }
    }

    function toggleTheme() {
        themeMode = themeMode === 'auto' ? 'day' : (themeMode === 'day' ? 'night' : 'auto');
        localStorage.setItem('theme', themeMode);
        applyTheme();
    }

    // ---------- Clock ----------
    function updateClock() {
        var now = new Date();
        var h = now.getHours();
        var m = now.getMinutes();
        var el = document.getElementById('clock');
        if (el) {
            el.textContent = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
        }
    }

    // ---------- Toast ----------
    function showToast(msg) {
        var toast = document.getElementById('copyToast');
        if (!toast) return;
        toast.textContent = msg;
        toast.style.display = 'block';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function() {
            toast.style.display = 'none';
        }, 2500);
    }

    function copyEmail(e) {
        if (e) e.preventDefault();
        navigator.clipboard.writeText('KabosuNeko@proton.me').then(function() {
            showToast('🏕️ copied to clipboard');
        }).catch(function() {});
    }

    // ---------- Nadeshiko click-react ----------
    var NADE_LINES = [
        'Hmm! Tanoshi!! 🍡',
        'Oishii! 🍙',
        'Fuwafuwa~ ☁️',
        'Minna de camping! ⛺',
        'Yuru kyampu... 🌲',
        'Poka poka... 😊',
        'Mou, gohan? 🍜',
        'Ehehe~ 🏕️'
    ];
    var nadeTimer = null;

    function reactNadeshiko() {
        var el = document.querySelector('.nadeshiko');
        if (!el) return;
        el.classList.remove('bounce');
        void el.offsetWidth; // force reflow so the animation restarts on rapid clicks
        el.classList.add('bounce');
        var bubble = document.getElementById('nadeBubble');
        if (!bubble) return;
        bubble.textContent = NADE_LINES[Math.floor(Math.random() * NADE_LINES.length)];
        bubble.classList.add('show');
        clearTimeout(nadeTimer);
        nadeTimer = setTimeout(function() {
            bubble.classList.remove('show');
        }, 2400);
    }

    // ---------- Corner characters ----------
    function openGallery() {
        if (window.location.pathname.indexOf('gallery.html') !== -1) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.location.href = 'gallery.html';
        }
    }

    function bindCorner(charClass, action) {
        var el = document.querySelector('.' + charClass);
        if (!el) return;
        el.addEventListener('click', action);
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                action();
            }
        });
    }

    // ---------- Init ----------
    document.addEventListener('DOMContentLoaded', function() {
        applyTheme();
        updateClock();
        setInterval(updateClock, 1000);

        var themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

        var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (darkQuery.addEventListener) {
            darkQuery.addEventListener('change', function() {
                if (themeMode === 'auto') applyTheme();
            });
        }

        bindCorner('nadeshiko', reactNadeshiko);
        bindCorner('rin', openGallery);
    });

    // expose for inline onclick usage
    window.copyEmail = copyEmail;
})();