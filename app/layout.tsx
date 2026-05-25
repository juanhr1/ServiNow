import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ServiNow - Marketplace de Servicios",
  description: "Plataforma para conectar clientes con profesionales de servicios",
  icons: {
    icon: "/sn.png",        
    shortcut: "/sn.png",
    apple: "/sn.png"
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${geist.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}