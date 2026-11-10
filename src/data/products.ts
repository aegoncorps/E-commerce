import { reactive, watch } from 'vue'
import originalProducts from '../src/produtos.json'

export interface Product {
  id: number
  name: string
  price: number
  category: string
  sizes: string[]
  image: string
  description: string
  specs: string[]
  color: string
  colorName: string
  badge?: string
  active?: boolean
  images?: string[]
  sku?: string
  stock?: number
  tags?: string[]
  variants?: ProductVariant[]
}

export interface ProductVariant {
  id: string
  size: string
  sku: string
  stock: number
  price?: number
}

const editorial: Record<number, { name: string; color: string; colorName: string; badge?: string }> = {
  1: { name: 'Kit completo Full on', color: '#0A2844', colorName: 'Shadow State', badge: 'O combo completo' },
  2: { name: 'Garrafa térmica System Wake', color: '#0045BA', colorName: 'Azul System Wake', badge: 'Essencial do dia' },
  3: { name: 'Kit Duo on', color: '#0045BA', colorName: 'Azul + Core Pulse' },
  4: { name: 'Camisa oversized Always on', color: '#0A2844', colorName: 'Shadow State', badge: 'Favorito da coleção' },
  5: { name: 'Caderno Core Pulse', color: '#FFF1E4', colorName: 'Core Pulse' },
  6: { name: 'Camisa Tech Essential', color: '#0045BA', colorName: 'Azul System Wake', badge: 'Novo por aqui' },
  7: { name: 'Garrafa Minimal Core Pulse', color: '#FFF1E4', colorName: 'Core Pulse' },
  8: { name: 'Camisa Editorial Core Pulse', color: '#FFF1E4', colorName: 'Core Pulse' },
  9: { name: 'Caderno Shadow State', color: '#0A2844', colorName: 'Shadow State' },
}

const initialProducts: Product[] = [...originalProducts.map(p => ({
  id: p.id,
  name: editorial[p.id]!.name,
  price: p.preco,
  category: p.tag,
  sizes: p.tamanho,
  image: `/products/${p.imagem.split('/').pop()}`,
  description: p.descricao,
  specs: p.especificacoes,
  color: editorial[p.id]!.color,
  colorName: editorial[p.id]!.colorName,
  badge: editorial[p.id]!.badge,
  active: true,
  images: [`/products/${p.imagem.split('/').pop()}`],
  sku: `AEG-${String(p.id).padStart(3, '0')}`,
  stock: 24,
  tags: [p.tag, 'Coleção 01'],
  variants: p.tamanho.map((size, index) => ({ id: `${p.id}-${index}`, size, sku: `AEG-${p.id}-${size}`.replaceAll(' ', ''), stock: 6 })),
})), {
  id: 10,
  name: 'Polo Aegon System Wake',
  price: 169.90,
  category: 'Camisas',
  sizes: ['P', 'M', 'G', 'GG'],
  image: '/products/aegon-polo-on-model.png',
  images: ['/products/aegon-polo-on-model.png'],
  description: 'Polo em azul System Wake com mangas Shadow State, detalhes em amarelo e assinatura Aegon no peito. Uma peça feita para deixar presença em cada encontro.',
  specs: ['Malha esportiva com textura respirável', 'Gola estruturada e vista com três botões', 'Piping amarelo nos ombros e acabamento azul nas mangas', 'Assinatura Aegon em branco no peito'],
  color: '#0045BA',
  colorName: 'Azul System Wake',
  badge: 'Novo por aqui',
  active: true,
  sku: 'AEG-POLO-001',
  stock: 32,
  tags: ['Camisas', 'Uniforme', 'Novo'],
  variants: ['P', 'M', 'G', 'GG'].map((size, index) => ({ id: `10-${index}`, size, sku: `AEG-POLO-${size}`, stock: 8 })),
}]

function restoredCatalog(): Product[] {
  try {
    const saved = JSON.parse(localStorage.getItem('aegon:catalog:v1') || 'null')
    if (!Array.isArray(saved)) return initialProducts
    const catalog = saved.filter((product): product is Product => product && typeof product.id === 'number' && typeof product.name === 'string' && typeof product.price === 'number' && Array.isArray(product.sizes))
    const createdDuringValidation = catalog.findIndex(product => product.name === 'Polo Demo Admin')
    if (createdDuringValidation !== -1) catalog.splice(createdDuringValidation, 1, initialProducts.find(product => product.id === 10)!)
    if (!catalog.some(product => product.id === 10)) catalog.push(initialProducts.find(product => product.id === 10)!)
    return catalog
  } catch { return initialProducts }
}

export const products = reactive<Product[]>(restoredCatalog())
watch(products, value => {
  try { localStorage.setItem('aegon:catalog:v1', JSON.stringify(value)) } catch { /* aviso tratado pelo painel */ }
}, { deep: true })

export const featured = [4, 2, 5, 6].map(id => products.find(p => p.id === id)!)
export const categories = ['Todos', 'Camisas', 'Garrafas', 'Cadernos', 'Combos']
export const money = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
