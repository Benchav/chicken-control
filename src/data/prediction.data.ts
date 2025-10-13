import { Prediccion } from "@/models/prediction.model";
import { PredictionType } from "@/models/predictionType.model";

export const prediccionesData: Prediccion[] = [
  {
    id: "1",
    tipo: PredictionType.SACRIFICE,
    lote: "Lote B - Dic 2023",
    fechaPrediccion: "2024-02-25",
    valor: 2.65,
    confianza: 92,
    descripcion: "Peso óptimo para sacrificio alcanzado en 5 días",
  },
  {
    id: "2",
    tipo: PredictionType.WEIGHT,
    lote: "Lote A - Ene 2024",
    fechaPrediccion: "2024-03-15",
    valor: 2.4,
    confianza: 87,
    descripcion: "Peso esperado de 2.4kg en 3 semanas",
  },
  {
    id: "3",
    tipo: PredictionType.CONVERSION,
    lote: "Lote C - Ene 2024",
    fechaPrediccion: "2024-03-01",
    valor: 1.85,
    confianza: 78,
    descripcion: "Conversión alimenticia proyectada: 1.85:1",
  },
];