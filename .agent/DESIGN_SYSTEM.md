# 🎨 Design System - Pastel Hora

## Paleta de Cores Profissional

### Cores Principais (Café)
```
cafe-light:   #8B6B42
cafe:         #6F4F28  (padrão)
cafe-dark:    #4A351B
```

### Cores Secundárias (Moca)
```
moca-light:   #B37A60
moca:         #9B5C42  (padrão)
moca-dark:    #7F4A35
```

### Cores Neutras (Bege)
```
bege-torrado: #A67B5B
bege-claro:   #C0977D
bege-cream:   #FDFBF7  (fundos de sistema)
bege-soft:    #E8D8C4
```

### Cores Básicas
```
preto:        #1A1A1A  (padrão)
preto-pure:   #000000
branco:       #FFFFFF  (padrão)
branco-dirty: #F5F2ED
```

---

## Tipografia

### Fonte Principal
**Outfit** - Moderna e profissional para dashboards
- Pesos disponíveis: 300, 400, 500, 600, 700

### Escala Tipográfica

| Classe Tailwind | Tamanho | Uso |
|----------------|---------|-----|
| `text-heading-1` | 2.5rem (40px) | Títulos principais de página |
| `text-heading-2` | 1.875rem (30px) | Subtítulos de seção |
| `text-heading-3` | 1.5rem (24px) | Títulos de card/componente |
| `text-body-lg` | 1.125rem (18px) | Texto destacado |
| `text-body` | 1rem (16px) | Texto padrão |
| `text-description` | 0.875rem (14px) | Descrições e labels |
| `text-caption` | 0.75rem (12px) | Legendas e metadados |

---

## Exemplos de Uso

### Títulos
```vue
<h1 class="text-heading-1 text-cafe">Título Principal</h1>
<h2 class="text-heading-2 text-cafe-dark">Subtítulo</h2>
<h3 class="text-heading-3 text-moca">Título de Card</h3>
```

### Textos
```vue
<p class="text-body text-preto">Texto padrão do sistema</p>
<p class="text-description text-cafe/70">Descrição ou informação secundária</p>
<span class="text-caption text-bege-torrado">Legenda pequena</span>
```

### Botões
```vue
<!-- Botão primário -->
<button class="bg-cafe hover:bg-cafe-dark text-branco px-6 py-3 rounded-lg">
  Confirmar
</button>

<!-- Botão secundário -->
<button class="bg-bege-claro hover:bg-bege-torrado text-cafe px-6 py-3 rounded-lg">
  Cancelar
</button>
```

### Cards
```vue
<div class="bg-branco border border-bege-soft rounded-xl p-6 shadow-premium">
  <h3 class="text-heading-3 text-cafe mb-2">Título do Card</h3>
  <p class="text-description text-preto/70">Descrição do conteúdo</p>
</div>
```

---

## Sombras

### Shadow Premium
```
shadow-premium: 0 4px 20px -2px rgba(111, 79, 40, 0.1), 0 2px 10px -1px rgba(111, 79, 40, 0.05)
```

Uso: Cards, modais, dropdowns e elementos elevados

---

## Gradientes

### Gradiente Café (Sidebar)
```vue
<div class="bg-gradient-to-b from-cafe-dark to-preto">
  <!-- Conteúdo -->
</div>
```

---

## Estados Interativos

### Hover
- Botões: `hover:bg-cafe-dark`
- Links: `hover:text-cafe`
- Cards: `hover:shadow-premium`

### Active/Focus
- Inputs: `focus:ring-2 focus:ring-cafe/20 focus:border-cafe`
- Botões: `active:scale-95`

### Disabled
- Opacidade: `opacity-50 cursor-not-allowed`

---

## Notas de Implementação

⚠️ **Avisos de Lint**: Os avisos sobre `@apply` e `@tailwind` são normais e podem ser ignorados. São diretivas do Tailwind CSS que funcionam perfeitamente em runtime.

✅ **Consistência**: Sempre use as classes Tailwind definidas neste documento para manter a consistência visual em todo o sistema.

🎯 **Acessibilidade**: Sempre mantenha contraste adequado entre texto e fundo (mínimo 4.5:1 para texto normal).
