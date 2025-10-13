import { RecordType } from "./recordType.model"

export interface RegistroSalud {
  id: string
  polloId: string
  polloIdentificador: string
  lote: string
  fecha: string
  tipoRegistro: RecordType
  sintomas: string[]
  diagnostico: string
  tratamiento: string
  medicamento: string
  dosis: string
  veterinario: string
  proximaRevision?: string
  observaciones: string
}