<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowUpRight, Search, X, SlidersHorizontal, Heart } from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import { categories, products } from '../data/products'
import { favorites } from '../store'
const route = useRoute()
const router = useRouter()
const isFavorites = computed(() => route.path === '/favoritos')
const category = computed(() => String(route.query.categoria || 'Todos'))
const query = computed(() => String(route.query.q || ''))
const sort = computed(() => String(route.query.ordem || 'destaques'))
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const filtered = computed(() => {
  let list = products.filter(p => p.active !== false && (!isFavorites.value || favorites.value.includes(p.id)) && (category.value === 'Todos' || p.category === category.value) && normalize(`${p.name} ${p.category} ${p.colorName}`).includes(normalize(query.value)))
  if (sort.value === 'menor') list.sort((a, b) => a.price - b.price)
  else if (sort.value === 'maior') list.sort((a, b) => b.price - a.price)
  else if (sort.value === 'nome') list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  else list.sort((a, b) => Number(Boolean(b.badge)) - Number(Boolean(a.badge)))
  return list
})
function updateFilter(key: string, value: string) {
  router.replace({ query: { ...route.query, [key]: value === 'Todos' || !value ? undefined : value } })
}
</script>

<template>
  <div class="catalog-page page-container"><nav class="breadcrumb" aria-label="Caminho da página"><RouterLink to="/">Início</RouterLink><span>/</span><span>{{ isFavorites ? 'Favoritos' : 'Coleção' }}</span></nav><div class="catalog-intro"><div><span class="eyebrow">{{ isFavorites ? 'GUARDADOS PRA VOCÊ' : 'AEGON ESSENTIALS / COLEÇÃO 01' }}</span><h1>{{ isFavorites ? 'Suas boas escolhas.' : 'Encontre o seu modo on.' }}</h1><p>{{ isFavorites ? 'Aqueles essenciais que ficaram na sua cabeça.' : 'Essenciais pra vestir, criar e levar com você. Sempre com identidade.' }}</p></div><span class="catalog-on-float"><img class="catalog-on-mark" src="/brand/assets/Logos/on-tipografico-azul.svg" alt="on" width="110" height="70" /></span></div>
    <div class="catalog-toolbar"><div class="category-tabs" role="group" aria-label="Filtrar por categoria"><button v-for="c in categories" :key="c" :class="{ selected: category === c }" :aria-pressed="category === c" @click="updateFilter('categoria', c)">{{ c }}</button></div><label class="catalog-sort"><SlidersHorizontal :size="16" /><span class="sr-only">Ordenar produtos</span><select :value="sort" @change="updateFilter('ordem', ($event.target as HTMLSelectElement).value)"><option value="destaques">Destaques</option><option value="menor">Menor preço</option><option value="maior">Maior preço</option><option value="nome">Nome: A a Z</option></select></label></div>
    <div class="catalog-count"><span>{{ filtered.length }} {{ filtered.length === 1 ? 'essencial' : 'essenciais' }} {{ isFavorites ? 'nos favoritos' : 'com a nossa identidade' }}</span><button v-if="query" class="query-chip" @click="updateFilter('q', '')">Busca: {{ query }} <X :size="14" /></button><button v-if="category !== 'Todos' || query" class="text-button" @click="router.replace({ query: {} })">Limpar filtros</button></div>
    <div v-if="filtered.length" class="product-grid catalog-grid"><ProductCard v-for="p in filtered" :key="p.id" :product="p" /></div><div v-else class="empty-state catalog-empty"><Heart v-if="isFavorites" :size="40" :stroke-width="1.2" /><Search v-else :size="40" :stroke-width="1.2" /><h2>{{ isFavorites ? 'Um lugar para seus favoritos.' : 'Ainda não encontramos esse essencial.' }}</h2><p>{{ isFavorites ? 'Toque no coração de um produto para guardá-lo aqui.' : 'Experimente outra busca ou limpe os filtros para ver a coleção.' }}</p><RouterLink to="/produtos" class="button button-primary">Explorar toda a coleção <ArrowUpRight :size="18" /></RouterLink></div>
    <div class="catalog-end"><span class="display-on">on</span><p>Menos do mesmo. Mais do que combina com você.</p></div>
  </div>
</template>
