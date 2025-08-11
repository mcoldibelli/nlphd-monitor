import React from "react";

type CardProps = { children: React.ReactNode; className?: string };
export function Card({ children, className = "" }: CardProps) {
  return <div className={`rounded-2xl border shadow-sm bg-[var(--card-bg)] border-[var(--card-border)] ${className}`}>{children}</div>;
}

type CardHeaderProps = { title: string; subtitle?: string };
export function CardHeader({ title, subtitle }: CardHeaderProps) {
  return (
    <div className="px-4 pt-4">
      <div className="text-xs uppercase muted-2">{title}</div>
      {subtitle && <div className="text-[11px] muted mt-0.5">{subtitle}</div>}
    </div>
  );
}

type CardContentProps = { children: React.ReactNode; className?: string };
export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`px-4 pb-4 pt-2 ${className}`}>{children}</div>;
}
