import { test } from 'node:test'
import assert from 'node:assert/strict'
import { addCartItem, normalizeCart, cartTotal } from '../src/lib/cart.mjs'
const products = [{ id: 1, price: 149.9, sizes: ['P', 'M'] }, { id: 2, price: 79.9, sizes: ['A5'] }]

test('restaura a sacola descartando dados inválidos e produtos removidos', () => {
  assert.deepEqual(normalizeCart(null, products), [])
  assert.deepEqual(normalizeCart([null, {}, { productId: 999, size: 'P', quantity: 1 }, { productId: 1, size: 'GG', quantity: 1 }, { productId: 1, size: 'M', quantity: -1 }, { productId: 1, size: 'M', quantity: 1.5 }, { productId: 2, size: 'A5', quantity: 2 }], products), [{ productId: 2, size: 'A5', quantity: 2 }])
})
test('soma produtos iguais, mas mantém tamanhos diferentes separados', () => {
  let cart = addCartItem([], 1, 'M', 1, products)
  cart = addCartItem(cart, 1, 'M', 2, products)
  cart = addCartItem(cart, 1, 'P', 1, products)
  assert.deepEqual(cart, [{ productId: 1, size: 'M', quantity: 3 }, { productId: 1, size: 'P', quantity: 1 }])
})
test('limita a quantidade acumulada a dez por tamanho', () => {
  assert.equal(addCartItem([{ productId: 1, size: 'M', quantity: 9 }], 1, 'M', 4, products)[0].quantity, 10)
})
test('calcula o subtotal em centavos sem erros de ponto flutuante', () => {
  assert.equal(cartTotal([{ productId: 1, size: 'M', quantity: 3 }, { productId: 2, size: 'A5', quantity: 2 }], products), 609.5)
})
