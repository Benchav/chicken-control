import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockData = [
  { semana: "S1", loteA: 0.15, loteB: 0.12, loteC: 0.18 },
  { semana: "S2", loteA: 0.35, loteB: 0.32, loteC: 0.38 },
  { semana: "S3", loteA: 0.68, loteB: 0.65, loteC: 0.72 },
  { semana: "S4", loteA: 1.15, loteB: 1.10, loteC: 1.22 },
  { semana: "S5", loteA: 1.75, loteB: 1.68, loteC: 1.85 },
  { semana: "S6", loteA: 2.45, loteB: 2.35, loteC: 2.55 },
]

export function GrowthChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Crecimiento por Lote</CardTitle>
        <CardDescription>
          Peso promedio semanal en kilogramos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="semana" 
                className="text-muted-foreground"
                fontSize={12}
              />
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
              <Line 
                type="monotone" 
                dataKey="loteA" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                name="Lote A"
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="loteB" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                name="Lote B"
                dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="loteC" 
                stroke="hsl(var(--success))" 
                strokeWidth={3}
                name="Lote C"
                dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}