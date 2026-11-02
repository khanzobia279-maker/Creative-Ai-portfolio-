import React from "react";
import ReactDOM from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import App from "./App.jsx";
import "./index.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });   // no layout refresh when the phone address bar shows or hides
gsap.defaults({ ease: "power3.out" });

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
