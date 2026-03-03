import Link from "next/link";
import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";
import { ArrowRight, Home, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative w-full min-h-screen bg-[#1a1a1a] overflow-hidden flex flex-col">

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/1.png"
          alt="Background"
          fill
          className="object-cover object-center opacity-10"
          priority
        />
        <div className="absolute inset-0 bg-[#1a1a1a]/80" />
      </div>

      {/* Radial gold glow — top right */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,_#c8a96e10_0%,_transparent_65%)] pointer-events-none z-0" />
      {/* Radial gold glow — bottom left */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_bottom_left,_#c8a96e08_0%,_transparent_65%)] pointer-events-none z-0" />

      {/* Header — logo only */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pt-8">
        <Link href="/">
          <Image
            src="/NEW-logo-TM-White1.png"
            alt="Miller & Co"
            width={140}
            height={52}
            className="object-contain"
          />
        </Link>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="h-px w-8 bg-[#c8a96e]" />
          <span className={`${bodyFont.className} text-[#c8a96e] text-[10px] font-semibold tracking-[0.3em] uppercase`}>
            Error 404
          </span>
          <span className="h-px w-8 bg-[#c8a96e]" />
        </div>

        {/* Large 404 number */}
        <p
          className={`${headlineFont.className} text-[#c8a96e]/10 text-[160px] sm:text-[220px] lg:text-[280px] font-semibold leading-none select-none pointer-events-none absolute`}
          aria-hidden="true"
        >
          404
        </p>

        {/* Heading */}
        <h1
          className={`${headlineFont.className} text-white text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight mb-4 relative z-10`}
        >
          Page Not{" "}
          <span className="italic text-[#c8a96e]">Found</span>
        </h1>

        {/* Subtext */}
        <p
          className={`${bodyFont.className} text-white/40 text-sm leading-relaxed max-w-md mb-10 relative z-10`}
        >
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          Let us help you find your way back.
        </p>

        {/* Actions */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
          <Button
            asChild
            size="lg"
            className={`${bodyFont.className} text-xs font-bold tracking-[0.2em] uppercase bg-[#c8a96e] text-[#1a1a1a] border border-[#c8a96e] hover:bg-transparent hover:text-[#c8a96e] transition-all duration-300 rounded-none cursor-pointer`}
          >
            <Link href="/">
              <Home className="w-3.5 h-3.5 mr-1" />
              Back to Home
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className={`${bodyFont.className} text-xs font-bold tracking-[0.2em] uppercase bg-transparent border-white/20 text-white/60 hover:bg-white/5 hover:text-white hover:border-white/40 transition-all duration-300 rounded-none cursor-pointer`}
          >
            <a href="tel:+61280956369">
              <Phone className="w-3.5 h-3.5 mr-1" />
              Call Us
            </a>
          </Button>
        </div>

      </main>

      {/* Footer note */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-8 flex flex-col sm:flex-row items-center justify-between gap-3 mt-12">
        <span className={`${bodyFont.className} text-white/20 text-[10px] tracking-[0.2em] uppercase`}>
          © {new Date().getFullYear()} Miller &amp; Co Lawyers &amp; Migration Agents
        </span>
        <a
          href="mailto:info@visa-australia.legal"
          className={`${bodyFont.className} text-white/20 text-[10px] tracking-[0.15em] uppercase hover:text-[#c8a96e] transition-colors duration-300`}
        >
          info@visa-australia.legal
        </a>
      </footer>

    </div>
  );
}
