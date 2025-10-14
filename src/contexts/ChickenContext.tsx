import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ChickenContextType } from "./TypesContext";
import { Pollo } from "@/models/pollo.model";
import ChickenService from "@/services/chicken.service";

const PolloContext = createContext<ChickenContextType | undefined>(undefined);

export const PolloProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pollos, setPollos] = useState<Pollo[]>([]);
  const [loadingPollos, setLoading] = useState<boolean>(false);
  const [errorPollos, setError] = useState<string>();

  // Fetch inicial
  const fetchPollos = useCallback(async () => {
    setLoading(true);
    try {
      const allChickens = await ChickenService.getAll();
      setPollos(allChickens);
    } catch (error) {
      setError("Error fetching chickens: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPollos();
  }, [fetchPollos]);

  // ✅ Crear pollo
  const createPollo = async (newPollo: Omit<Pollo, "id">) => {
    setLoading(true);
    try {
      const created = await ChickenService.create(newPollo);
      setPollos(prev => [...prev, created]);
    } catch (error) {
      setError("Error creando pollo: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Actualizar pollo
  const updatePollo = async (id: string, updatedData: Partial<Pollo>) => {
    setLoading(true);
    try {
      const updated = await ChickenService.update(id, updatedData);
      if (updated) {
        setPollos(prev => prev.map(p => (p.id === id ? updated : p)));
      }
    } catch (error) {
      setError("Error actualizando pollo: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Eliminar pollo
  const deletePollo = async (id: string) => {
    setLoading(true);
    try {
      const deleted = await ChickenService.delete(id);
      if (deleted) {
        setPollos(prev => prev.filter(p => p.id !== id));
      }
    } catch (error) {
      setError("Error eliminando pollo: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PolloContext.Provider value={{
      pollos,
      loadingPollos,
      errorPollos,
      fetchPollos,
      createPollo,
      updatePollo,
      deletePollo
    }}>
      {children}
    </PolloContext.Provider>
  );
};

export const usePolloContext = () => {
  const context = useContext(PolloContext);
  if (!context) {
    throw new Error("usePolloContext must be used within a PolloProvider");
  }
  return context;
};
