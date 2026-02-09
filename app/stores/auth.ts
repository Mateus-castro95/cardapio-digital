import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSupabaseUser, useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'

export const useAuthStore = defineStore('auth', () => {
    const user = useSupabaseUser()
    const supabase = useSupabaseClient<Database>()

    const perfil = ref<Database['public']['Tables']['perfis']['Row'] | null>(null)
    const loading = ref(false)

    // Getters
    const cargo = computed(() => perfil.value?.cargo || null)
    const isSuperAdmin = computed(() => cargo.value === 'super_admin')
    const isDono = computed(() => cargo.value === 'super_admin' || cargo.value === 'dono')
    const isCaixa = computed(() => isDono.value || cargo.value === 'caixa')
    const isCozinha = computed(() => isCaixa.value || cargo.value === 'cozinha')

    // Função para carregar os dados do perfil do banco
    async function fetchPerfil() {
        loading.value = true
        console.log('--- 🛡️ INICIANDO BUSCA DE PERFIL ---')

        try {
            // 1. Verificar usuário autenticado diretamente
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

            if (authError || !authUser) {
                console.warn('⚠️ Supabase Auth: Nenhum usuário ativo encontrado.', authError?.message)
                perfil.value = null
                return
            }

            console.log('👤 Usuário logado:', authUser.email, '(ID:', authUser.id, ')')

            // 2. Buscar perfil na tabela
            const { data, error } = await supabase
                .from('perfis')
                .select('*')
                .eq('id', authUser.id)
                .single()

            if (error) {
                console.error('❌ ERRO AO BUSCAR PERFIL NO BANCO:', error.code, error.message)
                perfil.value = null
                return
            }

            if (data) {
                console.log('✅ PERFIL CARREGADO COM SUCESSO:', data)
                perfil.value = data
            } else {
                console.warn('⚠️ Registro de perfil não encontrado para este UUID.')
                perfil.value = null
            }
        } catch (e) {
            console.error('❌ Erro inesperado no Store:', e)
            perfil.value = null
        } finally {
            loading.value = false
            console.log('--- 🏁 FIM DA BUSCA DE PERFIL ---')
        }
    }

    return {
        perfil,
        loading,
        cargo,
        isSuperAdmin,
        isDono,
        isCaixa,
        isCozinha,
        fetchPerfil
    }
})
