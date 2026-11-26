import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const PALETTE = ["#b84457", "#c39552", "#e8a0ab", "#f2cf8d", "#d96b7c", "#f6d7b0"];

/**
 * Multi-shape celebratory confetti & fireworks engine with 3D paper-tumble physics.
 */
const ConfettiCanvas = forwardRef(function ConfettiCanvas(_, ref) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    launch(count = 50, origin = "center") {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const w = window.innerWidth;
      const h = window.innerHeight;

      const shapes = ["rect", "rect", "circle", "star"];

      function spawnAt(ox, oy, angleCenter, spread, total) {
        for (let i = 0; i < total; i += 1) {
          const angle = angleCenter + (Math.random() - 0.5) * spread;
          const speed = 3.5 + Math.random() * 8.5;
          particlesRef.current.push({
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            x: ox + (Math.random() - 0.5) * 40,
            y: oy + (Math.random() - 0.5) * 30,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 6 + 4.5,
            color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
            rot: Math.random() * Math.PI * 2,
            vRot: (Math.random() - 0.5) * 0.22,
            tilt: Math.random() * Math.PI * 2,
            vTilt: 0.08 + Math.random() * 0.14,
            life: 1,
          });
        }
      }

      if (origin === "cannons") {
        spawnAt(w * 0.12, h * 0.72, -Math.PI / 3, 0.7, Math.ceil(count / 2));
        spawnAt(w * 0.88, h * 0.72, (-2 * Math.PI) / 3, 0.7, Math.floor(count / 2));
      } else if (origin === "fireworks") {
        spawnAt(w * 0.28, h * 0.32, -Math.PI / 2, Math.PI * 1.9, Math.ceil(count / 3));
        spawnAt(w * 0.72, h * 0.28, -Math.PI / 2, Math.PI * 1.9, Math.ceil(count / 3));
        spawnAt(w * 0.5, h * 0.42, -Math.PI / 2, Math.PI * 1.6, Math.ceil(count / 3));
      } else {
        spawnAt(w * 0.5, h * 0.38, -Math.PI / 2, Math.PI * 1.35, count);
      }

      if (rafRef.current) return;

      const tick = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        ctx.clearRect(0, 0, vw, vh);
        particlesRef.current = particlesRef.current.filter(
          (p) => p.life > 0.02 && p.y < vh + 30
        );

        for (const p of particlesRef.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.17;
          p.vx *= 0.988;
          p.rot += p.vRot;
          p.tilt += p.vTilt;
          p.life -= 0.0075;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, Math.cos(p.tilt));
          ctx.fillStyle = p.color;

          if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.48, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.shape === "star") {
            ctx.beginPath();
            const r = p.size * 0.75;
            for (let k = 0; k < 4; k += 1) {
              const a = (k * Math.PI) / 2;
              ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
              ctx.lineTo(
                Math.cos(a + Math.PI / 4) * (r * 0.35),
                Math.sin(a + Math.PI / 4) * (r * 0.35)
              );
            }
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.55);
          }

          ctx.restore();
        }

        if (particlesRef.current.length > 0) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
          ctx.clearRect(0, 0, vw, vh);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
  }));

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
});

export default ConfettiCanvas;
