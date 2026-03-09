import Image from "next/image";
import { headlineFont, bodyFont } from "@/lib/typographies";

const REVIEWS = [
  "/reviews/05.03.2026-removebg-preview.png",
  "/reviews/1__1_-removebg-preview.png",
  "/reviews/1__2_-removebg-preview.png",
  "/reviews/1__4_-removebg-preview.png",
  "/reviews/1__5_-removebg-preview.png",
  "/reviews/1__7_-removebg-preview.png",
  "/reviews/1__17_-removebg-preview.png",
  "/reviews/1__18_-removebg-preview.png",
  "/reviews/1__19_-removebg-preview.png",
  "/reviews/1__20_-removebg-preview.png",
];

export default function TestimonialsSection() {
  const doubled = [...REVIEWS, ...REVIEWS];

  return (
    <section className="relative w-full bg-[#1a1a1a] overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#c8a96e07_0%,transparent_60%)] pointer-events-none" />

      {/* Section Header */}
      <div className="relative flex flex-col items-center gap-4 mb-14 px-6">
        <div className="flex items-center gap-3">
          <span className="h-px w-10 bg-[#c8a96e]" />
          <span
            className={`${bodyFont.className} text-[#c8a96e] text-[12px] font-semibold tracking-[0.3em] uppercase`}
          >
            Client Stories
          </span>
          <span className="h-px w-10 bg-[#c8a96e]" />
        </div>
        <h2
          className={`${headlineFont.className} text-white text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-center leading-tight`}
        >
          Testimonials from{" "}
          <span className="italic text-[#c8a96e]">Clients</span>
        </h2>
        <p
          className={`${bodyFont.className} text-white/40 text-base text-center max-w-md leading-relaxed mt-1`}
        >
          An honest look into how we work — straight from the people we&apos;ve helped.
        </p>
      </div>

      {/* Marquee row */}
      <div className="relative overflow-hidden">
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-[#1a1a1a] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-[#1a1a1a] to-transparent z-10 pointer-events-none" />

        <style>{`
          @keyframes reviews-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .reviews-marquee-track {
            animation: reviews-marquee 36s linear infinite;
          }
          .reviews-marquee-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="reviews-marquee-track flex w-max items-center gap-6 px-3">
          {doubled.map((src, i) => (
            <a
              key={i}
              href="https://www.google.com/search?sca_esv=7425f1baa5b8ea4e&sxsrf=ANbL-n5Q_RIMafp2AytKAwvRCyNat8WqoQ:1773085554117&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOduSQ3cKJo38PTMHTkpqg_-Pwy12mPPsZEjHqQmIOqlYvI5furcZm7JRPDuwcq7ZHTpcttofX1QI0gYoFOwXDWkm7c_oHm4IKB5jZuyruZ0hdHlja7oEKmXKYeWLJh-fVzvW2_Y%3D&q=Miller+%26+Co+Lawyers+%26+Migration+Agents+Reviews&sa=X&ved=2ahUKEwiV_e-0ypOTAxXpRmwGHTsoJpIQ0bkNegQIKxAH&biw=1536&bih=703&dpr=1.25"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 relative w-112.5 h-112.5 block cursor-pointer"
            >
              <Image
                src={src}
                alt={`Client review ${(i % REVIEWS.length) + 1}`}
                fill
                className="object-contain drop-shadow-lg hover:scale-[1.03] transition-transform duration-300"
                sizes="340px"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <p
        className={`${bodyFont.className} text-white/70 text-[12px] tracking-[0.2em] uppercase text-center mt-12`}
      >
        Join hundreds of satisfied clients —{" "}
        <a
          href="/contact"
          className="text-[#c8a96e]/80 hover:text-[#c8a96e] transition-colors duration-300"
        >
          start your journey today
        </a>
      </p>
    </section>
  );
}
