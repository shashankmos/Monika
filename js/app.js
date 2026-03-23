// Premium Preloader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.progress-bar');
    
    // Smooth progress simulation
    gsap.to(progressBar, {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 1,
                delay: 0.5,
                onComplete: () => {
                    preloader.style.visibility = 'hidden';
                    // Trigger entrance of the first scene
                    gsap.from('.intro-scene .gsap-fade', {
                        y: 30,
                        opacity: 0,
                        duration: 1.2,
                        stagger: 0.2,
                        ease: 'power3.out'
                    });
                }
            });
        }
    });
});

// Target all scenes
const scenes = gsap.utils.toArray('.scene');

scenes.forEach((scene, i) => {
    const bgMedia = scene.querySelector('.bg-media');
    const caption = scene.querySelector('.bottom-caption');
    const introText = scene.querySelectorAll('.void-content h1, .void-content h2, .void-content p, .void-content div');
    const video = scene.querySelector('video');

    // 1. REFINED 3D DEPTH TRANSITIONS BETWEEN SECTIONS
    // Using a more subtle scale and translateZ for premium smoothness.
    gsap.fromTo(scene, 
        { z: -80, scale: 0.94, opacity: 0, filter: "blur(10px)" }, // Start more subtle
        {
            z: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            ease: "power2.out", 
            scrollTrigger: {
                trigger: scene,
                start: "top bottom", 
                end: "top top",      
                scrub: 1.2 // Added smoothing for scrub
            }
        }
    );

    // When the section leaves at the top, it scales up and fades out (cinematic exit)
    gsap.to(scene, {
        scale: 1.05,
        opacity: 0,
        filter: "blur(10px)",
        ease: "none",
        scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: "bottom top",
            scrub: 1.2
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
            start: "top 90%", 
            end: "bottom 10%",
            onEnter: () => { 
                video.play().catch(() => {
                    // Fallback if autoplay is blocked or fails
                    video.muted = true;
                    video.play();
                }); 
            },
            onLeave: () => { video.pause(); },
            onEnterBack: () => { video.play().catch(() => {}); },
            onLeaveBack: () => { video.pause(); }
        });

        // Error handling for black screens
        video.addEventListener('error', function() {
            console.error("Video failed to load:", video.currentSrc);
            video.style.display = 'none'; // Maybe show a poster image instead
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
