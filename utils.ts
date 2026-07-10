import { sign } from "hono/jwt";

export async function generateAccessToken(
  userId: string,
  email: string,
  JWT_SECRET: string,
) {
  const accessToken = await sign(
    {
      userId,
      email,
      exp: Math.floor(Date.now() / 1000) + 60,
    },
    JWT_SECRET,
    "HS256",
  );
  return accessToken;
}
