const NAV_MAP = [
  ["Home", "/"],
  ["Services", "#services"],
  ["Packages", "#packages"],
  ["Clients", "#clients"],
  ["Publisher", "#platform"],
  ["About", "#why"],
];

const NAV_RESOURCES = [
  ["Blog", "#contact"],
  ["Crypto PR →", "#contact"],
];

const NAV_LEGAL = [
  ["Privacy", "#contact"],
  ["Terms", "#contact"],
  ["Cookies", "#contact"],
];

export default function Footer() {
  return (
    <footer className="relative bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto w-full max-w-[100rem] px-6 pb-10 pt-20 sm:px-10 sm:pb-14 sm:pt-24 lg:px-16">
        <div className="grid grid-cols-12 items-start gap-x-6 border-b border-[var(--rule)] pb-12 sm:gap-x-10">
          <div className="col-span-12 lg:col-span-6">
            <p className="t-h3 text-[var(--paper)]" style={{ fontFamily: "var(--font-onest), sans-serif" }}>
              <span aria-hidden className="mr-2 text-[var(--accent)]">❖</span>
              <span className="font-medium tracking-tight">vortix</span>
              <span className="ml-1 italic text-[var(--paper-muted)]" style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}>pr</span>
            </p>
            <p className="mt-6 max-w-md text-[length:var(--text-body)] leading-[var(--leading-snug)] text-[var(--paper-muted)]" style={{ fontFamily: "var(--font-onest), sans-serif" }}>
              The PR agency for AI startups and technical founders. From stealth
              to Series B — we get your story told in the publications that
              matter.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-6">
            <div className="grid grid-cols-2 gap-x-10 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-faint)]">
                  Map
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {NAV_MAP.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-[length:var(--text-body)] text-[var(--paper)]/85 hover:text-[var(--paper)]" style={{ fontFamily: "var(--font-onest), sans-serif" }}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-faint)]">
                  Resources
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {NAV_RESOURCES.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-[length:var(--text-body)] text-[var(--paper)]/85 hover:text-[var(--paper)]" style={{ fontFamily: "var(--font-onest), sans-serif" }}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-faint)]">
                  Legal
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {NAV_LEGAL.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="text-[length:var(--text-body)] text-[var(--paper)]/85 hover:text-[var(--paper)]" style={{ fontFamily: "var(--font-onest), sans-serif" }}>
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-faint)]">
          © 2026 VortixPR. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
