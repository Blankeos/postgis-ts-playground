# postgis-ts-playground

## Development Requirements

Before proceeding, please install the following software:

- [Docker][docker-download] - For easy database setup.
- [Bun][bun-download] - Both a package manager and runtime. I use Elysia here.
- [Goose][goose-download] - For migrations (a Golang-based migration tool with a compiled executable).
- Optional: [Beekeeper Studio - Community Edition][beekeeper-download] - For easy database querying and viewing. You can just use `psql` if you're a keyboard elitist.

## Setup Server (3 easy steps)

### 1. Create PostGIS Database (Recommended: Use Docker)

The easiest way to get PostGIS up and running is with Docker. If you want a
different way, go to [additional tips](#💡-additional-tips).

```sh
# To start:
bun db:start

# To stop:
bun db:stop
```

> Based on my configuration, connection string should be:
> `postgresql://postgres:password123@127.0.0.1:5432/postgis_playground`

> To customize: `scripts/docker-compose.yml` (`POSTGRES_USER` `POSTGRES_PASSWORD` `POSTGRES_DB`)

### 2. Setup Env

Add your connection string to the .env. Defaults should be fine.

```sh
cp .apps/server/env.example apps/server/.env
```

### 3. Install dependencies and Run

```sh
bun install
bun server:dev
```

## Database Workflows

We use Goose for migrations

```sh
bun migrate:status # see which migrations are pending or applied.
bun migrate:create <migration_name> # create a new migration in src/database/migrations
bun migrate:up # apply migrations to the upwards
bun migrate:down # apply migrations downwards
```

## 💡 Additional Tips

### Test my DB Connection?

> Use **Beekeeper Studio** and pasting the connection string into "Host" of
> **New Connection**. So you know the database is running or if you want to explore.

### Where is the data from my database stored?

> It's in `apps/server/data`, it's passed as a volume into `docker-compose.yml`.
> You can `sudo rm -rf apps/server/data` to delete this.

### Other ways to create a PostGIS database

> 1. Setup from scratch with just Postgres.
>
> Assuming you have no PostGIS installed, just Postgres. Just go here:
> https://postgis.net/documentation/getting_started/
>
> Also make sure to login and create a database
>
> ```sh
> # Login
> psql -U postgres
>
> # Create the database
> CREATE DATABASE postgis_playground;
> ```
>
> 2. A single Docker Container (Postgis) + multiple databases
>
> If you don't want multiple containers running and only want to have 1 container
> and reuse it for multiple databases, do the following:
>
> ```sh
> # Login to postgres database via Docker
> docker exec -ti postgis_playground psql -U postgres
>
> # Create the database
> CREATE DATABASE postgis_playground;
> ```

### Troubleshooting

- ❎ DO NOT use `'POINT(0 0)'`. ✅ Always use `st_point(0, 0)` instead when doing queries inside `` sql`INSERT INTO` ``
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
[goose-download]: https://pressly.github.io/goose/installation/#linux
