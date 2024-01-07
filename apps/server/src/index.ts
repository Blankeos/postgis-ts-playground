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
    // VALIDATION

    // If either radius, x, and y were passed.
    let where = sql``;

    if (query.x !== undefined || query.y !== undefined) {
      // Check if at least 1 was not passed.
      if (query.x === undefined || query.y === undefined) {
        throw Error(
          "Missing either 'x', or 'y'. They must both be passed together."
        );
      }

      where = sql`WHERE ST_DWithin(location, st_point(${query.x}, ${
        query.y
      }), ${query.radius ?? 20000})`;
      // OR
      // where = sql`WHERE ST_Intersects(ST_Buffer(geom, 100.0), 'POINT(1000 1000)')`
    }

    const sqlResponse = await sql`
      SELECT 
        id, name, st_asgeojson(location) as location 
      FROM restaurants
      ${where}
      ${query.limit ? sql`LIMIT ${query.limit}` : sql`LIMIT 20`};
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
        t.Numeric({
          description:
            "The radius (in meters?) from the x and y where restaurants should be found. `x` and `y` must be specified for this. `Default: 20000`",
        })
      ),
      limit: t.Optional(
        t.Numeric({
          description: "The number of restaurants returned. `Default: 20`",
        })
      ),
    }),
  }
);

app.post(
  "/v1/restaurants",
  async ({ body, ...c }) => {
    const sqlResponse = await sql`
      INSERT INTO restaurants (name, location) 
      VALUES 
      (${body.name}, st_point(${body.x}, ${body.y})) 
      RETURNING id, name, st_asgeojson(location) as location;
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
        "Creates a new restaurant on the database with a name and location.",
    },
    body: t.Object({
      name: t.String({
        description: "Name of this new restaurant to be added.",
      }),
      x: t.Number({
        description: "The longitude (x) where the restaurant is located.",
      }),
      y: t.Number({
        description: "The latitude (y) where the restaurant is located.",
      }),
    }),
  }
);

app.patch(
  "/v1/restaurants",
  async ({ body, ...c }) => {
    if (!body.name && body.x === undefined && body.y === undefined)
      throw Error(
        "When using this endpoint, pass at least 1 property to update."
      );

    // Validation
    const atleast1CoordinateIsPassed =
      body.x !== undefined || body.y !== undefined;

    const bothCoordinatesArePassed =
      body.x !== undefined && body.y !== undefined;

    if (atleast1CoordinateIsPassed && !bothCoordinatesArePassed)
      throw Error(
        "If you pass either x or y, you must pass both of them to update the location."
      );

    // Query Building
    const setter: Dict<any> = {};

    if (body.name) {
      setter.name = body.name;
    }
    if (bothCoordinatesArePassed) {
      setter.location = sql`st_point(${body.x!}, ${body.y!})`;
      // OR
      // setter.location = 'POINT(${body.x} ${body.y})
    }

    const sqlResponse = await sql`
        UPDATE restaurants
        SET 
          ${sql(setter)}
        WHERE id = ${body.id}
        RETURNING id, name, st_asgeojson(location) as location; 
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
        "Updates a restaurant on the database based on the id and the details passed. In a 'patch' manner (Only the data provided in the body will be updated, others will be untouched).",
    },
    body: t.Object({
      id: t.Integer({
        description: "ID of the restaurant to be edited.",
      }),
      name: t.Optional(
        t.String({
          description: "Updated name for the restaurant.",
        })
      ),
      x: t.Optional(
        t.Numeric({
          description: "Updated longitude (x) of the restaurant.",
        })
      ),
      y: t.Optional(
        t.Numeric({
          description: "Updated latitude (y) of the restaurant.",
        })
      ),
    }),
  }
);

app.delete(
  "/v1/restaurants",
  async ({ body, ...c }) => {
    const sqlResponse = await sql`
      DELETE FROM restaurants
      WHERE id = ${body.id}
      RETURNING id, name, st_asgeojson(location) as location;
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
        "Deletes a restaurant on the database based on the name and location",
    },
    body: t.Object({
      id: t.Integer({
        description: "ID of the restaurant to be deleted.",
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
