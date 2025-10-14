import { Lote } from "@/models/lote.model";
import { Pollo } from "@/models/pollo.model";

export type ChickenContextType = {
  pollos: Pollo[];
  loadingPollos: boolean;
  errorPollos?: string;
  fetchPollos: () => Promise<void>;
  createPollo: (newPollo: Omit<Pollo, "id">) => Promise<void>;
  updatePollo: (id: string, updatedData: Partial<Pollo>) => Promise<void>;
  deletePollo: (id: string) => Promise<void>;
};

export type LoteContextType = {
  lotes: Lote[];
  loadingLotes: boolean;
  errorLotes?: string;
  fetchLotes: () => Promise<void>;
  addLote: (lote: Omit<Lote, "id">) => Promise<void>;
  updateLote: (lote: Lote) => Promise<void>;
  deleteLote: (id: string) => Promise<void>;
};
