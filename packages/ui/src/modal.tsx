import { ReactNode, useEffect, useRef, forwardRef } from "react";
import { createPortal } from "react-dom";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./lib/utils";

const modalContentVariants = cva(
  "relative w-full bg-card rounded-lg shadow-xl max-h-[90vh] overflow-auto",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface ModalProps extends VariantProps<typeof modalContentVariants> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size,
      closeOnBackdropClick = true,
      closeOnEscape = true,
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && closeOnEscape) {
          onClose();
        }
      };

      if (isOpen) {
        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";
      }

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }, [isOpen, onClose, closeOnEscape]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    const modalContent = (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        <div
          ref={ref || modalRef}
          className={cn(modalContentVariants({ size }))}
        >
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 id="modal-title" className="text-xl font-semibold text-foreground">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="p-4">{children}</div>
        </div>
      </div>
    );

    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = "Modal";

export interface ModalHeaderProps {
  children: ReactNode;
}

export const ModalHeader = ({ children }: ModalHeaderProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-foreground">{children}</h3>
    </div>
  );
};

export interface ModalBodyProps {
  children: ReactNode;
}

export const ModalBody = ({ children }: ModalBodyProps) => {
  return <div className="text-muted-foreground">{children}</div>;
};

export interface ModalFooterProps {
  children: ReactNode;
}

export const ModalFooter = ({ children }: ModalFooterProps) => {
  return (
    <div className="mt-6 flex items-center justify-end gap-3">{children}</div>
  );
};
