FROM node:24-alpine

WORKDIR /app

COPY backend/package.json backend/pnpm-lock.yaml ./

RUN corepack enable && pnpm install

COPY backend ./

EXPOSE 3000

CMD ["pnpm", "dev"]