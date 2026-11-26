import { useEffect, useRef } from "react";

const FLOATING_MOTES = [
  { id: 1, symbol: "✦", left: "8%", size: "0.95rem", dur: "14s", delay: "-2s", drift: "18px" },
  { id: 2, symbol: "✧", left: "18%", size: "0.75rem", dur: "18s", delay: "-9s", drift: "-22px" },
  { id: 3, symbol: "❀", left: "28%", size: "0.9rem", dur: "16s", delay: "-5s", drift: "26px" },
  { id: 4, symbol: "✦", left: "41%", size: "0.7rem", dur: "20s", delay: "-13s", drift: "-14px" },
  { id: 5, symbol: "·", left: "52%", size: "1.3rem", dur: "13s", delay: "-4s", drift: "20px" },
  { id: 6, symbol: "✧", left: "64%", size: "0.85rem", dur: "17s", delay: "-11s", drift: "-24px" },
  { id: 7, symbol: "✦", left: "75%", size: "1rem", dur: "15s", delay: "-7s", drift: "16px" },
  { id: 8, symbol: "❀", left: "86%", size: "0.82rem", dur: "19s", delay: "-15s", drift: "-20px" },
  { id: 9, symbol: "✧", left: "93%", size: "0.72rem", dur: "14.5s", delay: "-3s", drift: "14px" },
  { id: 10, symbol: "✦", left: "34%", size: "0.8rem", dur: "21s", delay: "-17s", drift: "22px" },
  { id: 11, symbol: "·", left: "70%", size: "1.2rem", dur: "16.5s", delay: "-6s", drift: "-16px" },
  { id: 12, symbol: "✧", left: "13%", size: "0.88rem", dur: "22s", delay: "-12s", drift: "24px" },
];

/**
 * Ambient animated background with drifting watercolor aura blobs,
 * floating typographic sparkles/petals, and subtle pointer parallax.
 */
export default function AmbientBackdrop() {
  const layerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    function handlePointerMove(e) {
      if (!layerRef.current || e.pointerType === "touch") return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      layerRef.current.style.setProperty("--px", `${(nx * 14).toFixed(1)}px`);
      layerRef.current.style.setProperty("--py", `${(ny * 10).toFixed(1)}px`);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div ref={layerRef} className="ambient-backdrop" aria-hidden="true">
      <div className="aura-orb aura-orb--rose" />
      <div className="aura-orb aura-orb--gold" />
      <div className="aura-orb aura-orb--cream" />

      <div className="motes-layer">
        {FLOATING_MOTES.map((mote) => (
          <span
            key={mote.id}
            className="floating-mote"
            style={{
              left: mote.left,
              fontSize: mote.size,
              animationDuration: mote.dur,
              animationDelay: mote.delay,
              "--drift": mote.drift,
            }}
          >
            {mote.symbol}
          </span>
        ))}
      </div>
    </div>
  );
}
