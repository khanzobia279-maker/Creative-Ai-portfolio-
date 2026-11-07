import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { profile, DIRECT_EMAIL, FORM_ENDPOINT, WEB3FORMS_KEY } from "../data";
import { reduced } from "../lib/motion";
import useCtx from "../lib/useCtx";
import Words from "./Words";
import MagneticButton from "./MagneticButton";
import SectionLabel from "./SectionLabel";
import SecretReveal from "./SecretReveal";
import ResumeButton from "./ResumeButton";

function Contact() {
  const root = useRef(null), form = useRef(null);
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const [links, setLinks] = useState(null);
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
    if (status.type === "sending") return;
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (data.botcheck) return;                                   // hidden spam trap: real visitors never fill it in
    setStatus({ type: "sending", text: "Sending your message…" }); setLinks(null);
    const subject = "Portfolio message from " + data.name;

    if (WEB3FORMS_KEY || FORM_ENDPOINT || DIRECT_EMAIL) {        // optional: silent delivery through a form service
      const web3 = !!WEB3FORMS_KEY;
      const url = web3 ? "https://api.web3forms.com/submit" : (FORM_ENDPOINT || "https://formsubmit.co/ajax/" + profile.email);
      const body = web3
        ? { access_key: WEB3FORMS_KEY, subject, from_name: "Portfolio contact form", name: data.name, email: data.email, message: data.message }
        : { name: data.name, email: data.email, message: data.message, _subject: subject, _template: "table", _captcha: "false" };
      const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 12000);   // never leave the button spinning forever
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body), signal: ctrl.signal })
        .then(r => r.json().catch(() => ({})).then(j => {
          if (!r.ok || j.success === false || j.success === "false") throw new Error(j.message || "failed");
          form.current.reset();
          setStatus({ type: "success", text: "Message sent. Thank you, I’ll reply soon!" });
        }))
        .catch(fail)
        .finally(() => clearTimeout(timer));
      return;
    }

    // Default: open Gmail (or the phone's email app) with the message already written and addressed to Zobia.
    const text = data.message + "\n\n" + data.name + " (" + data.email + ")", enc = encodeURIComponent;
    const gmail = "https://mail.google.com/mail/?view=cm&fs=1&to=" + profile.email + "&su=" + enc(subject) + "&body=" + enc(text);
    const mailto = "mailto:" + profile.email + "?subject=" + enc(subject) + "&body=" + enc(text);
    const phone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (phone) window.location.href = mailto;                              // phones: the Gmail or Mail app opens
    else if (!window.open(gmail, "_blank")) window.location.href = mailto; // pop-up blocked: use the default email app
    setLinks({ gmail, mailto });
    setTimeout(() => {
      form.current.reset();
      setStatus({ type: "success", text: (phone ? "Your email app is opening with your message ready." : "Gmail is opening with your message ready.") + " Press Send there to deliver it." });
    }, 700);
  };
  const sending = status.type === "sending";
  const field = "w-full rounded-2xl border border-line bg-card px-5 py-4 text-base outline-none transition-colors focus:border-accent disabled:opacity-60";
  return (
    <footer id="contact" ref={root} className="border-t border-line px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl"><SectionLabel n="04" t="Contact" /></div>
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-7xl"><Words text="Let’s build something together." cls="f-char" /></h2>
          <p className="f-fade mt-6 max-w-md text-lg text-muted">Write your message below and it opens in Gmail, ready to send to me. I’m open to frontend and junior full-stack roles, internships and freelance work.</p>
          <div className="f-fade mt-8 flex flex-wrap gap-4">
            <MagneticButton variant="outline" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</MagneticButton>
            <MagneticButton variant="outline" href={profile.github} target="_blank" rel="noreferrer">GitHub</MagneticButton>
            <ResumeButton />
          </div>
        </div>
        <form ref={form} onSubmit={send} className="f-fade space-y-4">
          <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <label className="block"><span className="mb-2 block text-sm text-muted">Your name</span><input name="name" required disabled={sending} className={field} autoComplete="name" enterKeyHint="next" /></label>
          <label className="block"><span className="mb-2 block text-sm text-muted">Your email</span><input name="email" type="email" inputMode="email" required disabled={sending} className={field} autoComplete="email" enterKeyHint="next" /></label>
          <label className="block"><span className="mb-2 block text-sm text-muted">Message</span><textarea name="message" required rows="5" disabled={sending} className={field + " resize-y"} /></label>
          <MagneticButton as="button" type="submit" disabled={sending} aria-busy={sending}>
            {sending ? <span className="inline-flex items-center gap-2"><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />Sending…</span> : "Send message"}
          </MagneticButton>
          <p role="status" aria-live="polite" className="f-status text-sm" style={{ color: status.type === "error" ? "#e0568a" : "var(--accent)" }}>
            {status.type === "success" && "✓ "}{status.type === "error" && "✕ "}{status.text}
            {status.type === "error" && <a href={"mailto:" + profile.email} className="ml-2 underline">Open my email app</a>}
            {status.type === "success" && links && <span className="ml-2 text-muted">Didn’t open? <a href={links.gmail} target="_blank" rel="noreferrer" className="underline">Open Gmail</a> or <a href={links.mailto} className="underline">use your email app</a>.</span>}
          </p>
        </form>
      </div>
      <div className="mx-auto max-w-7xl"><SecretReveal /></div>
      <p className="mx-auto mt-10 max-w-7xl text-sm text-muted">© 2026 {profile.name} · {profile.location}</p>
    </footer>
  );
}

export default Contact;
