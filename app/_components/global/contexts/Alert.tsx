"use client";

import { GlobalAlert } from "@/app/_components/global/Alert";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AlertType = "default" | "destructive";

interface AlertState {
  title?: string;
  message: string;
  type?: AlertType;
  duration?: number;
}

interface AlertContextType {
  showAlert: (alert: AlertState) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = ({
    message,
    type = "default",
    duration = 2000,
  }: AlertState) => {
    setAlert({ message, type, duration });
  };

  useEffect(() => {
    if (!alert) return;

    const timer = setTimeout(() => {
      setAlert(null);
    }, alert.duration);

    return () => clearTimeout(timer);
  }, [alert]);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && <GlobalAlert {...alert} />}
    </AlertContext.Provider>
  );
}

export function useGlobalAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useGlobalAlert must be used inside AlertProvider");
  }
  return context;
}
