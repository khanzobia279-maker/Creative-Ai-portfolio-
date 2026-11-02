import { useRef } from "react";
import gsap from "gsap";
import { reduced } from "../lib/motion";

// Secret 2: a flashlight that reveals hidden text wherever your cursor (or finger) goes.
function SecretReveal() {
  const box = useRef(null), pos = useRef({ x: 0, y: 0, r: 1 });
  const mask = "radial-gradient(circle var(--sr) at var(--sx) var(--sy), #000 0%, transparent 100%)";
  const set = () => { const b = box.current, p = pos.current; if (b) { b.style.setProperty("--sx", p.x + "px"); b.style.setProperty("--sy", p.y + "px"); b.style.setProperty("--sr", p.r + "px"); } };
  const move = e => { const r = box.current.getBoundingClientRect(); gsap.to(pos.current, { x: e.clientX - r.left, y: e.clientY - r.top, r: 170, duration: .35, ease: "power3.out", overwrite: true, onUpdate: set }); };
  const leave = () => gsap.to(pos.current, { r: 1, duration: .5, ease: "power3.in", overwrite: true, onUpdate: set });
  const still = reduced();
  return (
    <div ref={box} onPointerMove={move} onPointerDown={move} onPointerLeave={leave} className="relative mt-20 overflow-hidden rounded-3xl border border-dashed border-line px-6 py-14 md:px-12" style={{ "--sx": "0px", "--sy": "0px", "--sr": "1px" }}>
      <p className="text-sm text-muted">A little something for the curious. Move your cursor over this box.</p>
      <p className="mt-6 font-display text-3xl font-extrabold leading-tight md:text-6xl" style={still ? { color: "var(--accent)" } : { color: "var(--accent)", WebkitMaskImage: mask, maskImage: mask }}>You found it. Looking this closely tells me you care about the details, and so do I.</p>
    </div>
  );
}

export default SecretReveal;
