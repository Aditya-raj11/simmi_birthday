import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AmbientBackdrop from "./components/AmbientBackdrop.jsx";
import ConfettiCanvas from "./components/ConfettiCanvas.jsx";
import EnvelopeScene from "./components/EnvelopeScene.jsx";
import LetterBook from "./components/LetterBook.jsx";

const TOTAL_PAGES = 5;

/**
 * Orchestrates the envelope-opening transition, letter pagination,
 * keyboard navigation, and optional ?to= / ?from= URL customization.
 */
export default function App() {
  const { recipientName, senderName } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to")?.trim();
    const from = params.get("from")?.trim();
    return {
      recipientName: to || "Simmi",
      senderName: from || "Forever in your rinn",
    };
  }, []);

  const [stage, setStage] = useState("sealed"); // "sealed" | "opening" | "fading" | "open"
  const [letterEntered, setLetterEntered] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageDir, setPageDir] = useState("next");
  const [sessionKey, setSessionKey] = useState(0);

  const confettiRef = useRef(null);
  const wishCelebratedRef = useRef(false);
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    document.title = `For ${recipientName} — A Little Birthday Letter`;
    return clearTimers;
  }, [recipientName, clearTimers]);

  const selectPage = useCallback(
    (index, celebrate = true) => {
      if (index < 0 || index >= TOTAL_PAGES || index === currentPage) return;
      setPageDir(index > currentPage ? "next" : "prev");
      setCurrentPage(index);
      if (celebrate && index === 3 && !wishCelebratedRef.current) {
        wishCelebratedRef.current = true;
        confettiRef.current?.launch(58, "cannons");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [currentPage]
  );

  useEffect(() => {
    if (stage !== "open") return undefined;

    function handleKeyDown(e) {
      if (e.key === "ArrowRight" && currentPage < TOTAL_PAGES - 1) {
        selectPage(currentPage + 1);
      } else if (e.key === "ArrowLeft" && currentPage > 0) {
        selectPage(currentPage - 1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage, currentPage, selectPage]);

  function handleOpenEnvelope() {
    if (stage !== "sealed") return;
    clearTimers();
    setStage("opening");
    confettiRef.current?.launch(30, "center");

    const t1 = setTimeout(() => {
      setStage("fading");
    }, 950);

    const t2 = setTimeout(() => {
      setStage("open");
      setPageDir("next");
      setCurrentPage(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setLetterEntered(true));
      });
    }, 1350);

    timersRef.current.push(t1, t2);
  }

  function handleReplay() {
    clearTimers();
    setLetterEntered(false);
    const t = setTimeout(() => {
      setStage("sealed");
      setPageDir("next");
      setCurrentPage(0);
      wishCelebratedRef.current = false;
      setSessionKey((k) => k + 1);
    }, 300);
    timersRef.current.push(t);
  }

  return (
    <>
      <AmbientBackdrop />
      <ConfettiCanvas ref={confettiRef} />

      <main className="stage">
        {stage !== "open" ? (
          <EnvelopeScene
            recipientName={recipientName}
            isOpening={stage === "opening" || stage === "fading"}
            isFading={stage === "fading"}
            onOpen={handleOpenEnvelope}
          />
        ) : (
          <LetterBook
            key={sessionKey}
            recipientName={recipientName}
            senderName={senderName}
            currentPage={currentPage}
            pageDir={pageDir}
            isEntered={letterEntered}
            onSelectPage={selectPage}
            onCelebrate={(count, origin) =>
              confettiRef.current?.launch(count, origin)
            }
            onReplay={handleReplay}
          />
        )}
      </main>
    </>
  );
}
