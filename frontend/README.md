This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Copy env and install (from repo root or `frontend/`):

```bash
cp .env.example .env.local
```

Add your [Clerk](https://clerk.com/) keys to `.env.local` (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`). For [Clerk Billing](https://clerk.com/docs/billing/overview) checkout, set `NEXT_PUBLIC_CLERK_CHECKOUT_PLAN_ID` after creating a plan in the Clerk Dashboard.

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Use `npm run dev:turbo` if you want Turbopack; if you see missing `.next/.../app-build-manifest.json` errors after heavy edits, stop the server and run `npm run dev:clean` (or `npm run clean` then `npm run dev`).

### Node version

This template’s tooling (ESLint 9, TypeScript ESLint) expects **Node ≥ 20.9** (or current LTS). On **20.1.x** you may see `EBADENGINE` warnings; upgrade Node (e.g. `nvm install 20 && nvm use 20`) to remove them.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
