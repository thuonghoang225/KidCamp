import { clsx } from "clsx";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const tones = {
  forest: "btn-candy bg-forest-600 text-white hover:bg-forest-700",
  sun: "btn-candy bg-sun-400 text-ink hover:bg-sun-500",
  sky: "btn-candy bg-sky-600 text-white hover:bg-sky-700",
  ember: "btn-candy bg-ember-600 text-white hover:bg-ember-700",
  white: "btn-candy bg-white text-ink hover:bg-forest-50 ring-2 ring-forest-100",
  ghost: "bg-transparent text-forest-700 hover:bg-forest-50",
} as const;
const sizes = { md: "h-12 px-5 text-base", lg: "h-16 px-7 text-xl", xl: "h-20 px-8 text-2xl" } as const;

type Common = { tone?: keyof typeof tones; size?: keyof typeof sizes; className?: string; children: ReactNode };

const base = "inline-flex items-center justify-center gap-2 rounded-2xl font-extrabold select-none disabled:opacity-50 disabled:pointer-events-none";

export function Button({ tone = "forest", size = "md", className, ...rest }: Common & ComponentProps<"button">) {
  return <button className={clsx(base, tones[tone], sizes[size], className)} {...rest} />;
}

export function ButtonLink({ tone = "forest", size = "md", className, ...rest }: Common & ComponentProps<typeof Link>) {
  return <Link className={clsx(base, tones[tone], sizes[size], className)} {...rest} />;
}
