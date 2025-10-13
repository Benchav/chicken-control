import { Health } from "@/models/health.model";
import { Pollo } from "@/models/pollo.model";

const pollosData: Pollo[] = [
  {
    id: "1",
    identificador: "A001",
    lote: "Lote A - Ene 2024",
    raza: "Ross 308",
    fechaNacimiento: "2024-01-15",
    pesoActual: 1.25,
    estado: Health.HEALTHY,
    observaciones: "Desarrollo normal",
    ultimaRevision: "2024-02-20"
  },
  {
    id: "2",
    identificador: "A002", 
    lote: "Lote A - Ene 2024",
    raza: "Ross 308",
    fechaNacimiento: "2024-01-15",
    pesoActual: 1.18,
    estado: Health.SICK,
    observaciones: "Síntomas respiratorios leves",
    ultimaRevision: "2024-02-20"
  },
  {
    id: "3",
    identificador: "B001",
    lote: "Lote B - Dic 2023", 
    raza: "Cobb 500",
    fechaNacimiento: "2023-12-01",
    pesoActual: 2.65,
    estado: Health.HEALTHY,
    observaciones: "Listo para procesamiento",
    ultimaRevision: "2024-02-19"
  },
  {
    id: "4",
    identificador: "A003",
    lote: "Lote A - Ene 2024",
    raza: "Ross 308", 
    fechaNacimiento: "2024-01-15",
    pesoActual: 0,
    estado: Health.DEAD,
    observaciones: "Mortalidad natural - semana 4",
    ultimaRevision: "2024-02-15"
  },
  {
    id: "5",
    identificador: "C001",
    lote: "Lote C - Ene 2024",
    raza: "Ross 308",
    fechaNacimiento: "2024-01-20", 
    pesoActual: 2.15,
    estado: Health.HEALTHY,
    observaciones: "Crecimiento óptimo",
    ultimaRevision: "2024-02-20"
  }
]