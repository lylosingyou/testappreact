import React, { useState, useEffect } from 'react';

const introParagraphs = [
  "The Organic Product of Technology.",
  "In an age dominated by artificial intelligence, the Human Made seal represents a commitment to the most sincere human creativity. This certification is awarded to products of any kind: Works of art, products, services, and more. Any human creation free from even a minimal amount of artificial intelligence in the creative process.",
  "It demonstrates the value of the purely human touch, intention, and skill. From hand-crafted code to music, images, and emotions. The Human Made certification promotes a personal imperfection that only a human hand can possess.",
  "At Human Made, we believe that, while artificial intelligence is a powerful tool, human creation, experience, effort, and inspiration should be recognized irreplaceably. We plan to preserve and highlight these qualities, offering distinction to consumers and products, seeking authenticity in an environment saturated with content.",
];

const principles = [
    { title: "Authenticity", text: "Verify conceptual and practical work, guided by human authors." },
    { title: "Craftsmanship", text: "Praise to human skill, time, experience, creation, and artistic flair." },
    { title: "Transparency", text: "Clarity of the tools used, ensuring human exclusivity in the production and creation of content." },
];

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
    const [visibleElements, setVisibleElements] = useState(0);

    useEffect(() => {
        const totalElements = introParagraphs.length + 1 + principles.length + 1; // paragraphs, title, principles, button
        const timer = setInterval(() => {
            setVisibleElements(prev => {
                if (prev < totalElements) {
                    return prev + 1;
                }
                clearInterval(timer);
                return prev;
            });
        }, 500);

        return () => clearInterval(timer);
    }, []);

  return (
    <div className="w-full h-full flex items-start justify-center bg-black text-[#F8F8F8] p-4 sm:p-6 md:p-8 overflow-y-auto no-scrollbar">
        <div className="max-w-3xl w-full flex flex-col space-y-3 sm:space-y-4 md:space-y-6 text-center my-auto py-4 sm:py-6 md:py-8">
            {introParagraphs.map((text, index) => (
                <p 
                    key={index} 
                    className={`transition-opacity duration-1000 ${visibleElements > index ? 'opacity-100' : 'opacity-0'} ${
                        index === 0
                        ? 'text-lg sm:text-xl md:text-2xl font-bold text-white'
                        : 'text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed'
                    }`}
                >
                    {text}
                </p>
            ))}

            <h3 className={`text-base sm:text-lg md:text-xl font-bold transition-opacity duration-1000 ${visibleElements > introParagraphs.length ? 'opacity-100' : 'opacity-0'}`}>
                Core Principles:
            </h3>

            <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 text-left pt-2 sm:pt-3 md:pt-4">
                {principles.map((p, index) => (
                    <div key={p.title} className={`transition-opacity duration-1000 ${visibleElements > introParagraphs.length + 1 + index ? 'opacity-100' : 'opacity-0'}`}>
                        <h4 className="font-bold text-white text-sm sm:text-base md:text-lg">{p.title}</h4>
                        <p className="text-[0.7rem] sm:text-xs md:text-sm text-gray-400 mt-1">{p.text}</p>
                    </div>
                ))}
            </div>

            <div className={`pt-4 sm:pt-6 md:pt-8 transition-opacity duration-1000 ${visibleElements > introParagraphs.length + principles.length + 1 ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={onComplete}
                    className="px-4 py-2 sm:px-6 sm:py-3 md:px-10 md:py-3 lg:px-12 lg:py-4 border-2 border-gray-400/50 text-gray-200 bg-gray-500/10 rounded-sm text-sm sm:text-base md:text-xl lg:text-2xl tracking-widest transition-all duration-300 hover:bg-gray-500/30 hover:border-gray-300/80 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                >
                    I am human
                </button>
            </div>
        </div>
    </div>
  );
};

export default IntroScreen;
