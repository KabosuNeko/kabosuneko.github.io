// Hardcoded fallback list (auto-scanned from GitHub API when available).
var galleryFiles = [
    'photo_1_2026-04-18_16-19-12.webp',
    'photo_2_2026-04-18_15-26-06.webp',
    'photo_3_2026-04-18_15-26-06.webp',
    'photo_3_2026-04-18_16-19-12.webp',
    'photo_4_2026-04-18_15-26-06.webp',
    'photo_5_2026-04-18_15-26-06.webp',
    'photo_6_2026-04-18_15-26-06.webp',
    'photo_7_2026-04-18_15-26-06.webp',
    'photo_8_2026-04-18_15-26-06.webp',
    'photo_9_2026-04-18_15-26-06.webp',
    'photo_10_2026-04-18_15-26-06.webp',
    'photo_11_2026-04-18_15-26-06.webp',
    'photo_12_2026-04-18_15-26-06.webp',
    'photo_13_2026-04-18_15-26-06.webp',
    'photo_2026-04-18_16-21-14.webp'
];

var currentImageIndex = 0;

function fetchRemoteGallery() {
    var controller = new AbortController();
    var timeout = setTimeout(function() { controller.abort(); }, 5000);

    fetch('https://api.github.com/repos/KabosuNeko/kabosuneko.github.io/contents/assets/gallery', { signal: controller.signal })
        .then(function(res) {
            if (!res.ok) throw new Error('gallery fetch failed');
            return res.json();
        })
        .then(function(list) {
            clearTimeout(timeout);
            var webps = (Array.isArray(list) ? list : [])
                .filter(function(item) { return item.name && item.name.slice(-5).toLowerCase() === '.webp'; })
                .map(function(item) { return item.name; })
                .sort();
            if (webps.length > 0 && webps.join('\n') !== galleryFiles.join('\n')) {
                galleryFiles = webps;
                loadGallery();
            }
        })
        .catch(function() {
            clearTimeout(timeout);
        });
}

function loadGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid || galleryFiles.length === 0) return;
    grid.innerHTML = '';
    galleryFiles.forEach(function(filename, index) {
        var item = document.createElement('div');
        item.className = 'gallery-item';
        item.onclick = function() { openLightbox(index); };
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
        var img = document.createElement('img');
        img.src = 'assets/gallery/' + filename;
        img.alt = 'Gallery photo ' + (index + 1);
        img.loading = 'lazy';
        item.appendChild(img);
        grid.appendChild(item);
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    var lightbox = document.getElementById('lightbox');
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleLightboxKeys);
}

function closeLightbox(e) {
    if (e && e.target.classList.contains('lightbox-nav')) return;
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleLightboxKeys);
}

function changeImage(direction, e) {
    if (e) e.stopPropagation();
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = galleryFiles.length - 1;
    if (currentImageIndex >= galleryFiles.length) currentImageIndex = 0;
    updateLightboxImage();
}

function preloadImage(index) {
    var img = new Image();
    img.src = 'assets/gallery/' + galleryFiles[index];
}

function updateLightboxImage() {
    var filename = galleryFiles[currentImageIndex];
    document.getElementById('lightboxImg').src = 'assets/gallery/' + filename;
    document.getElementById('lightboxCaption').textContent = (currentImageIndex + 1) + ' / ' + galleryFiles.length;
    if (galleryFiles.length > 1) {
        preloadImage((currentImageIndex + 1) % galleryFiles.length);
        preloadImage((currentImageIndex - 1 + galleryFiles.length) % galleryFiles.length);
    }
}

function handleLightboxKeys(e) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
}

document.addEventListener('DOMContentLoaded', function() {
    loadGallery();
    fetchRemoteGallery();
});