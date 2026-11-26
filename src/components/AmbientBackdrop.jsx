import { useEffect, useRef } from "react";

const COLORS = [
  "rgba(184, 68, 87, 0.42)",
  "rgba(195, 149, 82, 0.48)",
  "rgba(232, 160, 171, 0.48)",
  "rgba(235, 198, 138, 0.46)",
];

/**
 * Full-viewport motion backdrop combining drifting aurora orbs,
 * a 60fps Canvas particle field (twinkling stars & tumbling petals),
 * and interactive touch/mouse stardust trails.
 */
export default function AmbientBackdrop() {
  const layerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return undefined;

    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = null;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const isSmall = width < 600;
    const ambientCount = isSmall ? 34 : 56;

    function makeAmbientParticle(randomY = false) {
      const kind = Math.random() < 0.45 ? "petal" : "sparkle";
      return {
        kind,
        x: Math.random() * width,
        y: randomY ? Math.random() * height : height + 20 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.22 + Math.random() * 0.55),
        size: kind === "petal" ? 4 + Math.random() * 4.5 : 1.8 + Math.random() * 2.8,
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.015 + Math.random() * 0.025,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.025,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.35 + Math.random() * 0.45,
      };
    }

    const ambient = Array.from({ length: ambientCount }, () =>
      makeAmbientParticle(true)
    );
    const trail = [];
    let lastTrailAt = 0;

    function spawnTrail(x, y, count = 2) {
      for (let i = 0; i < count; i += 1) {
        if (trail.length > 90) trail.shift();
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.4;
        trail.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.45,
          size: 2.2 + Math.random() * 3.2,
          rot: Math.random() * Math.PI * 2,
          life: 1,
          decay: 0.018 + Math.random() * 0.015,
          color: Math.random() < 0.5 ? "#c39552" : "#b84457",
        });
      }
    }

    function handlePointerMove(e) {
      if (layerRef.current && e.pointerType !== "touch") {
        const nx = (e.clientX / width - 0.5) * 2;
        const ny = (e.clientY / height - 0.5) * 2;
        layerRef.current.style.setProperty("--px", `${(nx * 18).toFixed(1)}px`);
        layerRef.current.style.setProperty("--py", `${(ny * 14).toFixed(1)}px`);
      }

      const now = performance.now();
      if (now - lastTrailAt > 28) {
        lastTrailAt = now;
        spawnTrail(e.clientX, e.clientY, e.pointerType === "touch" ? 2 : 1);
      }
    }

    function handlePointerDown(e) {
      spawnTrail(e.clientX, e.clientY, 8);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    function drawFourPointStar(x, y, r, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 4; i += 1) {
        const a = (i * Math.PI) / 2;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(
          Math.cos(a + Math.PI / 4) * (r * 0.34),
          Math.sin(a + Math.PI / 4) * (r * 0.34)
        );
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawPetal(x, y, size, rot, phase) {
      const flutter = 0.45 + 0.55 * Math.abs(Math.cos(phase));
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(1, flutter);
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.58, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < ambient.length; i += 1) {
        const p = ambient[i];
        p.phase += p.phaseSpeed;
        p.x += p.vx + Math.sin(p.phase) * 0.28;
        p.y += p.vy;
        p.rot += p.vRot;

        if (p.y < -25 || p.x < -30 || p.x > width + 30) {
          ambient[i] = makeAmbientParticle(false);
          continue;
        }

        const twinkle = 0.65 + 0.35 * Math.sin(p.phase * 1.6);
        ctx.globalAlpha = p.alpha * twinkle;
        ctx.fillStyle = p.color;

        if (p.kind === "petal") {
          drawPetal(p.x, p.y, p.size, p.rot, p.phase);
        } else {
          drawFourPointStar(p.x, p.y, p.size * 1.6, p.rot);
        }
      }

      for (let i = trail.length - 1; i >= 0; i -= 1) {
        const t = trail[i];
        t.x += t.vx;
        t.y += t.vy;
        t.vy += 0.015;
        t.rot += 0.06;
        t.life -= t.decay;

        if (t.life <= 0) {
          trail.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = t.life * 0.72;
        ctx.fillStyle = t.color;
        drawFourPointStar(t.x, t.y, t.size * t.life, t.rot);
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={layerRef} className="ambient-backdrop" aria-hidden="true">
      <div className="aura-orb aura-orb--rose" />
      <div className="aura-orb aura-orb--gold" />
      <div className="aura-orb aura-orb--cream" />
      <svg
        className="backdrop-ribbons"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
      >
        <path
          className="ribbon-path ribbon-path--one"
          d="M-60,220 C220,90 480,360 760,210 C980,95 1120,250 1260,160"
        />
        <path
          className="ribbon-path ribbon-path--two"
          d="M-40,610 C240,490 520,730 820,570 C1020,460 1130,630 1260,520"
        />
      </svg>
      <canvas ref={canvasRef} className="ambient-canvas" />
    </div>
  );
}
