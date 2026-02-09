
import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Intro from './components/Intro';
import Work from './components/Work';
import Holism from './components/Holism';
import SkillsFAQ from './components/SkillsFAQ';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import WorkPage from './components/WorkPage';
import HeroTransition from './components/HeroTransition';
import ProjectPage from './components/ProjectPage';

type Page = 'home' | 'work' | 'about' | 'project';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSelectProject = (id: number) => {
    setSelectedProjectId(id);
    setCurrentPage('project');
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen font-sans antialiased selection:bg-white selection:text-black">
      <Header onNavigate={handleNavigate} />
      
      {currentPage === 'home' && (
        <main>
          <Hero />
          <HeroTransition />
          <Intro />
          <Work onProjectSelect={handleSelectProject} />
          <Holism />
          <SkillsFAQ />
        </main>
      )}

      {currentPage === 'about' && <AboutPage />}
      {currentPage === 'work' && <WorkPage onProjectSelect={handleSelectProject} />}
      {currentPage === 'project' && selectedProjectId && (
        <ProjectPage 
          projectId={selectedProjectId} 
          onNavigate={handleNavigate}
          onSelectProject={handleSelectProject}
        />
      )}

      <Footer />
    </div>
  );
};

export default App;
