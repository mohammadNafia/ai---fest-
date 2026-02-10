import React, { useEffect, useRef } from 'react';
import type { Theme } from '@/types';

interface ParticlesBackgroundProps {
  theme: Theme;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dpr: number) => void;
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    // Set canvas size
    const resizeCanvas = (): void => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Particle configuration based on screen size and theme
    const getParticleConfig = () => {
      const width = window.innerWidth;
      let count = 80;
      
      if (width < 640) count = 30; // Mobile
      else if (width < 1024) count = 50; // Tablet
      else count = 80; // Desktop

      const colors = theme === 'dark'
        ? ['#38bdf8', '#3b82f6', '#a855f7'] // Blue, blue, purple
        : ['#bfdbfe', '#e0f2fe', '#ddd6fe']; // Light blue, light cyan, light purple

      return { count, colors };
    };

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;

      constructor() {
        const config = getParticleConfig();
        this.x = Math.random() * canvas.width / dpr;
        this.y = Math.random() * canvas.height / dpr;
        this.size = Math.random() * 2 + 1; // 1-3px
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        this.opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4
      }

      update(): void {
        if (prefersReducedMotion) return;

        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width / dpr;
        if (this.x > canvas.width / dpr) this.x = 0;
        if (this.y < 0) this.y = canvas.height / dpr;
        if (this.y > canvas.height / dpr) this.y = 0;
      }

      draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, dpr: number): void {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    const initParticles = (): void => {
      const config = getParticleConfig();
      particlesRef.current = [];
      for (let i = 0; i < config.count; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    initParticles();

    // Animation loop
    const animate = (): void => {
      if (prefersReducedMotion) {
        // Static gradient blobs for reduced motion
        const gradient = ctx.createRadialGradient(
          canvas.width / dpr / 2,
          canvas.height / dpr / 2,
          0,
          canvas.width / dpr / 2,
          canvas.height / dpr / 2,
          Math.max(canvas.width, canvas.height) / dpr / 2
        );
        
        const colors = theme === 'dark'
          ? ['rgba(56, 189, 248, 0.05)', 'rgba(59, 130, 246, 0.03)', 'rgba(168, 85, 247, 0.05)']
          : ['rgba(191, 219, 254, 0.1)', 'rgba(224, 242, 254, 0.08)', 'rgba(221, 214, 254, 0.1)'];
        
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(0.5, colors[1]);
        gradient.addColorStop(1, colors[2]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      } else {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

        // Update and draw particles
        particlesRef.current.forEach(particle => {
          particle.update();
          particle.draw(ctx, canvas, dpr);
        });
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default ParticlesBackground;

