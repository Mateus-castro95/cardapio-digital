<template>
  <div class="p-4 sm:p-8 max-w-5xl mx-auto min-h-screen bg-bege-cream/30">
    <!-- Cabeçalho -->
    <div class="mb-10 animate-fade-in-up">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-cafe text-branco rounded-2xl flex items-center justify-center text-2xl shadow-premium">
          ⚙️
        </div>
        <div>
          <h1 class="text-heading-2 sm:text-heading-1 text-cafe leading-none">Configurações</h1>
          <p class="text-caption sm:text-body-lg text-bege-torrado font-medium">Controle de acesso e equipe</p>
        </div>
      </div>
    </div>

    <!-- Gestão de Equipe -->
    <div class="bg-branco rounded-[2.5rem] p-6 sm:p-10 shadow-premium border border-bege-soft/50 animate-fade-in-up delay-100">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-lg font-black text-cafe uppercase tracking-widest">Colaboradores</h2>
          <p class="text-xs text-bege-torrado font-bold">Gerencie os acessos do seu time</p>
        </div>
        <div class="bg-bege-cream px-4 py-2 rounded-xl text-xs font-black text-cafe uppercase tracking-tighter shadow-inner">
          {{ perfis.length }} Usuários
        </div>
      </div>

      <!-- Lista de Usuários -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="w-10 h-10 border-4 border-moca/20 border-t-moca rounded-full animate-spin"></div>
        <p class="text-xs font-black text-bege-torrado uppercase tracking-widest">Carregando equipe...</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="perfil in perfis" 
          :key="perfil.id"
          class="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-bege-cream/20 hover:bg-bege-cream/40 rounded-3xl border border-bege-soft/30 transition-all duration-300"
        >
          <div class="flex items-center gap-5 mb-4 sm:mb-0">
            <div class="w-14 h-14 bg-branco rounded-2xl flex items-center justify-center text-xl shadow-sm border border-bege-soft group-hover:scale-105 transition-transform">
              👤
            </div>
            <div>
              <h3 class="font-black text-cafe uppercase text-sm tracking-tight">{{ perfil.nome }}</h3>
              <p class="text-[11px] text-bege-torrado font-bold">{{ perfil.email }}</p>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- Badge de Cargo -->
            <div 
              class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm"
              :class="getCargoStyle(perfil.cargo)"
            >
              {{ perfil.cargo.replace('_', ' ') }}
            </div>

            <!-- Seletor de Cargo (Só visível para Super Admin/Dono) -->
            <div v-if="podeEditar(perfil)" class="relative">
              <select 
                :key="resetKey"
                @change="(e) => preHandleChangeCargo(perfil, (e.target as HTMLSelectElement).value as any)"
                class="appearance-none bg-cafe text-branco text-[10px] font-black uppercase tracking-widest pl-4 pr-10 py-2.5 rounded-xl cursor-pointer hover:bg-cafe-dark transition-all outline-none border-none shadow-premium"
              >
                <option value="" disabled selected>Alterar Cargo</option>
                <option v-for="c in cargosDisponiveis" :key="c" :value="c">
                  Mudar para {{ c.replace('_', ' ') }}
                </option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-bege-claro">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação Personalizado -->
    <ModalConfirmacao
      :show="confirmModal.show"
      title="Alterar Permissão"
      :message="confirmModal.message"
      confirmLabel="Confirmar Alteração"
      variant="primary"
      @confirm="handleConfirmCargo"
      @cancel="handleCancelCargo"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { usePerfis, type Cargo, type Perfil } from '~/composables/usePerfis';
import { useAuthStore } from '~/stores/auth';
import { useToast } from '~/composables/useToast';
import ModalConfirmacao from '~/components/ModalConfirmacao.vue';

const { perfis, loading, fetchPerfis, updateCargo } = usePerfis();
const authStore = useAuthStore();
const toast = useToast();

const cargosDisponiveis: Cargo[] = ['super_admin', 'dono', 'caixa', 'cozinha'];

// Chave para forçar o reset do componente Select se a ação for cancelada
const resetKey = ref(0);

// Estado do Modal de Confirmação
const confirmModal = reactive({
  show: false,
  message: '',
  perfil: null as Perfil | null,
  novoCargo: '' as Cargo | ''
});

onMounted(() => {
  fetchPerfis();
});

const getCargoStyle = (cargo: string) => {
  switch (cargo) {
    case 'super_admin': return 'bg-red-100 text-red-700 border border-red-200';
    case 'dono': return 'bg-moca text-branco shadow-moca/20';
    case 'caixa': return 'bg-cafe text-branco shadow-cafe/20';
    case 'cozinha': return 'bg-bege-soft text-cafe border border-bege-torrado/20';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const podeEditar = (perfilAlvo: Perfil) => {
  if (authStore.isSuperAdmin) return true;
  if (authStore.cargo === 'dono' && perfilAlvo.cargo !== 'super_admin') return true;
  return false;
};

// Abre o modal de confirmação antes de mudar o cargo
const preHandleChangeCargo = (perfil: Perfil, novoCargo: Cargo) => {
  confirmModal.perfil = perfil;
  confirmModal.novoCargo = novoCargo;
  confirmModal.message = `Deseja realmente alterar o cargo de ${perfil.nome} para ${novoCargo.replace('_', ' ')}? Esta ação mudará as permissões de acesso do colaborador.`;
  confirmModal.show = true;
};

const handleCancelCargo = () => {
  confirmModal.show = false;
  // Incrementa a chave para "resetar" visualmente os selects para a opção default (índice 0)
  resetKey.value++;
};

// Executa a mudança após confirmação no modal
const handleConfirmCargo = async () => {
  if (!confirmModal.perfil || !confirmModal.novoCargo) return;

  const perfil = confirmModal.perfil;
  const novoCargo = confirmModal.novoCargo;
  
  confirmModal.show = false;
  
  const result = await updateCargo(perfil.id, novoCargo);
  if (result.success) {
    toast.success('Atualizado!', 'Cargo alterado com sucesso.');
  } else {
    toast.error('Erro', 'Não foi possível alterar o cargo.');
  }
  
  // Reseta o select após a conclusão (seja sucesso ou erro)
  resetKey.value++;
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
