# Vértice Store — e-commerce front-end

Projeto demonstrativo de uma loja de camisas, calçados e acessórios usando **somente HTML, CSS e JavaScript puro**.

## Estrutura

- `index.html` — página principal
- `pages/checkout.html` — checkout demonstrativo
- `assets/css/style.css` — design responsivo
- `assets/js/app.js` — catálogo, filtros, busca, carrinho, cupom e contato
- `assets/js/checkout.js` — resumo e validação do checkout
- `data/products.js` — catálogo inicial

## Blocos implementados

1. Design system e layout responsivo
2. Header / navegação
3. Busca
4. Categorias
5. Catálogo de produtos
6. Filtros e ordenação
7. Seleção de tamanho
8. Carrinho persistente em `localStorage`
9. Cupom `VERTICE10`
10. Checkout demonstrativo
11. Formulário de contato
12. Acessibilidade básica
13. Validação client-side
14. Proteções front-end contra inserção de HTML no conteúdo dinâmico

## Segurança — importante

Este é **somente um front-end**. HTML/CSS/JS no navegador não conseguem, sozinhos, proteger uma loja real contra fraude, manipulação de preços, roubo de sessão, fraude de pagamento ou acesso indevido a banco de dados.

Nesta versão:

- preços e estoque são dados de demonstração no navegador;
- `localStorage` é usado somente para o carrinho/cupom;
- nenhum cartão ou senha é armazenado;
- conteúdo de produto inserido no DOM passa por escape;
- limites e validações básicas são aplicados no cliente.

### Para produção, o próximo bloco deve ser um backend

Recomenda-se adicionar:

- API com autenticação e autorização;
- banco de dados;
- validação server-side de todos os campos;
- estoque e preço calculados no servidor;
- sessão/cookies com `Secure`, `HttpOnly` e `SameSite`;
- proteção CSRF quando aplicável;
- rate limiting;
- logs e monitoramento;
- headers de segurança, especialmente CSP;
- integração de pagamento por gateway/tokenização;
- webhook assinado para confirmação de pagamento;
- nunca armazenar CVV ou dados brutos de cartão;
- secrets somente no servidor;
- controle de permissões para administração;
- backup e recuperação;
- testes de segurança.

## Como executar

Abra `index.html` no navegador. Para um servidor local, use qualquer servidor estático.

## Próximos blocos

O projeto está propositalmente parado no limite do front-end. Os próximos blocos podem ser construídos depois:

- backend/API;
- login e cadastro;
- banco de dados;
- painel administrativo;
- checkout real;
- pagamentos;
- frete;
- pedidos e rastreamento;
- favoritos;
- avaliações;
- e-mail;
- LGPD/consentimento;
- testes automatizados e hardening.
