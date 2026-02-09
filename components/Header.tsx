
import React from 'react';

type Page = 'home' | 'work' | 'about';

interface HeaderProps {
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 p-6 md:p-8 text-sm text-[#E0E0E0] mix-blend-difference">
      <div className="max-w-full mx-auto flex justify-between items-center relative">
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Design</a>
          <button onClick={() => onNavigate('work')} className="hover:text-white transition-colors">Work</button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
           <button onClick={() => onNavigate('home')} className="font-medium hover:text-white transition-colors">
            zomeren.studio
          </button>
        </div>
        <div className="flex space-x-6">
          <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">About</button>
          <a href="#" className="hover:text-white transition-colors">Holism</a>
        </div>
      </div>
    </header>
  );
};

export default Header;