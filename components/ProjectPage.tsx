
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import AnimateOnScroll from './AnimateOnScroll';

type Page = 'home' | 'work' | 'about' | 'project';

interface ProjectPageProps {
  projectId: number;
  onNavigate: (page: Page) => void;
  onSelectProject: (id: number) => void;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ projectId, onNavigate, onSelectProject }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsLoading(true);
    
    const fetchProjectData = async () => {
      try {
        const response = await fetch('/cms/projects.json');
        const projects: Project[] = await response.json();
        const currentIndex = projects.findIndex(p => p.id === projectId);
        
        if (currentIndex !== -1) {
          setProject(projects[currentIndex]);
          const nextIndex = (currentIndex + 1) % projects.length;
          setNextProject(projects[nextIndex]);
        } else {
          setProject(null);
          setNextProject(null);
        }
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to allow for page transition animations
    const timer = setTimeout(fetchProjectData, 100);
    return () => clearTimeout(timer);
  }, [projectId]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading project...</p></div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl mb-4">Project not found</h1>
        <button onClick={() => onNavigate('work')} className="text-lg underline hover:text-gray-300" data-cursor-type="link">
          Return to Work
        </button>
      </div>
    );
  }

  return (
    <main className={`transition-opacity duration-500 ${isMounted && !isLoading ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Image */}
      <AnimateOnScroll>
        <div className="pt-24">
          <img src={project.heroImage} alt={project.title} className="w-full h-auto object-cover" />
        </div>
      </AnimateOnScroll>

      {/* Project Info */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <AnimateOnScroll delay={200}>
            <h1 className="text-5xl md:text-7xl font-medium mb-16">{project.title}</h1>
        </AnimateOnScroll>

        <AnimateOnScroll className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12" delay={400}>
            <div className="md:col-span-4 space-y-6 text-lg">
                <div className="grid grid-cols-2">
                    <span className="text-gray-400 uppercase tracking-widest text-sm">WHAT</span>
                    <span>{project.what}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-400 uppercase tracking-widest text-sm">WHERE</span>
                    <span>{project.where}</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-400 uppercase tracking-widest text-sm">ROLE</span>
                    <span>{project.role}</span>
                </div>
            </div>

            <div className="md:col-span-7 md:col-start-6 text-gray-300 text-xl leading- relaxed space-y-6">
                {project.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </AnimateOnScroll>
      </div>

      {/* Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 md:px-8 pb-16 md:pb-24 space-y-8">
          {project.gallery.map((image, index) => (
            <AnimateOnScroll key={index} delay={index * 150}>
              <img src={image} alt={`Gallery image ${index + 1} for ${project.title}`} className="w-full h-auto" />
            </AnimateOnScroll>
          ))}
        </div>
      )}

      {/* Next Project */}
      {nextProject && (
        <AnimateOnScroll>
          <div 
            onClick={() => onSelectProject(nextProject.id)} 
            className="group h-[60vh] flex flex-col items-center justify-center text-center bg-cover bg-center bg-no-repeat relative cursor-pointer" 
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${nextProject.heroImage})` }}
            data-cursor-type="view"
          >
            <p className="text-gray-300 text-sm tracking-widest uppercase">NEXT PROJECT</p>
            <h2 className="text-5xl md:text-7xl mt-4 transition-transform duration-300 group-hover:translate-y-[-4px]">{nextProject.title}</h2>
          </div>
        </AnimateOnScroll>
      )}
    </main>
  );
};

export default ProjectPage;
