// js/router.js — Roteador SPA e Controladores das 3 Páginas (Home, Produtos, Detalhes do Produto)

import {
  initHeaderAndComponents,
  getProducts,
  addToCart,
  formatBRL,
  updateActiveNav
} from './header.js';

const app = document.getElementById('app');

// Mapeamento de rotas para os 3 templates HTML
const routes = {
  '/': 'pages/home.html',
  '/home': 'pages/home.html',
  '/produtos': 'pages/products.html',
  '/produto': 'pages/products.html',
  '/product-details': 'pages/product-details.html'
};

/**
 * Gera o HTML de um Card de Produto no padrão visual template.vercel.shop + Bootstrap + Branding AEGON
 */
function createProductCardHTML(product, colClass = 'col-12 col-sm-6 col-xl-4') {
  const defaultSize = Array.isArray(product.tamanho) ? product.tamanho[0] : product.tamanho;
  const sizesBadges = (Array.isArray(product.tamanho) ? product.tamanho : [product.tamanho])
    .map(
      (s, i) => `
      <button
        type="button"
        class="btn btn-sm rounded-pill aegon-card-size-btn ${i === 0 ? 'active' : ''}"
        data-card-size="${s}"
        data-product-id="${product.id}"
      >${s}</button>
    `
    )
    .join('');

  return `
    <div class="${colClass}">
      <div class="card h-100 aegon-product-card rounded-4 overflow-hidden position-relative" data-card-product="${product.id}" data-selected-size="${defaultSize}">
        <!-- Topo do Card: Tag da Categoria -->
        <div class="position-absolute top-0 start-0 end-0 p-3 d-flex justify-content-between align-items-center z-2 pointer-events-none">
          <span class="badge rounded-pill text-bg-dark border border-secondary px-3 py-1">${product.tag}</span>
        </div>

        <!-- Imagem do Produto (Clicável para ir aos detalhes) -->
        <a href="#/product-details?id=${product.id}" class="aegon-card-img-link d-flex align-items-center justify-content-center p-4 position-relative text-decoration-none">
          <img src="${product.imagem}" class="card-img-top aegon-card-img" alt="${product.nome}">

          <!-- Pílula Flutuante Estilo template.vercel.shop (Nome + Preço em Azul System Wake) -->
          <div class="aegon-vercel-pill d-flex align-items-center gap-2 ps-3 pe-1 py-1 rounded-pill">
            <span class="aegon-vercel-pill__title text-truncate fw-bold text-white small">${product.nome}</span>
            <span class="badge rounded-pill aegon-price-pill px-3 py-2">${formatBRL(product.preco)}</span>
          </div>
        </a>

        <!-- Rodapé Interativo do Card: Seletor de Tamanho + Botões Detalhes / Adicionar ao Carrinho -->
        <div class="card-body d-flex flex-column justify-content-between pt-2 pb-3 px-3 aegon-card-footer">
          <div class="mb-3">
            <div class="d-flex align-items-center justify-content-between mb-1">
              <span class="text-secondary" style="font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700;">
                Tamanho:
              </span>
              <a href="#/product-details?id=${product.id}" class="text-decoration-none small fw-bold text-primary">
                Ver detalhes →
              </a>
            </div>
            <div class="d-flex flex-wrap gap-1">
              ${sizesBadges}
            </div>
          </div>

          <button
            type="button"
            class="btn btn-primary btn-sm rounded-pill w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 btn-quick-add"
            data-add-id="${product.id}"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
            <span>Adicionar ao Carrinho</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Gera um Card Hero para o Bento Grid da Home (Estilo template.vercel.shop)
 */
function createBentoCardHTML(product, isLarge = false) {
  const defaultSize = Array.isArray(product.tamanho) ? product.tamanho[0] : product.tamanho;
  return `
    <div class="card aegon-product-card aegon-bento-card ${isLarge ? 'aegon-bento-card--large h-100' : 'aegon-bento-card--small'} rounded-4 overflow-hidden position-relative">
      <div class="position-absolute top-0 start-0 end-0 p-3 d-flex justify-content-between align-items-center z-2">
        <span class="badge rounded-pill text-bg-dark border border-secondary px-3 py-2">${product.tag} · ${product.tamanho.join(' / ')}</span>
        <button
          type="button"
          class="btn btn-sm btn-primary rounded-pill px-3 py-1 fw-bold shadow-sm btn-bento-add"
          data-bento-add-id="${product.id}"
          data-bento-size="${defaultSize}"
          title="Adicionar rápido ao carrinho"
        >
          + Carrinho
        </button>
      </div>

      <a href="#/product-details?id=${product.id}" class="d-flex align-items-center justify-content-center h-100 w-100 p-4 text-decoration-none position-relative">
        <img src="${product.imagem}" alt="${product.nome}" class="img-fluid aegon-bento-img ${isLarge ? 'aegon-bento-img--large' : ''}">

        <!-- Pílula Flutuante Estilo template.vercel.shop -->
        <div class="aegon-vercel-pill aegon-vercel-pill--hero d-flex align-items-center gap-3 ps-3 pe-2 py-2 rounded-pill">
          <span class="fw-extrabold text-white small text-truncate">${product.nome}</span>
          <span class="badge rounded-pill aegon-price-pill px-3 py-2">${formatBRL(product.preco)} BRL</span>
        </div>
      </a>
    </div>
  `;
}

/**
 * Controlador da Página 1: Home (pages/home.html)
 */
async function handleHomePage() {
  const products = await getProducts();

  // 1. Bento Grid de 3 itens (Destaque principal à esquerda + 2 empilhados à direita)
  const mainFeatured = products[0]; // Combo Full ON
  const sideFeatured = [products[1], products[2]]; // Garrafa System Wake e Kit Duo ON

  const heroMainEl = document.getElementById('hero-featured-main');
  const heroSideEl = document.getElementById('hero-featured-side');

  if (heroMainEl && mainFeatured) {
    heroMainEl.innerHTML = createBentoCardHTML(mainFeatured, true);
  }
  if (heroSideEl) {
    heroSideEl.innerHTML = sideFeatured.map(p => createBentoCardHTML(p, false)).join('');
  }

  // 2. Faixa Carrossel Horizontal (Estilo template.vercel.shop)
  const carouselTrack = document.getElementById('home-carousel-track');
  if (carouselTrack) {
    carouselTrack.innerHTML = products
      .map(
        p => `
        <a href="#/product-details?id=${p.id}" class="aegon-carousel-item aegon-product-card rounded-4 p-3 text-decoration-none position-relative d-flex align-items-center justify-content-center flex-shrink-0">
          <img src="${p.imagem}" alt="${p.nome}" class="img-fluid aegon-carousel-img">
          <div class="aegon-vercel-pill d-flex align-items-center gap-2 ps-3 pe-1 py-1 rounded-pill">
            <span class="aegon-vercel-pill__title text-truncate fw-bold text-white" style="font-size: 0.78rem;">${p.nome}</span>
            <span class="badge rounded-pill aegon-price-pill px-2 py-1">${formatBRL(p.preco)}</span>
          </div>
        </a>
      `
      )
      .join('');
  }

  // 3. Vitrine de Produtos na Home com filtro rápido de tag
  const homeGrid = document.getElementById('home-products-grid');
  const renderHomeGrid = tagFilter => {
    if (!homeGrid) return;
    const filtered =
      !tagFilter || tagFilter === 'all'
        ? products
        : products.filter(p => p.tag.toLowerCase() === tagFilter.toLowerCase());
    homeGrid.innerHTML = filtered.map(p => createProductCardHTML(p, 'col-12 col-sm-6 col-lg-4')).join('');
  };

  renderHomeGrid('all');

  const quickFilterGroup = document.getElementById('home-quick-filter');
  if (quickFilterGroup) {
    quickFilterGroup.addEventListener('click', e => {
      const btn = e.target.closest('[data-home-tag]');
      if (!btn) return;
      quickFilterGroup.querySelectorAll('[data-home-tag]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderHomeGrid(btn.getAttribute('data-home-tag'));
    });
  }
}

/**
 * Controlador da Página 2: Catálogo de Produtos (pages/products.html)
 * Incorpora components/filter.html e components/list-products.html
 */
async function handleProductsPage(query) {
  const filterContainer = document.getElementById('filter-container');
  const listProductsContainer = document.getElementById('list-products-container');

  // Incorpora os componentes filter.html e list-products.html dentro da página products.html
  const [filterHtml, listHtml, products] = await Promise.all([
    fetch('components/filter.html').then(r => r.text()),
    fetch('components/list-products.html').then(r => r.text()),
    getProducts()
  ]);

  if (filterContainer) filterContainer.innerHTML = filterHtml;
  if (listProductsContainer) listProductsContainer.innerHTML = listHtml;

  // Estado dos filtros ativos
  let activeTag = query.get('tag') || 'all';
  let activeSize = query.get('size') || 'all';
  let searchQuery = query.get('q') || '';
  let activeSort = query.get('sort') || 'relevance';

  const pageTitle = document.getElementById('products-page-title');
  const catalogSearchInput = document.getElementById('catalog-search-input');
  const sortSelect = document.getElementById('filter-sort-select');
  const statusText = document.getElementById('products-status-text');
  const clearBtn = document.getElementById('btn-clear-filters');
  const resetEmptyBtn = document.getElementById('btn-reset-empty');
  const productsGrid = document.getElementById('products-grid');
  const productsEmpty = document.getElementById('products-empty');

  if (catalogSearchInput) catalogSearchInput.value = searchQuery;
  if (sortSelect) sortSelect.value = activeSort;

  const syncFilterHighlight = () => {
    document.querySelectorAll('[data-filter-tag]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter-tag') === activeTag);
    });
    document.querySelectorAll('[data-filter-size]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-filter-size') === activeSize);
    });
    if (pageTitle) {
      pageTitle.textContent = activeTag === 'all' ? 'Todos os Produtos' : `Coleção: ${activeTag}`;
    }
  };

  const applyFiltersAndRender = () => {
    syncFilterHighlight();

    let result = [...products];

    // Filtra por Tag (Camisas, Garrafas, Cadernos, Combos)
    if (activeTag !== 'all') {
      result = result.filter(p => p.tag.toLowerCase() === activeTag.toLowerCase());
    }

    // Filtra por Tamanho (P, M, G, GG, 500ml, 750ml, 1L, A5, B5...)
    if (activeSize !== 'all') {
      result = result.filter(p =>
        p.tamanho.some(t => t.toLowerCase().includes(activeSize.toLowerCase()))
      );
    }

    // Filtra por Busca de Texto
    if (searchQuery.trim() !== '') {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        p =>
          p.nome.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q) ||
          p.descricao.toLowerCase().includes(q) ||
          p.tamanho.join(' ').toLowerCase().includes(q)
      );
    }

    // Ordenação
    if (activeSort === 'price-asc') {
      result.sort((a, b) => a.preco - b.preco);
    } else if (activeSort === 'price-desc') {
      result.sort((a, b) => b.preco - a.preco);
    } else if (activeSort === 'name-asc') {
      result.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    }

    const hasActiveFilter = activeTag !== 'all' || activeSize !== 'all' || searchQuery.trim() !== '';
    if (clearBtn) clearBtn.classList.toggle('d-none', !hasActiveFilter);

    if (statusText) {
      statusText.innerHTML = `Exibindo <strong class="text-white">${result.length}</strong> ${
        result.length === 1 ? 'produto' : 'produtos'
      }${searchQuery ? ` para "<strong class="text-white">${searchQuery}</strong>"` : ''}`;
    }

    if (!productsGrid || !productsEmpty) return;

    if (result.length === 0) {
      productsGrid.innerHTML = '';
      productsEmpty.classList.remove('d-none');
    } else {
      productsEmpty.classList.add('d-none');
      productsGrid.innerHTML = result
        .map(p => createProductCardHTML(p, 'col-12 col-md-6 col-xl-4'))
        .join('');
    }
  };

  // Eventos dos filtros de Tag e Tamanho
  if (filterContainer) {
    filterContainer.addEventListener('click', e => {
      const tagBtn = e.target.closest('[data-filter-tag]');
      if (tagBtn) {
        activeTag = tagBtn.getAttribute('data-filter-tag');
        applyFiltersAndRender();
        return;
      }

      const sizeBtn = e.target.closest('[data-filter-size]');
      if (sizeBtn) {
        activeSize = sizeBtn.getAttribute('data-filter-size');
        applyFiltersAndRender();
      }
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', e => {
      activeSort = e.target.value;
      applyFiltersAndRender();
    });
  }

  if (catalogSearchInput) {
    catalogSearchInput.addEventListener('input', e => {
      searchQuery = e.target.value;
      applyFiltersAndRender();
    });
  }

  const resetAllFilters = () => {
    activeTag = 'all';
    activeSize = 'all';
    searchQuery = '';
    activeSort = 'relevance';
    if (catalogSearchInput) catalogSearchInput.value = '';
    if (sortSelect) sortSelect.value = 'relevance';
    applyFiltersAndRender();
  };

  if (clearBtn) clearBtn.addEventListener('click', resetAllFilters);
  if (resetEmptyBtn) resetEmptyBtn.addEventListener('click', resetAllFilters);

  applyFiltersAndRender();
}

/**
 * Controlador da Página 3: Detalhes do Produto (pages/product-details.html)
 * @param {URLSearchParams} query
 */
async function handleProductDetails(query) {
  const productId = Number(query.get('id')) || 1;
  const products = await getProducts();
  const product = products.find(p => Number(p.id) === productId) || products[0];

  if (!product) return;

  let selectedSize = Array.isArray(product.tamanho) ? product.tamanho[0] : product.tamanho;
  let quantity = 1;

  // Preenche Breadcrumb e Textos Principais
  const breadcrumbTag = document.getElementById('detail-breadcrumb-tag');
  const breadcrumbName = document.getElementById('detail-breadcrumb-name');
  const stageTag = document.getElementById('detail-stage-tag');
  const mainImage = document.getElementById('detail-main-image');
  const galleryThumbs = document.getElementById('detail-gallery-thumbs');
  const tagEl = document.getElementById('detail-tag');
  const nameEl = document.getElementById('detail-name');
  const subtitleEl = document.getElementById('detail-subtitle');
  const priceEl = document.getElementById('detail-price');
  const installmentsEl = document.getElementById('detail-installments');
  const descEl = document.getElementById('detail-description');
  const specsList = document.getElementById('detail-specs-list');
  const sizesContainer = document.getElementById('detail-sizes-container');
  const selectedSizeLabel = document.getElementById('detail-selected-size-label');
  const qtyValueEl = document.getElementById('detail-qty-value');
  const qtyMinusBtn = document.getElementById('detail-qty-minus');
  const qtyPlusBtn = document.getElementById('detail-qty-plus');
  const addCartBtn = document.getElementById('detail-add-cart-btn');
  const relatedGrid = document.getElementById('related-products-grid');

  if (breadcrumbTag) {
    breadcrumbTag.textContent = product.tag;
    breadcrumbTag.href = `#/produtos?tag=${encodeURIComponent(product.tag)}`;
  }
  if (breadcrumbName) breadcrumbName.textContent = product.nome;
  if (stageTag) stageTag.textContent = product.tag;
  if (mainImage) {
    mainImage.src = product.imagem;
    mainImage.alt = product.nome;
  }
  if (tagEl) tagEl.textContent = `COLEÇÃO · ${product.tag.toUpperCase()}`;
  if (nameEl) nameEl.textContent = product.nome;
  if (subtitleEl) subtitleEl.textContent = product.subtitulo || '';
  if (priceEl) priceEl.textContent = `${formatBRL(product.preco)} BRL`;
  if (installmentsEl) {
    installmentsEl.textContent = `ou 6x de ${formatBRL(product.preco / 6)} sem juros`;
  }
  if (descEl) descEl.textContent = product.descricao;

  // Galeria de miniaturas interativa
  const galleryImages = product.galeria && product.galeria.length > 0 ? product.galeria : [product.imagem];
  if (galleryThumbs) {
    galleryThumbs.innerHTML = galleryImages
      .map(
        (imgSrc, idx) => `
        <button
          type="button"
          class="btn p-2 rounded-3 aegon-thumb-btn ${idx === 0 ? 'active' : ''}"
          data-thumb-src="${imgSrc}"
          aria-label="Visualizar ângulo ${idx + 1}"
        >
          <img src="${imgSrc}" alt="${product.nome} miniatura ${idx + 1}" width="64" height="64" class="object-fit-contain">
        </button>
      `
      )
      .join('');

    galleryThumbs.addEventListener('click', e => {
      const btn = e.target.closest('[data-thumb-src]');
      if (!btn || !mainImage) return;
      galleryThumbs.querySelectorAll('[data-thumb-src]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mainImage.src = btn.getAttribute('data-thumb-src');
    });
  }

  // Seletor de Tamanhos (P, M, G, GG / 500ml, 750ml / A5, B5)
  const renderSizes = () => {
    if (!sizesContainer) return;
    if (selectedSizeLabel) selectedSizeLabel.textContent = `Selecionado: ${selectedSize}`;
    const sizes = Array.isArray(product.tamanho) ? product.tamanho : [product.tamanho];
    sizesContainer.innerHTML = sizes
      .map(
        size => `
        <button
          type="button"
          class="btn rounded-pill px-4 py-2 fw-bold aegon-size-chip ${size === selectedSize ? 'active' : ''}"
          data-detail-size="${size}"
        >
          ${size}
        </button>
      `
      )
      .join('');
  };

  renderSizes();

  if (sizesContainer) {
    sizesContainer.addEventListener('click', e => {
      const btn = e.target.closest('[data-detail-size]');
      if (!btn) return;
      selectedSize = btn.getAttribute('data-detail-size');
      renderSizes();
    });
  }

  // Quantidade
  if (qtyMinusBtn && qtyPlusBtn && qtyValueEl) {
    qtyMinusBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        qtyValueEl.textContent = quantity;
      }
    });
    qtyPlusBtn.addEventListener('click', () => {
      quantity++;
      qtyValueEl.textContent = quantity;
    });
  }

  // Especificações Técnicas
  if (specsList && Array.isArray(product.especificacoes)) {
    specsList.innerHTML = product.especificacoes
      .map(
        spec => `
        <li class="d-flex align-items-start gap-2">
          <span class="text-warning fw-bold">●</span>
          <span>${spec}</span>
        </li>
      `
      )
      .join('');
  }

  // Botão Adicionar ao Carrinho na página de Detalhes
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      addToCart(product.id, selectedSize, quantity, true);
    });
  }

  // Produtos Relacionados (mesma tag primeiro, depois outros)
  if (relatedGrid) {
    const related = products
      .filter(p => p.id !== product.id)
      .sort((a, b) => (a.tag === product.tag ? -1 : 1))
      .slice(0, 3);
    relatedGrid.innerHTML = related.map(p => createProductCardHTML(p, 'col-12 col-md-4')).join('');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Delegação global no container #app para seleção de tamanho nos cards e botão rápido "+ Adicionar ao Carrinho"
 */
function bindGlobalCardEvents() {
  if (!app) return;
  app.addEventListener('click', e => {
    // Troca o tamanho selecionado dentro de um card da listagem
    const sizeBtn = e.target.closest('[data-card-size]');
    if (sizeBtn) {
      e.preventDefault();
      const card = sizeBtn.closest('[data-card-product]');
      if (card) {
        card.querySelectorAll('[data-card-size]').forEach(b => b.classList.remove('active'));
        sizeBtn.classList.add('active');
        card.setAttribute('data-selected-size', sizeBtn.getAttribute('data-card-size'));
      }
      return;
    }

    // Botão Adicionar ao Carrinho nos cards da listagem
    const quickAddBtn = e.target.closest('[data-add-id]');
    if (quickAddBtn) {
      e.preventDefault();
      const productId = Number(quickAddBtn.getAttribute('data-add-id'));
      const card = quickAddBtn.closest('[data-card-product]');
      const chosenSize = card ? card.getAttribute('data-selected-size') : null;
      addToCart(productId, chosenSize, 1, true);
      return;
    }

    // Botão "+ Carrinho" nos Bento Cards da Home
    const bentoAddBtn = e.target.closest('[data-bento-add-id]');
    if (bentoAddBtn) {
      e.preventDefault();
      e.stopPropagation();
      const productId = Number(bentoAddBtn.getAttribute('data-bento-add-id'));
      const size = bentoAddBtn.getAttribute('data-bento-size');
      addToCart(productId, size, 1, true);
    }
  });
}

/**
 * Função responsável por ler o hash, identificar a rota e injetar o HTML
 */
async function renderRoute() {
  const rawHash = window.location.hash.substring(1) || '/';
  const [rawPath, queryString] = rawHash.split('?');
  const path = rawPath || '/';
  const query = new URLSearchParams(queryString);

  const templatePath = routes[path];
  updateActiveNav();

  if (!templatePath) {
    app.innerHTML = `
      <div class="container py-5 text-center">
        <span class="aegon-eyebrow">ERRO 404</span>
        <h1 class="display-5 fw-extrabold text-white mb-3">Página não encontrada</h1>
        <p class="text-secondary mb-4">A rota solicitada não existe na AEGON Store.</p>
        <a href="#/" class="btn btn-primary rounded-pill px-4 py-2 fw-bold">Voltar para o Início</a>
      </div>
    `;
    return;
  }

  try {
    const response = await fetch(templatePath);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const html = await response.text();
    app.innerHTML = html;

    if (path === '/' || path === '/home') {
      await handleHomePage();
    } else if (path === '/produtos' || path === '/produto') {
      await handleProductsPage(query);
    } else if (path === '/product-details') {
      await handleProductDetails(query);
    }
  } catch (error) {
    console.error('Erro ao carregar o template:', error);
    app.innerHTML = `
      <div class="container py-5 text-center">
        <h2 class="fw-bold text-danger">Erro ao carregar a página</h2>
        <p class="text-secondary small">${error.message}</p>
      </div>
    `;
  }
}

/**
 * Inicializador: carrega Header/Busca/Carrinho, conecta eventos e dispara a primeira renderização
 */
async function load() {
  await initHeaderAndComponents();
  bindGlobalCardEvents();
  window.addEventListener('hashchange', renderRoute);
  await renderRoute();
}

document.addEventListener('DOMContentLoaded', load);
