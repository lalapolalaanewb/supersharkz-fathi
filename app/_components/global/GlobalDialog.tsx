"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as React from "react";

type Props = {
  title?: string;
  open: boolean;
  handleClose: () => void;
  handleSubmit?: (() => void) | (() => Promise<void>);
  width?: "small" | "medium" | "large";
  children?: React.ReactNode;
};

export function GlobalDialog({
  title,
  open,
  handleClose,
  handleSubmit,
  width = "medium",
  children,
}: Props) {
  const [loading, setLoading] = React.useState(false);

  const widthClass = {
    small: "sm:max-w-sm",
    medium: "sm:max-w-md",
    large: "sm:max-w-lg",
  }[width];

  async function onSubmit() {
    if (!handleSubmit) return;

    try {
      setLoading(true);
      await handleSubmit();
      handleClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className={widthClass}>
        <DialogHeader>
          <DialogTitle>{title ?? "Modal"}</DialogTitle>
          <DialogDescription>
            Make changes & click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{children}</div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          {handleSubmit && (
            <Button onClick={onSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
