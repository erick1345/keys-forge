# Quality Scenarios — PlayHub (keys-forge)

Cenários que descrevem os **atributos de qualidade** mais importantes do
sistema, no formato: *estímulo → resposta → medida*. Servem para deixar claro o
que o sistema precisa garantir, e todos têm base no que já está implementado.

---

## 1. Desempenho — listagem de jogos

- **Atributo:** Desempenho / Escalabilidade de leitura
- **Estímulo:** vários clientes pedem a listagem de jogos ao mesmo tempo.
- **Resposta:** a partir da 2ª requisição (dentro do TTL), a lista é servida do
  **cache Redis**, sem consultar o MySQL.
- **Medida:** resposta marcada com `X-Cache: HIT`; o banco só é consultado no
  `MISS` (1ª vez ou após expirar/invalidar). TTL padrão: 60s.

## 2. Disponibilidade / Resiliência — falha do Redis

- **Atributo:** Disponibilidade
- **Estímulo:** o Redis fica indisponível (cai ou é reiniciado).
- **Resposta:** a aplicação **continua funcionando**, servindo os dados direto
  do MySQL; cache e eventos são best-effort e não derrubam a requisição.
- **Medida:** nenhum erro é devolvido ao usuário por causa do cache; ao voltar,
  o Redis reconecta sozinho.

## 3. Segurança — controle de acesso

- **Atributo:** Segurança
- **Estímulo:** um cliente (sem permissão) tenta criar/editar/excluir um jogo.
- **Resposta:** a API bloqueia a ação.
- **Medida:** `401` sem token válido e `403` sem perfil de **admin** (JWT +
  middleware de autorização). O Nginx ainda força **HTTPS**.

## 4. Confiabilidade — compra e estoque

- **Atributo:** Confiabilidade / Integridade de dados
- **Estímulo:** um cliente compra um jogo.
- **Resposta:** a compra é registrada e o estoque é baixado de forma consistente;
  compra sem estoque é recusada.
- **Medida:** não é possível vender além do estoque; a compra retorna `201` ou
  um erro claro (ex.: `400` sem estoque).

## 5. Observabilidade — acompanhar os fluxos

- **Atributo:** Observabilidade
- **Estímulo:** a equipe precisa entender o que está acontecendo (cache,
  eventos, erros).
- **Resposta:** logs padronizados com nível, timestamp e contexto; eventos de
  domínio logados ao publicar e ao receber.
- **Medida:** é possível seguir um fluxo pelos logs, por exemplo:
  `[INFO] (cache) HIT ...`, `[eventos] PUBLICADO/RECEBIDO ...`,
  `[WARN] (http) GET /jogos/999 -> 404`.
