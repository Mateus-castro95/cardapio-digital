<template>
  <div class="flex flex-col min-h-screen bg-bege-cream font-primary">
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
              class="appearance-none bg-cafe text-[#0A0A0C] text-xs sm:text-body font-bold pl-3 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2 rounded-xl focus:outline-none cursor-pointer shadow-premium disabled:opacity-80 disabled:cursor-not-allowed hover:bg-cafe-dark transition-colors border-none"
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



    <!-- Conteúdo Principal do Cardápio -->
    <main v-if="!mesaInvalida || authStore.perfil" class="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      
      <!-- Título de Boas-Vindas do Cardápio -->
      <div class="pt-2 pb-1">
        <span class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#E8C86A] block mb-1">
          Cardápio Exclusivo
        </span>
        <h2 class="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
          Sabores inesquecíveis para apreciar
        </h2>
        <p class="text-xs sm:text-sm text-bege-torrado font-normal mt-1 leading-relaxed">
          Consulte nossa seleção de pratos e carnes nobres preparados artesanalmente pelo nosso chef.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loadingItens" class="py-16 text-center">
        <span class="inline-block w-8 h-8 border-4 border-cafe/20 border-t-cafe rounded-full animate-spin"></span>
        <p class="text-xs font-black text-bege-torrado mt-3 uppercase tracking-wider">Carregando cardápio...</p>
      </div>

      <!-- LISTAGEM DE CATEGORIAS E PRATOS -->
      <div v-else class="space-y-8">
        <!-- SEÇÃO: COMIDAS -->
        <div class="space-y-4 animate-fade-in">
          <div class="flex items-center gap-3 border-b border-bege-soft pb-2">
            <h3 class="text-base sm:text-lg font-black text-cafe-dark uppercase tracking-wide">
              Comidas
            </h3>
            <span class="ml-auto text-[10px] font-black uppercase tracking-wider text-bege-torrado bg-bege-cream px-2 py-0.5 rounded-full border border-bege-soft/50">
              {{ totalPratosCount }} opções
            </span>
          </div>

          <div class="space-y-3">
            <!-- CARD EXPANSÍVEL: CATEGORIA DE COMIDA -->
            <div 
              v-for="cat in categoriasFiltradas" 
              :key="cat.id"
              :id="'cat-' + cat.id"
              class="bg-[#121215] bg-gradient-to-br from-[#18181C] to-[#121215] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-[#E8C86A]/20 overflow-hidden transition-all duration-300"
            >
              <button 
                @click="toggleCategoria(cat.id)" 
                class="w-full flex items-center justify-between p-5 text-left transition-colors"
                :class="expandedCategoriaId === cat.id ? 'bg-[#1C1C20] border-b border-bege-soft/10' : 'bg-transparent hover:bg-[#1C1C20]/50'"
              >
                <div>
                  <h4 class="font-bold text-cafe-dark text-base uppercase tracking-wide">{{ cat.nome }}</h4>
                  <p class="text-caption text-bege-torrado">{{ cat.itens.length }} {{ cat.itens.length === 1 ? 'prato disponível' : 'pratos disponíveis' }}</p>
                </div>
                <div :class="{'rotate-180': expandedCategoriaId === cat.id}" class="transition-transform duration-300 text-bege-torrado">
                  <ChevronDownIcon class="h-6 w-6" />
                </div>
              </button>

              <div v-show="expandedCategoriaId === cat.id" class="px-5 pb-5 space-y-3 md:space-y-0 animate-fade-in">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4 pt-1">
                  <div 
                    v-for="item in cat.itens" 
                    :key="item.id"
                    class="py-4 md:bg-[#18181C] md:rounded-2xl md:p-5 border-b border-bege-soft/20 md:border md:shadow-sm hover:border-cafe/30 transition-all flex flex-col justify-between group relative last:border-b-0 md:last:border"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1 min-w-0">
                        <!-- Badges de Destaque / Ponto de Carne -->
                        <div class="flex flex-wrap items-center gap-2 mb-2">
                          <span 
                            v-if="item.destaque" 
                            class="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs"
                          >
                            Especialidade
                          </span>
                          <span 
                            v-if="item.permite_ponto_carne" 
                            class="bg-red-50 text-red-700 border border-red-200/60 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider"
                          >
                            Ponto da Carne
                          </span>
                        </div>

                        <!-- Nome e Descrição -->
                        <h5 class="text-base font-black text-cafe-dark group-hover:text-cafe transition-colors leading-snug truncate">
                          {{ item.nome }}
                        </h5>
                        <p v-if="item.descricao" class="text-xs text-bege-torrado/90 font-medium leading-relaxed mt-1.5 line-clamp-3">
                          {{ item.descricao }}
                        </p>
                      </div>
                      
                      <!-- Imagem do Produto -->
                      <div 
                        v-if="item.imagem_url" 
                        class="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shadow-sm border border-bege-soft/50 bg-bege-cream/30 cursor-pointer hover:opacity-80 transition-opacity"
                        @click="openLightbox(item.imagem_url)"
                      >
                        <img :src="item.imagem_url" :alt="item.nome" class="w-full h-full object-cover" loading="lazy" />
                      </div>
                    </div>

                    <!-- Preço e Botão de Ação -->
                    <div class="flex items-center justify-between mt-5 pt-3 border-t border-[#262218]">
                      <span class="text-base sm:text-lg font-black text-cafe tabular-nums">
                        {{ formatCurrency(item.preco) }}
                      </span>

                      <button 
                        @click="abrirModalPrato(item)"
                        class="bg-cafe hover:bg-cafe-dark active:scale-95 text-[#0A0A0C] font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 uppercase tracking-wider"
                      >
                        <PlusIcon class="h-4 w-4" />
                        <span>Adicionar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SEÇÃO: BEBIDAS -->
        <div class="space-y-4 pt-4 animate-fade-in">
          <div class="flex items-center gap-3 border-b border-bege-soft pb-2">
            <h3 class="text-base sm:text-lg font-black text-cafe-dark uppercase tracking-wide">
              Bebidas
            </h3>
            <span class="ml-auto text-[10px] font-black uppercase tracking-wider text-bege-torrado bg-bege-cream px-2 py-0.5 rounded-full border border-bege-soft/50">
              {{ variacoes.length }} opções
            </span>
          </div>

          <div class="space-y-3">
            <div 
              v-for="categoriaBebida in bebidasPorTipo" 
              :key="categoriaBebida.id"
              :id="'bebida-' + categoriaBebida.id"
              class="bg-[#121215] bg-gradient-to-br from-[#18181C] to-[#121215] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-[#E8C86A]/20 overflow-hidden transition-all duration-300"
            >
              <button 
                @click="toggleBebidaSection(categoriaBebida.id)" 
                class="w-full flex items-center justify-between p-5 text-left transition-colors"
                :class="expandedBebidaSection === categoriaBebida.id ? 'bg-[#1C1C20] border-b border-bege-soft/10' : 'bg-transparent hover:bg-[#1C1C20]/50'"
              >
                <div class="flex items-center gap-4">
                  <div>
                    <h4 class="font-bold text-cafe-dark text-base">{{ categoriaBebida.titulo }}</h4>
                    <p class="text-caption text-bege-torrado">{{ categoriaBebida.descricao }}</p>
                  </div>
                </div>
                <div :class="{'rotate-180': expandedBebidaSection === categoriaBebida.id}" class="transition-transform duration-300 text-bege-torrado">
                  <ChevronDownIcon class="h-6 w-6" />
                </div>
              </button>
              <div v-show="expandedBebidaSection === categoriaBebida.id" class="px-5 pb-5 space-y-2 animate-fade-in">
                <div 
                  v-for="grupo in categoriaBebida.gruposAgrupados" 
                  :key="grupo.nome" 
                  @click="handleAbrirOpcoesBebida(grupo)" 
                  class="flex justify-between items-center py-3 hover:bg-bege-cream/50 md:p-4 md:rounded-2xl transition-colors cursor-pointer group border-b border-bege-soft/20 md:border md:border-transparent hover:border-bege-soft last:border-0"
                >
                  <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div 
                      v-if="grupo.imagem_url" 
                      class="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-sm border border-bege-soft/50 bg-bege-cream/30 cursor-pointer hover:opacity-80 transition-opacity"
                      @click.stop="openLightbox(grupo.imagem_url)"
                    >
                      <img :src="grupo.imagem_url" :alt="grupo.nome || categoriaBebida.titulo" class="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <span class="text-sm font-bold text-cafe-dark truncate block">{{ grupo.nome || categoriaBebida.titulo }}</span>
                      <p class="text-caption text-bege-torrado">{{ grupo.opcoes.length }} {{ grupo.opcoes.length === 1 ? 'opção' : 'opções' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <span class="font-bold text-cafe text-xs text-right">A partir de<br>{{ formatCurrency(grupo.preco_min) }}</span>
                    <div class="bg-cafe p-1.5 rounded-lg group-active:scale-90"><ChevronRightIcon class="h-4 w-4 text-[#0A0A0C]" /></div>
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
    >
      <div v-if="pratoSelecionado" class="p-6 pt-8 pb-8 space-y-6">
        <!-- Cabeçalho do Prato no Modal -->
        <div class="relative">
          <div class="flex items-center gap-2 mb-2">
            <span v-if="pratoSelecionado.destaque" class="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              Especialidade Adega
            </span>
          </div>
          <h3 class="text-xl font-black text-cafe-dark pr-12">{{ pratoSelecionado.nome }}</h3>
          <p v-if="pratoSelecionado.descricao" class="text-xs text-bege-torrado font-medium mt-2 leading-relaxed pr-8">
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
            <label class="text-xs font-black text-cafe uppercase tracking-wider">
              Escolha o Ponto da Carne
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
                ? 'border-cafe bg-cafe text-[#0A0A0C] shadow-md' 
                : 'border-bege-soft bg-branco text-cafe-dark hover:border-moca/40'"
            >
              <div>
                <span class="text-xs font-black block leading-tight">{{ ponto.rotulo }}</span>
                <span class="text-[10px] block mt-0.5" :class="pontoCarneSelecionado === ponto.valor ? 'text-[#0A0A0C]/80 font-bold' : 'text-bege-torrado opacity-80'">
                  {{ ponto.descricao }}
                </span>
              </div>
              <div 
                class="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2"
                :class="pontoCarneSelecionado === ponto.valor ? 'border-[#0A0A0C] bg-[#0A0A0C]/10' : 'border-bege-soft'"
              >
                <div v-if="pontoCarneSelecionado === ponto.valor" class="w-2.5 h-2.5 rounded-full bg-[#0A0A0C]"></div>
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
            class="w-full text-[16px] sm:text-xs p-3.5 rounded-2xl border border-bege-soft focus:border-cafe focus:ring-1 focus:ring-cafe outline-none bg-branco placeholder:text-bege-torrado/50"
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
    <BaseModalScrollable :show="showBebidaOptionsModal" @close="showBebidaOptionsModal = false">
      <div class="p-6 pt-8 pb-8">
        <h3 class="text-xl font-black text-cafe-dark pr-12 mb-2">{{ bebidaGrupoAtual?.nome }}</h3>
        <p class="text-caption text-bege-torrado font-bold uppercase tracking-widest mb-6 pr-8">Escolha o formato e tamanho</p>
        <div class="space-y-3">
          <div 
            v-for="opcao in bebidaGrupoAtual?.opcoes" :key="opcao.id"
            @click="adicionarBebidaAoCarrinho(opcao)"
            class="flex justify-between items-center p-4 bg-bege-cream/40 rounded-2xl border border-bege-soft hover:border-cafe hover:bg-white/10 transition-all cursor-pointer group shadow-sm"
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
              <div class="bg-cafe text-[#0A0A0C] p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                <PlusIconSolid class="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModalScrollable>

    <!-- Modal Meus Pedidos (Acompanhamento) -->
    <BaseModalScrollable :show="showMeusPedidosModal" @close="showMeusPedidosModal = false" title="Meus Pedidos">
      <div class="px-5 pt-4 pb-8">
        <div class="flex justify-between items-center bg-bege-cream/50 p-4 rounded-2xl border border-bege-soft mb-6">
          <div>
            <span class="text-[10px] text-bege-torrado font-black uppercase tracking-wider block">Total Consumido</span>
            <span class="text-xl font-black text-cafe">{{ formatCurrency(totalParcialDaMesa) }}</span>
          </div>
          <button @click="carregarMeusPedidos" class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-bege-soft shadow-sm hover:border-cafe text-xs font-black text-cafe-dark uppercase tracking-wider transition-colors">
            <ArrowPathIcon class="w-4 h-4" :class="{'animate-spin': loadingMeusPedidos}" />
            Atualizar
          </button>
        </div>

        <div v-if="pedidosDaMesa.length === 0" class="text-center py-10 opacity-60">
          <p class="text-sm font-bold text-bege-torrado">Nenhum pedido pendente.</p>
        </div>

        <div v-else class="space-y-6">
          <div v-for="pedido in pedidosDaMesa" :key="pedido.id" class="bg-branco rounded-3xl border border-bege-soft shadow-premium overflow-hidden">
            <!-- Header do Pedido -->
            <div class="p-5 border-b border-bege-soft flex justify-between items-center bg-bege-cream/20">
              <span class="text-xs font-black text-cafe-dark uppercase tracking-wider">Pedido #{{ pedido.id.split('-')[0] }}</span>
              <span class="text-xs font-black text-cafe">{{ formatCurrency(pedido.total) }}</span>
            </div>
            
            <!-- Linha do Tempo (Status) -->
            <div class="px-5 sm:px-8 py-6 bg-bege-cream/10 border-b border-bege-soft/50">
              <div class="flex items-center justify-between relative max-w-sm mx-auto px-2">
                <div class="absolute top-1/2 left-0 w-full h-0.5 bg-bege-soft/50 -translate-y-1/2 z-0"></div>
                <div 
                  v-for="(step, index) in steps" :key="step.status"
                  class="relative z-10 flex flex-col items-center group/step"
                  :class="getStatusIndex(pedido.status) >= index ? 'text-cafe' : 'text-bege-torrado/40'"
                >
                  <div 
                    class="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 border-2 bg-white"
                    :class="[
                      getStatusIndex(pedido.status) >= index 
                        ? 'border-moca shadow-md scale-110' 
                        : 'border-bege-soft/60'
                    ]"
                  >
                    <div 
                      v-if="getStatusIndex(pedido.status) >= index"
                      class="w-2 h-2 bg-moca rounded-full shadow-inner"
                      :class="{'animate-pulse': getStatusIndex(pedido.status) === index}"
                    ></div>
                  </div>
                  <span class="text-[8px] sm:text-[9px] font-black uppercase tracking-wider mt-2.5 transition-colors text-center truncate w-12">
                    {{ step.label }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Itens do Pedido -->
            <div class="p-5 space-y-3">
              <div v-for="(item, idx) in pedido.itens" :key="idx" class="flex justify-between items-start">
                <div>
                  <span class="text-xs font-bold text-cafe-dark">{{ item.quantidade }}x {{ item.nome_item || item.item_cardapio?.nome || 'Item' }}</span>
                </div>
                <span class="text-xs font-bold text-bege-torrado">{{ formatCurrency(item.preco_unitario * item.quantidade) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseModalScrollable>

    <!-- Botão Flutuante Meus Pedidos -->
    <button 
      v-if="mesaSelecionadaId && pedidosDaMesa.length > 0 && !showCartModal && !showBebidaOptionsModal"
      @click="abrirMeusPedidos"
      class="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-30 bg-cafe text-[#0A0A0C] w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-cafe-dark transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-[#E8C86A]"
    >
      <div class="relative">
        <ClipboardDocumentListIcon class="h-5 w-5 sm:h-6 sm:w-6" />
        <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm animate-pulse">
          !
        </span>
      </div>
    </button>

    <!-- Barra de Carrinho Inferior Flutuante (Estilo Ifood) -->
    <div v-if="cart.length > 0" class="sticky bottom-0 w-full mt-auto p-3 sm:p-4 bg-white/90 backdrop-blur-md border-t border-bege-soft z-40">
      <button 
        @click="showCartModal = true"
        class="max-w-4xl mx-auto w-full bg-cafe text-[#0A0A0C] flex justify-between items-center p-4 rounded-2xl shadow-premium active:scale-[0.98] transition-all hover:bg-cafe-dark"
      >
        <div class="flex items-center gap-3">
          <div class="bg-[#E8C86A] text-cafe-dark px-2.5 py-0.5 rounded-lg font-black text-xs shadow-xs">
            {{ cart.reduce((total, i) => total + i.quantidade, 0) }}
          </div>
          <span class="font-bold text-xs sm:text-sm uppercase tracking-wide">Ver Meu Pedido</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-[10px] text-[#0A0A0C]/70 font-bold uppercase tracking-widest">Total:</span>
          <span class="font-black text-base sm:text-lg">{{ formatCurrency(totalCart) }}</span>
          <ChevronRightIconSolid class="h-4 w-4 text-[#0A0A0C]" />
        </div>
      </button>
    </div>

    <!-- Modal Carrinho Completo -->
    <BaseModalScrollable :show="showCartModal" @close="showCartModal = false" title="Meu Pedido">
      <div class="px-5 pt-2 pb-8">
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
                Ponto: {{ item.ponto_carne }}
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
                  class="w-full text-[16px] sm:text-xs p-3 rounded-xl border border-bege-soft focus:border-moca focus:ring-1 focus:ring-moca outline-none bg-branco mb-2"
                ></textarea>
                <button 
                  @click="item.editandoObs = false"
                  class="w-full text-[10px] font-black text-[#0A0A0C] bg-moca hover:bg-cafe px-3 py-2 rounded-xl transition-colors shadow-sm uppercase tracking-widest"
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
            class="w-full py-3.5 text-sm bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-bege-soft disabled:text-bege-torrado text-white font-black rounded-xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-3 uppercase tracking-widest"
          >
            <span v-if="loadingPedido" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
import { useLightbox } from '~/composables/useLightbox';

const { openLightbox } = useLightbox();

import { 
  ChevronDownIcon, 
  PlusIcon, 
  ChevronRightIcon, 
  MinusIcon,
  SparklesIcon,
  BeakerIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  ArrowPathIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline';
import { 
  PlusIcon as PlusIconSolid, 
  ChevronRightIcon as ChevronRightIconSolid,
  ChevronDownIcon as ChevronDownIconSolid
} from '@heroicons/vue/20/solid';

const { categorias, fetchCategorias } = useCategorias();
const { itens: pratos, loading: loadingItens, fetchItensCardapio } = useCardapioItens();
const { variacoes, fetchVariacoesBebidas } = useVariacoes();
const { mesas, fetchMesas, criarPedido, fetchPedidosDaMesa } = usePedidos();
const toast = useToast();
const route = useRoute();
const authStore = useAuthStore();

// Mesa
const mesaSelecionadaId = ref<string | null>(null);
const mesaInvalida = ref(false);
const isMesaLocked = computed(() => {
  if (authStore.perfil) return false;
  return !!route.query.codigo || !!route.query.mesa;
});

// Categorias com pratos
const categoriasComItens = computed(() => {
  return categorias.value.filter(cat => {
    return pratos.value.some(p => p.categoria_id === cat.id);
  });
});

// Pratos filtrados agrupados por categoria
const categoriasFiltradas = computed(() => {
  return categoriasComItens.value.map(cat => ({
    id: cat.id,
    nome: cat.nome,
    itens: pratos.value.filter(p => p.categoria_id === cat.id)
  })).filter(c => c.itens.length > 0);
});

const totalPratosCount = computed(() => pratos.value.length);

// Expansão de Categorias de Comida
const expandedCategoriaId = ref<string | null>(null);
const toggleCategoria = (id: string) => {
  if (expandedCategoriaId.value === id) {
    expandedCategoriaId.value = null;
  } else {
    expandedCategoriaId.value = id;
    setTimeout(() => {
      const el = document.getElementById('cat-' + id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 150);
  }
};


// Bebidas
const expandedBebidaSection = ref<string | null>(null);
const toggleBebidaSection = (section: string) => {
  if (expandedBebidaSection.value === section) {
    expandedBebidaSection.value = null;
  } else {
    expandedBebidaSection.value = section;
    setTimeout(() => {
      const el = document.getElementById('bebida-' + section);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 150);
  }
};

const formatTipoBebida = (tipo: string) => {
  if (tipo === 'suco') return 'Sucos Naturais';
  if (tipo === 'refrigerante') return 'Refrigerantes';
  if (tipo === 'agua') return 'Águas Minerais';
  if (tipo === 'cerveja') return 'Cervejas';
  if (tipo === 'vinho') return 'Vinhos / Espumantes';
  if (tipo === 'drink') return 'Drinks';
  return 'Outras Bebidas';
};

const getBebidaDescription = (tipo: string) => {
  if (tipo === 'suco') return 'Diversos sabores com água ou leite';
  if (tipo === 'refrigerante') return 'Gelados em latas e garrafas';
  if (tipo === 'agua') return 'Com gás e sem gás';
  if (tipo === 'cerveja') return 'Nacionais e Importadas';
  if (tipo === 'vinho') return 'Tops selecionados';
  if (tipo === 'drink') return 'Clássicos e autorais';
  return 'Para todos os gostos';
};

const groupBebidas = (items: any[]) => {
  const grupos: Record<string, any> = {};
  items.forEach(v => {
    const key = v.sabor || v.produto?.nome || 'Outros';
    if (!grupos[key]) {
      grupos[key] = {
        nome: key,
        opcoes: [],
        preco_min: v.preco,
        imagem_url: v.imagem_url || v.produto?.imagem_url || null
      };
    }
    grupos[key].opcoes.push(v);
    if (v.preco < grupos[key].preco_min) grupos[key].preco_min = v.preco;
    if (!grupos[key].imagem_url && (v.imagem_url || v.produto?.imagem_url)) {
      grupos[key].imagem_url = v.imagem_url || v.produto?.imagem_url;
    }
  });
  return Object.values(grupos);
};

const bebidasPorTipo = computed(() => {
  const grupos: Record<string, any> = {};
  
  variacoes.value.forEach(v => {
    const tipo = v.tipo_bebida || 'outro';
    if (!grupos[tipo]) {
      grupos[tipo] = {
        id: tipo,
        titulo: formatTipoBebida(tipo),
        descricao: getBebidaDescription(tipo),
        itens: []
      };
    }
    grupos[tipo].itens.push(v);
  });
  
  return Object.values(grupos).map((g: any) => ({
    ...g,
    gruposAgrupados: groupBebidas(g.itens)
  })).sort((a, b) => a.titulo.localeCompare(b.titulo));
});

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

// Meus Pedidos State
const showMeusPedidosModal = ref(false);
const pedidosDaMesa = ref<any[]>([]);
const loadingMeusPedidos = ref(false);

const steps = [
  { label: 'Recebido', status: 'novo' },
  { label: 'Cozinha', status: 'em_preparo' },
  { label: 'Pronto', status: 'pronto' },
  { label: 'Entregue', status: 'entregue' },
];

const getStatusIndex = (status: string) => {
  return steps.findIndex(s => s.status === status);
};

const totalParcialDaMesa = computed(() => {
  return pedidosDaMesa.value.reduce((acc, p) => acc + (p.total || 0), 0);
});

const carregarMeusPedidos = async () => {
  if (!mesaSelecionadaId.value) return;
  loadingMeusPedidos.value = true;
  try {
    pedidosDaMesa.value = await fetchPedidosDaMesa(mesaSelecionadaId.value);
  } catch (error) {
    console.error('Erro ao buscar meus pedidos:', error);
  } finally {
    loadingMeusPedidos.value = false;
  }
};

const abrirMeusPedidos = async () => {
  showMeusPedidosModal.value = true;
  await carregarMeusPedidos();
};

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
    
    // Após enviar, carregar o histórico e abrir o modal para ele acompanhar
    await carregarMeusPedidos();
    showMeusPedidosModal.value = true;
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
    fetchVariacoesBebidas(true),
    fetchMesas()
  ]);

  const codigoQuery = route.query.codigo;
  const mesaQuery = route.query.mesa;
  
  if (codigoQuery) {
    const mesa = mesas.value.find(m => m.id === codigoQuery);
    
    if (mesa) {
      mesaSelecionadaId.value = mesa.id;
      mesaInvalida.value = false;
      toast.success('Bem-vindo!', `Você está na Mesa ${mesa.numero}`);
      
      // Carrega pedidos existentes (caso o cliente tenha saído da aba e voltado)
      carregarMeusPedidos();
    } else {
      mesaInvalida.value = true;
      if (!authStore.perfil) {
        toast.error('Mesa Inválida', 'Este código de mesa não existe.');
      }
    }
  } else if (mesaQuery) {
    const numMesa = parseInt(mesaQuery as string);
    const mesa = mesas.value.find(m => m.numero === numMesa);
    
    if (mesa) {
      mesaSelecionadaId.value = mesa.id;
      mesaInvalida.value = false;
      toast.success('Bem-vindo!', `Você está na Mesa ${mesa.numero}`);
      
      // Carrega pedidos existentes (caso o cliente tenha saído da aba e voltado)
      carregarMeusPedidos();
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
