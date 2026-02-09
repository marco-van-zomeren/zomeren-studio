
import React, { useState, useEffect } from 'react';

const AboutPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div
          className={`transition-all ease-out duration-1000 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-8">
              <h1 className="text-4xl md:text-6xl leading-tight">
                A designer with a holistic approach, whose strength lies in understanding, visualizing and shaping core values.
              </h1>
              <div className="text-gray-400 leading-relaxed space-y-6 mt-12 text-lg">
                <p>
                  For over 15 years, I've partnered with startups and established companies to build compelling brands and digital experiences. My process is rooted in 'Holism'—the idea that the whole is greater than the sum of its parts. I don't just design logos or websites; I build interconnected systems that resonate with audiences and drive business goals.
                </p>
                <p>
                  My work combines sharp, purpose-driven design with a deep sensitivity for what feels right. I bring structure to chaos and intention to every detail, ensuring the final product is not only beautiful but also effective and meaningful.
                </p>
              </div>
            </div>
            <div className="md:col-span-4 space-y-12">
              <div>
                <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Services</h2>
                <ul className="space-y-2 text-lg">
                  <li>Branding & Identity</li>
                  <li>Web Design & Development</li>
                  <li>Art Direction</li>
                  <li>UI/UX Design</li>
                  <li>Motion Design</li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Selected Clients</h2>
                <ul className="space-y-2 text-lg">
                  <li>Google</li>
                  <li>Nike</li>
                  <li>Patta</li>
                  <li>Ace & Tate</li>
                  <li>A.P.C.</li>
                </ul>
              </div>
              <div>
                <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Contact</h2>
                <a href="mailto:marco@zomeren.studio" className="text-lg hover:text-white transition-colors">
                  marco@zomeren.studio
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;