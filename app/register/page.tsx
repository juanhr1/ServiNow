"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registroUsuarios } from "@/lib/api-client"

export default function Register() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [role, setRole] = useState<"cliente" | "profesional">("cliente")

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    ciudad: "",
    oficio: "",
    tarifa: "",
    contrasena: "",
    confirmarContrasena: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const roleParam = searchParams?.get("role")

    if (
      roleParam === "cliente" ||
      roleParam === "profesional"
    ) {
      setRole(roleParam)
    }
  }, [searchParams])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    setError("")

    if (
      formData.contrasena !==
      formData.confirmarContrasena
    ) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const userData: any = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        ciudad: formData.ciudad,
        contrasena: formData.contrasena,
        rol: role,
      }

      if (role === "profesional") {
        userData.oficio = formData.oficio
        userData.tarifa = formData.tarifa
      }

      const response = await registroUsuarios(userData)

      if (
        response.status !== 201 ||
        !response.data
      ) {
        const errorMessage = 
        (response.data as any)?.error ||
        "Error en el registro"

        setError(errorMessage ||"Error en el registro")
        return
      }

      alert("Registro exitoso")

      router.push("/login")

    } catch (error) {
      console.error(error)
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">

      <Card className="w-full max-w-md p-8">

        <div className="space-y-6">

          <div className="text-center">
            <h1 className="text-3xl font-bold">
              ServiNow
            </h1>

            <p className="text-muted-foreground">
              Crea tu cuenta
            </p>
          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() => setRole("cliente")}
              className={`flex-1 p-2 rounded ${
                role === "cliente"
                  ? "bg-primary text-white"
                  : "border"
              }`}
            >
              Cliente
            </button>

            <button
              type="button"
              onClick={() => setRole("profesional")}
              className={`flex-1 p-2 rounded ${
                role === "profesional"
                  ? "bg-primary text-white"
                  : "border"
              }`}
            >
              Profesional
            </button>

          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >

            <div className="grid grid-cols-2 gap-3">

              <div>
                <Label>Nombre</Label>

                <Input
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Apellido</Label>

                <Input
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            <div>
              <Label>Email</Label>

              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Ciudad</Label>

              <Input
                name="ciudad"
                placeholder="Ej: Popayán"
                value={formData.ciudad}
                onChange={handleChange}
                required
              />
            </div>

            {role === "profesional" && (
              <>
                <div>
                  <Label>Oficio</Label>

                  <Input
                    name="oficio"
                    placeholder="Ej: Electricista"
                    value={formData.oficio}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Tarifa (COP)</Label>

                  <Input
                    type="number"
                    name="tarifa"
                    value={formData.tarifa}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div>
              <Label>Contraseña</Label>

              <Input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Confirmar contraseña</Label>

              <Input
                type="password"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Creando cuenta..."
                : "Crear Cuenta"}
            </Button>

          </form>

          <div className="text-center text-sm">

            ¿Ya tienes cuenta?{" "}

            <Link
              href="/login"
              className="text-primary font-semibold"
            >
              Inicia sesión
            </Link>

          </div>

        </div>

      </Card>

    </div>
  )
}
