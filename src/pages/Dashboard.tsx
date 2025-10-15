import { MetricCard } from "@/components/dashboard/MetricCard";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { GrowthChart } from "@/components/dashboard/GrowthChart";
import { Bird, Heart, Skull, AlertTriangle } from "lucide-react";
import farmHero from "@/assets/farm-hero.jpg";
import { Status } from "@/models/status.model";
import { useLoteContext } from "@/contexts/LoteContext";
import { usePolloContext } from "@/contexts/ChickenContext";
import { Health } from "@/models/health.model";
import { useAlertContext } from "@/contexts/AlertContext";
import { AlertPriority } from "@/models/alertPriority.model";
import { AlertType } from "@/models/alertType.model";

// ✅ Helper para mapear el tipo de alerta (por si viene como string o enum)
const mapTipo = (
  tipo: string | AlertType
): "health" | "mortality" | "production" | "general" => {
  const valor = tipo.toString().toLowerCase();
  switch (valor) {
    case "health":
    case "salud":
      return "health";
    case "mortality":
    case "mortalidad":
      return "mortality";
    case "production":
    case "producción":
      return "production";
    default:
      return "general";
  }
};

export default function Dashboard() {
  const { alerts } = useAlertContext();
  const { lotes, loadingLotes, errorLotes } = useLoteContext();
  const { pollos, loadingPollos, errorPollos } = usePolloContext();

  const alertasRecientes = [...alerts]
    .sort(
      (a, b) =>
        new Date(b.fechaCreacion).getTime() -
        new Date(a.fechaCreacion).getTime()
    )
    .slice(0, 3);

  if (loadingLotes || loadingPollos) {
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Cargando datos de lotes...
      </div>
    );
  }

  if (errorLotes || errorPollos) {
    return (
      <div className="flex justify-center items-center h-screen text-destructive">
        {errorLotes || errorPollos}
      </div>
    );
  }

  // Filtrar solo los lotes activos
  const lotesActivos = lotes.filter((lote) => lote.estado === Status.ACTIVE);

  // Calcular métricas
  const totalPollos = lotesActivos.reduce(
    (sum, lote) => sum + lote.cantidadActual,
    0
  );
  const totalInicial = lotesActivos.reduce(
    (sum, lote) => sum + lote.cantidadInicial,
    0
  );

  const mortalidadPromedio =
    lotesActivos.length > 0
      ? lotesActivos.reduce((sum, l) => sum + l.mortalidad, 0) /
        lotesActivos.length
      : 0;

  const pollosMuertos = totalInicial - totalPollos;
  const pollosEnfermos = pollos.filter((p) => p.estado === Health.SICK).length;
  const pollosSanos = totalPollos - pollosEnfermos;

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
            value={totalPollos.toLocaleString()}
            subtitle={`En ${lotesActivos.length} lotes activos`}
            icon={<Bird />}
            trend={{ value: 12, isPositive: true }}
            variant="default"
          />
          <MetricCard
            title="Pollos Sanos"
            value={pollosSanos.toLocaleString()}
            subtitle={`${((pollosSanos / totalPollos) * 100 || 0).toFixed(
              1
            )}% del total`}
            icon={<Heart />}
            trend={{ value: 3, isPositive: true }}
            variant="success"
          />
          <MetricCard
            title="Pollos Enfermos"
            value={pollosEnfermos.toLocaleString()}
            subtitle={`${((pollosEnfermos / totalPollos) * 100 || 0).toFixed(
              1
            )}% del total`}
            icon={<AlertTriangle />}
            trend={{ value: -5, isPositive: false }}
            variant="warning"
          />
          <MetricCard
            title="Mortalidad"
            value={pollosMuertos.toLocaleString()}
            subtitle={`${mortalidadPromedio.toFixed(1)}% promedio`}
            icon={<Skull />}
            trend={{ value: -2, isPositive: true }}
            variant="destructive"
          />
        </div>

        {/* Gráfico de Crecimiento */}
        <GrowthChart />

        {/* Alertas Recientes y Resumen de Lotes */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Alertas */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Alertas Recientes
            </h2>
            <div className="space-y-3">
              {alertasRecientes.length > 0 ? (
                alertasRecientes.map((alerta) => (
                  <AlertCard
                    key={alerta.id}
                    type={mapTipo(alerta.tipo)}
                    title={alerta.titulo}
                    description={alerta.descripcion}
                    severity={
                      alerta.prioridad === AlertPriority.HIGH
                        ? "high"
                        : alerta.prioridad === AlertPriority.MEDIUM
                        ? "medium"
                        : "low"
                    }
                    timestamp={new Date(alerta.fechaCreacion).toLocaleString()}
                    actionLabel="Ver detalles"
                    onAction={() =>
                      console.log(`Ver detalles de ${alerta.titulo}`)
                    }
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No hay alertas recientes.
                </p>
              )}
            </div>
          </div>

          {/* Resumen de Lotes */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">
              Resumen de Lotes
            </h2>
            <div className="space-y-3">
              {lotes.map((lote) => (
                <div
                  key={lote.id}
                  className="p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-card-foreground">
                      {lote.nombre}
                    </h3>
                    <span
                      className={`text-sm font-medium ${
                        lote.estado === Status.ACTIVE
                          ? "text-success"
                          : "text-warning"
                      }`}
                    >
                      {lote.estado === Status.ACTIVE ? "Activo" : "Finalizado"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Pollos:</span>
                      <span className="ml-2 font-medium">
                        {lote.cantidadActual}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Inicio:</span>
                      <span className="ml-2 font-medium">
                        {new Date(lote.fechaInicio).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peso prom:</span>
                      <span className="ml-2 font-medium">
                        {lote.pesoPromedio}kg
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mortalidad:</span>
                      <span className="ml-2 font-medium">
                        {lote.mortalidad}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
