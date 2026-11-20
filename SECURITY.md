# Checklist de segurança do projeto

## Já tratado no front-end

- [x] `maxlength` em entradas
- [x] validação básica de e-mail
- [x] validação de formulário com `checkValidity`
- [x] dados de catálogo não são executados como HTML arbitrário
- [x] escape de conteúdo dinâmico antes de inserir no DOM
- [x] `localStorage` limitado a dados não sensíveis
- [x] nenhuma senha ou cartão coletado
- [x] nenhum segredo embutido
- [x] limite de quantidade do carrinho
- [x] estoque considerado no incremento local
- [x] mensagem explícita de que checkout é demonstrativo
- [x] meta referrer restritiva

## O que ainda não pode ser garantido apenas com HTML/CSS/JS

O usuário pode abrir DevTools e alterar qualquer variável JavaScript, preço, estoque ou `localStorage`. Portanto, nada no cliente deve ser considerado confiável.

Antes de produção:

1. Recalcular preço no servidor.
2. Revalidar estoque no servidor.
3. Validar cupom no servidor.
4. Criar pedido no servidor.
5. Usar autenticação segura.
6. Não guardar tokens sensíveis em `localStorage`.
7. Usar cookies de sessão `HttpOnly; Secure; SameSite`.
8. Adicionar CSRF quando aplicável.
9. Implementar rate limiting.
10. Configurar CSP e outros headers HTTP no servidor.
11. Integrar gateway de pagamento com tokenização.
12. Confirmar pagamento por webhook assinado.
13. Validar permissões de administrador no servidor.
14. Registrar eventos de segurança sem armazenar dados desnecessários.
15. Fazer testes automatizados e testes de segurança antes do lançamento.

## Modelo de arquitetura futura

Browser → HTTPS → CDN/WAF → API → autenticação → regras de negócio → banco

Pagamento:
API → gateway de pagamento
gateway → webhook assinado → API → pedido confirmado

O navegador nunca deve ser a autoridade final sobre dinheiro, estoque, identidade ou status de pagamento.
