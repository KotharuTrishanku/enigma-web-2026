"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
}

interface Pulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
}

export default function InteractiveGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Parameters
    const GRID_SPACING = 85;        // Distance between grid intersections (px)
    const GAP = 2;                  // Line thickness = GAP * 2 (4px)
    const CORNER_RADIUS = 8;        // Flared diamond curvature at joints

    const PHYSICS_RADIUS = 180;     // Contained warp disturbance radius
    const GLOW_RADIUS = 420;        // Larger spotlight spread radius
    const VIGNETTE_SIZE = 180;      // Extended smooth margin for border fade (px)

    const STIFFNESS = 0.0007;       // Ultra-slow spring return force
    const DAMPING = 0.9;            // Fluid momentum retention
    const STRIDE_FORCE = 0.08;      // Elastic warp impulse
    const MAX_DISPLACEMENT = 40;    // Max stretch distance to prevent void tearing

    const GRID_BASE_ALPHA = 0.2;    // High-transparency resting grid
    const GRID_MAX_ALPHA = 0.85;    // Spotlight brightness around cursor core

    const mouse = {
      x: -9999,
      y: -9999,
      vx: 0,
      vy: 0,
      lastX: -9999,
      lastY: -9999,
    };

    let nodes: Node[][] = [];
    let pulses: Pulse[] = [];
    let cols = 0;
    let rows = 0;

    //for diabling warp effect
    const checkIsOverCard = (clientX: number, clientY: number) => {
     const cardIds = ["about-card", "domains-card", "events-card", "upcoming-card", "team-card", "feedback-card", "footer-card"];
      return cardIds.some((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom
        );
      });
    };

    // native res grid
    const initGrid = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / GRID_SPACING) + 1;
      rows = Math.ceil(height / GRID_SPACING) + 1;

      nodes = [];
      for (let r = 0; r < rows; r++) {
        const rowNodes: Node[] = [];
        for (let c = 0; c < cols; c++) {
          const bx = c * GRID_SPACING;
          const by = r * GRID_SPACING;
          rowNodes.push({
            x: bx,
            y: by,
            baseX: bx,
            baseY: by,
            vx: 0,
            vy: 0,
          });
        }
        nodes.push(rowNodes);
      }
    };

    initGrid();

    // evnt listeners
    const handleResize = () => initGrid();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isOverUI = target?.closest("header, nav, a, button, [role='button']") !== null;
      const isOverCard = checkIsOverCard(e.clientX, e.clientY);

      if (mouse.lastX !== -9999) {
        mouse.vx = (isOverUI || isOverCard) ? 0 : e.clientX - mouse.lastX;
        mouse.vy = (isOverUI || isOverCard) ? 0 : e.clientY - mouse.lastY;
      }

      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
    };

    const handleDblClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const isOverUI = target?.closest("header, nav, a, button, [role='button']") !== null;
      const isOverCard = checkIsOverCard(e.clientX, e.clientY);

      if (isOverUI || isOverCard) return;

      const maxScreenDist = Math.hypot(width, height);
      pulses.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: maxScreenDist * 1.2,
        speed: 19,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("dblclick", handleDblClick);



    const render = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = nodes[r][c];

          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);

          if (dist < PHYSICS_RADIUS) {
            const factor = Math.pow(1 - dist / PHYSICS_RADIUS, 2);
            node.vx += mouse.vx * factor * STRIDE_FORCE;
            node.vy += mouse.vy * factor * STRIDE_FORCE;
          }

          const springFx = (node.baseX - node.x) * STIFFNESS;
          const springFy = (node.baseY - node.y) * STIFFNESS;

          node.vx = (node.vx + springFx) * DAMPING;
          node.vy = (node.vy + springFy) * DAMPING;

          node.x += node.vx;
          node.y += node.vy;

          const dispX = node.x - node.baseX;
          const dispY = node.y - node.baseY;
          const dispDist = Math.hypot(dispX, dispY);

          if (dispDist > MAX_DISPLACEMENT) {
            node.x = node.baseX + (dispX / dispDist) * MAX_DISPLACEMENT;
            node.y = node.baseY + (dispY / dispDist) * MAX_DISPLACEMENT;
            node.vx *= 0.5;
            node.vy *= 0.5;
          }
        }
      }

      mouse.vx *= 0.8;
      mouse.vy *= 0.8;

      ctx.fillStyle = `rgba(255, 255, 162, ${GRID_BASE_ALPHA})`;
      ctx.fillRect(0, 0, width, height);

      // cursor spotlight
      if (mouse.x > -1000) {
        const glowGradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          GLOW_RADIUS
        );

        const peakGlow = GRID_MAX_ALPHA - GRID_BASE_ALPHA;

        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${peakGlow})`);
        glowGradient.addColorStop(0.12, `rgba(255, 255, 255, ${peakGlow * 0.45})`);
        glowGradient.addColorStop(0.3, `rgba(255, 255, 255, ${peakGlow * 0.15})`);
        glowGradient.addColorStop(0.6, `rgba(255, 255, 255, ${peakGlow * 0.04})`);
        glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, width, height);
      }

      const PULSE_RING_WIDTH = 90;

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += p.speed;

        const fade = Math.max(0, 1 - p.radius / p.maxRadius);

        if (p.radius > p.maxRadius || fade <= 0) {
          pulses.splice(i, 1);
          continue;
        }

        const innerR = Math.max(0, p.radius - PULSE_RING_WIDTH / 2);
        const outerR = p.radius + PULSE_RING_WIDTH / 2;

        const pulseGrad = ctx.createRadialGradient(
          p.x, p.y, innerR,
          p.x, p.y, outerR
        );

        pulseGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        pulseGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.95 * fade})`);
        pulseGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = pulseGrad;
        ctx.fillRect(0, 0, width, height);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const node = nodes[r][c];
            const dx = node.x - p.x;
            const dy = node.y - p.y;
            const dist = Math.hypot(dx, dy);

            const waveDist = Math.abs(dist - p.radius);
            if (waveDist < PULSE_RING_WIDTH / 2 && dist > 0) {
              const angle = Math.atan2(dy, dx);
              const impulse = (1 - waveDist / (PULSE_RING_WIDTH / 2)) * 16 * fade;

              node.vx += Math.cos(angle) * impulse;
              node.vy += Math.sin(angle) * impulse;
            }
          }
        }
      }

      ctx.fillStyle = "#000000";

      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const topLeft = nodes[r][c];
          const topRight = nodes[r][c + 1];
          const bottomLeft = nodes[r + 1][c];

          const x = topLeft.x + GAP;
          const y = topLeft.y + GAP;
          const w = topRight.x - topLeft.x - GAP * 2;
          const h = bottomLeft.y - topLeft.y - GAP * 2;

          if (w > 0 && h > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, CORNER_RADIUS);
            ctx.fill();
          }
        }
      }

      // edge vignette
      const applyOrganicVignetteStops = (grad: CanvasGradient) => {
        grad.addColorStop(0.00, "rgba(0, 0, 0, 1.0)");
        grad.addColorStop(0.20, "rgba(0, 0, 0, 0.75)");
        grad.addColorStop(0.45, "rgba(0, 0, 0, 0.35)");
        grad.addColorStop(0.70, "rgba(0, 0, 0, 0.10)");
        grad.addColorStop(1.00, "rgba(0, 0, 0, 0.0)");
      };

      const topGrad = ctx.createLinearGradient(0, 0, 0, VIGNETTE_SIZE);
      applyOrganicVignetteStops(topGrad);
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, VIGNETTE_SIZE);

      const botGrad = ctx.createLinearGradient(0, height, 0, height - VIGNETTE_SIZE);
      applyOrganicVignetteStops(botGrad);
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, height - VIGNETTE_SIZE, width, VIGNETTE_SIZE);

      const leftGrad = ctx.createLinearGradient(0, 0, VIGNETTE_SIZE, 0);
      applyOrganicVignetteStops(leftGrad);
      ctx.fillStyle = leftGrad;
      ctx.fillRect(0, 0, VIGNETTE_SIZE, height);

      const rightGrad = ctx.createLinearGradient(width, 0, width - VIGNETTE_SIZE, 0);
      applyOrganicVignetteStops(rightGrad);
      ctx.fillStyle = rightGrad;
      ctx.fillRect(width - VIGNETTE_SIZE, 0, VIGNETTE_SIZE, height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("dblclick", handleDblClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 bg-black"
    />
  );
}