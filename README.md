# Secure Auth API

Challenge: Build a REST API for user registration and JWT authentication with short-lived access tokens (30–60s TTL), token refresh functionality, and protected mock endpoints.

To see the result, just run:
```bash
npm run dev
npm run dev:bun
```

This project was built to master full-cycle JWT authentication server — specifically handling short token lifetimes (30–60s TTL), token refresh flows, and route protection. Key learnings include working with the native MongoDB driver, schema validation using Zod, and secure password hashing with bcrypt in Hono.


Deploy link: https://auth-server-ntfy.onrender.com


Endpoints

`POST /sign-up` — Body: `{email, password}` ➔ `{user, accessToken, refreshToken}`
`POST /sign-in` — Body: `{email, password}` ➔ `{user, accessToken, refreshToken}`
`POST /refresh` — Body: `{refreshToken}` ➔ `{accessToken, refreshToken}`
`GET /me` — Header: `Authorization: Bearer <token>` ➔ `{id, email}`

```
curl -X POST [https://auth-server-ntfy.onrender.com/sign-up](https://auth-server-ntfy.onrender.com/sign-up) 
  body:'{"email":"test@example.com","password":"123Aa!"}'
```