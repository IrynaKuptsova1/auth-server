export type User = {
    id: string
    email: string
    password_hash: string
}

export type RefreshToken = {
    user_id: string
    token: string
    created_at: Date
}