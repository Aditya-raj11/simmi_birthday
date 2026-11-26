import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const PALETTE = ["#b84457", "#c39552", "#e8a0ab", "#f2cf8d", "#d96b7c"];

/**
 * Full-viewport pastel paper confetti overlay triggered imperatively via ref.launch(count).
 */
const ConfettiCanvas = forwardRef(function ConfettiCanvas(_, ref) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
    launch(count = 50) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      for (let i = 0; i < count; i += 1) {
        particlesRef.current.push({
          x: window.innerWidth * (0.2 + Math.random() * 0.6),
          y: window.innerHeight * 0.35 + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 7,
          vy: -Math.random() * 7 - 2.5,
          size: Math.random() * 6 + 4,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.2,
          life: 1,
        });
      }

      if (rafRef.current) return;

      const tick = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesRef.current = particlesRef.current.filter(
          (p) => p.life > 0.02 && p.y < canvas.height + 20
        );

        for (const p of particlesRef.current) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.16;
          p.vx *= 0.99;
          p.rot += p.vRot;
          p.life -= 0.008;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.55);
          ctx.restore();
        }

        if (particlesRef.current.length > 0) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    },
  }));

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
});

export default ConfettiCanvas;
