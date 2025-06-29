import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const IntroAnimation: React.FC = () => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Sequence the animations
    const titleTimer = setTimeout(() => setShowTitle(true), 1500);
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), 2500);
    const buttonTimer = setTimeout(() => setShowEnterButton(true), 3500);

    // Create ember and smoke effects
    if (titleRef.current) {
      createEmberEffect(titleRef.current);
      createSmokeEffect(titleRef.current);
    }

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const createEmberEffect = (element: HTMLElement) => {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const ember = document.createElement('div');
        ember.className = 'ember';
        ember.style.left = `${Math.random() * width}px`;
        ember.style.bottom = '0px';
        ember.style.animationDelay = `${Math.random() * 2}s`;
        element.appendChild(ember);
        
        setTimeout(() => {
          ember.remove();
        }, 3000);
      }, i * 200);
    }
  };

  const createSmokeEffect = (element: HTMLElement) => {
    const width = element.offsetWidth;
    
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const smoke = document.createElement('div');
        smoke.className = 'smoke-particle';
        smoke.style.width = `${10 + Math.random() * 20}px`;
        smoke.style.height = `${10 + Math.random() * 20}px`;
        smoke.style.left = `${Math.random() * width}px`;
        smoke.style.bottom = '0px';
        smoke.style.animationDelay = `${Math.random() * 2}s`;
        element.appendChild(smoke);
        
        setTimeout(() => {
          smoke.remove();
        }, 4000);
      }, i * 400);
    }
  };

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
          src="/200.gif" 
          alt="Fire background" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Hooded Figure - properly sized as a seal */}
      <div className="relative z-10 mb-8">
        <div className="w-20 h-20 relative overflow-hidden rounded-full bg-black bg-opacity-50">
          <img 
            src="/hooded-figure.png" 
            alt="" 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30 rounded-full"></div>
        </div>
      </div>

      {/* Title with ember effect */}
      <div 
        ref={titleRef}
        className={`relative z-10 transition-all duration-1000 transform ${
          showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-gray-900 tracking-wider relative border-2 border-red-600 px-4 py-2">
            Lost Legendary
            <span className="absolute inset-0 bg-gradient-to-b from-orange-600 via-red-700 to-red-900 bg-clip-text text-transparent opacity-90 blur-[0.5px]"></span>
          </h1>
          
          {/* Labs subtitle */}
          <h2 className={`text-3xl md:text-4xl font-cinzel font-bold text-gray-900 mt-2 tracking-wider relative transition-all duration-1000 ${
            showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}>
            Labs
            <span className="absolute inset-0 bg-gradient-to-b from-orange-600 via-red-700 to-red-900 bg-clip-text text-transparent opacity-90 blur-[0.5px]"></span>
          </h2>
        </div>
      </div>

      {/* Enter button */}
      {showEnterButton && (
        <button 
          onClick={handleEnter}
          className="mt-16 px-8 py-3 bg-gradient-to-r from-red-900 to-red-800 text-red-500 rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 border border-red-700/50 relative overflow-hidden group z-20"
        >
          <span className="relative z-10">Enter the Labyrinth</span>
          <span className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-red-500 opacity-50"></span>
        </button>
      )}
    </div>
  );
};

export default IntroAnimation;