const video = document.getElementById('hero-video');
const section = document.getElementById('heroVideoSection');

if (video && section) {
    const shopUrl = video.dataset.shopUrl;
    let redirected = false;
    let rafId = null;

    function updateVideo() {
        rafId = null;
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -rect.top);
        const progress = scrollable > 0 ? Math.min(1, Math.max(0, scrolled / scrollable)) : 0;

        if (video.duration && isFinite(video.duration)) {
            video.currentTime = progress * video.duration;
        }

        if (progress >= 0.985 && !redirected) {
            redirected = true;
            window.location.href = shopUrl;
        }
    }

    function onScroll() {
        if (rafId === null) {
            rafId = requestAnimationFrame(updateVideo);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    video.addEventListener('loadedmetadata', updateVideo);
    updateVideo();
}
