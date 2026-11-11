import { computed, reactive, ref, watch } from 'vue'
import { products, type Product } from './data/products'

export type AnalyticsEventName = 'product_hover' | 'product_click' | 'add_to_cart' | 'checkout_started' | 'order_completed'
export interface AnalyticsEvent {
  id: string
  name: AnalyticsEventName
  productId?: number
  path: string
  x?: number
  y?: number
  at: string
}
export interface CustomerAddress {
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  cep: string
}
export interface Order {
  id: string
  createdAt: string
  status: 'Novo' | 'Separando' | 'Enviado' | 'Entregue'
  shipping: 'PAC' | 'SEDEX'
  paymentMethod?: 'pix' | 'card'
  customer: { name: string; email: string; phone: string; address: CustomerAddress }
  items: Array<{ productId: number; name: string; size: string; quantity: number; price: number }>
  total: number
}
export interface StorefrontConfig {
  eyebrow: string
  headline: string
  highlight: string
  subtitle: string
  cta: string
  heroImage: string
}
export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'shipping'
  value: number
  minimumOrder: number
  usageLimit: number | null
  used: number
  active: boolean
}
const now = () => new Date().toISOString()
function read<T>(key: string, fallback: T): T {
  try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value ?? fallback } catch { return fallback }
}
function persist(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)) } catch { storageIssue.value = 'Não foi possível salvar tudo neste navegador. Remova imagens grandes ou libere espaço.' } }
export const storageIssue = ref('')
export const analyticsEvents = reactive<AnalyticsEvent[]>(read<AnalyticsEvent[]>('aegon:analytics:v1', []))
export const orders = reactive<Order[]>(read<Order[]>('aegon:orders:v1', []))
export const storefront = reactive<StorefrontConfig>(read<StorefrontConfig>('aegon:storefront:v1', {
  eyebrow: 'Aegon essentials — coleção 01',
  headline: 'MENOS DO\nMESMO.',
  highlight: 'MAIS VOCÊ.',
  subtitle: 'Essenciais com a nossa identidade.\nPra fazer parte da sua.',
  cta: 'Encontre seu próximo essencial',
  heroImage: '/editorial/aegon-flatlay.png',
}))
export const coupons = reactive<Coupon[]>(read<Coupon[]>('aegon:coupons:v1', [{ id: 'welcome-10', code: 'BEMVINDO10', type: 'percentage', value: 10, minimumOrder: 0, usageLimit: 100, used: 0, active: true }]))
watch(analyticsEvents, value => persist('aegon:analytics:v1', value), { deep: true })
watch(orders, value => persist('aegon:orders:v1', value), { deep: true })
watch(storefront, value => persist('aegon:storefront:v1', value), { deep: true })
watch(coupons, value => persist('aegon:coupons:v1', value), { deep: true })

export function track(name: AnalyticsEventName, options: Omit<AnalyticsEvent, 'id' | 'name' | 'at'> = { path: window.location.hash }) {
  analyticsEvents.push({ id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, name, path: options.path || window.location.hash, productId: options.productId, x: options.x, y: options.y, at: now() })
}
export function recordOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>) {
  const created: Order = { ...order, id: `AG-${String(Date.now()).slice(-7)}`, createdAt: now(), status: 'Novo' }
  orders.unshift(created)
  track('order_completed', { path: '#/checkout' })
  return created
}
export function updateOrderStatus(order: Order, status: Order['status']) { order.status = status }
export function createProduct(input: Omit<Product, 'id'>) {
  const id = Math.max(0, ...products.map(product => product.id)) + 1
  products.unshift({ ...input, id, active: input.active ?? true, images: input.images?.length ? input.images : [input.image] })
}
export function updateProduct(id: number, input: Omit<Product, 'id'>) {
  const index = products.findIndex(product => product.id === id)
  if (index !== -1) products[index] = { ...input, id, images: input.images?.length ? input.images : [input.image] }
}
export function deleteProduct(id: number) {
  const index = products.findIndex(product => product.id === id)
  if (index !== -1) products.splice(index, 1)
}
export function resetDemoData() {
  analyticsEvents.splice(0)
  orders.splice(0)
}
export function createCoupon(input: Omit<Coupon, 'id' | 'used'>) {
  coupons.unshift({ ...input, id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, used: 0, code: input.code.trim().toUpperCase() })
}
export function deleteCoupon(id: string) { const index = coupons.findIndex(coupon => coupon.id === id); if (index !== -1) coupons.splice(index, 1) }
export function findActiveCoupon(code: string) { return coupons.find(coupon => coupon.active && coupon.code.toUpperCase() === code.trim().toUpperCase() && (!coupon.usageLimit || coupon.used < coupon.usageLimit)) }
export const metricSummary = computed(() => {
  const count = (name: AnalyticsEventName) => analyticsEvents.filter(event => event.name === name).length
  const hovers = count('product_hover')
  const clicks = count('product_click')
  const carts = count('add_to_cart')
  const checkouts = count('checkout_started')
  const sold = orders.length
  return { hovers, clicks, carts, checkouts, sold, revenue: orders.reduce((total, order) => total + order.total, 0), conversion: clicks ? (sold / clicks) * 100 : 0 }
})
export function downloadOrdersCsv() {
  const rows = [['Pedido', 'Data', 'Status', 'Cliente', 'E-mail', 'Telefone', 'Endereço', 'Envio', 'Itens', 'Total']]
  orders.forEach(order => rows.push([order.id, new Date(order.createdAt).toLocaleString('pt-BR'), order.status, order.customer.name, order.customer.email, order.customer.phone, `${order.customer.address.street}, ${order.customer.address.number} - ${order.customer.address.district}, ${order.customer.address.city}/${order.customer.address.state} - ${order.customer.address.cep}`, order.shipping, order.items.map(item => `${item.quantity}x ${item.name} (${item.size})`).join(' | '), order.total.toFixed(2).replace('.', ',')]))
  const content = '\uFEFF' + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\n')
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
  link.download = `pedidos-aegon-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
