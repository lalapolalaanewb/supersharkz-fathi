"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

interface Props {
  title?: string;
  message: string;
  type?: "default" | "destructive";
}

export function GlobalAlert({ title, message, type = "default" }: Props) {
  return (
    <div className="fixed top-5 right-5 z-50 w-[300px] animate-in fade-in slide-in-from-top-2">
      <Alert variant={type}>
        <AlertCircleIcon />
        <AlertTitle>{title ?? "Alert"}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
