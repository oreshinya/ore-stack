---
name: adapters-guide
description: Use when creating or modifying implementations for external APIs, SDKs, and the like. Under app/adapters/ (excluding db/).
user-invocable: false
---

# Adapters Rules

## Responsibilities

Provide connections to external systems (APIs, external services).

- Initialize external system clients
- Provide utility functions specific to each external system

## Directory Structure

```
app/adapters/
├── db/                 # Database adapter (see db-guide)
├── github/             # GitHub API adapter (example)
│   └── client.ts
├── slack/              # Slack API adapter (example)
│   └── client.ts
└── s3/                 # S3 storage adapter (example)
    └── client.ts
```

Use a separate directory for each external system (e.g. `github/`, `slack/`, `s3/`).

## Design Principles

Don't export SDKs or client libraries directly; expose functionality through public functions.
