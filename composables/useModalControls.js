// composables/useModalControls.ts
import { useAppStore } from '@/stores/useAppStore';

export const useModalControls = () => {
    const appStore = useAppStore();

    const showLoginModal = () => {
        appStore.openLoginModal();
    };

    const closeLoginModal = () => {
        appStore.closeLoginModal();
    };

    const showRegisterModal = () => {
        appStore.openRegisterModal();
    };

    const closeRegisterModal = async () => {
        // La lógica de router.replace está ahora dentro de la acción del store
        await appStore.closeRegisterModal();
    };

    return {
        showLoginModal,
        closeLoginModal,
        showRegisterModal,
        closeRegisterModal,
    };
};