export type AuthData = {
    user: {
      userId: string,
      username: string
    } | undefined;
    token: string | null;
}