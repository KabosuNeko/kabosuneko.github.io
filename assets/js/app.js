// Shared app logic: theme, clock, toast, email copy, Nadeshiko greeting, corner characters.
(function () {
    'use strict';

    var themeMode = localStorage.getItem('theme') || 'auto';

    function getAutoTheme() {
        var hour = new Date().getHours();
        return hour >= 6 && hour < 18 ? 'day' : 'night';
    }

    function applyTheme() {
        var theme = themeMode === 'auto' ? getAutoTheme() : themeMode;
        var root = document.documentElement;
        // Flip without a cross-fade, then let hover transitions work again on the next frame.
        root.classList.add('no-transition');
        root.setAttribute('data-theme', theme);
        requestAnimationFrame(function () { root.classList.remove('no-transition'); });
        // Browser chrome follows the page background; the token stays the single source of truth.
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            var bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
            if (bg) meta.setAttribute('content', bg);
        }
        var btn = document.getElementById('themeToggle');
        if (btn) {
            btn.textContent = themeMode === 'auto' ? '◐' : (themeMode === 'day' ? '☀' : '☾');
            btn.setAttribute('aria-label', 'Color theme: ' + themeMode + ' (click to change)');
        }
    }

    // Runs before first paint, and again on DOM ready to update the toggle button.
    // The pre-paint pass now lives in an inline script in each page's head; keep the rule in sync.
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
        var href = e.currentTarget.getAttribute('href') || '';
        // A modified click belongs to the browser, and without a clipboard API the link
        // should do what it says: open the mail client.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (!navigator.clipboard || !navigator.clipboard.writeText) return;
        e.preventDefault();
        navigator.clipboard.writeText(href.replace(/^mailto:/, '')).then(function () {
            showToast('Copied to clipboard');
        }).catch(function () {
            window.location.href = href;
        });
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
                    if (typeof count !== 'number') return;
                    var lang = tag.getAttribute('data-lang');
                    tag.textContent = lang + ' · ' + count;
                    // The star comes from the sprite: the rounded font has no U+2605, so a text
                    // glyph would be drawn by whichever symbol font the visitor happens to have.
                    var star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    star.setAttribute('role', 'img');
                    star.setAttribute('aria-label', 'stars');
                    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                    use.setAttribute('href', '#icon-star');
                    star.appendChild(use);
                    tag.appendChild(star);
                });
            })
            .catch(function () {});
    }

    // Camp check: the one part of the page that reaches outside itself. Weather comes from
    // Open-Meteo and camp sites from OpenStreetMap, both without a key, both needing attribution.
    var DEFAULT_PLACE = { lat: 21.0285, lon: 105.8542, label: 'Hanoi (default)' };
    var OVERPASS = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.openstreetmap.fr/api/interpreter' // the .de instance 504s under load
    ];
    var CACHE_V = 'v1'; // bump when a cached object changes shape
    var FORECAST_DAYS = 7;
    var WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var WEATHER_CODES = {
        0: 'Clear sky', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Overcast',
        45: 'Fog', 48: 'Freezing fog', 51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
        61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain',
        71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
        80: 'Light showers', 81: 'Showers', 82: 'Violent showers', 85: 'Snow showers', 86: 'Snow showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Thunderstorm with hail'
    };
    var campPlace = null; // remembered between runs so changing the radius does not ask again

    function storeGet(key, ttl) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return null;
            var v = JSON.parse(raw);
            if (!v || Date.now() - v.t > ttl) return null;
            return v.d;
        } catch (e) { return null; }
    }

    function storeSet(key, data) {
        try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d: data })); } catch (e) {}
    }

    function fetchJson(url, ms) {
        var ctl = 'AbortController' in window ? new AbortController() : null;
        var timer = setTimeout(function () { if (ctl) ctl.abort(); }, ms);
        return fetch(url, ctl ? { signal: ctl.signal } : {}).then(function (res) {
            clearTimeout(timer);
            if (!res.ok) throw new Error('http ' + res.status);
            return res.json();
        }).catch(function (err) {
            clearTimeout(timer);
            throw err;
        });
    }

    function locate() {
        // Some browsers neither answer nor fail when no location provider is available, so the
        // page never waits longer than this before falling back to the default place.
        var WAIT_MS = 2500;
        return new Promise(function (resolve) {
            var done = false;
            var settle = function (value) {
                if (done) return;
                done = true;
                resolve(value);
            };
            setTimeout(function () { settle({ place: DEFAULT_PLACE, sure: false }); }, WAIT_MS);
            if (!navigator.geolocation) return settle({ place: DEFAULT_PLACE, sure: false });
            navigator.geolocation.getCurrentPosition(function (pos) {
                settle({
                    place: { lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'your position' },
                    sure: true
                });
            }, function () {
                settle({ place: DEFAULT_PLACE, sure: false });
            }, { timeout: WAIT_MS, maximumAge: 600000 });
        });
    }

    function distanceKm(a, lat, lon) {
        var R = 6371, rad = Math.PI / 180;
        var dLat = (lat - a.lat) * rad, dLon = (lon - a.lon) * rad;
        var s = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(a.lat * rad) * Math.cos(lat * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return Math.round(2 * R * Math.asin(Math.sqrt(s)) * 10) / 10;
    }

    function loadWeather(place) {
        var key = CACHE_V + ':wx:' + place.lat.toFixed(2) + ',' + place.lon.toFixed(2);
        var cached = storeGet(key, 20 * 60 * 1000);
        if (cached) return Promise.resolve(cached);
        var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + place.lat + '&longitude=' + place.lon +
            '&current=temperature_2m,precipitation,weather_code,wind_speed_10m' +
            '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum' +
            '&forecast_days=' + FORECAST_DAYS + '&timezone=auto';
        return fetchJson(url, 8000).then(function (d) {
            var days = (d.daily.time || []).map(function (date, i) {
                return {
                    date: date,
                    code: d.daily.weather_code[i],
                    tmax: d.daily.temperature_2m_max[i],
                    tmin: d.daily.temperature_2m_min[i],
                    rain: d.daily.precipitation_probability_max[i],
                    sum: d.daily.precipitation_sum[i]
                };
            });
            var w = {
                temp: d.current.temperature_2m,
                code: d.current.weather_code,
                wind: d.current.wind_speed_10m,
                tmax: d.daily.temperature_2m_max[0],
                tmin: d.daily.temperature_2m_min[0],
                rain: d.daily.precipitation_probability_max[0],
                sum: d.daily.precipitation_sum[0],
                days: days
            };
            storeSet(key, w);
            return w;
        });
    }

    function loadCamps(place, radiusM) {
        var km = Math.round(radiusM / 1000);
        var key = CACHE_V + ':camp:' + km + ':' + place.lat.toFixed(2) + ',' + place.lon.toFixed(2);
        var cached = storeGet(key, 24 * 60 * 60 * 1000);
        if (cached) return Promise.resolve(cached);
        var query = '[out:json][timeout:25];nwr["tourism"="camp_site"](around:' + radiusM + ',' +
            place.lat + ',' + place.lon + ');out center 60;';
        // Try the instance that answered last time first: the primary spend 7 s under load.
        var last = storeGet(CACHE_V + ':mirror', Infinity);
        var order = OVERPASS.slice();
        if (last && order.indexOf(last) > 0) {
            order.splice(order.indexOf(last), 1);
            order.unshift(last);
        }
        var attempt = function (i) {
            if (i >= order.length) return Promise.reject(new Error('overpass unavailable'));
            return fetchJson(order[i] + '?data=' + encodeURIComponent(query), 7000)
                .then(function (d) {
                    storeSet(CACHE_V + ':mirror', order[i]);
                    return d.elements || [];
                })
                .catch(function () { return attempt(i + 1); });
        };
        return attempt(0).then(function (els) {
            var sites = els.map(function (e) {
                var lat = e.lat !== undefined ? e.lat : (e.center && e.center.lat);
                var lon = e.lon !== undefined ? e.lon : (e.center && e.center.lon);
                if (lat === undefined || lon === undefined) return null;
                return {
                    name: (e.tags && e.tags.name) || 'Unnamed camp site',
                    km: distanceKm(place, lat, lon),
                    url: 'https://www.openstreetmap.org/' + e.type + '/' + e.id
                };
            }).filter(function (s) { return s && s.km <= km; })
                .sort(function (a, b) { return a.km - b.km; })
                .slice(0, 20);
            storeSet(key, sites);
            return sites;
        });
    }

    function campVerdict(w) {
        if (w.sum >= 5 || w.rain >= 60) return 'Rain is likely — bring a tarp.';
        if (w.tmin <= 8) return 'Cold night ahead — pack a warmer bag.';
        if (w.wind >= 35) return 'Windy — look for a sheltered pitch.';
        return 'Good night for a camp.';
    }

    function osmFallback() {
        var p = document.createElement('p');
        p.className = 'camp-meta';
        p.appendChild(document.createTextNode('OpenStreetMap did not answer just now — its Overpass instances get busy. '));
        var a = document.createElement('a');
        a.href = 'https://www.openstreetmap.org/#map=10/' +
            campPlace.place.lat.toFixed(3) + '/' + campPlace.place.lon.toFixed(3);
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = 'Look it up on openstreetmap.org';
        p.appendChild(a);
        p.appendChild(document.createTextNode('.'));
        return p;
    }

    function line(className, text) {
        var p = document.createElement('p');
        p.className = className;
        p.textContent = text;
        return p;
    }

    function dayLabel(isoDate) {
        var d = new Date(isoDate + 'T12:00:00');
        return WEEKDAYS[d.getDay()];
    }

    function renderCamp(loc, state) {
        var weather = state.weather, camps = state.camps;
        var body = document.getElementById('campBody');
        if (!body) return;
        body.textContent = '';

        if (!loc.sure) body.appendChild(line('camp-loc', 'No location permission, so this is ' + loc.place.label + '.'));
        if (!weather && !camps) {
            if (!(state.weatherDone && state.campsDone)) {
                body.appendChild(line('camp-meta', 'Checking the sky…'));
                return;
            }
            body.appendChild(line('camp-meta', 'Cannot reach the forecast right now.'));
            body.appendChild(osmFallback());
            return;
        }

        if (weather) {
            var row = document.createElement('p');
            row.className = 'camp-weather';
            var temp = document.createElement('span');
            temp.className = 'camp-weather-temp';
            temp.textContent = Math.round(weather.temp) + '°C';
            var desc = document.createElement('span');
            desc.className = 'camp-weather-desc';
            desc.textContent = WEATHER_CODES[weather.code] || 'Weather code ' + weather.code;
            row.appendChild(temp);
            row.appendChild(desc);
            body.appendChild(row);
            body.appendChild(line('camp-meta',
                'Rain today ' + weather.rain + '% · ' + Math.round(weather.tmin) + '–' + Math.round(weather.tmax) +
                '°C · wind ' + Math.round(weather.wind) + ' km/h'));
            body.appendChild(line('camp-verdict', campVerdict(weather)));

            if (weather.days && weather.days.length > 1) {
                body.appendChild(line('camp-section', 'Next ' + weather.days.length + ' days'));
                var days = document.createElement('ul');
                days.className = 'camp-days';
                weather.days.forEach(function (d) {
                    var li = document.createElement('li');
                    var name = document.createElement('span');
                    name.className = 'camp-day-name';
                    name.textContent = dayLabel(d.date);
                    var cond = document.createElement('span');
                    cond.className = 'camp-day-cond';
                    cond.textContent = WEATHER_CODES[d.code] || '';
                    var temps = document.createElement('span');
                    temps.className = 'camp-day-temps';
                    temps.textContent = Math.round(d.tmin) + '–' + Math.round(d.tmax) + '°';
                    var rain = document.createElement('span');
                    rain.className = 'camp-day-rain';
                    rain.textContent = d.rain + '%';
                    li.appendChild(name);
                    li.appendChild(cond);
                    li.appendChild(temps);
                    li.appendChild(rain);
                    days.appendChild(li);
                });
                body.appendChild(days);
            }
        }

        var radiusKm = document.getElementById('campRadius') ? Math.round(document.getElementById('campRadius').value / 1000) : 50;
        var heading = camps && camps.length
            ? camps.length + ' camp site' + (camps.length === 1 ? '' : 's') + ' within ' + radiusKm + ' km'
            : 'Camp sites within ' + radiusKm + ' km';
        body.appendChild(line('camp-section', heading));
        if (!camps && !state.campsDone) {
            body.appendChild(line('camp-meta', 'Looking for camp sites…'));
        } else if (!camps) {
            body.appendChild(osmFallback());
        }
        if (camps && camps.length) {
            var list = document.createElement('ul');
            list.className = 'camp-list';
            camps.forEach(function (s) {
                var li = document.createElement('li');
                var a = document.createElement('a');
                a.href = s.url;
                a.target = '_blank';
                a.rel = 'noopener';
                var name = document.createElement('span');
                name.textContent = s.name;
                var dist = document.createElement('span');
                dist.className = 'camp-dist';
                dist.textContent = s.km + ' km';
                a.appendChild(name);
                a.appendChild(dist);
                li.appendChild(a);
                list.appendChild(li);
            });
            body.appendChild(list);
        } else if (camps) {
            body.appendChild(line('camp-meta', 'Nothing mapped in OpenStreetMap at this radius — the map is thin outside cities.'));
        }

        var credit = document.createElement('p');
        credit.className = 'camp-credit';
        var osm = document.createElement('a');
        osm.href = 'https://www.openstreetmap.org/copyright';
        osm.target = '_blank';
        osm.rel = 'noopener';
        osm.textContent = '© OpenStreetMap contributors';
        credit.appendChild(osm);
        credit.appendChild(document.createTextNode(' · Weather: '));
        var om = document.createElement('a');
        om.href = 'https://open-meteo.com/';
        om.target = '_blank';
        om.rel = 'noopener';
        om.textContent = 'Open-Meteo.com';
        credit.appendChild(om);
        body.appendChild(credit);
    }

    function runCampCheck(askAgain) {
        var body = document.getElementById('campBody');
        if (!body) return;
        var select = document.getElementById('campRadius');
        var radiusM = select ? parseInt(select.value, 10) : 50000;
        if (!campPlace || askAgain) {
            body.textContent = '';
            body.appendChild(line('camp-meta', 'Looking for you…'));
            return locate().then(function (found) {
                campPlace = found;
                return runCampCheck(false);
            });
        }
        // Each half paints as soon as it lands: the forecast is quick, Overpass can take seconds
        // (and up to two mirrors) so the list must not hold the weather hostage.
        var state = { weather: null, camps: null, weatherDone: false, campsDone: false };
        var paint = function () { renderCamp(campPlace, state); };
        paint();
        loadWeather(campPlace.place).then(function (w) {
            state.weather = w;
            state.weatherDone = true;
            paint();
        }, function () {
            state.weatherDone = true;
            paint();
        });
        loadCamps(campPlace.place, radiusM).then(function (c) {
            state.camps = c;
            state.campsDone = true;
            paint();
        }, function () {
            state.campsDone = true;
            paint();
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        applyTheme();

        if (document.getElementById('clock')) {
            updateClock();
            // One write per displayed minute instead of 60: re-align to the next minute.
            (function scheduleClock() {
                var now = new Date();
                var delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50;
                setTimeout(function () { updateClock(); scheduleClock(); }, delay);
            })();
        }

        var themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

        document.querySelectorAll('[data-copy-email]').forEach(function (link) {
            link.addEventListener('click', copyEmail);
        });

        updateStars();

        var nade = document.querySelector('.nadeshiko');
        if (nade) {
            // On the camp page she re-runs the lookup; every other page links her to that page.
            if (nade.tagName === 'BUTTON' && document.getElementById('campBody')) {
                nade.addEventListener('click', function () {
                    greetNadeshiko();
                    runCampCheck(true);
                });
            }
            setTimeout(greetNadeshiko, 500); // greet once shortly after the page appears
        }

        if (document.getElementById('campBody')) {
            var radius = document.getElementById('campRadius');
            if (radius) radius.addEventListener('change', function () { runCampCheck(false); });
            var relocate = document.getElementById('campLocate');
            if (relocate) relocate.addEventListener('click', function () { runCampCheck(true); });
            runCampCheck(true);
        }
    });
})();
