import { RegistroSalud } from "@/models/healthRegister.model";
import { RecordType } from "@/models/recordType.model";

const registrosData: RegistroSalud[] = [
  {
    id: "1",
    polloId: "2",
    polloIdentificador: "A002",
    lote: "Lote A - Ene 2024",
    fecha: "2024-02-20",
    tipoRegistro: RecordType.SICK,
    sintomas: ["Respiración dificultosa", "Secreción nasal", "Letargo"],
    diagnostico: "Infección respiratoria leve",
    tratamiento: "Antibiótico oral + aislamiento",
    medicamento: "Enrofloxacina",
    dosis: "10mg/kg durante 5 días",
    veterinario: "Dr. María González",
    proximaRevision: "2024-02-25",
    observaciones: "Mejoría notable después de 2 días de tratamiento"
  },
  {
    id: "2",
    polloId: "1",
    polloIdentificador: "A001",
    lote: "Lote A - Ene 2024", 
    fecha: "2024-02-18",
    tipoRegistro: RecordType.REVISION,
    sintomas: [],
    diagnostico: "Estado de salud normal",
    tratamiento: "Ninguno",
    medicamento: "",
    dosis: "",
    veterinario: "Dr. Carlos Ruiz",
    observaciones: "Desarrollo dentro de parámetros normales"
  },
  {
    id: "3",
    polloId: "3",
    polloIdentificador: "B001",
    lote: "Lote B - Dic 2023",
    fecha: "2024-02-19",
    tipoRegistro: RecordType.VACCINATION, 
    sintomas: [],
    diagnostico: "Vacunación preventiva",
    tratamiento: "Vacuna Newcastle",
    medicamento: "Vacuna Newcastle La Sota",
    dosis: "0.5ml vía ocular",
    veterinario: "Dr. María González",
    observaciones: "Vacunación de refuerzo completada sin complicaciones"
  }
]