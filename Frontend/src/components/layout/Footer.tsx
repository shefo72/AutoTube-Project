"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaFacebook, FaYoutube, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { LogoMark } from "@/components/ui/Logo/LogoMark";
import { productLinks, resourceLinks, supportLinks } from "@/constants/footer";
import { fadeUp } from "@/lib/animations";
import { Button } from "../ui/Button";

export function Footer() {
  const router = useRouter();

  return (
    <footer className="mt-20 px-4 pb-6 md:px-6">
      <motion.div
        {...fadeUp()}
        className="border-border bg-card rounded-card mx-auto w-full overflow-hidden border shadow-sm"
      >
        <div className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center md:p-12 lg:p-[48px_56px]">
          <div className="flex max-w-lg flex-col gap-3">
            <h2 className="font-heading text-foreground text-3xl leading-tight font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              Ready to find your
              <br />
              next viral video?
            </h2>
            <div className="mt-2 flex flex-col gap-1">
              <p className="text-muted-foreground m-0 font-sans text-[15px]">
                Join 25,000+ creators already growing with AutoTube.
              </p>
              <p className="text-muted-foreground m-0 font-sans text-[15px]">
                Generate complete video packages in seconds.
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/login")}
            className="mt-4 md:mt-0"
          >
            Get started free &rarr;
          </Button>
        </div>

        <div className="bg-border mx-8 h-px md:mx-12 lg:mx-14" />

        <div className="flex flex-col gap-12 p-8 md:flex-row md:justify-between md:gap-8 md:p-12 lg:p-[48px_56px]">
          <div className="flex flex-col items-center gap-4 md:items-center">
            <Link
              href="/"
              className="group flex w-fit items-center gap-3 outline-none"
            >
              <LogoMark size={140} />
            </Link>
            <p className="text-muted-foreground m-0 mt-2 max-w-70 text-center font-sans text-[13px] leading-relaxed md:text-center">
              The all-in-one AI workspace designed to help creators discover
              gaps and scale faster.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:flex sm:flex-row sm:flex-wrap sm:gap-16 lg:gap-24">
            <LinkCol heading="Product" links={productLinks} />
            <LinkCol heading="Resources" links={resourceLinks} />
            <LinkCol heading="Support & Legal" links={supportLinks} />
          </div>
        </div>

        <div className="bg-border/50 mx-8 h-px md:mx-12 lg:mx-14" />

        <div className="flex flex-col-reverse items-center justify-between gap-6 p-6 text-center md:flex-row md:p-8 md:text-left lg:p-[24px_56px]">
          <span className="text-muted-foreground font-sans text-[13px]">
            Copyright &copy; {new Date().getFullYear()} AutoTube | Designed for
            creators &middot; Powered by AutoTube
          </span>

          <div className="flex items-center gap-3">
            <SocialBtn icon={FaXTwitter} label="Twitter" />
            <SocialBtn icon={FaYoutube} label="YouTube" />
            <SocialBtn icon={FaLinkedin} label="LinkedIn" />
            <SocialBtn icon={FaFacebook} label="Facebook" />
          </div>
        </div>
      </motion.div>
    </footer>
  );
}

function SocialBtn({
  icon: Icon,
  label,
  href = "#",
}: {
  icon: React.ElementType;
  label: string;
  href?: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.09)" }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15 }}
      className="focus-visible:ring-primary relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-white/5 outline-none focus-visible:ring-2"
      aria-label={label}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 25 25"
        fill="none"
      >
        <circle
          cx="12.5"
          cy="12.5"
          r="12"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.10)"
        />
      </svg>
      <span className="hover:text-foreground relative z-10 flex items-center justify-center text-[#555562] transition-colors">
        <Icon size={14} />
      </span>
    </motion.a>
  );
}

function LinkCol({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-foreground font-sans text-[11px] font-bold tracking-widest uppercase">
        {heading}
      </span>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} passHref legacyBehavior>
              <motion.a
                whileHover={{ color: "var(--foreground)", x: 2 }}
                transition={{ duration: 0.2 }}
                className="text-muted-foreground hover:text-foreground focus-visible:text-foreground block w-fit font-sans text-[13px] font-medium no-underline transition-colors outline-none"
              >
                {link.label}
              </motion.a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
