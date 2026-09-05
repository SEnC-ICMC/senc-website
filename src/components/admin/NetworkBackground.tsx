"use client";

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: [number, number, number];
}

const LINK_MAX_DISTANCE = 200;
const LINK_MAX_OPACITY = 0.5;
const LINK_WIDTH = 1.5;
const TARGET_FRAME_INTERVAL = 1000 / 30; // cap at ~30fps to keep this cheap
const NODE_DENSITY = 9000; // px² per node — lower = denser network
const MAX_NODES = 100;
const MIN_NODES = 24;

// Brand palette: purple, green, blue — nodes are assigned one at random,
// and edges blend between whichever two colors they connect.
const PALETTE: [number, number, number][] = [
  [168, 85, 247], // purple-500
  [74, 222, 128], // green-400
  [96, 165, 250], // blue-400
];

function randomColor(): [number, number, number] {
  return PALETTE[Math.floor(Math.random() * PALETTE.length)];
}

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let nodes: Node[] = [];
    let animationFrameId = 0;
    let lastFrameTime = 0;

    const setup = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;

      // Without this, the canvas backing store is only as sharp as CSS
      // pixels, which the browser then upscales on high-DPI screens —
      // that blur is exactly what was making thin lines look invisible.
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nodeCount = Math.min(MAX_NODES, Math.max(MIN_NODES, Math.floor((width * height) / NODE_DENSITY)));

      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        color: randomColor(),
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (!prefersReducedMotion) {
        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;
        }
      }

      // Edges first, so dots render crisply on top of them
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < LINK_MAX_DISTANCE) {
            const opacity = (1 - distance / LINK_MAX_DISTANCE) * LINK_MAX_OPACITY;
            const [r1, g1, b1] = nodes[i].color;
            const [r2, g2, b2] = nodes[j].color;
            const gradient = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            gradient.addColorStop(0, `rgba(${r1}, ${g1}, ${b1}, ${opacity})`);
            gradient.addColorStop(1, `rgba(${r2}, ${g2}, ${b2}, ${opacity})`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = LINK_WIDTH;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots on top, with a soft glow in their own color
      for (const node of nodes) {
        const [r, g, b] = node.color;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.85)`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const loop = (time: number) => {
      animationFrameId = requestAnimationFrame(loop);
      if (time - lastFrameTime < TARGET_FRAME_INTERVAL) return;
      lastFrameTime = time;
      draw();
    };

    setup();
    draw();
    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(loop);
    }

    const handleResize = () => setup();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      aria-hidden="true"
    />
  );
}