/*
 * Scroll-driven hero video ("scrubbing").
 *
 * The video is NEVER played: scroll position maps to video.currentTime.
 *   scroll listener  -> only computes targetTime (cheap, passive, no layout reads)
 *   rAF loop         -> eases currentTime toward targetTime and seeks the video
 *
 * Encoding matters more than JS for smooth scrubbing. The source asset had a
 * single keyframe for the whole clip, so every seek decoded from frame 0.
 * The files in /static/uploads were re-encoded for random access:
 *   ffmpeg -i src.mp4 -an -c:v libx264 -preset slow -crf 21 -g 4 -keyint_min 4 \
 *          -sc_threshold 0 -bf 0 -pix_fmt yuv420p -movflags +faststart hero-video.mp4
 *   (mobile: -vf scale=854:-2 -crf 23 -profile:v main; webm: libvpx-vp9 -crf 34 -g 4)
 * Preferred characteristics: keyframe every ~4 frames (or all-intra), no
 * B-frames, no audio track, moov atom at the front, <=1280px wide, moderate bitrate.
 *
 * The whole file is downloaded into a Blob before scrubbing starts, so seeks
 * never wait on network range requests.
 */
(function () {
    var video = document.getElementById('hero-video');
    var section = document.getElementById('heroVideoSection');
    if (!video || !section) return;

    var heroContent = document.getElementById('heroContent');
    var heroScroll = document.getElementById('heroScroll');
    var loader = document.getElementById('heroLoader');
    var fallback = document.querySelector('.hero-video-fallback');

    var EASE_SPEED = 14;      // higher = tighter to scroll (per second, frame-rate independent)
    var SEEK_EPSILON = 1 / 60; // skip seeks smaller than ~ half a frame at 24fps
    var SNAP_EPSILON = 0.002;

    var duration = 0;
    var ready = false;
    var targetTime = 0;
    var currentTime = 0;
    var rafId = 0;
    var lastTs = 0;
    var sectionTop = 0;
    var scrollable = 1;
    var lastProgress = -1;

    // Never let the browser play it on its own.
    video.autoplay = false;
    video.loop = false;
    video.muted = true;
    video.addEventListener('play', function () { video.pause(); });

    function measure() {
        // Layout read only on load/resize, never per scroll event.
        sectionTop = section.getBoundingClientRect().top + window.scrollY;
        scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
    }

    function progress() {
        var p = (window.scrollY - sectionTop) / scrollable;
        return p < 0 ? 0 : p > 1 ? 1 : p;
    }

    function updateText(p) {
        if (!heroContent) return;
        var t = p <= 0.15 ? 0 : p >= 0.35 ? 1 : (p - 0.15) / 0.2;
        heroContent.style.opacity = 1 - t;
        heroContent.style.transform = 'translate3d(0,' + (-t * 30) + 'px,0)';
        if (heroScroll) heroScroll.style.opacity = p < 0.1 ? 1 : Math.max(0, 1 - (p - 0.1) / 0.1);
    }

    function onScroll() {
        var p = progress();
        if (p === lastProgress) return;
        lastProgress = p;
        updateText(p);
        if (!ready) return;
        // Final frame sits just before `duration` (seeking exactly to duration can blank on some browsers).
        targetTime = p * Math.max(0, duration - 0.04);
        if (!rafId) { lastTs = 0; rafId = requestAnimationFrame(tick); }
    }

    function tick(ts) {
        var dt = lastTs ? Math.min(0.1, (ts - lastTs) / 1000) : 1 / 60;
        lastTs = ts;
        var diff = targetTime - currentTime;

        if (Math.abs(diff) < SNAP_EPSILON) {
            currentTime = targetTime;
        } else {
            currentTime += diff * (1 - Math.exp(-EASE_SPEED * dt));
        }

        // Don't queue a new seek while the decoder is still busy with the last one.
        if (!video.seeking && Math.abs(video.currentTime - currentTime) > SEEK_EPSILON) {
            video.currentTime = currentTime;
        } else if (!video.seeking && currentTime === targetTime && video.currentTime !== targetTime) {
            video.currentTime = targetTime; // exact landing at start/end
        }

        if (currentTime === targetTime && !video.seeking) { rafId = 0; return; }
        rafId = requestAnimationFrame(tick);
    }

    function setLoader(p) {
        if (loader) loader.style.setProperty('--p', p);
    }

    function reveal() {
        ready = true;
        duration = video.duration;
        measure();
        lastProgress = -1;
        onScroll();
        currentTime = targetTime; // start at the frame matching the current scroll (e.g. after refresh)
        video.currentTime = currentTime;
        video.classList.add('ready');
        if (loader) { setLoader(1); setTimeout(function () { loader.classList.remove('show'); }, 250); }
        if (fallback) setTimeout(function () { fallback.style.display = 'none'; }, 700);
    }

    function fail() {
        if (loader) loader.classList.remove('show');
        video.removeAttribute('src');
        video.style.display = 'none'; // fallback image remains visible
    }

    function pickSource() {
        var small = Math.min(window.innerWidth, window.innerHeight) <= 768 ||
                    (navigator.connection && navigator.connection.saveData);
        if (small && video.dataset.srcMobile) return video.dataset.srcMobile;
        // H.264 is hardware-decoded almost everywhere (best for seeking); WebM only if MP4 is unsupported.
        if (video.canPlayType('video/mp4; codecs="avc1.640028"')) return video.dataset.srcMp4;
        return video.dataset.srcWebm || video.dataset.srcMp4;
    }

    function attach(url) {
        video.addEventListener('loadeddata', function () {
            if (isFinite(video.duration) && video.duration > 0) reveal(); else fail();
        }, { once: true });
        video.addEventListener('error', fail, { once: true });
        video.src = url;
        video.load();
    }

    function loadFully(url) {
        // Stream into a Blob so the progress bar is real and seeking is fully local.
        fetch(url).then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            var total = +res.headers.get('Content-Length') || 0;
            if (!res.body || !total) return res.blob();
            var reader = res.body.getReader();
            var chunks = [];
            var loaded = 0;
            return (function pump() {
                return reader.read().then(function (r) {
                    if (r.done) return new Blob(chunks, { type: res.headers.get('Content-Type') || 'video/mp4' });
                    chunks.push(r.value);
                    loaded += r.value.length;
                    setLoader(loaded / total * 0.95);
                    return pump();
                });
            })();
        }).then(function (blob) {
            attach(URL.createObjectURL(blob));
        }).catch(function () {
            attach(url); // network streaming fallback (still scrubs, just less buffered)
        });
    }

    measure();
    updateText(progress());
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { measure(); lastProgress = -1; onScroll(); }, { passive: true });
    window.addEventListener('load', function () { measure(); lastProgress = -1; onScroll(); });

    // Reduced motion: static hero (fallback image), no scrubbing, no video download.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.style.display = 'none';
        return;
    }

    if (loader) loader.classList.add('show');
    loadFully(pickSource());
})();
