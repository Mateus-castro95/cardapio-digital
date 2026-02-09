<template>
  <div class="min-h-screen flex items-center justify-center bg-bege-cream p-6 relative overflow-hidden">
    <!-- Círculos Decorativos de Fundo -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-cafe-dark/5 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-moca/5 rounded-full blur-3xl"></div>

    <div class="w-full max-w-[440px] z-10">
      <!-- Logo / Título -->
      <div class="text-center mb-10 animate-fade-in-up">
        <div class="w-20 h-20 bg-cafe text-branco rounded-[2.5rem] flex items-center justify-center text-4xl shadow-premium mx-auto mb-6 transform hover:rotate-12 transition-transform duration-500">
          🥟
        </div>
        <h1 class="text-heading-1 text-cafe mb-2 font-black leading-none">Pastel <span class="text-moca">Hora</span></h1>
        <p class="text-body-lg text-bege-torrado font-bold">Painel Administrativo</p>
      </div>

      <!-- Card de Login -->
      <div class="bg-branco rounded-[3rem] p-8 sm:p-12 shadow-premium border border-bege-soft/50 animate-fade-in-up delay-100">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label for="email" class="text-xs font-black text-cafe uppercase tracking-widest px-1">E-mail</label>
            <div class="relative group">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-bege-torrado group-focus-within:text-moca transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </span>
              <input 
                id="email"
                v-model="email" 
                type="email" 
                placeholder="seu@email.com"
                required
                class="w-full pl-12 pr-4 py-4 bg-bege-cream/30 border-2 border-bege-soft/50 rounded-2xl outline-none focus:border-moca/50 focus:bg-white transition-all text-cafe font-bold placeholder:text-bege-torrado/50"
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input 
                id="password"
                v-model="password" 
                type="password" 
                placeholder="••••••••"
                required
                class="w-full pl-12 pr-4 py-4 bg-bege-cream/30 border-2 border-bege-soft/50 rounded-2xl outline-none focus:border-moca/50 focus:bg-white transition-all text-cafe font-bold placeholder:text-bege-torrado/50"
              />
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-4 bg-cafe text-branco rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-cafe/20 hover:bg-cafe-dark hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <span v-if="loading" class="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></span>
            <span v-else>Entrar no Sistema</span>
            <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </form>

        <p class="mt-8 text-center text-[10px] text-bege-torrado font-bold uppercase tracking-widest leading-loose">
          Acesso restrito a colaboradores autorizados.<br>
          © 2024 Pastel Hora • Gestão Digital
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
