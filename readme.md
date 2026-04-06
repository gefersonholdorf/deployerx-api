# DeployerX API

API de gerenciamento de deploys com autenticação JWT, banco de dados MySQL e containerização com Docker.

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- Git

## 🚀 Início Rápido

### 1. Clonar o repositório

```bash
git clone <seu-repositório>
cd deployerx-api
```

### 2. Configurar variáveis de ambiente

**Para o banco de dados (.env):**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com as credenciais do MySQL:
```env
MYSQL_ROOT_PASSWORD=root_password_segura
MYSQL_DATABASE=deployerx
MYSQL_USER=deployerx
MYSQL_PASSWORD=senha_usuario_segura
```

**Para a aplicação (.env.app):**

Crie ou atualize o arquivo `.env.app` com as seguintes variáveis:
```env
APP=development
APP_NAME=DeployerX
PORT=3333

JWT_SECRET_KEY=sua_chave_secreta_jwt_aqui

DATABASE_URL=mysql://deployerx:senha_usuario_segura@deployerx-db:3306/deployerx
```

**Notas importantes:**
- `DATABASE_URL` deve usar o nome do serviço Docker (`deployerx-db`) como host quando executar em containers
- `JWT_SECRET_KEY` deve ser uma string aleatória e segura (mínimo 24 caracteres)
- O host `deployerx-db` é resolvido automaticamente dentro da rede Docker

### 3. Executar com Docker Compose

**Iniciar os containers:**
```bash
docker-compose up -d
```

Isso irá:
- Criar e iniciar o container MySQL (`deployerx-db`)
- Criar e iniciar o container da API (`deployerx-api`)
- Configurar a rede de comunicação entre eles
- Expor as portas necessárias

**Verificar o status dos containers:**
```bash
docker-compose ps
```

**Visualizar logs:**
```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs -f deployerx-api
docker-compose logs -f db
```

**Parar os containers:**
```bash
docker-compose down
```

**Parar e remover volumes (limpar dados):**
```bash
docker-compose down -v
```

## 🔗 Testando a Conexão entre Containers

### 1. Verificar se os containers estão rodando

```bash
docker-compose ps
```

Esperado:
```
NAME              COMMAND                  SERVICE      STATUS
deployerx-db      "docker-entrypoint.s…"   db          Up
deployerx-api     "docker-entrypoint.s…"   deployerx-api   Up
```

### 2. Testar conectividade do MySQL

```bash
# Acessar o container da API
docker exec -it deployerx-api sh

# Dentro do container, testar conexão com MySQL
npm run seed  # Executa migrations e seed (se configurado)
```

### 3. Testar a API

**Verificar se a API está respondendo:**
```bash
curl http://localhost:3333/health
```

**Acessar a documentação Swagger:**
```
http://localhost:3333/docs
```

## 🐳 Docker - Detalhes Técnicos

### Multi-stage Build

O `dockerfile` usa um processo de build em dois estágios:

1. **Builder Stage**: Compila o código TypeScript
2. **Production Stage**: Copia apenas o necessário para produção

Isso reduz o tamanho da imagem final.

### Rede Docker

Os containers comunicam-se através da rede `connection_deployer`:
- **API** → **MySQL**: Via hostname `deployerx-db`
- **MySQL** → Persistência de dados via volume `db_data`

### Volumes

- `db_data`: Armazena os dados do MySQL persistentemente

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `APP` | Ambiente (development/production) | development |
| `APP_NAME` | Nome da aplicação | DeployerX |
| `PORT` | Porta de execução da API | 3333 |
| `JWT_SECRET_KEY` | Chave secreta para JWT | string aleatória |
| `DATABASE_URL` | URL de conexão MySQL | mysql://user:pass@host:port/db |
| `MYSQL_ROOT_PASSWORD` | Senha root do MySQL | senha_segura |
| `MYSQL_DATABASE` | Nome do banco | deployerx |
| `MYSQL_USER` | Usuário MySQL | deployerx |
| `MYSQL_PASSWORD` | Senha do usuário | senha_segura |
