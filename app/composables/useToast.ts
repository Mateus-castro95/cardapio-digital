import { ref } from 'vue';

interface Toast {
    id: number;
    title: string;
    message?: string;
    type: 'success' | 'error' | 'warning';
    duration?: number;
}

const toasts = ref<Toast[]>([]);
let counter = 0;

export const useToast = () => {
    // Adiciona um novo toast à fila
    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = ++counter;
        const newToast = { ...toast, id };

        toasts.value.push(newToast);

        // Remove automaticamente após o tempo definido
        if (toast.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration || 3000);
        }
    };

    // Remove um toast específico pelo ID
    const removeToast = (id: number) => {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    };

    // Atalhos úteis
    const success = (title: string, message?: string) => addToast({ title, message, type: 'success' });
    const error = (title: string, message?: string) => addToast({ title, message, type: 'error' });
    const warning = (title: string, message?: string) => addToast({ title, message, type: 'warning' });

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning
    };
};
