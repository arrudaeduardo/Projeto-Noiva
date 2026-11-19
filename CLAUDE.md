# Projeto Noiva: regras para alterar o app

App web offline (PWA) usado no iPhone pela Tela de Início, publicado pelo GitHub Pages em
https://arrudaeduardo.github.io/Projeto-Noiva/ . Tudo fica em `index.html` (HTML, CSS e JS) e `sw.js`.

## A cada publicação
1. Aumente a versão nos DOIS lugares, com o mesmo valor (formato `AAAA-MM-DD.N`):
   - `sw.js`: `const VERSION = '...'`
   - `index.html`: `const APP_VERSION = '...'`
   Sem isso o iPhone não detecta a versão nova e a faixa "Nova versão do app disponível" não aparece.
2. Se criar arquivo novo que o app precisa offline, inclua em `FILES` no `sw.js`.
3. Teste antes de publicar (Chromium simulando iPhone): abrir, trocar de aba, ficar offline e recarregar, sem erros de JS.

## Dados da usuária (não quebrar)
- Ficam no `localStorage` do iPhone: `pn_dias`, `pn_medidas`, `pn_exames`, `pn_lastbackup`, `pn_seeded`.
- Nunca renomeie essas chaves nem mude o formato de forma incompatível. Se precisar mudar, migre os dados antigos no carregamento.
- O backup (.json com `app:'projeto-noiva'`) precisa continuar restaurável.
- Não renomeie o repositório: o endereço muda e o app abre vazio no iPhone.

## Como a atualização chega
O service worker guarda a versão nova e espera. O app mostra a faixa; ao tocar em "Atualizar", ele salva o
que estiver pendente, troca a versão e recarrega. A checagem acontece ao abrir o app e sempre que ele volta para a tela.
