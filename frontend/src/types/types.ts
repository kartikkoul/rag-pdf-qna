export type AuthData = {
    user: {
      userId: string,
      username: string
    } | undefined;
    token: string | null;
}

export type StandardError = {
  type?: string;
  message: string | Array<object>;
}

export type StreamingMessage = {
  message: string | null,
  streaming: boolean
}

export type Message = {
  role: string;
  content: string;
  error?: string
}