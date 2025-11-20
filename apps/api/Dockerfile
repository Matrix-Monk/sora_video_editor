FROM node:20-alpine

WORKDIR /app

COPY ../../package.json ../../pnpm-lock.yaml ./
COPY ../../packages ./packages
COPY . .

RUN npm install -g pnpm
RUN pnpm install --prod
RUN pnpm --filter @sora/db prisma generate

EXPOSE 4000
CMD ["pnpm", "start"]