/**
 * Interactive 3D sealed birthday envelope cover that opens when tapped.
 */
export default function EnvelopeScene({ recipientName, isOpening, isFading, onOpen }) {
  const initial = (recipientName.trim()[0] || "S").toUpperCase();

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  }

  return (
    <section
      className={`envelope-scene${isFading ? " is-fading" : ""}`}
      aria-label={`Birthday envelope for ${recipientName}`}
    >
      <div className="arrival-tag">
        <span className="arrival-dot" aria-hidden="true" />
        <span>Special Birthday Delivery</span>
      </div>

      <div
        className={`envelope-wrapper${isOpening ? " is-opening" : ""}`}
        role="button"
        tabIndex={0}
        aria-label={`Open birthday envelope for ${recipientName}`}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
      >
        <div className="envelope-shadow" aria-hidden="true" />
        <div className="envelope-body">
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
            {initial}
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
