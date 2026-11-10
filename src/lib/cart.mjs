export const MAX_QUANTITY = 10

export function normalizeCart(input, products) {
  if (!Array.isArray(input)) return []
  const rows = new Map()
  for (const row of input) {
    if (!row || typeof row !== 'object') continue
    const product = products.find(p => p.id === row.productId)
    if (!product || !product.sizes.includes(row.size) || !Number.isInteger(row.quantity) || row.quantity < 1) continue
    const key = `${product.id}:${row.size}`
    const previous = rows.get(key)
    rows.set(key, { productId: product.id, size: row.size, quantity: Math.min(MAX_QUANTITY, row.quantity + (previous?.quantity || 0)) })
  }
  return [...rows.values()]
}

export function addCartItem(cart, productId, size, quantity, products) {
  return normalizeCart([...cart, { productId, size, quantity }], products)
}

export function cartTotal(cart, products) {
  return normalizeCart(cart, products).reduce((total, row) => {
    const product = products.find(p => p.id === row.productId)
    return total + Math.round(product.price * 100) * row.quantity
  }, 0) / 100
}
