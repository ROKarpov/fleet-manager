## Decisions

- Combined backend (for UI and robot telemetry) on single server. Good for demo purposes or low load. For prod it's better to split these apps, and implement via CQRS pattern, with storage optimal for telemetry (e.g. ClickHouse).
- Each tenant should have isolated storage for security reasons. In demo storage is united.
- Oversimplified UI, for demo purposes.
- It's better to make code more type-safe for prod env on server-client border via openapi.
- Authorization is omitted on purpose (for simplicity).

## How to use demo

0. Install dependencies via pnpm.

1. Configure path to DB in the `web` app's `.env.local` file, e.g.:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/olivaw-db"
```

2. Generate db models, initialize tables, and seed data:

```
pnpm -F web db:generate
pnpm -F web db:push
pnpm -F web db:seed
```

3. Configure path to api in the `robot-simulator` app's `.env.local` file, e.g.:

```

# API URL for fleet manager
API_URL=http://localhost:3000/api
```

4. Run robot simulator

```
pnpm -F robot-simulator generate <id_of_robot_seeded_on_step_2>
```

5. Run web app

```
pnpm -F web dev
```