import { useState } from "react";

const PAGE_PILLS = [
  "1. Wait a sec",
  "2. Our Story",
  "3. Believe It",
  "4. The Wish",
  "5. Make a Wish",
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

const CONFIDENCE_REMINDERS = [
  "You are beautiful — not because someone else says it, par kyunki tumhari presence aur warmth khud bolti hai.",
  "Stop telling yourself you're not enough. Apne doubts ko apni value decide mat karne do.",
  "Carry confidence within yourself, Simmi — when you trust yourself, everything about you shines even brighter.",
];

const FOLDED_NOTES = [
  {
    num: "01",
    heading: "For the days you doubt yourself",
    body: "Whenever that quiet voice tries to tell you that you aren't good enough or beautiful enough, shut it down immediately. Look at yourself with half the kindness you show everyone else — you are genuinely remarkable.",
  },
  {
    num: "02",
    heading: "For the year ahead of you",
    body: "May your next twelve months be full of good conversations, late-night smiles, zero unnecessary stress, and small moments that turn into your favorite memories.",
  },
  {
    num: "03",
    heading: "A tiny reminder (just in case)",
    body: "Chahe wish subah aaye ya thodi der se, aur chahe hamari pehli baat sirf 2 mahine pehle hui ho — you are genuinely appreciated, aaj bhi aur har roz bhi!",
  },
];

/**
 * Multi-page interactive birthday letter with playful late-wish banter,
 * personal stories (Saket & confidence storytelling), birthday wishes,
 * unfoldable paper notes, and a blow-out birthday candle.
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
  const [reminderIndex, setReminderIndex] = useState(0);
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
        {/* PAGE 1: PLAYFUL LATE-WISH / CHIDHANE WALA PAGE */}
        {currentPage === 0 && (
          <div className="page">
            <div className="page-meta">
              <span className="page-kicker">Page 01 • Before Anything Else</span>
              <span className="page-num">i / v</span>
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

        {/* PAGE 2: OUR STORY (2 MONTHS AGO, SAKET & RINN) */}
        {currentPage === 1 && (
          <div className="page">
            <div className="page-meta">
              <span className="page-kicker">Page 02 • Two Months Ago</span>
              <span className="page-num">ii / v</span>
            </div>

            <h1 className="page-title">
              Tumhe pata hai hamari <em>pehli baat</em> kab hui thi?
            </h1>

            <div className="prose">
              <p>
                Socho toh kitna crazy lagta hai — hamari first baat huye abhi
                bas <strong>2 mahine pehle</strong> ki toh baat hai… aur woh
                bhi <strong>Saket</strong> ke through!
              </p>
              <p>
                Tab kahan pata tha ki itne kam time mein itni achi bonding ho
                jayegi. Kuch log life mein bilkul quietly aate hain, aur sirf do
                mahinon mein aisa lagne lagta hai jaise unse baat karna din ka
                sabse natural aur comfort wala hissa ban gaya ho.
              </p>
            </div>

            <div className="tease-box story-box">
              <p className="tease-quote">
                &ldquo;Thank you agaaaiiiinnnnnn, Saket se baat karwaane ke liye!&rdquo;
              </p>
              <p className="tease-sub">
                Sach mein, uss cheez ke liye toh hum tumhare upar rinn mein aa gaye hain 😌🙏
              </p>
            </div>

            <div className="prose">
              <p>
                Seriously, jis tarah tumne uss waqt help ki aur baat karwayi,
                that wasn&apos;t a small thing at all — woh rinn toh ab zindagi
                bhar rahega! So today on your birthday, I just had to bring that
                little story back and say one more heartfelt thank you.
              </p>
            </div>
          </div>
        )}

        {/* PAGE 3: STORYTELLING ON CONFIDENCE & BEAUTY */}
        {currentPage === 2 && (
          <div className="page">
            <div className="page-meta">
              <span className="page-kicker">Page 03 • A Truth About You</span>
              <span className="page-num">iii / v</span>
            </div>

            <h1 className="page-title">
              Why do you keep telling yourself you&apos;re <em>not</em>?
            </h1>

            <div className="prose">
              <p>
                Ek chhoti si baat hai jo mujhe kaafi time se kehni thi — especially
                aaj ke din. Kabhi notice kiya hai? Tum doosron ko toh itne aaram
                se comfort feel kara deti ho, par jab baat khud ki aati hai, you
                start doubting yourself.
              </p>
              <p>
                It&apos;s like standing in front of a mirror that somehow hides
                everything lovely about you and only zooms in on imaginary flaws.
                Jab aas-paas ke log dekhte hain ki tum kitni genuine, warm, aur
                effortlessly graceful ho — toh phir{" "}
                <strong>
                  why do you keep telling yourself that you are not beautiful?
                </strong>
              </p>
            </div>

            <div className="tease-box confidence-box">
              <p className="tease-quote">
                You are beautiful, {recipientName} — inside and out.
              </p>
              <p className="tease-sub">
                You have to carry that confidence within yourself! ✨
              </p>
            </div>

            <div className="prose">
              <p>
                Real beauty kisi filter ya kisi ke approval se nahi banti — it
                lives in your smile, the honesty in your eyes, the way you care,
                aur woh sukoon jo tumse baat karke milta hai. So this year,
                promise yourself you&apos;ll stop shrinking yourself down. Walk
                with confidence, own your presence, and start seeing yourself the
                way you truly are.
              </p>
            </div>

            <div className="mini-poll">
              <p className="mini-poll-q">
                Birthday reminder #{reminderIndex + 1} of {CONFIDENCE_REMINDERS.length}:
              </p>
              <p className="reminder-text">{CONFIDENCE_REMINDERS[reminderIndex]}</p>
              <button
                className="poll-btn"
                type="button"
                onClick={() =>
                  setReminderIndex((prev) => (prev + 1) % CONFIDENCE_REMINDERS.length)
                }
              >
                Read another reminder →
              </button>
            </div>
          </div>
        )}

        {/* PAGE 4: HEARTFELT BIRTHDAY WISH + FOLDED NOTES */}
        {currentPage === 3 && (
          <div className="page">
            <div className="page-meta">
              <span className="page-kicker">Page 04 • The Celebration</span>
              <span className="page-num">iv / v</span>
            </div>

            <h1 className="page-title">
              Happy Birthday, <em>{recipientName}</em> ✨
            </h1>

            <div className="prose">
              <p>
                I hope this new year of your life brings you calm, unhurried
                mornings, the kind of laughter that makes your cheeks hurt, and
                unexpected good news on days when you need it most.
              </p>
              <p>
                May you always stay surrounded by people who value your warmth,
                cheer loudly for your wins, and never let you forget how special
                you are. Tap each little slip tucked below whenever you feel
                like reading them again:
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

            <div className="signature-block">
              <span className="sig-label">With all the best wishes,</span>
              <span className="sig-name">{senderName}</span>
            </div>
          </div>
        )}

        {/* PAGE 5: INTERACTIVE CANDLE & CLOSING */}
        {currentPage === 4 && (
          <div className="page">
            <div className="page-meta">
              <span className="page-kicker">Page 05 • Make a Wish</span>
              <span className="page-num">v / v</span>
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
                  Happy Birthday, {recipientName}! Stay confident &amp; keep shining ✨
                </p>
              )}
            </div>

            <div className="prose">
              <p className="closing-center">
                Late wish, a grateful heart, and a whole lot of good wishes for
                you today and always.
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
