# ADR 0003 — Redis para cache e mensageria

**Status:** Aceito
**Data:** 2025-11

## Contexto

Duas necessidades surgiram no backend:

1. A **listagem de jogos** é a consulta mais frequente e bate sempre no MySQL,
   mesmo quando os dados não mudaram.
2. Queremos **reagir a eventos** do sistema (ex.: "jogo criado", "compra
   realizada") de forma desacoplada, sem amarrar tudo dentro da rota.

## Decisão

Usar **Redis** para resolver os dois pontos:

- **Cache (cache-aside) com TTL** na listagem de jogos: a resposta é guardada no
  Redis por um tempo; as próximas requisições vêm do cache. Toda escrita
  (criar/editar/excluir jogo) **invalida** o cache.
- **Mensageria (Pub/Sub):** eventos de domínio são publicados em canais e um
  consumidor os recebe, deixando os efeitos colaterais desacoplados da rota.

## Justificativa

- **Desempenho:** o cache tira carga do MySQL nas leituras frequentes.
- **Desacoplamento:** o Pub/Sub separa "o que aconteceu" de "quem reage".
- **Uma tecnologia, dois problemas:** o mesmo Redis cobre cache e mensageria.
- **Fácil de operar:** imagem oficial no Docker Compose, sem configuração pesada.

## Alternativas consideradas

- **Cache em memória do próprio processo** — descartado: não é compartilhado e
  some a cada restart.
- **Fila dedicada (RabbitMQ/Kafka)** — exagero para o escopo; o Pub/Sub do Redis
  atende a demonstração de eventos.

## Consequências

- **Positivas:** respostas mais rápidas e efeitos colaterais desacoplados.
- **Negativas / atenção:** mais uma dependência. **Mitigado:** a aplicação é
  **resiliente** — se o Redis cair, ela continua funcionando servindo direto do
  MySQL (cache e eventos são best-effort).
