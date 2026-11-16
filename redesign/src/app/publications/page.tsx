import type { Metadata } from "next";
import { ExternalLink, SourceLinks } from "@/components/links";
import { getStory, profile } from "@/data/portfolio";
import { publications } from "@/data/publications";

export const metadata: Metadata = {
  title: "Publications",
  description: "Papers, preprints, a dissertation, and patent applications by Pedro P. Sanchez.",
};

const years = [...new Set(publications.map((publication) => publication.year))];

export default function Publications() {
  return (
    <div className="page-width publication-page">
      <div className="archive-heading">
        <h1>Publications</h1>
        <ExternalLink className="quiet-link" href={profile.scholar}>Google Scholar</ExternalLink>
      </div>
      <div className="publication-groups">
        {years.map((year) => (
          <section className="publication-group" key={year} aria-labelledby={"year-" + year}>
            <h2 id={"year-" + year}>{year}</h2>
            <ul className="publication-list">
              {publications.filter((publication) => publication.year === year).map((publication) => (
                <li key={publication.title}>
                  <h3>{publication.title}</h3>
                  <SourceLinks links={publication.links} />
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="publication-group" aria-labelledby="dissertation">
          <h2 id="dissertation">Thesis</h2>
          <ul className="publication-list">
            <li>
              <h3>Causal Deep Learning on Images</h3>
              <SourceLinks links={[getStory("phd").links[0]]} />
            </li>
          </ul>
        </section>
        <section className="publication-group" aria-labelledby="patents">
          <h2 id="patents">Patent applications</h2>
          <ul className="publication-list">
            <li><h3>Data Processing Apparatus and Method</h3><SourceLinks links={getStory("patent1").links} /></li>
            <li><h3>Image Data Processing Apparatus and Method</h3><SourceLinks links={getStory("patent2").links} /></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
