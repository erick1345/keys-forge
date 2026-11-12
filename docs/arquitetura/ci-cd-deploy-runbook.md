# Entrega Contínua: CI/CD, Deploy e Runbook

## 1. Pipeline CI/CD (esqueleto)

Arquivo: `.github/workflows/ci.yml` (no repositório do backend). Roda no GitHub
Actions a cada `push`/`pull_request`.

**Estágios:**

```mermaid
flowchart LR
    push["push / PR"] --> build["Build<br/>(npm ci + type-check)"]
    build --> test["Test<br/>(MySQL de serviço + npm test)"]
    test --> deploy["Deploy<br/>(somente main — esqueleto)"]
```

- **Build:** instala dependências (`npm ci`) e checa tipos (`tsc --noEmit`).
- **Test:** sobe um **MySQL** como serviço, importa o schema (`db/init.sql`) e
  roda `npm test` (os 23 testes). O Redis não é necessário em teste (o cache e a
  mensageria não abrem conexão nesse modo).
- **Deploy:** só na branch `main`; hoje é um **esqueleto** com os passos que
  entrariam em produção (build da imagem, push e `docker compose up -d`).

## 2. Estratégia de deploy

Escolha: **deploy simples com rollback por tag** (adequado ao tamanho do
projeto; sem a complexidade de blue/green agora).

1. Cada versão vira uma **imagem Docker** com uma tag (ex.: `:1.2.0` e `:latest`).
2. No servidor: `docker compose pull && docker compose up -d` sobe a nova versão.
3. **Rollback:** se a versão nova der problema, volta para a tag anterior
   (`docker compose up -d` apontando para `:1.1.0`) — rápido e previsível.

> Evolução possível: **blue/green** (subir a nova versão ao lado da antiga e só
> trocar o tráfego no Nginx quando estiver saudável), quando houver ambiente
> para isso.

## 3. Runbook de incidentes (como agir se o sistema cair)

Guia rápido para quando algo quebra em produção.

### O site não abre / erro 502 no Nginx
1. Ver os containers: `docker compose ps`.
2. Logs do backend: `docker compose logs --tail=100 backend`.
3. Se o backend estiver fora, reiniciar: `docker compose restart backend`.
4. Se persistir, rollback para a tag anterior (ver seção 2).

### Erros de banco / API responde 500
1. Conferir o MySQL: `docker compose ps mysql` e `docker compose logs mysql`.
2. Checar healthcheck; se o banco caiu, `docker compose restart mysql`.
3. Validar variáveis do `.env` (host, usuário, senha, nome do banco).

### Redis indisponível
- **Impacto baixo:** a aplicação continua funcionando (serve do MySQL), só sem
  cache e sem eventos. Reiniciar quando possível: `docker compose restart redis`.

### Lentidão / muita carga
1. Conferir a taxa de cache (`X-Cache: HIT` nos logs/headers).
2. Ver uso de CPU/memória dos containers (`docker stats`).

### Depois do incidente
- Registrar o que aconteceu, a causa e a correção (post-mortem curto) para
  evitar repetição.
