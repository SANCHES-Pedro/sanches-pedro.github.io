import Image from "next/image";
import Link from "next/link";
import PortfolioExplorer from "@/components/portfolio-explorer";

export default function Home() {
  return (
    <>
      <section id="about" className="hero page-width" aria-labelledby="home-heading">
        <div className="hero-intro">
          <p className="eyebrow hero-role">Researcher & builder</p>
          <h1 id="home-heading">Pedro P.<br /><em>Sanchez</em></h1>
          <p className="hero-bio">
            I study cause and effect in machine learning and build tools for medical imaging and computational design.
          </p>
          <div className="hero-links">
            <a href="#work" className="primary-link">Explore my work <span aria-hidden="true">↓</span></a>
            <Link href="/publications/" className="quiet-link">Publications <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="language-strip">
            <h2 className="eyebrow">Languages</h2>
            <ul>
              <li lang="pt">Português</li>
              <li lang="en">English</li>
              <li lang="fr">Français</li>
              <li><span lang="es">Español</span> <small>(a little)</small></li>
            </ul>
          </div>
        </div>

        <div className="hero-art">
          <figure className="portrait-board">
            <span className="registration" aria-hidden="true" />
            <Image
              className="portrait"
              src="/pedro-sanchez.jpg"
              alt="Pedro P. Sanchez smiling"
              width={1000}
              height={1000}
              loading="eager"
              fetchPriority="high"
            />
          </figure>
        </div>
      </section>
      <PortfolioExplorer />
    </>
  );
}
