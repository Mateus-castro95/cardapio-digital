import { ref } from 'vue';

const isOpen = ref(false);
const imageUrl = ref('');

export const useLightbox = () => {
  const openLightbox = (url: string) => {
    if (!url) return;
    imageUrl.value = url;
    isOpen.value = true;
  };

  const closeLightbox = () => {
    isOpen.value = false;
    setTimeout(() => {
      imageUrl.value = '';
    }, 300); // Aguarda a animação de saída antes de limpar
  };

  return {
    isOpen,
    imageUrl,
    openLightbox,
    closeLightbox
  };
};
