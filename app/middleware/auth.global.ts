import { defineNuxtRouteMiddleware, navigateTo, useSupabaseUser } from '#imports'

export default defineNuxtRouteMiddleware(async (to) => {
    const user = useSupabaseUser()
    const authStore = useAuthStore()

    // 1. Definir as rotas que QUALQUER UM pode acessar (Públicas)
    const isPublicRoute = to.path === '/login' || to.path.startsWith('/cardapio')

    // 2. Se a rota NÃO for pública e o usuário NÃO estiver logado:
    if (!isPublicRoute && !user.value) {
        return navigateTo('/login')
    }

    // 3. SEGURO CRÍTICO: Se logado, garantir que o perfil e cargo foram carregados
    // Se o usuário deu um Refresh na página, o store pode estar vazio.
    if (user.value && !authStore.perfil) {
        await authStore.fetchPerfil()
    }

    const normalizedPath = to.path.replace(/\/$/, '') || '/'

    // Bloqueio rigoroso para cargo 'cozinha'
    if (user.value && authStore.cargo === 'cozinha') {
        const allowlist = ['/cozinha']
        const isPublic = normalizedPath.startsWith('/cardapio')

        if (!allowlist.includes(normalizedPath) && !isPublic) {
            console.warn('🚫 Acesso negado para cozinha à rota:', normalizedPath)
            return navigateTo('/cozinha')
        }
    }

    // Bloqueio de Configurações (SÓ Super Admin)
    if (normalizedPath.startsWith('/configuracoes') && authStore.cargo !== 'super_admin') {
        return navigateTo('/')
    }

    // 4. Se o usuário estiver logado e tentar ir para o login:
    if (normalizedPath === '/login' && user.value) {
        if (authStore.cargo === 'cozinha') return navigateTo('/cozinha')
        return navigateTo('/')
    }
})
