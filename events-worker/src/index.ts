import Redis from 'ioredis';

/**
 * events-worker — microservico independente do PlayHub.
 *
 * Roda em um processo/container separado do backend e consome os eventos de
 * dominio publicados no Redis (Pub/Sub). Reage a eles de forma desacoplada —
 * por exemplo, "enviando" notificacoes. Como e um servico a parte, poderia
 * ser escalado sozinho, sem mexer no backend.
 */

const HOST = process.env.REDIS_HOST || '127.0.0.1';
const PORT = Number(process.env.REDIS_PORT) || 6379;

const CANAIS = {
  JOGO_CRIADO: 'eventos:jogo-criado',
  JOGO_ATUALIZADO: 'eventos:jogo-atualizado',
  JOGO_REMOVIDO: 'eventos:jogo-removido',
  COMPRA_REALIZADA: 'eventos:compra-realizada',
};

function log(msg: string) {
  console.log(`${new Date().toISOString()} [events-worker] ${msg}`);
}

const subscriber = new Redis({
  host: HOST,
  port: PORT,
  retryStrategy: (times) => Math.min(times * 500, 3000),
});

subscriber.on('ready', () => {
  subscriber.subscribe(...Object.values(CANAIS), (err, count) => {
    if (err) {
      log('falha ao assinar os canais: ' + err.message);
      return;
    }
    log(`microservico no ar — assinando ${count} canais no Redis (${HOST}:${PORT})`);
  });
});

subscriber.on('message', (canal, mensagem) => {
  let dados: any = {};
  try {
    dados = JSON.parse(mensagem);
  } catch {
    /* mensagem nao-JSON: ignora o parse */
  }

  switch (canal) {
    case CANAIS.COMPRA_REALIZADA:
      log(`COMPRA: usuario ${dados.userId} comprou o jogo #${dados.gameId} -> enviando confirmacao ao cliente...`);
      break;
    case CANAIS.JOGO_CRIADO:
      log(`CATALOGO: novo jogo "${dados.titulo}" (#${dados.id}) -> notificando lista de desejos...`);
      break;
    case CANAIS.JOGO_ATUALIZADO:
      log(`CATALOGO: jogo #${dados.id} atualizado.`);
      break;
    case CANAIS.JOGO_REMOVIDO:
      log(`CATALOGO: jogo #${dados.id} removido.`);
      break;
    default:
      log(`evento recebido em ${canal}: ${mensagem}`);
  }
});

subscriber.on('error', (err) => {
  log('Redis indisponivel (tentando reconectar): ' + err.message);
});

log('iniciando events-worker (aguardando conexao com o Redis)...');
