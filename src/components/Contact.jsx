import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { profile, FORM_ENDPOINT, WEB3FORMS_KEY } from "../data";
import { reduced } from "../lib/motion";
import useCtx from "../lib/useCtx";
import Words from "./Words";
import MagneticButton from "./MagneticButton";
import SectionLabel from "./SectionLabel";
import SecretReveal from "./SecretReveal";

function Contact() {
  const root = useRef(null), form = useRef(null);
  const [status, setStatus] = useState({ type: "idle", text: "" });
  useCtx(() => {
    if (reduced()) return;
    gsap.from(".f-char", { yPercent: 115, stagger: .025, duration: .9, ease: "power4.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
    gsap.from(".f-fade", { y: 30, opacity: 0, stagger: .12, duration: .8, scrollTrigger: { trigger: root.current, start: "top 55%" } });
  }, root);
  // Feedback slides in each time the status changes.
  useLayoutEffect(() => { if (status.text && !reduced()) gsap.fromTo(".f-status", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: "power3.out" }); }, [status]);

  const fail = () => setStatus({ type: "error", text: "Your message wasn’t sent. Please try again, or email me at " + profile.email + "." });
  const send = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (data.botcheck) return;                                   // hidden spam trap: real visitors never fill it in
    setStatus({ type: "sending", text: "Sending your message…" });

    if (WEB3FORMS_KEY || FORM_ENDPOINT) {                        // direct delivery to your inbox through a form service
      const subject = "Portfolio message from " + data.name;
      const url = WEB3FORMS_KEY ? "https://api.web3forms.com/submit" : FORM_ENDPOINT;
      const body = WEB3FORMS_KEY
        ? { access_key: WEB3FORMS_KEY, subject, from_name: "Portfolio contact form", name: data.name, email: data.email, message: data.message }
        : { name: data.name, email: data.email, message: data.message, _subject: subject };
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) })
        .then(r => r.json().catch(() => ({})).then(j => {
          if (!r.ok || j.success === false) throw new Error(j.message || "failed");
          form.current.reset();
          setStatus({ type: "success", text: "Message sent. Thank you, I’ll reply soon!" });
        }))
        .catch(fail);
      return;
    }
    // Fallback when no form service is configured: open a pre-filled Gmail compose window addressed to Zobia.
    const subject = "Portfolio message from " + data.name;
    const text = data.message + "\n\n" + data.name + " (" + data.email + ")";
    const gmail = "https://mail.google.com/mail/?view=cm&fs=1&to=" + profile.email + "&su=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
    if (!window.open(gmail, "_blank")) window.location.href = "mailto:" + profile.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
    setTimeout(() => { form.current.reset(); setStatus({ type: "success", text: "Gmail opened with your message ready. Press Send there to deliver it." }); }, 700);
  };
  const sending = status.type === "sending";
  const field = "w-full rounded-2xl border border-line bg-card px-5 py-4 outline-none transition-colors focus:border-accent";
  return (
    <footer id="contact" ref={root} className="border-t border-line px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl"><SectionLabel n="04" t="Contact" /></div>
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-7xl"><Words text="Let’s build something together." cls="f-char" /></h2>
          <p className="f-fade mt-6 max-w-md text-lg text-muted">Send me a message and it goes straight to my Gmail. I’m open to frontend internships, jobs and freelance work.</p>
          <div className="f-fade mt-8 flex flex-wrap gap-4">
            <MagneticButton variant="outline" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</MagneticButton>
            <MagneticButton variant="outline" href={profile.github} target="_blank" rel="noreferrer">GitHub</MagneticButton>
          </div>
        </div>
        <form ref={form} onSubmit={send} className="f-fade space-y-4">
          <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <label className="block"><span className="mb-2 block text-sm text-muted">Your name</span><input name="name" required disabled={sending} className={field} autoComplete="name" /></label>
          <label className="block"><span className="mb-2 block text-sm text-muted">Your email</span><input name="email" type="email" required disabled={sending} className={field} autoComplete="email" /></label>
          <label className="block"><span className="mb-2 block text-sm text-muted">Message</span><textarea name="message" required rows="5" disabled={sending} className={field} /></label>
          <MagneticButton as="button" type="submit" disabled={sending} aria-busy={sending}>
            {sending ? <span className="inline-flex items-center gap-2"><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Sending…</span> : "Send message"}
          </MagneticButton>
          <p role="status" aria-live="polite" className="f-status text-sm" style={{ color: status.type === "error" ? "#e0568a" : "var(--accent)" }}>
            {status.type === "success" && "✓ "}{status.type === "error" && "✕ "}{status.text}
          </p>
        </form>
      </div>
      <div className="mx-auto max-w-7xl"><SecretReveal /></div>
      <p className="mx-auto mt-10 max-w-7xl text-sm text-muted">© 2026 {profile.name} · {profile.location}</p>
    </footer>
  );
}

export default Contact;
