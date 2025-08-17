import { MetricCard } from "@/components/dashboard/MetricCard"
import { AlertCard } from "@/components/dashboard/AlertCard"
import { GrowthChart } from "@/components/dashboard/GrowthChart"
import { Users, Bird, Heart, Skull, TrendingUp, AlertTriangle } from "lucide-react"
import farmHero from "@/assets/farm-hero.jpg"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img 
          src={farmHero} 
          alt="Granja de pollos moderna" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Dashboard de Control
          </h1>
          <p className="text-muted-foreground">
            Sistema integral de gestión para pollos de engorde
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Métricas Principales */}
        <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total de Pollos"
            value="2,847"
            subtitle="En 3 lotes activos"
            icon={<Bird />}
            trend={{ value: 12, isPositive: true }}
            variant="default"
          />
          <MetricCard
            title="Pollos Sanos"
            value="2,760"
            subtitle="97% del total"
            icon={<Heart />}
            trend={{ value: 3, isPositive: true }}
            variant="success"
          />
          <MetricCard
            title="Pollos Enfermos"
            value="62"
            subtitle="2.2% del total"
            icon={<AlertTriangle />}
            trend={{ value: -5, isPositive: false }}
            variant="warning"
          />
          <MetricCard
            title="Mortalidad"
            value="25"
            subtitle="0.8% del total"
            icon={<Skull />}
            trend={{ value: -2, isPositive: true }}
            variant="destructive"
          />
        </div>

        {/* Gráfico de Crecimiento */}
        <GrowthChart />

        {/* Alertas Recientes */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Alertas Recientes</h2>
            <div className="space-y-3">
              <AlertCard
                type="health"
                title="Detección de enfermedad respiratoria"
                description="15 pollos del Lote A muestran síntomas respiratorios. Se recomienda aislamiento y tratamiento inmediato."
                severity="high"
                timestamp="Hace 2 horas"
                actionLabel="Ver detalles"
                onAction={() => console.log("Ver detalles")}
              />
              <AlertCard
                type="production"
                title="Lote B listo para sacrificio"
                description="El Lote B ha alcanzado el peso objetivo de 2.5kg. Programar procesamiento."
                severity="medium"
                timestamp="Hace 6 horas"
                actionLabel="Programar"
                onAction={() => console.log("Programar")}
              />
              <AlertCard
                type="general"
                title="Mantenimiento de equipos"
                description="Revisión programada de sistemas de ventilación en el sector 2."
                severity="low"
                timestamp="Hace 1 día"
                actionLabel="Agendar"
                onAction={() => console.log("Agendar")}
              />
            </div>
          </div>

          {/* Resumen de Lotes */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Resumen de Lotes</h2>
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-card-foreground">Lote A</h3>
                  <span className="text-sm text-success font-medium">Activo</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Pollos:</span>
                    <span className="ml-2 font-medium">1,050</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Edad:</span>
                    <span className="ml-2 font-medium">4 semanas</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Peso prom:</span>
                    <span className="ml-2 font-medium">1.2kg</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mortalidad:</span>
                    <span className="ml-2 font-medium">0.5%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-card-foreground">Lote B</h3>
                  <span className="text-sm text-warning font-medium">Listo</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Pollos:</span>
                    <span className="ml-2 font-medium">890</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Edad:</span>
                    <span className="ml-2 font-medium">7 semanas</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Peso prom:</span>
                    <span className="ml-2 font-medium">2.5kg</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mortalidad:</span>
                    <span className="ml-2 font-medium">1.2%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border bg-card">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-card-foreground">Lote C</h3>
                  <span className="text-sm text-success font-medium">Activo</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Pollos:</span>
                    <span className="ml-2 font-medium">907</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Edad:</span>
                    <span className="ml-2 font-medium">6 semanas</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Peso prom:</span>
                    <span className="ml-2 font-medium">2.1kg</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Mortalidad:</span>
                    <span className="ml-2 font-medium">0.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}