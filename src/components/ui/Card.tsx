import { clsx } from "clsx";
import type { ComponentProps } from "react";

export function Card({ className, ...rest }: ComponentProps<"div">) {
  return <div className={clsx("rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-soft)]", className)} {...rest} />;
}
