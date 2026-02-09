
import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

const Footer: React.FC = () => {
  return (
    <footer className="px-6 md:px-8 py-24 bg-[#0D0D0D] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium leading-tight">
                  Let's work together
                </h2>
                <a href="mailto:marco@zomeren.studio" className="text-2xl md:text-3xl text-gray-400 hover:text-white transition-colors duration-300 mt-4 inline-block">
                  marco@zomeren.studio
                </a>
              </div>
              <div className="flex flex-col md:items-end justify-between text-gray-400">
                  <div className="flex flex-col md:items-end space-y-3">
                      <a href="#" className="hover:text-white transition-colors">Instagram</a>
                      <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                      <a href="#" className="hover:text-white transition-colors">Twitter</a>
                  </div>
                  <div className="mt-12 md:mt-0 text-sm">
                      &copy; {new Date().getFullYear()} Zomeren Studio
                  </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
    </footer>
  );
};

export default Footer;
