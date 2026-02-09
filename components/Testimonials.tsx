
import React from 'react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Navigation } from 'swiper/modules';

const testimonials = [
    {
        quote: "Marco brought a fresh perspective to our brand and helped us translate complex ideas into a clear, visually strong identity. His attention to detail and ability to combine strategy with creativity made the whole process feel effortless. The final result exceeded our expectations and perfectly captures who we are as a company. We've received great feedback from clients and partners ever since.",
        author: "Econexis"
    },
    {
        quote: "Working with Marco felt like a true extension of our team. He absorbed the essence of YTFiscaal's mission and translated it into a brand design that speaks with clarity and confidence. From intake to final deliverable he kept us aligned, delivered on schedule and helped elevate our visual presence far beyond expectations. We highly recommend his work to anyone ready to level up their brand.",
        author: "YT Fiscaal"
    },
    {
        quote: "Working with Marco on our branding was a game-changer. He captured the essence of Uw Digitale Boekhouder perfectly and translated it into a visual identity that is modern, professional, and approachable. From the initial concept to the final deliverables, his process was clear, collaborative, and creative. The new branding has really elevated our presence and set us apart in the market.",
        author: "UwDigitaleBoekhouder"
    },
    {
        quote: "His creative vision and strategic approach have been invaluable. Marco is a true partner in building a brand that not only looks great but also resonates deeply with its audience. An exceptional talent.",
        author: "Another Happy Client"
    }
];

const SwiperNavButtons = () => {
  const swiper = useSwiper();
  return (
    <div className="flex justify-end items-center gap-4 mt-8">
        <button 
            onClick={() => swiper.slidePrev()} 
            className="w-12 h-12 rounded-full border border-gray-600 text-gray-400 hover:bg-white hover:border-white hover:text-black transition-colors flex items-center justify-center"
            aria-label="Previous testimonial"
            data-cursor-type="link"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </button>
        <button 
            onClick={() => swiper.slideNext()} 
            className="w-12 h-12 rounded-full border border-gray-600 text-gray-400 hover:bg-white hover:border-white hover:text-black transition-colors flex items-center justify-center"
            aria-label="Next testimonial"
            data-cursor-type="link"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </button>
    </div>
  );
};

const Testimonials: React.FC = () => {
    return (
        <div className="relative">
            <Swiper
                modules={[Navigation]}
                observer={true}
                observeParents={true}
                autoHeight={true}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 20
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30
                    },
                }}
                className="!overflow-visible"
            >
                {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={index}>
                        <div className="border border-gray-800 p-8 flex flex-col hover:border-gray-600 transition-colors">
                            <p className="text-gray-300 leading-relaxed text-base">{testimonial.quote}</p>
                            <p className="mt-8 font-medium text-lg">{testimonial.author}</p>
                        </div>
                    </SwiperSlide>
                ))}
                <SwiperNavButtons />
            </Swiper>
        </div>
    );
};

export default Testimonials;
