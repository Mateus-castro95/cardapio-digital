import { ref } from 'vue'
import { useSupabaseClient } from '#imports'
import type { Database } from '~/types/database.types'

export type Perfil = Database['public']['Tables']['perfis']['Row']
export type Cargo = Database['public']['Enums']['cargo_colaborador']

export const usePerfis = () => {
    const supabase = useSupabaseClient<Database>()
    const perfis = ref<Perfil[]>([])
    const loading = ref(false)

    async function fetchPerfis() {
        loading.value = true
        try {
            const { data, error } = await supabase
                .from('perfis')
                .select('*')
                .order('nome', { ascending: true })

            if (error) throw error
            perfis.value = data || []
        } catch (error: any) {
            console.error('Erro ao buscar perfis:', error.message)
        } finally {
            loading.value = false
        }
    }

    async function updateCargo(userId: string, novoCargo: Cargo) {
        try {
            const { error } = await supabase
                .from('perfis')
                .update({ cargo: novoCargo })
                .eq('id', userId)

            if (error) throw error

            // Atualizar localmente
            const index = perfis.value.findIndex(p => p.id === userId)
            if (index !== -1) {
                perfis.value[index].cargo = novoCargo
            }

            return { success: true }
        } catch (error: any) {
            console.error('Erro ao atualizar cargo:', error.message)
            return { success: false, error: error.message }
        }
    }

    return {
        perfis,
        loading,
        fetchPerfis,
        updateCargo
    }
}
