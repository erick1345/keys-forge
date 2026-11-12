# Atributos de Qualidade: SLOs/SLIs, Resiliência e Observabilidade

## 1. SLIs e SLOs

**SLI** (indicador) = o que medimos. **SLO** (objetivo) = a meta para esse
indicador.

| SLI (indicador) | Como medir | SLO (meta) |
|---|---|---|
| **Latência da listagem de jogos** | tempo de resposta do `GET /jogos` | 95% das requisições < 300 ms |
| **Disponibilidade da API** | % de requisições respondidas (não 5xx) | ≥ 99,5% no mês |
| **Taxa de erros** | % de respostas 5xx | < 1% das requisições |
| **Eficiência do cache** | proporção de respostas `X-Cache: HIT` na listagem | ≥ 70% de HIT em uso normal |

> Os SLOs são metas realistas para um projeto acadêmico; a ideia é mostrar o
> raciocínio (medir → definir meta → acompanhar).

## 2. Estratégias de resiliência (aplicadas)

| Estratégia | Onde está no projeto |
|---|---|
| **Retry (reconexão)** | cliente Redis com `retryStrategy` (ioredis) reconecta sozinho com backoff |
| **Timeout / limite de tentativas** | `maxRetriesPerRequest: 2` no Redis — não fica travado esperando |
| **Degradação graciosa (tipo circuit breaker)** | se o Redis cair, o cache e os eventos viram *best-effort*: a API responde direto do MySQL, sem erro para o usuário |
| **Healthcheck** | `docker-compose.yml` tem healthcheck no MySQL e no Redis; o backend só sobe depois do banco saudável |
| **Restart automático** | `restart: unless-stopped` nos containers |
| **Transação na compra** | a baixa de estoque é consistente (não vende além do estoque) |

> O "circuit breaker" aqui é simplificado: em vez de abrir/fechar um circuito,
> o código detecta que o Redis está offline e **pula** o cache/eventos,
> continuando a servir do banco.

## 3. Plano de observabilidade

**O que coletar:**

- **Logs estruturados** (nível + timestamp + contexto) em todos os fluxos
  importantes — ver `lib/logger.ts`.
- **Cache:** cada `HIT`/`MISS` e cada invalidação são logados; o header
  `X-Cache` expõe HIT/MISS por requisição.
- **Eventos:** cada mensagem Pub/Sub é logada ao **publicar** e ao **receber**
  (`[eventos] PUBLICADO/RECEBIDO`), comprovando a circulação.
- **Erros HTTP:** o `errorHandler` central loga método, rota e status.

**Exemplos reais de log:**

```
2026-11-09T15:39:05Z [INFO] (cache) HIT jogos:page:1:limit:10
[eventos] PUBLICADO eventos:compra-realizada -> {"userId":527,"gameId":220,...}
2026-11-09T15:39:06Z [WARN] (http) GET /jogos/999999 -> 404: Jogo não encontrado
```

**Como evoluir (próximos passos):** expor um endpoint `/health`, enviar os logs
para uma ferramenta central (ex.: Grafana Loki) e criar um painel com as métricas
dos SLIs acima.
