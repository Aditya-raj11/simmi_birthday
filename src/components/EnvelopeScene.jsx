import { useRef, useState } from "react";

/**
 * Interactive 3D sealed birthday envelope cover that gently floats,
 * tilts with pointer movement, and unfolds when tapped.
 */
export default function EnvelopeScene({ recipientName, isOpening, isFading, onOpen }) {
  const initial = (recipientName.trim()[0] || "S").toUpperCase();
  const wrapperRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  }

  function handlePointerMove(e) {
    if (isOpening || e.pointerType === "touch") return;
    const el = wrapperRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-y * 11).toFixed(2)),
      ry: Number((x * 13).toFixed(2)),
      active: true,
    });
  }

  function resetTilt() {
    setTilt({ rx: 0, ry: 0, active: false });
  }

  const bodyTransform = isOpening
    ? undefined
    : tilt.active
      ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-4px)`
      : undefined;

  return (
    <section
      className={`envelope-scene${isOpening ? " is-opening" : ""}${isFading ? " is-fading" : ""}`}
      aria-label={`Birthday envelope for ${recipientName}`}
    >
      <div className="arrival-tag">
        <span className="arrival-dot" aria-hidden="true" />
        <span>Special Birthday Delivery</span>
      </div>

      <div
        ref={wrapperRef}
        className={`envelope-wrapper${isOpening ? " is-opening" : ""}${tilt.active ? " is-tilting" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={`Open birthday envelope for ${recipientName}`}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <div className="envelope-shadow" aria-hidden="true" />
        <div className="envelope-body" style={{ transform: bodyTransform }}>
          <div className="envelope-liner" aria-hidden="true" />

          <div className="letter-peek" aria-hidden="true">
            <span className="peek-kicker">27 November • For {recipientName}</span>
            <p className="peek-title">Hold on… open kar rahi ho?</p>
            <div className="peek-lines">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="envelope-pocket" aria-hidden="true">
            <div className="pocket-left" />
            <div className="pocket-right" />
            <div className="pocket-bottom" />
          </div>

          <div className="envelope-front-details">
            <div className="front-top-row">
              <div className="postmark">
                27 NOV 2026
                <br />
                DELIVERY: RIGHT ON TIME*
              </div>
              <div className="stamp">
                <div className="stamp-inner">
                  <span className="stamp-year">27</span>
                  <span className="stamp-label">
                    {recipientName}&apos;s
                    <br />
                    Day
                  </span>
                </div>
              </div>
            </div>

            <div className="address-block">
              <div className="address-to">Hand-Delivered For</div>
              <div className="address-name">{recipientName}</div>
            </div>
          </div>

          <div className="envelope-flap" aria-hidden="true" />

          <button
            className="wax-seal"
            type="button"
            aria-label="Break wax seal and open letter"
          >
            <span className="seal-letter">{initial}</span>
          </button>
        </div>
      </div>

      <p className="open-hint">
        Tap the <strong>wax seal</strong> to open your envelope.
        <br />
        <span className="open-subhint">
          (No photos inside — just a few pages written specially for you.)
        </span>
      </p>
    </section>
  );
}
