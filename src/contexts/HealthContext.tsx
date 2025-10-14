import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { RegistroSalud } from "@/models/healthRegister.model";
import { HealthContextType } from "./TypesContext";
import RegistroSaludService from "@/services/health.service";

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [healths, setHealths] = useState<RegistroSalud[]>([]);
  const [loadingHealths, setLoading] = useState<boolean>(false);
  const [errorHealths, setError] = useState<string>();

  const fetchHealths = useCallback(async () => {
    setLoading(true);
    try {
      const allHealths = await RegistroSaludService.getAll();
      setHealths(allHealths);
    } catch (error) {
      setError("Error fetching health records: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addHealth = async (data: Omit<RegistroSalud, "id">) => {
    const newRecord = await RegistroSaludService.create(data);
    setHealths((prev) => [...prev, newRecord]);
  };

  const updateHealth = async (data: RegistroSalud) => {
    const updated = await RegistroSaludService.update(data.id, data);
    if (updated) {
      setHealths((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    }
  };

  const deleteHealth = async (id: string) => {
    const deleted = await RegistroSaludService.delete(id);
    if (deleted) {
      setHealths((prev) => prev.filter((h) => h.id !== id));
    }
  };

  useEffect(() => {
    fetchHealths();
  }, [fetchHealths]);

  return (
    <HealthContext.Provider
      value={{ healths, loadingHealths, errorHealths, fetchHealths, addHealth, updateHealth, deleteHealth }}
    >
      {children}
    </HealthContext.Provider>
  );
};

export const useHealthContext = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error("useHealthContext must be used within a HealthProvider");
  }
  return context;
};
