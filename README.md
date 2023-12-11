# postgis-ts-playground

## Development Requirements

Before proceeding, please install the following software:

- [Docker][docker-download] - For easy database setup.
- [Beekeeper Studio - Community Edition][beekeeper-download] - For easy database querying and viewing. You can use `psql` if you're a keyboard elitist.
- [Bun][bun-download] - Bun is awesome.

## Setup

```sh
# 1️⃣. Clone
git clone https://github.com/Blankeos/postgis-ts-playground
cd postgis-ts-playground

# 2️⃣. Setup Env
cp .env.example .env

# 3️⃣. Run/Build Postgres in Docker.
bun db:start

# - 3.a To stop:
bun db:stop

# - 3.b Based on configuration, connection string will be this unless you customize:
# postgresql://postgres:password123@127.0.0.1:5432/postgis_playground

# - 3.c To customize the connection string, goto `apps/server`` and change:
# ---> scripts/init.sql (postgis_playground)
# ---> scripts/docker-compose.yml (`POSTGRES_USER` `POSTGRES_PASSWORD` `ports`)

# 4️⃣. Install dependencies
bun install

# 5️⃣. Run (Server)
bun server:dev
```

<!-- # .

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.14. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime. -->

[bun-download]: https://bun.sh
[docker-download]: https://www.docker.com/products/docker-desktop/
[beekeeper-download]: https://github.com/beekeeper-studio/beekeeper-studio/releases
