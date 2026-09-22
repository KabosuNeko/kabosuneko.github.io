// Shared app logic: theme, clock, toast, email copy, Nadeshiko greeting, corner characters.
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

    var GREETINGS = {
        morning: ['Ohayou!', 'Morning, camper.', 'Breakfast time.'],
        afternoon: ['Konnichiwa!', 'Nice weather today.', 'Tea break?'],
        evening: ['Konbanwa!', 'Campfire time.', 'Dinner smells good.'],
        night: ['Oyasumi...', 'Still up?', 'Mata ashita!']
    };
    var nadeTimer = null;

    function greetNadeshiko() {
        var el = document.querySelector('.nadeshiko');
        var bubble = document.getElementById('nadeBubble');
        if (!el || !bubble) return;
        el.classList.remove('bounce');
        void el.offsetWidth; // restart the bounce animation
        el.classList.add('bounce');
        var h = new Date().getHours();
        var slot = h < 5 ? 'night' : h < 11 ? 'morning' : h < 17 ? 'afternoon' : h < 22 ? 'evening' : 'night';
        var lines = GREETINGS[slot];
        bubble.textContent = lines[Math.floor(Math.random() * lines.length)];
        bubble.classList.add('show');
        clearTimeout(nadeTimer);
        nadeTimer = setTimeout(function () {
            bubble.classList.remove('show');
        }, 3000);
    }

    function updateStars() {
        var tags = document.querySelectorAll('.tag[data-repo]');
        if (!tags.length) return;
        fetch('https://api.github.com/users/KabosuNeko/repos?per_page=100')
            .then(function (res) { return res.ok ? res.json() : null; })
            .then(function (list) {
                if (!Array.isArray(list)) return;
                var stars = {};
                list.forEach(function (repo) { stars[repo.name.toLowerCase()] = repo.stargazers_count; });
                tags.forEach(function (tag) {
                    var count = stars[tag.getAttribute('data-repo').toLowerCase()];
                    if (typeof count === 'number') {
                        tag.textContent = tag.getAttribute('data-lang') + ' · ' + count + '★';
                    }
                });
            })
            .catch(function () {});
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

        updateStars();

        var nade = document.querySelector('.nadeshiko');
        if (nade) {
            nade.addEventListener('click', greetNadeshiko);
            setTimeout(greetNadeshiko, 500); // greet once shortly after the page appears
        }
    });
})();
