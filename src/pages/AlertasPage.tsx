import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  AlertTriangle,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  Zap,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertCard } from "@/components/dashboard/AlertCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Alerta } from "@/models/alert.model";
import { alertasData } from "@/data/alert.data";
import { AlertStatus } from "@/models/alertStatus.model";
import { prediccionesData } from "@/data/prediction.data";
import { tendenciaAlertas } from "@/data/trendAlerts.data";
import { useAlertContext } from "@/contexts/AlertContext";
import { AlertType } from "@/models/alertType.model";
import { AlertPriority } from "@/models/alertPriority.model";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLoteContext } from "@/contexts/LoteContext";
import { Label } from "@/components/ui/label";

export default function AlertasPage() {
  const { alerts, updateAlert, addAlert } = useAlertContext();
  const { lotes } = useLoteContext();
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("activa");
  const [selectedTab, setSelectedTab] = useState("alertas");
  const [nuevaAlerta, setNuevaAlerta] = useState({
    titulo: "",
    descripcion: "",
    tipo: "",
    prioridad: "",
    lote: "",
    valorActual: "",
    valorEsperado: "",
    unidad: "",
    fechaVencimiento: "",
  });
  const { toast } = useToast();

  // 🔹 Filtrado de alertas usando los estados del filtro
  const alertasFiltradas = alerts.filter((alerta) => {
    if (filtroTipo !== "todos" && alerta.tipo !== filtroTipo) return false;
    if (filtroPrioridad !== "todos" && alerta.prioridad !== filtroPrioridad)
      return false;
    if (filtroEstado !== "todos" && alerta.estado !== filtroEstado)
      return false;
    return true;
  });

  // 🔹 Resolver alerta (actualiza en el contexto)
  const handleResolverAlerta = async (id: string) => {
    const alerta = alerts.find((a) => a.id === id);
    if (!alerta) return;

    await updateAlert({ ...alerta, estado: AlertStatus.RESOLVED });

    toast({
      title: "Alerta resuelta",
      description: "La alerta ha sido marcada como resuelta",
    });
  };

  // 🔹 Descartar alerta (actualiza en el contexto)
  const handleDescartarAlerta = async (id: string) => {
    const alerta = alerts.find((a) => a.id === id);
    if (!alerta) return;

    await updateAlert({ ...alerta, estado: AlertStatus.DISCARDED });

    toast({
      title: "Alerta descartada",
      description: "La alerta ha sido descartada",
    });
  };

  // 🔹 Colores por prioridad
  const getPrioridadColor = (prioridad: string) => {
    const colors = {
      baja: "text-muted-foreground",
      media: "text-warning",
      alta: "text-destructive",
      critica: "text-white font-bold",
    };
    return colors[prioridad as keyof typeof colors] || colors.baja;
  };

  const handleCrearAlerta = async () => {
    if (
      !nuevaAlerta.titulo ||
      !nuevaAlerta.descripcion ||
      !nuevaAlerta.tipo ||
      !nuevaAlerta.prioridad
    ) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    const alerta: Alerta = {
      id: crypto.randomUUID(),
      titulo: nuevaAlerta.titulo,
      descripcion: nuevaAlerta.descripcion,
      tipo: nuevaAlerta.tipo as AlertType,
      prioridad: nuevaAlerta.prioridad as AlertPriority,
      estado: AlertStatus.ACTIVE,
      fechaCreacion: new Date().toISOString(),
      fechaVencimiento: nuevaAlerta.fechaVencimiento
        ? new Date(nuevaAlerta.fechaVencimiento).toISOString()
        : null,
      lote: nuevaAlerta.lote,
      accionesRecomendadas: [
        "Verificar parámetro",
        "Tomar medidas correctivas",
      ],
      parametros: {
        valorActual: Number(nuevaAlerta.valorActual) || 0,
        valorEsperado: Number(nuevaAlerta.valorEsperado) || 0,
        unidad: nuevaAlerta.unidad,
      },
    };

    await addAlert(alerta);

    toast({
      title: "Alerta creada",
      description: "La nueva alerta fue agregada exitosamente",
    });

    // Limpia formulario
    setNuevaAlerta({
      titulo: "",
      descripcion: "",
      tipo: "",
      prioridad: "",
      lote: "",
      valorActual: "",
      valorEsperado: "",
      unidad: "",
      fechaVencimiento: "",
    });
  };

  // 🔹 Iconos por tipo
  const getTipoIcon = (tipo: string) => {
    const icons = {
      salud: AlertTriangle,
      produccion: TrendingUp,
      mortalidad: XCircle,
      ambiente: Zap,
      alimentacion: Clock,
      mantenimiento: Settings,
    };
    return icons[tipo as keyof typeof icons] || AlertTriangle;
  };

  // 🔹 Estadísticas
  const estadisticas = {
    total: alerts.length,
    activas: alerts.filter((a) => a.estado === AlertStatus.ACTIVE).length,
    criticas: alerts.filter(
      (a) => a.prioridad === "critica" && a.estado === AlertStatus.ACTIVE
    ).length,
    vencidas: alerts.filter(
      (a) =>
        a.fechaVencimiento &&
        new Date(a.fechaVencimiento) < new Date() &&
        a.estado === AlertStatus.ACTIVE
    ).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Predicciones y Alertas
          </h1>
          <p className="text-muted-foreground">
            Sistema inteligente de monitoreo y predicciones para optimizar la
            producción
          </p>
        </div>

        <div className="flex gap-2">
          {/* <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configurar Alertas
          </Button> */}
          <Button className="gap-2">
            <Bell className="h-4 w-4" />
            {estadisticas.activas} Activas
          </Button>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Nueva Alerta
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nueva Alerta</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <Input
              placeholder="Título"
              value={nuevaAlerta.titulo}
              onChange={(e) =>
                setNuevaAlerta({ ...nuevaAlerta, titulo: e.target.value })
              }
            />

            <Input
              placeholder="Descripción"
              value={nuevaAlerta.descripcion}
              onChange={(e) =>
                setNuevaAlerta({ ...nuevaAlerta, descripcion: e.target.value })
              }
            />

            {/* Tipo de Alerta */}
            <Select
              value={nuevaAlerta.tipo}
              onValueChange={(v) =>
                setNuevaAlerta({ ...nuevaAlerta, tipo: v as AlertType })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de alerta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AlertType.HEALTH}>Salud</SelectItem>
                <SelectItem value={AlertType.PRODUCTION}>Producción</SelectItem>
                <SelectItem value={AlertType.MORTALITY}>Mortalidad</SelectItem>
              </SelectContent>
            </Select>

            {/* Prioridad */}
            <Select
              value={nuevaAlerta.prioridad}
              onValueChange={(v) =>
                setNuevaAlerta({
                  ...nuevaAlerta,
                  prioridad: v as AlertPriority,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AlertPriority.LOW}>Baja</SelectItem>
                <SelectItem value={AlertPriority.MEDIUM}>Media</SelectItem>
                <SelectItem value={AlertPriority.HIGH}>Alta</SelectItem>
                <SelectItem value={AlertPriority.CRITICAL}>Crítica</SelectItem>
              </SelectContent>
            </Select>

            {/* Lote */}
            <Select
              value={nuevaAlerta.lote}
              onValueChange={(v) => setNuevaAlerta({ ...nuevaAlerta, lote: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar lote" />
              </SelectTrigger>
              <SelectContent>
                {lotes.map((lote) => (
                  <SelectItem key={lote.id} value={lote.nombre}>
                    {lote.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Valores */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>Valor Actual</Label>
                <Input
                  type="number"
                  value={nuevaAlerta.valorActual}
                  onChange={(e) =>
                    setNuevaAlerta({
                      ...nuevaAlerta,
                      valorActual: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Valor Esperado</Label>
                <Input
                  type="number"
                  value={nuevaAlerta.valorEsperado}
                  onChange={(e) =>
                    setNuevaAlerta({
                      ...nuevaAlerta,
                      valorEsperado: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Unidad</Label>
                <Input
                  placeholder="Ej: °C, kg, %"
                  value={nuevaAlerta.unidad}
                  onChange={(e) =>
                    setNuevaAlerta({ ...nuevaAlerta, unidad: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Fecha de vencimiento */}
            <div>
              <Label>Fecha de vencimiento</Label>
              <Input
                type="date"
                value={nuevaAlerta.fechaVencimiento}
                onChange={(e) =>
                  setNuevaAlerta({
                    ...nuevaAlerta,
                    fechaVencimiento: e.target.value,
                  })
                }
              />
            </div>

            <Button onClick={handleCrearAlerta} className="w-full mt-2">
              Guardar Alerta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Estadísticas Resumen */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alertas</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.total}</div>
            <p className="text-xs text-muted-foreground">En el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas Activas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {estadisticas.activas}
            </div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {estadisticas.criticas}
            </div>
            <p className="text-xs text-muted-foreground">Prioridad máxima</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <Clock className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {estadisticas.vencidas}
            </div>
            <p className="text-xs text-muted-foreground">Sin resolver</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alertas">Alertas Activas</TabsTrigger>
          <TabsTrigger value="predicciones">Predicciones IA</TabsTrigger>
          <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="alertas" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="sm:w-48">
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los tipos</SelectItem>
                      <SelectItem value="salud">Salud</SelectItem>
                      <SelectItem value="produccion">Producción</SelectItem>
                      <SelectItem value="mortalidad">Mortalidad</SelectItem>
                      <SelectItem value="ambiente">Ambiente</SelectItem>
                      <SelectItem value="alimentacion">Alimentación</SelectItem>
                      <SelectItem value="mantenimiento">
                        Mantenimiento
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:w-48">
                  <Select
                    value={filtroPrioridad}
                    onValueChange={setFiltroPrioridad}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">
                        Todas las prioridades
                      </SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:w-48">
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los estados</SelectItem>
                      <SelectItem value="activa">Activas</SelectItem>
                      <SelectItem value="resuelta">Resueltas</SelectItem>
                      <SelectItem value="descartada">Descartadas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Alertas */}
          <div className="space-y-4">
            {alertasFiltradas.map((alerta) => (
              <Card
                key={alerta.id}
                className={`transition-all hover:shadow-md ${
                  alerta.prioridad === "critica"
                    ? "border-destructive/50 bg-destructive/5"
                    : alerta.prioridad === "alta"
                    ? "border-warning/50 bg-warning/5"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 w-full">
                      <div className="flex flex-wrap items-center gap-2 ">
                        <Badge
                          variant={
                            alerta.prioridad === "critica"
                              ? "destructive"
                              : alerta.prioridad === "alta"
                              ? "secondary"
                              : "outline"
                          }
                          className={getPrioridadColor(alerta.prioridad)}
                        >
                          {alerta.prioridad}
                        </Badge>
                        <Badge variant="outline">{alerta.tipo}</Badge>
                        {alerta.lote && (
                          <Badge variant="outline">{alerta.lote}</Badge>
                        )}
                        <div className="flex flex-row md:flex-col gap-2 md:ml-auto md:text-right">
                          <div className="text-xs text-muted-foreground text-right">
                            {new Date(alerta.fechaCreacion).toLocaleString()}
                          </div>
                          {alerta.fechaVencimiento && (
                            <div className="text-xs text-destructive text-right">
                              Vence:{" "}
                              {new Date(
                                alerta.fechaVencimiento
                              ).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{alerta.titulo}</CardTitle>
                      <p className="text-muted-foreground">
                        {alerta.descripcion}
                      </p>
                      {alerta.parametros && (
                        <div className="flex items-center gap-4 text-sm">
                          <span>
                            <strong>Actual:</strong>{" "}
                            {alerta.parametros.valorActual}
                            {alerta.parametros.unidad}
                          </span>
                          <span>
                            <strong>Esperado:</strong>{" "}
                            {alerta.parametros.valorEsperado}
                            {alerta.parametros.unidad}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Acciones Recomendadas:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {alerta.accionesRecomendadas.map((accion, index) => (
                        <li key={index}>{accion}</li>
                      ))}
                    </ul>
                  </div>

                  {alerta.estado === "activa" && (
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleResolverAlerta(alerta.id)}
                        className="gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Resolver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDescartarAlerta(alerta.id)}
                        className="gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        Descartar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predicciones" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {prediccionesData.map((prediccion) => (
              <Card key={prediccion.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {prediccion.tipo === "sacrificio"
                        ? "Fecha Óptima Sacrificio"
                        : prediccion.tipo === "peso"
                        ? "Predicción de Peso"
                        : prediccion.tipo === "conversion"
                        ? "Conversión Alimenticia"
                        : "Predicción"}
                    </CardTitle>
                    <Badge variant="outline" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {prediccion.confianza}% confianza
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {prediccion.valor}
                      {prediccion.tipo === "peso"
                        ? "kg"
                        : prediccion.tipo === "conversion"
                        ? ":1"
                        : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {prediccion.lote}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Fecha Predicción:</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(
                        prediccion.fechaPrediccion
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <p className="text-sm">{prediccion.descripcion}</p>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${prediccion.confianza}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tendencias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Alertas (Última Semana)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tendenciaAlertas}>
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
                      dataKey="salud"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      name="Salud"
                    />
                    <Line
                      type="monotone"
                      dataKey="produccion"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Producción"
                    />
                    <Line
                      type="monotone"
                      dataKey="mortalidad"
                      stroke="hsl(var(--warning))"
                      strokeWidth={2}
                      name="Mortalidad"
                    />
                    <Line
                      type="monotone"
                      dataKey="ambiente"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      name="Ambiente"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
