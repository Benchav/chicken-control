import { Pollo } from "@/models/pollo.model";

export type ChickenContextType = {
  pollos: Pollo[];
  loadingPollos: boolean;
  errorPollos?: string;
  fetchPollos: () => Promise<void>;
  //fetchPollosByLote: (loteId: string) => Promise<void>;
};