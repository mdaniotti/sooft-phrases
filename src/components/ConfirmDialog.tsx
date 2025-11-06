import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  // Save the element that had focus before opening the modal
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      // Focus the first focusable element after a short delay to ensure the modal is rendered
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 0);
    } else {
      // Restore focus to the previous element when closing
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Focus trap: keep focus within the modal
  const handleTabKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    []
  );

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleTabKey}
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close dialog"
            ref={lastFocusableRef}
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <p id="modal-description" className="modal-message">
            {message}
          </p>
        </div>
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="button-cancel"
            ref={firstFocusableRef}
          >
            {cancelText}
          </button>
          <button onClick={onConfirm} className="button-confirm">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmDialog.displayName = "ConfirmDialog";

export default ConfirmDialog;

