# syntax=docker/dockerfile:1
FROM node:20-bookworm-slim AS runner

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:8010
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start"]
