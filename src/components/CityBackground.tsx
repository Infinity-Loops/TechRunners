/**
 * Fixed decorative backdrop built from the game's Haven map (optimized to
 * WebP). Darkened and tinted so foreground UI stays readable, with neon
 * gradient washes on top to match the banner's night-city mood.
 */
export function CityBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* the map itself, dim + saturated toward the neon palette */}
      <picture>
        <source media="(max-width: 768px)" srcSet="/assets/map-bg-sm.webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/map-bg.webp"
          alt=""
          className="pixelated absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-[0.22]"
          style={{ filter: "saturate(1.15) contrast(1.05) brightness(0.75)" }}
        />
      </picture>
      {/* vignette + neon glows */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 50% 0%, rgba(52,226,232,0.10), transparent 60%)," +
            "radial-gradient(1000px 600px at 90% 100%, rgba(255,63,164,0.10), transparent 55%)," +
            "radial-gradient(900px 600px at 0% 90%, rgba(139,108,255,0.10), transparent 55%)," +
            "linear-gradient(180deg, rgba(5,7,15,0.72) 0%, rgba(5,7,15,0.86) 60%, rgba(5,7,15,0.96) 100%)",
        }}
      />
    </div>
  );
}
