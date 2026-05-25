import Image from "next/image";

interface WorldStripProps {
  src: string;
  alt?: string;
  /** Vertical anchor — "top" / "center" / "bottom" / any CSS object-position string. */
  objectPosition?: "top" | "center" | "bottom" | string;
  /** Flat dark overlay opacity over the painterly so text stays legible. 0–1. */
  overlay?: number;
  priority?: boolean;
  children: React.ReactNode;
}

export default function WorldStrip({
  src,
  alt = "",
  objectPosition = "center",
  overlay = 0.55,
  priority = false,
  children,
}: WorldStripProps) {
  return (
    <div className="relative isolate w-full bg-[var(--ink)]">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover scale-105 parallax-bg"
          style={{ objectPosition: typeof objectPosition === "string" ? objectPosition : "center" }}
        />
        <div aria-hidden className="absolute inset-0" style={{ background: `rgba(14,14,16,${overlay})` }} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
