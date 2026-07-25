'use client';

import { useEffect, useRef } from 'react';

type ReactiveGridProps = {
  className?: string;
  maxSize?: number;
  minSize?: number;
  gap?: number;
  influenceRadius?: number;
  particleColor?: string;
  backgroundColor?: string;
};

type GridCell = {
  x: number;
  y: number;
  size: number;
  velocity: number;
};

const SPRING_STIFFNESS = 120;
const SPRING_DAMPING = 18;
const SETTLED_THRESHOLD = 0.02;

function drawHexagon(context: CanvasRenderingContext2D, x: number, y: number, size: number) {
  if (size <= SETTLED_THRESHOLD) return;

  const radius = size / 2;
  context.beginPath();

  for (let point = 0; point < 6; point += 1) {
    const angle = (Math.PI / 3) * point;
    const pointX = x + radius * Math.cos(angle);
    const pointY = y + radius * Math.sin(angle);

    if (point === 0) context.moveTo(pointX, pointY);
    else context.lineTo(pointX, pointY);
  }

  context.closePath();
  context.fill();
}

export function ReactiveGrid({
  className,
  maxSize = 16,
  minSize = 0,
  gap = 8,
  influenceRadius = 240,
  particleColor = '--portal-line-soft',
  backgroundColor = '--portal-surface',
}: ReactiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const context = canvas?.getContext('2d');

    if (!canvas || !container || !context) return;

    const resolveColor = (value: string) => {
      if (!value.startsWith('--')) return value;
      return getComputedStyle(container).getPropertyValue(value).trim();
    };
    const resolvedBackgroundColor = resolveColor(backgroundColor);
    const resolvedParticleColor = resolveColor(particleColor);
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cursor = { x: 0, y: 0, active: false };
    let cells: GridCell[] = [];
    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastFrameTime = 0;

    const drawFrame = () => {
      context.fillStyle = resolvedBackgroundColor;
      context.fillRect(0, 0, width, height);
      context.fillStyle = resolvedParticleColor;

      cells.forEach((cell) => {
        drawHexagon(context, cell.x, cell.y, cell.size);
      });
    };

    const rebuildGrid = () => {
      const bounds = container.getBoundingClientRect();
      const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const step = maxSize + gap;

      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const columns = Math.ceil(width / step) + 1;
      const rows = Math.ceil(height / step) + 1;
      const startX = (width - (columns - 1) * step) / 2;
      const startY = (height - (rows - 1) * step) / 2;

      cells = Array.from({ length: columns * rows }, (_, index) => ({
        x: startX + (index % columns) * step,
        y: startY + Math.floor(index / columns) * step,
        size: minSize,
        velocity: 0,
      }));

      drawFrame();
    };

    const animate = (time: number) => {
      const elapsedSeconds = lastFrameTime === 0 ? 1 / 60 : Math.min((time - lastFrameTime) / 1000, 1 / 30);
      const damping = Math.exp(-SPRING_DAMPING * elapsedSeconds);
      let hasMotion = false;

      lastFrameTime = time;

      cells.forEach((cell) => {
        const distance = Math.hypot(cell.x - cursor.x, cell.y - cursor.y);
        const proximity = cursor.active ? Math.max(0, 1 - distance / influenceRadius) : 0;
        const easedProximity = proximity * proximity * (3 - 2 * proximity);
        const targetSize = minSize + (maxSize - minSize) * easedProximity;

        cell.velocity += (targetSize - cell.size) * SPRING_STIFFNESS * elapsedSeconds;
        cell.velocity *= damping;
        cell.size += cell.velocity * elapsedSeconds;

        if (Math.abs(targetSize - cell.size) > SETTLED_THRESHOLD || Math.abs(cell.velocity) > SETTLED_THRESHOLD) {
          hasMotion = true;
        } else {
          cell.size = targetSize;
          cell.velocity = 0;
        }
      });

      drawFrame();

      if (hasMotion) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        frameId = 0;
        lastFrameTime = 0;
      }
    };

    const startAnimation = () => {
      if (reducedMotionQuery.matches || frameId !== 0) return;
      lastFrameTime = 0;
      frameId = window.requestAnimationFrame(animate);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = container.getBoundingClientRect();
      const isInside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!isInside) {
        cursor.active = false;
        startAnimation();
        return;
      }

      cursor.x = event.clientX - bounds.left;
      cursor.y = event.clientY - bounds.top;
      cursor.active = true;
      startAnimation();
    };

    const handlePointerLeave = () => {
      cursor.active = false;
      startAnimation();
    };

    const handleMotionPreferenceChange = () => {
      cursor.active = false;

      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }

      cells.forEach((cell) => {
        cell.size = minSize;
        cell.velocity = 0;
      });

      drawFrame();
    };

    const resizeObserver = new ResizeObserver(rebuildGrid);
    resizeObserver.observe(container);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('blur', handlePointerLeave);
    reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange);
    rebuildGrid();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('blur', handlePointerLeave);
      reducedMotionQuery.removeEventListener('change', handleMotionPreferenceChange);

      if (frameId !== 0) window.cancelAnimationFrame(frameId);
    };
  }, [backgroundColor, gap, influenceRadius, maxSize, minSize, particleColor]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
