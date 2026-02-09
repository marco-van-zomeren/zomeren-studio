
import React, { useState, useEffect } from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import { Project } from '../types';

interface WorkProps {
  onProjectSelect: (id: number) => void;
}

const Work: React.FC<WorkProps> = ({ onProjectSelect }) => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const response = await fetch('/cms/projects.json');
        const allProjects: Project[] = await response.json();
        setFeaturedProjects(allProjects.slice(0, 2));
      } catch (error) {
        console.error("Failed to fetch featured projects:", error);
      }
    };
    fetchFeaturedProjects();
  }, []);

  return (
    <section className="py-24 px-6 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll>
          <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <div className="mb-8 md:mb-0">
              <p className="text-sm text-gray-400">02</p>
              <p className="uppercase text-sm text-gray-400 mt-2 tracking-widest">WORK</p>
              <p className="text-3xl md:text-4xl lg:text-5xl mt-4 max-w-xl leading-tight">
                Senior Brand / Visual designer at KR Communicatie, formerly at WADM.
              </p>
            </div>
            <a href="#" className="group inline-flex items-center text-base text-white whitespace-nowrap self-start md:self-center shrink-0 ml-0 md:ml-8">
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              <span className="ml-2">DISCOVER KR</span>
            </a>
          </div>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
          {featuredProjects.map((project, index) => (
             <AnimateOnScroll 
                key={project.id} 
                className="group cursor-pointer" 
                delay={index * 200}
                onClick={() => onProjectSelect(project.id)}
             >
                <div className={`overflow-hidden ${project.aspectRatio}`}>
                    <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex justify-between items-center mt-4">
                  <h3 className="text-xl">{project.title}</h3>
                  <p className="text-sm text-gray-400">{project.category}</p>
                </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
