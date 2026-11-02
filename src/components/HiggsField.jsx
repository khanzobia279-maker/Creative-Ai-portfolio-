import { useRef, useLayoutEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { reduced } from "../lib/motion";

// A fixed backdrop of dots. They gain "mass" near your cursor, ripple when you click, and stretch and shimmer as you scroll.
function HiggsField() {
  const cv = useRef(null);
  useLayoutEffect(() => {
    const el = cv.current, c = el.getContext("2d");
    const GAP = 28, R = 170, TAU = Math.PI * 2;
    let w = 0, h = 0, pts = [], raf = 0, waves = [], vel = 0, lastY = -1;
    const mouse = { x: -999, y: -999 }, sv = { t: 0 }, active = [];
    const read = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    const draw = () => {
      const now = performance.now(), sy = window.scrollY, shift = (sy * .12) % GAP;   // the field drifts slower than the page, for depth
      c.clearRect(0, 0, w, h);
      sv.t *= .92; vel += (sv.t - vel) * .2;
      waves = waves.filter(wv => now - wv.t < 1400);
      let moving = vel > .01 || sy !== lastY || waves.length > 0;
      lastY = sy; active.length = 0;
      c.fillStyle = read("--line"); c.beginPath();
      for (const p of pts) {
        const y = p.y - shift;
        let target = Math.max(0, 1 - Math.hypot(p.x - mouse.x, y - mouse.y) / R);
        for (const wv of waves) { const age = (now - wv.t) / 1000; if (age < 0) continue; target = Math.max(target, Math.max(0, 1 - Math.abs(Math.hypot(p.x - wv.x, y - wv.y) - age * 520) / 70) * (1 - age / 1.4)); }
        target = Math.max(target, vel * (.5 + .5 * Math.sin((p.x + y) * .012 + now * .004)) * .55);   // scrolling sends a shimmer through the field
        p.m += (target - p.m) * .12;
        if (Math.abs(target - p.m) > .01) moving = true;
        p.dy = y;
        if (p.m > .05 || vel > .02) active.push(p); else { c.moveTo(p.x + 1.5, y); c.arc(p.x, y, 1.5, 0, TAU); }
      }
      c.fill();
      const hot = read("--accent"), line = read("--line"), stretch = 1 + vel * 2.5;
      for (const p of active) {
        c.beginPath(); c.ellipse(p.x, p.dy, 1.5 + p.m * 3.2, (1.5 + p.m * 3.2) * stretch, 0, 0, TAU);
        c.fillStyle = p.m > .05 ? hot : line;
        c.globalAlpha = p.m > .05 ? .35 + p.m * .65 : 1;
        c.fill();
      }
      c.globalAlpha = 1;
      return moving;
    };
    const loop = () => { raf = draw() ? requestAnimationFrame(loop) : 0; };   // stops by itself once everything has settled
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth; h = window.innerHeight;
      el.width = w * dpr; el.height = h * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = [];
      for (let y = -GAP / 2; y < h + GAP; y += GAP) for (let x = GAP / 2; x < w; x += GAP) pts.push({ x, y, m: 0, dy: y });
      draw();
    };
    build();
    let resizing = 0;
    const onResize = () => { cancelAnimationFrame(resizing); resizing = requestAnimationFrame(build); };
    const mo = new MutationObserver(() => { if (!raf) draw(); });                         // repaint when the theme colors change
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    window.addEventListener("resize", onResize);

    const move = e => { mouse.x = e.clientX; mouse.y = e.clientY; kick(); };
    const leave = () => { mouse.x = mouse.y = -999; kick(); };
    const ripple = e => { waves.push({ x: e.clientX, y: e.clientY, t: performance.now() }); kick(); };
    const storm = () => { const n = performance.now(); for (let i = 0; i < 7; i++) waves.push({ x: Math.random() * w, y: Math.random() * h, t: n + i * 220 }); kick(); };
    let st = null;
    if (!reduced()) {
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerdown", ripple, { passive: true });
      document.documentElement.addEventListener("mouseleave", leave);
      window.addEventListener("field-storm", storm);
      st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: self => { sv.t = Math.min(1, Math.abs(self.getVelocity()) / 2200); kick(); } });
    }
    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(resizing); mo.disconnect(); st && st.kill();
      window.removeEventListener("resize", onResize); window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", ripple);
      window.removeEventListener("field-storm", storm); document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, []);
  return <canvas ref={cv} className="pointer-events-none fixed inset-0 -z-10 h-full w-full" aria-hidden="true" />;
}

export default HiggsField;
