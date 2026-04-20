import type { Metadata } from "next"
import "./globals.css"
import ReduxProvider from "../components/ReduxProvider";


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
      <html
        lang="en"
        className={`h-full antialiased`}
      >
        <body className="min-h-screen max-h-screen overflow-hidden">
          <ReduxProvider>{children}</ReduxProvider>
        </body>
      </html>
  )
}
