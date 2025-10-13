import { Lote } from "@/models/lote.model";
import { Status } from "@/models/status.model";

export const lotesData: Lote[] = [
  {
    id: "1",
    nombre: "Lote A - Ene 2024",
    cantidadInicial: 1100,
    cantidadActual: 1050,
    fechaInicio: "2024-01-15",
    raza: "Ross 308",
    estado: Status.ACTIVE,
    pesoPromedio: 1.2,
    mortalidad: 4.5,
    observaciones: "Desarrollo normal, buena conversión alimenticia"
  },
  {
    id: "2", 
    nombre: "Lote B - Dic 2023",
    cantidadInicial: 950,
    cantidadActual: 890,
    fechaInicio: "2023-12-01",
    raza: "Cobb 500",
    estado: Status.ACTIVE,
    pesoPromedio: 2.5,
    mortalidad: 6.3,
    observaciones: "Listo para procesamiento la próxima semana"
  },
  {
    id: "3",
    nombre: "Lote C - Ene 2024",
    cantidadInicial: 980,
    cantidadActual: 907,
    fechaInicio: "2024-01-20",
    raza: "Ross 308",
    estado: Status.ACTIVE, 
    pesoPromedio: 2.1,
    mortalidad: 7.4,
    observaciones: "Crecimiento dentro de parámetros esperados"
  },
  {
    id: "4",
    nombre: "Lote D - Nov 2023",
    cantidadInicial: 1200,
    cantidadActual: 0,
    fechaInicio: "2023-11-01",
    raza: "Cobb 500",
    estado: Status.DONE,
    pesoPromedio: 2.8,
    mortalidad: 5.2,
    observaciones: "Completado exitosamente. Buen rendimiento"
  }
]