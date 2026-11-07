import MagneticButton from "./MagneticButton";

// Larger resume button used in the Contact section. Serves public/Zobia_Khan_Resume.pdf.
export default function ResumeButton({ variant = "outline" }) {
  return <MagneticButton variant={variant} href={import.meta.env.BASE_URL + "Zobia_Khan_Resume.pdf"} download="Zobia_Khan_Resume.pdf">Download resume</MagneticButton>;
}
