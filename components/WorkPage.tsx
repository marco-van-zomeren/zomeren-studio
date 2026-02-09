
import React, { useState, useEffect, useMemo } from 'react';
import { Project } from '../types';

const filters = ['All', 'Branding', 'Motion', 'UI/UX', 'AI'];

interface WorkPageProps {
  onProjectSelect: (id: number) => void;
}

const WorkPage: React.FC<WorkPageProps> = ({ onProjectSelect }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchProjects = async () => {
      try {
        const response = await fetch('/cms/projects.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Project[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    return projects.filter(p => p.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
            <div className="flex items-center space-x-2 md:space-x-4 mb-12">
                {filters.map(filter => (
                    <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 text-sm rounded-full transition-colors ${activeFilter === filter ? 'bg-white text-black' : 'bg-[#1a1a1a] hover:bg-[#2a2a2a]'}`}>
                        {filter}
                    </button>
                ))}
            </div>

            {isLoading ? (
              <p>Loading projects...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project, index) => (
                      <div
                          key={project.id}
                          className={`group cursor-pointer transition-all ease-out duration-1000 ${
                              isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                          }`}
                          style={{ transitionDelay: `${isMounted ? index * 100 : 0}ms` }}
                          onClick={() => onProjectSelect(project.id)}
                      >
                          <div className="overflow-hidden aspect-[4/5] bg-[#1a1a1a]">
                               <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                          <div className="mt-4">
                              <h3 className="text-lg font-medium">{project.title}</h3>
                              <p className="text-sm text-gray-400">{project.category}</p>
                          </div>
                      </div>
                  ))}
              </div>
            )}
        </div>
    </main>
  );
};

export default WorkPage;
