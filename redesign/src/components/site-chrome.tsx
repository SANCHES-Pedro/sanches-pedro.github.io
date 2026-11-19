import Link from "next/link";
import { profile } from "@/data/portfolio";
import { ExternalLink } from "./links";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-width nav-inner">
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/#about">About</Link>
          <Link href="/cv/">Visual CV</Link>
          <Link href="/publications/">Publications</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-width footer-inner">
        <Link className="footer-name" href="/">Pedro P. Sanchez</Link>
        <nav aria-label="Professional profiles">
          <ExternalLink href={profile.scholar}>Google Scholar</ExternalLink>
          <ExternalLink href={profile.github}>GitHub</ExternalLink>
          <ExternalLink href={profile.orcid}>ORCID</ExternalLink>
          <ExternalLink href={profile.linkedin}>LinkedIn</ExternalLink>
        </nav>
      </div>
    </footer>
  );
}
