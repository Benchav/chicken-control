export interface Lote {
  id: string
  nombre: string
  cantidadInicial: number
  cantidadActual: number
  fechaInicio: string
  raza: string
  estado: "activo" | "completado" | "suspendido"
  pesoPromedio: number
  mortalidad: number
  observaciones: string
}