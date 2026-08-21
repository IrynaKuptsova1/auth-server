# Secure Auth API

Challenge: Build a REST API for user registration and JWT authentication with short-lived access tokens (30–60s TTL), token refresh functionality, and protected endpoints.

To see the result, just run:
```
npm run dev
npm run dev:bun
```

This project was built to master full-cycle JWT authentication server. Key learnings include working with the native MongoDB driver, schema validation using Zod, and secure password hashing with bcrypt in Hono.


Deployed server link for fetches: https://auth-server-ntfy.onrender.com


Endpoints

`POST /sign-up` — Body: `{email, password}` Server returned `{user, accessToken, refreshToken}`


`POST /sign-in` — Body: `{email, password}` Server returned `{user, accessToken, refreshToken}`


`POST /refresh` — Body: `{refreshToken}` Server returned `{accessToken, refreshToken}`


`GET /me` — Header: `Authorization: Bearer <token>` `{id, email}`

Example Fetch:
```
curl -X POST https://auth-server-ntfy.onrender.com/sign-up
-H "Content-Type: application/json"
-d '{"email":"test@example.com","password":"123Aa!"}'
```
