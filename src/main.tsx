import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Always start at the top on refresh/reload.
// Some browsers restore scroll position after reload; this disables that behavior
// and forces a top scroll as early as possible.
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const forceScrollTop = () => {
  // Temporarily disable smooth scrolling so this is instant (we re-enable via CSS).
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.style.scrollBehavior = prev;
};

// Run immediately, and again on load/pageshow to beat late scroll restoration.
forceScrollTop();
window.addEventListener("load", forceScrollTop, { once: true });
window.addEventListener("pageshow", forceScrollTop);

// Register service worker for offline support + faster updates (PWA)
registerSW({ immediate: true });

createRoot(document.getElementById("root")!).render(<App />);
