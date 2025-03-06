import { AxiosError } from "axios";

type ErrorHandlers = {
    onBadRequest?: (message: string) => void;
    onUnauthorized?: () => void;
    onSpecificMessage?: (message: string) => boolean;
    onNetworkError?: () => void;
    onDefault?: (message?: string) => void;
    setErrorState?: (message: string) => void;
};

/**
 * Try to handle an API error and call the appropriate handler
 * @param error
 * @param handlers
 * @returns void
 */
export const handleApiError = (error: unknown, handlers: ErrorHandlers): void => {
    // Log the error when debugging
    console.error("API Error:", error);

    if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        error.response &&
        typeof error.response === "object"
    ) {
        const axiosError = error as AxiosError<string>;
        const status = axiosError.response?.status;
        const errorData = axiosError.response?.data ? String(axiosError.response.data) : "Unknown error";

        // Handle based on HTTP status
        if (status === 400 && handlers.onBadRequest) {
            handlers.onBadRequest(errorData);
            return;
        } else if (status === 401 && handlers.onUnauthorized) {
            handlers.onUnauthorized();
            return;
        }

        if (handlers.onSpecificMessage && handlers.onSpecificMessage(errorData)) {
            return;
        }

        if (handlers.setErrorState) {
            handlers.setErrorState(`Error (${status}): ${errorData}`);
        } else if (handlers.onDefault) {
            handlers.onDefault(errorData);
        } else {
            alert(`Request failed with status: ${status}. ${errorData}`);
        }
    } else if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
        const message = error.message;

        if (message === "Network Error" && handlers.onNetworkError) {
            handlers.onNetworkError();
            return;
        }

        if (handlers.setErrorState) {
            handlers.setErrorState(message);
        } else if (handlers.onDefault) {
            handlers.onDefault(message);
        } else {
            alert(`Error: ${message}`);
        }
    } else {
        if (handlers.onDefault) {
            handlers.onDefault();
        } else {
            alert("An unexpected error occurred. Please try again later.");
        }
    }
};
