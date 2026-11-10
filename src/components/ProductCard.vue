<script setup lang="ts">
import { Heart, ArrowUpRight } from 'lucide-vue-next'
import { type Product, money } from '../data/products'
import { favorites, toggleFavorite } from '../store'
import { track } from '../admin-store'
defineProps<{ product: Product }>()
function hover(product: Product) { track('product_hover', { productId: product.id, path: window.location.hash }) }
function openProduct(product: Product, event: MouseEvent) { track('product_click', { productId: product.id, path: window.location.hash, x: Math.round(event.clientX / window.innerWidth * 100), y: Math.round(event.clientY / window.innerHeight * 100) }) }
</script>

<template>
  <article class="product-card" @mouseenter.once="hover(product)">
    <div class="product-visual" :class="`product-visual--${product.category.toLowerCase()}`">
      <span v-if="product.badge" class="product-badge">{{ product.badge }}</span>
      <button class="favorite-button icon-button" :class="{ saved: favorites.includes(product.id) }" :aria-label="`${favorites.includes(product.id) ? 'Remover' : 'Salvar'} ${product.name} ${favorites.includes(product.id) ? 'dos' : 'nos'} favoritos`" :aria-pressed="favorites.includes(product.id)" @click="toggleFavorite(product.id)"><Heart :size="18" /></button>
      <RouterLink :to="`/produto/${product.id}`" class="product-image-link" :aria-label="`Ver ${product.name}`" @click="openProduct(product, $event)">
        <img :src="product.image" :alt="product.name" loading="lazy" width="800" height="800" />
        <span class="product-discover">Conhecer produto <ArrowUpRight :size="16" /></span>
      </RouterLink>
    </div>
    <div class="product-card-meta"><span>{{ product.category }}</span><span class="color-dot" :style="{ background: product.color }" :title="product.colorName"></span></div>
    <RouterLink :to="`/produto/${product.id}`" class="product-name" @click="openProduct(product, $event)">{{ product.name }}</RouterLink>
    <div class="product-price">{{ money(product.price) }} <span>ou 3x de {{ money(product.price / 3) }}</span></div>
  </article>
</template>
