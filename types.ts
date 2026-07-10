export type Bindings = {
  JWT_SECRET: string;
  MONGODB_URI: string;
};

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
export type TokenPair = {
    accessToken: string;
    refreshToken: string;
}