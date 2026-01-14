"use client";

import { useEffect, useRef } from "react";
import { gaEvent } from "@/lib/ga";

export function TrackSection({
  section,
  children,
  ...props
}: {
  section: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting) return;
        if (firedRef.current) return;

        firedRef.current = true;
        gaEvent("lp_section_view", { section });
      },
      { threshold: 0.35 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [section]);

  return <div ref={ref} {...props}>{children}</div>;
}
