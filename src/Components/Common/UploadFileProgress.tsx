import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ReactCrop, { type Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Upload04Icon,
  Image02Icon,
  MoreVerticalCircle02Icon,
  CancelCircleIcon
} from "@hugeicons-pro/core-stroke-standard";
import axios, { AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";
import { CustomTooltip } from "./";

type DropzoneAccept = string[];

type UploadFileProgressProps = {
  fileExtensions?: string[];
  onFilesChange?: (files: File[]) => void;
  onUploadSuccess?: (files: File[]) => void;
  showContainer?: boolean;
  invalid?: boolean;
  error?: any;
};

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const UploadFileProgress = ({ fileExtensions, onFilesChange, onUploadSuccess, showContainer = true, invalid, error}: UploadFileProgressProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "cropping"
  >("idle");
  const [imgSrc, setImgSrc] = useState("");
  const [uploadPreviewSrc, setUploadPreviewSrc] = useState<string>("");
  const [isCropped, setIsCropped] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const uploadAbortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const image = imgRef.current;
    const canvas = previewCanvasRef.current;

    if (!completedCrop || !canvas || !image) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const pixelRatio = window.devicePixelRatio;
    canvas.width = completedCrop.width * pixelRatio;
    canvas.height = completedCrop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
  }, [completedCrop]);

  const DEFAULT_FILE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif"];

  const MIME_BY_EXTENSION: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".csv": "text/csv",
    ".mp4": "video/mp4",
".txt": "text/plain",
".html": "text/html",
".htm": "text/html",
  };

  const buildAccept = (extensions: string[]): DropzoneAccept => {
    return extensions
      .map((extension) => {
        const normalizedExtension = extension.toLowerCase().startsWith(".")
          ? extension.toLowerCase()
          : `.${extension.toLowerCase()}`;

        return MIME_BY_EXTENSION[normalizedExtension];
      })
      .filter(Boolean) as string[];
  };

  const isImageFile = (file: File) => file.type.startsWith("image/");

  const uploadFile = async (fileToUpload: File | Blob) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);

    uploadAbortControllerRef.current = new AbortController();
    const signal = uploadAbortControllerRef.current.signal;

    const mockAxiosPost = (
      url: string,
      data: FormData,
      config: {
        headers: { [key: string]: string };
        onUploadProgress: (progressEvent: Partial<AxiosProgressEvent>) => void;
      }
    ) => {
      return new Promise((resolve, reject) => {
        if (signal.aborted) {
          return reject(new DOMException("Aborted", "AbortError"));
        }

        let loaded = 0;
        const total =
          fileToUpload instanceof File
            ? fileToUpload.size
            : new Blob([fileToUpload]).size;
        const interval = setInterval(() => {
          if (signal.aborted) {
            clearInterval(interval);
            return reject(new DOMException("Aborted", "AbortError"));
          }
          loaded += total / 10;
          if (loaded >= total) {
            loaded = total;
            clearInterval(interval);
            resolve({ status: 200 });
          }
          config.onUploadProgress({ loaded, total });
        }, 600);

        signal.addEventListener("abort", () => {
          clearInterval(interval);
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    };

    try {
      const response = await mockAxiosPost("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent: Partial<AxiosProgressEvent>) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              ((progressEvent.loaded ?? 0) * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        }
      });

      if ((response as { status: number }).status === 200) {
        setStatus("success");
        const completedFile =
          fileToUpload instanceof File ? fileToUpload : file;
        if (completedFile) {
          onUploadSuccess?.([completedFile]);
        }
        // toast.success("Upload success");
      } else {
        setStatus("idle");
        toast.error("Upload failed");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Upload aborted");
      } else {
        console.error("Upload error:", error);
        setStatus("idle");
        toast.error("Upload failed");
      }
    } finally {
      uploadAbortControllerRef.current = null;
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.length) {
      const currentFile = acceptedFiles[0];
      setFile(currentFile);
      onFilesChange?.([currentFile]);
      setCrop(undefined);
      setCompletedCrop(undefined);
      setUploadPreviewSrc("");
      setImgSrc("");
      setIsCropped(false);
      setProgress(0);
      if (isImageFile(currentFile)) {
        const reader = new FileReader();
        reader.addEventListener("load", () =>
          setImgSrc(reader.result?.toString() || "")
        );
        reader.readAsDataURL(currentFile);
        setStatus("cropping");
      } else {
        setStatus("uploading");
        uploadFile(currentFile);
      }
    }
  }, [onFilesChange]);
  const allowedFileExtensions = useMemo(
    () => (fileExtensions?.length ? fileExtensions : DEFAULT_FILE_EXTENSIONS),
    [fileExtensions]
  );

  const acceptedFileTypes = useMemo(
    () => buildAccept(allowedFileExtensions),
    [allowedFileExtensions]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: false
  });

  const handleUploadCroppedImage = useCallback(async () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) {
      throw new Error("Crop canvas does not exist");
    }

    canvas.toBlob((blob) => {
      if (blob) {
        setUploadPreviewSrc(canvas.toDataURL("image/png"));
        setStatus("uploading");
        setIsCropped(true);
        setProgress(0);
        uploadFile(blob);
      }
    }, "image/png");
  }, []);

  const handleUploadOriginal = useCallback(() => {
    if (file) {
      setUploadPreviewSrc(isImageFile(file) ? URL.createObjectURL(file) : "");
      setStatus("uploading");
      setIsCropped(false);
      setProgress(0);
      uploadFile(file);
    }
  }, [file]);

  const handleCancel = useCallback(() => {
    if (uploadAbortControllerRef.current) {
      uploadAbortControllerRef.current.abort();
    }
    setFile(null);
    onFilesChange?.([]);
    setStatus("idle");
    setProgress(0);
    setImgSrc("");
    setUploadPreviewSrc("");
    setIsCropped(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, [onFilesChange]);

  const handleRemove = useCallback(() => {
    setFile(null);
    onFilesChange?.([]);
    setStatus("idle");
    setProgress(0);
    setImgSrc("");
    setUploadPreviewSrc("");
    setIsCropped(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, [onFilesChange]);

  const renderContent = useMemo(() => {
    switch (status) {
      case "cropping":
        return (
          <div className="tw-p-4 tw-border-2 tw-border-dashed tw-rounded-lg tw-bg-gray-100">
            <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-stretch tw-gap-x-4">
              <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full lg:tw-w-1/2">
                <div className="tw-flex tw-justify-center">
                  <ReactCrop
                    crop={crop}
                    onChange={(pixelCrop, percentCrop) => {
                      setCrop(percentCrop);
                      if (pixelCrop.width > 0 && pixelCrop.height > 0) {
                        setCompletedCrop(pixelCrop);
                      }
                    }}
                    onComplete={(c) => {
                      if (c.width > 0 && c.height > 0) {
                        setCompletedCrop(c);
                      }
                    }}
                  >
                    <img
                      ref={imgRef}
                      src={imgSrc}
                      alt="Source"
                      style={{ maxHeight: "50vh", borderRadius: "8px" }}
                    />
                  </ReactCrop>
                </div>
              </div>

              <div className="tw-w-full lg:tw-w-1/2 tw-mt-4 lg:tw-mt-0 tw-flex tw-flex-col">
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-h-full tw-text-gray-500 tw-bg-gray-50 tw-border-2 tw-border-dashed tw-rounded-lg tw-py-1">
                  {!!completedCrop ? (
                    <canvas
                      ref={previewCanvasRef}
                      style={{
                        objectFit: "contain",
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: completedCrop.width,
                        height: completedCrop.height,
                        borderRadius: "8px"
                      }}
                    />
                  ) : (
                    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-h-full tw-text-gray-500">
                      <HugeiconsIcon
                        icon={Image02Icon}
                        size={48}
                        className="tw-text-gray-400 tw-mb-3"
                      />
                      <p className="tw-text-center tw-text-sm">
                        Crop the image to see a preview here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="tw-flex tw-justify-center tw-space-x-4 tw-mt-4">
              <button
                onClick={handleUploadCroppedImage}
                disabled={!completedCrop}
                className="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded-md disabled:tw-opacity-50"
              >
                Crop & Upload
              </button>
              <button
                onClick={handleUploadOriginal}
                className="tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded-md"
              >
                Upload Original
              </button>
              <button
                onClick={handleCancel}
                className="tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      case "uploading":
        return (
          <div className="tw-p-4 tw-border-2 tw-border-dashed tw-rounded-lg tw-bg-green-400/5 tw-border-green-500">
            <div className="tw-flex tw-items-center tw-space-x-4">
              <div className="tw-shrink-0">
                {uploadPreviewSrc ? (
                  <img
                    src={uploadPreviewSrc}
                    alt="Preview"
                    className="tw-w-12 tw-h-12 tw-rounded-md tw-object-cover"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={Image02Icon}
                    size={30}
                    className="tw-text-gray-500"
                  />
                )}
              </div>
              <div className="tw-flex-1 tw-min-w-0">
                <p className="tw-text-sm tw-font-medium tw-text-gray-900 tw-truncate m-1">
                  {file?.name}
                  <span className="tw-text-gray-500 tw-ml-1">
                    ({isCropped ? "Cropped" : "Original"})
                  </span>
                </p>
                <p className="tw-text-xs tw-text-gray-500 m-1">
                  {file ? formatBytes(file.size) : ""}
                </p>
                <div className="tw-flex tw-items-center tw-space-x-3 tw-mt-2">
                  <div className="tw-flex-1 tw-relative tw-h-8">
                    <div className="tw-absolute tw-top-1/2 -tw-translate-y-1/2 tw-h-4 tw-w-full tw-bg-[#d5cebd] tw-rounded-full tw-shadow-inner"></div>
                    <div
                      className="tw-absolute tw-top-1/2 -tw-translate-y-1/2 tw-h-4 tw-bg-green-600 tw-rounded-full"
                      style={{ width: `${progress}%` }}
                    >
                      <div
                        className="tw-w-full tw-h-full"
                        style={{
                          backgroundImage:
                            "linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent)",
                          backgroundSize: "20px 20px"
                        }}
                      ></div>
                    </div>
                    <div
                      className="tw-absolute tw-top-1/2 tw-transition-all tw-duration-150"
                      style={{
                        left: `${progress}%`,
                        transform: "translate(-50%, -50%)"
                      }}
                    ></div>
                  </div>
                  <span className="tw-text-sm tw-font-semibold tw-text-gray-700 tw-w-6 tw-text-right">
                    {`${progress}%`}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="tw-bg-white tw-p-3 tw-border tw-border-gray-200 tw-rounded-lg">
            <div className="tw-flex tw-justify-between tw-items-center">
              <div className="tw-flex tw-items-center tw-space-x-3">
                <div className="tw-shrink-0">
                  <HugeiconsIcon
                    icon={Image02Icon}
                    size={30}
                    className="tw-text-gray-500"
                  />
                </div>
                <div>
                  <p className="tw-text-sm tw-font-medium tw-text-gray-900 tw-truncate m-1">
                    {file?.name}
                  </p>
                  <p className="tw-text-xs tw-text-gray-500 m-1">
                    {file ? formatBytes(file.size) : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                data-tooltip-id="Remove"
                className="tw-p-1 hover:tw-bg-gray-100 tw-rounded-full"
              >
                <HugeiconsIcon
                  // icon={MoreVerticalCircle02Icon}
                  icon={CancelCircleIcon}
                  size={24}
                  className="tw-text-gray-500"
                />
              </button>
              <CustomTooltip id="Remove" content="Remove" />
            </div>
          </div>
        );

      case "idle":
      default:
        return (
          <>
          <div
            {...getRootProps()}
            className="tw-p-4 tw-border-2 tw-border-dashed tw-rounded-lg tw-bg-green-400/5 tw-border-green-500 tw-max-h-[150px] tw-cursor-pointer"
          >
            <input {...getInputProps()} />
            <div className="tw-mx-auto tw-text-center">
              <HugeiconsIcon
                icon={Upload04Icon}
                size={40}
                className="tw-text-green-600 tw-pointer-events-none"
              />
            </div>
            <p className="tw-mt-1 tw-font-semibold tw-text-green-600 tw-mx-auto tw-text-center tw-text-lg">
              Upload File
            </p>
            <p className="tw-text-md tw-text-gray-500 tw-font-semibold tw-mx-auto tw-text-center m-0">
              Drag & Drop or{" "}
              <span className="tw-text-blue-500">Click to Browse</span>
            </p>
            </div>
            {error && (
              <div className="tw-text-red-500 tw-text-sm tw-mt-2">
                {error}
              </div>
            )}
          </>
        );
    }
  }, [status, progress, file, getRootProps, getInputProps, handleCancel, handleRemove, imgSrc, crop, completedCrop, handleUploadCroppedImage, handleUploadOriginal, uploadPreviewSrc, isCropped]);

  if (!showContainer) {
    return <>{renderContent}</>;
  }

  return (
    <div className="tw-my-20 tw-mx-5 tw-bg-gray-200 tw-border tw-rounded-lg tw-py-8 tw-px-5">
      <h2 className="tw-text-base tw-font-semibold tw-text-gray-800">
        Downloadable Template
      </h2>
      <p className="tw-text-sm tw-text-gray-500 tw-mb-3">
        Provide a template or an example to assist learners in completing their
        assignment.
      </p>
      {renderContent}
    </div>
  );
};

export default UploadFileProgress;
