import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Catalog from './views/Catalog.vue'
import Product from './views/Product.vue'
import Checkout from './views/Checkout.vue'
import Admin from './views/Admin.vue'
import './styles/tokens.css'
import './styles/main.css'
import './styles/admin.css'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home, meta: { title: 'Menos do mesmo. Mais você.' } },
    { path: '/produtos', component: Catalog, meta: { title: 'Coleção' } },
    { path: '/produto/:id', component: Product, meta: { title: 'Seu próximo essencial' } },
    { path: '/favoritos', component: Catalog, meta: { title: 'Favoritos' } },
    { path: '/checkout', component: Checkout, meta: { title: 'Revisar pedido' } },
    { path: '/admin', component: Admin, meta: { title: 'Administração' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, top: 115, behavior: 'smooth' }
    if (to.path === from.path && !from.hash && !to.hash) return false
    return savedPosition || { top: 0, behavior: 'instant' }
  },
})
router.afterEach(to => { document.title = `Aegon Store — ${to.meta.title}` })
createApp(App).use(router).mount('#app')
