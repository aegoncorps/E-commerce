<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ArrowLeft, ArrowUpRight, ArrowRight, Check, ShoppingBag, Info, MapPin } from 'lucide-vue-next'
import { money } from '../data/products'
import { cart, cartItems, subtotal } from '../store'
import { findActiveCoupon, recordOrder, track, type Coupon } from '../admin-store'
const completed = ref(false)
const orderId = ref('')
const agreed = ref(false)
const couponCode = ref('')
const couponMessage = ref('')
const appliedCoupon = ref<Coupon | null>(null)
const buyer = reactive({ name: '', email: '', phone: '', cep: '', street: '', number: '', complement: '', district: '', city: '', state: '', shipping: 'PAC' as 'PAC' | 'SEDEX' })
const hasItems = computed(() => cartItems.value.length > 0)
const discount = computed(() => {
  const coupon = appliedCoupon.value
  if (!coupon || subtotal.value < coupon.minimumOrder) return 0
  if (coupon.type === 'percentage') return Math.min(subtotal.value, subtotal.value * coupon.value / 100)
  if (coupon.type === 'fixed') return Math.min(subtotal.value, coupon.value)
  return 0
})
const checkoutTotal = computed(() => Math.max(0, subtotal.value - discount.value))
onMounted(() => { if (hasItems.value) track('checkout_started', { path: '#/checkout' }) })
function simulate() {
  if (!agreed.value || !cartItems.value.length) return
  const order = recordOrder({
    shipping: buyer.shipping,
    customer: { name: buyer.name, email: buyer.email, phone: buyer.phone, address: { cep: buyer.cep, street: buyer.street, number: buyer.number, complement: buyer.complement, district: buyer.district, city: buyer.city, state: buyer.state } },
    items: cartItems.value.map(item => ({ productId: item.productId, name: item.product.name, size: item.size, quantity: item.quantity, price: item.product.price })),
    total: checkoutTotal.value,
  })
  if (appliedCoupon.value) appliedCoupon.value.used += 1
  orderId.value = order.id
  cart.value = []
  completed.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function applyCoupon() {
  const coupon = findActiveCoupon(couponCode.value)
  if (!coupon) { appliedCoupon.value = null; couponMessage.value = 'Código inválido, pausado ou sem usos disponíveis.'; return }
  if (subtotal.value < coupon.minimumOrder) { appliedCoupon.value = null; couponMessage.value = `Este código exige pedido mínimo de ${money(coupon.minimumOrder)}.`; return }
  appliedCoupon.value = coupon
  couponMessage.value = coupon.type === 'shipping' ? 'Frete grátis aplicado à simulação.' : `Cupom ${coupon.code} aplicado.`
}
</script>

<template>
  <div class="checkout-page page-container"><RouterLink to="/produtos" class="text-link"><ArrowLeft :size="17" />Continuar explorando</RouterLink>
    <template v-if="completed"><section class="checkout-success empty-state"><span class="success-mark"><Check :size="32" /></span><span class="eyebrow">PEDIDO DE DEMONSTRAÇÃO REGISTRADO</span><h1>Seu modo on está pronto.</h1><p>O pedido <strong>{{ orderId }}</strong> foi criado na área administrativa local. Nenhum pagamento foi cobrado e os dados não foram enviados a terceiros.</p><RouterLink to="/admin" class="button button-primary">Abrir administração <ArrowUpRight :size="18" /></RouterLink><RouterLink to="/" class="text-link">Voltar para o início <ArrowRight :size="16" /></RouterLink></section></template>
    <template v-else-if="cartItems.length"><div class="checkout-heading"><span class="eyebrow">SUAS ESCOLHAS, EM UM SÓ LUGAR.</span><h1>Seu pedido, quase on<span class="blue-period">.</span></h1></div><div class="checkout-alert" role="note"><Info :size="21" /><div><strong>Você está na prévia da Aegon Store.</strong><p>Este checkout registra um pedido de demonstração somente neste navegador. Nenhum pagamento ou envio real será iniciado.</p></div></div><div class="checkout-grid"><form class="checkout-form" @submit.prevent="simulate"><h2>01 <span>Vamos nos conhecer?</span></h2><label for="buyer-name">Nome completo</label><input id="buyer-name" v-model.trim="buyer.name" required minlength="2" maxlength="100" autocomplete="name" placeholder="Nome de quem vai receber" /><label for="buyer-email">E-mail</label><input id="buyer-email" v-model.trim="buyer.email" required type="email" maxlength="150" autocomplete="email" placeholder="voce@exemplo.com" /><label for="buyer-phone">Telefone</label><input id="buyer-phone" v-model.trim="buyer.phone" required inputmode="tel" maxlength="20" autocomplete="tel" placeholder="(00) 00000-0000" /><h2>02 <span>Pra onde vamos?</span></h2><div class="checkout-two"><label for="buyer-cep">CEP<input id="buyer-cep" v-model.trim="buyer.cep" required inputmode="numeric" pattern="[0-9]{5}-?[0-9]{3}" maxlength="9" autocomplete="postal-code" placeholder="00000-000" /></label><label for="buyer-state">UF<input id="buyer-state" v-model.trim="buyer.state" required minlength="2" maxlength="2" autocapitalize="characters" placeholder="SP" /></label></div><label for="buyer-street">Rua / avenida</label><input id="buyer-street" v-model.trim="buyer.street" required maxlength="120" autocomplete="street-address" placeholder="Nome da rua" /><div class="checkout-two"><label for="buyer-number">Número<input id="buyer-number" v-model.trim="buyer.number" required maxlength="15" placeholder="123" /></label><label for="buyer-complement">Complemento<input id="buyer-complement" v-model.trim="buyer.complement" maxlength="60" placeholder="Apto, bloco..." /></label></div><label for="buyer-district">Bairro</label><input id="buyer-district" v-model.trim="buyer.district" required maxlength="80" placeholder="Seu bairro" /><label for="buyer-city">Cidade</label><input id="buyer-city" v-model.trim="buyer.city" required maxlength="80" autocomplete="address-level2" placeholder="Sua cidade" /><h2>03 <span>Como enviamos?</span></h2><div class="shipping-options"><label :class="{ selected: buyer.shipping === 'PAC' }"><input v-model="buyer.shipping" type="radio" value="PAC" /><span><strong>PAC</strong><small>Pra chegar no seu ritmo.</small></span></label><label :class="{ selected: buyer.shipping === 'SEDEX' }"><input v-model="buyer.shipping" type="radio" value="SEDEX" /><span><strong>SEDEX</strong><small>Pra quem precisa logo.</small></span></label></div><label class="checkbox-label"><input v-model="agreed" type="checkbox" required /><span>Entendo que este pedido é uma simulação local, sem reserva de produtos, venda ou cobrança.</span></label><button class="button button-primary full-width" type="submit">Concluir simulação <ArrowRight :size="18" /></button></form><aside class="checkout-summary"><h2>Sua sacola <span>{{ cartItems.length }} {{ cartItems.length === 1 ? 'item' : 'itens' }}</span></h2><div v-for="item in cartItems" :key="`${item.productId}:${item.size}`" class="checkout-item"><img :src="item.product.image" :alt="item.product.name" width="78" height="90" /><div><RouterLink :to="`/produto/${item.productId}`">{{ item.product.name }}</RouterLink><small>{{ item.size }} / Quantidade: {{ item.quantity }}</small><strong>{{ money(item.product.price * item.quantity) }}</strong></div></div><div class="coupon-apply"><label for="coupon-code">Cupom de desconto</label><div><input id="coupon-code" v-model.trim="couponCode" maxlength="30" placeholder="Digite seu código" @keydown.enter.prevent="applyCoupon" /><button type="button" @click="applyCoupon">Aplicar</button></div><small :class="{ error: couponMessage && !appliedCoupon }">{{ couponMessage || 'Códigos criados no painel admin funcionam aqui.' }}</small></div><div class="summary-line"><span>Subtotal</span><strong>{{ money(subtotal) }}</strong></div><div v-if="discount" class="summary-line discount"><span>Desconto {{ appliedCoupon?.code ? `(${appliedCoupon.code})` : '' }}</span><strong>- {{ money(discount) }}</strong></div><div class="summary-line"><span>Entrega</span><span>Simulação</span></div><div class="summary-total"><span>Total dos produtos</span><strong>{{ money(checkoutTotal) }}</strong></div><p><MapPin :size="15" /> O endereço será mostrado apenas na etiqueta demonstrativa do painel admin.</p></aside></div></template><section v-else class="empty-state catalog-empty"><ShoppingBag :size="42" /><h1>Sua sacola ainda está vazia.</h1><p>Encontre seu próximo essencial antes de revisar o pedido.</p><RouterLink to="/produtos" class="button button-primary">Explorar a coleção <ArrowUpRight :size="18" /></RouterLink></section></div>
 </template>
