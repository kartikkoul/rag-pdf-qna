import "dotenv/config";

let ENV_VARS = {
  JWT_SECRET: process.env["JWT_SECRET"],
  FASTAPI_BASE_URL: "http://localhost:8000/v1",
  GOOGLE_CLIENT_ID: process.env["GOOGLE_CLIENT_ID"],
  GOOGLE_CLIENT_SECRET: process.env["GOOGLE_CLIENT_SECRET"],
  NEXTJS_PUBLIC_APP_URL: "http://localhost:3000/",
};

if (process.env["NODE_ENV"] === "production") {
  ENV_VARS = {
    ...ENV_VARS,
    ...{
      FASTAPI_BASE_URL: process.env["FASTAPI_BASE_URL"] as string,
      GOOGLE_CLIENT_ID: process.env["GOOGLE_CLIENT_ID"],
      GOOGLE_CLIENT_SECRET: process.env["GOOGLE_CLIENT_SECRET"],
      NEXTJS_PUBLIC_APP_URL: process.env["NEXTJS_PUBLIC_APP_URL"] as string,
    },
  };
}

export { ENV_VARS };
