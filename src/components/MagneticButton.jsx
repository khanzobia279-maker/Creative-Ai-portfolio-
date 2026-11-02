import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

function MagneticButton({ variant = "solid", as: Tag = "a", children, ...props }) {
  const root = useRef(null), fill = useRef(null), label = useRef(null), pull = useRef(null);
  const solid = variant === "solid";
  useLayoutEffect(() => {
    gsap.set(fill.current, { yPercent: 100 });
    // quickTo reuses one tween per axis, so following the cursor stays smooth and cheap.
    pull.current = { x: gsap.quickTo(root.current, "x", { duration: .6, ease: "power3" }), y: gsap.quickTo(root.current, "y", { duration: .6, ease: "power3" }) };
  }, []);
  const move = e => { const r = root.current.getBoundingClientRect(); pull.current.x((e.clientX - r.left - r.width / 2) * .25); pull.current.y((e.clientY - r.top - r.height / 2) * .35); };
  const enter = () => { gsap.to(fill.current, { yPercent: 0, duration: .45, ease: "power3.out" }); gsap.to(label.current, { color: solid ? "var(--bg)" : "#0e100f", duration: .3 }); };
  const leave = () => {
    pull.current.x(0); pull.current.y(0);
    gsap.to(root.current, { scale: 1, duration: .3, ease: "power3.out" });
    gsap.to(fill.current, { yPercent: 100, duration: .4, ease: "power3.inOut" });
    gsap.to(label.current, { color: solid ? "#0e100f" : "var(--fg)", duration: .3 });
  };
  const down = () => gsap.to(root.current, { scale: .95, duration: .15, ease: "power2.out" });   // press feedback
  const up = () => gsap.to(root.current, { scale: 1, duration: .6, ease: "elastic.out(1, .5)" });
  return (
    <Tag ref={root} onMouseMove={move} onMouseEnter={enter} onMouseLeave={leave} onPointerDown={down} onPointerUp={up} className={"relative inline-flex overflow-hidden rounded-full px-7 py-3.5 font-medium " + (solid ? "bg-accent" : "border border-line")} {...props}>
      <span ref={fill} className={"absolute inset-0 rounded-full " + (solid ? "bg-fg" : "bg-accent")} aria-hidden="true" />
      <span ref={label} className="relative" style={{ color: solid ? "#0e100f" : "var(--fg)" }}>{children}</span>
    </Tag>
  );
}

export default MagneticButton;
