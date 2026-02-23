import { useToast } from "../useToast";

export const useDashboardNotification = () => {
    const { showSuccess, showError } = useToast();

    return {
        showSuccess,
        showError,
    };
};
