# Aegon — Design System

> Versão 2 · Fase 0 · Fonte: Identidade Visual Aegon (16 slides) + Apresentação de marca (10 slides). Sistema vivo: https://claude.ai/artifact/4pbMacxCTVDDFwKqPLRfVM

A Aegon existe para **ativar marcas** e fazê-las deixar de ser apenas existentes para serem lembradas. Mais do que design ou marketing, a Aegon trabalha com ativação: transformar marcas no automático em marcas com clareza, intenção e presença. A identidade nasce de um gesto, ligar, e do símbolo **on**. A promessa: **“Tudo se resolve no mesmo botão.”**

Este sistema serve as peças de marca e os produtos digitais Aegon. O **Core** (cores, tipografia, forma, grafismos, componentes) vale para tudo; cada produto, como o OPEX na seção própria, estende o Core sem redefini-lo.

## Plataforma de marca

- **Propósito.** Ativar marcas e fazê-las serem lembradas.
- **Problema que resolve.** A maioria das marcas não falha por falta de estética, mas por falta de direção: existem, comunicam, postam, mas não são percebidas.
- **Postura.** Criar certo, com propósito e direção; não criar rápido nem seguir tendências vazias. Cada decisão é estratégica, para construir percepção, posicionamento e valor.
- **Atributos.** Clareza, intenção, presença, proximidade, autenticidade.
- **Frases da marca** (use como estão): “Tudo se resolve no mesmo botão.” · “Menos esforço. Mais direção. Mais crescimento.” · “Sua marca não precisa aparecer mais. Precisa significar mais.” · “O mercado está cheio. De originalidade? Nem tanto.” · “Feito por gente.” · “Menos do mesmo.” · “Problemas digitais? on”
- **Contato.** @AegonBr · aegoncorps@gmail.com

## Voz e conteúdo

- Português do Brasil, tratando por **você**. Frases curtas e afirmativas, ritmo de contraste (“Menos esforço. Mais direção.”). Provocação inteligente, nunca agressiva.
- Peças de campanha: frase de apoio em sentence case + manchete curta em caixa-alta terminada em ponto (`Headline`).
- Produto: sentence case em títulos, botões e menus; nada de caixa-alta em rótulos. Botões dizem a ação (“Aprovar orçamento”), e o mesmo verbo volta no resultado (“Orçamento aprovado”).
- Erros dizem o que aconteceu e como resolver, sem desculpas. Tela vazia é convite à ação.
- A palavra **on** é sempre minúscula. Sem emoji na interface. Números no formato brasileiro (“R$ 2.015.400,00”, “+9,53%”).

## Cores

Paleta oficial de três cores, mais cinco de apoio e um azul só para interface.

- `core-pulse` **Core Pulse** #FFF1E4: o papel da marca e o `canvas` claro.
- `system-wake` **Azul System Wake** #0045BA: a cor da marca. Logo, capas, heros, uniformes. Texto `core-pulse`, branco ou `pulse-yellow` sobre ele.
- `shadow-state` **Shadow State** #0A2844: profundidade. Botão do logo negativo, shell do produto, `canvas` escuro.
- Apoio: `pulse-yellow` #FFC126 (acento de campanha: manchetes, cantoneiras, símbolo vertical), `signal-sky` #7CB9F2, `signal-red` #FF1E1F, `signal-orange` #FF8100, `signal-gray` #727679. Use como preenchimento e gráfico; para texto de status use os tokens semânticos.
- `ui-blue` #0057FF: **só em produto digital**, para toda ação interativa. Nunca em peças de marca.
- Proporção nas peças: azul domina, creme respira, Shadow aprofunda, amarelo pontua (no máximo ~10% da área).
- Superfícies: `canvas` → `surface` → `surface-raised`; `surface-muted` para cabeçalhos e trilhos. Texto `ink` e `ink-muted`; `link` para ações de texto.
- Status com `-soft` para fundo: `success`, `warning`, `danger`, `info`, `scenario`. A cor nunca anda sozinha: sempre rótulo e ícone.

## Tipografia

- **VomZom** (`display`): a fonte da logo. Moderna e impactante; as minúsculas trazem proximidade, autenticidade e um toque artesanal. Use em minúsculas para o logotipo e a palavra “on” (`logo-xl`, `logo-word`). O arquivo atual só tem A–Z/a–z: sem acentos, números ou pontuação.
- **Mulish** (`sans`, Google Fonts 400–900): a fonte primária. Modernidade e solidez corporativa, estética limpa e versátil. Faz todo o resto:
  - Campanha: `headline-xl`, `headline` em Mulish Black (900) caixa-alta; `kicker` 800.
  - Produto: `h1`/`h2` 800, `h3` 700, `body` 16/26, `body-sm`, `label` 700, `caption` 600.
  - Números `kpi` e `numeric` com `tabular-nums`.

## Logo e símbolo

- `positivo`: letras pretas, botão `system-wake`, sobre `core-pulse` ou branco.
- `negativo`: letras brancas, botão `shadow-state`, sobre `system-wake`.
- `escuro`: letras brancas, botão `system-wake`, sobre preto ou `shadow-state`.
- `mono-branco` sobre fotos; `wordmark` (“aegon” sem botão, em `core-pulse` ou `pulse-yellow`) em tamanho gigante sobre azul, sangrando a peça.
- Construção: o **g** é a alavanca. Seu miolo é o botão do interruptor e o “on” vive dentro da pílula. Respiro mínimo = altura da pílula; mínimo digital 20px de altura.
- Símbolo **on**: horizontal em pílula (`simbolo-on-azul`, `simbolo-on-claro`), tipográfico solto (`on-tipografico-azul`), vertical com o sobre n (`simbolo-on-vertical-amarelo`), ou girado em 90°/180° (“oc”, “uo”) como carimbo em cantos de fotos, golas e lombadas.
- Não recolorir fora destas versões, não distorcer, sem sombra, contorno ou gradiente.

## Grafismos

- **Cantoneiras** (`CornerFrame`, `cantoneiras-amarelo`): quatro cantos em L, braço `corner-arm`, espessura `corner-stroke`. Enquadram pessoa, manchete ou grid de fotos. Amarelo ou creme sobre escuro; `system-wake` sobre creme.
- **Pattern ON** (`pattern-on-azul`, `pattern-on-creme`): letras VomZom giradas, tom sobre tom. Em fundos de cartaz, uniformes e telas de login, sempre atrás de blocos sólidos.
- **Letras gigantes**: “on”, “aegon” ou “conexão” em VomZom muito grande, a 5–10% de opacidade, sangrando o fundo azul (capa).
- **Faixa** (slide 2): banda horizontal `pulse-yellow` atrás de três fotos P&B verticais sobre `system-wake`.
- **Arco on**: o traço do “o” desenhado como arco em `core-pulse` envolvendo uma pessoa recortada (slide 14).
- **Mosaico**: fotos com `radius-lg` em colunas desencontradas sobre azul, com o símbolo carimbado em amarelo (slide 6).
- **Xadrez**: grade de retratos intercalados com blocos `system-wake` + “on” em `core-pulse`, fechada por cantoneiras e o logo positivo (slide 7).

## Imagem

- Pessoas reais, sorrindo, em trabalho e convivência, luz natural, diversidade em cada conjunto.
- Duas leituras: **cor natural** em ambientes de trabalho (mosaicos, xadrez) e **P&B** quando a cor da peça precisa dominar (faixa amarela, campanha noturna).
- Retratos de estúdio com fundo claro neutro para grades. Sem filtros coloridos e sem gradientes sobre o rosto.

## Forma, espaço e movimento

- O botão é a marca: ações, switches, badges, abas e o símbolo usam `radius-pill`. Cartões e fotos `radius-lg`, blocos editoriais e modais `radius-xl`, campos `radius-md`.
- Espaçamento 4/8 de `space-1` a `space-8`. Peças respiram com margem `space-7`/`space-8`.
- Controles: `control-sm` 32px, `control-md` 40px, `control-lg` 48px.
- Sombra só no que flutua (`shadow-1`, `shadow-2`). Foco: 2px sólido em `focus-ring`, afastado 2px.
- Movimento curto (150–200ms), só em resposta à pessoa; ligar o switch é o gesto-assinatura. Respeite `prefers-reduced-motion`.

## Iconografia

Lucide em linha, traço 1.8px, cantos arredondados, via `Icon` (herda `currentColor`), tamanhos 16/18/20/24. Ícone acompanha texto; sozinho, só com `label`. Sem ícones preenchidos nem emoji.

## Princípios de produto

1. **Estabilidade espacial.** Shell e controles não mudam de lugar durante sincronização.
2. **Estado sempre visível.** Rascunho, aguardando, comprometido, aprovado, pago e exceção sem ambiguidade (`Badge`).
3. **Complexidade progressiva.** Síntese primeiro; evidência sob demanda.
4. **Próxima ação explícita.** Toda tela diz o que fazer agora.
5. **Contexto preservado.** Filtros, abas e seleções sobrevivem a recarregamentos.
6. **Confiança.** Histórico, autoria, confirmação e recuperação.

## Temas

- **Claro** (padrão): `canvas` Core Pulse, cartões brancos, shell Shadow State.
- **Escuro**: `canvas` Shadow State, superfícies `#0E3156`/`#133A63`, links em azul claro, foco em `pulse-yellow`.
- Texto ≥4.5:1 nos dois temas; bordas de controle e foco ≥3:1. Exceção conhecida: `ui-blue` como preenchimento sobre `surface` escuro fica 2.4:1; o botão se identifica pelo texto branco.

## Componentes

Produto: `Button`, `OnSwitch`, `Badge`, `TextField`, `Select`, `Tabs`, `Card`, `KpiCard`, `DataTable`, `ApprovalCard`, `Stepper`, `Alert`, `EmptyState`, `AppShell`. Marca e campanha: `Headline`, `CornerFrame`, `Logo`, `Icon`. Todos em `window.Aegon` (React 18).


---

# Tokens

## Cores

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `core-pulse` | `#FFF1E4` | `#FFF1E4` | Core Pulse (oficial, CMYK 0/5/11/0). O papel da marca: fundo do logo positivo, cartões de visita, cartazes, `canvas` do tema claro. Texto `shadow-state` (13.5:1) ou `system-wake` (7.4:1) sobre ele. |
| `system-wake` | `#0045BA` | `#0045BA` | Azul System Wake (oficial, CMYK 100/63/0/27). A cor da marca: logo, capas, heros, uniformes, blocos institucionais. Texto `core-pulse` (7.4:1), branco (8.2:1) ou `pulse-yellow` (5:1) sobre ele. |
| `shadow-state` | `#0A2844` | `#0A2844` | Shadow State (oficial, CMYK 85/41/0/73). Profundidade: botão do logo negativo, shell do produto, `canvas` do tema escuro. Branco 15:1, `pulse-yellow` 9.2:1 sobre ele. |
| `brand-black` | `#000000` | `#000000` | Preto do logotipo positivo e das peças de campanha noturnas. Não usar como texto de interface (use `ink`). |
| `pulse-yellow` | `#FFC126` | `#FFC126` | Amarelo de apoio: o acento de campanha (manchetes, cantoneiras, símbolo vertical). Só sobre `system-wake`, `shadow-state`, preto ou foto P&B escura; nunca sobre claro. |
| `signal-sky` | `#7CB9F2` | `#7CB9F2` | Azul céu de apoio: ilustração, gráficos e destaques sobre `shadow-state` (7.2:1). Nunca texto sobre claro. |
| `signal-red` | `#FF1E1F` | `#FF1E1F` | Vermelho de apoio: só como preenchimento de marca/gráfico. Para erro em UI use `danger`. |
| `signal-orange` | `#FF8100` | `#FF8100` | Laranja de apoio: gráficos e campanhas. Para alerta em UI use `warning`. |
| `signal-gray` | `#727679` | `#727679` | Cinza de apoio: elementos neutros de campanha e gráficos (4.1:1 no creme: não usar para texto pequeno). |
| `ui-blue` | `#0057FF` | `#0057FF` | Azul digital: toda ação interativa (botão primário, switch ON, item ativo). Branco 5.5:1. |
| `ui-blue-hover` | `#0047B5` | `#2F6BFF` | Hover/pressionado de `ui-blue`. Branco 8.2:1 (claro), 4.5:1 (escuro). |
| `canvas` | `#FFF1E4` | `#0A2844` | Fundo da página. Claro = Core Pulse; escuro = Shadow State. |
| `surface` | `#FFFFFF` | `#0E3156` | Cartões, tabelas, painéis, formulários sobre `canvas`. |
| `surface-raised` | `#FFFFFF` | `#133A63` | Modais, menus, popovers (com `shadow-2`). |
| `surface-muted` | `#F6EADC` | `#0B2C4C` | Cabeçalho de tabela, linhas zebradas, trilho de switch e abas. |
| `shell` | `#0A2844` | `#071D33` | Barra lateral do produto: Shadow State. |
| `shell-hover` | `#123556` | `#0E2A47` | Hover de item sobre `shell`. |
| `shell-line` | `#24476B` | `#1D3A5A` | Contornos finos dentro do `shell`. |
| `ink` | `#0A2844` | `#F3F6FB` | Texto principal sobre `canvas`, `surface`, `surface-muted` (≥12:1 nos dois temas). |
| `ink-muted` | `#4E5D70` | `#B8C6D6` | Texto de apoio sobre `canvas`, `surface` e `surface-muted` (≥5.3:1 claro, ≥6.6:1 escuro). |
| `ink-on-shell` | `#EAF0F7` | `#EAF0F7` | Texto de navegação sobre `shell`. |
| `ink-on-shell-muted` | `#A8C0DA` | `#A8C0DA` | Itens inativos sobre `shell` (≥8:1). |
| `on-primary` | `#FFFFFF` | `#FFFFFF` | Texto/ícone sobre `ui-blue`, `system-wake` e `danger-solid`. |
| `link` | `#0045BA` | `#8FB4FF` | Links e ações de texto sobre `canvas` e `surface` (7.4:1 claro; 6.4:1 escuro). |
| `line` | `#EAD9C6` | `#1D3E63` | Divisórias e bordas decorativas (sem significado). |
| `line-strong` | `#7C8BA3` | `#6A86A6` | Borda de controles: ≥3:1 sobre `surface` e `canvas`. |
| `focus-ring` | `#0057FF` | `#FFC126` | Anel de foco: 2px sólido, 2px de respiro. ≥3:1 em todas as superfícies. |
| `success` | `#047857` | `#34D399` | Sucesso: aprovado, pago, concluído. Texto/ícone sobre `success-soft` e `surface` (≥4.5:1). |
| `success-soft` | `#D1FAE5` | `#0B3B2E` | Fundo de badge/alerta de success; texto em `success`. |
| `warning` | `#C2410C` | `#FFB15C` | Atenção: aguardando, prazo próximo (família do `signal-orange`). Texto/ícone sobre `warning-soft` e `surface` (≥4.5:1). |
| `warning-soft` | `#FFEDD5` | `#3D2207` | Fundo de badge/alerta de warning; texto em `warning`. |
| `danger` | `#B91C1C` | `#FF7B7B` | Erro, estouro, exceção (família do `signal-red`). Texto/ícone sobre `danger-soft` e `surface` (≥4.5:1). |
| `danger-soft` | `#FEE2E2` | `#45121A` | Fundo de badge/alerta de danger; texto em `danger`. |
| `info` | `#0045BA` | `#7CB9F2` | Informativo, comprometido, em uso (família do `system-wake`/`signal-sky`). Texto/ícone sobre `info-soft` e `surface` (≥4.5:1). |
| `info-soft` | `#E3ECFB` | `#0C2E55` | Fundo de badge/alerta de info; texto em `info`. |
| `scenario` | `#5B4BC4` | `#B4A9F5` | Cenário, simulação, versão não vigente. Texto/ícone sobre `scenario-soft` e `surface` (≥4.5:1). |
| `scenario-soft` | `#ECE9FB` | `#262052` | Fundo de badge/alerta de scenario; texto em `scenario`. |
| `neutral-soft` | `#F0E3D3` | `#16385C` | Fundo de badge neutro (rascunho); texto em `ink-muted`. |
| `danger-solid` | `#D91A1B` | `#D91A1B` | Preenchimento do botão destrutivo; texto `on-primary` (5.1:1). |
| `data-1` | `#0045BA` | `#7CB9F2` | Gráficos: Série 1. Sempre com legenda textual. |
| `data-2` | `#FFC126` | `#FFC126` | Gráficos: Série 2. Sempre com legenda textual. |
| `data-3` | `#7CB9F2` | `#0057FF` | Gráficos: Série 3. Sempre com legenda textual. |
| `data-4` | `#FF8100` | `#FF8100` | Gráficos: Série 4. Sempre com legenda textual. |
| `data-5` | `#727679` | `#B8C6D6` | Gráficos: Série 5 / referência. Sempre com legenda textual. |

## Tipografia

Famílias: `display` = VomZom, Mulish, system-ui, sans-serif · `sans` = Mulish, system-ui, -apple-system, "Segoe UI", sans-serif

| Estilo | Família | Tamanho / altura | Peso | Uso |
|---|---|---|---|---|
| `logo-xl` | display | 120px / 0.9 | 400 | Logotipo tipográfico gigante (slides 2 e 13). Minúsculas, sem acento. |
| `logo-word` | display | 56px / 1 | 400 | Palavra-símbolo “on”. Este arquivo VomZom tem só A–Z/a–z. |
| `headline-xl` | sans | 96px / 0.92 | 900 | Manchete de campanha em caixa-alta, Mulish Black. Em `pulse-yellow` ou `core-pulse` sobre azul, Shadow ou foto P&B. |
| `headline` | sans | 56px / 1 | 900 | Título de slide/seção institucional em caixa-alta. |
| `kicker` | sans | 22px / 28px | 800 | Frase de apoio acima da manchete. |
| `h1` | sans | 32px / 40px | 800 | Título de página. Um por tela, sentence case. |
| `h2` | sans | 24px / 32px | 800 | Seção ou painel. |
| `h3` | sans | 18px / 26px | 700 | Cartão, modal, grupo. |
| `body` | sans | 16px / 26px | 400 | Texto corrido. |
| `body-sm` | sans | 14px / 22px | 400 | Tabelas, ajuda de campo. |
| `label` | sans | 14px / 18px | 700 | Rótulos, botões, abas. |
| `caption` | sans | 12px / 16px | 600 | Badges, legendas. |
| `kpi` | sans | 32px / 36px | 800 | Indicadores, tabular-nums. |
| `numeric` | sans | 15px / 24px | 700 | Valores em tabelas, à direita, tabular-nums. |

## Espaçamento

| Token | Valor | Uso |
|---|---|---|
| `space-1` | `4px` | Ícone↔texto. |
| `space-2` | `8px` | Entre controles relacionados. |
| `space-3` | `12px` | Padding de badge/célula. |
| `space-4` | `16px` | Padding de cartão e campos. |
| `space-5` | `24px` | Entre cartões; padding de painel. |
| `space-6` | `32px` | Entre seções. |
| `space-7` | `48px` | Margem de página / peça. |
| `space-8` | `64px` | Respiro de hero e capas. |

## Raios

| Token | Valor | Uso |
|---|---|---|
| `radius-sm` | `6px` | Checkbox, tags. |
| `radius-md` | `10px` | Inputs, selects, menus. |
| `radius-lg` | `16px` | Cartões, KPIs, tabelas, fotos em mosaico (slide 6). |
| `radius-xl` | `24px` | Modais, cartões de fonte (slide 8), blocos editoriais. |
| `radius-pill` | `999px` | O botão: botões, switch ON, badges, abas, símbolo ON. |

## Tamanhos

| Token | Valor | Uso |
|---|---|---|
| `control-sm` | `32px` | Controle compacto (tabelas). |
| `control-md` | `40px` | Botão/input padrão. |
| `control-lg` | `48px` | CTA principal, mobile. |
| `shell-width` | `248px` | Barra lateral. |
| `topbar-height` | `64px` | Barra superior. |
| `corner-arm` | `56px` | Braço da cantoneira em peças 1080px; escala com a peça (≈5% do lado). |
| `corner-stroke` | `14px` | Espessura da cantoneira (1/4 do braço). |

## Sombras

| Token | Valor | Uso |
|---|---|---|
| `shadow-1` | `light: 0 1px 2px rgba(10,40,68,0.08) / dark: 0 1px 2px rgba(0,0,0,0.5)` | Cartões. |
| `shadow-2` | `light: 0 12px 32px rgba(10,40,68,0.16), 0 2px 6px rgba(10,40,68,0.08) / dark: 0 16px 40px rgba(0,0,0,0.6)` | Modais, menus. |

## CSS (copiar e colar)

```css
@import url("https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800;900&display=swap");
@font-face { font-family: "VomZom"; src: url("fonts/VomZom-Regular.woff2") format("woff2"); font-weight: 400; }
:root, [data-theme="light"] {
  --core-pulse: #FFF1E4;
  --system-wake: #0045BA;
  --shadow-state: #0A2844;
  --brand-black: #000000;
  --pulse-yellow: #FFC126;
  --signal-sky: #7CB9F2;
  --signal-red: #FF1E1F;
  --signal-orange: #FF8100;
  --signal-gray: #727679;
  --ui-blue: #0057FF;
  --ui-blue-hover: #0047B5;
  --canvas: #FFF1E4;
  --surface: #FFFFFF;
  --surface-raised: #FFFFFF;
  --surface-muted: #F6EADC;
  --shell: #0A2844;
  --shell-hover: #123556;
  --shell-line: #24476B;
  --ink: #0A2844;
  --ink-muted: #4E5D70;
  --ink-on-shell: #EAF0F7;
  --ink-on-shell-muted: #A8C0DA;
  --on-primary: #FFFFFF;
  --link: #0045BA;
  --line: #EAD9C6;
  --line-strong: #7C8BA3;
  --focus-ring: #0057FF;
  --success: #047857;
  --success-soft: #D1FAE5;
  --warning: #C2410C;
  --warning-soft: #FFEDD5;
  --danger: #B91C1C;
  --danger-soft: #FEE2E2;
  --info: #0045BA;
  --info-soft: #E3ECFB;
  --scenario: #5B4BC4;
  --scenario-soft: #ECE9FB;
  --neutral-soft: #F0E3D3;
  --danger-solid: #D91A1B;
  --data-1: #0045BA;
  --data-2: #FFC126;
  --data-3: #7CB9F2;
  --data-4: #FF8100;
  --data-5: #727679;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 999px;
  --control-sm: 32px;
  --control-md: 40px;
  --control-lg: 48px;
  --shell-width: 248px;
  --topbar-height: 64px;
  --corner-arm: 56px;
  --corner-stroke: 14px;
  --font-display: VomZom, Mulish, system-ui, sans-serif;
  --font-sans: Mulish, system-ui, -apple-system, "Segoe UI", sans-serif;
}
[data-theme="dark"] {
  --ui-blue-hover: #2F6BFF;
  --canvas: #0A2844;
  --surface: #0E3156;
  --surface-raised: #133A63;
  --surface-muted: #0B2C4C;
  --shell: #071D33;
  --shell-hover: #0E2A47;
  --shell-line: #1D3A5A;
  --ink: #F3F6FB;
  --ink-muted: #B8C6D6;
  --link: #8FB4FF;
  --line: #1D3E63;
  --line-strong: #6A86A6;
  --focus-ring: #FFC126;
  --success: #34D399;
  --success-soft: #0B3B2E;
  --warning: #FFB15C;
  --warning-soft: #3D2207;
  --danger: #FF7B7B;
  --danger-soft: #45121A;
  --info: #7CB9F2;
  --info-soft: #0C2E55;
  --scenario: #B4A9F5;
  --scenario-soft: #262052;
  --neutral-soft: #16385C;
  --data-1: #7CB9F2;
  --data-3: #0057FF;
  --data-5: #B8C6D6;
}
```

---

# Componentes

Todos em `window.Aegon` (React 18), estilos em `components/bundle.css`, tipos em `components/index.d.ts`.

## Button

Botão em pílula: a forma que a marca promete em “Tudo se resolve no mesmo botão”. Toda ação clicável que não é link é um `Button`.

**Variantes.** `primary` (`ui-blue`): no máximo uma por área de foco, para a ação que a tela existe para fazer. `secondary`: ações alternativas (Exportar, Devolver). `ghost`: ações de baixa ênfase dentro de cartões e linhas. `danger` (`danger-solid`): só para ações destrutivas ou de reprovação, sempre com confirmação.

**Tamanhos.** `sm` 32px em tabelas e cartões densos; `md` 40px padrão; `lg` 48px para o CTA principal e mobile.

**Props.** `variant`, `size`, `icon` / `iconRight` (nome de ícone Lucide do sistema), `loading`, `disabled`, mais qualquer atributo de `<button>`. O texto vem em `children`.

**Texto.** Verbo no infinitivo + objeto, em sentence case: “Aprovar orçamento”, “Registrar despesa”. O mesmo verbo segue no toast e no estado seguinte (Aprovar → “Aprovado”). Nunca “Clique aqui”, “OK” ou “Enviar” genérico.

**Não fazer.** Botões quadrados ou com `radius-md`; dois primários lado a lado; ícone sem texto sem `aria-label`.

## OnSwitch

Interruptor liga/desliga desenhado a partir do símbolo ON: trilho em pílula, botão circular e a palavra “on” em VomZom quando ligado. É o componente-assinatura da marca dentro do produto.

**Use para** configurações que têm efeito imediato (habilitar módulo, alçada automática, notificações). Para escolhas que só valem ao salvar um formulário, use checkbox ou select.

**Props.** `checked` + `onChange(next)` (controlado) ou `defaultChecked`; `label` (sempre visível, descreve o que fica ligado); `disabled`.

**Regras.** Ligado = `ui-blue` com botão `on-primary`; desligado = `surface-muted` com botão `line-strong`. O rótulo diz a coisa, não o estado (“Alçada automática”, não “Ativar alçada”). O switch expõe `role="switch"` e `aria-checked`.

## Badge

Selo curto de estado. Os estados do ciclo financeiro têm cor, ícone e rótulo fixos, para que ninguém confunda rascunho com aprovado.

**Props.** `status` (`draft`, `pending`, `committed`, `approved`, `paid`, `exception`, `scenario`, `cancelled`) aplica tom e rótulo padrão; ou `tone` (`neutral`, `success`, `warning`, `danger`, `info`, `scenario`) com texto em `children`. `icon` troca o ícone; `icon={false}` usa um ponto.

**Regras.** A cor nunca carrega o significado sozinha: o rótulo e o ícone acompanham sempre. Uma ou duas palavras. Não use badge como botão nem como decoração.

## TextField

Campo de texto com rótulo, ajuda e erro. Rótulo sempre acima e visível; o placeholder só dá um exemplo.

**Props.** `label`, `hint`, `error` (substitui a ajuda e marca `aria-invalid`), `prefix` / `suffix` (ex.: “R$”, “%”), `required`, e atributos de `<input>`.

**Regras.** Mostre o mínimo para começar e peça o resto depois (preenchimento progressivo). Valores monetários: `prefix="R$"`, `inputMode="decimal"`, formato brasileiro. Mensagem de erro diz o que aconteceu e como resolver, sem pedir desculpas.

## Select

Lista de opções nativa com o visual dos campos Aegon. Mesmo rótulo, ajuda e erro do `TextField`.

**Props.** `label`, `options` (strings ou `{value,label}`), `placeholder`, `hint`, `error`, `value`/`onChange` ou `defaultValue`.

**Use** até cerca de 15 opções conhecidas. Para listas longas ou busca (fornecedores, rubricas), use um campo com busca.

## Tabs

Alterna visões de um mesmo contexto sem sair da página. Segmentado em pílula, coerente com o botão.

**Props.** `items` (`{value,label,count?}`), `value` + `onChange` ou `defaultValue`.

**Regras.** De duas a cinco abas, rótulos de uma ou duas palavras. `count` só quando há algo a fazer (pendências). A aba ativa e os filtros devem sobreviver a recarregamentos: contexto preservado.

## Card

Contêiner de conteúdo sobre `canvas`: `surface`, borda `line`, `radius-lg`, `shadow-1`.

**Props.** `title`, `subtitle`, `actions` (botões `sm`), `children`.

**Regras.** Um cartão = um assunto. Não aninhe cartões; dentro de um cartão use divisórias `line`. Não pinte cartões com cor de status nem use borda lateral colorida.

## KpiCard

Indicador com rótulo, valor grande, variação e progresso opcional. Números em Montserrat com `tabular-nums`.

**Props.** `label`, `value` (já formatado, ex.: “R$ 2.015.400”), `delta`, `tone` da variação (`neutral`, `success`, `warning`, `danger`, `info`), `hint`, `progress` (0–100).

**Regras.** Cada KPI responde uma pergunta de negócio e leva a uma ação; sem indicadores de enfeite. Três a quatro por linha. A variação vem com sinal e unidade (“+9,53%”).

## DataTable

Tabela densa para leitura de valores. Cabeçalho em `surface-muted`, linhas separadas por `line`, números alinhados à direita em `tabular-nums`.

**Props.** `columns` (`{key,label,align?:"right",render?(row)}`), `rows` (objetos; `id` vira a key), `caption`.

**Regras.** Coluna de identificação à esquerda com título + código em `ag-cell-sub`. Estado sempre por `Badge`. A ação da linha é um `Button` `ghost` `sm` com o próximo passo (“Decidir”, “Justificar”). Em telas estreitas a tabela rola dentro do próprio contêiner.

## ApprovalCard

Item da fila de decisões: responde “o que depende de mim agora?” com contexto suficiente para decidir.

**Props.** `kind` (tipo + número), `title`, `impact` (valor formatado), `attachment` (nome da evidência), `sla`, e os callbacks `onApprove`, `onReturn`, `onContext`.

**Regras.** Ordene a fila por urgência (SLA) e impacto. Toda decisão registra ator, motivo e horário; “Devolver” e “Reprovar” pedem motivo. Nenhuma decisão crítica fora do sistema.

## Stepper

Mostra onde o item está no ciclo Planejar → Aprovar → Executar → Comprovar → Monitorar → Revisar.

**Props.** `steps` (padrão: o ciclo acima), `current` (índice a partir de 0).

**Regras.** Etapas concluídas em `ui-blue` com check; a atual com anel; as futuras neutras. Use no topo de fluxos e fichas para dar sensação de avanço, não para navegação livre.

## Alert

Mensagem em linha sobre o estado de uma tela ou item. **Adição intencional:** não estava nos materiais de origem, mas os estados Exceção e Aguardando precisam de uma forma de aviso fora da tabela.

**Props.** `tone` (`info`, `success`, `warning`, `danger`, `scenario`), `title`, `children`, `action` (um `Button` `sm`).

**Regras.** Título diz o fato; corpo diz o número ou a causa; ação diz o próximo passo. `danger` usa `role="alert"`; os demais `role="status"`.

## EmptyState

Tela vazia como convite à ação, com o pattern ON e o símbolo da marca.

**Props.** `title`, `description`, `action` (um `Button` primário), `pattern` (`creme` padrão, ou `azul`).

**Regras.** O título diz o que não há; a descrição diz o que fazer e o que acontece depois. Sem ilustrações de terceiros nem tom de desculpa.

## AppShell

Estrutura de produto Aegon (versão Hybrid): barra lateral fixa em `shell` com o logo para fundo escuro, barra superior em `surface` e área de trabalho em `canvas`.

**Props.** `nav` (grupos `{label, items:[{value,label,icon,badge?}]}`), `active`, `onNavigate(value)`, `product` (tag curta ao lado do logo), `eyebrow`, `title`, `actions`, `children`.

**Regras.** Agrupe a navegação pelo que a pessoa quer fazer (Planejar, Executar, Decidir, Analisar, Administrar), não por nome técnico de módulo. O shell não se move: sincronização e carregamento nunca deslocam controles. Abaixo de 720px a lateral some e o produto deve oferecer um menu.

## Headline

Manchete de campanha: frase de apoio curta + palavra de impacto em Mulish Black caixa-alta, como “Menos esforço. Mais direção. MAIS CRESCIMENTO.”.

**Props.** `children` (a manchete, escrita normalmente; o componente põe em caixa-alta), `kicker` (frase acima), `sub` (linha abaixo), `tone` (`yellow` padrão, `cream`, `blue` para fundo `system-wake`).

**Regras.** Uma manchete por peça, de uma a três palavras, terminando em ponto. `pulse-yellow` só sobre `shadow-state`, `system-wake`, preto ou foto P&B escurecida. Em produto, use só em telas de boas-vindas e marketing, nunca em fluxos de trabalho.

## CornerFrame

Cantoneiras: quatro cantos em L que enquadram o que importa, como um visor de câmera. Grafismo recorrente da marca (slides 2, 4, 5, 7 e 10).

**Props.** `children` (o conteúdo enquadrado), `tone` (`yellow` padrão, `blue`, `cream`), `style`.

**Regras.** Braço `corner-arm`, espessura `corner-stroke` (1/4 do braço). Amarelo sobre escuro ou foto P&B; `system-wake` sobre `core-pulse`. Use para enquadrar uma pessoa, uma manchete ou um grid de fotos, uma vez por peça.

## Logo

O logotipo aegon como componente: escolhe a versão certa para o fundo.

**Props.** `variant`: `positivo` (preto + `system-wake`, sobre `core-pulse` ou branco), `negativo` (branco + `shadow-state`, sobre `system-wake`: slides 1 e 11), `escuro` (branco + `system-wake`, sobre preto ou `shadow-state`: slide 8), `mono-branco` (sobre fotos), `wordmark` (só “aegon” em `core-pulse`, sem botão, para peças gigantes sobre azul: slides 2 e 13). `height` em px (mínimo 20px).

**Regras.** Respiro mínimo = altura do botão “on”. Não recolorir fora destas versões, não separar o “on” do “aeg”, sem sombra ou contorno.

## Icon

Ícones de linha Lucide (licença ISC) com traço 1.8px, cantos arredondados, herdando `currentColor`.

**Props.** `name` (veja `Aegon.ICON_NAMES`), `size` (16, 18, 20 ou 24), `strokeWidth`, `label` (torna o ícone acessível quando sozinho).

**Regras.** Ícone acompanha texto; sozinho, só com `label`/`aria-label`. Um estilo só: nada de ícones preenchidos ou emoji na interface.


---

# Assets

## Logos

Vetorizados da identidade original; símbolos montados com as letras da fonte VomZom.

- `aegon-logo-positivo.svg`: letras pretas, botão `system-wake`. Sobre `core-pulse` ou branco.
- `aegon-logo-negativo.svg`: letras brancas, botão `shadow-state`. Sobre `system-wake`.
- `aegon-logo-escuro.svg`: letras brancas, botão `system-wake`. Sobre preto ou `shadow-state`.
- `aegon-logo-mono-branco.svg`: tudo branco. Sobre fotos.
- `aegon-wordmark-creme.svg`: “aegon” sem botão, em `core-pulse`. Gigante sobre azul.
- `simbolo-on-azul.svg`: pílula `system-wake`, “on” branco. Avatar, favicon, ícone de app.
- `simbolo-on-claro.svg`: pílula `core-pulse`, “on” `system-wake`. Sobre azul.
- `on-tipografico-azul.svg`: “on” solto em `system-wake`. Cartazes e cartões sobre creme.
- `simbolo-on-vertical-amarelo.svg`: o sobre n em `pulse-yellow`. Carimbo em cantos de foto.

## Grafismos

- `cantoneiras-amarelo.svg`: moldura de quatro cantos em `pulse-yellow` (480×300; braço 56, traço 14). Estique a moldura, nunca o traço; em código use `CornerFrame`.

## Pattern

Pattern ON: as letras da marca em VomZom, giradas em 0/90/180/270°, em tom sobre tom. Ladrilho de 480px que repete sem emenda.

- `pattern-on-azul.svg`: sobre `brand-blue`. Heros, login, capas.
- `pattern-on-creme.svg`: sobre `brand-cream`. Estados vazios, áreas editoriais.

Nunca coloque texto de leitura sobre o pattern sem um bloco sólido por trás.

## Icons

- `aegon-icones-lucide.svg`: prancha com os 30 ícones Lucide (ISC) incluídos no componente `Icon`. Traço 1.8px, tinta `ink`. Em código use `Aegon.Icon`, que herda `currentColor`.

## Referências

- `aegon-identidade-visual-referencias.jpg`: os 16 slides da Identidade Visual (capa, campanhas, manifesto “Conheça a Aegon”, tipografia, paleta, papelaria, uniforme, cartazes, brindes). Fonte da verdade visual.
- `aegon-apresentacao-marca.jpg`: os 10 slides da “Apresentação pra os rapazes”.


---

# Camada de produto —: AEGON OPEX

O OPEX transforma planejamento financeiro em decisão rastreável. Ele estende o Core com o ciclo financeiro e os módulos abaixo; cores, tipografia e componentes continuam sendo os do Core.

## Ciclo

**Planejar → Aprovar → Executar → Comprovar → Monitorar → Revisar.** Mostre a etapa com `Stepper` no topo de fluxos e fichas. Cada etapa gera um evento de auditoria com ator, regra aplicada e horário.

## Estados do lançamento

| Estado | `Badge status` | Tom | Quando |
| --- | --- | --- | --- |
| Rascunho | `draft` | neutral | Criado, sem efeito no saldo |
| Aguardando alçada | `pending` | warning | Encaminhado, depende de aprovador |
| Comprometido | `committed` | info | Aprovado, reserva saldo |
| Aprovado | `approved` | success | Decisão registrada |
| Pago | `paid` | success | Pago e comprovado com evidência |
| Exceção | `exception` | danger | Estouro, glosa ou divergência; pede justificativa |
| Cenário | `scenario` | scenario | Simulação ou versão não vigente |
| Cancelado | `cancelled` | neutral | Encerrado sem efeito |

## Navegação

Agrupe por intenção no `AppShell`: **Planejar** (Orçamento, Planejamento, Cenários), **Executar** (Despesas, Compras, Estoque, Ativos), **Decidir** (Aprovações, Pendências, Exceções), **Analisar** (Relatórios, Comparativos, Exportações), **Administrar** (Pessoas, Permissões, Cadastros, Configurações). Módulos não contratados não aparecem.

## Papéis

Direção vê síntese, cenários e riscos (`KpiCard`). Gestor planeja e justifica (`DataTable`, `TextField`). Financeiro confere documento e competência. Aprovador decide com contexto (`ApprovalCard`). Operação solicita e movimenta. Administrador configura, fora do fluxo diário.

## Padrões de tela

- **Orçamento:** linha de `KpiCard` (base, proposta, comprometido) + `DataTable` de rubricas com estado e próxima ação.
- **Registrar despesa:** poucos campos iniciais (fornecedor, valor, data, documento, rubrica, evidência); “Salvar rascunho” secundário e “Encaminhar” primário.
- **Fila de decisões:** `ApprovalCard` ordenados por SLA e impacto; título da página responde “o que depende de mim agora?”.
- **Exceções:** `Alert` `danger` com o desvio em número e o botão “Justificar”.
