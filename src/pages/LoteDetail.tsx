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
import {
  AlertTriangle,
  Heart,
  Plus,
  Skull,
  Edit,
  Trash2,
  Stethoscope,
} from "lucide-react";
import { Pill, Activity, Calendar, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { sintomasComunes } from "@/data/commonSymptoms.data";
import { medicamentosComunes } from "@/data/commonMedications.data";
import { useHealthContext } from "@/contexts/HealthContext";
import { RecordType } from "@/models/recordType.model";
import { RegistroSalud } from "@/models/healthRegister.model";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

  const { healths, loadingHealths, errorHealths, fetchHealths, addHealth } =
    useHealthContext();

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
  const [selectedPolloForHealth, setSelectedPolloForHealth] =
    useState<Pollo | null>(null);
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
    if (loteId)
      list = list.filter(
        (p) => p.lote === loteId || p.lote === getLoteNameById(loteId)
      );
    if (searchTerm) {
      list = list.filter(
        (p) =>
          p.identificador.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.lote.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedEstado !== "Todos")
      list = list.filter((p) => p.estado === selectedEstado);
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
      toast({
        title: "Registro creado",
        description: "Registro de salud agregado",
      });
      setIsHealthDialogOpen(false);
      await fetchHealths();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el registro",
        variant: "destructive",
      });
    }
  };

  const getLoteNameById = (id: string) => {
    const lote = lotesData.find((l) => l.id === id);
    return lote ? lote.nombre : id;
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
      await fetchPollos();
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
      sano: { variant: "default" as const, icon: Heart, color: "text-white" },
      enfermo: {
        variant: "secondary" as const,
        icon: AlertTriangle,
        color: "text-warning",
      },
      muerto: {
        variant: "destructive" as const,
        icon: Skull,
        color: "text-white",
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

  const loteInfo = loteId ? lotesData.find((l) => l.id === loteId) : null;

  // calcular sanos a partir del total del lote menos enfermos y muertos
  const enfermosCount = filteredPollos.filter(
    (p) => p.estado === "enfermo"
  ).length;
  const muertosCount = filteredPollos.filter(
    (p) => p.estado === "muerto"
  ).length;
  const loteTotal =
    loteInfo?.cantidadActual ??
    loteInfo?.cantidadInicial ??
    filteredPollos.length;
  const sanosCount = Math.max(0, loteTotal - enfermosCount - muertosCount);

  // Health records filtered to this lote
  const healthsForLote = useMemo(() => {
    if (!loteInfo) return healths.filter((h) => h.lote === loteId || h.lote === loteId);
    return healths.filter((h) => h.lote === loteInfo.id || h.lote === loteInfo.nombre || h.lote === loteId);
  }, [healths, loteInfo, loteId]);

  // General health dialog (create registro not tied to a specific pollo)
  const [isGeneralHealthDialogOpen, setIsGeneralHealthDialogOpen] = useState(false);
  const [generalHealthForm, setGeneralHealthForm] = useState({
    polloIdentificador: "",
    lote: loteInfo ? loteInfo.id : loteId || "",
    tipoRegistro: RecordType.REVISION as RecordType,
    sintomas: [] as string[],
    diagnostico: "",
    tratamiento: "",
    medicamento: "",
    dosis: "",
    veterinario: "",
    proximaRevision: "",
    observaciones: "",
  });

  const resetGeneralForm = () => {
    setGeneralHealthForm({
      polloIdentificador: "",
      lote: loteInfo ? loteInfo.id : loteId || "",
      tipoRegistro: RecordType.REVISION,
      sintomas: [],
      diagnostico: "",
      tratamiento: "",
      medicamento: "",
      dosis: "",
      veterinario: "",
      proximaRevision: "",
      observaciones: "",
    });
  };

  const handleGeneralHealthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addHealth({
        polloId: generalHealthForm.polloIdentificador || "auto",
        polloIdentificador: generalHealthForm.polloIdentificador || "",
        lote: generalHealthForm.lote,
        fecha: new Date().toISOString(),
        tipoRegistro: generalHealthForm.tipoRegistro,
        sintomas: generalHealthForm.sintomas,
        diagnostico: generalHealthForm.diagnostico,
        tratamiento: generalHealthForm.tratamiento,
        medicamento: generalHealthForm.medicamento,
        dosis: generalHealthForm.dosis,
        veterinario: generalHealthForm.veterinario,
        proximaRevision: generalHealthForm.proximaRevision,
        observaciones: generalHealthForm.observaciones,
      });
      toast({ title: "Registro creado", description: "Registro de salud agregado" });
      setIsGeneralHealthDialogOpen(false);
      resetGeneralForm();
      await fetchHealths();
    } catch (error) {
      toast({ title: "Error", description: "No se pudo crear el registro", variant: "destructive" });
    }
  };

  // Stats and chart data for this lote
  const estadisticasResumenLote = useMemo(() => {
    const totalRegistros = healthsForLote.length;
    const enfermedadesActivas = healthsForLote.filter((r) => r.tipoRegistro === RecordType.SICK).length;
    const tratamientosEnCurso = healthsForLote.filter((r) => r.proximaRevision && new Date(r.proximaRevision) > new Date()).length;
    const vacunacionesRecientes = healthsForLote.filter((r) => r.tipoRegistro === RecordType.VACCINATION && new Date(r.fecha) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
    return { totalRegistros, enfermedadesActivas, tratamientosEnCurso, vacunacionesRecientes };
  }, [healthsForLote]);

  const chartDataByTipo = useMemo(() => [
    { tipo: "Revisiones", cantidad: healthsForLote.filter((r) => r.tipoRegistro === RecordType.REVISION).length },
    { tipo: "Enfermedades", cantidad: healthsForLote.filter((r) => r.tipoRegistro === RecordType.SICK).length },
    { tipo: "Tratamientos", cantidad: healthsForLote.filter((r) => r.tipoRegistro === RecordType.TREATMENT).length },
    { tipo: "Vacunaciones", cantidad: healthsForLote.filter((r) => r.tipoRegistro === RecordType.VACCINATION).length },
  ], [healthsForLote]);

  const chartDataByDate = useMemo(() => {
    const days: Record<string, { fecha: string; registros: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days[key] = { fecha: key, registros: 0 };
    }
    healthsForLote.forEach((h) => {
      const key = new Date(h.fecha).toISOString().split("T")[0];
      if (days[key]) days[key].registros += 1;
    });
    return Object.values(days);
  }, [healthsForLote]);

  if (loadingPollos)
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Cargando pollos...
      </div>
    );

  if (errorPollos)
    return (
      <div className="flex justify-center items-center h-screen text-destructive">
        {errorPollos}
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {loteInfo ? loteInfo.nombre : "Lote"}
          </h1>
          {loteInfo && (
            <p className="text-sm text-muted-foreground">
              Raza: {loteInfo.raza} • Iniciado:{" "}
              {new Date(loteInfo.fechaInicio).toLocaleDateString()}
            </p>
          )}
        </div>
        <div>
          <Button
            className="bg-green-500 text-white"
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
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
            <div className="text-2xl font-bold text-success">{sanosCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enfermos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {filteredPollos.filter((p) => p.estado === "enfermo").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Muertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {filteredPollos.filter((p) => p.estado === "muerto").length}
            </div>
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
                <Select
                  value={selectedEstado}
                  onValueChange={setSelectedEstado}
                >
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
            <CardTitle className="text-lg">
              Lista de Pollos ({filteredPollos.length})
            </CardTitle>
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
                        <TableCell className="font-medium">
                          {pollo.identificador}
                        </TableCell>
                        <TableCell>{pollo.lote}</TableCell>
                        <TableCell>{pollo.raza}</TableCell>
                        <TableCell>
                          {getEdadEnSemanas(pollo.fechaNacimiento)} sem
                        </TableCell>
                        <TableCell>
                          {pollo.estado === "muerto"
                            ? "-"
                            : `${pollo.pesoActual}kg`}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const {
                              variant,
                              icon: Icon,
                              color,
                            } = getEstadoBadge(pollo.estado);
                            return (
                              <Button
                                size="sm"
                                variant={variant}
                                className={`p-0 px-2 flex items-center gap-1 ${color}`}
                              >
                                <Icon className="h-4 w-4" />
                                <span className="capitalize">
                                  {pollo.estado}
                                </span>
                              </Button>
                            );
                          })()}
                        </TableCell>

                        <TableCell>
                          {new Date(pollo.ultimaRevision).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const latest =
                              latestHealthByPollo[pollo.id] ||
                              latestHealthByPollo[pollo.identificador];
                            return latest
                              ? new Date(latest.fecha).toLocaleDateString()
                              : "-";
                          })()}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const latest =
                              latestHealthByPollo[pollo.id] ||
                              latestHealthByPollo[pollo.identificador];
                            return latest
                              ? latest.diagnostico || latest.tipoRegistro
                              : "-";
                          })()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 items-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(pollo)}
                              className="h-7 w-7 p-0"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openHealthDialog(pollo)}
                              className="h-7 w-7 p-0"
                              title="Nuevo registro de salud"
                            >
                              <Stethoscope className="h-3 w-3" />
                            </Button>
                            {pollo.estado === "sano" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuickStatusChange(
                                      pollo.id,
                                      "enfermo" as Health
                                    )
                                  }
                                  className="h-7 px-2 text-warning hover:text-warning"
                                  title="Marcar como enfermo"
                                >
                                  <AlertTriangle className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuickStatusChange(
                                      pollo.id,
                                      "muerto" as Health
                                    )
                                  }
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
                  {loteId ? (
                    <Input
                      value={loteInfo ? loteInfo.nombre : loteId}
                      readOnly
                    />
                  ) : (
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
        {/* Dialog para crear registro de salud por pollo */}
        <Dialog open={isHealthDialogOpen} onOpenChange={setIsHealthDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Crear Registro de Salud -{" "}
                {selectedPolloForHealth?.identificador || ""}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleHealthSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="diagnostico">Diagnóstico</Label>
                  <Textarea
                    id="diagnostico"
                    value={healthForm.diagnostico}
                    onChange={(e) =>
                      setHealthForm({
                        ...healthForm,
                        diagnostico: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="veterinario">Veterinario</Label>
                  <Input
                    id="veterinario"
                    value={healthForm.veterinario}
                    onChange={(e) =>
                      setHealthForm({
                        ...healthForm,
                        veterinario: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tratamiento">Tratamiento</Label>
                  <Input
                    id="tratamiento"
                    value={healthForm.tratamiento}
                    onChange={(e) =>
                      setHealthForm({
                        ...healthForm,
                        tratamiento: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicamento">Medicamento</Label>
                  <Input
                    id="medicamento"
                    value={healthForm.medicamento}
                    onChange={(e) =>
                      setHealthForm({
                        ...healthForm,
                        medicamento: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dosis">Dosis</Label>
                  <Input
                    id="dosis"
                    value={healthForm.dosis}
                    onChange={(e) =>
                      setHealthForm({ ...healthForm, dosis: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proximaRevision">Próxima Revisión</Label>
                  <Input
                    id="proximaRevision"
                    type="date"
                    value={healthForm.proximaRevision}
                    onChange={(e) =>
                      setHealthForm({
                        ...healthForm,
                        proximaRevision: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={healthForm.observaciones}
                  onChange={(e) =>
                    setHealthForm({
                      ...healthForm,
                      observaciones: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsHealthDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Guardar Registro</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Salud: Registros, Estadísticas y Alertas (específico por lote) */}
      <Tabs value="registros">
        <TabsList className="flex flex-row md:grid md:grid-cols-3 justify-around overflow-x-auto">
          <TabsTrigger value="registros">Registros Médicos</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="alertas">Alertas de Salud</TabsTrigger>
        </TabsList>

        <TabsContent value="registros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros Médicos de {loteInfo?.nombre || 'Lote'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-2">
                <Dialog open={isGeneralHealthDialogOpen} onOpenChange={setIsGeneralHealthDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Nuevo Registro
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Crear Registro de Salud</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleGeneralHealthSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="polloIdentificador">Identificador del Pollo</Label>
                          <Input id="polloIdentificador" value={generalHealthForm.polloIdentificador} onChange={(e) => setGeneralHealthForm({ ...generalHealthForm, polloIdentificador: e.target.value })} placeholder="A001, B002" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lote">Lote</Label>
                          <Select value={generalHealthForm.lote} onValueChange={(v) => setGeneralHealthForm({ ...generalHealthForm, lote: v })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {lotesData.map((l) => (
                                <SelectItem key={l.id} value={l.id}>{l.nombre}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tipoRegistro">Tipo de Registro</Label>
                          <Select value={generalHealthForm.tipoRegistro} onValueChange={(v) => setGeneralHealthForm({ ...generalHealthForm, tipoRegistro: v as RecordType })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value={RecordType.REVISION}>Revisión Rutinaria</SelectItem>
                              <SelectItem value={RecordType.SICK}>Enfermedad</SelectItem>
                              <SelectItem value={RecordType.TREATMENT}>Tratamiento</SelectItem>
                              <SelectItem value={RecordType.VACCINATION}>Vacunación</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="veterinario">Veterinario</Label>
                          <Input id="veterinario" value={generalHealthForm.veterinario} onChange={(e) => setGeneralHealthForm({ ...generalHealthForm, veterinario: e.target.value })} />
                        </div>
                      </div>

                      {generalHealthForm.tipoRegistro === RecordType.SICK && (
                        <div className="space-y-2">
                          <Label>Síntomas Observados</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {sintomasComunes.map((sintoma) => (
                              <div key={sintoma} className="flex items-center space-x-2">
                                <input type="checkbox" id={sintoma} checked={generalHealthForm.sintomas.includes(sintoma)} onChange={() => setGeneralHealthForm((prev) => ({ ...prev, sintomas: prev.sintomas.includes(sintoma) ? prev.sintomas.filter(s => s !== sintoma) : [...prev.sintomas, sintoma] }))} className="w-4 h-4" />
                                <Label htmlFor={sintoma} className="text-sm">{sintoma}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="diagnostico">Diagnóstico</Label>
                        <Input id="diagnostico" value={generalHealthForm.diagnostico} onChange={(e) => setGeneralHealthForm({ ...generalHealthForm, diagnostico: e.target.value })} required />
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={() => setIsGeneralHealthDialogOpen(false)}>Cancelar</Button>
                        <Button type="submit">Guardar Registro</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Pollo</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Diagnóstico</TableHead>
                      <TableHead>Veterinario</TableHead>
                      <TableHead>Próxima Revisión</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthsForLote.map((registro) => {
                      return (
                        <TableRow key={registro.id}>
                          <TableCell>{new Date(registro.fecha).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{registro.polloIdentificador}</TableCell>
                          <TableCell>{registro.lote}</TableCell>
                          <TableCell>{registro.tipoRegistro}</TableCell>
                          <TableCell>{registro.diagnostico}</TableCell>
                          <TableCell>{registro.veterinario}</TableCell>
                          <TableCell>{registro.proximaRevision ? new Date(registro.proximaRevision).toLocaleDateString() : '-'}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Salud (Última Semana) - {loteInfo?.nombre || 'Lote'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartDataByDate}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="fecha" className="text-muted-foreground" fontSize={12} tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                      <Line type="monotone" dataKey="registros" stroke="hsl(var(--primary))" strokeWidth={2} name="Registros" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Registros por Tipo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartDataByTipo}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="tipo" className="text-muted-foreground" fontSize={12} />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                      <Bar dataKey="cantidad" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <div className="grid gap-4">
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Alerta Crítica de Salud</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm"><strong>Incremento en enfermedades respiratorias</strong> - Se ha detectado un aumento de casos en este lote en los últimos días. Revisar protocolos.</p>
                <div className="mt-4"><Button variant="destructive" size="sm">Atender Alerta</Button></div>
              </CardContent>
            </Card>

            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="text-warning flex items-center gap-2"><Calendar className="h-5 w-5" />Recordatorio de Vacunación</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm"><strong>Vacunación programada</strong> - Revisa el calendario sanitario para este lote.</p>
                <div className="mt-4"><Button variant="outline" size="sm">Programar Vacunación</Button></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoteDetail;
