<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { X } from 'lucide-vue-next'
defineProps<{ title: string; side?: boolean }>()
const emit = defineEmits<{ close: [] }>()
const panel = ref<HTMLElement>()
const previousFocus = document.activeElement as HTMLElement | null
const previousOverflow = document.body.style.overflow
function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
  if (event.key !== 'Tab') return
  const controls = [...(panel.value?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]') || [])].filter(el => el.getClientRects().length)
  const first = controls[0]
  const last = controls.at(-1)
  if (!first) { event.preventDefault(); panel.value?.focus(); return }
  if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.value)) { event.preventDefault(); last?.focus() }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
}
onMounted(async () => {
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', onKey)
  await nextTick()
  const autofocus = panel.value?.querySelector<HTMLElement>('[data-autofocus]')
  ;(autofocus || panel.value)?.focus()
})
onBeforeUnmount(() => {
  document.body.style.overflow = previousOverflow
  document.removeEventListener('keydown', onKey)
  previousFocus?.focus()
})
</script>

<template>
  <Teleport to="body">
    <div class="overlay" :class="{ 'overlay--side': side }" @click.self="emit('close')">
      <section ref="panel" class="overlay-panel" :class="{ 'overlay-panel--side': side }" role="dialog" aria-modal="true" :aria-label="title" tabindex="-1">
        <header class="panel-heading"><h2>{{ title }}</h2><button class="icon-button" aria-label="Fechar" @click="emit('close')"><X :size="22" /></button></header>
        <slot />
      </section>
    </div>
  </Teleport>
</template>
