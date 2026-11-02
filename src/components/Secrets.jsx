import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

// Secret 1: the Konami code (or tapping the ZK logo five times) sets off a storm in the dot field.
function Secrets() {
  const [open, setOpen] = useState(false);
  const box = useRef(null), buf = useRef([]), taps = useRef({ n: 0, t: 0 });
  const close = () => { if (reduced()) return setOpen(false); gsap.to(box.current, { y: 40, opacity: 0, duration: .3, onComplete: () => setOpen(false) }); };
  useLayoutEffect(() => {
    const unlock = () => { window.dispatchEvent(new CustomEvent("field-storm")); setOpen(true); };
    const key = e => {
      buf.current = [...buf.current, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length);
      if (buf.current.join("|") === KONAMI.join("|")) { buf.current = []; unlock(); }
    };
    const tap = e => {
      if (!e.target.closest || !e.target.closest("[data-secret-logo]")) return;
      const now = Date.now(), t = taps.current;
      t.n = now - t.t < 2500 ? t.n + 1 : 1; t.t = now;
      if (t.n >= 5) { t.n = 0; unlock(); }
    };
    window.addEventListener("keydown", key); document.addEventListener("click", tap);
    return () => { window.removeEventListener("keydown", key); document.removeEventListener("click", tap); };
  }, []);
  useLayoutEffect(() => {
    if (!open) return;
    if (!reduced()) {
      gsap.fromTo(box.current, { y: 60, opacity: 0, scale: .95 }, { y: 0, opacity: 1, scale: 1, duration: .6, ease: "back.out(1.5)" });
      gsap.from(box.current.querySelectorAll(".sx-in"), { y: 14, opacity: 0, stagger: .08, delay: .25, duration: .45 });
    }
    const id = setTimeout(close, 9000);
    return () => clearTimeout(id);
  }, [open]);
  if (!open) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
      <div ref={box} role="status" className="pointer-events-auto w-full max-w-md rounded-3xl border border-line bg-card p-6 shadow-2xl">
        <p className="sx-in text-sm text-accent">✦ Secret unlocked</p>
        <h3 className="sx-in mt-1 font-display text-2xl font-bold">You found the field storm.</h3>
        <p className="sx-in mt-2 text-sm text-muted">The dots in the background react to your cursor, your clicks and your scroll. There’s one more secret near the bottom of the page.</p>
        <button onClick={close} className="sx-in mt-4 rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-accent">Close</button>
      </div>
    </div>
  );
}

export default Secrets;
