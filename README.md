# Keys Forge — Setup com Docker

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [mkcert](https://github.com/FiloSottile/mkcert) (para HTTPS local)

## 1. Instalar e configurar HTTPS local

```bash
# Instalar mkcert (primeira vez)
mkcert -install

# Criar a pasta de certificados
mkdir -p nginx/certs

# Gerar certificado para o host local
mkcert -cert-file nginx/certs/keys-forge.local.pem \
       -key-file  nginx/certs/keys-forge.local-key.pem \
       keys-forge.local
```

## 2. Adicionar o host no sistema

Adicione a linha abaixo no arquivo `/etc/hosts` (Linux/Mac) ou `C:\Windows\System32\drivers\etc\hosts` (Windows):

```
127.0.0.1   keys-forge.local
```

## 3. Configurar as variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas senhas
```

## 4. Subir o projeto

```bash
docker compose up --build
```

Acesse: **https://keys-forge.local**

---

## Estrutura dos containers

| Serviço    | Rede     | Porta exposta |
|------------|----------|---------------|
| nginx      | external | 80, 443       |
| frontend   | internal | —             |
| backend    | internal | —             |
| mysql      | internal | —             |

Apenas o Nginx fica exposto para fora. Os demais serviços se comunicam pela rede interna.

## Comandos úteis

```bash
# Parar tudo
docker compose down

# Parar e apagar volume do banco
docker compose down -v

# Ver logs em tempo real
docker compose logs -f

# Acessar o banco de dados
docker compose exec mysql mysql -u keysforge -p keys-forge
```
