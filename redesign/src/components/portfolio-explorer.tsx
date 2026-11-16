"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { getStory, groups, type PortfolioGroup } from "@/data/portfolio";
import type { SketchId } from "@/lib/sketches";
import { SketchThumbnail, StorySketch } from "./sketch";

const sections: readonly [PortfolioGroup, string][] = [
  ["cv", "Timeline"],
  ["research", "Research"],
  ["startups", "Startups"],
  ["projects", "Projects"],
  ["interests", "Research interests"],
  ["service", "Talks & recognition"],
];

export default function PortfolioExplorer({ standalone = false }: { standalone?: boolean }) {
  const [group, setGroup] = useState<PortfolioGroup>("cv");
  const [active, setActive] = useState<SketchId>("hike");
  const preview = useRef<HTMLDivElement>(null);
  const story = getStory(active);
  const Heading = standalone ? "h1" : "h2";

  function chooseSection(next: PortfolioGroup) {
    if (group === next) return;
    setGroup(next);
    setActive(groups[next][0]);
  }

  function chooseStory(id: SketchId) {
    setActive(id);
    if (matchMedia("(max-width: 740px)").matches) {
      requestAnimationFrame(() => preview.current?.scrollIntoView({ block: "nearest" }));
    }
  }

  return (
    <section id="work" className="portfolio-section" aria-labelledby="work-title">
      <div className="page-width">
        <div className="section-heading">
          <Heading id="work-title">Visual CV</Heading>
          {!standalone && <Link className="quiet-link" href="/cv/">Open CV <span aria-hidden="true">↗</span></Link>}
        </div>
        <div className="portfolio-tabs" role="group" aria-label="Browse the portfolio">
          {sections.map(([key, title]) => (
            <button type="button" key={key} onClick={() => chooseSection(key)} aria-pressed={group === key}>
              {title}
            </button>
          ))}
        </div>

        <div className="timeline-layout">
          <div className="timeline-preview" ref={preview}>
            <p className="sr-only" role="status">{story.title}. {story.summary}</p>
            <StorySketch key={active} story={story} standalone={standalone} />
          </div>
          <ol className={group === "cv" ? "timeline-index chronology" : "timeline-index"} aria-label="Portfolio entries">
            {groups[group].map((id) => {
              const item = getStory(id);
              return (
                <li key={id}>
                  <button className="timeline-entry" type="button" aria-pressed={active === id} onClick={() => chooseStory(id)}>
                    <span className="entry-date">{item.date || "—"}</span>
                    <SketchThumbnail id={id} />
                    <span className="entry-name">{item.title}</span>
                    <span className="entry-cue" aria-hidden="true">{active === id ? "●" : "→"}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
