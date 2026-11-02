import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data";
import { reduced } from "../lib/motion";
import useCtx from "../lib/useCtx";

const NAV_LINKS = [["About", "#about"], ["Services", "#services"], ["Projects", "#projects"], ["Contact", "#contact"]];

function Navbar({ theme, onToggle }) {
  const nav = useRef(null), icon = useRef(null), list = useRef(null), bar = useRef(null);
  const [active, setActive] = useState("");
  const activeRef = useRef("");

  // One underline slides between links: it follows hover and rests under the section you are in.
  const slideTo = (el, instant) => {
    if (!el) { gsap.to(bar.current, { opacity: 0, duration: .25, overwrite: "auto" }); return; }
    const l = list.current.getBoundingClientRect(), r = el.getBoundingClientRect();
    gsap.to(bar.current, { x: r.left - l.left, scaleX: r.width, opacity: 1, duration: instant || reduced() ? 0 : .5, ease: "power3.out", overwrite: "auto" });
  };
  const current = () => list.current.querySelector('[href="' + activeRef.current + '"]');

  useLayoutEffect(() => { activeRef.current = active; slideTo(current(), false); }, [active]);
  useLayoutEffect(() => {
    const ro = new ResizeObserver(() => slideTo(current(), true));
    ro.observe(list.current);
    return () => ro.disconnect();
  }, []);

  useCtx(() => {
    if (reduced()) return;
    gsap.from(nav.current, { y: -60, opacity: 0, duration: .9, ease: "power3.out", delay: 3.9 });
  }, nav);

  // Tracks the current section, and tucks the bar away while scrolling down (it returns on scroll up).
  useLayoutEffect(() => {
    const ids = NAV_LINKS.map(l => l[1]);
    let hidden = false;
    const setHidden = h => { hidden = h; gsap.to(nav.current, { yPercent: h ? -110 : 0, duration: .45, ease: "power3.out", overwrite: "auto" }); };
    const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: self => {
      let a = "";
      ids.forEach(id => { const t = document.querySelector(id); if (t && t.getBoundingClientRect().top <= window.innerHeight * .45) a = id; });
      if (a !== activeRef.current) setActive(a);
      if (reduced()) return;
      if (self.direction === 1 && self.scroll() > 240 && !hidden) setHidden(true);
      else if (self.direction === -1 && hidden) setHidden(false);
    } });
    const show = () => { if (hidden) setHidden(false); };
    const el = nav.current;
    el.addEventListener("focusin", show);
    return () => { st.kill(); el.removeEventListener("focusin", show); };
  }, []);

  return (
    <header ref={nav} className="fixed inset-x-0 top-0 z-30 backdrop-blur-md" style={{ background: "color-mix(in srgb, var(--bg) 75%, transparent)", paddingTop: "env(safe-area-inset-top,0px)" }}>
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4 md:px-12">
        <a href="#" data-secret-logo className="font-display text-lg font-bold"><span className="hidden sm:inline">{profile.name}</span><span className="sm:hidden">ZK</span></a>
        <nav aria-label="Main">
          <div ref={list} className="relative flex gap-4 sm:gap-8" onMouseLeave={() => slideTo(current())}>
            {NAV_LINKS.map(([n, h]) => (
              <a key={n} href={h} onMouseEnter={e => slideTo(e.currentTarget)} onFocus={e => slideTo(e.currentTarget)} onBlur={() => slideTo(current())}
                 className={"relative py-1.5 text-sm transition-colors " + (active === h ? "text-fg" : "text-muted hover:text-fg")}>{n}</a>
            ))}
            <span ref={bar} className="pointer-events-none absolute -bottom-0.5 left-0 h-[2px] w-px origin-left bg-accent" style={{ opacity: 0 }} aria-hidden="true" />
          </div>
        </nav>
        <div className="flex justify-end">
          <button onClick={() => { if (!reduced()) gsap.fromTo(icon.current, { rotate: -120, scale: .4 }, { rotate: 0, scale: 1, duration: .6, ease: "back.out(2)" }); onToggle(); }}
                  aria-label={"Switch to " + (theme === "dark" ? "light" : "dark") + " theme"} className="grid h-10 w-10 place-items-center rounded-full border border-line">
            <svg ref={icon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {theme === "dark" ? <g><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></g> : <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
