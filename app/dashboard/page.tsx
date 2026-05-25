"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Dashboard() {

  const router = useRouter()

  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")

  useEffect(() => {

    const token = localStorage.getItem("access_token")
    const name = localStorage.getItem("user_name")
    const role = localStorage.getItem("user_role")

    if (!token) {
      router.push("/login")
      return
    }

    setUserName(name || "Usuario")
    setUserRole(role || "usuario")

  }, [router])

  const cerrarSesion = () => {

    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user_id")
    localStorage.removeItem("user_name")
    localStorage.removeItem("user_role")

    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-8">

      <div className="max-w-4xl mx-auto">

        <div className="mb-8">

          <h1 className="text-5xl font-bold">
            Bienvenido, {userName}
          </h1>

          <p className="text-muted-foreground text-lg mt-2">

            {userRole === "cliente"
              ? "Has iniciado sesión como cliente"
              : "Has iniciado sesión como profesional"}

          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <Card className="p-6 space-y-4">

            <h2 className="text-2xl font-bold">
              Información del usuario
            </h2>

            <div className="space-y-2 text-lg">

              <p>
                <strong>Nombre:</strong> {userName}
              </p>

              <p>
                <strong>Rol:</strong> {userRole}
              </p>

            </div>

          </Card>

          <Card className="p-6 space-y-4">

            <h2 className="text-2xl font-bold">
              Sesión
            </h2>

            <Button
              onClick={cerrarSesion}
              className="w-full"
            >
              Cerrar sesión
            </Button>

          </Card>

        </div>

      </div>

    </div>
  )
}
