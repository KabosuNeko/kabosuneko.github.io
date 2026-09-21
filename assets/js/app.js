// Shared app logic: theme, clock, toast, email copy, about dialog, corner characters.
(function () {
    'use strict';

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

    // Runs before first paint, and again on DOM ready to update the toggle button.
    applyTheme();

    function toggleTheme() {
        themeMode = themeMode === 'auto' ? 'day' : (themeMode === 'day' ? 'night' : 'auto');
        localStorage.setItem('theme', themeMode);
        applyTheme();
    }

    function updateClock() {
        var now = new Date();
        var h = now.getHours();
        var m = now.getMinutes();
        document.getElementById('clock').textContent = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    }

    function showToast(msg) {
        var toast = document.getElementById('copyToast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(function () {
            toast.classList.remove('show');
        }, 2500);
    }

    function copyEmail(e) {
        e.preventDefault();
        navigator.clipboard.writeText('KabosuNeko@proton.me').then(function () {
            showToast('Copied to clipboard');
        }).catch(function () {});
    }

    function openAbout() {
        var dialog = document.getElementById('about');
        if (dialog) dialog.showModal();
    }

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
        el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                action();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        applyTheme();

        if (document.getElementById('clock')) {
            updateClock();
            setInterval(updateClock, 1000);
        }

        var themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
            if (themeMode === 'auto') applyTheme();
        });

        document.querySelectorAll('[data-copy-email]').forEach(function (link) {
            link.addEventListener('click', copyEmail);
        });

        var about = document.getElementById('about');
        if (about) {
            about.addEventListener('click', function (e) {
                if (e.target === about || e.target.closest('[data-about-close]')) about.close();
            });
        }

        bindCorner('nadeshiko', openAbout);
        bindCorner('rin', openGallery);
    });
})();
