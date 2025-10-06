"use client";

// Standard packages
import { FC } from "react";

// Third-party packages
import clsx from "clsx";
import { Toaster, toast } from "sonner";
import { Button } from "./Button";

// Custom packages

// Queue management for toasts
let activeToasts: string[] = [];
const pendingToasts: Array<{
  id: string;
  config: object;
  resolve: (id: string) => void;
}> = [];
let isProcessingQueue = false;
const toastTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
const toastRefs: Map<string, string | number> = new Map(); // Store actual toast IDs
const toastStartTimes: Map<string, number> = new Map(); // Track when toast started
const toastDurations: Map<string, number> = new Map(); // Track original durations
const TOAST_HEIGHT = 80; // Approximate height of each toast
const TOAST_SPACING = 16; // Spacing between toasts
const BASE_TOP_POSITION = 20; // Base top position from screen top
const TOAST_INTERVAL = 300; // Time between toast appearances in milliseconds

const processToastQueue = async () => {
  if (isProcessingQueue || pendingToasts.length === 0) return;

  isProcessingQueue = true;

  while (pendingToasts.length > 0) {
    const toastItem = pendingToasts.shift();
    if (toastItem) {
      const actualId = await showToastImmediately(toastItem.config);
      toastItem.resolve(actualId);

      // Wait for the interval before processing next toast
      if (pendingToasts.length > 0) {
        // Dynamic interval: base interval + (remaining toasts * scaling factor)
        const remainingToasts = pendingToasts.length;
        const scalingFactor = 300; // Additional milliseconds per toast
        const dynamicInterval =
          TOAST_INTERVAL + remainingToasts * scalingFactor;

        await new Promise((resolve) => setTimeout(resolve, dynamicInterval));
      }
    }
  }

  isProcessingQueue = false;
};

const addToastToQueue = (id: string, duration: number = 2000) => {
  activeToasts.push(id);

  // Track start time and duration
  toastStartTimes.set(id, Date.now());
  toastDurations.set(id, duration);

  // Set up auto-cleanup timer
  const timer = setTimeout(() => {
    dismissToast(id);
  }, duration);
  toastTimers.set(id, timer);
};

const pauseToastTimer = (id: string) => {
  const timer = toastTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    toastTimers.delete(id);
  }
};

const resumeToastTimer = (id: string) => {
  const startTime = toastStartTimes.get(id);
  const originalDuration = toastDurations.get(id);

  if (startTime && originalDuration) {
    const elapsed = Date.now() - startTime;
    const remainingDuration = Math.max(0, originalDuration - elapsed);

    if (remainingDuration > 0) {
      const timer = setTimeout(() => {
        dismissToast(id);
      }, remainingDuration);
      toastTimers.set(id, timer);
    } else {
      // Duration already passed, dismiss immediately
      dismissToast(id);
    }
  }
};

const dismissToast = (stringId: string) => {
  // Get the actual toast ID and dismiss it
  const actualToastId = toastRefs.get(stringId);
  if (actualToastId !== undefined) {
    toast.dismiss(actualToastId);
    toastRefs.delete(stringId);
  }

  // Clean up all tracking data
  toastStartTimes.delete(stringId);
  toastDurations.delete(stringId);

  // Clean up from our queue
  removeToastFromQueue(stringId);
};

const removeToastFromQueue = (id: string) => {
  activeToasts = activeToasts.filter((toastId) => toastId !== id);

  // Clear the timer if it exists
  const timer = toastTimers.get(id);
  if (timer) {
    clearTimeout(timer);
    toastTimers.delete(id);
  }

  // Update positions of remaining toasts
  updateToastPositions();
};

const updateToastPositions = () => {
  // Force a re-render of all active toasts to update their positions
  activeToasts.forEach((id, index) => {
    const toastElement = document.querySelector(
      `[data-toast-id="${id}"]`
    ) as HTMLElement;
    if (toastElement) {
      const newTop = BASE_TOP_POSITION + index * (TOAST_HEIGHT + TOAST_SPACING);
      toastElement.style.top = `${newTop}px`;
    }
  });
};

const getToastPosition = (id: string) => {
  const index = activeToasts.indexOf(id);
  return BASE_TOP_POSITION + index * (TOAST_HEIGHT + TOAST_SPACING);
};

const showToastImmediately = (config: {
  title?: string;
  subTitle?: string;
  type?: "success" | "error" | "warning";
  buttonLabel?: string;
  onButtonClick?: () => void;
  duration?: number;
}) => {
  const {
    title = "",
    subTitle = "",
    type = "success",
    buttonLabel,
    onButtonClick,
    duration = 2000,
  } = config;

  return new Promise<string>((resolve) => {
    const toastId = toast.custom(
      (id: string | number) => {
        const stringId = String(id);

        // Store the actual toast ID for later dismissal
        toastRefs.set(stringId, id);

        // Add this toast to the queue when it's created
        if (!activeToasts.includes(stringId)) {
          addToastToQueue(stringId, duration);
        }

        const topPosition = getToastPosition(stringId);

        const handleDismiss = () => {
          dismissToast(stringId);
        };

        const handleMouseEnter = () => {
          pauseToastTimer(stringId);
        };

        const handleMouseLeave = () => {
          // Resume with accurate remaining duration
          resumeToastTimer(stringId);
        };

        // Resolve with the actual toast ID
        setTimeout(() => resolve(stringId), 0);

        return (
          <div
            data-toast-id={stringId}
            className={clsx([
              "w-[535px] px-4 py-3 gap-4 rounded-xl shadow-sm flex items-center bg-white transition-all duration-300 ease-in-out cursor-pointer hover:shadow-lg",
            ])}
            style={{
              minWidth: 535,
              maxWidth: "90vw", // Responsive on smaller screens
              position: "fixed",
              top: topPosition,
              left: "50%",
              transform: "translateX(-15%)",
              zIndex: 9999,
            }}
            onClick={handleDismiss}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div>
              {type === "success" ? (
                <img
                  src="/icons/success_toast.svg"
                  alt="success"
                  className="size-9"
                />
              ) : type === "error" ? (
                <img
                  src="/icons/error_toast.svg"
                  alt="error"
                  className="size-9"
                />
              ) : type === "warning" ? (
                <img
                  src="/icons/warning_toast.svg"
                  alt="warning"
                  className="size-9"
                />
              ) : null}
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <div className="text-label-medium text-grayscale-900">
                {title}
              </div>
              {subTitle && (
                <div
                  className="text-label-regular text-grayscale-700"
                  dangerouslySetInnerHTML={{ __html: subTitle }}
                />
              )}
            </div>
            {buttonLabel && (
              <Button
                className="ml-4 mt-1"
                variant="grayscale-text"
                size="medium"
                label={buttonLabel || "Button"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onButtonClick) onButtonClick();
                  handleDismiss();
                }}
              />
            )}
          </div>
        );
      },
      {
        duration: Infinity, // We handle duration ourselves
        dismissible: true,
      }
    );
  });
};

export const showCustomToast = ({
  title = "",
  subTitle = "",
  type = "success",
  buttonLabel,
  onButtonClick,
  duration = 2000,
}: {
  title?: string;
  subTitle?: string;
  type?: "success" | "error" | "warning";
  buttonLabel?: string;
  onButtonClick?: () => void;
  duration?: number;
} = {}) => {
  return new Promise<string>((resolve) => {
    const config = {
      title,
      subTitle,
      type,
      buttonLabel,
      onButtonClick,
      duration,
    };

    // Add to pending queue
    pendingToasts.push({
      id: Math.random().toString(36).substr(2, 9),
      config,
      resolve,
    });

    // Start processing queue
    processToastQueue();
  });
};

// Utility function to set custom toast interval
export const setToastInterval = (intervalMs: number) => {
  if (intervalMs >= 0) {
    // We can't modify the const, but we can create a new implementation
    // For now, users can modify TOAST_INTERVAL directly in the code
    console.warn(
      "To change toast interval, modify TOAST_INTERVAL constant in ToastProvider.tsx"
    );
  }
};

export const ToastProvider: FC = () => {
  return (
    <Toaster
      duration={Infinity}
      richColors
      position="top-center"
      toastOptions={{
        className: "w-full flex justify-center pointer-events-none",
        unstyled: true,
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          paddingTop: "20px",
        },
      }}
    />
  );
};

export default ToastProvider;
