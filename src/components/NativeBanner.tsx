import { useEffect, useRef } from "react";

const CONTAINER_ID = "container-8a09cde6f1e929d31e0eb4fd098047a4";
const SRC = "https://pl30575724.effectivecpmnetwork.com/8a09cde6f1e929d31e0eb4fd098047a4/invoke.js";

/** Adsterra native banner. Client-only: injects the invoke script once. */
export function NativeBanner({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = SRC;
    s.setAttribute("data-cfasync", "false");
    document.body.appendChild(s);
  }, []);

  return (
    <div ref={ref} className={className}>
      <div id={CONTAINER_ID} />
    </div>
  );
}
