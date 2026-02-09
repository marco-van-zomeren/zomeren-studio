
import React, { useRef, useEffect } from 'react';
import AnimateOnScroll from './AnimateOnScroll';

const useParallax = (ref: React.RefObject<HTMLElement>, speed: number) => {
    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Only apply effect when element is somewhat in view
                if (rect.top < windowHeight && rect.bottom > 0) {
                    const positionInViewport = (windowHeight / 2 - (rect.top + rect.height / 2)) / (windowHeight / 2);
                    const offset = positionInViewport * speed * 75; // Multiplier controls intensity
                    ref.current.style.transform = `translateY(${offset}px)`;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Set initial position on load

        return () => window.removeEventListener('scroll', handleScroll);
    }, [ref, speed]);
};


const Intro: React.FC = () => {
    const image1Ref = useRef<HTMLDivElement>(null);
    const image2Ref = useRef<HTMLDivElement>(null);

    // Negative speed moves the element up faster than the scroll
    useParallax(image1Ref, -0.2);
    // Positive speed moves the element up slower than the scroll
    useParallax(image2Ref, 0.1);

    return (
        <section className="py-24 px-6 md:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <AnimateOnScroll>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-2 text-sm text-gray-400">01</div>
                        <div className="md:col-span-7">
                            <p className="uppercase text-sm text-gray-400 mb-4 tracking-widest">ABOUT</p>
                            <p className="text-3xl md:text-4xl lg:text-5xl leading-tight">
                                Marco is a designer with a holistic approach, whose strength lies in understanding, visualizing and shaping core values.
                            </p>
                            <a href="#" className="group inline-flex items-center mt-8 text-base text-white">
                                 <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                 <span className="ml-2">FULL STORY</span>
                            </a>
                        </div>
                    </div>
                </AnimateOnScroll>

                <AnimateOnScroll className="mt-32" delay={200}>
                    <div className="text-[12vw] md:text-[9.5vw] font-bold leading-none tracking-tighter uppercase">
                        <p className="text-right flex justify-end items-center gap-x-[1vw]">
                            <span className="text-[0.8em]">✦</span>
                            <span>CREATIVES</span>
                        </p>
                        <p>ARE THE</p>
                        
                        <div className="grid grid-cols-12 items-center gap-x-4 md:gap-x-8 my-[-2vw] md:my-[-1.5vw] h-[1px]">
                            <div ref={image1Ref} className="col-span-5 md:col-span-4 col-start-2 md:col-start-3">
                                <img src="https://i.imgur.com/qL6pS4N.png" alt="Medigo design on tablet" className="w-full aspect-[4/3] object-cover" />
                            </div>
                            <div ref={image2Ref} className="col-span-5 md:col-span-4 col-start-8">
                                <img src="https://i.imgur.com/gK1qYyT.png" alt="Ultimo design on laptop" className="w-full aspect-[4/3] object-cover" />
                            </div>
                        </div>
                        
                        <p className="text-right">NEW</p>
                        <p>CHAMPIONS</p>
                    </div>
                </AnimateOnScroll>
            </div>
        </section>
    );
};

export default Intro;