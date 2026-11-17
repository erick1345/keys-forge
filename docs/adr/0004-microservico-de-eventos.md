# ADR 0004 — Microserviço de eventos (arquitetura híbrida)

**Status:** Aceito
**Data:** 2025-11

## Contexto

O núcleo do PlayHub é um **monólito modular** (ver [ADR 0002](0002-arquitetura-monolitica.md)).
Ao mesmo tempo, o sistema já publica **eventos de domínio** no Redis via Pub/Sub
(ver [ADR 0003](0003-redis-para-cache-e-mensageria.md)): compra realizada, jogo
criado/atualizado/removido.

Surgiu a necessidade de **reagir a esses eventos** (ex.: "enviar" notificações
ao cliente, avisar quem tem o jogo na lista de desejos) sem sobrecarregar o
backend e sem acoplar essa lógica à requisição que gerou o evento.

## Decisão

Extrair um **microserviço independente** — o `events-worker` — que roda em um
**processo/container separado** do backend e **consome** os eventos de domínio
do Redis. Ele reage aos eventos de forma desacoplada (ex.: notificações).

A arquitetura passa a ser **híbrida**:

- **Monólito modular** → regra de negócio principal (catálogo, vendas, usuários);
- **Microserviço (`events-worker`)** → reação assíncrona a eventos (event-driven).

## Justificativa

- **Desacoplamento:** o backend só publica "o que aconteceu"; o worker decide
  "como reagir". Um não precisa conhecer o outro.
- **Escalabilidade independente:** se as notificações crescerem, escala-se só o
  `events-worker`, sem tocar no backend.
- **Baixo risco:** é aditivo — não altera o funcionamento do monólito. O Redis
  Pub/Sub faz *fan-out*, então o backend e o worker recebem os eventos em
  paralelo.
- **Caminho natural:** os **bounded contexts** do DDD são as "linhas de corte"
  por onde outros serviços poderiam ser extraídos no futuro.

## Alternativas consideradas

- **Manter a reação dentro do backend** — simples, mas acopla e não escala
  separadamente.
- **Migrar tudo para microserviços** — descartado: complexidade alta (vários
  deploys, rede, observabilidade distribuída) sem ganho no escopo atual.

## Consequências

- **Positivas:** demonstra arquitetura orientada a eventos e microserviços;
  reação a eventos desacoplada e escalável por conta própria.
- **Negativas / atenção:** mais um serviço para subir/monitorar. Mitigado: ele é
  opcional (se cair, o backend e as compras continuam funcionando normalmente;
  só as notificações deixam de ser processadas).
