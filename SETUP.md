# Keys Forge (PlayHub) — Setup em uma máquina nova

Projeto web: **backend** (Node/Express + TypeScript) + **frontend** (React + Vite) + **MySQL**, com **Nginx** como proxy reverso e **Docker Compose** para orquestração.

> Este repositório guarda só os arquivos de **infra/orquestração** da raiz
> (`docker-compose.yml`, `nginx/`, `init.sql`, `.env.example`, `shared/`).
> O código fica em 3 repositórios separados, clonados dentro desta pasta:
>
> | Pasta | Repositório | Branch |
> |---|---|---|
> | `backend/`  | https://github.com/erick1345/-Back-end-keys.git | `dev` |
> | `frontend/` | https://github.com/erick1345/front-end.keys.git | `dev` |
> | `mobile/`   | https://github.com/erick1345/keys-forge-mobile.git | `master` |

---

## 1. Pré-requisitos

- **Node.js** 18+ (recomendado 20/22) — https://nodejs.org
- **Git** — https://git-scm.com
- **VS Code** — https://code.visualstudio.com
- **MySQL** — via **XAMPP** (jeito simples) OU via **Docker** (ver modo Docker abaixo)
- *(Opcional, só pra demo com Nginx/Docker)* **Docker Desktop** e **mkcert**

---

## 2. Clonar tudo

Abra o terminal em `C:\xampp\htdocs` e rode:

```bash
git clone <URL-DESTE-REPO> keys-forge
cd keys-forge
git clone -b dev     https://github.com/erick1345/-Back-end-keys.git  backend
git clone -b dev     https://github.com/erick1345/front-end.keys.git  frontend
git clone -b master  https://github.com/erick1345/keys-forge-mobile.git mobile
```

> Ou, depois de clonar este repo e entrar na pasta, rode o script `setup.ps1`
> (PowerShell) que já faz os 3 clones e o `npm install` pra você.

---

## 3. Instalar dependências

```bash
cd backend  && npm install && cd ..
cd frontend && npm install && cd ..
cd mobile   && npm install && cd ..
```

---

## 4. Variáveis de ambiente (.env)

O `.env` **não vem no git** (tem senha). Crie a partir do exemplo:

```bash
cp .env.example .env
```

Depois abra o `.env` e preencha (exemplo para XAMPP com MySQL local):

```
DB_HOST=localhost
DB_NAME=keys-forge
DB_USER=root
DB_PASSWORD=
DB_ROOT_PASSWORD=
JWT_SECRET=troque-por-uma-frase-secreta-longa
PORT=3001
```

> O backend também lê este `.env` quando roda em Docker (lá o `DB_HOST` vira `mysql`).

---

## 5. Banco de dados

**Com XAMPP:** abra o phpMyAdmin (`http://localhost/phpmyadmin`), crie o banco
`keys-forge` e **importe** o arquivo `init.sql` (ele cria as tabelas e já traz
os jogos/usuários de exemplo).

Ou pela linha de comando:

```bash
"C:/xampp/mysql/bin/mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS \`keys-forge\`;"
"C:/xampp/mysql/bin/mysql.exe" -u root "keys-forge" < init.sql
```

---

## 6. Rodar

### Modo dev (dia a dia — simples, sem Docker)

Em dois terminais:

```bash
cd backend  && npm run dev     # API em http://localhost:3001
cd frontend && npm run dev     # Site em http://localhost:5173
```

Pronto: abra **http://localhost:5173**.

### Modo Docker (pra demonstrar Nginx/orquestração da rubrica)

Precisa do **Docker Desktop aberto** e dos **certificados** do Nginx (não vêm no git):

```bash
# 1) gerar os certificados locais (uma vez)
mkcert -install
cd nginx/certs
mkcert keys-forge.local
#   isso gera keys-forge.local.pem e keys-forge.local-key.pem
cd ../..

# 2) adicionar o domínio ao hosts (uma vez), como admin:
#   127.0.0.1  keys-forge.local      -> em C:\Windows\System32\drivers\etc\hosts

# 3) subir tudo
docker compose up --build
```

Depois acesse **https://keys-forge.local** (frontend) e a API em **https://keys-forge.local/api/**.

---

## Problemas comuns

- **Site abre mas não loga / erro de API:** confira se o backend está rodando (3001) e o `.env` preenchido.
- **Backend não conecta no banco:** XAMPP ligado? Banco `keys-forge` criado e `init.sql` importado?
- **Warning do Vite sobre `expo/tsconfig.base`:** é inofensivo (sobra do mobile), pode ignorar.
