
import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

const Holism: React.FC = () => {
    return (
        <section className="py-24 px-6 md:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Part 1: Intro Text */}
                <AnimateOnScroll>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
                        <div className="md:col-span-2 text-sm text-gray-400">03</div>
                        <div className="md:col-span-4">
                            <p className="uppercase text-sm text-gray-400 mb-4 tracking-widest">HOLISM</p>
                            <p className="text-3xl md:text-4xl lg:text-5xl leading-tight">
                                I bring structure to chaos, polish to ideas, and intention to every detail.
                            </p>
                        </div>
                        <div className="md:col-span-6 md:col-start-7 self-end text-gray-300">
                            <p className="leading-relaxed">My work is sharp, considered, and purpose-driven. But it's my Libra Moon that softens the edges, bringing in harmony, beauty, and a deep sensitivity to what feels right. It's not just about design that works. It's about design that connects.</p>
                        </div>
                    </div>
                </AnimateOnScroll>

                {/* Part 2: Traits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 border-t border-gray-700 mb-24">
                    <AnimateOnScroll className="pt-8 pr-4">
                        <p className="text-8xl md:text-9xl text-gray-500">1</p>
                        <h3 className="text-3xl mt-4">Virgo sun</h3>
                        <p className="text-gray-400 mt-2">I bring structure to chaos, polish to ideas, and intention to every detail.</p>
                    </AnimateOnScroll>
                    <AnimateOnScroll className="pt-8 pr-4 border-t md:border-t-0 md:border-l border-gray-700 md:pl-8" delay={200}>
                         <p className="text-8xl md:text-9xl text-gray-500">2</p>
                        <h3 className="text-3xl mt-4">Libra Moon</h3>
                        <p className="text-gray-400 mt-2">Bringing in harmony, beauty, and a deep sensitivity to what feels right.</p>
                    </AnimateOnScroll>
                    <AnimateOnScroll className="pt-8 pr-4 border-t md:border-t-0 md:border-l border-gray-700 md:pl-8" delay={400}>
                         <p className="text-8xl md:text-9xl text-gray-500">3</p>
                        <h3 className="text-3xl mt-4">Leo Rising</h3>
                        <p className="text-gray-400 mt-2">I carry it all with confidence and creative direction.</p>
                    </AnimateOnScroll>
                </div>

                {/* Part 3: Manifesto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <AnimateOnScroll>
                        <img src="https://i.imgur.com/1vLd2yX.png" alt="Holism Design book" className="w-full aspect-square object-cover" />
                    </AnimateOnScroll>
                    <AnimateOnScroll className="text-center md:text-left" delay={200}>
                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tighter">Holism<br />Design</h2>
                        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                            <a href="#" className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors">READ MANIFEST</a>
                            <a href="#" className="group inline-flex items-center text-base text-white">
                                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                <span className="ml-2">BOOK AS SPEAKER</span>
                            </a>
                        </div>
                    </AnimateOnScroll>
                </div>
            </div>
        </section>
    );
};

export default Holism;