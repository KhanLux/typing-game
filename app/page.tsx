"use client"

import { getAllTexts } from "@/lib/themed-typing-texts"
import TypingTest from "@/components/TypingTest"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <TypingTest texts={getAllTexts()} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
