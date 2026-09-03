<template>
  <div class="min-h-screen bg-bege-cream pb-28 font-primary">
    <!-- Header Minimalista e Sofisticado -->
    <header class="bg-branco px-4 sm:px-6 py-4 border-b border-bege-soft sticky top-0 z-30 shadow-sm">
      <div class="max-w-4xl mx-auto flex justify-between items-center gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <img 
            src="/logo-adega.webp" 
            alt="Adega Canoinhas" 
            class="h-11 w-auto object-contain shrink-0" 
            style="filter: brightness(0) saturate(100%) invert(84%) sepia(28%) saturate(1088%) hue-rotate(357deg) brightness(97%) contrast(92%) !important;"
          />
          <div class="min-w-0">
            <h1 class="text-lg sm:text-heading-3 text-[#E8C86A] font-black leading-tight tracking-tight truncate">
              Adega <span class="text-cafe-dark">Canoinhas</span>
            </h1>
            <p class="text-[10px] sm:text-caption text-bege-torrado font-bold truncate">Gastronomia • Vinhos • Experiências</p>
          </div>
        </div>
        
        <!-- Seleção de Mesa Estilizada -->
        <div class="flex flex-col items-end shrink-0">
          <label class="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1" :class="mesaInvalida ? 'text-red-500' : 'text-bege-torrado'">
            {{ mesaInvalida ? 'Mesa Inexistente' : 'Sua Mesa' }}
          </label>
          <div class="relative inline-flex">
            <select 
              v-model="mesaSelecionadaId" 
              :disabled="isMesaLocked"
              class="appearance-none bg-cafe text-branco text-xs sm:text-body font-bold pl-3 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2 rounded-xl focus:outline-none cursor-pointer shadow-premium disabled:opacity-80 disabled:cursor-not-allowed hover:bg-cafe-dark transition-colors border-none"
              :class="{'bg-red-600': mesaInvalida}"
            >
              <option v-if="!isMesaLocked || mesaInvalida" :value="null">--</option>
              <option v-for="mesa in mesas" :key="mesa.id" :value="mesa.id">
                Mesa {{ mesa.numero }}
              </option>
            </select>
            <div class="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-bege-claro">
              <ChevronDownIconSolid class="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Barra de Navegação Horizontal de Categorias (Chips Fixos/Roláveis) -->
    <div class="bg-branco/90 backdrop-blur-md border-b border-bege-soft sticky top-[73px] z-20 shadow-sm py-3 px-4">
      <div class="max-w-4xl mx-auto flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
        <button 
          @click="categoriaSelecionada = 'todas'"
          class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border shrink-0"
          :class="categoriaSelecionada === 'todas' 
            ? 'bg-cafe text-white border-cafe shadow-md scale-105' 
            : 'bg-bege-cream/60 text-cafe-dark border-bege-soft/60 hover:bg-bege-soft/40'"
        >
          🍴 Todas
        </button>

        <button 
          v-for="cat in categoriasComItens" 
          :key="cat.id"
          @click="categoriaSelecionada = cat.id"
          class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border shrink-0 flex items-center gap-1.5"
          :class="categoriaSelecionada === cat.id 
            ? 'bg-cafe text-white border-cafe shadow-md scale-105' 
            : 'bg-bege-cream/60 text-cafe-dark border-bege-soft/60 hover:bg-bege-soft/40'"
        >
          <span>{{ getCategoriaIcon(cat.nome) }}</span>
          <span>{{ cat.nome }}</span>
        </button>

        <button 
          @click="categoriaSelecionada = 'bebidas'"
          class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border shrink-0 flex items-center gap-1.5"
          :class="categoriaSelecionada === 'bebidas' 
            ? 'bg-cafe text-white border-cafe shadow-md scale-105' 
            : 'bg-bege-cream/60 text-cafe-dark border-bege-soft/60 hover:bg-bege-soft/40'"
        >
          <span>🍷</span>
          <span>Bebidas</span>
        </button>
      </div>
    </div>

    <!-- Conteúdo Principal do Cardápio -->
    <main v-if="!mesaInvalida || authStore.perfil" class="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      
      <!-- Banner Sutil de Boas-Vindas da Adega -->
      <div class="bg-gradient-to-r from-cafe-dark to-cafe text-white p-5 sm:p-6 rounded-3xl shadow-premium relative overflow-hidden">
        <div class="relative z-10 max-w-xl">
          <span class="inline-block bg-[#E8C86A]/20 text-[#E8C86A] text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 border border-[#E8C86A]/30">
            Cardápio Exclusivo
          </span>
          <h2 class="text-xl sm:text-2xl font-black text-white leading-tight mb-1">
            Sabores inesquecíveis para apreciar
          </h2>
          <p class="text-xs sm:text-sm text-bege-soft font-normal leading-relaxed">
            Consulte nossa seleção de pratos e carnes nobres preparados artesanalmente pelo nosso chef.
          </p>
        </div>
        <div class="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <SparklesIcon class="w-48 h-48 text-[#E8C86A]" />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingItens" class="py-16 text-center">
        <span class="inline-block w-8 h-8 border-4 border-cafe/20 border-t-cafe rounded-full animate-spin"></span>
        <p class="text-xs font-black text-bege-torrado mt-3 uppercase tracking-wider">Carregando cardápio...</p>
      </div>

      <!-- LISTAGEM DE CATEGORIAS E PRATOS -->
      <div v-else class="space-y-10">
        <div 
          v-for="cat in categoriasFiltradas" 
          :key="cat.id" 
          class="space-y-4 animate-fade-in"
        >
          <!-- Cabeçalho da Categoria -->
          <div class="flex items-center gap-3 border-b border-bege-soft pb-2 pt-2">
            <span class="text-xl">{{ getCategoriaIcon(cat.nome) }}</span>
            <h3 class="text-base sm:text-lg font-black text-cafe-dark uppercase tracking-wide">
              {{ cat.nome }}
            </h3>
            <span class="ml-auto text-[10px] font-black uppercase tracking-wider text-bege-torrado bg-bege-cream px-2 py-0.5 rounded-full border border-bege-soft/50">
              {{ cat.itens.length }} {{ cat.itens.length === 1 ? 'item' : 'itens' }}
            </span>
          </div>

          <!-- Grid de Pratos -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="item in cat.itens" 
              :key="item.id"
              class="bg-branco rounded-3xl p-5 border border-bege-soft shadow-premium hover:shadow-lg hover:border-moca/30 transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div>
                <!-- Badges de Destaque / Ponto de Carne -->
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <span 
                    v-if="item.destaque" 
                    class="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-xs"
                  >
                    ⭐ Especialidade
                  </span>
                  <span 
                    v-if="item.permite_ponto_carne" 
                    class="bg-red-50 text-red-700 border border-red-200/60 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1"
                  >
                    🥩 Ponto da Carne
                  </span>
                </div>

                <!-- Nome e Descrição -->
                <h4 class="text-base font-black text-cafe-dark group-hover:text-cafe transition-colors leading-snug">
                  {{ item.nome }}
                </h4>
                <p v-if="item.descricao" class="text-xs text-bege-torrado/90 font-medium leading-relaxed mt-1.5 line-clamp-3">
                  {{ item.descricao }}
                </p>
              </div>

              <!-- Preço e Botão de Ação -->
              <div class="flex items-center justify-between mt-5 pt-3 border-t border-bege-cream">
                <span class="text-base sm:text-lg font-black text-cafe tabular-nums">
                  {{ formatCurrency(item.preco) }}
                </span>

                <button 
                  @click="abrirModalPrato(item)"
                  class="bg-cafe hover:bg-cafe-dark active:scale-95 text-white font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 uppercase tracking-wider"
                >
                  <PlusIcon class="h-4 w-4" />
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SEÇÃO: BEBIDAS -->
        <div v-if="categoriaSelecionada === 'todas' || categoriaSelecionada === 'bebidas'" class="space-y-4 pt-4 animate-fade-in">
          <div class="flex items-center gap-3 border-b border-bege-soft pb-2">
            <span class="text-xl">🍷</span>
            <h3 class="text-base sm:text-lg font-black text-cafe-dark uppercase tracking-wide">
              Bebidas
            </h3>
            <span class="ml-auto text-[10px] font-black uppercase tracking-wider text-bege-torrado bg-bege-cream px-2 py-0.5 rounded-full border border-bege-soft/50">
              {{ variacoes.length }} opções
            </span>
          </div>

          <div class="space-y-3">
            <!-- CARD EXPANSÍVEL: SUCOS -->
            <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden transition-all duration-300">
              <button @click="toggleBebidaSection('sucos')" class="w-full flex items-center justify-between p-5 text-left hover:bg-bege-cream/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center shadow-sm">
                    <BeakerIcon class="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 class="font-bold text-cafe-dark text-base">Sucos Naturais</h4>
                    <p class="text-caption text-bege-torrado">Diversos sabores com água ou leite</p>
                  </div>
                </div>
                <div :class="{'rotate-180': expandedBebidaSection === 'sucos'}" class="transition-transform duration-300 text-bege-torrado">
                  <ChevronDownIcon class="h-6 w-6" />
                </div>
              </button>
              <div v-show="expandedBebidaSection === 'sucos'" class="px-5 pb-5 space-y-2 animate-fade-in">
                <div v-for="grupo in sucosAgrupados" :key="grupo.nome" @click="handleAbrirOpcoesBebida(grupo)" class="flex justify-between items-center p-4 hover:bg-bege-cream rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-bege-soft">
                  <div class="flex-1">
                    <span class="text-sm font-bold text-cafe-dark">{{ grupo.nome }}</span>
                    <p class="text-caption text-bege-torrado">{{ grupo.opcoes.length }} opções disponíveis</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-cafe text-xs text-right">A partir de<br>{{ formatCurrency(grupo.preco_min) }}</span>
                    <div class="bg-bege-soft p-1.5 rounded-lg group-active:scale-90"><ChevronRightIcon class="h-4 w-4 text-cafe" /></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CARD EXPANSÍVEL: REFRIGERANTES -->
            <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden transition-all duration-300">
              <button @click="toggleBebidaSection('refris')" class="w-full flex items-center justify-between p-5 text-left hover:bg-bege-cream/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-red-50 text-red-700/80 rounded-2xl flex items-center justify-center shadow-sm">
                    <SparklesIcon class="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 class="font-bold text-cafe-dark text-base">Refrigerantes</h4>
                    <p class="text-caption text-bege-torrado">Gelados em latas e garrafas</p>
                  </div>
                </div>
                <div :class="{'rotate-180': expandedBebidaSection === 'refris'}" class="transition-transform duration-300 text-bege-torrado">
                  <ChevronDownIcon class="h-6 w-6" />
                </div>
              </button>
              <div v-show="expandedBebidaSection === 'refris'" class="px-5 pb-5 space-y-2 animate-fade-in">
                <div v-for="grupo in refrisAgrupados" :key="grupo.nome" @click="handleAbrirOpcoesBebida(grupo)" class="flex justify-between items-center p-4 hover:bg-bege-cream rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-bege-soft">
                  <div class="flex-1">
                    <span class="text-sm font-bold text-cafe-dark">{{ grupo.nome }}</span>
                    <p class="text-caption text-bege-torrado">{{ grupo.opcoes.length }} variações</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-cafe text-xs text-right">A partir de<br>{{ formatCurrency(grupo.preco_min) }}</span>
                    <div class="bg-bege-soft p-1.5 rounded-lg group-active:scale-90"><ChevronRightIcon class="h-4 w-4 text-cafe" /></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CARD EXPANSÍVEL: ÁGUAS -->
            <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden transition-all duration-300">
              <button @click="toggleBebidaSection('aguas')" class="w-full flex items-center justify-between p-5 text-left hover:bg-bege-cream/50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 bg-blue-50 text-blue-700/80 rounded-2xl flex items-center justify-center shadow-sm">
                    <SparklesIcon class="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 class="font-bold text-cafe-dark text-base">Águas Minerais</h4>
                    <p class="text-caption text-bege-torrado">Com gás e sem gás</p>
                  </div>
                </div>
                <div :class="{'rotate-180': expandedBebidaSection === 'aguas'}" class="transition-transform duration-300 text-bege-torrado">
                  <ChevronDownIcon class="h-6 w-6" />
                </div>
              </button>
              <div v-show="expandedBebidaSection === 'aguas'" class="px-5 pb-5 space-y-2 animate-fade-in">
                <div v-for="grupo in aguasAgrupadas" :key="grupo.nome" @click="handleAbrirOpcoesBebida(grupo)" class="flex justify-between items-center p-4 hover:bg-bege-cream rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-bege-soft">
                  <div class="flex-1">
                    <span class="text-sm font-bold text-cafe-dark">{{ grupo.nome || 'Água' }}</span>
                    <p class="text-caption text-bege-torrado">{{ grupo.opcoes.length }} opções</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-cafe text-xs text-right">A partir de<br>{{ formatCurrency(grupo.preco_min) }}</span>
                    <div class="bg-bege-soft p-1.5 rounded-lg group-active:scale-90"><ChevronRightIcon class="h-4 w-4 text-cafe" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL DE ADIÇÃO DO PRATO (COM PONTO DA CARNE) -->
    <BaseModalScrollable 
      :show="showPratoModal" 
      @close="showPratoModal = false" 
      :title="pratoSelecionado?.nome || 'Detalhes do Prato'"
    >
      <div v-if="pratoSelecionado" class="p-6 pt-8 pb-32 space-y-6">
        <!-- Cabeçalho do Prato no Modal -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span v-if="pratoSelecionado.destaque" class="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              ⭐ Especialidade Adega
            </span>
          </div>
          <h3 class="text-xl font-black text-cafe-dark">{{ pratoSelecionado.nome }}</h3>
          <p v-if="pratoSelecionado.descricao" class="text-xs text-bege-torrado font-medium mt-2 leading-relaxed">
            {{ pratoSelecionado.descricao }}
          </p>
          <div class="mt-4 inline-block bg-bege-cream px-3 py-1.5 rounded-xl border border-bege-soft/60">
            <span class="text-[10px] font-black text-bege-torrado uppercase tracking-wider mr-2">Valor:</span>
            <span class="text-lg font-black text-cafe">{{ formatCurrency(pratoSelecionado.preco) }}</span>
          </div>
        </div>

        <!-- SELETOR DE PONTO DA CARNE (DESTACADO SE APLICÁVEL) -->
        <div v-if="pratoSelecionado.permite_ponto_carne" class="bg-bege-cream/40 p-4 sm:p-5 rounded-2xl border border-bege-soft space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-xs font-black text-cafe uppercase tracking-wider flex items-center gap-2">
              <span>🥩</span>
              <span>Escolha o Ponto da Carne</span>
            </label>
            <span class="text-[9px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
              Obrigatório
            </span>
          </div>
          <p class="text-[11px] text-bege-torrado font-medium">Selecione o ponto exato para os cortes e grelhados:</p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button 
              v-for="ponto in pontosCarneOpcoes" 
              :key="ponto.valor"
              type="button"
              @click="pontoCarneSelecionado = ponto.valor"
              class="p-3 rounded-xl border-2 text-left transition-all flex items-center justify-between"
              :class="pontoCarneSelecionado === ponto.valor 
                ? 'border-cafe bg-cafe text-white shadow-md' 
                : 'border-bege-soft bg-branco text-cafe-dark hover:border-moca/40'"
            >
              <div>
                <span class="text-xs font-black block leading-tight">{{ ponto.rotulo }}</span>
                <span class="text-[10px] opacity-80 block mt-0.5" :class="pontoCarneSelecionado === ponto.valor ? 'text-bege-soft' : 'text-bege-torrado'">
                  {{ ponto.descricao }}
                </span>
              </div>
              <div 
                class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2"
                :class="pontoCarneSelecionado === ponto.valor ? 'border-white bg-white/20' : 'border-bege-soft'"
              >
                <div v-if="pontoCarneSelecionado === ponto.valor" class="w-2.5 h-2.5 rounded-full bg-[#E8C86A]"></div>
              </div>
            </button>
          </div>
        </div>

        <!-- CAMPO DE OBSERVAÇÕES -->
        <div class="space-y-2">
          <label class="text-[10px] uppercase font-black text-cafe-dark tracking-widest block">
            Alguma observação para a cozinha?
          </label>
          <textarea 
            v-model="observacaoPrato"
            rows="3"
            placeholder="Ex: Molho à parte, bem passado, sem salada, talheres extras..."
            class="w-full text-xs p-3.5 rounded-2xl border border-bege-soft focus:border-cafe focus:ring-1 focus:ring-cafe outline-none bg-branco placeholder:text-bege-torrado/50"
          ></textarea>
        </div>

        <!-- CONTROLE DE QUANTIDADE -->
        <div class="flex items-center justify-between pt-2 border-t border-bege-soft/60">
          <span class="text-xs font-black text-cafe-dark uppercase tracking-wider">Quantidade</span>
          <div class="flex items-center gap-3 bg-bege-cream p-1.5 rounded-2xl border border-bege-soft">
            <button 
              type="button"
              @click="quantidadePrato = Math.max(1, quantidadePrato - 1)" 
              class="w-8 h-8 flex items-center justify-center bg-branco rounded-xl shadow-sm hover:text-cafe transition-colors border border-bege-soft/40"
            >
              <MinusIcon class="h-4 w-4 text-cafe" />
            </button>
            <span class="text-sm font-black w-6 text-center text-cafe">{{ quantidadePrato }}</span>
            <button 
              type="button"
              @click="quantidadePrato++" 
              class="w-8 h-8 flex items-center justify-center bg-branco rounded-xl shadow-sm hover:text-cafe transition-colors border border-bege-soft/40"
            >
              <PlusIcon class="h-4 w-4 text-cafe" />
            </button>
          </div>
        </div>
      </div>

      <template #footer-fixed>
        <div class="bg-branco p-4 sm:p-6 w-full max-w-2xl mx-auto border-t border-bege-soft flex items-center justify-between gap-4">
          <div>
            <span class="text-[10px] text-bege-torrado font-black uppercase tracking-wider block">Total do Item</span>
            <span class="text-xl font-black text-cafe">
              {{ formatCurrency((pratoSelecionado?.preco || 0) * quantidadePrato) }}
            </span>
          </div>

          <button 
            type="button"
            @click="adicionarPratoAoCarrinho"
            :disabled="pratoSelecionado?.permite_ponto_carne && !pontoCarneSelecionado"
            class="py-3.5 px-6 sm:px-8 bg-cafe hover:bg-cafe-dark active:scale-95 disabled:bg-bege-soft disabled:text-bege-torrado text-white font-black rounded-2xl transition-all shadow-md uppercase tracking-widest text-xs flex items-center gap-2"
          >
            <PlusIcon class="w-4 h-4" />
            <span>Adicionar ao Pedido</span>
          </button>
        </div>
      </template>
    </BaseModalScrollable>

    <!-- Modal Opções de Bebidas -->
    <BaseModalScrollable :show="showBebidaOptionsModal" @close="showBebidaOptionsModal = false" :title="bebidaGrupoAtual?.nome">
      <div class="p-6 pt-8 pb-32">
        <p class="text-caption text-bege-torrado font-bold uppercase tracking-widest mb-6">Escolha o formato e tamanho</p>
        <div class="space-y-3">
          <div 
            v-for="opcao in bebidaGrupoAtual?.opcoes" :key="opcao.id"
            @click="adicionarBebidaAoCarrinho(opcao)"
            class="flex justify-between items-center p-4 bg-bege-cream/40 rounded-2xl border border-bege-soft hover:border-cafe hover:bg-branco transition-all cursor-pointer group shadow-sm"
          >
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-black text-cafe-dark text-base leading-none">
                  {{ opcao.volume_ml ? opcao.volume_ml + 'ml' : '' }}
                  {{ opcao.tipo_preparo ? (opcao.tipo_preparo === 'agua' ? ' c/ Água' : ' c/ Leite') : '' }}
                  {{ opcao.tipo_gas ? (opcao.tipo_gas === 'com_gas' ? ' COM GÁS' : ' SEM GÁS') : '' }}
                </span>
              </div>
              <p v-if="opcao.tamanho && !['Padrão', 'Unico', 'Único'].includes(opcao.tamanho)" class="text-[10px] text-bege-torrado font-bold uppercase tracking-widest mt-1.5">
                {{ opcao.tamanho }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <span class="font-black text-cafe text-base">{{ formatCurrency(opcao.preco) }}</span>
              <div class="bg-cafe text-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <PlusIconSolid class="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModalScrollable>

    <!-- Barra de Carrinho Inferior Flutuante (Estilo Ifood) -->
    <div v-if="cart.length > 0" class="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/90 backdrop-blur-md border-t border-bege-soft z-40">
      <button 
        @click="showCartModal = true"
        class="max-w-4xl mx-auto w-full bg-cafe text-branco flex justify-between items-center p-4 rounded-2xl shadow-premium active:scale-[0.98] transition-all hover:bg-cafe-dark"
      >
        <div class="flex items-center gap-3">
          <div class="bg-[#E8C86A] text-cafe-dark px-2.5 py-0.5 rounded-lg font-black text-xs shadow-xs">
            {{ cart.reduce((total, i) => total + i.quantidade, 0) }}
          </div>
          <span class="font-bold text-xs sm:text-sm uppercase tracking-wide">Ver Meu Pedido</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[10px] text-bege-soft font-bold uppercase tracking-widest">Total:</span>
          <span class="font-black text-base sm:text-lg">{{ formatCurrency(totalCart) }}</span>
          <ChevronRightIconSolid class="h-4 w-4 text-[#E8C86A]" />
        </div>
      </button>
    </div>

    <!-- Modal Carrinho Completo -->
    <BaseModalScrollable :show="showCartModal" @close="showCartModal = false" title="Meu Pedido">
      <div class="px-5 pt-2 pb-48">
        <div v-for="(item, index) in cart" :key="index" class="bg-branco py-5 flex flex-col sm:flex-row gap-4 border-b border-bege-cream last:border-0">
          <div class="flex-1">
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-black text-cafe-dark uppercase text-sm tracking-tight">{{ item.nome }}</h4>
              <span class="font-black text-cafe text-sm ml-2">{{ formatCurrency(item.preco_unitario * item.quantidade) }}</span>
            </div>
            
            <p v-if="item.descricao" class="text-[11px] text-bege-torrado leading-relaxed italic mb-2">
              {{ item.descricao }}
            </p>

            <!-- Destaque do Ponto da Carne no Carrinho -->
            <div v-if="item.ponto_carne" class="mb-3">
              <span class="bg-red-50 text-red-700 border border-red-200 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider inline-flex items-center gap-1 shadow-2xs">
                🥩 Ponto: {{ item.ponto_carne }}
              </span>
            </div>

            <!-- Área de Observação do Item -->
            <div class="mb-4">
              <!-- Observação Salva -->
              <div v-if="item.observacoes && !item.editandoObs" class="flex items-center gap-2" @click="item.editandoObs = true">
                <p class="text-[10px] text-cafe font-bold bg-bege-cream inline-block px-2 py-1 rounded-lg cursor-pointer hover:bg-bege-soft/30 transition-colors border border-bege-soft/20">
                  Obs: {{ item.observacoes }}
                </p>
                <button class="text-bege-torrado hover:text-cafe">
                  <PencilIcon class="h-3 w-3" />
                </button>
              </div>

              <!-- Botão para Adicionar Observação -->
              <button 
                v-else-if="!item.editandoObs" 
                @click="item.editandoObs = true"
                class="text-[10px] font-black text-moca uppercase tracking-widest flex items-center gap-1 transition-colors"
              >
                <PlusIcon class="h-3 w-3" />
                Adicionar observação
              </button>

              <!-- Campo de Edição -->
              <div v-else class="mt-2 animate-fade-in bg-bege-cream/30 p-3 rounded-2xl border border-bege-soft/20">
                <textarea 
                  v-model="item.observacoes" 
                  rows="2"
                  placeholder="Ex: Sem cebola, molho à parte..."
                  class="w-full text-xs p-3 rounded-xl border border-bege-soft focus:border-moca focus:ring-1 focus:ring-moca outline-none bg-branco mb-2"
                ></textarea>
                <button 
                  @click="item.editandoObs = false"
                  class="w-full text-[10px] font-black text-branco bg-moca hover:bg-cafe px-3 py-2 rounded-xl transition-colors shadow-sm uppercase tracking-widest"
                >
                  Salvar Observação
                </button>
              </div>
            </div>
            
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center gap-3 bg-bege-cream/50 p-1 rounded-xl border border-bege-soft/20">
                <button @click="alterarQuantidade(index, -1)" class="w-8 h-8 flex items-center justify-center bg-branco rounded-lg shadow-sm hover:text-moca transition-colors border border-bege-soft/20">
                  <MinusIcon class="h-4 w-4" />
                </button>
                <span class="text-sm font-black w-4 text-center text-cafe">{{ item.quantidade }}</span>
                <button @click="alterarQuantidade(index, 1)" class="w-8 h-8 flex items-center justify-center bg-branco rounded-lg shadow-sm hover:text-moca transition-colors border border-bege-soft/20">
                  <PlusIcon class="h-4 w-4" />
                </button>
              </div>
              <button @click="removerDoCarrinho(index)" class="text-[10px] text-red-500 font-black uppercase tracking-widest hover:bg-red-50 px-3 py-2 rounded-xl transition-colors">
                Remover
              </button>
            </div>
          </div>
        </div>
      </div>

      <template #footer-fixed>
        <div class="bg-branco p-6 w-full max-w-4xl mx-auto border-t border-bege-soft">
          <div v-if="!mesaSelecionadaId" class="bg-red-50 p-4 rounded-2xl border border-red-100 mb-5 flex items-center gap-3">
            <ExclamationTriangleIcon class="w-6 h-6 text-red-600 shrink-0" />
            <p class="text-[10px] text-red-700 font-black uppercase tracking-wider leading-tight">
              Selecione o número da sua MESA no topo da página para finalizar o pedido
            </p>
          </div>

          <div class="flex justify-between items-center mb-6 px-1">
            <span class="text-bege-torrado font-black text-xs uppercase tracking-widest">Total do Pedido</span>
            <span class="text-3xl font-black text-cafe">{{ formatCurrency(totalCart) }}</span>
          </div>

          <button 
            @click="finalizarPedido"
            :disabled="!mesaSelecionadaId || loadingPedido || cart.length === 0"
            class="w-full py-5 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-bege-soft disabled:text-bege-torrado text-branco font-black rounded-2xl transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            <span v-if="loadingPedido" class="w-5 h-5 border-3 border-branco/30 border-t-branco rounded-full animate-spin"></span>
            {{ loadingPedido ? 'ENVIANDO PEDIDO...' : 'FAZER PEDIDO AGORA' }}
          </button>
        </div>
      </template>
    </BaseModalScrollable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useCategorias } from '~/composables/useCategorias';
import { useCardapioItens, type ItemCardapio } from '~/composables/useCardapioItens';
import { useVariacoes } from '~/composables/useVariacoes';
import { usePedidos } from '~/composables/usePedidos';
import { useToast } from '~/composables/useToast';
import { useAuthStore } from '~/stores/auth';

import { 
  ChevronDownIcon, 
  PlusIcon, 
  ChevronRightIcon, 
  MinusIcon,
  SparklesIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  PencilIcon
} from '@heroicons/vue/24/outline';
import { 
  PlusIcon as PlusIconSolid, 
  ChevronRightIcon as ChevronRightIconSolid,
  ChevronDownIcon as ChevronDownIconSolid
} from '@heroicons/vue/20/solid';

const { categorias, fetchCategorias } = useCategorias();
const { itens: pratos, loading: loadingItens, fetchItensCardapio } = useCardapioItens();
const { variacoes, fetchVariacoesBebidas } = useVariacoes();
const { mesas, fetchMesas, criarPedido } = usePedidos();
const toast = useToast();
const route = useRoute();
const authStore = useAuthStore();

// Mesa
const mesaSelecionadaId = ref<string | null>(null);
const mesaInvalida = ref(false);
const isMesaLocked = computed(() => {
  if (authStore.perfil) return false;
  return !!route.query.mesa;
});

// Filtro de Categorias
const categoriaSelecionada = ref<string>('todas');

// Categorias com pratos
const categoriasComItens = computed(() => {
  return categorias.value.filter(cat => {
    return pratos.value.some(p => p.categoria_id === cat.id);
  });
});

// Pratos filtrados agrupados por categoria
const categoriasFiltradas = computed(() => {
  const cats = categoriaSelecionada.value === 'todas'
    ? categoriasComItens.value
    : categoriasComItens.value.filter(c => c.id === categoriaSelecionada.value);

  return cats.map(cat => ({
    id: cat.id,
    nome: cat.nome,
    itens: pratos.value.filter(p => p.categoria_id === cat.id)
  })).filter(c => c.itens.length > 0);
});

// Ícones por Categoria
const getCategoriaIcon = (nome: string) => {
  const lower = nome.toLowerCase();
  if (lower.includes('especialidade')) return '⭐';
  if (lower.includes('massa')) return '🍝';
  if (lower.includes('carne')) return '🥩';
  if (lower.includes('risoto')) return '🍚';
  if (lower.includes('batata')) return '🥔';
  if (lower.includes('panqueca')) return '🥞';
  if (lower.includes('salada')) return '🥗';
  if (lower.includes('porç') || lower.includes('porc')) return '🍟';
  if (lower.includes('sobremesa')) return '🍰';
  return '🍴';
};

// Bebidas
const expandedBebidaSection = ref<string | null>('sucos');
const toggleBebidaSection = (section: string) => {
  expandedBebidaSection.value = expandedBebidaSection.value === section ? null : section;
};

const variacoesSucos = computed(() => variacoes.value.filter(v => v.tipo_bebida === 'suco'));
const variacoesRefrigerantes = computed(() => variacoes.value.filter(v => v.tipo_bebida === 'refrigerante'));
const variacoesAguas = computed(() => variacoes.value.filter(v => v.tipo_bebida === 'agua'));

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

const showBebidaOptionsModal = ref(false);
const bebidaGrupoAtual = ref<any>(null);

const handleAbrirOpcoesBebida = (grupo: any) => {
  bebidaGrupoAtual.value = grupo;
  showBebidaOptionsModal.value = true;
};

// Modal de Prato com Ponto da Carne
const showPratoModal = ref(false);
const pratoSelecionado = ref<ItemCardapio | null>(null);
const pontoCarneSelecionado = ref<string>('Ao Ponto');
const observacaoPrato = ref('');
const quantidadePrato = ref(1);

const pontosCarneOpcoes = [
  { valor: 'Mal Passado', rotulo: 'Mal Passado', descricao: 'Selado por fora, centro vermelho e suculento' },
  { valor: 'Ao Ponto para Mal', rotulo: 'Ao Ponto para Mal', descricao: 'Centro bem vermelho e aquecido' },
  { valor: 'Ao Ponto', rotulo: 'Ao Ponto (Padrão)', descricao: 'Centro rosado e muito macio' },
  { valor: 'Ao Ponto para Bem', rotulo: 'Ao Ponto para Bem', descricao: 'Levemente rosado no miolo' },
  { valor: 'Bem Passado', rotulo: 'Bem Passado', descricao: 'Cozido por inteiro, sem partes rosadas' },
];

const abrirModalPrato = (item: ItemCardapio) => {
  pratoSelecionado.value = item;
  pontoCarneSelecionado.value = item.permite_ponto_carne ? 'Ao Ponto' : '';
  observacaoPrato.value = '';
  quantidadePrato.value = 1;
  showPratoModal.value = true;
};

// Carrinho
const cart = ref<any[]>([]);
const showCartModal = ref(false);
const loadingPedido = ref(false);

const totalCart = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.preco_unitario * item.quantidade), 0);
});

const adicionarPratoAoCarrinho = () => {
  if (!pratoSelecionado.value) return;

  if (pratoSelecionado.value.permite_ponto_carne && !pontoCarneSelecionado.value) {
    return toast.warning('Ponto da carne', 'Por favor, selecione o ponto da carne.');
  }

  cart.value.push({
    item_cardapio_id: pratoSelecionado.value.id,
    nome: pratoSelecionado.value.nome,
    descricao: pratoSelecionado.value.descricao,
    ponto_carne: pratoSelecionado.value.permite_ponto_carne ? pontoCarneSelecionado.value : null,
    preco_unitario: pratoSelecionado.value.preco,
    quantidade: quantidadePrato.value,
    observacoes: observacaoPrato.value.trim() || null,
    editandoObs: false
  });

  showPratoModal.value = false;
  toast.success('Adicionado!', `${pratoSelecionado.value.nome} foi colocado no pedido.`);
};

const adicionarBebidaAoCarrinho = (variacao: any) => {
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
    produto_simples_id: variacao.id,
    nome: variacao.sabor || variacao.produto?.nome,
    descricao: detalhes.join(' • '),
    preco_unitario: variacao.preco,
    quantidade: 1,
    observacoes: null,
    ponto_carne: null,
    editandoObs: false
  });

  showBebidaOptionsModal.value = false;
  toast.success('Adicionado!', 'Bebida adicionada ao pedido.');
};

const alterarQuantidade = (index: number, delta: number) => {
  const novaQtd = cart.value[index].quantidade + delta;
  if (novaQtd > 0) cart.value[index].quantidade = novaQtd;
};

const removerDoCarrinho = (index: number) => {
  cart.value.splice(index, 1);
  if (cart.value.length === 0) showCartModal.value = false;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const finalizarPedido = async () => {
  if (!mesaSelecionadaId.value) {
    return toast.error('Mesa não informada', 'Selecione o número da sua mesa no topo.');
  }

  loadingPedido.value = true;
  try {
    await criarPedido({
      mesa_id: mesaSelecionadaId.value,
      total: totalCart.value,
      itens: cart.value.map(item => ({
        item_cardapio_id: item.item_cardapio_id || null,
        produto_simples_id: item.produto_simples_id || null,
        nome_item: item.nome,
        ponto_carne: item.ponto_carne || null,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario,
        observacoes: item.observacoes || null
      }))
    });

    toast.success('Pedido Enviado!', 'Seu pedido foi encaminhado para a nossa cozinha.');
    cart.value = [];
    showCartModal.value = false;
  } catch (error) {
    toast.error('Erro ao enviar pedido', 'Tente novamente ou chame o garçom.');
  } finally {
    loadingPedido.value = false;
  }
};

onMounted(async () => {
  await Promise.all([
    fetchCategorias(),
    fetchItensCardapio(),
    fetchVariacoesBebidas(),
    fetchMesas()
  ]);

  const mesaQuery = route.query.mesa;
  if (mesaQuery) {
    const numMesa = parseInt(mesaQuery as string);
    const mesa = mesas.value.find(m => m.numero === numMesa);
    
    if (mesa) {
      mesaSelecionadaId.value = mesa.id;
      mesaInvalida.value = false;
      toast.success('Bem-vindo!', `Você está na Mesa ${mesa.numero}`);
    } else {
      mesaInvalida.value = true;
      if (!authStore.perfil) {
        toast.error('Mesa Inválida', 'Esta mesa não existe em nosso sistema.');
      }
    }
  }
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
