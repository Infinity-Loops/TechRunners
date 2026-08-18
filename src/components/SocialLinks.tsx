import { LINKS } from "@/lib/site";
import { cn } from "./ui";

const SOCIALS = [
  { key: "discord", label: "Discord", href: () => LINKS.discord, tone: "text-purple border-purple hover:bg-purple" },
  { key: "x", label: "X", href: () => LINKS.x, tone: "text-text border-line hover:bg-neon hover:border-neon" },
  { key: "facebook", label: "Facebook", href: () => LINKS.facebook, tone: "text-text border-line hover:bg-neon hover:border-neon" },
  { key: "instagram", label: "Instagram", href: () => LINKS.instagram, tone: "text-text border-line hover:bg-magenta hover:border-magenta" },
  { key: "linkedin", label: "LinkedIn", href: () => LINKS.linkedin, tone: "text-text border-line hover:bg-neon hover:border-neon" },
];

/** Renders configured social links only. */
export function SocialLinks({ className }: { className?: string }) {
  const list = SOCIALS.map((s) => ({ ...s, url: s.href() })).filter((s) => s.url);
  if (list.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {list.map((s) => (
        <a
          key={s.key}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "font-pixel border-2 px-3 py-2 text-[10px] uppercase tracking-wider transition-all hover:text-ink",
            s.tone
          )}
        >
          {s.label}
        </a>
      ))}
    </div>
  );
}
