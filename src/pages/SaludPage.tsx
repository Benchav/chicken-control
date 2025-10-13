import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Stethoscope,
  Pill,
  Activity,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { RegistroSalud } from "@/models/healthRegister.model";
import { registrosData } from "@/data/healthRegister.data";
import { RecordType } from "@/models/recordType.model";
import { sintomasComunes } from "@/data/commonSymptoms.data";
import { medicamentosComunes } from "@/data/commonMedications.data";
import { estadisticasData } from "@/data/healthStatistics.data";
import { lotesData } from "@/data/lotes.data";

// interface RegistroSalud {
//   id: string
//   polloId: string
//   polloIdentificador: string
//   lote: string
//   fecha: string
//   tipoRegistro: "revision" | "enfermedad" | "tratamiento" | "vacunacion"
//   sintomas: string[]
//   diagnostico: string
//   tratamiento: string
//   medicamento: string
//   dosis: string
//   veterinario: string
//   proximaRevision?: string
//   observaciones: string
// }

// interface EstadisticaSalud {
//   fecha: string
//   sanos: number
//   enfermos: number
//   recuperados: number
//   muertos: number
// }

// const mockRegistros: RegistroSalud[] = [
//   {
//     id: "1",
//     polloId: "2",
//     polloIdentificador: "A002",
//     lote: "Lote A - Ene 2024",
//     fecha: "2024-02-20",
//     tipoRegistro: "enfermedad",
//     sintomas: ["Respiración dificultosa", "Secreción nasal", "Letargo"],
//     diagnostico: "Infección respiratoria leve",
//     tratamiento: "Antibiótico oral + aislamiento",
//     medicamento: "Enrofloxacina",
//     dosis: "10mg/kg durante 5 días",
//     veterinario: "Dr. María González",
//     proximaRevision: "2024-02-25",
//     observaciones: "Mejoría notable después de 2 días de tratamiento"
//   },
//   {
//     id: "2",
//     polloId: "1",
//     polloIdentificador: "A001",
//     lote: "Lote A - Ene 2024",
//     fecha: "2024-02-18",
//     tipoRegistro: "revision",
//     sintomas: [],
//     diagnostico: "Estado de salud normal",
//     tratamiento: "Ninguno",
//     medicamento: "",
//     dosis: "",
//     veterinario: "Dr. Carlos Ruiz",
//     observaciones: "Desarrollo dentro de parámetros normales"
//   },
//   {
//     id: "3",
//     polloId: "3",
//     polloIdentificador: "B001",
//     lote: "Lote B - Dic 2023",
//     fecha: "2024-02-19",
//     tipoRegistro: "vacunacion",
//     sintomas: [],
//     diagnostico: "Vacunación preventiva",
//     tratamiento: "Vacuna Newcastle",
//     medicamento: "Vacuna Newcastle La Sota",
//     dosis: "0.5ml vía ocular",
//     veterinario: "Dr. María González",
//     observaciones: "Vacunación de refuerzo completada sin complicaciones"
//   }
// ]

// const mockEstadisticas: EstadisticaSalud[] = [
//   { fecha: "2024-02-15", sanos: 2820, enfermos: 15, recuperados: 8, muertos: 2 },
//   { fecha: "2024-02-16", sanos: 2815, enfermos: 18, recuperados: 12, muertos: 3 },
//   { fecha: "2024-02-17", sanos: 2810, enfermos: 22, recuperados: 15, muertos: 3 },
//   { fecha: "2024-02-18", sanos: 2805, enfermos: 25, recuperados: 18, muertos: 4 },
//   { fecha: "2024-02-19", sanos: 2800, enfermos: 28, recuperados: 22, muertos: 5 },
//   { fecha: "2024-02-20", sanos: 2760, enfermos: 62, recuperados: 25, muertos: 3 }
// ]

// const sintomasComunes = [
//   "Respiración dificultosa",
//   "Secreción nasal",
//   "Letargo",
//   "Pérdida de apetito",
//   "Diarrea",
//   "Cojera",
//   "Plumas erizadas",
//   "Ojos cerrados",
//   "Temblores",
//   "Convulsiones"
// ]

// const medicamentosComunes = [
//   "Enrofloxacina",
//   "Amoxicilina",
//   "Tetraciclina",
//   "Sulfametoxazol",
//   "Vacuna Newcastle",
//   "Vacuna Gumboro",
//   "Vitamina complejo B",
//   "Electrolitos"
// ]

export default function SaludPage() {
  const [registros, setRegistros] = useState<RegistroSalud[]>(registrosData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("registros");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    polloIdentificador: "",
    lote: "",
    tipoRegistro: "revision",
    sintomas: [] as string[],
    diagnostico: "",
    tratamiento: "",
    medicamento: "",
    dosis: "",
    veterinario: "",
    proximaRevision: "",
    observaciones: "",
  });

  const resetForm = () => {
    setFormData({
      polloIdentificador: "",
      lote: "",
      tipoRegistro: "revision",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRegistro: RegistroSalud = {
      id: Date.now().toString(),
      polloId: "auto", // En un sistema real, esto se obtendría del identificador
      polloIdentificador: formData.polloIdentificador,
      lote: formData.lote,
      fecha: new Date().toISOString().split("T")[0],
      tipoRegistro: formData.tipoRegistro as any,
      sintomas: formData.sintomas,
      diagnostico: formData.diagnostico,
      tratamiento: formData.tratamiento,
      medicamento: formData.medicamento,
      dosis: formData.dosis,
      veterinario: formData.veterinario,
      proximaRevision: formData.proximaRevision || undefined,
      observaciones: formData.observaciones,
    };

    setRegistros([newRegistro, ...registros]);
    setIsDialogOpen(false);
    resetForm();

    toast({
      title: "Registro de salud creado",
      description: "El registro médico ha sido guardado exitosamente",
    });
  };

  const handleSintomaToggle = (sintoma: string) => {
    setFormData((prev) => ({
      ...prev,
      sintomas: prev.sintomas.includes(sintoma)
        ? prev.sintomas.filter((s) => s !== sintoma)
        : [...prev.sintomas, sintoma],
    }));
  };

  const getTipoRegistroBadge = (tipo: string) => {
    const config = {
      revision: { variant: "default" as const, icon: Stethoscope },
      enfermedad: { variant: "destructive" as const, icon: AlertTriangle },
      tratamiento: { variant: "secondary" as const, icon: Pill },
      vacunacion: { variant: "outline" as const, icon: Activity },
    };
    return config[tipo as keyof typeof config] || config.revision;
  };

  const estadisticasResumen = {
    totalRegistros: registros.length,
    enfermedadesActivas: registros.filter(
      (r) => r.tipoRegistro === RecordType.SICK
    ).length,
    tratamientosEnCurso: registros.filter(
      (r) => r.proximaRevision && new Date(r.proximaRevision) > new Date()
    ).length,
    vacunacionesRecientes: registros.filter(
      (r) =>
        r.tipoRegistro === RecordType.VACCINATION &&
        new Date(r.fecha) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Monitoreo de Salud
          </h1>
          <p className="text-muted-foreground">
            Registro médico y seguimiento sanitario de todos los pollos
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Registro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Registro de Salud</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="polloIdentificador">
                    Identificador del Pollo
                  </Label>
                  <Input
                    id="polloIdentificador"
                    value={formData.polloIdentificador}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        polloIdentificador: e.target.value,
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
                      {lotesData.map((lote) => (
                        <SelectItem value={lote.id}>
                          {`${lote.nombre} - ${lote.fechaInicio}`}
                        </SelectItem>
                      ))}
                      {/* <SelectItem value="Lote B - Dic 2023">Lote B - Dic 2023</SelectItem>
                      <SelectItem value="Lote C - Ene 2024">Lote C - Ene 2024</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoRegistro">Tipo de Registro</Label>
                  <Select
                    value={formData.tipoRegistro}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tipoRegistro: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={RecordType.REVISION}>
                        Revisión Rutinaria
                      </SelectItem>
                      <SelectItem value={RecordType.SICK}>Enfermedad</SelectItem>
                      <SelectItem value={RecordType.TREATMENT}>Tratamiento</SelectItem>
                      <SelectItem value={RecordType.VACCINATION}>Vacunación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="veterinario">Veterinario</Label>
                  <Input
                    id="veterinario"
                    value={formData.veterinario}
                    onChange={(e) =>
                      setFormData({ ...formData, veterinario: e.target.value })
                    }
                    placeholder="Nombre del veterinario"
                    required
                  />
                </div>
              </div>

              {formData.tipoRegistro === RecordType.SICK && (
                <div className="space-y-2">
                  <Label>Síntomas Observados</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {sintomasComunes.map((sintoma) => (
                      <div
                        key={sintoma}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={sintoma}
                          checked={formData.sintomas.includes(sintoma)}
                          onChange={() => handleSintomaToggle(sintoma)}
                          className="w-4 h-4"
                        />
                        <Label htmlFor={sintoma} className="text-sm">
                          {sintoma}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="diagnostico">Diagnóstico</Label>
                <Input
                  id="diagnostico"
                  value={formData.diagnostico}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnostico: e.target.value })
                  }
                  placeholder="Diagnóstico médico"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tratamiento">Tratamiento</Label>
                <Input
                  id="tratamiento"
                  value={formData.tratamiento}
                  onChange={(e) =>
                    setFormData({ ...formData, tratamiento: e.target.value })
                  }
                  placeholder="Descripción del tratamiento"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medicamento">Medicamento</Label>
                  <Select
                    value={formData.medicamento}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicamento: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar medicamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicamentosComunes.map((med) => (
                        <SelectItem key={med} value={med}>
                          {med}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosis">Dosis</Label>
                  <Input
                    id="dosis"
                    value={formData.dosis}
                    onChange={(e) =>
                      setFormData({ ...formData, dosis: e.target.value })
                    }
                    placeholder="10mg/kg por 5 días"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proximaRevision">Próxima Revisión</Label>
                <Input
                  id="proximaRevision"
                  type="date"
                  value={formData.proximaRevision}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      proximaRevision: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                  placeholder="Observaciones adicionales del veterinario..."
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
                <Button type="submit">Guardar Registro</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registros
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estadisticasResumen.totalRegistros}
            </div>
            <p className="text-xs text-muted-foreground">Registros médicos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Enfermedades Activas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {estadisticasResumen.enfermedadesActivas}
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tratamientos en Curso
            </CardTitle>
            <Pill className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {estadisticasResumen.tratamientosEnCurso}
            </div>
            <p className="text-xs text-muted-foreground">Con seguimiento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vacunaciones Recientes
            </CardTitle>
            <Stethoscope className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {estadisticasResumen.vacunacionesRecientes}
            </div>
            <p className="text-xs text-muted-foreground">Última semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="flex flex-row md:grid md:grid-cols-3 justify-around overflow-x-auto">
          <TabsTrigger value="registros">Registros Médicos</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="alertas">Alertas de Salud</TabsTrigger>
        </TabsList>

        <TabsContent value="registros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros Médicos Recientes</CardTitle>
            </CardHeader>
            <CardContent>
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
                    {registros.map((registro) => {
                      const tipoConfig = getTipoRegistroBadge(
                        registro.tipoRegistro
                      );
                      const IconComponent = tipoConfig.icon;

                      return (
                        <TableRow key={registro.id}>
                          <TableCell>
                            {new Date(registro.fecha).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="font-medium">
                            {registro.polloIdentificador}
                          </TableCell>
                          <TableCell>{registro.lote}</TableCell>
                          <TableCell>
                            <Badge
                              variant={tipoConfig.variant}
                              className="gap-1"
                            >
                              <IconComponent className="h-3 w-3" />
                              {registro.tipoRegistro}
                            </Badge>
                          </TableCell>
                          <TableCell>{registro.diagnostico}</TableCell>
                          <TableCell>{registro.veterinario}</TableCell>
                          <TableCell>
                            {registro.proximaRevision
                              ? new Date(
                                  registro.proximaRevision
                                ).toLocaleDateString()
                              : "-"}
                          </TableCell>
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
                <CardTitle>Tendencia de Salud (Última Semana)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={estadisticasData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="fecha"
                        className="text-muted-foreground"
                        fontSize={12}
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString()
                        }
                      />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sanos"
                        stroke="hsl(var(--success))"
                        strokeWidth={2}
                        name="Sanos"
                      />
                      <Line
                        type="monotone"
                        dataKey="enfermos"
                        stroke="hsl(var(--destructive))"
                        strokeWidth={2}
                        name="Enfermos"
                      />
                      <Line
                        type="monotone"
                        dataKey="recuperados"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Recuperados"
                      />
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
                    <BarChart
                      data={[
                        {
                          tipo: "Revisiones",
                          cantidad: registros.filter(
                            (r) => r.tipoRegistro === RecordType.REVISION
                          ).length,
                        },
                        {
                          tipo: "Enfermedades",
                          cantidad: registros.filter(
                            (r) => r.tipoRegistro === RecordType.SICK
                          ).length,
                        },
                        {
                          tipo: "Tratamientos",
                          cantidad: registros.filter(
                            (r) => r.tipoRegistro === RecordType.TREATMENT
                          ).length,
                        },
                        {
                          tipo: "Vacunaciones",
                          cantidad: registros.filter(
                            (r) => r.tipoRegistro === RecordType.VACCINATION
                          ).length,
                        },
                      ]}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="tipo"
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
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
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alerta Crítica de Salud
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <strong>Incremento en enfermedades respiratorias</strong> - Se
                  ha detectado un aumento del 40% en casos de enfermedades
                  respiratorias en el Lote A en los últimos 3 días. Se
                  recomienda revisión veterinaria inmediata y posible
                  aislamiento preventivo.
                </p>
                <div className="mt-4">
                  <Button variant="destructive" size="sm">
                    Atender Alerta
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-warning/50 bg-warning/5">
              <CardHeader>
                <CardTitle className="text-warning flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recordatorio de Vacunación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <strong>Vacunación programada</strong> - El Lote C requiere
                  vacunación de refuerzo contra Newcastle en los próximos 2 días
                  según el calendario sanitario establecido.
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    Programar Vacunación
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Mejora en Indicadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  <strong>Recuperación exitosa</strong> - El 85% de los pollos
                  tratados por problemas respiratorios en la semana pasada han
                  mostrado recuperación completa. Continuar con protocolo
                  establecido.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
