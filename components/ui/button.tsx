import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-teal-700 text-white shadow-sm hover:bg-teal-800 focus-visible:ring-teal-700",
  secondary:
    "bg-sky-100 text-slate-950 hover:bg-sky-200 focus-visible:ring-sky-500",
  outline:
    "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-teal-700",
  ghost: "text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-500",
  danger:
    "bg-rose-700 text-white shadow-sm hover:bg-rose-800 focus-visible:ring-rose-700",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 text-sm",
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-7 text-lg",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: Variant;
  size?: Size;
};

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  href,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
