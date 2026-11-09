# ADR 0001 — Escolha do banco de dados

**Status:** Aceito
**Data:** 2025-06
**Contexto do projeto:** PlayHub (keys-forge) — loja de jogos (backend Node/Express)

## Contexto

O sistema precisa guardar usuários, jogos, compras e a biblioteca de cada
usuário. Esses dados são bem relacionados entre si:

- um **usuário** faz várias **compras**;
- cada **compra** está ligada a um **jogo**;
- a compra precisa **baixar o estoque** do jogo de forma confiável.

Ou seja, temos relacionamentos claros (chaves estrangeiras) e uma operação que
exige **transação** (registrar a compra e atualizar o estoque juntos, sem ficar
pela metade). Também fazemos consultas simples e paginadas (listar jogos por
página).

A equipe já tem experiência com **SQL**, e o ambiente de desenvolvimento usa
**XAMPP** (que já vem com MySQL), além de rodar em **Docker** na entrega.

## Decisão

Usar **MySQL 8** (banco relacional).

## Justificativa

- **Dados relacionais e integridade:** usuários, jogos e compras têm
  relacionamentos bem definidos; o modelo relacional com chaves estrangeiras
  garante a integridade referencial.
- **Transações (ACID):** a compra precisa ser atômica (registrar + baixar
  estoque). O MySQL (InnoDB) suporta isso nativamente.
- **Familiaridade da equipe:** já dominamos SQL, o que acelera o desenvolvimento
  e reduz erros.
- **Facilidade de ambiente:** já vem no XAMPP para dev e tem imagem oficial
  (`mysql:8.0`) para o Docker Compose, sem configuração complicada.
- **Maturidade e suporte:** ferramentas prontas (phpMyAdmin), muita
  documentação e comunidade grande.

As leituras mais frequentes (listagem de jogos) são aceleradas por um **cache
em Redis** na frente do MySQL, então o banco não vira gargalo nessas consultas.

## Alternativas consideradas

- **PostgreSQL** — também é relacional e atenderia bem. Ficou de fora por
  familiaridade: a equipe conhece mais MySQL e ele já vem no XAMPP.
- **MongoDB (NoSQL)** — descartado. Nossos dados são relacionais e dependem de
  JOINs e transações entre tabelas; um banco de documentos complicaria essas
  garantias sem trazer vantagem para o nosso caso.

## Consequências

- **Positivas:** integridade dos dados, transações confiáveis, ambiente simples
  de subir (XAMPP/Docker) e equipe produtiva desde o início.
- **Negativas / atenção:** esquema mais rígido que um NoSQL (mudanças de tabela
  exigem migração) — aceitável, porque o modelo do PlayHub é estável. Escalar
  escrita exigiria estratégias extras no futuro (réplicas), fora do escopo atual.
