"use client";

import { useEffect, useRef } from 'react';

interface MeshPoint {
  x: number;
  y: number;
  depth: number;
  drift: number;
  color: string;
}

const COLORS = ['#E9ECEF', '#9E6CDF', '#0015E2', '#07D46A'];
const EDGE_COLORS: [number, number, number][] = [
  [158, 108, 223],
  [70, 105, 235],
  [220, 226, 230],
];

export default function HeroMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let points: MeshPoint[] = [];
    let frameId = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      let seed = 2026;
      const random = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };
      const columns = 8;
      const rows = 8;

      points = Array.from({ length: columns * rows }, (_, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        const angle = random() * Math.PI * 2;
        return {
          x: (column + 0.18 + random() * 0.64) / columns,
          y: (row + 0.18 + random() * 0.64) / rows,
          depth: 0.35 + random() * 0.6,
          drift: angle,
          color: COLORS[index % COLORS.length],
        };
      });
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      const positions = points.map((point) => ({
        x: point.x * width + (reduceMotion ? 0 : Math.sin(time * 0.00035 + point.drift) * 3),
        y: point.y * height + (reduceMotion ? 0 : Math.cos(time * 0.0003 + point.drift) * 3),
      }));
      const links = new Set<string>();

      for (let index = 0; index < positions.length; index += 1) {
        const nearest = positions
          .map((position, candidate) => ({
            candidate,
            distance: Math.hypot(position.x - positions[index].x, position.y - positions[index].y),
          }))
          .filter(({ candidate }) => candidate !== index)
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);

        for (const { candidate } of nearest) {
          const first = Math.min(index, candidate);
          const second = Math.max(index, candidate);
          links.add(`${first}:${second}`);
        }
      }

      for (const link of links) {
        const [first, second] = link.split(':').map(Number);
        const point = positions[first];
        const nextPoint = positions[second];
        const depth = Math.min(points[first].depth, points[second].depth);
        const opacity = 0.28 + depth * 0.38;
        const [red, green, blue] = EDGE_COLORS[(first + second) % EDGE_COLORS.length];
        context.strokeStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
        context.lineWidth = 0.9 + depth * 0.45;
        context.shadowColor = `rgba(${red}, ${green}, ${blue}, 0.22)`;
        context.shadowBlur = 3;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(nextPoint.x, nextPoint.y);
        context.stroke();
        context.shadowBlur = 0;
      }

      for (let index = 0; index < positions.length; index += 1) {
        const point = positions[index];
        const radius = 1 + points[index].depth * 1.1;
        context.fillStyle = points[index].color;
        context.globalAlpha = 0.35 + points[index].depth * 0.55;
        context.beginPath();
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
      }

      if (!reduceMotion) frameId = requestAnimationFrame(draw);
    };

    resize();
    draw(0);
    window.addEventListener('resize', resize);
    if (!reduceMotion) frameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full md:hidden" aria-hidden="true" />;
}
