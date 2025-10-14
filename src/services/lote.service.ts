import { lotesData, setLotesData } from "@/data/lotes.data";
import { Lote } from "@/models/lote.model";
import { generateId } from "@/utils/generateId";

const LoteService = {

  getAll: async (): Promise<Lote[]> => {
    return [...lotesData];
  },

  getById: async (id: string): Promise<Lote | undefined> => {
    return lotesData.find((lote) => lote.id === id);
  },

  create: async (newLote: Omit<Lote, "id">): Promise<Lote> => {
    const id = generateId();
    const lote: Lote = { id, ...newLote };
    setLotesData([...lotesData, lote]);
    return lote;
  },

  update: async (id: string, updatedData: Partial<Lote>): Promise<Lote | null> => {
    const index = lotesData.findIndex((lote) => lote.id === id);
    if (index === -1) return null;

    const updatedList = [...lotesData];
    updatedList[index] = { ...updatedList[index], ...updatedData };
    setLotesData(updatedList);
    return updatedList[index];
  },

  delete: async (id: string): Promise<boolean> => {
    const filtered = lotesData.filter((lote) => lote.id !== id);
    const changed = filtered.length < lotesData.length;
    setLotesData(filtered);
    return changed;
  },

  reset: async (): Promise<void> => {
    setLotesData([...lotesData]);
  },
};

export default LoteService;
