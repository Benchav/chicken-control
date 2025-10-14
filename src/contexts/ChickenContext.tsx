import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ChickenContextType } from "./TypesContext";
import { Pollo } from "@/models/pollo.model";
import ChickenService from "@/services/chicken.service";

const PolloContext = createContext<ChickenContextType | undefined>(undefined);  

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pollos, setChickens] = useState<Pollo[]>([]);
  const [loadingPollos, setLoading] = useState<boolean>(false);
  const [errorPollos, setError] = useState<string>();

  const fetchPollos = useCallback(async () => {
    setLoading(true);
    try {
      const allChickens = await ChickenService.getAll();
      setChickens(allChickens);
    } catch (error) {
      setError("Error fetching chickens:" + error);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchPollos(); // Fetch pollos 
  }, []);

  return (
    <PolloContext.Provider value={{ pollos, errorPollos, loadingPollos, fetchPollos }}>
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