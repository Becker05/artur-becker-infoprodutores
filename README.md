# Rastreamento para infoprodutores

Página estática com formulário embutido, página de obrigado e integração Google Sheets.

## Executar

Node.js: npm start. Prévia em http://127.0.0.1:4174.

## Fluxo

Todos os CTAs levam a #solicitar-diagnostico. O formulário coleta modelo de venda, investimento, necessidades, nome, e-mail e WhatsApp. Grava em Leads Infoprodutores na mesma planilha do e-commerce, usando form_id=diagnostico_infoprodutores. A rota sem esse identificador mantém o e-commerce em Leads. O backend publicado está documentado em docs/Code.gs.

A página de obrigado só é aberta após confirmação de gravação por request_id. POST no-cors não é considerado confirmação. Reenvios da mesma tentativa usam o mesmo ID. Campos incluem validação, honeypot e proteção contra fórmulas na planilha.

## Mensuração

contact_click é clique no CTA; diagnostico_form_start é início do formulário; generate_lead ocorre após confirmação. Dados de contato não são enviados ao dataLayer. GTM permanece desativado até configuração do container desta LP em assets/config.js. Não reutilizar o container do e-commerce automaticamente.

## Hospedagem

GitHub Pages, main, raiz. Domínio lpi.souarturbecker.com.br.
