# Análise de Contexto com Cynefin e Escolha da Abordagem

## O que é o Cynefin

O framework **Cynefin** ajuda a classificar um problema/projeto pelo tipo de
relação entre causa e efeito, para então escolher a forma certa de conduzir o
trabalho. Os domínios:

| Domínio | Causa e efeito | Como agir |
|---|---|---|
| **Claro (Simples)** | óbvia | aplicar boas práticas conhecidas |
| **Complicado** | existe, mas exige análise/especialista | analisar e aplicar boas práticas |
| **Complexo** | só se entende depois (emergente) | experimentar, aprender e adaptar |
| **Caótico** | não há relação clara | agir para estabilizar |
| **Confuso** | não se sabe em qual domínio está | descobrir em qual domínio está |

## Onde o PlayHub se encaixa

O PlayHub é uma **loja de jogos** — um tipo de sistema (e-commerce) bem
conhecido, com padrões consolidados (CRUD, autenticação, carrinho, compra,
cache). O problema **não é trivial**, mas é **compreensível com análise e
conhecimento técnico**: dá para planejar e aplicar boas práticas.

➡️ **Classificação principal: Complicado.**

Porém, algumas partes tiveram caráter **Complexo** (exploratório), porque
envolveram **aprender tecnologias novas** durante o desenvolvimento — Redis
(cache e Pub/Sub), DDD, Docker/Nginx, CI/CD. Nessas partes o caminho foi
"experimentar → ver o resultado → ajustar".

## Abordagem escolhida: **híbrida, com predominância ágil**

Combinando os dois pontos acima:

- A base **Complicada** permitiria um planejamento mais previsível;
- As partes **Complexas** (tecnologias novas) e o fato de ser um **projeto
  acadêmico com escopo que evolui a cada módulo** pedem **iteração e adaptação**.

Por isso adotamos uma abordagem **ágil (Scrum/Kanban)**, com elementos
preditivos pontuais (a arquitetura e o modelo de dados foram planejados antes).

**Justificativa prática:**

- Entregas **incrementais** (primeiro o catálogo, depois compras, depois
  cache/eventos, depois CI/CD) — cada parte entrega valor e é testada.
- Um **Product Backlog** no Jira que é repriorizado conforme a necessidade
  (ver o projeto SCRUM e o documento de ciclo de vida).
- Fluxo visual de trabalho (**Kanban**: A fazer → Em andamento → Concluído),
  que torna o progresso transparente.

> Resumo: **domínio Complicado (com toques de Complexo) → abordagem híbrida que
> pende para o ágil (Scrum/Kanban)**, gerenciada no Jira.
