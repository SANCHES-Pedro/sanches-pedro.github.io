# Pedro P. Sanchez portfolio redesign

Next.js and TypeScript implementation of the illustrated portfolio. The home page introduces Pedro and links to the Visual CV and publication archive. The explorer has entries for the career timeline, research, startups, projects, research interests, talks, awards, and patent applications.

## Local development

Run these commands from the redesign directory with Node.js 20.9 or later.

    npm ci
    npm run dev

Open http://localhost:3000. Run the following to check and build the project.

    npm run typecheck
    npm run build

The build generates the static site in the out directory. The legacy Jekyll site has its source at the repository root.

## Deploying with the Vercel CLI

Deploy a clean copy of this directory to the ppsanchez Vercel project. The copy has no Git metadata, so the deployment uses the Vercel CLI session independently of any GitHub account connected to Vercel. From the repository root, run:

    release_dir="$(mktemp -d)"
    git archive HEAD:redesign | tar -x -C "$release_dir"
    (
      cd "$release_dir" || exit
      vercel link --yes --project ppsanchez --scope pedrossg-web
      vercel deploy --yes --scope pedrossg-web
    )

The Vercel configuration runs the Next.js build and serves the files from out. Verify the generated deployment URL before promoting it to production.

## Updating content

- Edit the hero, languages, and hobbies in src/app/page.tsx.
- Edit career and project entries and their public links in src/data/portfolio.ts.
- Edit the bibliography in src/data/publications.ts.
- Edit the canvas drawings in src/lib/sketches.ts. Each scene has a still frame and a short animation controlled by a progress value. Playback respects the browser’s reduced motion preference.

The bibliography was checked against [Pedro's Google Scholar profile](https://scholar.google.com/citations?user=KPchGe4AAAAJ&hl=en) on 16 November 2026. Its 35 profile entries correspond to 32 distinct records after combining the listed versions of Privacy Distillation, MemControl, and What Is Healthy? Each publication uses venue metadata where available.
