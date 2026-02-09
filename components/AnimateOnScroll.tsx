
import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({ children, className = '', delay = 0, onClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out duration-1000 ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default AnimateOnScroll;
