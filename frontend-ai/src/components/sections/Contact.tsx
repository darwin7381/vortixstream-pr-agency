export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative text-[var(--paper)]"
    >
      <div className="relative z-10 section-container section-pad-strip-top">
        <p className="eyebrow">
          <span className="eyebrow-num">10</span>
          <span>Contact</span>
        </p>
        <div className="eyebrow-line-draw max-w-[80px] mt-2" />

        <div className="mt-8 grid grid-cols-12 gap-x-6 sm:gap-x-10 lg:gap-x-14">
          <div className="col-span-12 lg:col-span-5">
            <h2 id="contact-title" className="t-h2" style={{ textShadow: "0 1px 30px rgba(0,0,0,0.5)" }}>
              Tell us what you&apos;re{" "}
              <span className="italic">building.</span>
            </h2>
            <p className="t-lead" style={{ maxWidth: "26rem" }}>
              Fill out the form and we&apos;ll get back to you within 24 hours
              with a tailored proposal.
            </p>

            <div className="mt-10 flex flex-col gap-6">
              <a
                href="mailto:hello@vortixpr.com"
                className="group inline-flex flex-col gap-1 border-b border-[var(--rule)] pb-3 hover:border-[var(--paper)]"
              >
                <span className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)]">
                  Email us · 24-hour response
                </span>
                <span className="t-quote text-[var(--paper)]">
                  hello@vortixpr.com
                </span>
              </a>
              <a
                href="https://t.me/VortixPR"
                className="group inline-flex flex-col gap-1 border-b border-[var(--rule)] pb-3 hover:border-[var(--paper)]"
              >
                <span className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)]">
                  Telegram · Quick chat
                </span>
                <span className="t-quote text-[var(--paper)]">
                  @VortixPR
                </span>
              </a>
            </div>
          </div>

          <form
            className="col-span-12 mt-12 lg:col-span-7 lg:mt-0"
            action="/api/contact"
            method="POST"
          >
            <div className="rounded-[4px] border border-[var(--rule-strong)] bg-[var(--ink)]/55 p-8 backdrop-blur-xl sm:p-10">
              <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                <FormField label="Full name" name="name" required placeholder="Your full name" className="col-span-2 sm:col-span-1" />
                <FormField label="Email" name="email" type="email" required placeholder="you@company.com" className="col-span-2 sm:col-span-1" />
                <FormField label="Company" name="company" required placeholder="Your company" className="col-span-2" />
                <FormSelect
                  label="Industry"
                  name="industry"
                  defaultLabel="Select your industry"
                  options={["AI / ML", "Web3 / Crypto", "SaaS", "Dev Tools", "Consumer"]}
                  className="col-span-2 sm:col-span-1"
                />
                <FormSelect
                  label="Budget range"
                  name="budget"
                  defaultLabel="Select budget range"
                  options={["$2,000 - $5,000/mo", "$5,000 - $10,000/mo", "$10,000+/mo", "Not sure yet"]}
                  className="col-span-2 sm:col-span-1"
                />
                <div className="col-span-2 group/field">
                  <label className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)] transition-colors duration-300 group-focus-within/field:text-[var(--accent)]">
                    Project description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Tell us about your launch, your timeline, what you've built so far..."
                    className="mt-2 w-full resize-none border-b border-[var(--rule-strong)] bg-transparent py-3 text-[length:var(--text-body)] text-[var(--paper)] placeholder:text-[var(--paper-faint)] transition-all duration-300 ease-[var(--ease-precise)] focus:border-[var(--accent)] focus:pl-2 focus:outline-none"
                  />
                </div>
              </div>

              <button type="submit" className="cta-primary mt-10">
                Request custom quote <span aria-hidden className="arr">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label, name, type = "text", required, placeholder, className = "",
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; className?: string; }) {
  return (
    <div className={`group/field ${className}`}>
      <label className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)] transition-colors duration-300 group-focus-within/field:text-[var(--accent)]">
        {label}
      </label>
      <input
        type={type} name={name} required={required} placeholder={placeholder}
        className="mt-2 w-full border-b border-[var(--rule-strong)] bg-transparent py-3 text-[length:var(--text-body)] text-[var(--paper)] placeholder:text-[var(--paper-faint)] transition-all duration-300 ease-[var(--ease-precise)] focus:border-[var(--accent)] focus:pl-2 focus:outline-none"
      />
    </div>
  );
}

function FormSelect({
  label, name, options, defaultLabel, className = "",
}: { label: string; name: string; options: string[]; defaultLabel: string; className?: string; }) {
  return (
    <div className={`group/field ${className}`}>
      <label className="font-mono text-[length:var(--text-meta)] uppercase tracking-[var(--tracking-widest)] text-[var(--paper-muted)] transition-colors duration-300 group-focus-within/field:text-[var(--accent)]">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          name={name} defaultValue=""
          className="w-full appearance-none border-b border-[var(--rule-strong)] bg-transparent py-3 pr-8 text-[length:var(--text-body)] text-[var(--paper)] transition-all duration-300 ease-[var(--ease-precise)] focus:border-[var(--accent)] focus:pl-2 focus:outline-none"
        >
          <option value="" disabled className="bg-[var(--ink)]">{defaultLabel}</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-[var(--ink)] text-[var(--paper)]">{o}</option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--paper-muted)]">
          ↓
        </span>
      </div>
    </div>
  );
}
