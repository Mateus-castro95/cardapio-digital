<template>
  <div class="min-h-screen flex items-center justify-center bg-bege-cream p-6 relative overflow-hidden">
    <!-- Círculos Decorativos de Fundo -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-cafe-dark/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-moca/5 rounded-full blur-3xl"></div>

    <div class="w-full max-w-[440px] z-10">
      <!-- Logo / Título -->
      <div class="text-center mb-8 animate-fade-in-up">
        <div class="flex items-center justify-center mx-auto mb-5">
          <img 
            src="/logo-adega.webp" 
            alt="Adega Canoinhas" 
            class="h-36 sm:h-40 w-auto max-w-[320px] object-contain logo-adega-gold select-none" 
            style="filter: brightness(0) saturate(100%) invert(84%) sepia(28%) saturate(1088%) hue-rotate(357deg) brightness(97%) contrast(92%) !important;"
          />
        </div>
        <p class="text-xs font-black uppercase tracking-[0.25em] text-bege-torrado">Painel Administrativo</p>
      </div>

      <!-- Card de Login -->
      <div class="bg-branco rounded-[3rem] p-8 sm:p-12 shadow-premium border border-bege-soft/50 animate-fade-in-up delay-100">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label for="email" class="text-xs font-black text-cafe uppercase tracking-widest px-1">E-mail</label>
            <div class="relative group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-bege-torrado group-focus-within:text-moca transition-colors">
                <EnvelopeIcon class="w-5 h-5" />
              </span>
              <input 
                id="email"
                v-model="email" 
                type="email" 
                placeholder="seu@email.com"
                required
                class="w-full pl-12 pr-4 py-4 bg-[#18181C] border-2 border-bege-soft rounded-2xl outline-none focus:border-moca focus:bg-[#1C1C22] transition-all text-[#E2DACB] font-bold placeholder:text-bege-torrado/50"
              />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center px-1">
              <label for="password" class="text-xs font-black text-cafe uppercase tracking-widest">Senha</label>
              <!-- <a href="#" class="text-[10px] font-bold text-moca hover:underline">Esqueceu?</a> -->
            </div>
            <div class="relative group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-bege-torrado group-focus-within:text-moca transition-colors">
                <LockClosedIcon class="w-5 h-5" />
              </span>
              <input 
                id="password"
                v-model="password" 
                type="password" 
                placeholder="••••••••"
                required
                class="w-full pl-12 pr-4 py-4 bg-[#18181C] border-2 border-bege-soft rounded-2xl outline-none focus:border-moca focus:bg-[#1C1C22] transition-all text-[#E2DACB] font-bold placeholder:text-bege-torrado/50"
              />
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-4 bg-cafe text-[#0A0A0C] rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-cafe/20 hover:bg-cafe-dark hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span v-if="loading" class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
            <span v-else>Entrar no Sistema</span>
            <ArrowRightIcon v-if="!loading" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p class="mt-8 text-center text-[10px] text-bege-torrado font-bold uppercase tracking-widest leading-loose">
          Acesso restrito a colaboradores autorizados.<br>
          © 2024 Adega Canoinhas • Gestão Digital
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from '#app';
import { useSupabaseClient } from '#imports';
import { useToast } from '~/composables/useToast';
import { useAuthStore } from '~/stores/auth';
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon, BuildingStorefrontIcon } from '@heroicons/vue/24/outline';

definePageMeta({
  layout: false // Já lidamos com isso no app.vue via isPublicRoute
});

const supabase = useSupabaseClient();
const router = useRouter();
const toast = useToast();

const email = ref('');
const password = ref('');
const loading = ref(false);

const authStore = useAuthStore();

const handleLogin = async () => {
  loading.value = true;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    // Carregar o perfil no Pinia ANTES de redirecionar
    await authStore.fetchPerfil();

    toast.success('Bem-vindo!', 'Login realizado com sucesso.');
    
    // Pequena pausa para garantir que o estado foi propagado
    setTimeout(() => {
      router.push('/');
    }, 100);
    
  } catch (error: any) {
    console.error('Erro de login:', error);
    toast.error('Opa!', error.message || 'E-mail ou senha inválidos.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.shadow-premium {
  box-shadow: 0 10px 40px -10px rgba(58, 38, 28, 0.12);
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.delay-100 {
  animation-delay: 0.1s;
}
</style>
