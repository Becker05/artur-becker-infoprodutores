# Rastreamento para infoprodutores — Artur Becker

Página estática de geração de contatos para o serviço de implementação de rastreamento. Preserva CSS, cores e componentes do modelo aprovado.

## Rodar

Node.js: `npm start`; abra http://127.0.0.1:4174. Sem dependências. `npm run check` verifica sintaxe.

## Hospedar

GitHub Pages: main, /(root), sem build. Domínio personalizado ainda não definido.

## Configuração

assets/config.js contém WhatsApp, mensagem e GTM opcional, inicialmente desativado. Não reutilizar o container do e-commerce sem autorização. Antes de ativar tags, configurar os requisitos de consentimento aplicáveis.

O evento contact_click representa somente clique no WhatsApp. Nenhum generate_lead ou purchase é disparado pelo clique; conversa, qualificação e venda precisam de confirmação em uma integração própria. Não há formulário com armazenamento ou endpoint reaproveitado.

CTA flutuante aparece quando os botões originais saem da tela. Conteúdo e mensagens podem ser editados em index.html.

Pesquisa e critérios editoriais: docs/pesquisa.md.
