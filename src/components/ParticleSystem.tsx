import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  opacity: number;
  color: string;
}

interface ParticleSystemProps {
  density?: number;
  speed?: number;
  visible?: boolean;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  density = 100, 
  speed = 1, 
  visible = true 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();

  const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
  const colors = ['#9400d3', '#b400ff', '#8a00a1', '#6600cc', '#7800b3'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < density; i++) {
        newParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: Math.random() * speed + 0.5,
          char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
          opacity: Math.random() * 0.8 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setParticles(newParticles);
    };

    initParticles();

    const animate = () => {
      if (!visible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setParticles(prevParticles => {
        return prevParticles.map(particle => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Wrap around screen
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          // Draw particle
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.opacity;
          ctx.font = '12px monospace';
          ctx.fillText(particle.char, particle.x, particle.y);

          // Randomly change character
          if (Math.random() < 0.01) {
            particle.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          }

          return particle;
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [density, speed, visible]);

  if (!visible) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};