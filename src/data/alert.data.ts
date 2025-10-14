import { Alerta } from "@/models/alert.model";
import { AlertPriority } from "@/models/alertPriority.model";
import { AlertStatus } from "@/models/alertStatus.model";
import { AlertType } from "@/models/alertType.model";

export let alertasData: Alerta[] = [
  {
    id: "1",
    tipo: AlertType.HEALTH,
    prioridad: AlertPriority.HIGH,
    titulo: "Brote respiratorio detectado - Lote A",
    descripcion:
      "Incremento significativo de síntomas respiratorios en el 15% del lote. Posible infección viral.",
    lote: "Lote A - Ene 2024",
    fechaCreacion: "2024-02-20T08:30:00",
    fechaVencimiento: "2024-02-22T18:00:00",
    estado: AlertStatus.ACTIVE,
    accionesRecomendadas: [
      "Aislamiento inmediato de pollos afectados",
      "Consulta veterinaria urgente",
      "Mejora ventilación en galpón",
      "Monitoreo intensivo cada 4 horas",
    ],
    parametros: {
      valorActual: 15,
      valorEsperado: 3,
      unidad: "% pollos afectados",
    },
  },
  {
    id: "2",
    tipo: AlertType.PRODUCTION,
    prioridad: AlertPriority.MEDIUM,
    titulo: "Lote B listo para procesamiento",
    descripcion:
      "El Lote B ha alcanzado el peso objetivo de 2.5kg promedio. Programar sacrificio en 3-5 días.",
    lote: "Lote B - Dic 2023",
    fechaCreacion: "2024-02-19T14:15:00",
    fechaVencimiento: "2024-02-25T00:00:00",
    estado: AlertStatus.ACTIVE,
    accionesRecomendadas: [
      "Programar transporte a planta",
      "Preparar documentación sanitaria",
      "Realizar pesaje final",
      "Coordinar con procesadora",
    ],
    parametros: {
      valorActual: 2.5,
      valorEsperado: 2.5,
      unidad: "kg promedio",
    },
  },
  {
    id: "3",
    tipo: AlertType.MORTALITY,
    prioridad:AlertPriority.HIGH,
    titulo: "Mortalidad elevada - Lote C",
    descripcion:
      "La mortalidad ha superado el umbral del 5% en las últimas 48 horas.",
    lote: "Lote C - Ene 2024",
    fechaCreacion: "2024-02-19T16:45:00",
    estado:AlertStatus.ACTIVE,
    accionesRecomendadas: [
      "Revisión veterinaria inmediata",
      "Análisis de calidad del agua",
      "Verificación de temperatura ambiental",
      "Revisión del alimento",
    ],
    parametros: {
      valorActual: 7.2,
      valorEsperado: 5.0,
      unidad: "% mortalidad",
    },
  },
  {
    id: "4",
    tipo: AlertType.ATMOSPHERE,
    prioridad: AlertPriority.MEDIUM,
    titulo: "Temperatura fuera de rango - Galpón 2",
    descripcion:
      "La temperatura ha estado por encima de 28°C durante las últimas 6 horas.",
    fechaCreacion: "2024-02-20T11:00:00",
    estado: AlertStatus.ACTIVE,
    accionesRecomendadas: [
      "Verificar sistema de ventilación",
      "Ajustar extractores",
      "Revisar sensores de temperatura",
      "Activar nebulización si disponible",
    ],
    parametros: {
      valorActual: 29.5,
      valorEsperado: 25.0,
      unidad: "°C",
    },
  },
];

export function setAlertsData(newData: Alerta[]) {
  alertasData = newData;
}