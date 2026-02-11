import { useCallback, useEffect, useState, type HTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { cn } from "./lib/utils";

export interface LightboxProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  images: Array<{ url: string; alt?: string }>;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  className,
  ...props
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Update current index when lightbox opens or initialIndex changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext, onClose]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentImage = images[currentIndex];
  const showNavigation = images.length > 1;

  if (!isOpen || images.length === 0) {
    return null;
  }

  if (!currentImage) {
    return null;
  }

  const lightboxContent = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/90",
        className
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery viewer"
      {...props}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Close lightbox"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Previous Button */}
      {showNavigation && (
        <button
          onClick={handlePrev}
          className="absolute left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous image"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Image Container */}
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={`${currentImage.url}-${currentIndex}`}
          src={currentImage.url}
          alt={currentImage.alt || `Image ${currentIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>

      {/* Next Button */}
      {showNavigation && (
        <button
          onClick={handleNext}
          className="absolute right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next image"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Image Counter */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}
