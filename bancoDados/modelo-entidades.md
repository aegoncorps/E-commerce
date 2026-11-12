# Modelo de entidades e relacionamentos

Os diagramas são **lógicos**, não representam um SQL executável. `loja_id` é obrigatório nas tabelas da loja, exceto na entrada interna de eventos de gateway ainda não conciliados; a tabela `usuario` é global para permitir uma conta operar em mais de uma loja. Endereços de pedido são cópias históricas, não dependem do cadastro atual do cliente.

## 1. Lojas, identidade e clientes

```mermaid
erDiagram
    LOJA ||--o{ USUARIO_LOJA : possui
    USUARIO ||--o{ USUARIO_LOJA : participa
    LOJA ||--o{ PESSOA : cadastra
    USUARIO o|--o{ PESSOA : vincula
    PESSOA ||--o{ CONTATO : possui
    PESSOA ||--o{ ENDERECO : possui
    LOJA ||--o{ DOMINIO_LOJA : publica
    LOJA ||--o{ CONFIGURACAO_LOJA : configura
    LOJA {
        uuid id PK
        string nome
        string slug UK
        string status
    }
    DOMINIO_LOJA {
        uuid id PK
        uuid loja_id FK
        string dominio UK
        string status
    }
    USUARIO {
        uuid id PK
        string auth_subject UK
        string status
    }
    USUARIO_LOJA {
        uuid loja_id FK
        uuid usuario_id FK
        string papel
        string status
    }
    PESSOA {
        uuid id PK
        uuid loja_id FK
        uuid usuario_id FK "opcional"
        string nome
        string documento "opcional"
    }
    CONTATO {
        uuid id PK
        uuid loja_id FK
        uuid pessoa_id FK
        string tipo
        string valor
    }
    ENDERECO {
        uuid id PK
        uuid loja_id FK
        uuid pessoa_id FK
        string cep
        string logradouro
        string numero
        string complemento
        string bairro
        string cidade
        string uf
    }
    CONFIGURACAO_LOJA {
        uuid id PK
        uuid loja_id FK
        string chave
        string valor
    }
```

| Entidade | Finalidade e regras principais | Etapa |
| --- | --- | --- |
| `loja` | Empresa/tenant; a primeira linha será Aegon. `slug` é único. | MVP |
| `usuario` | Identidade autenticada; `auth_subject` referencia o provedor de identidade, sem guardar senha própria. | MVP |
| `usuario_loja` | Vínculo e autorização por loja: `owner`, `admin`, `operador` ou `cliente`. Único por `(loja_id, usuario_id)`. Clientes visitantes não precisam ter vínculo. | MVP |
| `pessoa` | Cadastro de uma pessoa em uma loja, opcionalmente vinculado a usuário. Uma pessoa sem usuário permite compra como visitante. Um usuário pode ter perfil em várias lojas. | MVP |
| `contato` | E-mail ou telefone da pessoa, com tipo e indicação de principal. A compra guarda cópia do contato no pedido. | MVP |
| `endereco` | Endereços reutilizáveis da pessoa. CEP pode ser ausente enquanto a política de entrega não exigir um válido; não simular cálculo de frete real sem essa informação. | MVP |
| `dominio_loja` | Mapeamento de domínio/subdomínio verificado para loja. | SaaS |
| `configuracao_loja` | Chaves permitidas de apresentação ou comportamento, sem segredos do gateway. Única por `(loja_id, chave)`. | MVP |

## 2. Catálogo, categorias e campanhas

```mermaid
erDiagram
    LOJA ||--o{ PRODUTO : possui
    LOJA ||--o{ CATEGORIA : possui
    PRODUTO ||--o{ PRODUTO_VARIANTE : possui
    PRODUTO ||--o{ PRODUTO_IMAGEM : ilustra
    PRODUTO ||--o{ PRODUTO_CATEGORIA : classificado
    CATEGORIA ||--o{ PRODUTO_CATEGORIA : agrupa
    PRODUTO ||--o{ PRODUTO_TAG : identifica
    TAG ||--o{ PRODUTO_TAG : agrupa
    LOJA ||--o{ CAMPANHA : promove
    CAMPANHA ||--o{ CAMPANHA_PRODUTO : inclui
    PRODUTO ||--o{ CAMPANHA_PRODUTO : promovido
    PRODUTO {
        uuid id PK
        uuid loja_id FK
        string nome
        string slug
        string descricao
        string status
        bigint preco_base_centavos
    }
    PRODUTO_VARIANTE {
        uuid id PK
        uuid loja_id FK
        uuid produto_id FK
        string sku
        string tamanho
        string cor
        bigint preco_centavos "opcional"
        int estoque_disponivel
        string status
    }
    PRODUTO_IMAGEM {
        uuid id PK
        uuid loja_id FK
        uuid produto_id FK
        string arquivo_chave
        string texto_alternativo
        int ordem
    }
    CATEGORIA {
        uuid id PK
        uuid loja_id FK
        string nome
        string slug
    }
    PRODUTO_CATEGORIA {
        uuid loja_id FK
        uuid produto_id FK
        uuid categoria_id FK
    }
    TAG {
        uuid id PK
        uuid loja_id FK
        string nome
    }
    PRODUTO_TAG {
        uuid loja_id FK
        uuid produto_id FK
        uuid tag_id FK
    }
    CAMPANHA {
        uuid id PK
        uuid loja_id FK
        string nome
        string status
        datetime inicio_em
        datetime fim_em
    }
    CAMPANHA_PRODUTO {
        uuid loja_id FK
        uuid campanha_id FK
        uuid produto_id FK
    }
```

| Entidade | Finalidade e regras principais | Etapa |
| --- | --- | --- |
| `produto` | Descrição, preço base, status e publicação. `slug` único por loja; produto com vendas é arquivado, não apagado fisicamente. | MVP |
| `produto_variante` | SKU, tamanho/cor, preço opcional e estoque. Produto sem tamanho também possui uma variante padrão. SKU único por loja. | MVP |
| `produto_imagem` | Chave do arquivo em storage e ordem; arquivos ficam fora do banco, não em base64. | MVP |
| `categoria` / `produto_categoria` | Várias categorias por produto. Associação única por loja, produto e categoria. | MVP |
| `tag` / `produto_tag` | Etiquetas e filtros; associação única por loja, produto e tag. | MVP |
| `campanha` / `campanha_produto` | Divulgação, datas e associação com produtos. Não altera preço por si só. | Posterior |
| Lançamento | Na primeira versão, tratar como campanha do tipo lançamento ou datas de publicação do produto; criar entidade específica somente se houver regras próprias. | Posterior |

## 3. Carrinho, pedidos, pagamento e envio

```mermaid
erDiagram
    LOJA ||--o{ CARRINHO : possui
    PESSOA o|--o{ CARRINHO : utiliza
    CARRINHO ||--o{ CARRINHO_ITEM : contem
    PRODUTO_VARIANTE ||--o{ CARRINHO_ITEM : selecionada
    PESSOA o|--o{ PEDIDO : realiza
    LOJA ||--o{ PEDIDO : recebe
    PEDIDO ||--|{ PEDIDO_ITEM : contem
    PEDIDO ||--|| PEDIDO_ENDERECO : entrega
    PEDIDO ||--o{ PAGAMENTO : tentativas
    PAGAMENTO o|--o{ EVENTO_GATEWAY : recebe
    PEDIDO ||--o{ ENVIO : acompanha
    PEDIDO ||--o{ RESERVA_ESTOQUE : reserva
    PRODUTO_VARIANTE ||--o{ RESERVA_ESTOQUE : reservada
    CARRINHO {
        uuid id PK
        uuid loja_id FK
        uuid pessoa_id FK "opcional"
        string token_visitante_hash "opcional"
        string status
        datetime expira_em
    }
    CARRINHO_ITEM {
        uuid id PK
        uuid loja_id FK
        uuid carrinho_id FK
        uuid variante_id FK
        int quantidade
    }
    PEDIDO {
        uuid id PK
        uuid loja_id FK
        uuid pessoa_id FK "opcional"
        string numero
        string status
        string nome_cliente
        string email_cliente
        string telefone_cliente
        bigint subtotal_centavos
        bigint desconto_centavos
        bigint frete_centavos
        bigint total_centavos
        string moeda
    }
    PEDIDO_ITEM {
        uuid id PK
        uuid loja_id FK
        uuid pedido_id FK
        uuid variante_id FK "opcional"
        string nome_snapshot
        string sku_snapshot
        string variante_snapshot
        int quantidade
        bigint preco_unitario_centavos
        bigint desconto_centavos
    }
    PEDIDO_ENDERECO {
        uuid id PK
        uuid loja_id FK
        uuid pedido_id FK
        string destinatario
        string cep
        string logradouro
        string numero
        string complemento
        string bairro
        string cidade
        string uf
    }
    PAGAMENTO {
        uuid id PK
        uuid loja_id FK
        uuid pedido_id FK
        string provedor
        string referencia_externa
        string metodo
        string status
        bigint valor_centavos
        string chave_idempotencia
    }
    EVENTO_GATEWAY {
        uuid id PK
        uuid loja_id FK "opcional ate conciliacao"
        uuid pagamento_id FK "opcional ate conciliacao"
        string provedor
        string evento_externo_id
        string status_processamento
    }
    ENVIO {
        uuid id PK
        uuid loja_id FK
        uuid pedido_id FK
        string modalidade
        string status
        string codigo_rastreio
        string transportadora
    }
    RESERVA_ESTOQUE {
        uuid id PK
        uuid loja_id FK
        uuid pedido_id FK
        uuid variante_id FK
        int quantidade
        string status
        datetime expira_em
    }
```

| Entidade | Finalidade e regras principais | Etapa |
| --- | --- | --- |
| `carrinho` / `carrinho_item` | Carrinho de visitante por token aleatório armazenado como hash ou da pessoa autenticada. Token é credencial de acesso, nunca apenas ID público. Item único por carrinho e variante. | MVP |
| `pedido` / `pedido_item` / `pedido_endereco` | Compra, itens e endereço em snapshots históricos. Número único por loja. Valores são calculados no servidor em transação. | MVP |
| `pagamento` | Uma tentativa de Pix ou cartão por registro; aceita várias tentativas para um pedido. Nenhum dado sensível de cartão. | MVP com gateway |
| `evento_gateway` | Deduplicação e auditoria de webhooks; ID externo único por provedor/conta. O evento pode chegar antes do vínculo: guardar referência externa e permitir pagamento/loja nulos até conciliação segura. | MVP com gateway |
| `envio` | Modalidade e rastreio; admite vários envios por pedido para divisão futura. Status de pagamento é separado do envio. | MVP básico |
| `reserva_estoque` | Reserva por pedido/variante com expiração; cria, confirma e libera em transação. | MVP com gateway |

## 4. Descontos e engajamento

```mermaid
erDiagram
    LOJA ||--o{ CUPOM : possui
    CUPOM ||--o{ CUPOM_PRODUTO : restringe
    PRODUTO ||--o{ CUPOM_PRODUTO : elegivel
    CUPOM ||--o{ CUPOM_USO : registra
    PEDIDO ||--o{ CUPOM_USO : utiliza
    PESSOA ||--o{ LIKE_PRODUTO : favorita
    PRODUTO ||--o{ LIKE_PRODUTO : recebe
    PESSOA ||--o{ COMENTARIO : escreve
    PRODUTO ||--o{ COMENTARIO : recebe
    LOJA ||--o{ SESSAO_VISITA : recebe
    SESSAO_VISITA ||--o{ EVENTO_NAVEGACAO : registra
    CUPOM {
        uuid id PK
        uuid loja_id FK
        string codigo
        string tipo
        bigint valor
        bigint minimo_centavos
        int limite_usos
        datetime inicio_em
        datetime fim_em
        bool ativo
    }
    CUPOM_PRODUTO {
        uuid loja_id FK
        uuid cupom_id FK
        uuid produto_id FK
    }
    CUPOM_USO {
        uuid id PK
        uuid loja_id FK
        uuid cupom_id FK
        uuid pedido_id FK
        string status
        bigint desconto_centavos
    }
    LIKE_PRODUTO {
        uuid loja_id FK
        uuid pessoa_id FK
        uuid produto_id FK
        datetime criado_em
    }
    COMENTARIO {
        uuid id PK
        uuid loja_id FK
        uuid pessoa_id FK
        uuid produto_id FK
        int nota
        string texto
        string status
    }
    SESSAO_VISITA {
        uuid id PK
        uuid loja_id FK
        uuid pessoa_id FK "opcional"
        datetime iniciado_em
    }
    EVENTO_NAVEGACAO {
        uuid id PK
        uuid loja_id FK
        uuid sessao_id FK
        uuid produto_id FK "opcional"
        string tipo
        string pagina
        datetime ocorrido_em
    }
```

| Entidade | Finalidade e regras principais | Etapa |
| --- | --- | --- |
| `cupom` | Código único por loja, tipo `percentual`, `fixo` ou `frete`; valor percentual em pontos-base (10000 = 100%), os demais em centavos. Limites/datas validados no servidor. | MVP se cupom fizer parte do primeiro checkout |
| `cupom_produto` | Associa produtos elegíveis; ausência de linhas significa aplicação geral sujeita às outras regras. | MVP com cupom |
| `cupom_uso` | Reserva, confirmação e cancelamento de uso por pedido, para impedir que tentativas concorrentes ultrapassem o limite. | MVP com cupom |
| `like_produto` | Favorito único por loja, pessoa e produto. Visitantes mantêm favorito local até eventual sincronização. | Posterior |
| `comentario` | Avaliação autenticada e moderada; definir se exige compra verificada. | Posterior |
| `sessao_visita` / `evento_navegacao` | Visualização, clique, hover e etapas de funil. Eventos de pagamento confirmado são originados no backend. Agregar e limitar retenção. | Posterior |

## Índices e restrições iniciais

- Índices compostos para acesso por loja: produtos `(loja_id, status, created_at)`, pedidos `(loja_id, created_at)`, e eventos `(loja_id, ocorrido_em)`.
- Unicidade por loja: `produto.slug`, `categoria.slug`, `produto_variante.sku`, `pedido.numero` e código normalizado de `cupom`.
- `quantidade > 0`, preços/estoque/descontos não negativos, totais consistentes e UF em lista válida. Uma única linha de endereço de entrega por pedido.
- Registro de webhook único pelo identificador do provedor e da conta de integração; chave de idempotência única no escopo da loja e operação.
- Adicionar índices nas FKs e testar planos de consulta com dados reais; os índices propostos são ponto de partida, não garantia de desempenho.
