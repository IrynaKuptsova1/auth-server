import { Hono } from "hono";
import { MongoClient, Db } from "mongodb";
import { serve } from "@hono/node-server"; // for local server hosting
import { cors } from "hono/cors";
import { decode, sign, verify } from "hono/jwt";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { RefreshToken, User } from "./types.js";
import { generateAccessToken } from "./utils.js";
import { authValidation } from "./validation.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || !process.env.MONGODB_URI) {
  throw Error(
    "ALARM! APP CANNOT WORK WITHOUT IMPORTANT ENVIRONMENT VARIABLE JWT_SECRET",
  );
}

const app = new Hono();
let client: MongoClient;
let db: Db;

try {
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db();
  console.log("MongoDB connected");
} catch (error) {
  console.error("Connection error:", error);
  throw error;
}

app.use("*", cors());

app.post("/sign_up", async (c) => {
  try {
    const body = await c.req.json();
    const result = authValidation.safeParse(body);
    if (!result.success) {
      return c.json(
        { 
          error: "Validation failed", 
          ddetails: result.error.issues
        }, 
        400
      );
    }
    const { email, password } = result.data;

    const users = db.collection<User>("users");
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
    }
    const userId = uuidv4();

    const hashPassword = await bcrypt.hash(password, 4);

    await users.insertOne({
      id: userId,
      email: email,
      password_hash: hashPassword,
    });
    const accessToken = await generateAccessToken(userId, email);
    const refreshToken = uuidv4();
    const refreshTokens = db.collection<RefreshToken>("refresh_tokens");
    await refreshTokens.insertOne({
      user_id: userId,
      token: refreshToken,
      created_at: new Date(),
    });

    return c.json(
      {
        user: { id: userId, email },
        accessToken,
        refreshToken,
      },
      201,
    );
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const result = authValidation.safeParse(body);

    if (!result.success) {
      return c.json(
        { 
          error: "Validation failed", 
          details: result.error.issues
        }, 
        400
      );
    }
    const { email, password } = await c.req.json();

    const users = db.collection<User>("users");
    const refreshTokens = db.collection<RefreshToken>("refresh_tokens");

    const user = await users.findOne({ email });
    if (!user) {
      return c.json({ error: "Invalid email or password" }, 401);
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return c.json({ error: "Invalid email or password" }, 401);
    }

    const accessToken = await generateAccessToken(user.id, user.email);
    const currentRefreshToken = uuidv4();
    await refreshTokens.updateOne(
      { user_id: user.id },
      {
        $set: {
          token: currentRefreshToken,
          created_at: new Date(),
        },
      },
      { upsert: true },
    );
    await users.updateOne(
      { id: user.id },
      { $set: { last_login: new Date() } },
    );

    return c.json({
      user: { id: user.id, email: user.email },
      accessToken,
      refreshToken: currentRefreshToken,
    });
  } catch (error) {
    return c.json({ error: "Error" }, 500);
  }
});

app.post("/refresh", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json({ error: "Unathorized" }, 401);
    }
    const clientRefreshToken = authHeader.split(" ")[1];

    if (!clientRefreshToken) {
      return c.json({ error: "Refresh token required" }, 401);
    }

    const refreshTokens = db.collection<RefreshToken>("refresh_tokens");
    const users = db.collection<User>("users");

    const storage = await refreshTokens.findOne({ token: clientRefreshToken });
    if (!storage) {
      return c.json({ error: "Invalid or expired refresh token" }, 401);
    }

    const user = await users.findOne({ id: storage.user_id });
    if (!user) {
      return c.json({ error: "User not found" }, 401);
    }

    const newAccessToken = await generateAccessToken(user.id, user.email);

    return c.json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return c.json({ error: "Error" }, 400);
  }
});

app.get("/me", async (c) => {
  try {
    const auth = c.req.header("Authorization");
    const token = auth?.split(" ")[1];

    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const payload = await verify(token, JWT_SECRET, "HS256");

    return c.json({
    data: {
    id: payload.id,
    email: payload.email,
    },
    });
  } catch (error) {
    return c.json({ error: "Unauthorized" }, 401);
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Working on http://localhost:${info.port}`);
  },
);

export default {
  fetch: app.fetch,
};
