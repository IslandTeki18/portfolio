import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
} from "react";
import { cva } from "class-variance-authority";
import { cn } from "./lib/utils";

// ─── FileUpload ────────────────────────────────────────────────────────────

const fileUploadVariants = cva(
  "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer",
  {
    variants: {
      state: {
        idle: "border-border hover:border-primary/50 hover:bg-muted/30",
        dragover: "border-primary bg-primary/5",
        uploading: "border-muted cursor-not-allowed opacity-60",
        error: "border-destructive bg-destructive/5",
      },
      size: {
        sm: "p-4 min-h-[100px]",
        md: "p-6 min-h-[140px]",
        lg: "p-8 min-h-[180px]",
      },
    },
    defaultVariants: {
      state: "idle",
      size: "md",
    },
  },
);

export interface FileUploadProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onDrop"> {
  label?: string;
  accept?: string;
  isUploading?: boolean;
  error?: string;
  helperText?: string;
  onFileSelect: (file: File) => void;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      label,
      accept,
      isUploading = false,
      error,
      helperText,
      onFileSelect,
      required,
      fullWidth,
      disabled,
      size = "md",
      className,
      ...props
    },
    ref,
  ) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const state = isUploading
      ? "uploading"
      : error
        ? "error"
        : isDragOver
          ? "dragover"
          : "idle";

    const handleDragOver = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled && !isUploading) setIsDragOver(true);
      },
      [disabled, isUploading],
    );

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleDrop = useCallback(
      (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        if (disabled || isUploading) return;

        const file = e.dataTransfer.files[0];
        if (file) onFileSelect(file);
      },
      [disabled, isUploading, onFileSelect],
    );

    const handleClick = useCallback(() => {
      if (!disabled && !isUploading) {
        inputRef.current?.click();
      }
    }, [disabled, isUploading]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
        // Reset input so same file can be re-selected
        e.target.value = "";
      },
      [onFileSelect],
    );

    return (
      <div className={cn(fullWidth && "w-full", className)} ref={ref} {...props}>
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}

        <div
          className={cn(fileUploadVariants({ state, size }))}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleClick();
            }
          }}
          aria-disabled={disabled || isUploading}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleInputChange}
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadSpinner />
              <span className="text-sm">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadIcon />
              <span className="text-sm">
                Drop file here or <span className="text-primary font-medium">browse</span>
              </span>
              {accept && (
                <span className="text-xs text-muted-foreground/70">
                  Accepted: {accept}
                </span>
              )}
            </div>
          )}
        </div>

        {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";

// ─── ImagePreview ──────────────────────────────────────────────────────────

const imagePreviewSizes = {
  sm: "h-16 w-16",
  md: "h-24 w-24",
  lg: "h-40 w-40",
} as const;

export interface ImagePreviewProps extends HTMLAttributes<HTMLDivElement> {
  url: string;
  alt?: string;
  onRemove?: () => void;
  size?: keyof typeof imagePreviewSizes;
}

export const ImagePreview = forwardRef<HTMLDivElement, ImagePreviewProps>(
  ({ url, alt = "Preview", onRemove, size = "md", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-block overflow-hidden rounded-lg border border-border",
          imagePreviewSizes[size],
          className,
        )}
        {...props}
      >
        <img
          src={url}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs hover:bg-destructive/80 transition-colors"
            aria-label="Remove image"
          >
            &times;
          </button>
        )}
      </div>
    );
  },
);

ImagePreview.displayName = "ImagePreview";

// ─── FileIndicator ─────────────────────────────────────────────────────────

export interface FileIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  fileName: string;
  url?: string;
  onRemove?: () => void;
}

export const FileIndicator = forwardRef<HTMLDivElement, FileIndicatorProps>(
  ({ fileName, url, onRemove, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3",
          className,
        )}
        {...props}
      >
        <FileIcon />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {fileName}
          </p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Download
            </a>
          )}
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            aria-label="Remove file"
          >
            &times;
          </button>
        )}
      </div>
    );
  },
);

FileIndicator.displayName = "FileIndicator";

// ─── Internal Icons ────────────────────────────────────────────────────────

function UploadIcon() {
  return (
    <svg
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}

function UploadSpinner() {
  return (
    <svg
      className="h-8 w-8 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      className="h-8 w-8 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}
