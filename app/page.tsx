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
    setUserRole(role || "Sin rol")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_name")
    localStorage.removeItem("user_role")

    router.push("/login")
  }

  if (!userName) return null

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Bienvenido, {userName}
          </h1>

          <p className="text-muted-foreground">
            Has iniciado sesión correctamente
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              Información del usuario
            </h2>

            <div className="space-y-2">
              <p>
                <strong>Nombre:</strong> {userName}
              </p>

              <p>
                <strong>Rol:</strong> {userRole}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">
              Sesión
            </h2>

            <Button
              onClick={handleLogout}
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
