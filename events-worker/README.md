# events-worker (microserviço de eventos)

Microserviço **independente** do PlayHub. Roda em um processo/container
separado do backend e **consome** os eventos de domínio publicados no Redis
(Pub/Sub): compra realizada, jogo criado/atualizado/removido.

É um exemplo de arquitetura **orientada a eventos**: o backend apenas *publica*
o que aconteceu; este serviço *reage* (ex.: "enviar" notificações), sem
acoplamento. Como é um serviço à parte, poderia ser **escalado sozinho**.

> O núcleo do sistema é um monólito modular (ver `docs/adr/0002`); este worker
> é a parte **microserviço** da arquitetura (abordagem híbrida), extraída pelo
> bounded context de notificações/eventos.

## Rodar

**Com Docker (recomendado):** já sobe junto no `docker compose up` (serviço
`events-worker`).

**Em dev (local):** com o Redis no ar,
```bash
npm install
npm run dev
```
Variáveis: `REDIS_HOST` (default `127.0.0.1`), `REDIS_PORT` (default `6379`).
