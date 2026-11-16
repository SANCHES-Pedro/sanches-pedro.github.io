"use client";

import { useEffect, useRef, useState } from "react";
import type { Story } from "@/data/portfolio";
import { renderSketch, type SketchId } from "@/lib/sketches";
import { SourceLinks } from "./links";

const duration = 1450;

function useSketch(id: SketchId, thumbnail = false) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const frame = useRef<number | null>(null);
  const [phase, setPhase] = useState<"ready" | "playing" | "finished">("ready");

  useEffect(() => {
    const target = canvas.current;
    if (!target) return;
    renderSketch(target, id, 1, thumbnail);

    let mounted = true;
    if (!thumbnail) {
      void document.fonts.ready.then(() => {
        if (mounted && frame.current === null) renderSketch(target, id);
      });
    }

    return () => {
      mounted = false;
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [id, thumbnail]);

  function play() {
    const target = canvas.current;
    if (!target) return;

    if (frame.current !== null || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
      renderSketch(target, id, 1, thumbnail);
      setPhase("finished");
      return;
    }

    setPhase("playing");
    const startedAt = performance.now();
    const tick = (now: number) => {
      const time = Math.min((now - startedAt) / duration, 1);
      if (time === 1) {
        frame.current = null;
        renderSketch(target, id, 1, thumbnail);
        setPhase("finished");
        return;
      }

      renderSketch(target, id, time * time * (3 - 2 * time), thumbnail);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  return { canvas, phase, play };
}

export function SketchThumbnail({ id }: { id: SketchId }) {
  const { canvas } = useSketch(id, true);
  return <canvas ref={canvas} className="sketch thumbnail" width={320} height={180} aria-hidden="true" />;
}

export function HobbySketch({ id, title }: { id: "kite" | "cycling"; title: string }) {
  const { canvas, phase, play } = useSketch(id, true);
  const action = phase === "playing" ? "Finish" : phase === "finished" ? "Replay" : "Play";

  return (
    <button className="hobby" type="button" aria-label={action + " " + title.toLowerCase() + " sketch"} onClick={play}>
      <canvas ref={canvas} className="sketch" width={384} height={216} aria-hidden="true" />
      <span className="hobby-caption">
        {title} <span aria-hidden="true">{phase === "playing" ? "■" : phase === "finished" ? "↻" : "▷"}</span>
      </span>
    </button>
  );
}

export function StorySketch({ story, standalone }: { story: Story; standalone: boolean }) {
  const { canvas, phase, play } = useSketch(story.id);
  const action = phase === "playing" ? "Finish" : phase === "finished" ? "Replay" : "Play";
  const Title = standalone ? "h2" : "h3";

  return (
    <figure className="story-sketch">
      <div className="story-plate">
        <canvas ref={canvas} className="sketch" role="img" aria-label={story.image} width={1280} height={720} />
      </div>
      <figcaption className="story-caption">
        <div className="story-caption-top">
          <div>
            <p className="eyebrow story-tag">{story.tag}</p>
            <Title className="story-title">{story.title}</Title>
          </div>
          <button type="button" className="sketch-play" onClick={play} aria-label={action + " " + story.title + " sketch"}>
            <span aria-hidden="true">{phase === "playing" ? "■" : phase === "finished" ? "↻" : "▷"}</span>
            {action + " sketch"}
          </button>
        </div>
        <p className="story-summary">{story.summary}</p>
        <SourceLinks links={story.links} />
      </figcaption>
    </figure>
  );
}
