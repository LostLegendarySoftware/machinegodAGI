import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IntroAnimation: React.FC = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Sequence the animations
    const titleTimer = setTimeout(() => setShowTitle(true), 1500);
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 2500);
    const signatureTimer = setTimeout(() => setShowSignature(true), 3500);
    const buttonTimer = setTimeout(() => setShowEnterButton(true), 4500);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(signatureTimer);
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

      {/* Phoenix emblem - scaled down to seal size */}
      <div className="relative z-10 mb-8">
        <div className="w-40 h-40 relative overflow-hidden rounded-full">
          <img 
            src="/phix.gif" 
            alt="Phoenix" 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30 rounded-full"></div>
        </div>
      </div>

      {/* Title with ember effect */}
      <div 
        className={`relative z-10 transition-all duration-1000 transform ${
          showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-gray-900 tracking-wider relative">
            Lost Legendary
            <span className="absolute inset-0 bg-gradient-to-b from-orange-600 via-red-700 to-red-900 bg-clip-text text-transparent opacity-90 blur-[0.5px]"></span>
          </h1>
          
          {/* Labs subtitle */}
          <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-gray-900 mt-2 tracking-wider relative">
            Labs
            <span className="absolute inset-0 bg-gradient-to-b from-orange-600 via-red-700 to-red-900 bg-clip-text text-transparent opacity-90 blur-[0.5px]"></span>
          </h2>
        </div>
        
        {/* Smoke effect */}
        <div className="absolute -top-4 left-0 right-0 h-20 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-t from-transparent to-gray-500 opacity-10 animate-pulse-slow"></div>
        </div>
        
        {/* Ember particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-500 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.7,
                animationDuration: `${3 + Math.random() * 4}s`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Signature with handwriting animation */}
      <div 
        className={`relative z-10 mt-16 transition-all duration-1000 ${
          showSignature ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-2xl text-amber-300 italic font-tangerine transform rotate-12 relative">
          <span className="inline-block w-full whitespace-nowrap relative after:content-[''] after:absolute after:top-0 after:right-0 after:w-full after:h-full after:bg-black after:animate-typewriter">
            By: Mesiah Bishop
          </span>
        </p>
      </div>

      {/* Enter button */}
      {showEnterButton && (
        <button 
          onClick={handleEnter}
          className="mt-16 px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-orange-500 rounded-lg shadow-lg hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105 border border-orange-700/50 relative overflow-hidden group z-20"
        >
          <span className="relative z-10">Enter the Labyrinth</span>
          <span className="absolute inset-0 bg-gradient-to-r from-orange-700 to-red-800 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-orange-500 opacity-50"></span>
        </button>
      )}
    </div>
  );
};

export default IntroAnimation;