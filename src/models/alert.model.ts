import { AlertPriority } from "./alertPriority.model";
import { AlertStatus } from "./alertStatus.model";
import { AlertType } from "./alertType.model";

export interface Alerta {
  id: string;
  tipo:AlertType;
  prioridad: AlertPriority;
  titulo: string;
  descripcion: string;
  lote?: string;
  fechaCreacion: string;
  fechaVencimiento?: string;
  estado: AlertStatus;
  accionesRecomendadas: string[];
  parametros?: {
    valorActual?: number;
    valorEsperado?: number;
    unidad?: string;
  };
}