# Profile maintenance

The README presents Sharanya's current learning focus and links to public work.
Keep project claims grounded in those repositories. The driftcheck test count
links to a dated CI run; update the number and link together when useful.

## Visuals

- `assets/hero.svg` and `assets/learning-loop.svg` are custom, self-contained
  illustrations. The loop is conceptual, not a measured experiment.
- `assets/activity.svg` is generated from actual public GitHub contribution data.
- All three use lightweight CSS animations and respect reduced-motion preferences.
- SVGs contain no executable JavaScript, remote fonts, embedded web pages, or
  third-party image services. Their static frames also carry the full meaning.

## Activity refresh

`Refresh public activity` runs daily at 07:17 UTC and can be run manually from
GitHub Actions. It uses Node 22, without package installation or an API token
for fetching data. The workflow token can write this repository to commit only
the generated chart and dataset.

The generator reads the anonymous public contribution calendar and groups the
latest 84 days into twelve seven-day totals. It validates the full calendar,
counts, dates, continuity and freshness before changing the output. A changed
GitHub response format fails the workflow and leaves the previous chart intact.
Public counts are used as displayed by GitHub; no private repository API is read.

Run locally:

```sh
node --test scripts/activity.test.mjs
node scripts/update-activity.mjs
```

For an offline check, pass `--source path/to/saved-public-calendar.html` to the
generator. Data stays in `data/activity.json` so the chart can be audited.
