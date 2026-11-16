import type { ReactNode } from "react";
import type { SourceLink } from "@/data/portfolio";

export function ExternalLink({ href, children, className }: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

export function SourceLinks({ links }: { links: readonly SourceLink[] }) {
  return (
    <ul className="source-links">
      {links.map(([label, href]) => (
        <li key={href}><ExternalLink href={href}>{label}</ExternalLink></li>
      ))}
    </ul>
  );
}
