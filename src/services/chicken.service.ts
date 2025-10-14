import { pollosData, setPollosData } from "@/data/pollos.data";
import { Pollo } from "@/models/pollo.model";
import { generateId } from "@/utils/generateId";

const ChickenService = {
  getAll: async (): Promise<Pollo[]> => {
    return [...pollosData];
  },

  getById: async (id: string): Promise<Pollo | undefined> => {
    return pollosData.find((pollo) => pollo.id === id);
  },

  create: async (newChicken: Omit<Pollo, "id">): Promise<Pollo> => {
    const id = generateId();
    const pollo: Pollo = { id, ...newChicken };
    setPollosData([...pollosData, pollo]);
    return pollo;
  },

  update: async (id: string, updatedData: Partial<Pollo>): Promise<Pollo | null> => {
    const index = pollosData.findIndex((pollo) => pollo.id === id);
    if (index === -1) return null;

    const updatedList = [...pollosData];
    updatedList[index] = { ...updatedList[index], ...updatedData };
    setPollosData(updatedList);
    return updatedList[index];
  },

  delete: async (id: string): Promise<boolean> => {
    const filtered = pollosData.filter((pollo) => pollo.id !== id);
    const changed = filtered.length < pollosData.length;
    setPollosData(filtered);
    return changed;
  },

  reset: async (): Promise<void> => {
    // Podrías recargar la data inicial desde un archivo si lo deseas
    setPollosData([...pollosData]);
  },
};

export default ChickenService;
