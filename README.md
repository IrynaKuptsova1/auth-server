# Authentication API Server

Challenge: Build a REST API for user registration and JWT authentication with short-lived access tokens (30–60s TTL), token refresh functionality, and protected endpoints.

To see the result, just run:
```
npm run dev
npm run dev:bun
```

This project was built to master full-cycle JWT authentication server. Key learnings include working with the native MongoDB driver, schema validation using Zod, and secure password hashing with bcrypt in Hono.

Base URL:

```text
https://auth-server-ntfy.onrender.com
```

## Endpoints

### `POST /sign-up`

Creates a new user account.

**Request Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response**

```json
{
  "user": {},
  "accessToken": "string",
  "refreshToken": "string"
}
```

**cURL**

```bash
curl -X POST https://auth-server-ntfy.onrender.com/sign-up \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123Aa!"}'
```

---

### `POST /sign-in`

Authenticates an existing user.

**Request Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response**

```json
{
  "user": {},
  "accessToken": "string",
  "refreshToken": "string"
}
```

**cURL**

```bash
curl -X POST https://auth-server-ntfy.onrender.com/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123Aa!"}'
```

---

### `POST /refresh`

Refreshes the access token using a refresh token.

**Request Body**

```json
{
  "refreshToken": "string"
}
```

**Response**

```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

**cURL**

Replace `<refreshToken>` with the token received from `/sign-in` or `/sign-up`.

```bash
curl -X POST https://auth-server-ntfy.onrender.com/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

---

### `GET /me`

Returns information about the currently authenticated user.

**Headers**

```http
Authorization: Bearer <accessToken>
```

**Response**

```json
{
  "id": "string",
  "email": "string"
}
```

**cURL**

Replace `<accessToken>` with the access token received from `/sign-in` or `/sign-up`.

```bash
curl https://auth-server-ntfy.onrender.com/me \
  -H "Authorization: Bearer <accessToken>"
```

---
You can test all endpoints immediately by copying the `curl` commands above and running them in your command line (terminal). You can also import or recreate the same requests in API clients such as: Postman, Insomnia, Httpie. No additional setup is required — just use the endpoint URLs and request data shown above.
