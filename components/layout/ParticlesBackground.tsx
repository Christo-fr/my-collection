"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  opacity: number;
  swayOffset: number;
  swaySpeed: number;
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // 200 particules comme dans ton composant initial
    const particleCount = 200;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      // Rayon jusqu'à 4px (soit un diamètre max de 8px pour correspondre à w-2)
      radius: Math.random() * 3.5 + 0.5,
      speedY: Math.random() * 0.35 + 0.15,
      opacity: Math.random(), // Opacité variable de 0 à 1
      swayOffset: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.012 + 0.005,
    }));

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // Ombre portée identique à shadow-[0_0_10px_rgba(255,255,255,0.8)]
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 10;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        p.y -= p.speedY;
        const currentX = p.x + Math.sin(time * p.swaySpeed + p.swayOffset) * 15;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(currentX, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-60">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
