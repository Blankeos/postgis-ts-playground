import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia");

app.listen(7001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
