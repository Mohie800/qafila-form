"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { cn, formatFileSize } from "@/lib/utils";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";

export interface FileUploadProps {
  label?: string;
  error?: string;
  hint?: string;
  accept?: string;
  maxSize?: number;
  required?: boolean;
  onChange?: (file: File | null) => void;
  value?: File | null;
  fileType?: "image" | "pdf";
}

export function FileUpload({
  label,
  error,
  hint,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  required,
  onChange,
  value,
  fileType = "image",
}: FileUploadProps) {
  const t = useTranslations("fileUpload");
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File | null) => {
      if (file && fileType === "image") {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
      onChange?.(file);
    },
    [onChange, fileType],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        if (maxSize && file.size > maxSize) {
          return;
        }
        handleFile(file);
      }
    },
    [handleFile, maxSize],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        if (maxSize && file.size > maxSize) {
          return;
        }
        handleFile(file);
      }
    },
    [handleFile, maxSize],
  );

  const handleRemove = useCallback(() => {
    handleFile(null);
  }, [handleFile]);

  const defaultAccept =
    fileType === "image"
      ? "image/jpeg,image/png,image/svg+xml,image/webp"
      : "application/pdf";

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1.5">
          {label}
          {required && <span className="text-brand-secondary-3 ml-1">*</span>}
        </label>
      )}

      {value ? (
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed p-4",
            error ? "border-red-500" : "border-accent",
          )}
        >
          <div className="flex items-center gap-4">
            {fileType === "image" && preview ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-background-secondary flex-shrink-0">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-lg bg-background-secondary flex items-center justify-center flex-shrink-0">
                {fileType === "image" ? (
                  <ImageIcon className="w-8 h-8 text-text-gray" />
                ) : (
                  <FileText className="w-8 h-8 text-text-gray" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {value.name}
              </p>
              <p className="text-sm text-text-gray">
                {formatFileSize(value.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg hover:bg-background-secondary transition-colors duration-150"
            >
              <X className="w-5 h-5 text-text-gray" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={cn(
            "relative rounded-lg border-2 border-dashed p-8 text-center transition-colors duration-150 cursor-pointer",
            isDragging
              ? "border-accent bg-accent/5"
              : error
                ? "border-red-500"
                : "border-border",
          )}
        >
          <input
            type="file"
            accept={accept || defaultAccept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center">
              <Upload className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {t("dragDrop")}
              </p>
              <p className="text-sm text-text-gray mt-1">
                {t("maxSize")}: {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        </div>
      )}

      {hint && !error && (
        <p className="mt-1.5 text-sm text-text-gray">{hint}</p>
      )}
      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
