
import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-6"
        aria-expanded={isOpen}
        data-cursor-type="link"
      >
        <span className="text-xl md:text-2xl">{question}</span>
        <span className="text-2xl ml-4 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)'}}>+</span>
      </button>
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: isOpen ? '200px' : '0' }}
      >
        <div className="pb-6 pr-8 text-gray-400">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQItem;
