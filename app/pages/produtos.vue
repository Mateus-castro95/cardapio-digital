<template>
  <div class="p-8 max-w-7xl mx-auto">
    <div class="mb-10">
      <h1 class="text-heading-1 text-cafe mb-2">Gestão do <span class="text-moca">Cardápio</span></h1>
      <p class="text-body-lg text-bege-torrado">Gerencie categorias, produtos e preços em um único lugar</p>
    </div>

    <div class="space-y-16">
      <!-- SEÇÃO: CATEGORIAS NO TOPO -->
      <section>
        <div class="flex justify-between items-end mb-6">
          <div>
            <h2 class="text-heading-2 text-cafe-dark">Categorias</h2>
            <p class="text-caption text-bege-torrado">Divisões principais do cardápio</p>
          </div>
          <button 
            class="px-4 py-2 bg-cafe text-branco rounded-xl hover:bg-cafe-dark transition-colors font-bold text-sm shadow-md"
            @click="handleOpenAddCategory"
          >
            Adicionar nova categoria
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            v-for="categoria in categorias" :key="categoria.id" 
            class="group bg-branco rounded-2xl p-6 shadow-sm border border-bege-soft hover:shadow-premium hover:border-moca/30 transition-all flex justify-between items-center"
          >
            <span class="font-bold text-lg text-cafe capitalize">{{ categoria.nome }}</span>
            <div class="flex gap-2 transition-opacity">
              <button @click="handleOpenEditCategory(categoria)" class="p-1.5 text-bege-torrado hover:text-cafe hover:bg-bege-cream rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button @click="confirmDelete(categoria, 'categoria')" class="p-1.5 text-bege-torrado hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- SEÇÃO DE ITENS -->
      <!-- Seção de Pastéis -->
      <div>
        <div class="mb-8">
          <h2 class="text-heading-2 text-cafe-dark">Pastéis (Configuráveis)</h2>
          <p class="text-caption text-bege-torrado">Gerencie tamanhos base e variações de sabores</p>
        </div>

        <div class="flex flex-col gap-12">
          <!-- Card de Tamanhos -->
          <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-heading-3 text-cafe">Tamanhos</h3>
              <button class="px-4 py-2 bg-cafe text-branco rounded-xl hover:bg-cafe-dark transition-colors font-bold text-sm shadow-md" @click="handleOpenAddTamanho">
                Adicionar Tamanho
              </button>
            </div>
            
            <BaseTabela :colunas="colsTamanhos" :data="tamanhos">
              <template #preco_base="{ item }">
                <span class="font-bold text-moca">
                  {{ formatCurrency(item.preco_base) }}
                </span>
              </template>
              <template #max_sabores="{ item }">
                <span class="text-bege-torrado font-medium text-sm">
                  {{ item.max_sabores }} {{ item.max_sabores > 1 ? 'Sabores' : 'Sabor' }}
                </span>
              </template>
              <template #acoes="{ item }">
                <div class="flex gap-2">
                  <button class="text-bege-torrado hover:text-cafe transition-colors" @click="handleOpenEditTamanho(item)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button class="text-bege-torrado hover:text-red-500 transition-colors" @click="confirmDelete(item, 'tamanho')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </template>
            </BaseTabela>
          </div>

          <!-- Seção de Sabores -->
          <div class="space-y-12">
            <!-- Salgados -->
            <div>
              <div class="mb-6 flex justify-between items-end">
                <div>
                  <h3 class="text-heading-3 text-cafe flex items-center gap-3">
                    Sabores Salgados
                    <span class="text-[10px] bg-bege-cream text-cafe-dark px-2 py-1 rounded-full font-bold uppercase tracking-wider">{{ saboresSalgados.length }} itens</span>
                  </h3>
                  <p class="text-caption text-bege-torrado">Gerencie os sabores de pastéis salgados</p>
                </div>
                <button class="px-4 py-2 bg-cafe text-branco rounded-xl hover:bg-cafe-dark transition-colors font-bold text-sm shadow-md" @click="handleOpenAddSabor('salgado')">
                  Adicionar Sabor
                </button>
              </div>

              <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden">
                <BaseTabela :colunas="colsSabores" :data="saboresSalgados">
                  <template #nome="{ item }">
                    <div class="flex items-center gap-3 px-4 py-2">
                      <div :class="['w-2 h-2 rounded-full', item.tipo === 'especial' ? 'bg-moca' : 'bg-green-500']"></div>
                      <span class="font-bold text-cafe capitalize">{{ item.nome }}</span>
                    </div>
                  </template>
                  <template #tipo="{ item }">
                    <span class="text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider" :class="item.tipo === 'especial' ? 'bg-moca/10 text-moca' : 'bg-gray-100 text-gray-500'">
                      {{ item.tipo }}
                    </span>
                  </template>
                  <template #adicional="{ item }">
                    <div v-if="item.tipo === 'especial'" class="flex flex-wrap gap-1">
                      <span v-for="adj in item.adicionais" :key="adj.tamanho_id" class="text-[10px] bg-bege-cream text-cafe-dark px-1.5 py-0.5 rounded border border-bege-torrado/20 font-bold">
                          {{ getTamanhoNome(adj.tamanho_id) }}: +{{ formatCurrency(adj.valor_adicional) }}
                      </span>
                    </div>
                    <span v-else class="text-bege-torrado/60 text-xs italic">Incluído no preço base</span>
                  </template>
                  <template #ativo="{ item }">
                    <BaseToggle v-model="item.ativo" @update:model-value="handleToggleAtivo(item, 'sabor')" />
                  </template>
                  <template #acoes="{ item }">
                    <div class="flex gap-2">
                      <button class="text-bege-torrado hover:text-cafe transition-colors px-1" @click="handleOpenEditSabor(item)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button class="text-bege-torrado hover:text-red-500 transition-colors px-1" @click="confirmDelete(item, 'sabor')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </template>
                </BaseTabela>
              </div>
            </div>

            <!-- Doces -->
            <div>
              <div class="mb-6 flex justify-between items-end">
                <div>
                   <h3 class="text-heading-3 text-cafe flex items-center gap-3">
                    Sabores Doces
                    <span class="text-[10px] bg-bege-cream text-cafe-dark px-2 py-1 rounded-full font-bold uppercase tracking-wider">{{ saboresDoces.length }} itens</span>
                  </h3>
                  <p class="text-caption text-bege-torrado">Gerencie os sabores de pastéis doces</p>
                </div>
                <button class="px-4 py-2 bg-cafe text-branco rounded-xl hover:bg-cafe-dark transition-colors font-bold text-sm shadow-md" @click="handleOpenAddSabor('doce')">
                  Adicionar Sabor
                </button>
              </div>

              <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden">
                <BaseTabela :colunas="colsSabores" :data="saboresDoces">
                  <template #nome="{ item }">
                    <div class="flex items-center gap-3 px-4 py-2">
                      <div :class="['w-2 h-2 rounded-full', item.tipo === 'especial' ? 'bg-moca' : 'bg-pink-400']"></div>
                      <span class="font-bold text-cafe capitalize">{{ item.nome }}</span>
                    </div>
                  </template>
                  <template #tipo="{ item }">
                     <span class="text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider" :class="item.tipo === 'especial' ? 'bg-moca/10 text-moca' : 'bg-gray-100 text-gray-500'">
                      {{ item.tipo }}
                    </span>
                  </template>
                  <template #adicional="{ item }">
                    <div v-if="item.tipo === 'especial'" class="flex flex-wrap gap-1">
                      <span v-for="adj in item.adicionais" :key="adj.tamanho_id" class="text-[10px] bg-bege-cream text-cafe-dark px-1.5 py-0.5 rounded border border-bege-torrado/20 font-bold">
                          {{ getTamanhoNome(adj.tamanho_id) }}: +{{ formatCurrency(adj.valor_adicional) }}
                      </span>
                    </div>
                    <span v-else class="text-bege-torrado/60 text-xs italic">Incluído no preço base</span>
                  </template>
                  <template #ativo="{ item }">
                    <BaseToggle v-model="item.ativo" @update:model-value="handleToggleAtivo(item, 'sabor')" />
                  </template>
                  <template #acoes="{ item }">
                    <div class="flex gap-2">
                      <button class="text-bege-torrado hover:text-cafe transition-colors px-1" @click="handleOpenEditSabor(item)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button class="text-bege-torrado hover:text-red-500 transition-colors px-1" @click="confirmDelete(item, 'sabor')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </template>
                </BaseTabela>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção de Bebidas Reorganizada -->
      <div class="space-y-12">
        <!-- Sucos -->
        <div>
          <div class="mb-6 flex justify-between items-end">
            <div>
              <h2 class="text-heading-2 text-cafe-dark">Sucos</h2>
              <p class="text-caption text-bege-torrado">Gerencie os sabores e tipos de preparo</p>
            </div>
            <button class="px-4 py-2 bg-cafe text-branco rounded-xl hover:bg-cafe-dark transition-colors font-bold text-sm shadow-md" @click="handleOpenAddBebida('suco')">
              Adicionar Suco
            </button>
          </div>
          <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden">
            <BaseTabela :colunas="colsSucos" :data="variacoesSucos">
              <template #sabor="{ item }">
                <span class="font-bold text-cafe capitalize">{{ item.sabor }}</span>
              </template>
              <template #tipo_preparo="{ item }">
                <span class="text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider" :class="item.tipo_preparo === 'agua' ? 'bg-blue-50 text-blue-600' : 'bg-moca/10 text-moca'">
                  {{ item.tipo_preparo === 'agua' ? 'Feito com Água' : 'Feito com Leite' }}
                </span>
              </template>
              <template #preco="{ item }">
                <span class="font-bold text-moca">{{ formatCurrency(item.preco) }}</span>
              </template>
              <template #ativo="{ item }">
                <BaseToggle v-model="item.ativo" @update:model-value="handleToggleAtivo(item, 'bebida')" />
              </template>
              <template #acoes="{ item }">
                <div class="flex gap-2">
                  <button class="text-bege-torrado hover:text-cafe transition-colors" @click="handleOpenEditBebida(item)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button class="text-bege-torrado hover:text-red-600 transition-colors" @click="confirmDelete(item, 'bebida')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </template>
            </BaseTabela>
          </div>
        </div>

        <!-- Refrigerantes -->
        <div>
          <div class="mb-6 flex justify-between items-end">
            <div>
              <h2 class="text-heading-2 text-cafe-dark">Refrigerantes</h2>
              <p class="text-caption text-bege-torrado">Gerencie marcas e tamanhos</p>
            </div>
            <button class="px-4 py-2 bg-cafe text-branco rounded-xl hover:bg-cafe-dark transition-colors font-bold text-sm shadow-md" @click="handleOpenAddBebida('refrigerante')">
              Adicionar Refrigerante
            </button>
          </div>
          <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden">
            <BaseTabela :colunas="colsRefrigerantes" :data="variacoesRefrigerantes">
              <template #sabor="{ item }">
                <span class="font-bold text-cafe">{{ item.sabor }}</span>
              </template>
              <template #volume_ml="{ item }">
                <span class="text-bege-torrado font-medium text-sm">{{ item.volume_ml }}ml</span>
              </template>
              <template #tamanho="{ item }">
                <span class="text-xs bg-bege-cream text-cafe-dark px-2 py-1 rounded font-bold uppercase" v-if="item.tamanho">{{ item.tamanho }}</span>
                <span v-else class="text-bege-torrado/50">-</span>
              </template>
              <template #preco="{ item }">
                <span class="font-bold text-moca">{{ formatCurrency(item.preco) }}</span>
              </template>
              <template #ativo="{ item }">
                <BaseToggle v-model="item.ativo" @update:model-value="handleToggleAtivo(item, 'bebida')" />
              </template>
              <template #acoes="{ item }">
                <div class="flex gap-2">
                  <button class="text-bege-torrado hover:text-cafe transition-colors" @click="handleOpenEditBebida(item)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button class="text-bege-torrado hover:text-red-600 transition-colors" @click="confirmDelete(item, 'bebida')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </template>
            </BaseTabela>
          </div>
        </div>

        <!-- Águas -->
        <div>
          <div class="mb-6 flex justify-between items-end">
            <div>
              <h2 class="text-heading-2 text-cafe-dark">Águas</h2>
              <p class="text-caption text-bege-torrado">Gerencie tipos de água e gás</p>
            </div>
            <button class="px-4 py-2 bg-cafe text-branco rounded-xl hover:bg-cafe-dark transition-colors font-bold text-sm shadow-md" @click="handleOpenAddBebida('agua')">
              Adicionar Água
            </button>
          </div>
          <div class="bg-branco rounded-3xl shadow-premium border border-bege-soft overflow-hidden">
            <BaseTabela :colunas="colsAguas" :data="variacoesAguas">
              <template #sabor="{ item }">
                <span class="font-bold text-cafe">{{ item.sabor || 'Água' }}</span>
              </template>
              <template #volume_ml="{ item }">
                <span class="text-bege-torrado font-medium text-xs">{{ item.volume_ml }}ml</span>
              </template>
              <template #tipo_gas="{ item }">
                <span class="text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider" :class="item.tipo_gas === 'com_gas' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-500'">
                  {{ item.tipo_gas === 'com_gas' ? 'Com Gás' : 'Sem Gás' }}
                </span>
              </template>
              <template #preco="{ item }">
                <span class="font-bold text-moca">{{ formatCurrency(item.preco) }}</span>
              </template>
              <template #ativo="{ item }">
                <BaseToggle v-model="item.ativo" @update:model-value="handleToggleAtivo(item, 'bebida')" />
              </template>
              <template #acoes="{ item }">
                <div class="flex gap-2">
                  <button class="text-bege-torrado hover:text-cafe transition-colors" @click="handleOpenEditBebida(item)">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button class="text-bege-torrado hover:text-red-600 transition-colors" @click="confirmDelete(item, 'bebida')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </template>
            </BaseTabela>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL CATEGORIA -->
    <BaseModal :show="showCategoryModal" :title="editingItem ? 'Editar Categoria' : 'Nova Categoria'" @close="showCategoryModal = false">
      <div class="py-2">
        <BaseInput v-model="categoryForm.nome" label="Nome da Categoria" placeholder="Ex: Pizzas, Bebidas..." required />
      </div>
      <template #footer>
        <BaseButton variant="outline" @click="showCategoryModal = false">Cancelar</BaseButton>
        <BaseButton variant="primary" :loading="isSaving" @click="handleSaveCategory">Confirmar</BaseButton>
      </template>
    </BaseModal>

    <!-- MODAL TAMANHO -->
    <BaseModal :show="showTamanhoModal" :title="editingItem ? 'Editar Tamanho' : 'Novo Tamanho'" @close="showTamanhoModal = false">
      <div class="py-2 space-y-4">
        <BaseInput v-model="tamanhoForm.nome" label="Nome do Tamanho" placeholder="Ex: Pequeno, Média, Família" required />
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Preço Base (R$) *</label>
          <BaseInputCurrency v-model="tamanhoForm.preco_base" placeholder="0,00" input-class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cafe focus:ring-2 focus:ring-cafe/20 outline-none transition-all" />
        </div>
        <BaseInput v-model.number="tamanhoForm.max_sabores" type="number" label="Máximo de Sabores" required />
      </div>
      <template #footer>
        <BaseButton variant="outline" @click="showTamanhoModal = false">Cancelar</BaseButton>
        <BaseButton variant="primary" :loading="isSaving" @click="handleSaveTamanho">Confirmar</BaseButton>
      </template>
    </BaseModal>

    <!-- MODAL SABOR -->
    <BaseModal :show="showSaborModal" :title="editingItem ? 'Editar Sabor' : `Novo Sabor ${saborForm.categoria === 'doce' ? 'Doce' : 'Salgado'}`" @close="showSaborModal = false">
      <div class="py-2 space-y-6">
        <BaseInput v-model="saborForm.nome" label="Nome do Sabor" placeholder="Ex: Calabresa, Quatro Queijos" required />
        
        <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-gray-700">Tipo do Preço</label>
            <div class="grid grid-cols-2 gap-4">
                <button 
                    @click="saborForm.tipo = 'tradicional'" 
                    :class="['p-3 border-2 rounded-lg text-sm font-medium transition-all', saborForm.tipo === 'tradicional' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-100 text-gray-500 bg-gray-50']"
                >
                    Tradicional
                </button>
                <button 
                    @click="saborForm.tipo = 'especial'" 
                    :class="['p-3 border-2 rounded-lg text-sm font-medium transition-all', saborForm.tipo === 'especial' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 text-gray-500 bg-gray-50']"
                >
                    Especial
                </button>
            </div>
        </div>

        <!-- Seção de Adicionais (Apenas se for Especial) -->
        <div v-if="saborForm.tipo === 'especial'" class="space-y-3 pt-2 border-t border-gray-100">
            <h4 class="text-sm font-bold text-gray-700">Valores Adicionais por Tamanho</h4>
            <p class="text-xs text-gray-500">Defina quanto será cobrado a mais além do preço base do tamanho.</p>
            
            <div class="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                <div v-for="tam in tamanhos" :key="tam.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                        <span class="block text-sm font-bold text-gray-700">{{ tam.nome }}</span>
                        <span class="text-xs text-gray-400">Base: {{ formatCurrency(tam.preco_base) }}</span>
                    </div>
                    <div class="w-32">
                        <div class="relative">
                            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                            <BaseInputCurrency 
                                v-model="saborForm.adicionais[tam.id]" 
                                placeholder="0,00"
                                input-class="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:border-cafe focus:ring-2 focus:ring-cafe/20 outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="outline" @click="showSaborModal = false">Cancelar</BaseButton>
        <BaseButton variant="primary" :loading="isSaving" @click="handleSaveSabor">Confirmar</BaseButton>
      </template>
    </BaseModal>

    <!-- MODAL BEBIDA -->
    <BaseModal :show="showBebidaModal" :title="editingItem ? 'Editar Item' : `Novo(a) ${bebidaForm.tipo_bebida}`" @close="showBebidaModal = false" size="lg">
      <div class="py-2 space-y-6">
        <!-- Cabeçalho do Produto -->
        <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <BaseInput v-model="bebidaForm.sabor" :label="bebidaForm.tipo_bebida === 'agua' ? 'Marca da Água' : 'Sabor / Marca'" placeholder="Ex: Coca-Cola, Laranja, Cristal" required />
            <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-gray-700">Tipo de Bebida</label>
                <select v-model="bebidaForm.tipo_bebida" class="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 outline-none bg-gray-50 cursor-not-allowed" disabled>
                    <option value="refrigerante">Refrigerante</option>
                    <option value="suco">Suco</option>
                    <option value="agua">Água</option>
                </select>
            </div>
        </div>

        <!-- Seção de Variações -->
        <div class="space-y-4">
            <div class="flex justify-between items-center">
                <h4 class="text-sm font-bold text-gray-700 uppercase tracking-wider">Tamanhos e Preços</h4>
                <BaseButton v-if="!editingItem" size="small" variant="outline" class="!py-2 !px-4 !text-xs !font-bold !tracking-wide" @click="handleAddVariacaoRow">
                    ADICIONAR OUTRO TAMANHO
                </BaseButton>
            </div>

            <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <div v-for="(v, index) in bebidaForm.variacoes" :key="index" class="p-5 border-2 border-gray-100 rounded-2xl bg-white relative group hover:border-primary-200 transition-all">
                    <!-- Indicador de Variação -->
                    <div class="absolute -left-3 top-4 w-7 h-7 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                        {{ index + 1 }}
                    </div>

                    <!-- Botão Remover no Canto Superior Direito -->
                    <button 
                        v-if="bebidaForm.variacoes.length > 1" 
                        @click="handleRemoveVariacaoRow(index)"
                        class="absolute -right-2 -top-2 p-1.5 bg-white text-red-500 rounded-full border border-red-100 shadow-sm hover:bg-red-50 transition-colors z-10"
                        title="Remover este tamanho"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>

                    <!-- Layout para REFRIGERANTE (3 campos em uma linha larga) -->
                    <div v-if="bebidaForm.tipo_bebida === 'refrigerante'" class="grid grid-cols-3 gap-6">
                        <BaseInput v-model="v.tamanho" label="Tamanho" placeholder="Ex: Lata, 2L, Jarra" />
                        <BaseInput v-model.number="v.volume_ml" type="number" label="Volume (ML)" placeholder="350" />
                        <div>
                          <label class="block text-sm font-bold text-gray-700 mb-2">Preço (R$) *</label>
                          <BaseInputCurrency v-model="v.preco" placeholder="0,00" input-class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-cafe focus:ring-2 focus:ring-cafe/20 outline-none transition-all" />
                        </div>
                    </div>

                    <!-- Layout para SUCO e AGUA (Duas colunas, duas linhas) -->
                    <div v-else class="space-y-4">
                        <div class="grid grid-cols-2 gap-6">
                            <BaseInput v-model="v.tamanho" label="Tamanho" placeholder="Ex: Copo, Jarra" />
                            <BaseInput v-model.number="v.volume_ml" type="number" label="Volume (ML)" placeholder="500" />
                        </div>
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                              <label class="block text-sm font-bold text-gray-700 mb-2">Preço (R$) *</label>
                              <BaseInputCurrency v-model="v.preco" placeholder="0,00" input-class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-cafe focus:ring-2 focus:ring-cafe/20 outline-none transition-all" />
                            </div>
                            
                            <!-- Campo Dinâmico: Preparo (Suco) -->
                            <div v-if="bebidaForm.tipo_bebida === 'suco'" class="flex flex-col gap-2">
                                <label class="text-sm font-bold text-gray-700">Preparo do Suco</label>
                                <select v-model="v.tipo_preparo" class="w-full p-2.5 border-2 border-orange-100 bg-orange-50/30 rounded-xl text-sm outline-none focus:border-orange-500">
                                    <option :value="null">Natural / Fruta</option>
                                    <option value="agua">Com Água</option>
                                    <option value="leite">Com Leite</option>
                                </select>
                            </div>

                            <!-- Campo Dinâmico: Gás (Água) -->
                            <div v-if="bebidaForm.tipo_bebida === 'agua'" class="flex flex-col gap-2">
                                <label class="text-sm font-bold text-gray-700">Tipo de Gás</label>
                                <select v-model="v.tipo_gas" class="w-full p-2.5 border-2 border-purple-100 bg-purple-50/30 rounded-xl text-sm outline-none focus:border-purple-500">
                                    <option value="sem_gas">Sem Gás</option>
                                    <option value="com_gas">Com Gás</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="outline" @click="showBebidaModal = false">Cancelar</BaseButton>
        <BaseButton variant="primary" :loading="isSaving" @click="handleSaveBebida">
            {{ editingItem ? 'Salvar Alteração' : `Cadastrar ${bebidaForm.variacoes.length} Itens` }}
        </BaseButton>
      </template>
    </BaseModal>

    <!-- MODAL CONFIRMAÇÃO EXCLUSÃO -->
    <ModalConfirmacao 
      :show="showConfirmDeleteModal" 
      title="Confirmar Exclusão" 
      :message="`Tem certeza que deseja excluir '${itemToDelete?.nome || 'este item'}'? Esta ação não pode ser desfeita.`"
      :loading="isDeleting"
      @confirm="handleDelete"
      @cancel="showConfirmDeleteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useToast } from '~/composables/useToast';
import { useCategorias } from '~/composables/useCategorias';
import { useTamanhos } from '~/composables/useTamanhos';
import { useSabores } from '~/composables/useSabores';
import { useProdutos } from '~/composables/useProdutos';

const toast = useToast();
const { categorias, fetchCategorias, addCategoria, updateCategoria, removeCategoria } = useCategorias();
const { tamanhos, fetchTamanhos, addTamanho, updateTamanho, removeTamanho } = useTamanhos();
const { sabores, fetchSabores, addSaborCompleto, updateSaborCompleto, removeSabor } = useSabores();
const { variacoes, fetchVariacoesBebidas, addNovaVariacao, updateVariacaoCompleta, removeVariacao } = useVariacoes();
const { produtos, fetchProdutosBebidas, addBebida, updateBebida, removeProduto, toggleAtivo } = useProdutos();


// Filtros para sabores de pastel
const saboresSalgados = computed(() => sabores.value.filter(s => s.categoria === 'salgado'));
const saboresDoces = computed(() => sabores.value.filter(s => s.categoria === 'doce'));

// Filtros para variações de bebidas
const variacoesSucos = computed(() => variacoes.value.filter(v => v.tipo_bebida === 'suco'));
const variacoesRefrigerantes = computed(() => variacoes.value.filter(v => v.tipo_bebida === 'refrigerante'));
const variacoesAguas = computed(() => variacoes.value.filter(v => v.tipo_bebida === 'agua'));

// Formatações
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Tabelas Configurações
const colsTamanhos = [
  { key: 'nome', label: 'Nome' },
  { key: 'preco_base', label: 'Preço Base' },
  { key: 'max_sabores', label: 'Máx Sabores' },
  { key: 'acoes', label: 'Ações' }
];

const colsSabores = [
  { key: 'nome', label: 'Sabor' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'adicional', label: 'Adicional/Preço' },
  { key: 'ativo', label: 'Ativo' },
  { key: 'acoes', label: 'Ações' }
];

const colsSucos = [
  { key: 'sabor', label: 'Sabor' },
  { key: 'tipo_preparo', label: 'Preparo' },
  { key: 'preco', label: 'Preço' },
  { key: 'ativo', label: 'Ativo' },
  { key: 'acoes', label: 'Ações' }
];

const colsRefrigerantes = [
  { key: 'sabor', label: 'Sabor' },
  { key: 'volume_ml', label: 'Volume' },
  { key: 'tamanho', label: 'Tamanho' },
  { key: 'preco', label: 'Preço' },
  { key: 'ativo', label: 'Ativo' },
  { key: 'acoes', label: 'Ações' }
];

const colsAguas = [
  { key: 'sabor', label: 'Água' },
  { key: 'volume_ml', label: 'Volume' },
  { key: 'tipo_gas', label: 'Gás' },
  { key: 'preco', label: 'Preço' },
  { key: 'ativo', label: 'Ativo' },
  { key: 'acoes', label: 'Ações' }
];

// Busca dados iniciais
onMounted(async () => {
    try {
        await Promise.all([
            fetchCategorias(),
            fetchTamanhos(),
            fetchSabores(),
            fetchVariacoesBebidas()
        ]);
    } catch (error) {
        toast.error('Erro de Carregamento', 'Não foi possível carregar alguns dados.');
    }
});

// ESTADOS DOS MODAIS
const showCategoryModal = ref(false);
const showTamanhoModal = ref(false);
const showSaborModal = ref(false);
const showBebidaModal = ref(false);
const showConfirmDeleteModal = ref(false);

const isSaving = ref(false);
const isDeleting = ref(false);

const editingItem = ref<any>(null);
const itemToDelete = ref<{ id: string, nome: string, type: 'categoria' | 'tamanho' | 'sabor' | 'bebida' } | null>(null);

// Forms
const categoryForm = reactive({ nome: '' });
const tamanhoForm = reactive({ nome: '', preco_base: 0, max_sabores: 1 });
const saborForm = reactive({ 
    nome: '', 
    tipo: 'tradicional' as 'tradicional' | 'especial', 
    ativo: true,
    categoria: 'salgado' as 'salgado' | 'doce',
    adicionais: {} as Record<string, number> 
});
const bebidaForm = reactive({ 
    sabor: '', 
    tipo_bebida: 'refrigerante' as 'suco' | 'refrigerante' | 'agua',
    categoria_id: '',
    variacoes: [] as {
        tamanho: string;
        volume_ml: number;
        preco: number;
        tipo_preparo: 'agua' | 'leite' | null;
        tipo_gas: 'com_gas' | 'sem_gas' | null;
        ativo: boolean;
    }[]
});

// HANDLERS ABERTURA MODAL
const handleOpenAddCategory = () => {
    editingItem.value = null;
    categoryForm.nome = '';
    showCategoryModal.value = true;
};

const handleOpenEditCategory = (item: any) => {
    editingItem.value = item;
    categoryForm.nome = item.nome;
    showCategoryModal.value = true;
};

const handleOpenAddTamanho = () => {
    editingItem.value = null;
    tamanhoForm.nome = '';
    tamanhoForm.preco_base = 0;
    tamanhoForm.max_sabores = 1;
    showTamanhoModal.value = true;
};

const handleOpenEditTamanho = (item: any) => {
    editingItem.value = item;
    tamanhoForm.nome = item.nome;
    tamanhoForm.preco_base = item.preco_base;
    tamanhoForm.max_sabores = item.max_sabores;
    showTamanhoModal.value = true;
};

const handleOpenAddSabor = (secao: 'salgado' | 'doce' = 'salgado') => {
    editingItem.value = null;
    saborForm.nome = '';
    saborForm.tipo = 'tradicional';
    saborForm.categoria = secao;
    saborForm.ativo = true;
    saborForm.adicionais = {};
    // Preenche adicionais com 0 para todos os tamanhos existentes
    tamanhos.value.forEach(t => {
        saborForm.adicionais[t.id] = 0;
    });
    showSaborModal.value = true;
};

const handleOpenEditSabor = (item: any) => {
    editingItem.value = item;
    saborForm.nome = item.nome;
    saborForm.tipo = item.tipo;
    saborForm.categoria = item.categoria || 'salgado';
    saborForm.ativo = item.ativo !== undefined ? item.ativo : true;
    saborForm.adicionais = {};
    
    // Preenche com os valores que já existem no banco
    tamanhos.value.forEach(t => {
        const adj = item.adicionais?.find((a: any) => a.tamanho_id === t.id);
        saborForm.adicionais[t.id] = adj ? adj.valor_adicional : 0;
    });
    
    showSaborModal.value = true;
};

const isAddingRow = ref(false);
const handleAddVariacaoRow = () => {
    if (isAddingRow.value) return;
    isAddingRow.value = true;
    
    bebidaForm.variacoes.push({
        tamanho: '',
        volume_ml: bebidaForm.tipo_bebida === 'suco' ? 500 : 350,
        preco: 0,
        tipo_preparo: null,
        tipo_gas: bebidaForm.tipo_bebida === 'agua' ? 'sem_gas' : null,
        ativo: true
    });

    // Pequeno delay para evitar cliques duplos fantasmagóricos
    setTimeout(() => {
        isAddingRow.value = false;
    }, 200);
};

const handleRemoveVariacaoRow = (index: number) => {
    if (bebidaForm.variacoes.length > 1) {
        bebidaForm.variacoes.splice(index, 1);
    }
};

const handleOpenAddBebida = (tipo: 'suco' | 'refrigerante' | 'agua' = 'refrigerante') => {
    editingItem.value = null;
    bebidaForm.sabor = '';
    bebidaForm.tipo_bebida = tipo;
    
    const catBebida = categorias.value.find(c => c.nome.toLowerCase().includes('bebida'));
    bebidaForm.categoria_id = catBebida?.id || categorias.value?.[0]?.id || '';
    
    // Inicia com uma variação vazia
    bebidaForm.variacoes = [];
    handleAddVariacaoRow();
    
    showBebidaModal.value = true;
};

const handleOpenEditBebida = (item: any) => {
    editingItem.value = item;
    bebidaForm.sabor = item.sabor || '';
    bebidaForm.tipo_bebida = item.tipo_bebida || 'refrigerante';
    bebidaForm.categoria_id = item.produto?.categoria_id || '';
    
    bebidaForm.variacoes = [{
        tamanho: item.tamanho || '',
        volume_ml: item.volume_ml || 0,
        preco: item.preco || 0,
        tipo_preparo: item.tipo_preparo || null,
        tipo_gas: item.tipo_gas || null,
        ativo: item.ativo !== undefined ? item.ativo : true
    }];
    
    showBebidaModal.value = true;
};

// HANDLERS SALVAR
const handleSaveCategory = async () => {
    if (!categoryForm.nome) return toast.error('Erro', 'Nome é obrigatório');
    isSaving.value = true;
    try {
        if (editingItem.value) {
            await updateCategoria(editingItem.value.id, categoryForm.nome);
            toast.success('Sucesso', 'Categoria atualizada');
        } else {
            await addCategoria(categoryForm.nome);
            toast.success('Sucesso', 'Categoria criada');
        }
        showCategoryModal.value = false;
    } catch (e: any) {
        toast.error('Erro', e.message);
    } finally {
        isSaving.value = false;
    }
};

const handleSaveTamanho = async () => {
    if (!tamanhoForm.nome) return toast.error('Erro', 'Nome é obrigatório');
    isSaving.value = true;
    try {
        const payload = { nome: tamanhoForm.nome, preco_base: tamanhoForm.preco_base, max_sabores: tamanhoForm.max_sabores };
        if (editingItem.value) {
            await updateTamanho(editingItem.value.id, payload);
            toast.success('Sucesso', 'Tamanho atualizado');
        } else {
            await addTamanho(payload);
            toast.success('Sucesso', 'Tamanho criado');
        }
        showTamanhoModal.value = false;
    } catch (e: any) {
        toast.error('Erro', e.message);
    } finally {
        isSaving.value = false;
    }
};

const handleSaveSabor = async () => {
    if (!saborForm.nome) return toast.error('Erro', 'Nome é obrigatório');
    isSaving.value = true;
    try {
        const saborPayload: any = { 
            nome: saborForm.nome, 
            tipo: saborForm.tipo,
            categoria: saborForm.categoria,
            ativo: saborForm.ativo
        };

        const adicionaisPayload = Object.entries(saborForm.adicionais)
            .filter(([_, valor]) => valor > 0)
            .map(([tamanhoId, valor]) => ({
                tamanho_id: tamanhoId,
                valor_adicional: Number(valor)
            }));

        if (editingItem.value) {
            await updateSaborCompleto(editingItem.value.id, saborPayload, adicionaisPayload);
            toast.success('Sucesso', 'Sabor atualizado');
        } else {
            await addSaborCompleto(saborPayload, adicionaisPayload);
            toast.success('Sucesso', 'Sabor criado');
        }
        showSaborModal.value = false;
    } catch (e: any) {
        toast.error('Erro', e.message);
    } finally {
        isSaving.value = false;
    }
};

const handleSaveBebida = async () => {
    if (!bebidaForm.sabor) return toast.error('Erro', 'Sabor/Nome é obrigatório');
    if (bebidaForm.variacoes.length === 0) return toast.error('Erro', 'Adicione ao menos um tamanho');
    
    isSaving.value = true;
    try {
        const nomePai = bebidaForm.sabor;

        if (editingItem.value) {
            // No modo edição, editamos apenas a variação que foi aberta
            const v = bebidaForm.variacoes[0];
            if (!v) return;
            
            const detPayload = { 
                preco: v.preco, 
                tipo_bebida: bebidaForm.tipo_bebida, 
                volume_ml: v.volume_ml,
                tipo_preparo: v.tipo_preparo,
                tipo_gas: v.tipo_gas,
                sabor: nomePai,
                tamanho: v.tamanho || null,
                ativo: v.ativo
            };

            await updateVariacaoCompleta(
                editingItem.value.id, 
                editingItem.value.produto_id, 
                nomePai, 
                detPayload
            );
            toast.success('Sucesso', 'Item atualizado');
        } else {
            // No modo adição, percorremos a lista de variações
            for (const v of bebidaForm.variacoes) {
                const detPayload = { 
                    preco: v.preco, 
                    tipo_bebida: bebidaForm.tipo_bebida, 
                    volume_ml: v.volume_ml,
                    tipo_preparo: v.tipo_preparo,
                    tipo_gas: v.tipo_gas,
                    sabor: nomePai,
                    tamanho: v.tamanho || null,
                    ativo: v.ativo
                };
                await addNovaVariacao(nomePai, bebidaForm.categoria_id, detPayload);
            }
            toast.success('Sucesso', `${bebidaForm.variacoes.length} variações adicionadas`);
        }
        showBebidaModal.value = false;
    } catch (e: any) {
        toast.error('Erro', e.message);
    } finally {
        isSaving.value = false;
    }
};

// HANDLERS DELETE
const confirmDelete = (item: any, type: 'categoria' | 'tamanho' | 'sabor' | 'bebida') => {
    itemToDelete.value = { id: item.id, nome: item.nome, type };
    showConfirmDeleteModal.value = true;
};

const handleDelete = async () => {
    if (!itemToDelete.value) return;
    isDeleting.value = true;
    try {
        const { id, type } = itemToDelete.value;
        if (type === 'categoria') await removeCategoria(id);
        else if (type === 'tamanho') await removeTamanho(id);
        else if (type === 'sabor') await removeSabor(id);
        else if (type === 'bebida') {
            // Pegamos o item original para ter o produto_id
            const varOriginal = variacoes.value.find(v => v.id === id);
            if (varOriginal) await removeVariacao(id, varOriginal.produto_id);
        }
        
        toast.success('Excluído', 'Item removido com sucesso');
        showConfirmDeleteModal.value = false;
    } catch (e: any) {
        toast.error('Erro', e.message);
    } finally {
        isDeleting.value = false;
    }
};

const handleToggleAtivo = async (item: any, type: 'sabor' | 'bebida') => {
    try {
        if (type === 'sabor') {
            await updateSaborCompleto(item.id, { ativo: item.ativo } as any);
        } else {
            await updateVariacaoCompleta(item.id, item.produto_id, item.produto?.nome, { ativo: item.ativo });
        }
    } catch (e: any) {
        toast.error('Erro', 'Não foi possível atualizar o status');
    }
};

const getCategoryName = (id: string) => {
    return categorias.value.find(c => c.id === id)?.nome || 'Sem Categoria';
};

const getTamanhoNome = (id: string) => {
    return tamanhos.value.find(t => t.id === id)?.nome || 'Tam';
};
</script>

<style scoped>
/* Estilos específicos da página de produtos */
</style>
