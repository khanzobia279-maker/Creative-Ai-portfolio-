// Download button for the top-right of the navbar (icon only on phones).
export default function ResumeNav() {
  return (
    <a href={import.meta.env.BASE_URL + "Zobia_Khan_Resume.pdf"} download="Zobia_Khan_Resume.pdf" aria-label="Download resume (PDF)"
       className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-3 text-sm transition-colors hover:border-accent sm:px-4">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" /></svg>
      <span className="hidden sm:inline">Resume</span>
    </a>
  );
}
