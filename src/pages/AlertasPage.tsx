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

interface Alerta {
  id: string;
  tipo:
    | "salud"
    | "produccion"
    | "mortalidad"
    | "ambiente"
    | "alimentacion"
    | "mantenimiento";
  prioridad: "baja" | "media" | "alta" | "critica";
  titulo: string;
  descripcion: string;
  lote?: string;
  fechaCreacion: string;
  fechaVencimiento?: string;
  estado: "activa" | "resuelta" | "descartada";
  accionesRecomendadas: string[];
  parametros?: {
    valorActual?: number;
    valorEsperado?: number;
    unidad?: string;
  };
}

interface Prediccion {
  id: string;
  tipo: "peso" | "mortalidad" | "conversion" | "sacrificio";
  lote: string;
  fechaPrediccion: string;
  valor: number;
  confianza: number;
  descripcion: string;
}

const mockAlertas: Alerta[] = [
  {
    id: "1",
    tipo: "salud",
    prioridad: "critica",
    titulo: "Brote respiratorio detectado - Lote A",
    descripcion:
      "Incremento significativo de síntomas respiratorios en el 15% del lote. Posible infección viral.",
    lote: "Lote A - Ene 2024",
    fechaCreacion: "2024-02-20T08:30:00",
    fechaVencimiento: "2024-02-22T18:00:00",
    estado: "activa",
    accionesRecomendadas: [
      "Aislamiento inmediato de pollos afectados",
      "Consulta veterinaria urgente",
      "Mejora ventilación en galpón",
      "Monitoreo intensivo cada 4 horas",
    ],
    parametros: {
      valorActual: 15,
      valorEsperado: 3,
      unidad: "% pollos afectados",
    },
  },
  {
    id: "2",
    tipo: "produccion",
    prioridad: "media",
    titulo: "Lote B listo para procesamiento",
    descripcion:
      "El Lote B ha alcanzado el peso objetivo de 2.5kg promedio. Programar sacrificio en 3-5 días.",
    lote: "Lote B - Dic 2023",
    fechaCreacion: "2024-02-19T14:15:00",
    fechaVencimiento: "2024-02-25T00:00:00",
    estado: "activa",
    accionesRecomendadas: [
      "Programar transporte a planta",
      "Preparar documentación sanitaria",
      "Realizar pesaje final",
      "Coordinar con procesadora",
    ],
    parametros: {
      valorActual: 2.5,
      valorEsperado: 2.5,
      unidad: "kg promedio",
    },
  },
  {
    id: "3",
    tipo: "mortalidad",
    prioridad: "alta",
    titulo: "Mortalidad elevada - Lote C",
    descripcion:
      "La mortalidad ha superado el umbral del 5% en las últimas 48 horas.",
    lote: "Lote C - Ene 2024",
    fechaCreacion: "2024-02-19T16:45:00",
    estado: "activa",
    accionesRecomendadas: [
      "Revisión veterinaria inmediata",
      "Análisis de calidad del agua",
      "Verificación de temperatura ambiental",
      "Revisión del alimento",
    ],
    parametros: {
      valorActual: 7.2,
      valorEsperado: 5.0,
      unidad: "% mortalidad",
    },
  },
  {
    id: "4",
    tipo: "ambiente",
    prioridad: "media",
    titulo: "Temperatura fuera de rango - Galpón 2",
    descripcion:
      "La temperatura ha estado por encima de 28°C durante las últimas 6 horas.",
    fechaCreacion: "2024-02-20T11:00:00",
    estado: "activa",
    accionesRecomendadas: [
      "Verificar sistema de ventilación",
      "Ajustar extractores",
      "Revisar sensores de temperatura",
      "Activar nebulización si disponible",
    ],
    parametros: {
      valorActual: 29.5,
      valorEsperado: 25.0,
      unidad: "°C",
    },
  },
];

const mockPredicciones: Prediccion[] = [
  {
    id: "1",
    tipo: "sacrificio",
    lote: "Lote B - Dic 2023",
    fechaPrediccion: "2024-02-25",
    valor: 2.65,
    confianza: 92,
    descripcion: "Peso óptimo para sacrificio alcanzado en 5 días",
  },
  {
    id: "2",
    tipo: "peso",
    lote: "Lote A - Ene 2024",
    fechaPrediccion: "2024-03-15",
    valor: 2.4,
    confianza: 87,
    descripcion: "Peso esperado de 2.4kg en 3 semanas",
  },
  {
    id: "3",
    tipo: "conversion",
    lote: "Lote C - Ene 2024",
    fechaPrediccion: "2024-03-01",
    valor: 1.85,
    confianza: 78,
    descripcion: "Conversión alimenticia proyectada: 1.85:1",
  },
];

const tendenciaAlertas = [
  { fecha: "2024-02-14", salud: 2, produccion: 1, mortalidad: 0, ambiente: 1 },
  { fecha: "2024-02-15", salud: 1, produccion: 2, mortalidad: 1, ambiente: 2 },
  { fecha: "2024-02-16", salud: 3, produccion: 1, mortalidad: 0, ambiente: 1 },
  { fecha: "2024-02-17", salud: 2, produccion: 3, mortalidad: 1, ambiente: 3 },
  { fecha: "2024-02-18", salud: 4, produccion: 2, mortalidad: 2, ambiente: 2 },
  { fecha: "2024-02-19", salud: 3, produccion: 1, mortalidad: 3, ambiente: 1 },
  { fecha: "2024-02-20", salud: 5, produccion: 2, mortalidad: 1, ambiente: 2 },
];

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>(mockAlertas);
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("activa");
  const [selectedTab, setSelectedTab] = useState("alertas");
  const { toast } = useToast();

  const alertasFiltradas = alertas.filter((alerta) => {
    if (filtroTipo !== "todos" && alerta.tipo !== filtroTipo) return false;
    if (filtroPrioridad !== "todos" && alerta.prioridad !== filtroPrioridad)
      return false;
    if (filtroEstado !== "todos" && alerta.estado !== filtroEstado)
      return false;
    return true;
  });

  const handleResolverAlerta = (id: string) => {
    setAlertas(
      alertas.map((alerta) =>
        alerta.id === id ? { ...alerta, estado: "resuelta" as const } : alerta
      )
    );
    toast({
      title: "Alerta resuelta",
      description: "La alerta ha sido marcada como resuelta",
    });
  };

  const handleDescartarAlerta = (id: string) => {
    setAlertas(
      alertas.map((alerta) =>
        alerta.id === id ? { ...alerta, estado: "descartada" as const } : alerta
      )
    );
    toast({
      title: "Alerta descartada",
      description: "La alerta ha sido descartada",
    });
  };

  const getPrioridadColor = (prioridad: string) => {
    const colors = {
      baja: "text-muted-foreground",
      media: "text-warning",
      alta: "text-destructive",
      critica: "text-white font-bold",
    };
    return colors[prioridad as keyof typeof colors] || colors.baja;
  };

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

  const estadisticas = {
    total: alertas.length,
    activas: alertas.filter((a) => a.estado === "activa").length,
    criticas: alertas.filter(
      (a) => a.prioridad === "critica" && a.estado === "activa"
    ).length,
    vencidas: alertas.filter(
      (a) =>
        a.fechaVencimiento &&
        new Date(a.fechaVencimiento) < new Date() &&
        a.estado === "activa"
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
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configurar Alertas
          </Button>
          <Button className="gap-2">
            <Bell className="h-4 w-4" />
            {estadisticas.activas} Activas
          </Button>
        </div>
      </div>

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
            {mockPredicciones.map((prediccion) => (
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
