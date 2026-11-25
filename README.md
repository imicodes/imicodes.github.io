# Weight-loss dashboard

Static, dependency-free 16-week meal and weight tracker. Hosted with GitHub Pages from the repository root.

## Development

Run `python -m http.server 8000` from the repository root and visit http://localhost:8000. Edit index.html for layout, assets/dashboard.css for styling and assets/dashboard.js for menus and tracking logic.

## Deployment

In Settings > Pages select Deploy from a branch, main, / (root). Review and merge feature pull requests before deployment. The existing indexold.html is retained for reference.

## Privacy and limitations

This is a public website. Do not commit personal medical records, credentials or exported progress. Progress is stored in browser localStorage, not synchronised across devices. Export a JSON backup before clearing browser data. Menus are illustrative and not individually calorie-verified; targets are adjustable with professional advice. Future cloud sync requires authentication and per-user access controls.

## Manual checks

Open the page on desktop and tablet; select weeks 1 and 16; toggle a meal and shopping item; reload to verify persistence; enter a weekly weight; export and reimport a backup; check the browser console for errors.
