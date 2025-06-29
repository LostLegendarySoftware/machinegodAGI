import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IntroAnimation: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show title immediately
    const titleTimer = setTimeout(() => {
      // Wait for GIF to play once (approximately 3 seconds) then fade out
      setTimeout(() => {
        setFadeOut(true);
        // Navigate after fade out
        setTimeout(() => {
          navigate('/main');
        }, 1000);
      }, 3000);
    }, 500);

    return () => {
      clearTimeout(titleTimer);
    };
  }, [navigate]);

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

      {/* Title */}
      <div className="relative z-10">
        <div className="flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-gray-900 tracking-wider relative border-2 border-red-600 px-4 py-2">
            Lost Legendary
            <span className="absolute inset-0 bg-gradient-to-b from-orange-600 via-red-700 to-red-900 bg-clip-text text-transparent opacity-90 blur-[0.5px]"></span>
          </h1>
          
          {/* Labs subtitle */}
          <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-gray-900 mt-2 tracking-wider relative">
            Labs
            <span className="absolute inset-0 bg-gradient-to-b from-orange-600 via-red-700 to-red-900 bg-clip-text text-transparent opacity-90 blur-[0.5px]"></span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default IntroAnimation;