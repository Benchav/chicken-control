import { alertasData, setAlertsData } from "@/data/alert.data";
import { Alerta } from "@/models/alert.model";
import { generateId } from "@/utils/generateId";

const AlertService = {

  getAll: async (): Promise<Alerta[]> => {
    return [...alertasData];
  },

  getById: async (id: string): Promise<Alerta | undefined> => {
    return alertasData.find((alerta) => alerta.id === id);
  },

  create: async (newAlert: Omit<Alerta, "id">): Promise<Alerta> => {
    const id = generateId();
    const alerta: Alerta = { id, ...newAlert };
    setAlertsData([...alertasData, alerta]);
    return alerta;
  },

  update: async (id: string, updatedData: Partial<Alerta>): Promise<Alerta | null> => {
    const index = alertasData.findIndex((alerta) => alerta.id === id);
    if (index === -1) return null;

    const updatedList = [...alertasData];
    updatedList[index] = { ...updatedList[index], ...updatedData };
    setAlertsData(updatedList);
    return updatedList[index];
  },

  delete: async (id: string): Promise<boolean> => {
    const filtered = alertasData.filter((alerta) => alerta.id !== id);
    const changed = filtered.length < alertasData.length;
    setAlertsData(filtered);
    return changed;
  },

  reset: async (): Promise<void> => {
    setAlertsData([...alertasData]);
  },
};

export default AlertService;
