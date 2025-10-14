import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alerta } from "@/models/alert.model";
import { AlertContextType } from "./TypesContext";
import AlertService from "@/services/alert.service";

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alerta[]>([]);
  const [loadingAlerts, setLoading] = useState<boolean>(false);
  const [errorAlerts, setError] = useState<string>();

  // 🔹 Obtener todas las alertas
  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const allAlerts = await AlertService.getAll();
      setAlerts(allAlerts);
    } catch (error) {
      setError("Error fetching alerts: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Crear nueva alerta
  const addAlert = async (alertData: Omit<Alerta, "id">) => {
    const newAlert = await AlertService.create(alertData);
    setAlerts((prev) => [...prev, newAlert]);
  };

  // 🔹 Actualizar alerta existente
  const updateAlert = async (alertData: Alerta) => {
    const updated = await AlertService.update(alertData.id, alertData);
    if (updated) {
      setAlerts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    }
  };

  // 🔹 Eliminar alerta
  const deleteAlert = async (id: string) => {
    const deleted = await AlertService.delete(id);
    if (deleted) {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // 🔹 Cargar alertas al montar
  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return (
    <AlertContext.Provider
      value={{
        alerts,
        loadingAlerts,
        errorAlerts,
        fetchAlerts,
        addAlert,
        updateAlert,
        delete: deleteAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlertContext must be used within an AlertProvider");
  }
  return context;
};
