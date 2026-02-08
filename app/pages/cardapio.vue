<template>
  <div class="min-h-screen bg-bege-cream pb-24 font-primary">
    <!-- Header Minimalista -->
    <header class="bg-branco px-6 py-6 border-b border-bege-soft sticky top-0 z-30 shadow-sm">
      <div class="max-w-2xl mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-heading-2 text-cafe tracking-tight">Pastel <span class="text-moca">Hora</span></h1>
          <p class="text-caption text-bege-torrado font-medium">Cardápio Digital • Aberto</p>
        </div>
        
        <!-- Seleção de Mesa Estilizada -->
        <div class="flex flex-col items-end">
          <label class="text-[10px] font-bold text-bege-torrado uppercase tracking-widest mb-1">Sua Mesa</label>
          <div class="relative inline-flex self-end">
            <select 
              v-model="mesaSelecionadaId" 
              :disabled="isMesaLocked"
              class="appearance-none bg-cafe text-branco text-body font-bold pl-4 pr-10 py-2 rounded-xl focus:outline-none cursor-pointer shadow-premium disabled:opacity-80 disabled:cursor-not-allowed hover:bg-cafe-dark transition-colors"
            >
              <option v-if="!isMesaLocked" :value="null">--</option>
              <option v-for="mesa in mesas" :key="mesa.id" :value="mesa.id">
                Mesa {{ mesa.numero }}
              </option>
            </select>
            <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-bege-claro">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-2xl mx-auto p-4 space-y-4">
      
      <!-- SEÇÃO: PASTÉIS -->
      <div class="pt-2">
        <h2 class="text-caption font-black text-bege-torrado uppercase tracking-[0.2em] mb-4 px-2">Os Melhores Pastéis</h2>
        
        <div class="space-y-3">
          <!-- CARD EXPANSÍVEL: SALGADOS -->
          <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden transition-all duration-300">
            <button 
              @click="toggleSection('salgados')"
              class="w-full flex items-center justify-between p-5 text-left hover:bg-bege-cream/50 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-bege-soft text-cafe rounded-2xl flex items-center justify-center text-2xl shadow-sm">🥟</div>
                <div>
                  <h3 class="font-bold text-cafe text-body-lg">Pastéis Salgados</h3>
                  <p class="text-caption text-bege-torrado">Artesanais e crocantes</p>
                </div>
              </div>
              <div :class="{'rotate-180': expandedSection === 'salgados'}" class="transition-transform duration-300 text-bege-torrado">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </button>
            
            <div v-show="expandedSection === 'salgados'" class="px-5 pb-5 space-y-3 animate-fade-in">
              <div 
                v-for="tamanho in tamanhos" :key="tamanho.id"
                @click="handleAbrirMontarPastel(tamanho, 'salgado')"
                class="flex justify-between items-center p-4 bg-bege-cream rounded-2xl border border-transparent hover:border-cafe/20 hover:shadow-md transition-all cursor-pointer group"
              >
                <div>
                  <span class="font-bold text-cafe-dark group-hover:text-cafe transition-colors">{{ tamanho.nome }}</span>
                  <p class="text-caption text-bege-torrado/80">Até {{ tamanho.max_sabores }} sabores</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-bold text-cafe text-body">{{ formatCurrency(tamanho.preco_base) }}</span>
                  <div class="bg-branco p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-moca" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD EXPANSÍVEL: DOCES -->
          <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden transition-all duration-300">
            <button 
              @click="toggleSection('doces')"
              class="w-full flex items-center justify-between p-5 text-left hover:bg-bege-cream/50 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-moca-light/20 text-moca rounded-2xl flex items-center justify-center text-2xl shadow-sm">🍫</div>
                <div>
                  <h3 class="font-bold text-cafe text-body-lg">Pastéis Doces</h3>
                  <p class="text-caption text-bege-torrado">Sobremesas perfeitas</p>
                </div>
              </div>
              <div :class="{'rotate-180': expandedSection === 'doces'}" class="transition-transform duration-300 text-bege-torrado">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </button>
            
            <div v-show="expandedSection === 'doces'" class="px-5 pb-5 space-y-3 animate-fade-in">
              <div 
                v-for="tamanho in tamanhos" :key="tamanho.id"
                @click="handleAbrirMontarPastel(tamanho, 'doce')"
                class="flex justify-between items-center p-4 bg-bege-cream rounded-2xl border border-transparent hover:border-moca/20 hover:shadow-md transition-all cursor-pointer group"
              >
                <div>
                  <span class="font-bold text-cafe-dark group-hover:text-cafe transition-colors">{{ tamanho.nome }}</span>
                  <p class="text-caption text-bege-torrado/80">Até {{ tamanho.max_sabores }} sabores</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-bold text-cafe text-body">{{ formatCurrency(tamanho.preco_base) }}</span>
                  <div class="bg-branco p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-moca" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEÇÃO: BEBIDAS -->
      <div class="pt-6">
        <h2 class="text-caption font-black text-bege-torrado uppercase tracking-[0.2em] mb-4 px-2">Bebidas Geladas</h2>
        
        <div class="space-y-3">
          <!-- CARD EXPANSÍVEL: SUCOS -->
          <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden transition-all duration-300">
            <button @click="toggleSection('sucos')" class="w-full flex items-center justify-between p-5 text-left hover:bg-bege-cream/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-bege-soft text-cafe rounded-2xl flex items-center justify-center text-2xl shadow-sm">🍊</div>
                <h3 class="font-bold text-cafe text-body-lg">Sucos Naturais</h3>
              </div>
              <div :class="{'rotate-180': expandedSection === 'sucos'}" class="transition-transform duration-300 text-bege-torrado">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </button>
            <div v-show="expandedSection === 'sucos'" class="px-5 pb-5 space-y-2 animate-fade-in">
              <div v-for="grupo in sucosAgrupados" :key="grupo.nome" @click="handleAbrirOpcoesBebida(grupo)" class="flex justify-between items-center p-4 hover:bg-bege-cream rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-bege-soft">
                <div class="flex-1">
                  <span class="text-body font-bold text-cafe-dark">{{ grupo.nome }}</span>
                  <p class="text-caption text-bege-torrado">{{ grupo.opcoes.length }} opções disponíveis</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-bold text-cafe text-xs text-right">A partir de<br>{{ formatCurrency(grupo.preco_min) }}</span>
                  <div class="bg-bege-soft p-1 rounded-lg group-active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cafe" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD EXPANSÍVEL: REFRIGERANTES -->
          <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden transition-all duration-300">
            <button @click="toggleSection('refris')" class="w-full flex items-center justify-between p-5 text-left hover:bg-bege-cream/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-red-50 text-red-700/80 rounded-2xl flex items-center justify-center text-2xl shadow-sm">🥤</div>
                <h3 class="font-bold text-cafe text-body-lg">Refrigerantes</h3>
              </div>
              <div :class="{'rotate-180': expandedSection === 'refris'}" class="transition-transform duration-300 text-bege-torrado">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </button>
            <div v-show="expandedSection === 'refris'" class="px-5 pb-5 space-y-2 animate-fade-in">
              <div v-for="grupo in refrisAgrupados" :key="grupo.nome" @click="handleAbrirOpcoesBebida(grupo)" class="flex justify-between items-center p-4 hover:bg-bege-cream rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-bege-soft">
                <div class="flex-1">
                  <span class="text-body font-bold text-cafe-dark">{{ grupo.nome }}</span>
                  <p class="text-caption text-bege-torrado">{{ grupo.opcoes.length }} variações</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-bold text-cafe text-xs text-right">A partir de<br>{{ formatCurrency(grupo.preco_min) }}</span>
                  <div class="bg-bege-soft p-1 rounded-lg group-active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cafe" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>
                </div>
              </div>
            </div>
          </div>

          <!-- CARD EXPANSÍVEL: ÁGUAS -->
          <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden transition-all duration-300">
            <button @click="toggleSection('aguas')" class="w-full flex items-center justify-between p-5 text-left hover:bg-bege-cream/50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-blue-50 text-blue-700/80 rounded-2xl flex items-center justify-center text-2xl shadow-sm">💧</div>
                <h3 class="font-bold text-cafe text-body-lg">Águas</h3>
              </div>
              <div :class="{'rotate-180': expandedSection === 'aguas'}" class="transition-transform duration-300 text-bege-torrado">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </button>
            <div v-show="expandedSection === 'aguas'" class="px-5 pb-5 space-y-2 animate-fade-in">
              <div v-for="grupo in aguasAgrupadas" :key="grupo.nome" @click="handleAbrirOpcoesBebida(grupo)" class="flex justify-between items-center p-4 hover:bg-bege-cream rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-bege-soft">
                <div class="flex-1">
                  <span class="text-body font-bold text-cafe-dark">{{ grupo.nome || 'Água' }}</span>
                  <p class="text-caption text-bege-torrado">{{ grupo.opcoes.length }} opções</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="font-bold text-cafe text-xs text-right">A partir de<br>{{ formatCurrency(grupo.preco_min) }}</span>
                  <div class="bg-bege-soft p-1 rounded-lg group-active:scale-90"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-cafe" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Montar Pastel (Ficou muito mais limpo agora) -->
    <BaseModalScrollable :show="showMontarPastelModal" @close="showMontarPastelModal = false" :title="`Montar Pastel ${tamanhoAtual?.nome}`">
      <div class="p-6 pt-10 pb-32">
          <div class="mb-8 text-center">
              <h4 class="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">Passo 1 de 1</h4>
              <p class="text-lg font-black text-gray-800">Escolha seus sabores favoritos</p>
              <span class="inline-block mt-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  LIMITE: {{ tamanhoAtual?.max_sabores }} SABORES
              </span>
          </div>

          <div class="grid grid-cols-1 gap-3">
              <div 
                  v-for="sabor in saboresFiltrados" :key="sabor.id"
                  @click="toggleSabor(sabor)"
                  class="p-4 rounded-2xl border-2 transition-all flex justify-between items-center cursor-pointer"
                  :class="isSaborSelecionado(sabor) ? 'border-orange-500 bg-orange-50/50' : 'border-gray-100 bg-white hover:border-gray-200'"
              >
                  <div class="flex-1">
                      <div class="flex items-center gap-2">
                          <span class="font-bold text-gray-800 text-sm">{{ sabor.nome }}</span>
                          <span v-if="sabor.tipo === 'especial'" class="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Especial</span>
                      </div>
                      <p v-if="getPrecoAdicional(sabor) > 0" class="text-xs text-orange-600 font-bold mt-1">
                          + {{ formatCurrency(getPrecoAdicional(sabor)) }}
                      </p>
                  </div>
                  <div class="w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all" :class="isSaborSelecionado(sabor) ? 'bg-orange-500 border-orange-500' : 'border-gray-200'">
                      <svg v-if="isSaborSelecionado(sabor)" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                  </div>
              </div>
          </div>

          <div class="mt-8 px-2">
              <label class="text-[10px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Alguma observação?</label>
              <textarea 
                  v-model="observacaoPastel"
                  placeholder="Ex: Pastel bem frito..."
                  class="w-full p-4 rounded-2xl border border-gray-100 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm min-h-[80px] bg-gray-50/50"
              ></textarea>
          </div>
      </div>

      <template #footer-fixed>
          <div class="bg-white p-6 w-full max-w-2xl mx-auto border-t border-gray-100">
              <div class="flex justify-between items-center mb-4">
                  <div>
                    <span class="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total do Item</span>
                    <p class="text-2xl font-black text-gray-900">{{ formatCurrency(totalPastelPersonalizado) }}</p>
                  </div>
                  <span class="text-xs font-bold text-gray-400">{{ saboresSelecionados.length }}/{{ tamanhoAtual?.max_sabores }} selecionados</span>
              </div>
              <button 
                  @click="adicionarPastelAoCarrinho"
                  class="w-full py-5 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-100"
                  :disabled="saboresSelecionados.length === 0"
              >
                  ADICIONAR AO CARRINHO
              </button>
          </div>
      </template>
    </BaseModalScrollable>

    <!-- Modal Opções de Bebida -->
    <BaseModalScrollable :show="showBebidaOptionsModal" @close="showBebidaOptionsModal = false" :title="bebidaGrupoAtual?.nome">
      <div class="p-6 pt-10 pb-20">
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Selecione a opção desejada</p>
          
          <div class="grid grid-cols-1 gap-3">
              <div 
                  v-for="opcao in bebidaGrupoAtual?.opcoes" :key="opcao.id"
                  @click="adicionarBebidaAoCarrinho(opcao)"
                  class="p-5 rounded-3xl border-2 border-gray-100 bg-white hover:border-orange-500 hover:bg-orange-50/50 transition-all flex justify-between items-center cursor-pointer group"
              >
                  <div class="flex-1">
                      <!-- Destaque principal para as características reais da bebida -->
                      <div class="flex flex-wrap items-center gap-2">
                          <span class="font-black text-gray-800 text-base leading-none">
                            {{ opcao.volume_ml ? opcao.volume_ml + 'ml' : '' }}
                            {{ opcao.tipo_preparo ? (opcao.tipo_preparo === 'agua' ? ' c/ Água' : ' c/ Leite') : '' }}
                            {{ opcao.tipo_gas ? (opcao.tipo_gas === 'com_gas' ? ' COM GÁS' : ' SEM GÁS') : '' }}
                          </span>
                      </div>
                      
                      <!-- Informação secundária (tamanho) apenas se for relevante (ex: 2 Litros, Lata) -->
                      <p v-if="opcao.tamanho && !['Padrão', 'Unico', 'Único'].includes(opcao.tamanho)" class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">
                        {{ opcao.tamanho }}
                      </p>
                  </div>
                  <div class="flex items-center gap-4">
                      <span class="font-black text-orange-600 text-base">{{ formatCurrency(opcao.preco) }}</span>
                      <div class="bg-orange-500 text-white p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
                          </svg>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </BaseModalScrollable>

    <!-- Barra de Carrinho Inferior (Tipo Ifood) -->
    <div v-if="cart.length > 0" class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
      <button 
        @click="showCartModal = true"
        class="max-w-2xl mx-auto w-full bg-gray-900 text-white flex justify-between items-center p-4 rounded-2xl shadow-2xl active:scale-[0.98] transition-all"
      >
        <div class="flex items-center gap-3">
          <div class="bg-orange-500 text-white px-2 py-0.5 rounded-lg font-black text-xs">
            {{ cart.reduce((total, i) => total + i.quantidade, 0) }}
          </div>
          <span class="font-bold text-sm tracking-tight">Ver meu pedido</span>
        </div>
        <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 font-medium">Total:</span>
            <span class="font-black text-lg">{{ formatCurrency(totalCart) }}</span>
        </div>
      </button>
    </div>

    <!-- Modal Carrinho -->
    <BaseModalScrollable :show="showCartModal" @close="showCartModal = false" title="Meu Pedido">

      <div class="px-6 pt-0 pb-48">
          <div v-for="(item, index) in cart" :key="index" class="bg-white py-6 flex gap-4 border-b border-gray-50 last:border-0">
              <div class="flex-1">
                  <div class="flex justify-between items-start mb-1">
                      <h4 class="font-bold text-gray-800">{{ item.nome }}</h4>
                      <span class="font-black text-gray-900 text-sm ml-2">{{ formatCurrency(item.preco_unitario * item.quantidade) }}</span>
                  </div>
                  <p class="text-xs text-gray-400 leading-relaxed italic mb-2">
                      {{ item.descricao }}
                  </p>

                  <!-- Área de Observação do Item -->
                  <div class="mb-3">
                      <!-- 1. Exibir Observação Salva -->
                      <div v-if="item.observacoes && !item.editandoObs" class="flex items-center gap-2" @click="item.editandoObs = true">
                          <p class="text-[10px] text-orange-700 font-bold bg-orange-50 inline-block px-2 py-1 rounded cursor-pointer hover:bg-orange-100 transition-colors border border-orange-100">
                              Obs: {{ item.observacoes.toUpperCase() }}
                          </p>
                          <button class="text-orange-400 hover:text-orange-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                          </button>
                      </div>

                      <!-- 2. Botão para Adicionar Observação -->
                      <button 
                        v-else-if="!item.editandoObs" 
                        @click="item.editandoObs = true"
                        class="text-[11px] font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                        Adicionar observação
                      </button>

                      <!-- 3. Campo de Edição -->
                      <div v-else class="mt-2 animate-fade-in">
                          <textarea 
                              v-model="item.observacoes" 
                              rows="2"
                              ref="obsInput"
                              placeholder="Ex: Sem cebola, bem passado..."
                              class="w-full text-xs p-2 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none bg-gray-50 mb-2"
                          ></textarea>
                          <button 
                            @click="item.editandoObs = false"
                            class="text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded-lg transition-colors shadow-sm"
                          >
                            Salvar Observação
                          </button>
                      </div>
                  </div>
                  
                  <div class="flex items-center justify-between mt-2">
                    <div class="flex items-center gap-4 bg-gray-100 p-1.5 rounded-xl">
                        <button @click="alterarQuantidade(index, -1)" class="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-orange-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" /></svg>
                        </button>
                        <span class="text-sm font-black w-4 text-center">{{ item.quantidade }}</span>
                        <button @click="alterarQuantidade(index, 1)" class="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm hover:text-orange-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </div>
                    <button @click="removerDoCarrinho(index)" class="text-xs text-red-500 font-bold uppercase tracking-widest hover:bg-red-50 px-3 py-1 rounded-lg transition-colors">Remover</button>
                  </div>
              </div>
          </div>
      </div>

      <template #footer-fixed>
          <div class="bg-white p-6 w-full max-w-2xl mx-auto border-t border-gray-100">
              <div v-if="!mesaSelecionadaId" class="bg-red-50 p-4 rounded-2xl border border-red-100 mb-4 flex items-center gap-3">
                  <span class="text-xl">⚠️</span>
                  <p class="text-[11px] text-red-700 font-black uppercase tracking-wider">
                      Selecione o número da sua MESA no topo da página
                  </p>
              </div>

              <div class="flex justify-between items-center mb-6 px-1">
                  <span class="text-gray-400 font-bold text-xs uppercase tracking-widest">Valor Final</span>
                  <span class="text-3xl font-black text-gray-900">{{ formatCurrency(totalCart) }}</span>
              </div>

              <button 
                  @click="finalizarPedido"
                  :disabled="!mesaSelecionadaId || loadingPedido"
                  class="w-full py-5 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3"
              >
                  <span v-if="loadingPedido" class="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                  {{ loadingPedido ? 'ENVIANDO PEDIDO...' : 'FAZER PEDIDO AGORA' }}
              </button>
          </div>
      </template>
    </BaseModalScrollable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useCategorias } from '~/composables/useCategorias';
import { useTamanhos } from '~/composables/useTamanhos';
import { useSabores } from '~/composables/useSabores';
import { useVariacoes } from '~/composables/useVariacoes';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';
import { useRoute } from 'vue-router';

const { fetchCategorias } = useCategorias();
const { tamanhos, fetchTamanhos } = useTamanhos();
const { sabores, fetchSabores } = useSabores();
const { variacoes, fetchVariacoesBebidas } = useVariacoes();
const { mesas, fetchMesas, criarPedido } = usePedidos();
const toast = useToast();
const route = useRoute();

const mesaSelecionadaId = ref<string | null>(null);
const isMesaLocked = ref(false);
const expandedSection = ref<string | null>('salgados');
const cart = ref<any[]>([]);
const loadingPedido = ref(false);

const variacoesSucos = computed(() => variacoes.value.filter(v => v.tipo_bebida === 'suco'));
const variacoesRefrigerantes = computed(() => variacoes.value.filter(v => v.tipo_bebida === 'refrigerante'));
const variacoesAguas = computed(() => variacoes.value.filter(v => v.tipo_bebida === 'agua'));

// Agrupamento de Bebidas para o Cardápio
const groupBebidas = (items: any[]) => {
    const grupos: Record<string, any> = {};
    items.forEach(v => {
        const key = v.sabor || v.produto?.nome || 'Outros';
        if (!grupos[key]) {
            grupos[key] = {
                nome: key,
                opcoes: [],
                preco_min: v.preco
            };
        }
        grupos[key].opcoes.push(v);
        if (v.preco < grupos[key].preco_min) grupos[key].preco_min = v.preco;
    });
    return Object.values(grupos);
};

const sucosAgrupados = computed(() => groupBebidas(variacoesSucos.value));
const refrisAgrupados = computed(() => groupBebidas(variacoesRefrigerantes.value));
const aguasAgrupadas = computed(() => groupBebidas(variacoesAguas.value));

// Modal Opções de Bebida
const showBebidaOptionsModal = ref(false);
const bebidaGrupoAtual = ref<any>(null);

// Modal Montar Pastel
const showMontarPastelModal = ref(false);
const tamanhoAtual = ref<any>(null);
const secaoAtual = ref<'salgado' | 'doce'>('salgado');
const saboresSelecionados = ref<any[]>([]);
const observacaoPastel = ref('');

const saboresFiltrados = computed(() => {
    return sabores.value.filter(s => s.categoria === secaoAtual.value && s.ativo);
});

const totalPastelPersonalizado = computed(() => {
    if (!tamanhoAtual.value) return 0;
    const adicionais = saboresSelecionados.value.reduce((total, sabor) => total + getPrecoAdicional(sabor), 0);
    return tamanhoAtual.value.preco_base + adicionais;
});

// Modal Carrinho
const showCartModal = ref(false);
const totalCart = computed(() => cart.value.reduce((total, item) => total + (item.preco_unitario * item.quantidade), 0));

onMounted(async () => {
    await Promise.all([
        fetchCategorias(), fetchTamanhos(), fetchSabores(),
        fetchVariacoesBebidas(), fetchMesas()
    ]);

    // Lógica de Mesa via URL (?mesa=X)
    const mesaQuery = route.query.mesa;
    if (mesaQuery) {
        const mesa = mesas.value.find(m => m.numero === parseInt(mesaQuery as string));
        if (mesa) {
            mesaSelecionadaId.value = mesa.id;
            isMesaLocked.value = true;
            toast.success(`Bem-vindo!`, `Você está na Mesa ${mesa.numero}`);
        }
    }
});

const toggleSection = (section: string) => {
  expandedSection.value = expandedSection.value === section ? null : section;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const handleAbrirMontarPastel = (tamanho: any, secao: 'doce' | 'salgado') => {
    tamanhoAtual.value = tamanho;
    secaoAtual.value = secao;
    saboresSelecionados.value = [];
    observacaoPastel.value = '';
    showMontarPastelModal.value = true;
};

const handleAbrirOpcoesBebida = (grupo: any) => {
    bebidaGrupoAtual.value = grupo;
    showBebidaOptionsModal.value = true;
};

const getPrecoAdicional = (sabor: any) => {
    if (!tamanhoAtual.value || sabor.tipo !== 'especial') return 0;
    const adj = sabor.adicionais?.find((a: any) => a.tamanho_id === tamanhoAtual.value.id);
    return adj ? adj.valor_adicional : 0;
};

const toggleSabor = (sabor: any) => {
    const index = saboresSelecionados.value.findIndex(s => s.id === sabor.id);
    if (index !== -1) {
        saboresSelecionados.value.splice(index, 1);
    } else {
        if (saboresSelecionados.value.length < tamanhoAtual.value.max_sabores) {
            saboresSelecionados.value.push(sabor);
        } else {
            toast.warning('Limite atingido', `Máximo de ${tamanhoAtual.value.max_sabores} sabores.`);
        }
    }
};

const isSaborSelecionado = (sabor: any) => saboresSelecionados.value.some(s => s.id === sabor.id);

const adicionarPastelAoCarrinho = () => {
    cart.value.push({
        nome: `Pastel ${tamanhoAtual.value.nome} (${secaoAtual.value})`,
        descricao: saboresSelecionados.value.map(s => s.nome).join(' + '),
        tamanho_id: tamanhoAtual.value.id,
        sabores: saboresSelecionados.value.map(s => ({ id: s.id, nome: s.nome })),
        preco_unitario: totalPastelPersonalizado.value,
        quantidade: 1,
        observacoes: observacaoPastel.value,
    });
    showMontarPastelModal.value = false;
    toast.success('Adicionado!');
};

const adicionarBebidaAoCarrinho = (variacao: any) => {
    // Constrói uma descrição limpa sem valores null ou indesejados
    const detalhes = [];
    
    if (variacao.tamanho && !['Padrão', 'Unico', 'Único', 'null'].includes(String(variacao.tamanho))) {
        detalhes.push(variacao.tamanho);
    }
    
    if (variacao.volume_ml && variacao.volume_ml > 0) {
        detalhes.push(`${variacao.volume_ml}ml`);
    }
    
    if (variacao.tipo_preparo) {
        detalhes.push(variacao.tipo_preparo === 'agua' ? 'Com Água' : 'Com Leite');
    }
    
    if (variacao.tipo_gas) {
        detalhes.push(variacao.tipo_gas === 'com_gas' ? 'Com Gás' : 'Sem Gás');
    }

    cart.value.push({
        nome: variacao.sabor || variacao.produto?.nome,
        descricao: detalhes.join(' • '),
        produto_simples_id: variacao.id,
        preco_unitario: variacao.preco,
        quantidade: 1,
        observacoes: '',
    });
    showBebidaOptionsModal.value = false;
    toast.success('Adicionado!');
};

const alterarQuantidade = (index: number, delta: number) => {
    const novaQtd = cart.value[index].quantidade + delta;
    if (novaQtd > 0) cart.value[index].quantidade = novaQtd;
};

const removerDoCarrinho = (index: number) => {
    cart.value.splice(index, 1);
    if (cart.value.length === 0) showCartModal.value = false;
};

const finalizarPedido = async () => {
    if (!mesaSelecionadaId.value) return toast.error('Mesa não informada', 'Selecione o número da sua mesa no topo.');
    loadingPedido.value = true;
    try {
        await criarPedido({
            mesa_id: mesaSelecionadaId.value,
            total: totalCart.value,
            itens: cart.value.map(item => ({
                produto_simples_id: item.produto_simples_id || null,
                tamanho_id: item.tamanho_id || null,
                sabores: item.sabores || [],
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario,
                observacoes: item.observacoes
            }))
        });
        toast.success('Pedido Enviado!', 'Estamos preparando seu pastel.');
        cart.value = [];
        showCartModal.value = false;
    } catch (error) {
        toast.error('Erro ao enviar');
    } finally {
        loadingPedido.value = false;
    }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
