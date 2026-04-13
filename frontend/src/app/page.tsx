"use client"
import { Provider } from "react-redux"
import AIChat from "../components/AIChat"
import KnowledgeBase from "../components/KnowledgeBaseSection/KnowledgeBase"
import { store } from "../state/store"

export default function Home() {
  return (
    <Provider store={store}>
      <main className="main flex gap-8 p-4">
        <KnowledgeBase />
        <AIChat />
      </main>
    </Provider>
  )
}
