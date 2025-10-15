"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import { useMemo } from "react"
import { useLoteContext } from "@/contexts/LoteContext"

// 🔹 Generar crecimiento semanal con fluctuaciones y bajones realistas
function generarCrecimientoSemanal(lotes: any[], semanas = 6) {
  const data: any[] = []

  const bajonesPorLote = lotes.map(() => Math.floor(Math.random() * (semanas - 2)) + 2) // entre S2 y S(n-1)

  for (let i = 1; i <= semanas; i++) {
    const semanaData: Record<string, any> = { semana: `S${i}` }

    lotes.forEach((lote, index) => {
      const nombreLote = lote.nombre.split(" - ")[0].trim()
      const progreso = i / semanas
      let pesoSemana = lote.pesoPromedio * progreso

      const fluctuacion = 1 + (Math.random() - 0.5) * 0.2
      pesoSemana *= fluctuacion

      if (i === bajonesPorLote[index]) {
        const bajonFactor = 0.7 + Math.random() * 0.1
        pesoSemana *= bajonFactor
      }

      pesoSemana = Math.max(0.1, pesoSemana)
      semanaData[nombreLote] = Number(pesoSemana.toFixed(2))
    })

    data.push(semanaData)
  }

  return data
}

export function GrowthChart() {
  // ✅ AQUÍ DEBE IR el hook
  const { lotes: lotesData } = useLoteContext()

  const data = useMemo(() => generarCrecimientoSemanal(lotesData), [lotesData])

  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--success))",
    "hsl(var(--destructive))",
    "hsl(var(--muted-foreground))",
  ]

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Crecimiento Semanal por Lote</CardTitle>
        <CardDescription>
          Comparativa de peso promedio (kg) por semana con variaciones reales
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="semana" className="text-muted-foreground" fontSize={12} />
              <YAxis
                className="text-muted-foreground"
                fontSize={12}
                tickFormatter={(value) => `${value}kg`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  fontSize: "12px"
                }}
                formatter={(value: any, name: any) => [`${value}kg`, name]}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: "13px" }}
              />
              {lotesData.map((lote, index) => {
                const nombreLote = lote.nombre.split(" - ")[0].trim()
                return (
                  <Bar
                    key={lote.id}
                    dataKey={nombreLote}
                    name={lote.nombre}
                    fill={colors[index % colors.length]}
                    radius={[4, 4, 0, 0]}
                  />
                )
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
