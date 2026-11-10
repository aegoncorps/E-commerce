// js/header.js — Inicialização do Header, Busca, Carrinho e Estado Global AEGON Store

const CART_STORAGE_KEY = 'aegon_store_cart_v1';
let productsCache = null;

/**
 * Formata valor numérico para moeda BRL (R$ 00,00)
 */
export function formatBRL(value) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Carrega e armazena em cache o catálogo produtos.json
 */
export async function getProducts() {
  if (productsCache) return productsCache;
  const response = await fetch('produtos.json');
  if (!response.ok) {
    throw new Error(`Falha ao carregar produtos.json: ${response.status}`);
  }
  productsCache = await response.json();
  return productsCache;
}

/**
 * Lê os itens salvos no carrinho (localStorage)
 */
export function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Salva os itens do carrinho e atualiza a interface
 */
export function saveCart(cartItems) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (e) {
    console.warn('Não foi possível salvar no localStorage:', e);
  }
  renderCartUI();
}

/**
 * Adiciona um produto ao carrinho com tamanho selecionado
 */
export async function addToCart(productId, selectedSize = null, quantity = 1, openDrawer = true) {
  const products = await getProducts();
  const product = products.find(p => Number(p.id) === Number(productId));
  if (!product) return;

  const size = selectedSize || (Array.isArray(product.tamanho) ? product.tamanho[0] : product.tamanho);
  const cartKey = `${product.id}__${size}`;
  const cart = getCart();

  const existingIndex = cart.findIndex(item => item.cartKey === cartKey);
  if (existingIndex > -1) {
    cart[existingIndex].quantidade += Number(quantity);
  } else {
    cart.push({
      cartKey,
      id: product.id,
      nome: product.nome,
      preco: product.preco,
      tag: product.tag,
      tamanho: size,
      imagem: product.imagem,
      quantidade: Number(quantity)
    });
  }

  saveCart(cart);
  showToast(`"${product.nome}" (${size}) adicionado ao carrinho!`);

  if (openDrawer) {
    const offcanvasEl = document.getElementById('cartOffcanvas');
    if (offcanvasEl && window.bootstrap) {
      const bsOffcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      bsOffcanvas.show();
    }
  }
}

/**
 * Atualiza a quantidade de um item no carrinho
 */
export function updateCartItemQty(cartKey, delta) {
  const cart = getCart();
  const idx = cart.findIndex(item => item.cartKey === cartKey);
  if (idx === -1) return;

  cart[idx].quantidade += delta;
  if (cart[idx].quantidade <= 0) {
    cart.splice(idx, 1);
  }
  saveCart(cart);
}

/**
 * Remove um item do carrinho
 */
export function removeCartItem(cartKey) {
  const cart = getCart().filter(item => item.cartKey !== cartKey);
  saveCart(cart);
}

/**
 * Exibe um Toast Bootstrap de feedback
 */
export function showToast(message) {
  const toastEl = document.getElementById('cartToast');
  const toastMsg = document.getElementById('cartToastMessage');
  if (!toastEl || !toastMsg) return;

  toastMsg.textContent = message;
  if (window.bootstrap) {
    const toast = window.bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2800 });
    toast.show();
  }
}

/**
 * Renderiza os itens dentro do Offcanvas de Carrinho (components/car.html) e atualiza o badge no Header
 */
export function renderCartUI() {
  const cart = getCart();
  const totalCount = cart.reduce((acc, item) => acc + item.quantidade, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  // Atualiza badge do ícone da sacola no Header
  const badgeEl = document.getElementById('cart-badge');
  if (badgeEl) {
    badgeEl.textContent = totalCount;
    badgeEl.classList.toggle('d-none', totalCount === 0);
  }

  // Atualiza contador no título do Offcanvas
  const offcanvasCount = document.getElementById('cart-offcanvas-count');
  if (offcanvasCount) {
    offcanvasCount.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'itens'}`;
  }

  const emptyState = document.getElementById('cart-empty-state');
  const itemsList = document.getElementById('cart-items-list');
  const summaryFooter = document.getElementById('cart-summary-footer');

  if (!emptyState || !itemsList || !summaryFooter) return;

  if (cart.length === 0) {
    emptyState.classList.remove('d-none');
    itemsList.classList.add('d-none');
    summaryFooter.classList.add('d-none');
    itemsList.innerHTML = '';
    return;
  }

  emptyState.classList.add('d-none');
  itemsList.classList.remove('d-none');
  summaryFooter.classList.remove('d-none');

  itemsList.innerHTML = cart
    .map(
      item => `
      <div class="d-flex align-items-center justify-content-between gap-3 py-3 border-bottom border-secondary border-opacity-25">
        <div class="position-relative flex-shrink-0">
          <a href="#/product-details?id=${item.id}" class="d-block rounded-3 aegon-cart-thumb-box p-1">
            <img src="${item.imagem}" alt="${item.nome}" width="64" height="64" class="rounded-2 object-fit-contain">
          </a>
          <button
            type="button"
            class="btn btn-sm position-absolute top-0 start-0 translate-middle rounded-circle aegon-cart-remove-btn"
            data-remove-key="${item.cartKey}"
            title="Remover item"
            aria-label="Remover ${item.nome}"
          >
            ×
          </button>
        </div>

        <div class="flex-grow-1 min-w-0">
          <a href="#/product-details?id=${item.id}" class="text-white text-decoration-none fw-bold small d-block text-truncate">
            ${item.nome}
          </a>
          <div class="text-secondary" style="font-size: 0.76rem;">
            <span class="badge rounded-pill text-bg-dark border border-secondary me-1">${item.tag}</span>
            <span>Tamanho: <strong class="text-light">${item.tamanho}</strong></span>
          </div>
        </div>

        <div class="text-end flex-shrink-0">
          <div class="fw-bold text-white small mb-1">${formatBRL(item.preco * item.quantidade)}</div>
          <div class="d-inline-flex align-items-center rounded-pill border border-secondary px-1 aegon-qty-box">
            <button type="button" class="btn btn-sm text-light border-0 py-0 px-2" data-qty-key="${item.cartKey}" data-qty-delta="-1">−</button>
            <span class="small fw-bold px-2">${item.quantidade}</span>
            <button type="button" class="btn btn-sm text-light border-0 py-0 px-2" data-qty-key="${item.cartKey}" data-qty-delta="1">+</button>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  // Frete grátis acima de R$ 250,00
  const shippingEl = document.getElementById('cart-shipping-value');
  const totalEl = document.getElementById('cart-total-value');
  const isFreeShipping = subtotal >= 250;
  const shippingCost = isFreeShipping ? 0 : 19.90;

  if (shippingEl) {
    shippingEl.innerHTML = isFreeShipping
      ? '<span class="text-success fw-bold">Grátis (Acima de R$ 250)</span>'
      : `${formatBRL(shippingCost)}`;
  }

  if (totalEl) {
    totalEl.innerHTML = `${formatBRL(subtotal + shippingCost)} <small class="text-secondary fs-6">BRL</small>`;
  }
}

/**
 * Destaca o link ativo no Header de acordo com a rota atual
 */
export function updateActiveNav() {
  const rawHash = window.location.hash.substring(1) || '/';
  const [path, queryString] = rawHash.split('?');
  const params = new URLSearchParams(queryString);
  const activeTag = params.get('tag');

  document.querySelectorAll('.aegon-nav-link').forEach(link => {
    link.classList.remove('active');
    const linkTag = link.getAttribute('data-tag');
    const linkRoute = link.getAttribute('data-route');

    if (activeTag && linkTag === activeTag) {
      link.classList.add('active');
    } else if (!activeTag && linkRoute === '/' && (path === '/' || path === '/home')) {
      link.classList.add('active');
    } else if (!activeTag && linkRoute === '/produtos' && (path === '/produtos' || path === '/produto')) {
      link.classList.add('active');
    }
  });
}

/**
 * Configura eventos delegados para o Carrinho e para a Busca Rápida
 */
function bindHeaderAndOverlayEvents() {
  // Eventos de clique no carrinho (aumentar, diminuir, remover, finalizar compra)
  const carContainer = document.getElementById('car-container');
  if (carContainer) {
    carContainer.addEventListener('click', e => {
      const removeBtn = e.target.closest('[data-remove-key]');
      if (removeBtn) {
        removeCartItem(removeBtn.getAttribute('data-remove-key'));
        return;
      }

      const qtyBtn = e.target.closest('[data-qty-key]');
      if (qtyBtn) {
        const key = qtyBtn.getAttribute('data-qty-key');
        const delta = Number(qtyBtn.getAttribute('data-qty-delta'));
        updateCartItemQty(key, delta);
        return;
      }

      const checkoutBtn = e.target.closest('#btn-checkout');
      if (checkoutBtn) {
        const cart = getCart();
        if (cart.length === 0) return;
        saveCart([]);
        const offcanvasEl = document.getElementById('cartOffcanvas');
        if (offcanvasEl && window.bootstrap) {
          window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl).hide();
        }
        showToast('Pedido AEGON recebido com sucesso! Juntos, on.');
      }
    });
  }

  // Busca no Header (formulário inline)
  const headerSearchForm = document.getElementById('header-search-form');
  const headerSearchInput = document.getElementById('header-search-input');
  if (headerSearchForm && headerSearchInput) {
    headerSearchForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = headerSearchInput.value.trim();
      window.location.hash = q ? `#/produtos?q=${encodeURIComponent(q)}` : '#/produtos';
    });
  }

  // Modal de busca rápida (components/search.html)
  const modalSearchInput = document.getElementById('modal-search-input');
  const modalResults = document.getElementById('modal-search-results');
  const searchModalEl = document.getElementById('searchModal');

  const renderModalSearchResults = async queryText => {
    if (!modalResults) return;
    const products = await getProducts();
    const term = (queryText || '').trim().toLowerCase();

    const filtered = term
      ? products.filter(
          p =>
            p.nome.toLowerCase().includes(term) ||
            p.tag.toLowerCase().includes(term) ||
            p.tamanho.join(' ').toLowerCase().includes(term)
        )
      : products.slice(0, 5);

    if (filtered.length === 0) {
      modalResults.innerHTML = `
        <div class="text-center py-4 text-secondary small">
          Nenhum produto encontrado para "<strong>${queryText}</strong>".
        </div>
      `;
      return;
    }

    modalResults.innerHTML = filtered
      .map(
        p => `
        <a href="#/product-details?id=${p.id}" class="list-group-item list-group-item-action bg-transparent text-light border-secondary border-opacity-25 d-flex align-items-center justify-content-between py-2 px-3 search-result-link">
          <div class="d-flex align-items-center gap-3">
            <img src="${p.imagem}" alt="${p.nome}" width="44" height="44" class="rounded-2 aegon-cart-thumb-box p-1">
            <div>
              <div class="fw-bold small text-white">${p.nome}</div>
              <div class="text-secondary" style="font-size: 0.74rem;">
                ${p.tag} · Tamanhos: ${p.tamanho.join(', ')}
              </div>
            </div>
          </div>
          <span class="badge rounded-pill aegon-price-pill">${formatBRL(p.preco)}</span>
        </a>
      `
      )
      .join('');
  };

  if (modalSearchInput) {
    modalSearchInput.addEventListener('input', e => {
      renderModalSearchResults(e.target.value);
    });
  }

  if (searchModalEl) {
    searchModalEl.addEventListener('shown.bs.modal', () => {
      renderModalSearchResults(modalSearchInput ? modalSearchInput.value : '');
      if (modalSearchInput) modalSearchInput.focus();
    });

    searchModalEl.addEventListener('click', e => {
      const closeLink = e.target.closest('.search-result-link, .search-quick-tag');
      if (closeLink && window.bootstrap) {
        window.bootstrap.Modal.getOrCreateInstance(searchModalEl).hide();
      }
    });
  }
}

/**
 * Inicialização principal dos componentes globais (Header, Busca e Carrinho)
 */
export async function initHeaderAndComponents() {
  const headerContainer = document.getElementById('header-container');
  const searchContainer = document.getElementById('search-container');
  const carContainer = document.getElementById('car-container');

  try {
    const [headerHtml, searchHtml, carHtml] = await Promise.all([
      fetch('components/header.html').then(r => r.text()),
      fetch('components/search.html').then(r => r.text()),
      fetch('components/car.html').then(r => r.text())
    ]);

    if (headerContainer) headerContainer.innerHTML = headerHtml;
    if (searchContainer) searchContainer.innerHTML = searchHtml;
    if (carContainer) carContainer.innerHTML = carHtml;

    bindHeaderAndOverlayEvents();
    renderCartUI();
    updateActiveNav();
  } catch (err) {
    console.error('Erro ao inicializar componentes globais:', err);
  }
}

// Expõe utilitários globalmente para integração entre módulos e páginas
window.AegonStore = {
  getProducts,
  getCart,
  addToCart,
  updateCartItemQty,
  removeCartItem,
  renderCartUI,
  formatBRL,
  showToast
};
