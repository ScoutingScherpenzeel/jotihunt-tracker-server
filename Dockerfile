FROM oven/bun:1 as base
WORKDIR /usr/src/app

COPY . .
COPY .env.example .env
RUN bun install

ARG PORT
EXPOSE ${PORT:-3000}

CMD ["bun", "run", "src/index.ts"]