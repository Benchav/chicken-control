import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Lote } from "@/models/lote.model"
import { Status } from "@/models/status.model"
import { useLoteContext } from "@/contexts/LoteContext"
import { useNavigate } from "react-router-dom"

export default function LotesPage() {
  const { lotes, addLote, updateLote, deleteLote, loadingLotes, errorLotes } =
    useLoteContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLote, setEditingLote] = useState<Lote | null>(null)
  const { toast } = useToast()
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nombre: "",
    cantidadInicial: "",
    fechaInicio: "",
    raza: "",
    estado: Status.ACTIVE,
    pesoPromedio: "",
    mortalidad: "",
    observaciones: "",
  })

  const resetForm = () => {
    setFormData({
      nombre: "",
      cantidadInicial: "",
      fechaInicio: "",
      raza: "",
      estado: Status.ACTIVE,
      pesoPromedio: "",
      mortalidad: "",
      observaciones: "",
    })
    setEditingLote(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data: Lote = {
      id: editingLote ? editingLote.id : Date.now().toString(),
      nombre: formData.nombre,
      cantidadInicial: parseInt(formData.cantidadInicial),
      cantidadActual: parseInt(formData.cantidadInicial),
      fechaInicio: formData.fechaInicio,
      raza: formData.raza,
      estado: formData.estado,
      pesoPromedio: parseFloat(formData.pesoPromedio) || 0,
      mortalidad: parseFloat(formData.mortalidad) || 0,
      observaciones: formData.observaciones,
    }

    try {
      if (editingLote) {
        await updateLote(data)
        toast({
          title: "Lote actualizado",
          description: "Los datos del lote han sido actualizados exitosamente",
        })
      } else {
        await addLote(data)
        toast({
          title: "Lote creado",
          description: "El nuevo lote ha sido creado exitosamente",
        })
      }
      setIsDialogOpen(false)
      resetForm()
    } catch {
      toast({
        title: "Error",
        description: "No se pudo guardar el lote",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (lote: Lote) => {
    setEditingLote(lote)
    setFormData({
      nombre: lote.nombre,
      cantidadInicial: lote.cantidadInicial.toString(),
      fechaInicio: lote.fechaInicio,
      raza: lote.raza,
      estado: lote.estado,
      pesoPromedio: lote.pesoPromedio.toString(),
      mortalidad: lote.mortalidad.toString(),
      observaciones: lote.observaciones,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteLote(id)
      toast({
        title: "Lote eliminado",
        description: "El lote ha sido eliminado del sistema",
        variant: "destructive",
      })
    } catch {
      toast({
        title: "Error",
        description: "No se pudo eliminar el lote",
        variant: "destructive",
      })
    }
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      activo: "default",
      completado: "secondary",
      suspendido: "destructive",
    }
    return variants[estado as keyof typeof variants] || "default"
  }

  const getEdadEnSemanas = (fechaInicio: string) => {
    const inicio = new Date(fechaInicio)
    const ahora = new Date()
    const diferencia = ahora.getTime() - inicio.getTime()
    return Math.floor(diferencia / (1000 * 60 * 60 * 24 * 7))
  }

  if (loadingLotes)
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Cargando lotes...
      </div>
    )

  if (errorLotes)
    return (
      <div className="flex justify-center items-center h-screen text-destructive">
        {errorLotes}
      </div>
    )

  const lotesActivos = lotes.filter((l) => l.estado === Status.ACTIVE)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Lotes</h1>
          <p className="text-muted-foreground">
            Administra y monitorea todos los lotes de pollos de engorde
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Lote
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingLote ? "Editar Lote" : "Crear Nuevo Lote"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre y cantidad */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre del Lote</Label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cantidad Inicial</Label>
                  <Input
                    type="number"
                    value={formData.cantidadInicial}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cantidadInicial: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              {/* Fecha y raza */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Inicio</Label>
                  <Input
                    type="date"
                    value={formData.fechaInicio}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaInicio: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Raza</Label>
                  <Select
                    value={formData.raza}
                    onValueChange={(value) =>
                      setFormData({ ...formData, raza: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar raza" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ross 308">Ross 308</SelectItem>
                      <SelectItem value="Cobb 500">Cobb 500</SelectItem>
                      <SelectItem value="Hubbard Classic">
                        Hubbard Classic
                      </SelectItem>
                      <SelectItem value="Arbor Acres">Arbor Acres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Estado, Peso y Mortalidad */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(v) =>
                      setFormData({ ...formData, estado: v as Status })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Status.ACTIVE}>Activo</SelectItem>
                      <SelectItem value={Status.DONE}>Completado</SelectItem>
                      <SelectItem value={Status.SUSPENDED}>Suspendido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Peso Promedio (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.pesoPromedio}
                    onChange={(e) =>
                      setFormData({ ...formData, pesoPromedio: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mortalidad (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.mortalidad}
                    onChange={(e) =>
                      setFormData({ ...formData, mortalidad: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div className="space-y-2">
                <Label>Observaciones</Label>
                <Textarea
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingLote ? "Actualizar" : "Crear"} Lote
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas Resumen */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Lotes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lotes.length}</div>
            <p className="text-xs text-muted-foreground">
              {lotesActivos.length} activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pollos Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lotesActivos
                .reduce((sum, l) => sum + l.cantidadActual, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              En {lotesActivos.length} lotes activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mortalidad Promedio</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                lotesActivos.reduce((sum, l) => sum + l.mortalidad, 0) /
                (lotesActivos.length || 1)
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">Últimos lotes activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Peso Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                lotesActivos.reduce((sum, l) => sum + l.pesoPromedio, 0) /
                (lotesActivos.length || 1)
              ).toFixed(1)}
              kg
            </div>
            <p className="text-xs text-muted-foreground">Lotes activos</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Lotes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lotes.map((lote) => (
          <Card key={lote.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold cursor-pointer" onClick={() => navigate(`/lotes/${lote.id}`)}>
                  {lote.nombre}
                </CardTitle>
                <Badge onClick={() => navigate(`/lotes/${lote.nombre}`)} variant={getEstadoBadge(lote.estado) as any}>
                  {lote.estado}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Raza: {lote.raza} • {getEdadEnSemanas(lote.fechaInicio)} semanas
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Cantidad</p>
                  <p className="font-semibold">
                    {lote.cantidadActual.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Peso Prom.</p>
                  <p className="font-semibold">{lote.pesoPromedio}kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Mortalidad</p>
                  <p
                    className={`font-semibold ${
                      lote.mortalidad > 8
                        ? "text-destructive"
                        : lote.mortalidad > 5
                        ? "text-warning"
                        : "text-success"
                    }`}
                  >
                    {lote.mortalidad}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fecha Inicio</p>
                  <p className="font-semibold">
                    {new Date(lote.fechaInicio).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {lote.observaciones && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    {lote.observaciones}
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(lote)}
                  className="flex-1 gap-1 bg-blue-500 text-white hover:bg-blue-800 hover:text-white"
                >
                  <Edit className="h-3 w-3" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(lote.id)}
                  className="gap-1 text-white hover:text-white bg-red-500 hover:bg-red-800"
                >
                  <Trash2 className="h-3 w-3" />
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
