// Photo lightbox for the static gallery grid.
(function () {
    'use strict';

    var dialog = document.getElementById('lightbox');
    var grid = document.querySelector('.gallery-grid');
    if (!dialog || !grid) return;

    var photos = Array.prototype.slice.call(grid.querySelectorAll('img'));
    var image = document.getElementById('lightboxImg');
    var caption = document.getElementById('lightboxCaption');
    var current = 0;

    function show(index) {
        current = (index + photos.length) % photos.length;
        image.src = photos[current].src;
        image.alt = photos[current].alt;
        caption.textContent = (current + 1) + ' / ' + photos.length;
    }

    grid.addEventListener('click', function (e) {
        var item = e.target.closest('.gallery-item');
        if (!item) return;
        show(photos.indexOf(item.querySelector('img')));
        dialog.showModal();
    });

    dialog.addEventListener('click', function (e) {
        if (e.target.closest('.lightbox-prev')) show(current - 1);
        else if (e.target.closest('.lightbox-next')) show(current + 1);
        else if (!e.target.closest('.lightbox-img')) dialog.close();
    });

    dialog.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') show(current - 1);
        if (e.key === 'ArrowRight') show(current + 1);
    });
})();
