import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Lote } from "@/models/lote.model";
import { LoteContextType } from "./TypesContext";
import LoteService from "@/services/lote.service";

const LoteContext = createContext<LoteContextType | undefined>(undefined);

export const LoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loadingLotes, setLoading] = useState<boolean>(false);
  const [errorLotes, setError] = useState<string>();

  const fetchLotes = useCallback(async () => {
    setLoading(true);
    try {
      const allLotes = await LoteService.getAll();
      setLotes(allLotes);
    } catch (error) {
      setError("Error fetching lotes: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLotes();
  }, [fetchLotes]);

  return (
    <LoteContext.Provider value={{ lotes, loadingLotes, errorLotes, fetchLotes }}>
      {children}
    </LoteContext.Provider>
  );
};

export const useLoteContext = () => {
  const context = useContext(LoteContext);
  if (!context) {
    throw new Error("useLoteContext must be used within a LoteProvider");
  }
  return context;
};
