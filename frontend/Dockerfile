# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS runner

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:8010
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Compose passes `clerk_secret` (see docker-compose build.secrets). Do not use ARG/ENV for the secret
# or it would persist in image history; mount it only for this RUN.
RUN --mount=type=secret,id=clerk_secret \
  sh -c 'export CLERK_SECRET_KEY=$(cat /run/secrets/clerk_secret) && npm run build'

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]