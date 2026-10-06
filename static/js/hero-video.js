(function () {
    var video = document.getElementById('hero-video');
    var section = document.getElementById('heroVideoSection');
    var heroContent = document.getElementById('heroContent');
    var heroScroll = document.getElementById('heroScroll');
    var loader = document.getElementById('heroLoader');
    var fallback = document.querySelector('.hero-video-fallback');

    if (!video || !section) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var targetVideoTime = 0;
    var currentVideoTime = 0;
    var rafId = null;
    var videoReady = false;
    var smoothingFactor = 0.3;
    var seekThreshold = 0.015;

    function computeProgress() {
        var rect = section.getBoundingClientRect();
        var scrollable = section.offsetHeight - window.innerHeight;
        var scrolled = Math.max(0, -rect.top);
        return scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0;
    }

    function updateText(progress) {
        if (!heroContent) return;
        var opacity = 1;
        var translateY = 0;
        if (progress <= 0.2) {
            opacity = 1;
        } else if (progress <= 0.4) {
            var t = (progress - 0.2) / 0.2;
            opacity = 1 - t;
            translateY = -t * 30;
        } else {
            opacity = 0;
            translateY = -30;
        }
        heroContent.style.opacity = opacity;
        heroContent.style.transform = 'translateY(' + translateY + 'px)';
        if (heroScroll) {
            heroScroll.style.opacity = progress < 0.15 ? 1 : Math.max(0, 1 - (progress - 0.15) / 0.15);
        }
    }

    function onScroll() {
        var progress = computeProgress();
        if (videoReady && video.duration && isFinite(video.duration)) {
            targetVideoTime = progress * video.duration;
        }
        updateText(progress);
    }

    function animate() {
        var diff = targetVideoTime - currentVideoTime;
        currentVideoTime += diff * smoothingFactor;
        if (Math.abs(diff) > seekThreshold) {
            video.currentTime = currentVideoTime;
        }
        rafId = requestAnimationFrame(animate);
    }

    function startScrubbing() {
        videoReady = true;
        video.classList.add('ready');
        if (loader) loader.classList.remove('show');
        if (fallback) fallback.style.display = 'none';
        onScroll();
        if (!rafId) rafId = requestAnimationFrame(animate);
    }

    function onVideoError() {
        if (loader) loader.classList.remove('show');
        // Fallback image stays visible, video stays hidden
    }

    // Reduced motion: show static fallback image, no scrubbing
    if (prefersReducedMotion) {
        if (loader) loader.classList.remove('show');
        return;
    }

    // Show minimal loader while video prepares
    if (loader) loader.classList.add('show');

    if (video.readyState >= 2) {
        startScrubbing();
    } else {
        video.addEventListener('loadeddata', startScrubbing, { once: true });
        video.addEventListener('error', onVideoError, { once: true });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
})();
