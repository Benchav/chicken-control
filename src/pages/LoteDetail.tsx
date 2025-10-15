import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { AlertTriangle, Heart, Plus, Skull, Edit, Trash2, Stethoscope } from "lucide-react";
import { useHealthContext } from "@/contexts/HealthContext";
import { RecordType } from "@/models/recordType.model";
import { RegistroSalud } from "@/models/healthRegister.model";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LoteDetail = () => {
  const { id: loteId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    pollos,
    loadingPollos,
    errorPollos,
    fetchPollos,
    createPollo,
    updatePollo,
    deletePollo,
  } = usePolloContext();
  const { lotes: lotesData } = useLoteContext();
  const { toast } = useToast();

  const { healths, loadingHealths, errorHealths, fetchHealths, addHealth } = useHealthContext();

  const [filteredPollos, setFilteredPollos] = useState<Pollo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPollo, setEditingPollo] = useState<Pollo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("Todos");
  const [formData, setFormData] = useState({
    identificador: "",
    lote: loteId || "",
    raza: "",
    fechaNacimiento: "",
    pesoActual: "",
    estado: "sano",
    observaciones: "",
  });

  // Health record UI state
  const [isHealthDialogOpen, setIsHealthDialogOpen] = useState(false);
  const [selectedPolloForHealth, setSelectedPolloForHealth] = useState<Pollo | null>(null);
  const [healthForm, setHealthForm] = useState({
    tipoRegistro: RecordType.REVISION as RecordType,
    diagnostico: "",
    tratamiento: "",
    medicamento: "",
    dosis: "",
    veterinario: "",
    proximaRevision: "",
    observaciones: "",
  });

  useEffect(() => {
    fetchPollos();
    fetchHealths();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let list = pollos;
    if (loteId) list = list.filter((p) => p.lote === loteId || p.lote === getLoteNameById(loteId));
    if (searchTerm) {
      list = list.filter(
        (p) =>
          p.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.lote.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedEstado !== "Todos") list = list.filter((p) => p.estado === selectedEstado);
    setFilteredPollos(list);
  }, [pollos, loteId, searchTerm, selectedEstado, lotesData]);

  // compute latest health record per pollo (by id or identificador)
  const latestHealthByPollo = useMemo(() => {
    const map: Record<string, RegistroSalud> = {};
    healths.forEach((h) => {
      const key = h.polloId || h.polloIdentificador;
      const prev = map[key];
      if (!prev || new Date(h.fecha) > new Date(prev.fecha)) map[key] = h;
    });
    return map;
  }, [healths]);

  const openHealthDialog = (pollo: Pollo) => {
    setSelectedPolloForHealth(pollo);
    setHealthForm({
      tipoRegistro: RecordType.REVISION,
      diagnostico: "",
      tratamiento: "",
      medicamento: "",
      dosis: "",
      veterinario: "",
      proximaRevision: "",
      observaciones: "",
    });
    setIsHealthDialogOpen(true);
  };

  const handleHealthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPolloForHealth) return;
    try {
      await addHealth({
        polloId: selectedPolloForHealth.id,
        polloIdentificador: selectedPolloForHealth.identificador,
        lote: selectedPolloForHealth.lote,
        fecha: new Date().toISOString(),
        tipoRegistro: healthForm.tipoRegistro,
        sintomas: [],
        diagnostico: healthForm.diagnostico,
        tratamiento: healthForm.tratamiento,
        medicamento: healthForm.medicamento,
        dosis: healthForm.dosis,
        veterinario: healthForm.veterinario,
        proximaRevision: healthForm.proximaRevision,
        observaciones: healthForm.observaciones,
      });
      toast({ title: "Registro creado", description: "Registro de salud agregado" });
      setIsHealthDialogOpen(false);
      await fetchHealths();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo crear el registro", variant: "destructive" });
    }
  };

  const getLoteNameById = (id: string) => {
    const lote = lotesData.find((l) => l.id === id);
    return lote ? lote.id : id;
  };

  const resetForm = () => {
    setFormData({
      identificador: "",
      lote: loteId || "",
      raza: "",
      fechaNacimiento: "",
      pesoActual: "",
      estado: "sano",
      observaciones: "",
    });
    setEditingPollo(null);
  };

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
        toast({ title: "Pollo actualizado", description: "Datos actualizados exitosamente" });
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
        toast({ title: "Pollo registrado", description: "Nuevo pollo agregado" });
      }
      setIsDialogOpen(false);
      resetForm();
      await fetchPollos();
    } catch (error) {
      toast({ title: "Error", description: "Ocurrió un error al guardar", variant: "destructive" });
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
    toast({ title: "Pollo eliminado", description: "Registro eliminado", variant: "destructive" });
    await fetchPollos();
  };

  const handleQuickStatusChange = async (id: string, newStatus: Health) => {
    await updatePollo(id, {
      estado: newStatus,
      ultimaRevision: new Date().toISOString().split("T")[0],
      ...(newStatus === "muerto" ? { pesoActual: 0 } : {}),
    });
    toast({ title: "Estado actualizado", description: `Pollo marcado como ${newStatus}` });
    await fetchPollos();
  };

  const getEstadoBadge = (estado: string) => {
    const config = {
      sano: { variant: "default" as const, icon: Heart, color: "text-success" },
      enfermo: { variant: "secondary" as const, icon: AlertTriangle, color: "text-warning" },
      muerto: { variant: "destructive" as const, icon: Skull, color: "text-destructive" },
    };
    return config[estado as keyof typeof config] || config.sano;
  };

  const getEdadEnSemanas = (fechaNacimiento: string) => {
    const nacimiento = new Date(fechaNacimiento);
    const ahora = new Date();
    const diferencia = ahora.getTime() - nacimiento.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24 * 7));
  };

  const loteInfo = loteId ? lotesData.find((l) => l.id === loteId) : null;

  if (loadingPollos)
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">Cargando pollos...</div>
    );

  if (errorPollos)
    return (
      <div className="flex justify-center items-center h-screen text-destructive">{errorPollos}</div>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{loteInfo ? loteInfo.nombre : "Lote"}</h1>
          {loteInfo && <p className="text-sm text-muted-foreground">Raza: {loteInfo.raza} • Iniciado: {new Date(loteInfo.fechaInicio).toLocaleDateString()}</p>}
        </div>
        <div>
          <Button className="bg-green-500 text-white" variant="ghost" size="sm" onClick={() => navigate(-1)}>Volver</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pollos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredPollos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sanos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{filteredPollos.filter((p) => p.estado === "sano").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enfermos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{filteredPollos.filter((p) => p.estado === "enfermo").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Muertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{filteredPollos.filter((p) => p.estado === "muerto").length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Input
                    placeholder="Buscar por identificador o lote..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-2"
                  />
                </div>
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
                    <TableHead>Último Registro</TableHead>
                    <TableHead>Diagnóstico</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPollos.map((pollo) => {
                    const estadoConfig = getEstadoBadge(pollo.estado);
                    const IconComponent = estadoConfig.icon;

                    return (
                      <TableRow key={pollo.id}>
                        <TableCell className="font-medium">{pollo.identificador}</TableCell>
                        <TableCell>{pollo.lote}</TableCell>
                        <TableCell>{pollo.raza}</TableCell>
                        <TableCell>{getEdadEnSemanas(pollo.fechaNacimiento)} sem</TableCell>
                        <TableCell>{pollo.estado === "muerto" ? "-" : `${pollo.pesoActual}kg`}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="p-0">
                            <IconComponent className="h-4 w-4 inline-block mr-1" />
                            <span className="align-middle">{pollo.estado}</span>
                          </Button>
                        </TableCell>
                          <TableCell>{new Date(pollo.ultimaRevision).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {(() => {
                              const latest = latestHealthByPollo[pollo.id] || latestHealthByPollo[pollo.identificador];
                              return latest ? new Date(latest.fecha).toLocaleDateString() : "-";
                            })()}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const latest = latestHealthByPollo[pollo.id] || latestHealthByPollo[pollo.identificador];
                              return latest ? latest.diagnostico || latest.tipoRegistro : "-";
                            })()}
                          </TableCell>
                        <TableCell>
                            <div className="flex gap-1 items-center">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(pollo)} className="h-7 w-7 p-0">
                              <Edit className="h-3 w-3" />
                            </Button>
                              <Button variant="outline" size="sm" onClick={() => openHealthDialog(pollo)} className="h-7 w-7 p-0" title="Nuevo registro de salud">
                                <Stethoscope className="h-3 w-3" />
                              </Button>
                            {pollo.estado === "sano" && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => handleQuickStatusChange(pollo.id, "enfermo" as Health)} className="h-7 px-2 text-warning hover:text-warning" title="Marcar como enfermo">
                                  <AlertTriangle className="h-3 w-3" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleQuickStatusChange(pollo.id, "muerto" as Health)} className="h-7 px-2 text-destructive hover:text-destructive" title="Marcar como muerto">
                                  <Skull className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            <Button variant="outline" size="sm" onClick={() => handleDelete(pollo.id)} className="h-7 w-7 p-0 text-destructive hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog for create/edit */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              {editingPollo ? "Editar Pollo" : "Registrar Pollo"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingPollo ? "Editar Pollo" : "Registrar Nuevo Pollo"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identificador">Identificador</Label>
                  <Input
                    id="identificador"
                    value={formData.identificador}
                    onChange={(e) => setFormData({ ...formData, identificador: e.target.value })}
                    placeholder="A001, B002, etc."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lote">Lote</Label>
                  {loteId ? (
                    <Input value={loteInfo ? loteInfo.nombre : loteId} readOnly />
                  ) : (
                    <Select value={formData.lote} onValueChange={(value) => setFormData({ ...formData, lote: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar lote" />
                      </SelectTrigger>
                      <SelectContent>
                        {lotesData.map((lote) => (
                          <SelectItem key={lote.id} value={lote.id}>
                            {lote.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="raza">Raza</Label>
                  <Select value={formData.raza} onValueChange={(value) => setFormData({ ...formData, raza: value })}>
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
                  <Input id="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pesoActual">Peso Actual (kg)</Label>
                  <Input id="pesoActual" type="number" step="0.01" value={formData.pesoActual} onChange={(e) => setFormData({ ...formData, pesoActual: e.target.value })} placeholder="1.25" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
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
                <Input id="observaciones" value={formData.observaciones} onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} placeholder="Notas médicas, comportamiento, etc." />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingPollo ? "Actualizar" : "Registrar"} Pollo</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        {/* Dialog para crear registro de salud por pollo */}
        <Dialog open={isHealthDialogOpen} onOpenChange={setIsHealthDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Registro de Salud - {selectedPolloForHealth?.identificador || ""}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleHealthSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnostico">Diagnóstico</Label>
                  <Textarea id="diagnostico" value={healthForm.diagnostico} onChange={(e) => setHealthForm({ ...healthForm, diagnostico: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="veterinario">Veterinario</Label>
                  <Input id="veterinario" value={healthForm.veterinario} onChange={(e) => setHealthForm({ ...healthForm, veterinario: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tratamiento">Tratamiento</Label>
                  <Input id="tratamiento" value={healthForm.tratamiento} onChange={(e) => setHealthForm({ ...healthForm, tratamiento: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicamento">Medicamento</Label>
                  <Input id="medicamento" value={healthForm.medicamento} onChange={(e) => setHealthForm({ ...healthForm, medicamento: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dosis">Dosis</Label>
                  <Input id="dosis" value={healthForm.dosis} onChange={(e) => setHealthForm({ ...healthForm, dosis: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proximaRevision">Próxima Revisión</Label>
                  <Input id="proximaRevision" type="date" value={healthForm.proximaRevision} onChange={(e) => setHealthForm({ ...healthForm, proximaRevision: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea id="observaciones" value={healthForm.observaciones} onChange={(e) => setHealthForm({ ...healthForm, observaciones: e.target.value })} rows={3} />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsHealthDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">Guardar Registro</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LoteDetail;

