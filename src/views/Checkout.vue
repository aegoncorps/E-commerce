<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ShoppingBag, Info, QrCode, CreditCard } from 'lucide-vue-next'
import { money } from '../data/products'
import { cart, cartItems, subtotal } from '../store'
import { findActiveCoupon, track, type Coupon } from '../admin-store'

type PaymentMethod = 'pix' | 'card'
type CheckoutStep = 1 | 2 | 3
const configuredApiUrl = (import.meta.env.VITE_API_URL || 'https://ecommerce-aegon-api.vercel.app').trim()
const apiUrl = (/^https?:\/\//i.test(configuredApiUrl) ? configuredApiUrl : `https://${configuredApiUrl}`).replace(/\/+$/, '')
const step = ref<CheckoutStep>(1)
const payment = ref<PaymentMethod>('pix')
const completed = ref(false)
const orderId = ref('')
const paymentError = ref('')
const isPaying = ref(false)
const pixPayment = ref<{ qrCode?: string; qrCodeBase64?: string; ticketUrl?: string } | null>(null)
const paymentState = ref('')
let paymentPoll: ReturnType<typeof setInterval> | undefined
let cardBrick: { unmount: () => Promise<void> } | null = null
declare global { interface Window { MercadoPago?: new (key: string, options: { locale: string }) => { bricks: () => { create: (name: string, id: string, config: Record<string, unknown>) => Promise<{ unmount: () => Promise<void> }> } } } }
const agreed = ref(false)
const couponCode = ref('')
const couponMessage = ref('')
const appliedCoupon = ref<Coupon | null>(null)
const buyer = reactive({ name: '', email: '', phone: '', cep: '', street: '', number: '', complement: '', district: '', city: '', state: '', shipping: 'PAC' as 'PAC' | 'SEDEX' })
function formatPhone(event: Event) {
  const input = event.target as HTMLInputElement
  const digitsBeforeCursor = input.value.slice(0, input.selectionStart ?? input.value.length).replace(/\D/g, '').length
  const digits = input.value.replace(/\D/g, '').slice(0, 11)
  let formatted = digits.length ? `(${digits.slice(0, 2)}` : ''
  if (digits.length > 2) formatted += `) ${digits.slice(2, digits.length > 10 ? 7 : 6)}`
  if (digits.length > (digits.length > 10 ? 7 : 6)) formatted += `-${digits.slice(digits.length > 10 ? 7 : 6)}`
  buyer.phone = formatted
  input.value = formatted
  let cursor = 0
  let counted = 0
  while (cursor < formatted.length && counted < digitsBeforeCursor) {
    if (/\d/.test(formatted[cursor]!)) counted++
    cursor++
  }
  input.setSelectionRange(cursor, cursor)
}
const autoCep = ref(true)
const cepStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const cepMessage = ref('')
const states = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'], ['CE', 'Ceará'], ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'], ['GO', 'Goiás'], ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'], ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'], ['PI', 'Piauí'], ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'], ['RS', 'Rio Grande do Sul'], ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'], ['SP', 'São Paulo'], ['SE', 'Sergipe'], ['TO', 'Tocantins'],
] as const
watch([() => buyer.cep, autoCep], ([value, enabled], _previous, onCleanup) => {
  const digits = value.replace(/\D/g, '')
  cepStatus.value = 'idle'
  cepMessage.value = ''
  if (!enabled || !/^\d{8}$/.test(digits) || !/^\d{5}-?\d{3}$/.test(value)) return
  const controller = new AbortController()
  const before = { street: buyer.street, district: buyer.district, city: buyer.city, state: buyer.state }
  const timer = setTimeout(async () => {
    cepStatus.value = 'loading'
    cepMessage.value = 'Buscando endereço pelo CEP...'
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal })
      if (!response.ok) throw new Error('Consulta indisponível')
      const address: { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string; uf?: string } = await response.json()
      if (controller.signal.aborted) return
      if (address.erro) { cepStatus.value = 'error'; cepMessage.value = 'CEP não encontrado. Confira o número ou preencha o endereço manualmente.'; return }
      if (address.logradouro && buyer.street === before.street) buyer.street = address.logradouro
      if (address.bairro && buyer.district === before.district) buyer.district = address.bairro
      if (address.localidade && buyer.city === before.city) buyer.city = address.localidade
      if (address.uf && states.some(([uf]) => uf === address.uf) && buyer.state === before.state) buyer.state = address.uf
      cepStatus.value = 'success'
      cepMessage.value = 'Endereço encontrado. Confira os dados e complete o número.'
    } catch {
      if (controller.signal.aborted) return
      cepStatus.value = 'error'
      cepMessage.value = 'Não foi possível consultar o CEP. Preencha o endereço manualmente.'
    }
  }, 400)
  onCleanup(() => { clearTimeout(timer); controller.abort() })
})
const itemCount = computed(() => cartItems.value.reduce((total, item) => total + item.quantity, 0))
const discount = computed(() => {
  const coupon = appliedCoupon.value
  if (!coupon || !findActiveCoupon(coupon.code) || subtotal.value < coupon.minimumOrder) return 0
  if (coupon.type === 'percentage') return Math.min(subtotal.value, Math.round(subtotal.value * coupon.value) / 100)
  if (coupon.type === 'fixed') return Math.min(subtotal.value, coupon.value)
  return 0
})
const checkoutTotal = computed(() => Math.max(0, subtotal.value - discount.value))
async function goToStep(next: CheckoutStep) {
  step.value = next
  await nextTick()
  document.getElementById(`checkout-step-${next}`)?.focus({ preventScroll: true })
}
function submitStep() {
  if (step.value === 1) { void goToStep(2); return }
  if (step.value === 2) { void goToStep(3); return }
  if (payment.value === 'pix') void submitOrder()
}
onMounted(() => { if (cartItems.value.length) track('checkout_started', { path: '#/checkout' }) })
onBeforeUnmount(() => { void cardBrick?.unmount(); if (paymentPoll) clearInterval(paymentPoll) })
watch([step, payment], async ([currentStep, method]) => {
  paymentError.value = ''
  if (currentStep !== 3 || method !== 'card') { await cardBrick?.unmount(); cardBrick = null; return }
  await nextTick()
  const api = apiUrl
  try {
    const configResponse = await fetch(`${api}/api/payments/config`)
    const config = await configResponse.json()
    if (!configResponse.ok || !config.publicKey) throw new Error('O checkout seguro não está configurado no backend.')
    if (!window.MercadoPago) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://sdk.mercadopago.com/js/v2'
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Não foi possível carregar o pagamento seguro.'))
        document.head.appendChild(script)
      })
    }
    if (cardBrick || !window.MercadoPago) return
    const mp = new window.MercadoPago(config.publicKey, { locale: 'pt-BR' })
    cardBrick = await mp.bricks().create('cardPayment', 'cardPaymentBrick_container', {
      initialization: { amount: subtotal.value },
      callbacks: {
        onSubmit: async (formData: any) => {
          const payer = formData.payer ?? {}
          return submitOrder({ method: 'card', token: formData.token, paymentMethodId: formData.payment_method_id, installments: Number(formData.installments), identificationType: payer.identification?.type, identificationNumber: payer.identification?.number })
        },
        onError: () => { paymentError.value = 'Confira os dados do cartão e tente novamente.' },
      },
    })
  } catch { paymentError.value = 'Não foi possível preparar o formulário seguro de cartão.' }
})
watch(couponCode, value => { if (appliedCoupon.value && value.trim().toUpperCase() !== appliedCoupon.value.code) { appliedCoupon.value = null; couponMessage.value = '' } })

function applyCoupon() {
  const coupon = findActiveCoupon(couponCode.value)
  if (!coupon) { appliedCoupon.value = null; couponMessage.value = 'Código inválido, pausado ou sem usos disponíveis.'; return }
  if (subtotal.value < coupon.minimumOrder) { appliedCoupon.value = null; couponMessage.value = `Este código exige pedido mínimo de ${money(coupon.minimumOrder)}.`; return }
  appliedCoupon.value = coupon
  couponMessage.value = coupon.type === 'shipping' ? 'Cupom de frete selecionado para a simulação.' : `Cupom ${coupon.code} aplicado.`
}
async function submitOrder(cardData?: Record<string, unknown>) {
  if (!agreed.value || !cartItems.value.length || isPaying.value) return
  paymentError.value = ''
  if (appliedCoupon.value) { paymentError.value = 'Cupons serão liberados no checkout após a validação no backend.'; return }
  const api = apiUrl
  isPaying.value = true
  try {
    const response = await fetch(`${api}/api/orders`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name: buyer.name, email: buyer.email, phone: buyer.phone },
        address: { cep: buyer.cep, street: buyer.street, number: buyer.number, complement: buyer.complement || undefined, district: buyer.district, city: buyer.city, state: buyer.state },
        items: cartItems.value.map(item => ({ productId: String(item.productId), size: item.size, quantity: item.quantity })),
        payment: cardData ?? { method: 'pix' },
      }),
    })
    const result = await response.json()
    if (!response.ok) throw new Error(result.error || 'Não foi possível iniciar o pagamento.')
    orderId.value = result.order.id
    if (result.payment.method === 'pix') {
      pixPayment.value = { qrCode: result.payment.qrCode, qrCodeBase64: result.payment.qrCodeBase64, ticketUrl: result.payment.ticketUrl }
      paymentState.value = result.payment.status
      if (paymentPoll) clearInterval(paymentPoll)
      paymentPoll = setInterval(async () => {
        try {
          const statusResponse = await fetch(`${api}/api/orders/${encodeURIComponent(orderId.value)}/status`)
          const statusResult = await statusResponse.json()
          if (statusResult.order?.status === 'PAID') {
            if (paymentPoll) clearInterval(paymentPoll)
            cart.value = []
            completed.value = true
          }
        } catch { /* a próxima consulta tentará novamente */ }
      }, 5000)
    } else {
      paymentState.value = result.payment.status
      completed.value = true
      if (result.payment.status === 'processed' && result.payment.statusDetail === 'accredited') cart.value = []
    }
  } catch (error) {
    paymentError.value = error instanceof Error ? error.message : 'Falha ao iniciar o pagamento.'
  } finally { isPaying.value = false }
}
function copyPixCode() {
  if (pixPayment.value?.qrCode) void navigator.clipboard.writeText(pixPayment.value.qrCode)
}
/* simulation removed: orders now come from the API and gateway */
</script>

<template>
  <main class="checkout-v2 page-container">
    <RouterLink to="/produtos" class="checkout-back"><ArrowLeft :size="16" /> Continuar comprando</RouterLink>

    <section v-if="completed" class="checkout-result" aria-live="polite">
      <span class="result-icon"><Check :size="30" /></span>
      <span class="eyebrow">PEDIDO {{ paymentState === 'processed' ? 'PROCESSADO' : 'RECEBIDO' }}</span>
      <h1>Seu pedido ficou on<span>.</span></h1>
      <p>Pedido <strong>{{ orderId }}</strong> · status do pagamento: <strong>{{ paymentState || 'pendente' }}</strong>. A confirmação final será atualizada pelo Mercado Pago.</p>
      <div class="result-actions"><RouterLink to="/" class="button button-primary">Voltar para a loja <ArrowUpRight :size="17" /></RouterLink><RouterLink to="/admin" class="text-link">Ver no painel <ArrowRight :size="16" /></RouterLink></div>
    </section>

    <template v-else-if="cartItems.length">
      <header class="checkout-v2-heading"><div><span class="eyebrow">AEGON STORE / FINALIZAR PEDIDO</span><h1>Seu próximo essencial<br />está quase <span>on.</span></h1><p>Falta pouco para levar suas escolhas com você.</p></div><span class="checkout-on" aria-hidden="true">on</span></header>
      <div class="demo-banner" role="note"><Info :size="18" /><div><strong>Pagamento protegido pelo Mercado Pago</strong><span>Os dados do cartão são tokenizados pelo provedor e não são armazenados pela Aegon.</span></div></div>

      <div class="checkout-v2-grid">
        <form class="checkout-v2-form" @submit.prevent="submitStep">
          <div class="checkout-progress" aria-label="Progresso do checkout"><span :class="{ current: step === 1, done: step > 1 }" :aria-current="step === 1 ? 'step' : undefined"><b>1</b> Dados</span><i></i><span :class="{ current: step === 2, done: step > 2 }" :aria-current="step === 2 ? 'step' : undefined"><b>2</b> Entrega</span><i></i><span :class="{ current: step === 3 }" :aria-current="step === 3 ? 'step' : undefined"><b>3</b> Pagamento</span></div>
          <section class="checkout-panel" :class="{ 'step-collapsed': step !== 1 }"><div class="section-heading-v2"><span class="section-number">{{ step > 1 ? '✓' : '01' }}</span><div><h2 id="checkout-step-1" tabindex="-1">Seus dados</h2><p v-if="step === 1">Para identificar e acompanhar seu pedido.</p><p v-else>{{ buyer.name }} · {{ buyer.email }}</p></div><button v-if="step > 1" type="button" class="step-edit" @click="goToStep(1)">Editar</button></div><div v-if="step === 1" class="checkout-fields"><label class="field-wide">Nome completo<input v-model.trim="buyer.name" required minlength="2" maxlength="100" autocomplete="name" placeholder="Nome de quem vai receber" /></label><label>E-mail<input v-model.trim="buyer.email" required type="email" maxlength="150" autocomplete="email" placeholder="voce@exemplo.com" /></label><label>Telefone<input :value="buyer.phone" type="tel" required inputmode="tel" autocomplete="tel-national" placeholder="(00) 00000-0000" @input="formatPhone" /></label></div><button v-if="step === 1" class="button button-primary step-next" type="submit">Continuar para entrega <ArrowRight :size="17" /></button></section>

          <section class="checkout-panel" :class="{ 'step-collapsed': step !== 2, 'step-pending': step < 2 }"><div class="section-heading-v2"><span class="section-number">{{ step > 2 ? '✓' : '02' }}</span><div><h2 id="checkout-step-2" tabindex="-1">Entrega</h2><p v-if="step === 2">Conta pra gente onde você está.</p><p v-else-if="step > 2">{{ buyer.street }}, {{ buyer.number }} · {{ buyer.city }}/{{ buyer.state.toUpperCase() }}</p><p v-else>Disponível após preencher seus dados.</p></div><button v-if="step > 2" type="button" class="step-edit" @click="goToStep(2)">Editar</button></div><template v-if="step === 2"><label class="cep-toggle"><input v-model="autoCep" type="checkbox" /><span><strong>Preencher endereço pelo CEP</strong><small>Consulte automaticamente ou desative para digitar seus dados.</small></span></label><div class="checkout-fields"><label>CEP <small v-if="!autoCep">opcional</small><input v-model.trim="buyer.cep" :required="autoCep" inputmode="numeric" pattern="[0-9]{5}-?[0-9]{3}" maxlength="9" autocomplete="postal-code" placeholder="00000-000" aria-describedby="cep-feedback" /></label><label>Estado (UF)<select v-model="buyer.state" required autocomplete="address-level1"><option value="" disabled>Selecione o estado</option><option v-for="[uf, name] in states" :key="uf" :value="uf">{{ name }} ({{ uf }})</option></select></label><div id="cep-feedback" class="cep-feedback field-wide" :class="{ error: cepStatus === 'error', success: cepStatus === 'success' }" aria-live="polite">{{ cepMessage }}</div><label class="field-wide">Rua ou avenida<input v-model.trim="buyer.street" required maxlength="120" autocomplete="address-line1" placeholder="Nome da rua" /></label><label>Número<input v-model.trim="buyer.number" required maxlength="15" placeholder="123" /></label><label>Complemento <small>opcional</small><input v-model.trim="buyer.complement" maxlength="60" autocomplete="address-line2" placeholder="Apto, bloco..." /></label><label>Bairro<input v-model.trim="buyer.district" required maxlength="80" placeholder="Seu bairro" /></label><label>Cidade<input v-model.trim="buyer.city" required maxlength="80" autocomplete="address-level2" placeholder="Sua cidade" /></label></div>
            <fieldset class="checkout-options"><legend>Forma de entrega</legend><label :class="{ selected: buyer.shipping === 'PAC' }"><input v-model="buyer.shipping" type="radio" value="PAC" /><span><strong>PAC</strong><small>Entrega econômica</small></span><b>Simulado</b></label><label :class="{ selected: buyer.shipping === 'SEDEX' }"><input v-model="buyer.shipping" type="radio" value="SEDEX" /><span><strong>SEDEX</strong><small>Entrega expressa</small></span><b>Simulado</b></label></fieldset><div class="step-actions"><button type="button" class="step-back" @click="goToStep(1)"><ArrowLeft :size="15" /> Voltar</button><button class="button button-primary" type="submit">Continuar para pagamento <ArrowRight :size="17" /></button></div></template></section>

          <section class="checkout-panel" :class="{ 'step-collapsed': step !== 3, 'step-pending': step < 3 }"><div class="section-heading-v2"><span class="section-number">03</span><div><h2 id="checkout-step-3" tabindex="-1">Pagamento</h2><p>{{ step === 3 ? 'Escolha como prefere pagar.' : 'Disponível após preencher a entrega.' }}</p></div></div><template v-if="step === 3"><fieldset class="payment-methods"><legend class="sr-only">Forma de pagamento</legend><label :class="{ selected: payment === 'pix' }"><input v-model="payment" type="radio" value="pix" /><span class="payment-symbol pix-symbol" aria-hidden="true"><QrCode :size="19" :stroke-width="1.8" /></span><span><strong>Pix</strong><small>Prático e instantâneo</small></span><i></i></label><label :class="{ selected: payment === 'card' }"><input v-model="payment" type="radio" value="card" /><span class="payment-symbol" aria-hidden="true"><CreditCard :size="19" :stroke-width="1.8" /></span><span><strong>Cartão de crédito</strong><small>Pague com seu cartão</small></span><i></i></label></fieldset>
            <div v-if="payment === 'pix'" class="payment-detail"><span class="detail-icon" aria-hidden="true"><QrCode :size="20" :stroke-width="1.8" /></span><div><strong>{{ pixPayment ? 'Pix gerado. Finalize o pagamento.' : 'Simples assim: escolheu, pagou, ficou on.' }}</strong><p v-if="!pixPayment">O QR Code e o código Pix serão gerados ao continuar.</p><p v-else>Pedido {{ orderId }} · aguardando confirmação do Mercado Pago.</p></div></div>
            <div v-if="payment === 'pix' && pixPayment" class="pix-result"><img v-if="pixPayment.qrCodeBase64" :src="`data:image/png;base64,${pixPayment.qrCodeBase64}`" alt="QR Code Pix para pagamento" /><label v-if="pixPayment.qrCode">Pix copia e cola<textarea readonly :value="pixPayment.qrCode" aria-label="Código Pix copia e cola" /></label><button v-if="pixPayment.qrCode" type="button" class="button button-outline" @click="copyPixCode">Copiar código Pix</button><a v-if="pixPayment.ticketUrl" :href="pixPayment.ticketUrl" target="_blank" rel="noopener noreferrer">Abrir pagamento no Mercado Pago</a></div>
            <div v-if="payment === 'card'" class="payment-detail card-preview"><div class="card-preview-top"><div><strong>Pagamento seguro com cartão</strong><p>O formulário protegido do Mercado Pago gera um token de uso único.</p></div><span class="card-brands">VISA · master<span>card</span></span></div><div id="cardPaymentBrick_container"></div></div>
            <p v-if="paymentError" class="form-warning" role="alert">{{ paymentError }}</p>
            <label class="checkout-consent"><input v-model="agreed" type="checkbox" required /><span>Confirmo os dados e autorizo o envio do pedido ao Mercado Pago para iniciar o pagamento.</span></label><div class="step-actions"><button type="button" class="step-back" @click="goToStep(2)"><ArrowLeft :size="15" /> Voltar</button><button v-if="payment === 'pix' && !pixPayment" class="button button-primary" type="submit" :disabled="isPaying">{{ isPaying ? 'Gerando Pix…' : 'Gerar Pix' }} <ArrowRight :size="18" /></button><span v-else-if="payment === 'card'" class="form-hint">Use o botão seguro exibido no formulário do Mercado Pago.</span></div></template></section>

          <p class="checkout-footnote">Uma experiência feita por gente, para gente. <span>on</span></p>
        </form>

        <aside class="checkout-v2-summary"><div class="summary-heading"><div><span class="eyebrow">SUAS ESCOLHAS</span><h2>Resumo do pedido<span>.</span></h2></div><span class="summary-count">{{ itemCount }} {{ itemCount === 1 ? 'item' : 'itens' }}</span></div><div class="summary-items"><div v-for="item in cartItems" :key="`${item.productId}:${item.size}`" class="summary-item"><div class="summary-image"><img :src="item.product.image" :alt="item.product.name" /><span>{{ item.quantity }}</span></div><div><RouterLink :to="`/produto/${item.productId}`">{{ item.product.name }}</RouterLink><small>{{ item.product.colorName }} · {{ item.size }}</small><b>{{ money(item.product.price * item.quantity) }}</b></div></div></div><div class="summary-coupon"><label for="coupon-code">Tem um cupom?</label><div><input id="coupon-code" v-model.trim="couponCode" maxlength="30" placeholder="Digite seu código" @keydown.enter.prevent="applyCoupon" /><button type="button" @click="applyCoupon">Aplicar</button></div><small :class="{ error: couponMessage && !appliedCoupon }" aria-live="polite">{{ couponMessage }}</small></div><div class="summary-prices"><div><span>Subtotal</span><strong>{{ money(subtotal) }}</strong></div><div v-if="discount" class="discount"><span>Desconto ({{ appliedCoupon?.code }})</span><strong>− {{ money(discount) }}</strong></div><div><span>Entrega</span><span>A calcular na integração</span></div><div class="summary-grand-total"><span>Total dos produtos <small>Frete não incluído</small></span><strong>{{ money(checkoutTotal) }}</strong></div></div><div class="summary-bottom"><span>✳</span><p>Escolhas com identidade, feitas para acompanhar você.</p></div></aside>
      </div>
    </template>
    <section v-else class="checkout-result"><ShoppingBag :size="40" /><h1>Sua sacola está vazia<span>.</span></h1><p>Encontre seus próximos essenciais para continuar.</p><RouterLink to="/produtos" class="button button-primary">Explorar a coleção <ArrowUpRight :size="18" /></RouterLink></section>
  </main>
</template>

<style scoped>
.checkout-v2{max-width:1200px;padding-top:28px;padding-bottom:85px}.checkout-back{display:inline-flex;align-items:center;gap:9px;font-size:11px;font-weight:800}.checkout-back:hover{color:#0045ba}.checkout-v2-heading{display:flex;justify-content:space-between;align-items:center;padding:36px 0 27px}.checkout-v2-heading .eyebrow,.summary-heading .eyebrow{color:#0045ba}.checkout-v2-heading h1{font-size:clamp(35px,4vw,51px);margin-top:9px;line-height:1.06}.checkout-v2-heading h1 span,.summary-heading h2 span,.checkout-result h1 span{color:#0045ba}.checkout-v2-heading p{font-size:12px;margin-top:13px}.checkout-on{font:92px/.8 var(--font-display);color:#0045ba}.demo-banner{border:1px solid #bad1f1;background:#e8f1ff;color:#164a88;border-radius:13px;padding:14px 17px;display:flex;align-items:flex-start;gap:10px;font-size:11px}.demo-banner strong,.demo-banner span{display:block}.demo-banner span{margin-top:2px}.checkout-v2-grid{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(310px,.8fr);gap:26px;align-items:start;margin-top:24px}.checkout-v2-form{display:grid;gap:16px}.checkout-panel,.checkout-v2-summary{border:1px solid var(--line);background:#fffaf4;border-radius:16px;padding:25px}.section-heading-v2{display:flex;gap:13px;margin-bottom:22px}.section-number{width:34px;height:34px;display:grid;place-items:center;flex-shrink:0;border-radius:50%;background:#e7efff;color:#0045ba;font-weight:900;font-size:10px}.section-heading-v2 h2{font-size:20px}.section-heading-v2 p{font-size:11px;margin-top:5px}.checkout-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.checkout-fields label{display:grid;gap:6px;font-size:11px;font-weight:800}.checkout-fields label small{font-size:9px;color:#748196;font-weight:500}.checkout-fields .field-wide{grid-column:1/-1}.checkout-fields input,.summary-coupon input{width:100%;min-width:0;height:44px;padding:0 12px;border:1px solid #d9c8b6;border-radius:9px;background:#fffdf9;color:#0a2844;font-size:12px;outline:0}.checkout-fields input:focus,.summary-coupon input:focus{border-color:#0045ba;box-shadow:0 0 0 3px #0045ba17}.checkout-options,.payment-methods{border:0;padding:0;margin:22px 0 0}.checkout-options legend{font-size:11px;font-weight:800;margin-bottom:10px}.checkout-options{display:grid;gap:8px}.checkout-options label{display:flex;align-items:center;gap:11px;border:1px solid #e4d7c8;border-radius:10px;padding:12px;cursor:pointer}.checkout-options label.selected,.payment-methods label.selected{border-color:#0045ba;background:#f1f5ff}.checkout-options input{accent-color:#0045ba}.checkout-options span,.payment-methods label>span:nth-of-type(2){display:grid;gap:2px}.checkout-options strong,.payment-methods strong{font-size:11px}.checkout-options small,.payment-methods small{color:#68798a;font-size:10px}.checkout-options b{margin-left:auto;font-size:9px;color:#68798a}.payment-methods{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:0}.payment-methods label{position:relative;display:flex;align-items:center;gap:10px;border:1px solid #e4d7c8;border-radius:11px;padding:14px 11px;cursor:pointer}.payment-methods input{position:absolute;opacity:0}.payment-methods input:focus-visible~i{outline:2px solid #0045ba;outline-offset:3px}.payment-methods i{margin-left:auto;width:15px;height:15px;border:1px solid #9aa8b9;border-radius:50%;flex-shrink:0}.payment-methods input:checked~i{border:5px solid #0045ba}.payment-symbol{display:grid;place-items:center;width:32px;height:32px;background:#e5eeff;border-radius:9px;color:#0045ba;font-size:19px}.payment-detail{margin-top:13px;padding:16px;border-radius:11px;background:#f6ecdf;display:flex;gap:11px}.detail-icon{font-size:24px;color:#0045ba;line-height:1}.payment-detail strong{font-size:11px}.payment-detail p{font-size:10px;margin-top:5px;line-height:1.6}.card-preview{display:block}.card-preview-top{display:flex;justify-content:space-between;gap:10px}.card-brands{font-size:10px;font-weight:900;color:#0045ba;white-space:nowrap}.card-brands span{color:#e67b00}.disabled-card-fields{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:15px}.disabled-card-fields div{font-size:9px;font-weight:800;color:#566777}.disabled-card-fields div:nth-child(-n+2){grid-column:1/-1}.disabled-card-fields div span{display:block;margin-top:5px;padding:10px;border:1px solid #e3d5c5;background:#fffaf4;color:#97a2ad;border-radius:7px;font-weight:400}.card-preview>small{display:block;color:#68798a;font-size:9px;margin-top:10px}.checkout-consent{display:flex;gap:9px;align-items:flex-start;font-size:11px;color:#526478;line-height:1.5;padding:2px}.checkout-consent input{width:16px;height:16px;margin:1px 0 0;accent-color:#0045ba;flex-shrink:0}.checkout-submit{width:100%;min-height:52px}.checkout-footnote{text-align:center;font-size:10px}.checkout-footnote span{font:20px var(--font-display);color:#0045ba;vertical-align:middle}.checkout-v2-summary{position:sticky;top:115px}.summary-heading{display:flex;justify-content:space-between;align-items:center;gap:10px}.summary-heading h2{font-size:22px;margin-top:4px}.summary-count{font-size:10px;font-weight:800;color:#61758a;white-space:nowrap}.summary-items{margin-top:12px}.summary-item{display:flex;gap:13px;padding:15px 0;border-bottom:1px solid var(--line)}.summary-image{position:relative;width:72px;height:82px;flex-shrink:0;background:#f2e7da;border-radius:9px}.summary-image img{width:100%;height:100%;object-fit:contain}.summary-image span{position:absolute;right:-5px;top:-5px;width:19px;height:19px;display:grid;place-items:center;background:#0a2844;color:#fff;border-radius:50%;font-size:9px;font-weight:800}.summary-item>div:last-child{display:flex;flex-direction:column;gap:4px;align-items:flex-start}.summary-item a{font-size:11px;font-weight:900}.summary-item small{font-size:10px;color:#708095}.summary-item b{font-size:11px;margin-top:auto}.summary-coupon{padding:18px 0;border-bottom:1px solid var(--line)}.summary-coupon label{font-size:11px;font-weight:800}.summary-coupon>div{display:flex;gap:7px;margin-top:8px}.summary-coupon input{height:39px}.summary-coupon button{border:1px solid #0a2844;border-radius:9px;padding:0 13px;font-size:10px;font-weight:800}.summary-coupon button:hover{background:#0a2844;color:#fff}.summary-coupon small{display:block;font-size:10px;color:#047857;margin-top:6px;min-height:1px}.summary-coupon small.error{color:#b91c1c}.summary-prices{display:grid;gap:12px;padding-top:19px;font-size:11px}.summary-prices>div{display:flex;justify-content:space-between;gap:15px}.summary-prices>div>span{color:#65768b}.summary-prices .discount{color:#047857}.summary-prices .discount span{color:inherit}.summary-grand-total{border-top:1px solid var(--line);padding-top:17px;align-items:start}.summary-grand-total>span{color:#0a2844!important;font-weight:900}.summary-grand-total small{display:block;font-size:9px;font-weight:400;color:#718095;margin-top:3px}.summary-grand-total strong{font-size:23px;line-height:1}.summary-bottom{display:flex;align-items:center;gap:9px;margin-top:24px;background:#e8f0ff;border-radius:10px;padding:11px}.summary-bottom span{color:#0045ba;font-size:20px}.summary-bottom p{font-size:10px;color:#254a77}.checkout-result{min-height:480px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:15px;text-align:center}.checkout-result>svg{color:#0045ba}.checkout-result h1{font-size:42px}.checkout-result p{max-width:510px;font-size:13px}.result-icon{width:65px;height:65px;border-radius:50%;display:grid;place-items:center;background:#e5f6ed;color:#047857}.result-actions{display:flex;align-items:center;gap:24px;margin-top:10px}@media(max-width:800px){.checkout-v2-grid{grid-template-columns:1fr}.checkout-v2-summary{position:static;grid-row:1}.checkout-on{font-size:65px}.checkout-v2-heading h1{font-size:36px}}@media(max-width:500px){.checkout-v2{padding-top:22px;padding-bottom:45px}.checkout-v2-heading{padding:27px 0 22px}.checkout-v2-heading h1{font-size:32px}.checkout-on{font-size:50px}.checkout-panel,.checkout-v2-summary{padding:19px}.checkout-fields{gap:12px}.payment-methods{grid-template-columns:1fr}.checkout-result h1{font-size:34px}.result-actions{flex-direction:column;gap:16px}.card-preview-top{display:block}.card-brands{display:block;margin-top:8px}}
</style>

<style scoped>
.cep-toggle{display:flex;align-items:flex-start;gap:10px;margin:-2px 0 20px;padding:13px;border:1px solid #d7e4f9;border-radius:10px;background:#f1f5ff;cursor:pointer}.cep-toggle input{width:16px;height:16px;flex-shrink:0;margin:2px 0 0;accent-color:#0045ba}.cep-toggle span{display:grid;gap:3px}.cep-toggle strong{font-size:11px}.cep-toggle small{color:#68798a;font-size:10px;line-height:1.5}.checkout-fields select{width:100%;min-width:0;height:44px;padding:0 12px;border:1px solid #d9c8b6;border-radius:9px;background:#fffdf9;color:#0a2844;font-size:12px;outline:0}.checkout-fields select:focus{border-color:#0045ba;box-shadow:0 0 0 3px #0045ba17}.cep-feedback{font-size:10px;line-height:1.4;color:#526478;margin-top:-8px}.cep-feedback:empty{display:none}.cep-feedback.error{color:#b91c1c}.cep-feedback.success{color:#047857}.detail-icon{display:flex;align-items:flex-start;padding-top:2px}
</style>

<style scoped>
.checkout-progress{display:flex;align-items:center;gap:10px;padding:5px 2px 7px;color:#8290a0;font-size:10px;font-weight:800}.checkout-progress span{display:flex;align-items:center;gap:6px;white-space:nowrap}.checkout-progress b{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;border:1px solid #d6c8ba;font-size:10px}.checkout-progress span.current{color:#0045ba}.checkout-progress span.current b{color:#fff;background:#0045ba;border-color:#0045ba}.checkout-progress span.done{color:#047857}.checkout-progress span.done b{color:#047857;background:#e5f6ed;border-color:#e5f6ed}.checkout-progress i{height:1px;background:#dfd1c1;flex:1}.step-collapsed .section-heading-v2{margin-bottom:0}.step-pending{opacity:.58}.section-heading-v2>div{min-width:0}.section-heading-v2 p{overflow-wrap:anywhere}.section-heading-v2 h2:focus{outline:none}.step-edit{align-self:center;margin-left:auto;color:#0045ba;font-size:11px;font-weight:800;text-decoration:underline;text-underline-offset:3px}.step-next{margin-top:22px;width:100%}.step-actions{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-top:22px}.step-actions .button{min-height:46px;font-size:11px}.step-back{display:inline-flex;align-items:center;gap:7px;font-size:11px;font-weight:800}.checkout-consent{margin-top:20px}@media(max-width:500px){.checkout-progress{gap:5px;font-size:9px}.checkout-progress span{gap:4px}.checkout-progress b{width:22px;height:22px}.step-actions{align-items:stretch;flex-direction:column-reverse}.step-actions .button{width:100%}.step-back{justify-content:center;padding:8px}}
</style>

<style scoped>
.pix-result{display:grid;justify-items:center;gap:12px;margin:15px 0;padding:16px;border:1px solid #dce5f3;border-radius:12px;background:#fff}
.pix-result>img{width:min(220px,100%);aspect-ratio:1;object-fit:contain}
.pix-result label{display:grid;gap:6px;width:100%;font-size:11px;font-weight:800}
.pix-result textarea{width:100%;min-height:76px;resize:vertical;padding:10px;border:1px solid #dfd1c1;border-radius:8px;background:#fffaf4;font:11px/1.5 monospace;overflow-wrap:anywhere}
.pix-result a{font-size:11px;color:#0045ba;text-decoration:underline}
.form-hint{font-size:10px;color:#61758a}
#cardPaymentBrick_container{width:100%;margin-top:15px}
</style>
