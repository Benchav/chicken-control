import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePolloContext } from "@/contexts/ChickenContext";
import { useLoteContext } from "@/contexts/LoteContext";
import { useToast } from "@/hooks/use-toast";
import { Health } from "@/models/health.model";
import { Pollo } from "@/models/pollo.model";
import { AlertTriangle, Heart, Plus, Skull } from "lucide-react";
import { useEffect, useState } from "react";

const LoteDetail = () => {
  const {
    pollos,
    loadingPollos,
    errorPollos,
    fetchPollos,
    createPollo,
    updatePollo,
    deletePollo,
  } = usePolloContext();
  const {lotes: lotesData} = useLoteContext();
  const { toast } = useToast();
  const [filteredPollos, setFilteredPollos] = useState<Pollo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPollo, setEditingPollo] = useState<Pollo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLote, setSelectedLote] = useState("Todos");
  const [selectedEstado, setSelectedEstado] = useState("Todos");
  const [formData, setFormData] = useState({
    identificador: "",
    lote: "",
    raza: "",
    fechaNacimiento: "",
    pesoActual: "",
    estado: "sano",
    observaciones: "",
  });

  const resetForm = () => {
    setFormData({
      identificador: "",
      lote: "",
      raza: "",
      fechaNacimiento: "",
      pesoActual: "",
      estado: "sano",
      observaciones: "",
    });
    setEditingPollo(null);
  };

  // Filtrado de pollos
  useEffect(() => {
    let filtered = pollos;
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.lote.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedLote !== "Todos")
      filtered = filtered.filter((p) => p.lote === selectedLote);
    if (selectedEstado !== "Todos")
      filtered = filtered.filter((p) => p.estado === selectedEstado);
    setFilteredPollos(filtered);
  }, [pollos, searchTerm, selectedLote, selectedEstado]);

  // Manejo de submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPollo) {
        await updatePollo(editingPollo.id, {
          identificador: formData.identificador,
          lote: formData.lote,
          raza: formData.raza,
          fechaNacimiento: formData.fechaNacimiento,
          pesoActual: parseFloat(formData.pesoActual),
          estado: formData.estado as Health,
          observaciones: formData.observaciones,
          ultimaRevision: new Date().toISOString().split("T")[0],
        });
        toast({
          title: "Pollo actualizado",
          description: "Datos actualizados exitosamente",
        });
      } else {
        await createPollo({
          identificador: formData.identificador,
          lote: formData.lote,
          raza: formData.raza,
          fechaNacimiento: formData.fechaNacimiento,
          pesoActual: parseFloat(formData.pesoActual),
          estado: formData.estado as Health,
          observaciones: formData.observaciones,
          ultimaRevision: new Date().toISOString().split("T")[0],
        });
        toast({
          title: "Pollo registrado",
          description: "Nuevo pollo agregado",
        });
      }
      setIsDialogOpen(false);
      resetForm();
      await fetchPollos(); // refrescar lista
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (pollo: Pollo) => {
    setEditingPollo(pollo);
    setFormData({
      identificador: pollo.identificador,
      lote: pollo.lote,
      raza: pollo.raza,
      fechaNacimiento: pollo.fechaNacimiento,
      pesoActual: pollo.pesoActual.toString(),
      estado: pollo.estado,
      observaciones: pollo.observaciones,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deletePollo(id);
    toast({
      title: "Pollo eliminado",
      description: "Registro eliminado",
      variant: "destructive",
    });
    await fetchPollos();
  };

  const handleQuickStatusChange = async (id: string, newStatus: Health) => {
    await updatePollo(id, {
      estado: newStatus,
      ultimaRevision: new Date().toISOString().split("T")[0],
      ...(newStatus === "muerto" ? { pesoActual: 0 } : {}),
    });
    toast({
      title: "Estado actualizado",
      description: `Pollo marcado como ${newStatus}`,
    });
    await fetchPollos();
  };

  const getEstadoBadge = (estado: string) => {
    const config = {
      sano: { variant: "default" as const, icon: Heart, color: "text-success" },
      enfermo: {
        variant: "secondary" as const,
        icon: AlertTriangle,
        color: "text-warning",
      },
      muerto: {
        variant: "destructive" as const,
        icon: Skull,
        color: "text-destructive",
      },
    };
    return config[estado as keyof typeof config] || config.sano;
  };

  const getEdadEnSemanas = (fechaNacimiento: string) => {
    const nacimiento = new Date(fechaNacimiento);
    const ahora = new Date();
    const diferencia = ahora.getTime() - nacimiento.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24 * 7));
  };

  const statsData = {
    total: pollos.length,
    sanos: pollos.filter((p) => p.estado === "sano").length,
    enfermos: pollos.filter((p) => p.estado === "enfermo").length,
    muertos: pollos.filter((p) => p.estado === "muerto").length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestión de Pollos
          </h1>
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        identificador: e.target.value,
                      })
                    }
                    placeholder="A001, B002, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lote">Lote</Label>
                  <Select
                    value={formData.lote}
                    onValueChange={(value) =>
                      setFormData({ ...formData, lote: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar lote" />
                    </SelectTrigger>
                    <SelectContent>
                      {lotesData.slice(1).map((lote) => (
                        <SelectItem key={lote.id} value={lote.id}>
                          {lote.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="raza">Raza</Label>
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                  <Input
                    id="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fechaNacimiento: e.target.value,
                      })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, pesoActual: e.target.value })
                    }
                    placeholder="1.25"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value) =>
                      setFormData({ ...formData, estado: value })
                    }
                  >
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
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                  placeholder="Notas médicas, comportamiento, etc."
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
                  {editingPollo ? "Actualizar" : "Registrar"} Pollo
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LoteDetail;
