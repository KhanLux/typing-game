"use client"

import { Suspense, lazy } from 'react'
import { getAllTexts } from "@/lib/themed-typing-texts"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Optimización: Carga diferida del componente principal
const TypingTest = lazy(() => import("@/components/TypingTest"))

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-12">
        <div className="w-full max-w-5xl flex flex-col items-center">
          <Suspense fallback={
            <div className="w-full h-64 flex items-center justify-center">
              <div className="animate-pulse text-center">
                <div className="h-8 w-48 bg-primary/20 rounded mx-auto mb-4"></div>
                <div className="h-4 w-64 bg-muted rounded mx-auto"></div>
              </div>
            </div>
          }>
            <TypingTest texts={getAllTexts()} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
