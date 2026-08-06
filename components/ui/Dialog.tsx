import { useRef } from "react";
import {
  Description,
  Dialog as HeadlessDialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Button from "@/components/ui/Button";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  centered?: boolean;
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  maxWidth = "max-w-lg",
  centered = false,
}: DialogProps) {
  // 1. Référence sur le bouton de fermeture
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <HeadlessDialog
      open={isOpen}
      onClose={onClose}
      initialFocus={closeButtonRef}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition duration-300 ease-out data-[closed]:opacity-0"
      />
      <div
        className={`fixed inset-0 z-10 overflow-y-auto flex min-h-full justify-center p-6 ${
          centered ? "items-center" : "items-start pt-12"
        }`}
      >
        <DialogPanel
          transition
          className={`flex flex-col ${
            centered ? "justify-center" : "justify-start"
          } items-center w-full ${maxWidth} transition duration-300 ease-out data-[closed]:opacity-0 data-[closed]:scale-95 ${className}`}
        >
          <Button
            ref={closeButtonRef}
            variant="secondary"
            onClick={onClose}
            size="sm"
            className="fixed top-6 right-6 z-50"
          >
            <X className="w-6 h-6" />
          </Button>
          {title && <DialogTitle>{title}</DialogTitle>}
          {children}
        </DialogPanel>
      </div>
    </HeadlessDialog>
  );
}
