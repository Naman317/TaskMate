import { toast } from "sonner";

/**
 * Custom hook for standardized toast notifications
 * Uses 'sonner' as the underlying engine.
 */
export const useToast = () => {
  const success = (message, description = "") => {
    toast.success(message, {
      description,
    });
  };

  const error = (message, description = "") => {
    toast.error(message, {
      description,
    });
  };

  const info = (message, description = "") => {
    toast.info(message, {
      description,
    });
  };

  const warning = (message, description = "") => {
    toast.warning(message, {
      description,
    });
  };

  /**
   * Standardized promise toast for async operations
   * @param {Promise} promise - The async operation
   * @param {Object} handlers - Loading, success, and error handlers
   */
  const promise = (operation, { loading, success, error }) => {
    return toast.promise(operation, {
      loading: loading || "Processing...",
      success: (data) => {
        if (typeof success === "function") {
          return success(data);
        }
        return success || "Operation completed successfully";
      },
      error: (err) => {
        if (typeof error === "function") {
          return error(err);
        }
        return error || err?.response?.data?.message || err?.message || "Something went wrong";
      },
    });
  };

  /**
   * Action toast (e.g., Delete with Undo)
   */
  const action = (message, { label, onClick }) => {
    toast(message, {
      action: {
        label,
        onClick,
      },
    });
  };

  return {
    success,
    error,
    info,
    warning,
    promise,
    action,
  };
};

export default useToast;
