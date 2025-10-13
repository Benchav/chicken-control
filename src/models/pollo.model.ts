import { Health } from "./health.model"

export interface Pollo {
  id: string
  identificador: string
  lote: string
  raza: string
  fechaNacimiento: string
  pesoActual: number
  estado: Health
  observaciones: string
  ultimaRevision: string
}