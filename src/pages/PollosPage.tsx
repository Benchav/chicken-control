import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Search, Filter, Heart, AlertTriangle, Skull } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { pollosData } from "@/data/pollos.data"
import { Pollo } from "@/models/pollo.model"
import { Health } from "@/models/health.model"
import { lotesData } from "@/data/lotes.data"


export default function PollosPage() {
  const [pollos, setPollos] = useState<Pollo[]>(pollosData)
  const [filteredPollos, setFilteredPollos] = useState<Pollo[]>(pollosData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPollo, setEditingPollo] = useState<Pollo | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLote, setSelectedLote] = useState("Todos")
  const [selectedEstado, setSelectedEstado] = useState("Todos")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    identificador: "",
    lote: "",
    raza: "",
    fechaNacimiento: "",
    pesoActual: "",
    estado: "sano",
    observaciones: ""
  })

  const resetForm = () => {
    setFormData({
      identificador: "",
      lote: "",
      raza: "",
      fechaNacimiento: "",
      pesoActual: "",
      estado: "sano",
      observaciones: ""
    })
    setEditingPollo(null)
  }

  const handleFilter = () => {
    let filtered = pollos

    if (searchTerm) {
      filtered = filtered.filter(pollo => 
        pollo.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pollo.lote.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedLote !== "Todos") {
      filtered = filtered.filter(pollo => pollo.lote === selectedLote)
    }

    if (selectedEstado !== "Todos") {
      filtered = filtered.filter(pollo => pollo.estado === selectedEstado)
    }

    setFilteredPollos(filtered)
  }

  // Auto-filter when filters change
  useEffect(() => {
    handleFilter()
  }, [searchTerm, selectedLote, selectedEstado, pollos])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPollo) {
      setPollos(pollos.map(pollo => 
        pollo.id === editingPollo.id 
          ? {
              ...pollo,
              identificador: formData.identificador,
              lote: formData.lote,
              raza: formData.raza,
              fechaNacimiento: formData.fechaNacimiento,
              pesoActual: parseFloat(formData.pesoActual),
              estado: formData.estado as Health,
              observaciones: formData.observaciones,
              ultimaRevision: new Date().toISOString().split('T')[0]
            }
          : pollo
      ))
      toast({
        title: "Pollo actualizado",
        description: "Los datos del pollo han sido actualizados exitosamente"
      })
    } else {
      const newPollo: Pollo = {
        id: Date.now().toString(),
        identificador: formData.identificador,
        lote: formData.lote,
        raza: formData.raza,
        fechaNacimiento: formData.fechaNacimiento,
        pesoActual: parseFloat(formData.pesoActual),
        estado: formData.estado as Health,
        observaciones: formData.observaciones,
        ultimaRevision: new Date().toISOString().split('T')[0]
      }
      setPollos([...pollos, newPollo])
      toast({
        title: "Pollo registrado",
        description: "El nuevo pollo ha sido registrado exitosamente"
      })
    }
    
    setIsDialogOpen(false)
    resetForm()
  }

  const handleEdit = (pollo: Pollo) => {
    setEditingPollo(pollo)
    setFormData({
      identificador: pollo.identificador,
      lote: pollo.lote,
      raza: pollo.raza,
      fechaNacimiento: pollo.fechaNacimiento,
      pesoActual: pollo.pesoActual.toString(),
      estado: pollo.estado,
      observaciones: pollo.observaciones
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setPollos(pollos.filter(pollo => pollo.id !== id))
    toast({
      title: "Pollo eliminado",
      description: "El registro del pollo ha sido eliminado del sistema",
      variant: "destructive"
    })
  }

  const handleQuickStatusChange = (id: string, newStatus: Health) => {
    setPollos(pollos.map(pollo => 
      pollo.id === id 
        ? { 
            ...pollo, 
            estado: newStatus,
            ultimaRevision: new Date().toISOString().split('T')[0],
            ...(newStatus === "muerto" && { pesoActual: 0 })
          }
        : pollo
    ))
    toast({
      title: `Estado actualizado`,
      description: `El pollo ha sido marcado como ${newStatus}`,
      variant: newStatus === "muerto" ? "destructive" : "default"
    })
  }

  const getEstadoBadge = (estado: string) => {
    const config = {
      sano: { variant: "default" as const, icon: Heart, color: "text-success" },
      enfermo: { variant: "secondary" as const, icon: AlertTriangle, color: "text-warning" },
      muerto: { variant: "destructive" as const, icon: Skull, color: "text-destructive" }
    }
    return config[estado as keyof typeof config] || config.sano
  }

  const getEdadEnSemanas = (fechaNacimiento: string) => {
    const nacimiento = new Date(fechaNacimiento)
    const ahora = new Date()
    const diferencia = ahora.getTime() - nacimiento.getTime()
    return Math.floor(diferencia / (1000 * 60 * 60 * 24 * 7))
  }

  const statsData = {
    total: pollos.length,
    sanos: pollos.filter(p => p.estado === "sano").length,
    enfermos: pollos.filter(p => p.estado === "enfermo").length,
    muertos: pollos.filter(p => p.estado === "muerto").length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Pollos</h1>
          <p className="text-muted-foreground">
            Control individual de todos los pollos del sistema
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Registrar Pollo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingPollo ? "Editar Pollo" : "Registrar Nuevo Pollo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identificador">Identificador</Label>
                  <Input
                    id="identificador"
                    value={formData.identificador}
                    onChange={(e) => setFormData({...formData, identificador: e.target.value})}
                    placeholder="A001, B002, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lote">Lote</Label>
                  <Select value={formData.lote} onValueChange={(value) => setFormData({...formData, lote: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar lote" />
                    </SelectTrigger>
                    <SelectContent>
                      {lotesData.slice(1).map(lote => (
                        <SelectItem key={lote.id} value={lote.id}>{lote.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="raza">Raza</Label>
                  <Select value={formData.raza} onValueChange={(value) => setFormData({...formData, raza: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar raza" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ross 308">Ross 308</SelectItem>
                      <SelectItem value="Cobb 500">Cobb 500</SelectItem>
                      <SelectItem value="Hubbard Classic">Hubbard Classic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pesoActual">Peso Actual (kg)</Label>
                  <Input
                    id="pesoActual"
                    type="number"
                    step="0.01"
                    value={formData.pesoActual}
                    onChange={(e) => setFormData({...formData, pesoActual: e.target.value})}
                    placeholder="1.25"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({...formData, estado: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sano">Sano</SelectItem>
                      <SelectItem value="enfermo">Enfermo</SelectItem>
                      <SelectItem value="muerto">Muerto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Notas médicas, comportamiento, etc."
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPollo ? "Actualizar" : "Registrar"} Pollo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pollos</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sanos</CardTitle>
            <Heart className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{statsData.sanos}</div>
            <p className="text-xs text-muted-foreground">
              {((statsData.sanos / statsData.total) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enfermos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{statsData.enfermos}</div>
            <p className="text-xs text-muted-foreground">
              {((statsData.enfermos / statsData.total) * 100).toFixed(1)}% del total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Muertos</CardTitle>
            <Skull className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{statsData.muertos}</div>
            <p className="text-xs text-muted-foreground">
              {((statsData.muertos / statsData.total) * 100).toFixed(1)}% mortalidad
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por identificador o lote..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={selectedLote} onValueChange={setSelectedLote}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {lotesData.map(lote => (
                    <SelectItem key={lote.id} value={lote.id}>{lote.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="sm:w-32">
              <Select value={selectedEstado} onValueChange={setSelectedEstado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="sano">Sanos</SelectItem>
                  <SelectItem value="enfermo">Enfermos</SelectItem>
                  <SelectItem value="muerto">Muertos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Pollos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Pollos ({filteredPollos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identificador</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Raza</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Peso</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Última Revisión</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPollos.map((pollo) => {
                  const estadoConfig = getEstadoBadge(pollo.estado)
                  const IconComponent = estadoConfig.icon
                  
                  return (
                    <TableRow key={pollo.id}>
                      <TableCell className="font-medium">{pollo.identificador}</TableCell>
                      <TableCell>{pollo.lote}</TableCell>
                      <TableCell>{pollo.raza}</TableCell>
                      <TableCell>{getEdadEnSemanas(pollo.fechaNacimiento)} sem</TableCell>
                      <TableCell>{pollo.estado === "muerto" ? "-" : `${pollo.pesoActual}kg`}</TableCell>
                      <TableCell>
                        <Badge variant={estadoConfig.variant} className="gap-1">
                          <IconComponent className="h-3 w-3" />
                          {pollo.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(pollo.ultimaRevision).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(pollo)}
                            className="h-7 w-7 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          {pollo.estado === "sano" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickStatusChange(pollo.id, Health.SICK)}
                                className="h-7 px-2 text-warning hover:text-warning"
                                title="Marcar como enfermo"
                              >
                                <AlertTriangle className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickStatusChange(pollo.id, Health.DEAD)}
                                className="h-7 px-2 text-destructive hover:text-destructive"
                                title="Marcar como muerto"
                              >
                                <Skull className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(pollo.id)}
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}