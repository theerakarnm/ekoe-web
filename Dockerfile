FROM oven/bun:1.2-slim AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN bun install

FROM oven/bun:1.2-slim AS production-dependencies-env
COPY ./bun.lock /app/
WORKDIR /app
RUN bun install --production

FROM oven/bun:1.2-slim AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN bun run build

FROM oven/bun:1.2-slim
COPY ./bun.lock /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["bun", "run", "start"]