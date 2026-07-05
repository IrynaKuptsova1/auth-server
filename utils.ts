

import { sign} from 'hono/jwt'
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret'

export async  function generateAccessToken(userId: string, email: string, ttl: number = 60) {
    const accessToken = await sign(
    { 
        userId, 
        email,
        exp: Math.floor(Date.now() / 1000) + ttl
    },
    JWT_SECRET,
    'HS256'
)
    return accessToken
}
