import Link from "next/link";

const SHOP_LINKS = [
  { label: "New Arrivals", href: "/shop?sort=newest" },
  { label: "Best Sellers", href: "/shop?sort=best-selling" },
  { label: "All Products", href: "/shop" },
  { label: "Collections", href: "/collections" },
];

const COMPANY_LINKS = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Shipping & Returns", href: "/contact" },
  { label: "Size Guide", href: "/contact" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/bonesyde/" },
  { label: "X", href: "https://x.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-background">
      <div className="container-px max-w-container mx-auto py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-14">
          <div>
            <span className="font-display text-2xl font-bold tracking-widest2 text-foreground">
              BONESYDE
            </span>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-foreground-secondary">
              Premium streetwear engineered for permanence. Considered silhouettes,
              uncompromising materials, no noise.
            </p>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          <div>
            <h3 className="eyebrow mb-5">Follow</h3>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-foreground-secondary hover:text-accent transition-colors duration-300 link-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-foreground-muted">
            © {new Date().getFullYear()} BONESYDE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-xs text-foreground-muted hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-xs text-foreground-muted hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="eyebrow mb-5">{title}</h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-foreground-secondary hover:text-accent transition-colors duration-300 link-underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
