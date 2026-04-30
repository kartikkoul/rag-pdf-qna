import "dotenv/config";

export const ENV_VARS = {
  JWT_SECRET:  process.env["JWT_SECRET"],
  FASTAPI_BASE_URL: process.env["NODE_ENV"] === "production" ? process.env["FASTAPI_BASE_URL"] : "http://localhost:8000/v1"
}