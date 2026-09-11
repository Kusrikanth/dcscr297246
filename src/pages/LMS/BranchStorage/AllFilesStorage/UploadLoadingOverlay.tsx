import { useEffect, useState } from "react";

type UploadLoadingOverlayProps = {
  visible: boolean;
  title?: string;
  preparingTitle?: string;
  message?: string;
  progress?: number;
  isPreparing?: boolean;
  showProgress?: boolean;
};

const UploadLoadingOverlay = ({
  visible,
  title,
  preparingTitle,
  message,
  progress = 0,
  isPreparing = false,
  showProgress = true,
}: UploadLoadingOverlayProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setAnimatedProgress(0);
      return;
    }

    setAnimatedProgress(0);

    const duration = 8000;
    const interval = 100;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setAnimatedProgress((prev) => {
        const next = prev + increment;

        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }

        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  const normalizedProgress = Math.min(
    100,
    Math.max(0, Math.round(animatedProgress))
  );

  return (
    <div
      className="
        tw-absolute tw-inset-0 tw-z-50
        tw-flex tw-items-center tw-justify-center
        tw-rounded-lg tw-bg-slate-900/10
        tw-backdrop-blur-[2px]
      "
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="
          tw-w-[min(90%,380px)]
          tw-rounded-2xl
          tw-border tw-border-slate-200
          tw-bg-white tw-px-6 tw-py-5
          tw-text-center
          tw-shadow-[0_16px_40px_rgba(15,23,42,0.14)]
        "
      >
        <div
          className="
            tw-mx-auto tw-flex tw-h-12 tw-w-12
            tw-items-center tw-justify-center
            tw-rounded-full tw-bg-[#0ab39c]/10
          "
        >
          <svg
            className="tw-h-6 tw-w-6 tw-animate-spin tw-text-[#0ab39c]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="tw-opacity-20"
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
            />

            <path
              className="tw-opacity-90"
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h3 className="tw-mt-4 tw-text-base tw-font-semibold tw-text-slate-900">
          {isPreparing ? (preparingTitle || title) : title}
        </h3>

        <p className="tw-mt-1 tw-text-sm tw-leading-5 tw-text-slate-500">
          {message}
        </p>

        {showProgress && (
          <div className="tw-mt-5 tw-w-full">
            <div className="tw-h-1.5 tw-overflow-hidden tw-rounded-full tw-bg-slate-100">
              <div
                className="
                  tw-h-full tw-rounded-full tw-bg-[#0ab39c]
                  tw-transition-[width] tw-duration-100 tw-ease-linear
                "
                style={{ width: `${normalizedProgress}%` }}
              />
            </div>

            <div className="tw-mt-2 tw-flex tw-items-center tw-justify-between">
              <span className="tw-text-xs tw-text-slate-500">
                {isPreparing ? "Preparing…" : "Uploading…"}
              </span>

              <span className="tw-text-xs tw-font-semibold tw-text-[#0ab39c]">
                {normalizedProgress}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadLoadingOverlay;