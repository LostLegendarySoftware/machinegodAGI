import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IntroAnimation: React.FC = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Sequence the animations
    const titleTimer = setTimeout(() => setShowTitle(true), 1500);
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 3000);
    const buttonTimer = setTimeout(() => setShowEnterButton(true), 4500);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate('/main');
    }, 1000);
  };

  return (
    <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-50 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background fire effect */}
      <div className="absolute inset-0 overflow-hidden">
        <img 
          src="/M0sW.gif" 
          alt="Fire background" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Phoenix animation */}
      <div className="relative z-10 mb-8">
        <img 
          src="/phix.gif" 
          alt="Phoenix" 
          className="w-64 h-64 object-contain"
        />
      </div>

      {/* Title with scorched effect */}
      <div 
        className={`relative z-10 transition-all duration-1000 transform ${
          showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-orange-500 to-red-700 tracking-wider">
          Lost Legendary Laby
        </h1>
        <div className="absolute inset-0 blur-sm bg-orange-500 opacity-20 animate-pulse"></div>
      </div>

      {/* Subtitle with handwriting animation */}
      <div 
        className={`relative z-10 mt-4 overflow-hidden transition-all duration-1000 ${
          showSubtitle ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'
        }`}
      >
        <p className="text-lg text-amber-300 italic font-cursive relative">
          <span className="inline-block w-full whitespace-nowrap relative after:content-[''] after:absolute after:top-0 after:right-0 after:w-full after:h-full after:bg-black after:animate-typewriter">
            By: Mesiah Bishop
          </span>
        </p>
      </div>

      {/* Enter button */}
      {showEnterButton && (
        <button 
          onClick={handleEnter}
          className="mt-12 px-8 py-3 bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-lg shadow-lg hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 animate-pulse"
        >
          Enter the Labyrinth
        </button>
      )}
    </div>
  );
};

export default IntroAnimation;