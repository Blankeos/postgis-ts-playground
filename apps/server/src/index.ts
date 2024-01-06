import { Elysia, t } from "elysia";
import sql from "@/database/db";
import { swagger } from "@elysiajs/swagger";

/** REST Server */
const app = new Elysia().get("/", () => "Hello Elysia");

app.use(
  swagger({
    documentation: {
      info: {
        version: "0.0.1",
        title: "PostGIS Playground",
      },
    },
  })
);

app.get(
  "/hello",
  ({ query }) => {
    return `Hello ${query.name}. You are ${query.age}`;
  },
  {
    detail: {
      description: "Says hello to you when you give your name and age.",
    },
    query: t.Object({
      name: t.String(),
      age: t.Numeric(),
    }),
  }
);

app.get("/andrea", () => "Hello Andreaasdasd", {
  detail: {
    description: "Returns the name of andrea",
  },
});

app.get(
  "/v1/restaurants",
  async ({ query, ...c }) => {
    const sqlResponse = await sql`
    SELECT id, name, st_asgeojson(location) as location FROM restaurants ${
      query.limit ? sql`limit = ${query.limit}` : sql``
    };
  `;

    const restaurants = sqlResponse.map((restaurant) => ({
      ...restaurant,
      location: JSON.parse(restaurant.location),
    }));

    return restaurants;
  },
  {
    detail: {
      description:
        "Returns a list of restaurants with their names and location. By default, it will get all the restaurants without respect to the location.",
    },
    query: t.Object({
      x: t.Optional(
        t.Numeric({
          description: "The longitude (x) of the point for reference.",
        })
      ),
      y: t.Optional(
        t.Numeric({
          description: "The latitude (y) of the point for reference.",
        })
      ),
      radius: t.Optional(
        t.Number({
          description:
            "The radius (in meters?) from the x and y where restaurants should be found. `x` and `y` must be specified for this. `Default: 20`",
        })
      ),
      limit: t.Optional(
        t.Number({
          description: "The number of restaurants returned. `Default: 20`",
        })
      ),
    }),
  }
);

app.post(
  "/v1/restaurants",
  async ({ body, ...c }) => {
    console.log("posting", body.x, body.y, typeof body.x, typeof body.y);

    const sqlResponse = await sql`
    INSERT INTO restaurants (name, location) VALUES (${body.name}, st_point(${body.x}, ${body.y})) RETURNING id, name, st_asgeojson(location) as location;
    `;

    console.log(sqlResponse);
    const restaurants = sqlResponse.map((restaurant) => ({
      ...restaurant,
      location: JSON.parse(restaurant.location),
    }));

    return restaurants;
  },
  {
    detail: {
      description:
        "Creates a new restaurant on the database with a name and location.",
    },
    body: t.Object({
      name: t.String(),
      x: t.Number({
        description: "The longitude (x) where the restaurant is located.",
      }),
      y: t.Number({
        description: "The latitude (y) where the restaurant is located.",
      }),
    }),
  }
);

// WS Server
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
