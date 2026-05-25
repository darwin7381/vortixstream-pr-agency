"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

interface InteractiveButtonProps {
  href: string;
  className: string;
  children: React.ReactNode;
  magnetic?: boolean;
  glow?: boolean;
}

export default function InteractiveButton({
  href,
  className,
  children,
  magnetic = true,
  glow = true,
}: InteractiveButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate distance from center for magnetic pull (max 5px translation)
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Glow position relative to button top-left
    const gx = e.clientX - rect.left;
    const gy = e.clientY - rect.top;

    if (magnetic) {
      setPos({ x: x * 0.12, y: y * 0.22 });
    }
    if (glow) {
      setGlowPos({ x: gx, y: gy });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPos({ x: 0, y: 0 });
  };

  // Detect internal vs external links
  const isExternal = href.startsWith("http") || href.startsWith("mailto:");

  const content = (
    <>
      {glow && isHovered && (
        <span
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: `${glowPos.x}px`,
            top: `${glowPos.y}px`,
            width: "80px",
            height: "80px",
            background: "radial-gradient(circle, rgba(213, 138, 77, 0.38) 0%, rgba(213, 138, 77, 0) 70%)",
            willChange: "left, top",
          }}
        />
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </>
  );

  const commonStyle: React.CSSProperties = {
    transform: isHovered && magnetic ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : "none",
    transition: isHovered ? "transform 0.08s ease-out" : "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
    willChange: "transform",
  };

  if (isExternal) {
    return (
      <a
        ref={buttonRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`${className} relative overflow-hidden`}
        style={commonStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      ref={buttonRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${className} relative overflow-hidden`}
      style={commonStyle}
    >
      {content}
    </Link>
  );
}
