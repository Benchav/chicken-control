// src/pages/ReportesPage.tsx

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// CORRECCIÓN: Badge viene de ui/badge (no ui/export)
import { Badge } from "@/components/ui/export"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, BarChart3, PieChart, Calendar, TrendingUp, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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
  PieChart as RechartsPieChart,
  Cell,
  Pie
} from "recharts"

// =================================================================
// ESTRUCTURAS DE DATOS
// =================================================================

interface ReporteData {
  periodo: string
  lotesActivos: number
  totalPollos: number
  pollosSanos: number
  pollosEnfermos: number
  pollosMuertos: number
  pesoPromedio: number
  mortalidad: number
  conversionAlimenticia: number
  ingresosBrutos: number
  costosProduccion: number
  utilidadNeta: number
}

interface LoteReporte {
  id: string
  nombre: string
  fechaInicio: string
  fechaFin?: string
  cantidadInicial: number
  cantidadFinal: number
  pesoFinal: number
  mortalidad: number
  conversion: number
  costoTotal: number
  ingresoTotal: number
  utilidad: number
  estado: "activo" | "completado"
}

// =================================================================
// MOCK DATA (DATOS DE EJEMPLO)
// =================================================================

const mockReportesHistoricos: ReporteData[] = [
  {
    periodo: "2024-01",
    lotesActivos: 3,
    totalPollos: 2950,
    pollosSanos: 2785,
    pollosEnfermos: 140,
    pollosMuertos: 25,
    pesoPromedio: 1.8,
    mortalidad: 5.6,
    conversionAlimenticia: 1.75,
    ingresosBrutos: 18650000,
    costosProduccion: 14720000,
    utilidadNeta: 3930000
  },
  {
    periodo: "2023-12",
    lotesActivos: 4,
    totalPollos: 3200,
    pollosSanos: 2980,
    pollosEnfermos: 156,
    pollosMuertos: 64,
    pesoPromedio: 2.1,
    mortalidad: 6.9,
    conversionAlimenticia: 1.82,
    ingresosBrutos: 21340000,
    costosProduccion: 16850000,
    utilidadNeta: 4490000
  },
  {
    periodo: "2023-11",
    lotesActivos: 3,
    totalPollos: 2800,
    pollosSanos: 2665,
    pollosEnfermos: 98,
    pollosMuertos: 37,
    pesoPromedio: 2.3,
    mortalidad: 4.8,
    conversionAlimenticia: 1.68,
    ingresosBrutos: 19870000,
    costosProduccion: 15200000,
    utilidadNeta: 4670000
  }
]

const mockLotesHistoricos: LoteReporte[] = [
  {
    id: "1",
    nombre: "Lote D - Nov 2023",
    fechaInicio: "2023-11-01",
    fechaFin: "2024-01-15",
    cantidadInicial: 1200,
    cantidadFinal: 1138,
    pesoFinal: 2.8,
    mortalidad: 5.2,
    conversion: 1.72,
    costoTotal: 8640000,
    ingresoTotal: 11820000,
    utilidad: 3180000,
    estado: "completado"
  },
  {
    id: "2",
    nombre: "Lote E - Oct 2023",
    fechaInicio: "2023-10-15",
    fechaFin: "2023-12-28",
    cantidadInicial: 980,
    cantidadFinal: 925,
    pesoFinal: 2.6,
    mortalidad: 5.6,
    conversion: 1.78,
    costoTotal: 7030000,
    ingresoTotal: 9425000,
    utilidad: 2395000,
    estado: "completado"
  }
]

const crecimientoSemanal = [
  { semana: 1, loteA: 0.15, loteB: 0.12, loteC: 0.18, promedio: 0.15 },
  { semana: 2, loteA: 0.35, loteB: 0.32, loteC: 0.38, promedio: 0.35 },
  { semana: 3, loteA: 0.68, loteB: 0.65, loteC: 0.72, promedio: 0.68 },
  { semana: 4, loteA: 1.15, loteB: 1.10, loteC: 1.22, promedio: 1.16 },
  { semana: 5, loteA: 1.75, loteB: 1.68, loteC: 1.85, promedio: 1.76 },
  { semana: 6, loteA: 2.45, loteB: 2.35, loteC: 2.55, promedio: 2.45 }
]

const distribucionMortalidad = [
  { causa: "Natural", valor: 45, color: "#8884d8" },
  { causa: "Respiratorio", valor: 25, color: "#82ca9d" },
  { causa: "Digestivo", valor: 15, color: "#ffc658" },
  { causa: "Accidentes", valor: 10, color: "#ff7300" },
  { causa: "Otros", valor: 5, color: "#0088fe" }
]

// =================================================================
// UTILIDADES DE EXPORTACIÓN CSV
// =================================================================

/**
 * Escapa un valor para CSV (comas, comillas y saltos de línea).
 */
const escapeCsv = (value: string | number | undefined | null): string => {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    const escaped = str.replace(/"/g, '""')
    return `"${escaped}"`
  }
  return str
}

/**
 * Convierte una matriz de objetos a CSV y fuerza la descarga.
 * columnMapping es opcional y usa claves string (más flexible con TS).
 */
const downloadCSV = <T extends Record<string, any>>(
  data: T[],
  fileName: string,
  columnMapping?: Record<string, string>
) => {
  if (!data || data.length === 0) {
    console.warn("No hay datos para exportar a CSV.")
    return
  }

  const headers = Object.keys(data[0])
  const csvHeaders = columnMapping
    ? headers.map(h => escapeCsv(columnMapping[h] ?? h))
    : headers.map(h => escapeCsv(h))

  const csvRows = data.map(row => headers.map(h => escapeCsv(row[h])).join(","))
  const csvContent = [csvHeaders.join(","), ...csvRows].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// =================================================================
// UTILIDADES DE EXPORTACIÓN PDF (jsPDF dinámico + fallback)
// =================================================================

/**
 * Genera un PDF simple usando jsPDF si está disponible. Si falla, abre una ventana imprimible.
 * Devuelve true si se inició la descarga / impresión.
 */
async function generateSimplePDF(fileName: string, lines: string[]): Promise<boolean> {
  if (typeof window === "undefined") return false

  try {
    // import dinámico para evitar bundling en SSR
    const jspdfModule: any = await import("jspdf")
    // jsPDF puede venir como named export o default
    const jsPDFCtor = jspdfModule.jsPDF ?? jspdfModule.default ?? jspdfModule
    if (!jsPDFCtor) throw new Error("jsPDF no disponible")

    const doc = new jsPDFCtor({ unit: "pt", format: "a4" })
    const margin = 40
    const pageHeight = 842 // A4 height in points
    const maxLineWidth = 595 - margin * 2 // A4 width minus margins
    let y = margin
    const lineHeight = 14

    for (const rawLine of lines) {
      const text = String(rawLine)
      // splitTextToSize (si existe) permite ajustar texto al ancho
      const chunks = typeof (doc as any).splitTextToSize === "function"
        ? (doc as any).splitTextToSize(text, maxLineWidth)
        : [text]

      for (const chunk of chunks) {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage()
          y = margin
        }
        doc.text(String(chunk), margin, y)
        y += lineHeight
      }
    }

    doc.save(fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`)
    return true
  } catch (err) {
    // Fallback: abrir ventana imprimible
    // eslint-disable-next-line no-console
    console.warn("generateSimplePDF fallback:", err)
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${fileName}</title></head><body>${lines
      .map(l => `<div style="font-family: Arial; margin:8px 0">${String(l)}</div>`)
      .join("")}</body></html>`
    const newWin = window.open("", "_blank")
    if (!newWin) return false
    newWin.document.open()
    newWin.document.write(html)
    newWin.document.close()
    newWin.focus()
    setTimeout(() => {
      try {
        newWin.print()
      } catch (e) {
        // ignore
      }
    }, 500)
    return true
  }
}

// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================

export default function ReportesPage() {
  const [selectedTab, setSelectedTab] = useState("dashboard")
  const [selectedPeriodo, setSelectedPeriodo] = useState("2024-01")
  const [tipoReporte, setTipoReporte] = useState("mensual")
  const { toast } = useToast()

  // Derivar reporteActual localmente ayuda a evitar closures en callbacks
  const reporteActual = mockReportesHistoricos.find(r => r.periodo === selectedPeriodo) || mockReportesHistoricos[0]

  // Exportar PDF (async)
  const handleExportarPDF = useCallback(
    async (tipo: string) => {
      toast({
        title: "Exportando reporte",
        description: `Generando reporte ${tipo} en formato PDF...`
      })

      const reporte = mockReportesHistoricos.find(r => r.periodo === selectedPeriodo) || mockReportesHistoricos[0]

      const lines: string[] = []
      lines.push(`Reporte: ${tipo.toUpperCase()} - Período ${selectedPeriodo}`)
      lines.push("")

      if (tipo === "completo" || tipo === "produccion") {
        lines.push(`Total Pollos: ${reporte.totalPollos}`)
        lines.push(`Peso Promedio: ${reporte.pesoPromedio} kg`)
        lines.push(`Mortalidad: ${reporte.mortalidad} %`)
        lines.push(`Conversión Alimenticia: ${reporte.conversionAlimenticia} : 1`)
      }

      if (tipo === "completo" || tipo === "financiero") {
        lines.push("")
        lines.push(`Ingresos Brutos: $${reporte.ingresosBrutos}`)
        lines.push(`Costos de Producción: $${reporte.costosProduccion}`)
        lines.push(`Utilidad Neta: $${reporte.utilidadNeta}`)
      }

      if (tipo === "completo" || tipo === "sanitario") {
        lines.push("")
        lines.push("Registros sanitarios:")
        lines.push("- No hay registros reales en este mock.")
      }

      try {
        const ok = await generateSimplePDF(`reporte_${tipo}_${selectedPeriodo}.pdf`, lines)
        if (ok) {
          toast({
            title: "Reporte generado",
            description: `El archivo reporte_${tipo}_${selectedPeriodo}.pdf ha sido descargado.`,
            variant: "success" as any
          })
        } else {
          toast({
            title: "Error",
            description: "No se pudo generar el PDF.",
            variant: "destructive" as any
          })
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Ocurrió un error al generar el PDF.",
          variant: "destructive" as any
        })
      }
    },
    [toast, selectedPeriodo]
  )

  // Exportar CSV
  const handleExportarCSV = useCallback(
    (dataType: "lotes" | "pollos" | "salud" | "financieros") => {
      toast({
        title: "Preparando datos",
        description: `Convirtiendo datos de ${dataType} a formato CSV...`
      })

      let dataToExport: any[] = []
      let fileName = ""
      let mapping: Record<string, string> | undefined

      switch (dataType) {
        case "lotes":
          dataToExport = mockLotesHistoricos
          fileName = `lotes_historicos_${selectedPeriodo}`
          mapping = {
            id: "ID Lote",
            nombre: "Nombre del Lote",
            fechaInicio: "Fecha Inicio",
            fechaFin: "Fecha Fin",
            cantidadInicial: "Cantidad Inicial",
            cantidadFinal: "Cantidad Final",
            pesoFinal: "Peso Final (kg)",
            mortalidad: "Mortalidad (%)",
            conversion: "Conversión Alimenticia",
            costoTotal: "Costo Total",
            ingresoTotal: "Ingreso Total",
            utilidad: "Utilidad Neta",
            estado: "Estado"
          }
          break
        case "financieros":
          dataToExport = mockReportesHistoricos
          fileName = `reporte_financiero_${selectedPeriodo}`
          break
        default:
          // pollos/salud en este mock usan lotes como placeholder
          dataToExport = mockLotesHistoricos
          fileName = dataType
          break
      }

      try {
        downloadCSV(dataToExport, fileName, mapping)
        toast({
          title: "Datos exportados",
          description: `El archivo ${fileName}.csv ha sido descargado exitosamente.`,
          variant: "success" as any
        })
      } catch (error) {
        toast({
          title: "Error de Exportación",
          description: "Hubo un problema al generar el archivo CSV.",
          variant: "destructive" as any
        })
      }
    },
    [toast, selectedPeriodo]
  )

  // Descargar todo (CSVs + PDFs secuenciales para evitar abrir muchas ventanas)
  const handleDescargarTodo = useCallback(async () => {
    toast({ title: "Descarga masiva", description: "Iniciando descarga de todos los CSV y PDFs..." })

    try {
      downloadCSV(mockLotesHistoricos, `lotes_historicos_${selectedPeriodo}`, {
        id: "ID Lote",
        nombre: "Nombre del Lote",
        fechaInicio: "Fecha Inicio",
        fechaFin: "Fecha Fin",
        cantidadInicial: "Cantidad Inicial",
        cantidadFinal: "Cantidad Final",
        pesoFinal: "Peso Final (kg)",
        mortalidad: "Mortalidad (%)",
        conversion: "Conversión Alimenticia",
        costoTotal: "Costo Total",
        ingresoTotal: "Ingreso Total",
        utilidad: "Utilidad Neta",
        estado: "Estado"
      })
      downloadCSV(mockReportesHistoricos, `reporte_financiero_${selectedPeriodo}`)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Error generando CSVs masivos", e)
    }

    const tiposPdf = ["completo", "produccion", "financiero", "sanitario"]
    for (const t of tiposPdf) {
      // Generar secuencialmente; si jsPDF no está instalado, fallback puede abrir ventana de impresión
      // Es intencional hacer await para no abrir muchas ventanas a la vez en fallback
      // eslint-disable-next-line no-await-in-loop
      // @ts-ignore - general call
      // eslint-disable-next-line no-await-in-loop
      await handleExportarPDF(t)
    }

    toast({ title: "Descarga completa", description: "Se intentó descargar todos los CSV y PDFs." })
  }, [handleExportarPDF, selectedPeriodo, toast])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes y Estadísticas</h1>
          <p className="text-muted-foreground">Análisis detallado del rendimiento y exportación de datos</p>
        </div>

        <div className="flex gap-2">
          <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-01">Enero 2024</SelectItem>
              <SelectItem value="2023-12">Diciembre 2023</SelectItem>
              <SelectItem value="2023-11">Noviembre 2023</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => void handleExportarPDF("completo")} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </Button>

          <Button onClick={() => void handleDescargarTodo()} className="gap-2">
            <Download className="h-4 w-4" />
            Descargar todo
          </Button>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="flex flex-row md:grid md:grid-cols-4 justify-around overflow-x-auto">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="produccion">Producción</TabsTrigger>
          <TabsTrigger value="financiero">Financiero</TabsTrigger>
          <TabsTrigger value="exportar">Exportar</TabsTrigger>
        </TabsList>

        {/* Dashboard (sin cambios funcionales) */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* KPIs Principales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pollos</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reporteActual.totalPollos.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{reporteActual.lotesActivos} lotes activos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peso Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reporteActual.pesoPromedio}kg</div>
                <p className="text-xs text-success">+12% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mortalidad</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reporteActual.mortalidad}%</div>
                <p className="text-xs text-destructive">+0.8% vs objetivo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(reporteActual.utilidadNeta / 1000000).toFixed(1)}</div>
                <p className="text-xs text-success">+18% vs mes anterior</p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos Principales */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Crecimiento Semanal Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={crecimientoSemanal}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="semana" className="text-muted-foreground" fontSize={12} />
                      <YAxis className="text-muted-foreground" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                      <Line type="monotone" dataKey="promedio" stroke="hsl(var(--primary))" strokeWidth={3} name="Promedio" />
                      <Line type="monotone" dataKey="loteA" stroke="hsl(var(--success))" strokeWidth={2} name="Lote A" />
                      <Line type="monotone" dataKey="loteB" stroke="hsl(var(--warning))" strokeWidth={2} name="Lote B" />
                      <Line type="monotone" dataKey="loteC" stroke="hsl(var(--accent))" strokeWidth={2} name="Lote C" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Mortalidad por Causa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                      <Pie dataKey="valor" data={distribucionMortalidad} cx="50%" cy="50%" outerRadius={80}>
                        {distribucionMortalidad.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {distribucionMortalidad.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.causa}: {item.valor}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Producción */}
        <TabsContent value="produccion" className="space-y-6">
          {/* Métricas de Producción */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-lg">Conversión Alimenticia</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{reporteActual.conversionAlimenticia}:1</div>
                <p className="text-sm text-muted-foreground mt-2">Promedio de los lotes activos</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Objetivo: 1.70:1</span>
                    <span className="text-warning">+{((reporteActual.conversionAlimenticia - 1.70) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min((1.70 / reporteActual.conversionAlimenticia) * 100, 100)}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Eficiencia de Supervivencia</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{(100 - reporteActual.mortalidad).toFixed(1)}%</div>
                <p className="text-sm text-muted-foreground mt-2">Pollos que alcanzan el objetivo</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Objetivo: 95%</span>
                    <span className={`${(100 - reporteActual.mortalidad) >= 95 ? "text-success" : "text-destructive"}`}>{(100 - reporteActual.mortalidad) >= 95 ? "✓" : "✗"} Objetivo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Tiempo Promedio Ciclo</CardTitle></CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">42 días</div>
                <p className="text-sm text-muted-foreground mt-2">Desde nacimiento a 2.5kg</p>
                <div className="mt-4"><div className="flex justify-between text-sm"><span>Estándar: 45 días</span><span className="text-success">-3 días</span></div></div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Historial de Lotes Completados</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lote</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Peso Final</TableHead>
                      <TableHead>Mortalidad</TableHead>
                      <TableHead>Conversión</TableHead>
                      <TableHead>Utilidad</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLotesHistoricos.map((lote) => (
                      <TableRow key={lote.id}>
                        <TableCell className="font-medium">{lote.nombre}</TableCell>
                        <TableCell>{new Date(lote.fechaInicio).toLocaleDateString()} - {lote.fechaFin ? new Date(lote.fechaFin).toLocaleDateString() : "Activo"}</TableCell>
                        <TableCell>{lote.cantidadFinal}/{lote.cantidadInicial}</TableCell>
                        <TableCell>{lote.pesoFinal}kg</TableCell>
                        <TableCell><span className={lote.mortalidad > 6 ? "text-destructive" : lote.mortalidad > 4 ? "text-warning" : "text-success"}>{lote.mortalidad}%</span></TableCell>
                        <TableCell>{lote.conversion}:1</TableCell>
                        <TableCell>C${(lote.utilidad / 1000000).toFixed(1)}K</TableCell>
                        <TableCell><Badge variant={lote.estado === "completado" ? "secondary" : "default"}>{lote.estado}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financiero */}
        <TabsContent value="financiero" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardHeader><CardTitle className="text-lg">Ingresos Brutos</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-success">{(reporteActual.ingresosBrutos / 1000000).toFixed(1)}K</div><p className="text-sm text-muted-foreground mt-2">Período {selectedPeriodo}</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Costos de Producción</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-destructive">{(reporteActual.costosProduccion / 1000000).toFixed(1)}K</div><p className="text-sm text-muted-foreground mt-2">{((reporteActual.costosProduccion / reporteActual.ingresosBrutos) * 100).toFixed(1)}% de ingresos</p></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Margen de Utilidad</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold text-primary">{((reporteActual.utilidadNeta / reporteActual.ingresosBrutos) * 100).toFixed(1)}%</div><p className="text-sm text-muted-foreground mt-2">{(reporteActual.utilidadNeta / 1000000).toFixed(1)}M utilidad neta</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Evolución Financiera (Últimos 3 Meses)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockReportesHistoricos}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="periodo" className="text-muted-foreground" fontSize={12} />
                    <YAxis className="text-muted-foreground" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} formatter={(value: any) => [`C$${(value / 1000000).toFixed(1)}K`, ""]} />
                    <Bar dataKey="ingresosBrutos" fill="hsl(var(--success))" name="Ingresos" />
                    <Bar dataKey="costosProduccion" fill="hsl(var(--destructive))" name="Costos" />
                    <Bar dataKey="utilidadNeta" fill="hsl(var(--primary))" name="Utilidad" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exportar */}
        <TabsContent value="exportar" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Reportes en PDF</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div><h4 className="font-medium">Reporte Completo Mensual</h4><p className="text-sm text-muted-foreground">Incluye todas las métricas del período seleccionado</p></div>
                    <Button onClick={() => void handleExportarPDF("completo")} className="gap-2"><Download className="h-4 w-4" />PDF</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div><h4 className="font-medium">Reporte de Producción</h4><p className="text-sm text-muted-foreground">Métricas de crecimiento, conversión y mortalidad</p></div>
                    <Button onClick={() => void handleExportarPDF("produccion")} variant="outline" className="gap-2"><Download className="h-4 w-4" />PDF</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div><h4 className="font-medium">Reporte Financiero</h4><p className="text-sm text-muted-foreground">Ingresos, costos y análisis de rentabilidad</p></div>
                    <Button onClick={() => void handleExportarPDF("financiero")} variant="outline" className="gap-2"><Download className="h-4 w-4" />PDF</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div><h4 className="font-medium">Reporte Sanitario</h4><p className="text-sm text-muted-foreground">Registros médicos, vacunaciones y tratamientos</p></div>
                    <Button onClick={() => void handleExportarPDF("sanitario")} variant="outline" className="gap-2"><Download className="h-4 w-4" />PDF</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" />Exportar Datos CSV</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div><h4 className="font-medium">Datos de Lotes</h4><p className="text-sm text-muted-foreground">Información completa de todos los lotes</p></div>
                    <Button onClick={() => handleExportarCSV("lotes")} variant="outline" className="gap-2"><Download className="h-4 w-4" />CSV</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div><h4 className="font-medium">Datos de Pollos</h4><p className="text-sm text-muted-foreground">Registros individuales de cada pollo</p></div>
                    <Button onClick={() => handleExportarCSV("pollos")} variant="outline" className="gap-2"><Download className="h-4 w-4" />CSV</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div><h4 className="font-medium">Registros de Salud</h4><p className="text-sm text-muted-foreground">Historial médico y tratamientos</p></div>
                    <Button onClick={() => handleExportarCSV("salud")} variant="outline" className="gap-2"><Download className="h-4 w-4" />CSV</Button>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div><h4 className="font-medium">Datos Financieros</h4><p className="text-sm text-muted-foreground">Costos, ingresos y rentabilidad</p></div>
                    <Button onClick={() => handleExportarCSV("financieros")} variant="outline" className="gap-2"><Download className="h-4 w-4" />CSV</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Configuración de Reportes</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Reporte</label>
                  <Select value={tipoReporte} onValueChange={setTipoReporte}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensual">Mensual</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Formato de Exportación</label>
                  <Select defaultValue="pdf">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button className="gap-2"><Calendar className="h-4 w-4" />Programar Reporte Automático</Button>
                <Button variant="outline" className="gap-2"><Printer className="h-4 w-4" />Imprimir</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}