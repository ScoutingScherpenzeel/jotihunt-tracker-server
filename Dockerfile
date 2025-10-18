FROM oven/bun:1 as base

RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY . .
COPY .env.example .env
RUN bun install

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["bun", "run", "src/index.ts"]