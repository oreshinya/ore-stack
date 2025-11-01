ARG NODE_VERSION=24.11.0

# ---

FROM node:${NODE_VERSION}-slim AS base

RUN corepack enable \
  && useradd appuser -u 10001 -U -m -s /bin/bash \
  && apt-get update && apt-get install -y \
    tini \
    ca-certificates \
    curl \
  && curl -sfS "https://dotenvx.sh?version=1.51.0" | sh \
  && rm -rf /var/lib/apt/lists/*

USER 10001

ENV LANG=C.UTF-8
ENV TZ=Asia/Tokyo
ENV APP_ROOT=/home/appuser/app

RUN mkdir -p $APP_ROOT

WORKDIR $APP_ROOT

# ---

FROM base AS deps

COPY --chown=appuser:appuser package.json pnpm-lock.yaml $APP_ROOT/

RUN pnpm install --prod --frozen-lockfile

COPY --chown=appuser:appuser . $APP_ROOT

# ---

FROM base AS builder

ARG STAGE

COPY --chown=appuser:appuser package.json pnpm-lock.yaml $APP_ROOT/

RUN pnpm install --frozen-lockfile

COPY --chown=appuser:appuser . $APP_ROOT

RUN dotenvx run --env-file=docker/env/${STAGE}.env -- pnpm build

# ---

FROM deps

COPY --chown=appuser:appuser --from=builder $APP_ROOT/dist $APP_ROOT/dist
COPY --chown=appuser:appuser --from=builder $APP_ROOT/build $APP_ROOT/build

ENTRYPOINT ["/usr/bin/tini", "--"]
