
import React from 'react';
import FAQItem from './FAQItem';
import AnimateOnScroll from './AnimateOnScroll';
import Testimonials from './Testimonials';

const skills = ['Branding', 'Motion', 'UI/UX', 'AI'];
const faqs = [
    { q: 'How much does a project cost?', a: 'Every project is unique. After an initial consultation to understand your needs, I provide a detailed proposal with a clear breakdown of costs.' },
    { q: 'What services do you offer?', a: 'I offer a range of services including brand identity design, motion graphics, UI/UX design for web and mobile, and creative direction. I can tailor a package to fit your specific goals.' },
    { q: 'How do you work?', a: 'My process is collaborative and iterative. We start with discovery and strategy, move to design and development, and finish with refinement and delivery, ensuring you are involved at every stage.' },
];

const SkillsFAQ: React.FC = () => {
    return (
        <section className="py-24 px-6 md:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-24">
                {/* Skills */}
                <AnimateOnScroll>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                            <div className="md:col-span-2 text-sm text-gray-400">04</div>
                            <div className="md:col-span-10">
                                <p className="uppercase text-sm text-gray-400 mb-4 tracking-widest">SKILLS</p>
                                <p className="text-3xl md:text-4xl lg:text-5xl max-w-3xl leading-tight">
                                    Expertises which are making brands resonate with their highest potential
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-gray-700">
                            {skills.map((skill, index) => (
                                <div key={skill} className="border-b border-gray-700 flex items-center justify-between py-6">
                                    <span className="text-lg text-gray-400">0{index + 1}</span>
                                    <h3 className="text-4xl md:text-6xl font-medium">{skill}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimateOnScroll>

                {/* FAQ */}
                <AnimateOnScroll delay={200}>
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
                            <div className="md:col-span-2 text-sm text-gray-400">04</div>
                            <div className="md:col-span-10">
                                <p className="uppercase text-sm text-gray-400 mb-4 tracking-widest">FAQ</p>
                                <p className="text-3xl md:text-4xl lg:text-5xl max-w-3xl leading-tight">
                                    Good questions deserve thoughtful answers, here are a few I get most often.
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-gray-700">
                            {faqs.map((faq, index) => (
                                <FAQItem key={index} question={faq.q} answer={faq.a} />
                            ))}
                        </div>
                    </div>
                </AnimateOnScroll>

                 {/* Reviews */}
                 <AnimateOnScroll delay={400}>
                     <div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16">
                            <div className="md:col-span-2 text-sm text-gray-400">04</div>
                            <div className="md:col-span-10">
                                <p className="uppercase text-sm text-gray-400 mb-4 tracking-widest">REVIEWS</p>
                                <p className="text-3xl md:text-4xl lg:text-5xl max-w-3xl leading-tight">
                                    15 years in the game, 100+ brands transformed and countless stories that still resonate.
                                </p>
                            </div>
                        </div>
                        <Testimonials />
                    </div>
                 </AnimateOnScroll>
            </div>
        </section>
    );
};

export default SkillsFAQ;