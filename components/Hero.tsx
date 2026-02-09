
import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-8 pt-32 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16 items-center">
        <AnimateOnScroll className="md:col-span-2">
          <img src="https://i.imgur.com/K1bL2d8.png" alt="Marco van Zomeren" className="w-full grayscale aspect-[4/5] object-cover" />
          <p className="mt-6 text-sm text-gray-400 leading-relaxed">
            Creative hub of Marco van Zomeren. Senior Brand / Visual Designer at KR Communicatie, formerly at WADM + Bold over well behaved so something beautiful never beholds boring.
          </p>
        </AnimateOnScroll>
        <div className="md:col-span-3 relative">
          <AnimateOnScroll delay={200}>
            <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-medium leading-tight">
              <span className="text-4xl align-middle">✦</span> Making brands resonate with their highest potential.
            </h1>
            <p className="mt-6 text-3xl md:text-4xl text-gray-500">
              Let the sun shine on your socials
            </p>
            <a href="#" className="group inline-flex items-center mt-16 text-xl text-white">
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              <span className="ml-2">Let's work</span>
            </a>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default Hero;