import { registrosData, setRegistrosData } from "@/data/healthRegister.data";
import { RegistroSalud } from "@/models/healthRegister.model";
import { generateId } from "@/utils/generateId";

const RegistroSaludService = {

  getAll: async (): Promise<RegistroSalud[]> => {
    return [...registrosData];
  },

  getById: async (id: string): Promise<RegistroSalud | undefined> => {
    return registrosData.find((r) => r.id === id);
  },

  create: async (newRegistro: Omit<RegistroSalud, "id">): Promise<RegistroSalud> => {
    const id = generateId();
    const registro: RegistroSalud = { id, ...newRegistro };
    setRegistrosData([...registrosData, registro]);
    return registro;
  },

  update: async (id: string, updatedData: Partial<RegistroSalud>): Promise<RegistroSalud | null> => {
    const index = registrosData.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const updatedList = [...registrosData];
    updatedList[index] = { ...updatedList[index], ...updatedData };
    setRegistrosData(updatedList);
    return updatedList[index];
  },

  delete: async (id: string): Promise<boolean> => {
    const filtered = registrosData.filter((r) => r.id !== id);
    const changed = filtered.length < registrosData.length;
    setRegistrosData(filtered);
    return changed;
  },

  reset: async (): Promise<void> => {
    setRegistrosData([...registrosData]);
  },
};

export default RegistroSaludService;
