"use client";

import { useEffect, useState, useRef } from "react";

interface CounterProps {
  value: string; // e.g. "947", "142M+"
  className?: string;
  style?: React.CSSProperties;
}

export default function Counter({ value, className, style }: CounterProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    // Parse the numerical part and suffix (e.g. "142M+" -> 142 and "M+")
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(match[1], 10);
    const suffix = match[2] || "";

    const duration = 1200; // 1.2s total count-up duration
    const startTime = performance.now();

    // Exponential easing out: ultra smooth decelerating speed
    const easeOutExpo = (t: number) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    let animationFrameId: number;

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const currentValue = Math.round(easedProgress * targetNumber);
      setDisplayValue(`${currentValue}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return (
    <span className={className} style={style}>
      {displayValue}
    </span>
  );
}
