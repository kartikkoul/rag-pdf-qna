import type { Metadata } from "next"
import "./globals.css"
import ReduxProvider from "../components/ReduxProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ENV_VARS } from "../env_vars";


export const metadata: Metadata = {
  title: "My KnowledgeBase",
  description: "Build your knowledge base by uploading pdfs and then ask questions whenever you want.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <GoogleOAuthProvider clientId={ENV_VARS.GOOGLE_CLIENT_ID ?? ""}>
        <html
          lang="en"
          className={`h-full antialiased`}
        >
          <body className="h-screen scrollbar-custom">
            <ReduxProvider>{children}</ReduxProvider>
          </body>
        </html>
      </GoogleOAuthProvider>
  )
}
