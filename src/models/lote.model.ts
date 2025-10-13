import { Status } from "./status.model"

export interface Lote {
  id: string
  nombre: string
  cantidadInicial: number
  cantidadActual: number
  fechaInicio: string
  raza: string
  estado: Status
  pesoPromedio: number
  mortalidad: number
  observaciones: string
}