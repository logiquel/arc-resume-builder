import AppLogo from "#/components/layouts/AppLogo";

const footerGroups = [
  {
    title: "Quick Links",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Plans & Pricing", href: "#plans" },
      { label: "Register", href: "#register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy & Policies", href: "#privacy" },
      { label: "Terms and Conditions", href: "#terms" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "hello@logiquel.com", href: "mailto:hello@logiquel.com" },
      { label: "Support", href: "#support" },
    ],
  },
];

const FooterSection = () => {
  return (
    <footer className="w-full bg-[#0f1720] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-0 lg:px-12 lg:pt-20 lg:pb-0">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Left */}
          <div className="max-w-md">
            <div className="flex items-center gap-4">
              <AppLogo tagLineColor="white" secondaryColor="white" />
            </div>

            <p className="mt-6 max-w-sm font-display text-2xl italic leading-snug text-white sm:text-[1.9rem]">
              Every career has an ARC. We help you write it.
            </p>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/58">
              Resume tailoring, ATS-ready templates, and focused AI guidance for
              candidates who want stronger applications and clearer positioning.
            </p>
          </div>

          {/* Right */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xxs font-semibold uppercase tracking-[0.16em] text-white/42">
                  {group.title}
                </h3>

                <ul className="mt-5 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-xs text-white/72 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-white/10 py-4">
          <p className="text-xxs tracking-[0.08em] text-white/42">
            Designed and developed by Logiquel LLC
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
