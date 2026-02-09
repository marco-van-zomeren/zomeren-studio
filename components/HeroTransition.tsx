
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroTransition: React.FC = () => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: 'top bottom',
                    end: 'center center',
                    scrub: 1,
                    invalidateOnRefresh: true, // This is key for responsiveness
                },
            });

            tl.fromTo(
                videoRef.current,
                {
                    scale: 0.25,
                    // Calculate translation to position it 3em from bottom-right
                    x: () => {
                        const videoWidth = videoRef.current?.offsetWidth || 0;
                        const threeEm = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3;
                        // (Viewport center to right edge) - 3em - (half the scaled video's width)
                        return (window.innerWidth / 2) - threeEm - ((videoWidth * 0.25) / 2);
                    },
                    y: () => {
                        const videoHeight = videoRef.current?.offsetHeight || 0;
                        const threeEm = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3;
                        // (Viewport center to bottom edge) - 3em - (half the scaled video's height)
                        return (window.innerHeight / 2) - threeEm - ((videoHeight * 0.25) / 2);
                    },
                },
                {
                    scale: 1,
                    x: 0,
                    y: 0,
                    ease: 'none',
                }
            );

        }, triggerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={triggerRef} className="h-[120vh] relative">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                <video
                    ref={videoRef}
                    src="https://zomeren.studio/wp-content/uploads/2025/10/Carousel.mp4"
                    className="w-[70vw] max-w-4xl h-auto"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label="Zomeren studio projects showcase video"
                />
            </div>
        </div>
    );
};

export default HeroTransition;