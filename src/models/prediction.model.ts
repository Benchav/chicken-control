import { PredictionType } from "./predictionType.model";

export interface Prediccion {
  id: string;
  tipo: PredictionType;
  lote: string;
  fechaPrediccion: string;
  valor: number;
  confianza: number;
  descripcion: string;
}