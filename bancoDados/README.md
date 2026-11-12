# Modelagem de dados — Aegon Store e futuro SaaS

**Situação:** proposta de arquitetura e modelo lógico, sem banco criado ou integração implementada. Revisão: 11/11/2026.

Esta pasta descreve a evolução do front Vue atual, que ainda usa `localStorage` para catálogo, carrinho, cupons e pedidos simulados. O objetivo é iniciar com uma única loja (Aegon) e já evitar uma migração estrutural quando houver outras empresas.

## Documentos

- [Modelo de entidades e relacionamentos](modelo-entidades.md): diagramas Mermaid e dicionário de entidades.
- [Regras, segurança e fluxos](regras-e-fluxos.md): isolamento de lojas, compra, pagamento, estoque e migração do front.
- [Ambientes, custos e implementação](ambientes-e-implantacao.md): proposta de infraestrutura, limitações do gratuito e sequência de entrega.

## Decisões propostas

1. **PostgreSQL** como banco relacional. Usar `UUID` para identificadores e valores monetários em centavos inteiros (`bigint`), com moeda `BRL`.
2. **Uma base compartilhada e uma `loja` por empresa**, iniciando com Aegon. Os registros comerciais pertencem à loja por `loja_id`. A estrutura é multiloja desde a primeira migração; ativar outros clientes futuramente exige também cadastro, regras de acesso, domínio e operação.
3. **Identidade separada da pessoa e da permissão**: um usuário pode ser cliente ou operador em lojas diferentes; o vínculo de usuário com loja define seu papel. Checkout como visitante é permitido na proposta.
4. **API e serviços no servidor como autoridade** para preço, desconto, estoque, pedido e pagamento. O navegador não determina o valor cobrado nem o status pago.
5. **Supabase Free como candidato para desenvolvimento e MVP controlado**, sujeito à validação do usuário e dos limites atuais. Um plano pago pode aumentar recursos sem necessariamente migrar a aplicação; mudança para outro provedor ou isolamento dedicado exige migração e testes, não apenas uma chave.
6. O modelo distingue a **primeira entrega (MVP)** de recursos posteriores. Algumas entidades mostradas no diagrama são futuras e não precisam ser criadas na primeira migração.

## Convenções

- A maioria das tabelas usa `id uuid`, `created_at timestamptz` e `updated_at timestamptz`; o diagrama omite campos comuns para facilitar leitura.
- Identificadores de loja aparecem nas tabelas pertencentes ao tenant. Tabelas de associação e filhas também carregam `loja_id`, inclusive onde ele é redundante: isso permite impor integridade e isolamento no banco. A única exceção prevista é a entrada de um evento de gateway ainda não conciliado, armazenada em área interna restrita até identificar a loja.
- Onde houver referência entre tabelas da loja, usar chaves estrangeiras compostas `(loja_id, ..._id)` para chaves únicas `(loja_id, id)` da tabela referenciada. Não confiar apenas no identificador enviado pelo navegador.
- Não registrar senhas, números completos de cartão ou CVV no banco da aplicação. Dados de cartão serão coletados/tokenizados pelo componente seguro do gateway escolhido.
- Status, retenção de eventos, campos obrigatórios e regras fiscais ainda dependem de decisões de produto antes da implementação final.
