"use client";

import React, { useEffect, useRef } from "react";

export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Generate points on a sphere (Fibonacci sphere algorithm)
    const numPoints = 220;
    const points: { x: number; y: number; z: number; origX: number; origY: number; origZ: number }[] = [];
    const radius = Math.min(width, height) * 0.36;

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      points.push({ x, y, z, origX: x, origY: y, origZ: z });
    }

    let angleY = 0;
    let angleX = 0.2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      angleY += 0.004;

      // Draw atmospheric glow gradient
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius * 0.2,
        centerX,
        centerY,
        radius * 1.35
      );
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)");
      gradient.addColorStop(0.6, "rgba(5, 150, 105, 0.08)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Outer rings
      ctx.strokeStyle = "rgba(52, 211, 153, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * 1.15, radius * 0.45, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();

      // Rotate and project points
      const projectedPoints: { x2d: number; y2d: number; z: number; size: number; alpha: number }[] = [];

      for (const p of points) {
        // Rotate around Y
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        const x1 = p.origX * cosY - p.origZ * sinY;
        const z1 = p.origZ * cosY + p.origX * sinY;

        // Rotate around X
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const y2 = p.origY * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.origY * sinX;

        // Perspective scale
        const fov = 350;
        const scale = fov / (fov + z2);
        const x2d = centerX + x1 * scale;
        const y2d = centerY + y2 * scale;

        const alpha = Math.max(0.15, (z2 + radius) / (2 * radius));
        const size = Math.max(1, 2.8 * scale);

        projectedPoints.push({ x2d, y2d, z: z2, size, alpha });
      }

      // Draw subtle connecting latitude/longitude lines for closest points
      for (let i = 0; i < projectedPoints.length; i += 3) {
        const p1 = projectedPoints[i];
        if (p1.z < 0) continue; // Only front half

        for (let j = i + 1; j < Math.min(i + 6, projectedPoints.length); j++) {
          const p2 = projectedPoints[j];
          if (p2.z < 0) continue;
          const dx = p1.x2d - p2.x2d;
          const dy = p1.y2d - p2.y2d;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 55) {
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.18 * p1.alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(p1.x2d, p1.y2d);
            ctx.lineTo(p2.x2d, p2.y2d);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const p of projectedPoints) {
        ctx.fillStyle = p.z > 0 ? `rgba(52, 211, 153, ${p.alpha * 0.95})` : `rgba(6, 95, 70, ${p.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x2d, p.y2d, p.size, 0, Math.PI * 2);
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
    <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[500px] flex items-center justify-center pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {/* Center Eco Core Indicator */}
      <div className="absolute flex flex-col items-center justify-center p-4 rounded-full bg-slate-950/70 border border-emerald-500/20 backdrop-blur-md shadow-2xl shadow-emerald-500/20">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">ECO CORE</span>
        <span className="text-[10px] text-slate-400 font-mono">100% GREEN</span>
      </div>
    </div>
  );
}
