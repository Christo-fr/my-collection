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
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: DialogProps) {
  return (
    <HeadlessDialog open={isOpen} onClose={onClose} className="relative z-50 ">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 z-10 overflow-y-auto flex min-h-full justify-center p-6">
        <DialogPanel
          transition
          className={`flex flex-col justify-start items-center w-full max-w-lg transition duration-300 ease-out data-[closed]:opacity-0 data-[closed]:scale-95 ${className}`}
        >
          <Button
            variant="secondary"
            onClick={onClose}
            className="fixed top-6 right-6 z-50 "
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
