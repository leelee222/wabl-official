"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="wabl-theme"
      themes={['light', 'dark']}
      forcedTheme={undefined}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
