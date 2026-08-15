import { cn } from "./ui";

/**
 * Renders one of the game's own pixel-art UI icons (extracted from the Unity
 * sprite sheet) crisply. Decorative by default — pass `alt` for meaningful ones.
 */
export type GameIconName =
  | "trophy"
  | "chat"
  | "chart"
  | "idcard"
  | "map"
  | "gear"
  | "medal";

export function GameIcon({
  name,
  size = 24,
  className,
  alt = "",
}: {
  name: GameIconName;
  size?: number;
  className?: string;
  alt?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/assets/icons/${name}.png`}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("pixelated inline-block shrink-0", className)}
    />
  );
}

/** The glowing TechRunners "T" emblem. */
export function Emblem({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/emblem.png"
      alt="TechRunners"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={cn("pixelated inline-block shrink-0", className)}
    />
  );
}
