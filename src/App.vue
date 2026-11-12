<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, ShoppingBag, Heart, ArrowUpRight, ArrowRight, Menu, Plus, Minus, Trash2, Check, Package, Sparkles, MoveUpRight, Truck } from 'lucide-vue-next'
import OverlayPanel from './components/OverlayPanel.vue'
import { money, products } from './data/products'
import { cartOpen, searchOpen, menuOpen, cartCount, cartItems, subtotal, setQuantity, notice, storageWarning } from './store'

const route = useRoute()
const router = useRouter()
const isAdmin = computed(() => route.path.startsWith('/admin'))
const search = ref('')
const info = ref('')
const announcementIndex = ref(0)
let announcementTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  announcementTimer = setInterval(() => {
    announcementIndex.value = announcementIndex.value === 0 ? 1 : 0
  }, 5000)
})
onBeforeUnmount(() => {
  if (announcementTimer) clearInterval(announcementTimer)
})
function skipToContent() {
  const main = document.getElementById('main-content')
  main?.focus()
  main?.scrollIntoView()
}
const matches = computed(() => {
  const query = search.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
  return products.filter(p => `${p.name} ${p.category}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(query)).slice(0, 5)
})
const modalOpen = computed(() => cartOpen.value || searchOpen.value || menuOpen.value || Boolean(info.value))
function submitSearch() {
  searchOpen.value = false
  router.push({ path: '/produtos', query: search.value.trim() ? { q: search.value.trim() } : {} })
}
watch(() => route.fullPath, () => {
  cartOpen.value = false
  searchOpen.value = false
  menuOpen.value = false
  info.value = ''
})
const infoCopy: Record<string, string[]> = {
  'Entrega e trocas': ['Nossa loja está em pré-lançamento. Prazos, cobertura de entrega e condições de troca serão publicados antes da abertura das vendas.', 'Você já pode explorar a coleção e montar sua sacola. O checkout atual é uma simulação e não realiza cobranças.'],
  'Fale com a Aegon': ['Uma ideia, uma pergunta ou vontade de criar junto? Fale com a gente.', 'aegoncorps@gmail.com · @AegonBr'],
  'Privacidade': ['Nesta prévia, a sacola e os favoritos ficam salvos apenas neste navegador. Nenhum pagamento é processado.', 'Os dados do formulário de simulação não são enviados nem armazenados. Para apagar sacola e favoritos, limpe os dados do site no navegador.'],
}
</script>

<template>
  <div class="site" :inert="modalOpen || undefined">
    <template v-if="!isAdmin">
    <a href="#main-content" class="skip-link" @click.prevent="skipToContent">Pular para o conteúdo</a>
    <div class="announcement"><span class="announcement-brand">Feito por gente. Menos do mesmo.</span><span class="announcement-center"><Transition name="push-right" mode="out-in"><span :key="announcementIndex" class="announcement-slide"><template v-if="announcementIndex === 0">A sua rotina no modo <span class="tiny-on">on</span></template><template v-else><Truck :size="15" stroke-width="2" /> Frete grátis na primeira compra</template></span></Transition></span><span class="announcement-region">Brasil <span class="announcement-divider">/</span> BRL R$</span></div>
    <header class="site-header">
      <div class="header-inner">
        <RouterLink to="/" class="brand-link" aria-label="Aegon Store — início"><img src="/brand/assets/Logos/aegon-logo-positivo.svg" alt="aegon" width="126" height="47" /><span class="brand-store">store</span></RouterLink>
        <nav class="desktop-nav" aria-label="Navegação principal">
          <RouterLink to="/" :class="{ active: route.path === '/' }">Início</RouterLink>
          <RouterLink to="/produtos" :class="{ active: route.path === '/produtos' && !route.query.categoria }">Toda a coleção</RouterLink>
          <RouterLink to="/produtos?categoria=Camisas" :class="{ active: route.query.categoria === 'Camisas' }">Vestuário</RouterLink>
          <RouterLink to="/produtos?categoria=Combos" :class="{ active: route.query.categoria === 'Combos' }">Kits & combos <span class="nav-dot"></span></RouterLink>
          <RouterLink :to="{ path: '/', hash: '#manifesto' }">Nosso jeito</RouterLink>
        </nav>
        <div class="header-actions">
          <button class="icon-button" aria-label="Buscar produtos" @click="searchOpen = true"><Search :size="21" /></button>
          <RouterLink to="/favoritos" class="icon-button favorites-nav" aria-label="Ver favoritos"><Heart :size="21" /></RouterLink>
          <span class="action-separator"></span>
          <button class="bag-button" aria-label="Abrir sacola" @click="cartOpen = true"><ShoppingBag :size="20" /><span class="bag-label">Sacola</span><span class="bag-count">{{ cartCount }}</span></button>
          <button class="icon-button mobile-menu-toggle" aria-label="Abrir menu" @click="menuOpen = true"><Menu :size="23" /></button>
        </div>
      </div>
    </header>

    </template>
    <main id="main-content" tabindex="-1"><RouterView /></main>

    <template v-if="!isAdmin">
    <section class="contact-band page-container"><div><span class="eyebrow">A gente gosta de conexões.</span><h2>Vamos deixar tudo <span class="display-on">on</span>?</h2></div><a href="mailto:aegoncorps@gmail.com" class="button button-outline">Fale com a Aegon <ArrowUpRight :size="18" /></a></section>
    <footer class="site-footer">
      <div class="footer-top page-container">
        <div class="footer-brand"><RouterLink to="/" aria-label="Voltar ao início"><img src="/brand/assets/Logos/aegon-logo-escuro.svg" alt="aegon" width="145" height="54" /></RouterLink><p>Pra vestir, criar e levar com você.<br />Feito por gente. Menos do mesmo.</p><a href="https://www.instagram.com/AegonBr/" target="_blank" rel="noopener noreferrer">@AegonBr <MoveUpRight :size="14" /></a></div>
        <div class="footer-column"><h3>Explore a coleção</h3><RouterLink to="/produtos?categoria=Camisas">Camisas</RouterLink><RouterLink to="/produtos?categoria=Garrafas">Garrafas</RouterLink><RouterLink to="/produtos?categoria=Cadernos">Cadernos</RouterLink><RouterLink to="/produtos?categoria=Combos">Kits & combos</RouterLink></div>
        <div class="footer-column"><h3>Estamos por aqui</h3><button @click="info = 'Fale com a Aegon'">Fale com a gente</button><button @click="info = 'Entrega e trocas'">Entrega e trocas</button><button @click="info = 'Privacidade'">Privacidade</button><RouterLink to="/favoritos">Seus favoritos</RouterLink></div>
        <div class="footer-signature"><img src="/brand/assets/Logos/simbolo-on-claro.svg" alt="on" width="105" height="60" /><p>Tudo se resolve<br />no mesmo botão.</p></div>
      </div>
      <div class="footer-bottom page-container"><span>© {{ new Date().getFullYear() }} Aegon. Todos os direitos reservados.</span><span>aegoncorps.com.br <ArrowUpRight :size="13" /></span><span>Criado com intenção. Sempre on.</span></div>
    </footer>
    </template>
  </div>

  <Transition name="toast"><div v-if="notice" class="toast-message" role="status"><Check :size="18" />{{ notice }}</div></Transition>

  <template v-if="!isAdmin"><OverlayPanel v-if="searchOpen" title="O que te deixa on?" @close="searchOpen = false">
    <form class="search-form" @submit.prevent="submitSearch"><Search :size="22" /><input v-model="search" data-autofocus type="search" aria-label="Buscar na coleção" placeholder="Camisas, garrafas, cadernos..." /><button class="icon-button" aria-label="Ver resultados"><ArrowRight :size="23" /></button></form>
    <p class="panel-caption">{{ search ? `${matches.length} sugestões para você` : 'Explore nossos essenciais' }}</p>
    <div class="search-results"><RouterLink v-for="p in matches" :key="p.id" :to="`/produto/${p.id}`" class="search-result" @click="searchOpen = false"><img :src="p.image" :alt="p.name" width="64" height="64" /><span><strong>{{ p.name }}</strong><small>{{ p.category }} · {{ money(p.price) }}</small></span><ArrowUpRight :size="18" /></RouterLink><div v-if="!matches.length" class="empty-state"><Search :size="30" /><h3>Nenhum essencial por aqui.</h3><p>Tente outro nome ou explore toda a coleção.</p></div></div>
    <button class="button button-primary full-width" @click="submitSearch">Ver {{ search ? 'todos os resultados' : 'toda a coleção' }} <ArrowRight :size="17" /></button>
  </OverlayPanel>

  <OverlayPanel v-if="cartOpen" :title="`Sua sacola (${cartCount})`" side @close="cartOpen = false">
    <template v-if="cartItems.length">
      <p class="bag-intro"><ShoppingBag :size="16" /> Boas escolhas. A sua rotina agradece.</p>
      <p v-if="storageWarning" class="form-warning">Seu navegador não permitiu salvar a sacola. Ela ficará disponível enquanto esta página estiver aberta.</p>
      <div class="cart-items"><article v-for="item in cartItems" :key="`${item.productId}-${item.size}`" class="cart-item"><RouterLink :to="`/produto/${item.productId}`" @click="cartOpen = false"><img :src="item.product.image" :alt="item.product.name" width="102" height="120" /></RouterLink><div class="cart-item-info"><RouterLink :to="`/produto/${item.productId}`" @click="cartOpen = false">{{ item.product.name }}</RouterLink><small>{{ item.product.colorName }} / {{ item.size }}</small><strong>{{ money(item.product.price) }}</strong><div class="quantity"><button :aria-label="`Diminuir quantidade de ${item.product.name}`" @click="setQuantity(item.productId, item.size, item.quantity - 1)"><Minus :size="14" /></button><span>{{ item.quantity }}</span><button :disabled="item.quantity >= 10" :aria-label="`Aumentar quantidade de ${item.product.name}`" @click="setQuantity(item.productId, item.size, item.quantity + 1)"><Plus :size="14" /></button></div></div><button class="icon-button remove-item" :aria-label="`Remover ${item.product.name}`" @click="setQuantity(item.productId, item.size, 0)"><Trash2 :size="17" /></button></article></div>
      <div class="cart-summary"><div><span>Subtotal</span><strong>{{ money(subtotal) }}</strong></div><p>Entrega e condições de pagamento serão confirmadas na abertura das vendas.</p><RouterLink to="/checkout" class="button button-primary full-width">Revisar pedido <ArrowRight :size="18" /></RouterLink><button class="text-button full-width" @click="cartOpen = false">Continuar explorando</button></div>
    </template>
    <div v-else class="empty-state empty-bag"><ShoppingBag :size="42" :stroke-width="1.2" /><span class="eyebrow">Um espaço para o que é seu.</span><h3>Sua próxima boa<br />escolha começa aqui.</h3><p>Encontre algo pra acompanhar sua rotina.</p><RouterLink to="/produtos" class="button button-primary" @click="cartOpen = false">Explorar a coleção <ArrowRight :size="18" /></RouterLink></div>
  </OverlayPanel>

  <OverlayPanel v-if="menuOpen" title="Explore a Aegon" side @close="menuOpen = false"><nav class="mobile-nav" aria-label="Navegação mobile" @click="menuOpen = false"><RouterLink to="/">Início <ArrowUpRight /></RouterLink><RouterLink to="/produtos">Toda a coleção <ArrowUpRight /></RouterLink><RouterLink to="/produtos?categoria=Camisas">Vestuário <ArrowUpRight /></RouterLink><RouterLink to="/produtos?categoria=Combos">Kits & combos <ArrowUpRight /></RouterLink><RouterLink to="/favoritos">Favoritos <Heart /></RouterLink></nav><img class="menu-symbol" src="/brand/assets/Logos/on-tipografico-azul.svg" alt="on" /></OverlayPanel>
  <OverlayPanel v-if="info" :title="info" @close="info = ''"><div class="info-copy"><p v-for="paragraph in infoCopy[info]" :key="paragraph">{{ paragraph }}</p><a v-if="info === 'Fale com a Aegon'" class="button button-primary" href="mailto:aegoncorps@gmail.com">Enviar e-mail <ArrowUpRight :size="18" /></a></div></OverlayPanel></template>
</template>

<style scoped>
.announcement-center{position:relative;overflow:hidden;min-height:22px}
.announcement-slide{display:inline-flex;align-items:center;gap:7px;white-space:nowrap}
.announcement-divider{padding:0 10px;opacity:.5}
.push-right-enter-active,.push-right-leave-active{transition:transform .35s ease,opacity .35s ease}
.push-right-enter-from{transform:translateX(-18px);opacity:0}
.push-right-leave-to{transform:translateX(18px);opacity:0}
@media(max-width:650px){
  .announcement{justify-content:space-between;padding-inline:12px;font-size:8px}
  .announcement-brand{display:none}
  .announcement-center{font-size:8px}
  .announcement-slide{gap:4px}
  .announcement-divider{padding:0 3px}
}
</style>
