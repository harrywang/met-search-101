# Met Museum Search App

This project is a modern search interface for the Metropolitan Museum of Art collection, built with [Next.js](https://nextjs.org). It uses the [Met Museum Collection API](https://metmuseum.github.io/) to let you search, browse, and explore artworks.

## Features

- **Search** the Met collection by keyword
- **Pagination**: 9 results per page, with Next/Previous navigation
- **Image filtering**: Only shows artworks with images
- **Loading animation**: Animated dots while fetching results
- **Clear search**: Easily clear your search with an "×" button inside the input
- **Sample searches**: (if enabled in your UI)
- Responsive, clean UI

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to use the app.

## How It Works

- Enter a search term and press **Search** (or Enter)
- Results with images are shown in a grid, 9 per page
- Use **Next** and **Previous** to page through results
- Click the **×** button to clear your search and start over
- While loading, an animated dots loader is shown

## API Integration

This app uses the [Metropolitan Museum of Art Collection API](https://metmuseum.github.io/):
- `/search` endpoint to find object IDs by keyword
- `/objects/{id}` endpoint to fetch artwork details and images

## Customization

You can edit the main search page in `src/app/page.tsx` to further customize the UI or add new features.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Met Museum API Docs](https://metmuseum.github.io/)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
