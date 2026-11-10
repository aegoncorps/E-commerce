import { computed, ref, watch } from 'vue'
import { products } from './data/products'
import { addCartItem, normalizeCart, cartTotal, MAX_QUANTITY } from './lib/cart.mjs'
import { track } from './admin-store'

export interface CartRow { productId: number; size: string; quantity: number }
function readStorage(key: string): unknown {
  try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
}
export const storageWarning = ref(false)
function saveStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { storageWarning.value = true }
}
export const cart = ref<CartRow[]>(normalizeCart(readStorage('aegon:cart:v1'), products))
const savedFavorites = readStorage('aegon:favorites:v1')
export const favorites = ref<number[]>(Array.isArray(savedFavorites) ? savedFavorites.filter(id => products.some(p => p.id === id)) : [])
export const cartOpen = ref(false)
export const searchOpen = ref(false)
export const menuOpen = ref(false)
export const notice = ref('')
let noticeTimer: ReturnType<typeof setTimeout>
export function notify(message: string) {
  notice.value = message
  clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => { notice.value = '' }, 4000)
}
export const cartItems = computed(() => cart.value.map(row => ({ ...row, product: products.find(p => p.id === row.productId)! })))
export const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))
export const subtotal = computed(() => cartTotal(cart.value, products))
export function addToCart(productId: number, size: string, quantity = 1) {
  const product = products.find(p => p.id === productId)
  if (!product?.sizes.includes(size)) return false
  cart.value = addCartItem(cart.value, productId, size, quantity, products)
  track('add_to_cart', { productId, path: window.location.hash })
  cartOpen.value = true
  return true
}
export function setQuantity(productId: number, size: string, quantity: number) {
  if (quantity <= 0) cart.value = cart.value.filter(row => row.productId !== productId || row.size !== size)
  else {
    const row = cart.value.find(row => row.productId === productId && row.size === size)
    if (row) row.quantity = Math.min(MAX_QUANTITY, Math.max(1, Math.round(quantity)))
  }
}
export function toggleFavorite(id: number) {
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter(value => value !== id)
    notify('Produto removido dos favoritos.')
  } else {
    favorites.value.push(id)
    notify('Produto salvo nos favoritos.')
  }
}
watch(cart, value => saveStorage('aegon:cart:v1', value), { deep: true })
watch(favorites, value => saveStorage('aegon:favorites:v1', value), { deep: true })
