import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import AnimatedSection from "@/components/ui/AnimatedSection";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the BONESYDE team.",
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-px max-w-container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <AnimatedSection>
            <p className="eyebrow mb-3">Get In Touch</p>
            <h1 className="font-display text-display-md font-semibold text-foreground mb-6">
              Contact
            </h1>
            <p className="text-base leading-relaxed text-foreground-secondary max-w-md mb-10">
              Questions about an order, sizing, or a wholesale inquiry? Send us a note and
              we&rsquo;ll get back to you within 1–2 business days.
            </p>

            <div className="flex flex-col gap-6">
              <div>
                <p className="eyebrow mb-2">Email</p>
                <a href="mailto:support@bonesyde.in" className="text-foreground hover:text-accent transition-colors">
                  support@bonesyde.in
                </a>
              </div>
              <div>
                <p className="eyebrow mb-2">Customer Care Hours</p>
                <p className="text-foreground-secondary">Mon–Fri, 9am–6pm</p>
              </div>
              <div>
                <p className="eyebrow mb-2">Social</p>
                <div className="flex gap-5">
                  <a href="https://www.instagram.com/bonesyde/" target="_blank" rel="noreferrer" className="text-foreground-secondary hover:text-accent transition-colors link-underline">
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <ContactForm />
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
