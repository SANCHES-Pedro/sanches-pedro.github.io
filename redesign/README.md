# Pedro P. Sanchez portfolio redesign

Next.js and TypeScript implementation of the illustrated portfolio. The home page introduces Pedro and links to the Visual CV and publication archive. The explorer has entries for the career timeline, research, startups, projects, research interests, talks, awards, and patent applications.

## Local development

Run these commands from the redesign directory with Node.js 20.9 or later.

    npm ci
    npm run dev

Open http://localhost:3000. Run the following to check and build the project.

    npm run typecheck
    npm run build

The build generates the static site in the out directory. GitHub Pages can publish that directory as an artifact. It contains the custom domain CNAME and the .nojekyll marker needed to serve Next.js assets. The repository currently has its Jekyll site at the root.

## Updating content

- Edit the hero, languages, and hobbies in src/app/page.tsx.
- Edit career and project entries and their public links in src/data/portfolio.ts.
- Edit the bibliography in src/data/publications.ts.
- Edit the canvas drawings in src/lib/sketches.ts. Each scene has a still frame and a short animation controlled by a progress value. Playback respects the browser’s reduced motion preference.
