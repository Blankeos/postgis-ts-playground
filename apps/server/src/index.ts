import { Elysia, t } from "elysia";
import sql from "@/database/db";

/** REST server */
const app = new Elysia().get("/", () => "Hello Elysia");

app.ws("/ws", {
  // validate incoming message
  body: t.Object({
    message: t.String(),
  }),
  open(ws) {
    console.log("Someone connected:", ws.id);
  },
  message(ws, { message }) {
    ws.send({
      message,
      time: Date.now(),
    });
  },
});

app.listen(7001);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
