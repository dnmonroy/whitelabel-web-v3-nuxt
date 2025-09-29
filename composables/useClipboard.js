// composables/useClipboard.ts
import { useNotifications } from './useNotifications';

export const useClipboard = () => {
    const { notify: showNotification } = useNotifications(); // Renombrado para claridad
    const { t } = useI18n();

    const copyToClipboard = async (text) => {
        if (!navigator.clipboard) {
            // Fallback para navegadores sin navigator.clipboard (muy raro hoy en día)
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed"; // Evitar scroll
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification(
                    t("buttons.confirm") || "Confirmed",
                    t("copied_to_clipboard_correctly") || "Copied to clipboard",
                    'success'
                );
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
                showNotification(
                    t("errors.title") || "Error",
                    t("errors.copy_failed") || "Failed to copy",
                    'danger'
                );
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(text);
            showNotification(
                t("buttons.confirm") || "Confirmed",
                t("copied_to_clipboard_correctly") || "Copied to clipboard",
                'success'
            );
        } catch (err) {
            console.error('Async: Could not copy text: ', err);
            showNotification(
                t("errors.title") || "Error",
                t("errors.copy_failed") || "Failed to copy",
                'danger'
            );
        }
    };

    return {
        copyToClipboard,
    };
};