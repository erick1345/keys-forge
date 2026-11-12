# ADR 0002 — Estilo de arquitetura: monólito modular

**Status:** Aceito
**Data:** 2025-06

## Contexto

O PlayHub é um projeto com equipe pequena e escopo bem definido (loja de jogos:
usuários, catálogo, compras, dashboard). Precisamos de algo **simples de
desenvolver, rodar localmente e entregar**, sem infraestrutura complicada.

A pergunta era: **monólito** ou já partir para **microserviços** (ou um
"modulith" com módulos independentes mais isolados)?

## Decisão

Adotar um **monólito modular**: um único backend (Node/Express) que roda como
um processo, mas **organizado internamente em camadas/módulos**:

- `controllers/` — entrada HTTP (fina);
- `services/` — regra de negócio;
- `repositories/` — acesso ao banco;
- módulos de apoio: `cache/` (Redis), `messaging/` (eventos), `middleware/`.

O sistema inteiro (frontend, backend, MySQL, Redis, Nginx) é orquestrado com
**Docker Compose**.

## Justificativa

- **Simplicidade:** um deploy só, sem comunicação de rede entre serviços, sem
  orquestração complexa — adequado ao tamanho do time e do projeto.
- **Produtividade:** mais fácil de rodar, depurar e versionar.
- **Organização mesmo sendo monólito:** a separação em camadas já dá coesão e
  baixo acoplamento, e deixa o caminho aberto para evoluir para um "modulith"
  ou extrair serviços no futuro, **se** houver necessidade.

## Alternativas consideradas

- **Microserviços** — descartado. Traria complexidade (rede, deploys
  separados, observabilidade distribuída) sem benefício real no escopo atual.
- **Modulith com módulos fortemente isolados** — bom caminho futuro, mas
  exagerado agora; a divisão em camadas já atende.

## Consequências

- **Positivas:** desenvolvimento e deploy simples; fácil de subir numa máquina
  nova; código organizado por camadas.
- **Negativas / atenção:** escala como um bloco só (não dá para escalar apenas
  uma parte). Aceitável no escopo; se precisar, a modularização facilita a
  extração de serviços depois.
