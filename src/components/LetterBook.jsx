import { useState } from "react";

const PAGE_PILLS = [
  "1. Wait a sec",
  "2. The Wish",
  "3. Little Notes",
  "4. Make a Wish",
];

const POLL_OPTIONS = [
  {
    id: "thoda",
    label: "Haan, thoda sa! 🙄",
    reply:
      "Haha, thoda sa suspense toh banta tha! Chalo ab next page dekho — saara gussa gayab ho jayega ✨",
  },
  {
    id: "knew",
    label: "Nahi, I knew you had a plan 😉",
    reply:
      "Smart! Tumhe pata tha kuch na kuch chal raha hoga. Ab next page kholo ✨",
  },
];

const FOLDED_NOTES = [
  {
    num: "01",
    heading: "For the days that feel heavy",
    body: "Whenever things get overwhelming, pause for a second and remember how far you have already come. You carry yourself with more grace and strength than you give yourself credit for.",
  },
  {
    num: "02",
    heading: "For the year ahead of you",
    body: "May your next twelve months be full of good conversations, late-night smiles, zero unnecessary stress, and small moments that turn into your favorite memories.",
  },
  {
    num: "03",
    heading: "A tiny reminder (just in case)",
    body: "Chahe wish subah aaye ya thodi der se, you are genuinely appreciated — aaj bhi, aur har roz bhi. Never forget that!",
  },
];

/**
 * Multi-page interactive birthday letter with playful late-wish banter,
 * birthday wishes, unfoldable paper notes, and a blow-out birthday candle.
 */
export default function LetterBook({
  recipientName,
  senderName,
  currentPage,
  isEntered,
  onSelectPage,
  onCelebrate,
  onReplay,
}) {
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [openNotes, setOpenNotes] = useState(() => new Set(["01"]));
  const [candleOut, setCandleOut] = useState(false);

  const initial = (recipientName.trim()[0] || "S").toUpperCase();
  const activePollReply =
    POLL_OPTIONS.find((opt) => opt.id === selectedPoll)?.reply || "";

  function toggleNote(num) {
    setOpenNotes((prev) => {
      const next = new Set(prev);
      if (next.has(num)) {
        next.delete(num);
      } else {
        next.add(num);
      }
      return next;
    });
  }

  function handleCandleClick() {
    const nextState = !candleOut;
    setCandleOut(nextState);
    if (nextState) {
      onCelebrate(75);
    }
  }

  return (
    <section
      className={`letter-shell${isEntered ? " is-entered" : ""}`}
      aria-label="Birthday letter pages"
    >
      <div className="letter-topbar">
        <div className="mini-badge">
          <span className="mini-seal" aria-hidden="true">
            {initial}
          </span>
          <span>{recipientName}&apos;s Birthday Letter</span>
        </div>

        <nav className="page-pills" aria-label="Letter pages">
          {PAGE_PILLS.map((label, idx) => (
            <button
              key={label}
              className={`page-pill${currentPage === idx ? " is-active" : ""}`}
              type="button"
              onClick={() => onSelectPage(idx)}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      <article className="stationery-card">
        {currentPage === 0 && (
          <div className="page">
            <div className="page-meta">
              <span className="page-kicker">Page 01 • Before Anything Else</span>
              <span className="page-num">i / iv</span>
            </div>

            <h1 className="page-title">
              Pehle toh… <em>sorry</em> itna late wish karne ke liye.
            </h1>

            <div className="prose">
              <p>
                Okay, okay… let&apos;s clear the air right away before you start
                judging my timing.
              </p>
            </div>

            <div className="tease-box">
              <p className="tease-quote">
                &ldquo;Wait… tumhe kya laga, main bhool gaya tha?&rdquo;
              </p>
              <p className="tease-sub">
                Nahi {recipientName} — main toh kuch plan kar raha tha! 😌
              </p>
            </div>

            <div className="prose">
              <p>
                Honestly, seedha clock dekh kar ek plain sa{" "}
                <em>&ldquo;Happy Birthday&rdquo;</em> text bhej dena toh koi bhi
                kar leta. Par tumhara birthday hai — thoda suspense, thoda drama,
                aur ek proper surprise toh banta tha na?
              </p>
              <p>
                So no, I definitely didn&apos;t forget. I just wanted to take a
                moment and put something together specifically for you, rather
                than rushing a message. Consider this{" "}
                <strong>fashionably late, completely intentional</strong>.
              </p>
            </div>

            <div className="mini-poll">
              <p className="mini-poll-q">
                Sach sach batao — thoda sa gussa aaya tha kya? 👀
              </p>
              <div className="poll-actions">
                {POLL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    className={`poll-btn${selectedPoll === opt.id ? " is-picked" : ""}`}
                    type="button"
                    onClick={() => setSelectedPoll(opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="poll-reply" aria-live="polite">
                {activePollReply}
              </div>
            </div>
          </div>
        )}

        {currentPage === 1 && (
          <div className="page">
            <div className="page-meta">
              <span className="page-kicker">Page 02 • The Real Celebration</span>
              <span className="page-num">ii / iv</span>
            </div>

            <h1 className="page-title">
              Happy Birthday, <em>{recipientName}</em> ✨
            </h1>

            <div className="prose">
              <p>
                Now that the teasing part is officially out of the way — here is
                the wish I actually stayed up planning for you.
              </p>
              <p>
                I hope this new year of your life brings you calm, unhurried
                mornings, the kind of laughter that makes your cheeks hurt, and
                unexpected good news on days when you need it most.
              </p>
              <p>
                May you always stay surrounded by people who value your warmth,
                understand your silence as easily as your words, and cheer loudly
                for every little win you achieve. Whatever you&apos;ve been
                quietly hoping and working toward — I hope this is the year it
                all starts falling effortlessly into place.
              </p>
              <p>
                You deserve a birthday that feels soft, happy, and entirely
                yours.
              </p>
            </div>

            <div className="signature-block">
              <span className="sig-label">With all the best wishes,</span>
              <span className="sig-name">{senderName}</span>
            </div>
          </div>
        )}

        {currentPage === 2 && (
          <div className="page">
            <div className="page-meta">
              <span className="page-kicker">Page 03 • Three Paper Slips</span>
              <span className="page-num">iii / iv</span>
            </div>

            <h1 className="page-title">
              Little notes folded just for <em>you</em>.
            </h1>

            <div className="prose">
              <p>
                Tap each note below to unfold it — think of these as tiny chits
                tucked inside the envelope.
              </p>
            </div>

            <div className="notes-stack">
              {FOLDED_NOTES.map((note) => {
                const isOpen = openNotes.has(note.num);
                return (
                  <div
                    key={note.num}
                    className={`folded-note${isOpen ? " is-unfolded" : ""}`}
                  >
                    <button
                      className="note-trigger"
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => toggleNote(note.num)}
                    >
                      <span className="note-trigger-left">
                        <span className="note-num">{note.num}</span>
                        <span className="note-heading">{note.heading}</span>
                      </span>
                      <span className="note-state">
                        {isOpen ? "Folded / Open" : "Tap to unfold"}
                      </span>
                    </button>
                    <div className="note-body">{note.body}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentPage === 3 && (
          <div className="page">
            <div className="page-meta">
              <span className="page-kicker">Page 04 • Make a Wish</span>
              <span className="page-num">iv / iv</span>
            </div>

            <h1 className="page-title">
              One last thing before you close this…
            </h1>

            <div className="prose">
              <p>
                No photos, no loud banners — just a quiet little candle waiting
                for your birthday wish.
              </p>
            </div>

            <div className="candle-stage">
              <button
                className={`candle-btn${candleOut ? " is-out" : ""}`}
                type="button"
                aria-label="Tap the candle to blow out the flame and make a wish"
                onClick={handleCandleClick}
              >
                <div className="flame-wrap">
                  <div className="flame" aria-hidden="true" />
                  <div className="smoke" aria-hidden="true" />
                </div>
                <div className="wick" aria-hidden="true" />
                <div className="candle-wax" aria-hidden="true" />
                <div className="candle-plate" aria-hidden="true" />
              </button>

              {!candleOut ? (
                <p className="candle-caption">
                  Close your eyes for a second, think of one wish, and{" "}
                  <strong>tap the candle</strong> to blow it out.
                </p>
              ) : (
                <p className="wish-granted">
                  Happy Birthday, {recipientName}! May it come true ✨
                </p>
              )}
            </div>

            <div className="prose">
              <p className="closing-center">
                So yes — late wish, extra planning, and a whole lot of good
                wishes for you today and always.
              </p>
            </div>
          </div>
        )}

        <footer className="card-footer">
          <button
            className="btn-ghost"
            type="button"
            disabled={currentPage === 0}
            onClick={() => onSelectPage(currentPage - 1)}
          >
            ← Previous
          </button>

          <button
            className="btn-primary"
            type="button"
            onClick={() => {
              if (currentPage < PAGE_PILLS.length - 1) {
                onSelectPage(currentPage + 1);
              } else {
                onCelebrate(60);
              }
            }}
          >
            {currentPage === PAGE_PILLS.length - 1
              ? "Celebrate 🎉"
              : "Next Page →"}
          </button>
        </footer>
      </article>

      <div className="replay-wrap">
        <button className="btn-replay" type="button" onClick={onReplay}>
          ↺ Fold &amp; replay the envelope
        </button>
      </div>
    </section>
  );
}
