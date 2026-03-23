// js/app.js
gsap.registerPlugin(ScrollTrigger);

// Utility to apply premium film grain via a tiny SVG data URI dynamically
const grainSVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;
const style = document.createElement('style');
style.innerHTML = `
    body::after {
        background-image: radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%), ${grainSVG};
        opacity: 0.18;
    }
`;
document.head.appendChild(style);

// Target all scenes
const scenes = gsap.utils.toArray('.scene');

scenes.forEach((scene, i) => {
    const bgMedia = scene.querySelector('.bg-media');
    const caption = scene.querySelector('.bottom-caption');
    const introText = scene.querySelectorAll('.void-content h1, .void-content h2, .void-content p, .void-content div');
    const video = scene.querySelector('video');

    // 1. 3D DEPTH TRANSITIONS BETWEEN SECTIONS
    // When a scene scrolls into view, it scales up smoothly from the back (translateZ).
    // This perfectly mimics high-end immersive feeds.
    gsap.fromTo(scene, 
        { z: -150, scale: 0.9, opacity: 0 },
        {
            z: 0,
            scale: 1,
            opacity: 1,
            ease: "none", // Scrubbed linearly with scroll
            scrollTrigger: {
                trigger: scene,
                start: "top bottom", 
                end: "top top",      
                scrub: true
            }
        }
    );

    // When the section leaves at the top, it scales down slightly and fades out
    gsap.to(scene, {
        scale: 0.85,
        opacity: 0,
        yPercent: -5,
        ease: "none",
        scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // 2. BACKGROUND LAYER PARALLAX (Slow speed)
    if (bgMedia) {
        // Continuous offset for 3D depth feeling while scrubbing
        gsap.fromTo(bgMedia, 
            { yPercent: -10 },
            {
                yPercent: 10,
                ease: "none",
                scrollTrigger: {
                    trigger: scene,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );

        // ENTRY PAN: Soft cinematic zoom as it enters
        gsap.fromTo(bgMedia,
            { scale: 1.08 },
            {
                scale: 1,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: scene,
                    start: "top 60%", // Triggers slightly before snapping
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    }

    // 3. MID & FOREGROUND LAYER (Captions / Floating Text)
    if (caption) {
        // Blur, fade, and upward motion for an emotional entry
        gsap.fromTo(caption, 
            { opacity: 0, y: 50, filter: "blur(6px)" },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: scene,
                    start: "top 65%", 
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    }

    // Void scenes (Intro/Outro text)
    if (introText.length > 0) {
        gsap.fromTo(introText,
            { opacity: 0, y: 40, filter: "blur(8px)" },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.2,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: scene,
                    start: "top 60%",
                    toggleActions: "play none none reverse" // Keep text visible once played initially
                }
            }
        );
    }

    // 4. VIDEO CINEMATIC EXPERIENCE
    if (video) {
        // Auto-play / Pause logic optimized for viewport boundaries
        ScrollTrigger.create({
            trigger: scene,
            start: "top 80%", 
            end: "bottom 20%",
            onEnter: () => { video.play().catch(() => {}); },
            onLeave: () => { video.pause(); },
            onEnterBack: () => { video.play().catch(() => {}); },
            onLeaveBack: () => { video.pause(); }
        });
        
        // Very slow intrinsic zoom (continuous scaling while scrolling) 
        // adds immediate professional tension
        gsap.to(video, {
            scale: 1.04, 
            ease: "none", 
            scrollTrigger: {
                trigger: scene,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }
});
