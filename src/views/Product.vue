<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowRight, ArrowUpRight, Heart, ShoppingBag, Minus, Plus, Ruler, Fingerprint, Package, Check, Expand, X } from 'lucide-vue-next'
import { products, money } from '../data/products'
import ProductCard from '../components/ProductCard.vue'
import OverlayPanel from '../components/OverlayPanel.vue'
import { addToCart, favorites, toggleFavorite } from '../store'
const route = useRoute()
const product = computed(() => products.find(p => p.id === Number(route.params.id)))
const size = ref('')
const quantity = ref(1)
const error = ref('')
const activeTab = ref('Detalhes')
const zoom = ref(false)
const guideOpen = ref(false)
const suggested = computed(() => products.filter(p => p.id !== product.value?.id).sort((a, b) => Number(b.category === product.value?.category) - Number(a.category === product.value?.category)).slice(0, 4))
const variants = computed(() => {
  if (!product.value) return []
  const category = product.value.category
  return ['Camisas', 'Garrafas', 'Cadernos'].includes(category) ? products.filter(p => p.category === category) : [product.value]
})
watch(() => route.params.id, () => {
  size.value = ''
  quantity.value = 1
  error.value = ''
  activeTab.value = 'Detalhes'
  if (product.value) document.title = `Aegon Store — ${product.value.name}`
}, { immediate: true })
function add() {
  if (!product.value) return
  if (!size.value) {
    error.value = product.value.category === 'Camisas' || product.value.id === 1 ? 'Escolha o tamanho da sua camisa para continuar.' : 'Escolha uma opção para continuar.'
    document.getElementById('product-options')?.focus()
    return
  }
  error.value = ''
  addToCart(product.value.id, size.value, quantity.value)
}
</script>

<template>
  <div v-if="product" class="product-page page-container"><nav class="breadcrumb" aria-label="Caminho da página"><RouterLink to="/">Início</RouterLink><span>/</span><RouterLink to="/produtos">Coleção</RouterLink><span>/</span><RouterLink :to="`/produtos?categoria=${product.category}`">{{ product.category }}</RouterLink><span>/</span><span>{{ product.name }}</span></nav>
    <section class="product-detail"><div class="product-gallery"><div class="product-stage"><span class="stage-edition">AEGON ESSENTIALS / 01</span><img :src="product.image" :alt="`${product.name} — ${product.colorName}`" width="800" height="800" fetchpriority="high" /><span class="stage-color">{{ product.colorName }}</span><button class="icon-button zoom-button" aria-label="Ampliar imagem do produto" @click="zoom = true"><Expand :size="19" /></button></div><div class="gallery-footnote"><Fingerprint :size="18" /><span>Design autoral. Identidade em cada detalhe.</span><span>01 / 01</span></div></div>
      <div class="product-info"><span class="eyebrow">{{ product.category }} / COLEÇÃO 01</span><h1>{{ product.name }}<span class="blue-period">.</span></h1><p class="product-tagline">{{ product.category === 'Camisas' ? 'Originalidade pra vestir. Conforto pra ficar.' : product.category === 'Garrafas' ? 'Pra levar o seu ritmo aonde você for.' : product.category === 'Cadernos' ? 'Um espaço para as suas próximas grandes ideias.' : 'Seus essenciais, ainda melhores juntos.' }}</p><div class="detail-price">{{ money(product.price) }}<small>ou 3x de {{ money(product.price / 3) }} sem juros</small></div>
        <div class="product-options-block"><span class="option-label">Cor: <strong>{{ product.colorName }}</strong></span><div class="color-options"><RouterLink v-for="variant in variants" :key="variant.id" :to="`/produto/${variant.id}`" class="color-option" :class="{ selected: variant.id === product.id }" :style="{ '--swatch': variant.color }" :aria-label="`Ver ${variant.name} em ${variant.colorName}`" :aria-current="variant.id === product.id ? 'true' : undefined"><span></span></RouterLink></div></div>
        <div class="product-options-block"><div class="option-heading"><span class="option-label">{{ product.category === 'Camisas' || product.id === 1 ? 'Tamanho' : 'Opção' }}: <strong>{{ size || 'selecione' }}</strong></span><button v-if="product.category === 'Camisas' || product.id === 1" class="size-guide" @click="guideOpen = true"><Ruler :size="16" />Guia de tamanhos</button></div><div id="product-options" class="size-options" role="group" aria-label="Selecione o tamanho ou opção" tabindex="-1" :aria-describedby="error ? 'size-error' : undefined"><button v-for="s in product.sizes" :key="s" :class="{ selected: size === s }" :aria-pressed="size === s" @click="size = s; error = ''">{{ s }}</button></div><p v-if="error" id="size-error" class="field-error" role="alert">{{ error }}</p></div>
        <div class="purchase-row"><div class="quantity"><button :disabled="quantity === 1" aria-label="Diminuir quantidade" @click="quantity--"><Minus :size="16" /></button><span>{{ quantity }}</span><button :disabled="quantity === 10" aria-label="Aumentar quantidade" @click="quantity++"><Plus :size="16" /></button></div><button class="button button-primary add-to-bag" @click="add"><ShoppingBag :size="18" /> Adicionar à sacola <ArrowUpRight :size="18" /></button><button class="detail-favorite icon-button" :class="{ saved: favorites.includes(product.id) }" :aria-label="favorites.includes(product.id) ? 'Remover dos favoritos' : 'Salvar nos favoritos'" :aria-pressed="favorites.includes(product.id)" @click="toggleFavorite(product.id)"><Heart :size="21" /></button></div>
        <div class="product-service"><div><Fingerprint :size="20" /><span>Design<br /><strong>autoral Aegon</strong></span></div><div><Package :size="20" /><span>Essenciais<br /><strong>pra sua rotina</strong></span></div></div><p class="prelaunch-note">Coleção em pré-lançamento. Explore e monte sua sacola.</p>
        <details class="product-accordion" open><summary>Sobre este essencial <Plus :size="17" /></summary><p>{{ product.description }}</p></details><details class="product-accordion"><summary>Entrega e trocas <Plus :size="17" /></summary><p>As condições de entrega e troca serão publicadas antes da abertura das vendas. O checkout desta prévia permite simular o seu pedido, sem cobrança.</p></details>
      </div>
    </section>
    <section class="product-story"><div class="product-story-content"><div class="detail-tabs" role="group" aria-label="Informações do produto"><button v-for="tab in ['Detalhes', 'Cuidados']" :key="tab" :class="{ selected: activeTab === tab }" :aria-pressed="activeTab === tab" @click="activeTab = tab">{{ tab }}</button></div><template v-if="activeTab === 'Detalhes'"><h2>É nos detalhes que a gente se encontra.</h2><ul class="specs-list"><li v-for="spec in product.specs" :key="spec"><Check :size="16" />{{ spec }}</li></ul></template><template v-else><h2>Cuide bem do que acompanha você.</h2><p v-if="product.category === 'Camisas' || product.id === 1">Lave do avesso, com cores semelhantes e água fria. Seque à sombra e evite passar diretamente sobre a estampa. Consulte a etiqueta da peça antes da lavagem.</p><p v-else-if="product.category === 'Garrafas'">Lave à mão com detergente neutro e esponja macia. Deixe secar com a tampa aberta. Não leve ao micro-ondas ou ao congelador.</p><p v-else>Mantenha longe de umidade e luz solar direta. Para limpar a capa, use um pano macio levemente umedecido.</p></template></div><div class="detail-brand-card"><img src="/brand/assets/Logos/simbolo-on-claro.svg" alt="on" width="110" height="66" /><span>MENOS DO MESMO.<br />EM CADA DETALHE.</span><small>AEGON ESSENTIALS</small></div></section>
    <section class="related-section"><div class="section-heading"><div><span class="eyebrow">COMBINA COM VOCÊ. E COM ISSO AQUI.</span><h2>Continue no modo on<span class="blue-period">.</span></h2></div><RouterLink to="/produtos" class="text-link">Ver coleção <ArrowUpRight :size="17" /></RouterLink></div><div class="product-grid"><ProductCard v-for="p in suggested" :key="p.id" :product="p" /></div></section>
  </div>
  <div v-else class="empty-state page-container catalog-empty"><h1>Esse essencial não está por aqui.</h1><p>Conheça os produtos da nossa coleção.</p><RouterLink to="/produtos" class="button button-primary">Explorar a coleção <ArrowRight :size="18" /></RouterLink></div>
  <OverlayPanel v-if="zoom && product" :title="product.name" @close="zoom = false"><img class="zoom-image" :src="product.image" :alt="product.name" /></OverlayPanel>
  <OverlayPanel v-if="guideOpen" title="Guia de tamanhos" @close="guideOpen = false"><div class="info-copy"><p>Escolha uma camiseta que veste bem em você e compare sua modelagem. As medidas oficiais de cada peça serão disponibilizadas na abertura da coleção.</p><div class="size-guide-options"><span v-for="s in ['P', 'M', 'G', 'GG']" :key="s">{{ s }}</span></div><p>Na dúvida sobre o caimento? <a href="mailto:aegoncorps@gmail.com">Fale com a gente.</a></p></div></OverlayPanel>
</template>
