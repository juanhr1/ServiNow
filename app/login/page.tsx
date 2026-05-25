"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUsuarios } from "@/lib/api-client"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  setError("")
  setLoading(true)

  try {
    const response = await loginUsuarios(email, password)
    const data: any = response.data
    if (
      response.status !== 200 ||
      !data
    ) {
      setError(data?.error || "Error en el login")
      return
    }

    localStorage.setItem(
      "access_token",
      data.access_token
    )

    localStorage.setItem(
      "refresh_token",
      data.refresh_token
    )

    localStorage.setItem(
      "user_id",
      data.usuario.id
    )

    localStorage.setItem(
      "user_name",
      data.usuario.nombre
    )

    localStorage.setItem(
      "user_role",
      data.usuario.rol
    )

    router.push("/dashboard")

  } catch (err) {
    setError("Error de conexión con el servidor")
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">ServiNow</h1>
            <p className="text-muted-foreground">Inicia sesión en tu cuenta</p>
          </div>

          {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUsuarios } from "@/lib/api-client"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  setError("")
  setLoading(true)

  try {
    const response = await loginUsuarios(email, password)
    const data: any = response.data
    if (
      response.status !== 200 ||
      !data
    ) {
      setError(data?.error || "Error en el login")
      return
    }

    localStorage.setItem(
      "access_token",
      data.access_token
    )

    localStorage.setItem(
      "refresh_token",
      data.refresh_token
    )

    localStorage.setItem(
      "user_id",
      data.usuario.id
    )

    localStorage.setItem(
      "user_name",
      data.usuario.nombre
    )

    localStorage.setItem(
      "user_role",
      data.usuario.rol
    )

    router.push("/dashboard")

  } catch (err) {
    setError("Error de conexión con el servidor")
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">ServiNow</h1>
            <p className="text-muted-foreground">Inicia sesión en tu cuenta</p>
          </div>

          {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}
