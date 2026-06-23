"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
};

export default function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-background lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container-px h-[76px] flex items-center justify-between border-b border-line">
            <span className="font-display text-lg font-bold tracking-widest2">BONESYDE</span>
            <button type="button" onClick={onClose} aria-label="Close menu" className="text-foreground">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="container-px flex flex-col gap-2 pt-10">
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block py-4 border-b border-line font-display text-3xl font-semibold text-foreground"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
