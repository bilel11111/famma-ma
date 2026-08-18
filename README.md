# Famma Ma

A Tunisia-focused public information platform for reporting incidents, viewing local alerts, and following community updates.

## Overview

Famma Ma presents location-aware information through an accessible interface designed for Tunisian users. The application combines a map of reported events, a reporting flow, an activity feed, multilingual support, and a public RSS ingestion endpoint.

## Highlights

- Interactive map for viewing reported events and local conditions.
- Public reporting flow for submitting a new event or incident.
- Feed view for browsing recent updates.
- Tunisia-specific geographic divisions and location context.
- Internationalization support through a centralized translation layer.
- Public API routes for events and RSS-based ingestion.
- Responsive interface with mobile-aware components.

## Technology

- React 19 and TypeScript
- TanStack Start and Vite
- Tailwind CSS
- Leaflet for interactive maps
- Supabase for authentication and data services
- Zod, date-fns, and Lucide React

## Local development

```bash
bun install
bun run dev
```

Copy `.env.example` to `.env` and configure the required Supabase and server-side integration values. Keep service credentials server-side and do not commit `.env` files.

## Project structure

The main user flows are under `src/routes/`, reusable map and reporting components are under `src/components/`, and Tunisian geographic data and translations are maintained in `src/data/` and `src/i18n/`.

## Status

This repository is a portfolio project focused on civic information, maps, localization, and resilient public data flows.

## License

No license has been declared yet. Add a license before accepting contributions or distributing the project.

## Author

**Bilel JM** — [GitHub](https://github.com/bilel11111)
