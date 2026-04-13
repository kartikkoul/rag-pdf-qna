import type { Metadata } from "next"
import "./globals.css"
import Header from "../components/Header"
import { Provider } from "react-redux"
import { store } from "../state/store"


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
        <body className="min-h-screen max-h-screen flex flex-col">
          <Header />
          {children}
        </body>
      </html>
  )
}
