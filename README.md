# Pizza POS Pro 🍕

Sistema completo de ponto de venda (POS) para pizzarias com frontend React, backend Node.js e banco de dados SQL Server, totalmente dockerizado.

## 📋 Características

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Banco de Dados**: Microsoft SQL Server 2022
- **Containerização**: Docker + Docker Compose
- **Features**:
  - Sistema de pedidos (delivery, takeout, dine-in)
  - Gerenciamento de cardápio
  - Gestão de mesas
  - Cadastro de clientes
  - Sistema de cupons de desconto
  - Relatórios e analytics
  - Kitchen Display System (KDS)
  - Customização de pizzas

## 🚀 Início Rápido com Docker

### Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- Mínimo 4GB de RAM disponível

### Instalação e Execução

1. **Clone o repositório** (se aplicável):
```bash
git clone <url-do-repositorio>
cd pizza-pos-pro
```

2. **Configure as variáveis de ambiente** (opcional):
```bash
copy .env.example .env
```
> Edite o arquivo `.env` se necessário. As configurações padrão já funcionam!

3. **Inicie todos os serviços**:
```bash
docker-compose up -d
```

4. **Aguarde a inicialização** (primeira vez pode levar 2-3 minutos):
```bash
docker-compose logs -f
```
> Aguarde até ver a mensagem "Database initialization complete!"

5. **Acesse a aplicação**:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

🎉 **Pronto!** O sistema está rodando com dados de exemplo.

### Comandos Úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f sqlserver

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (ATENÇÃO: apaga dados!)
docker-compose down -v

# Reconstruir as imagens
docker-compose build

# Reiniciar um serviço específico
docker-compose restart backend
```

## 📁 Estrutura do Projeto

```
pizza-pos-pro/
├── src/                          # Frontend React
│   ├── components/               # Componentes React
│   ├── services/                 # Serviços API
│   ├── App.tsx                   # Componente principal
│   └── types.ts                  # TypeScript types
├── server/                       # Backend Node.js
│   ├── src/
│   │   ├── config/              # Configuração DB
│   │   ├── controllers/         # Controllers da API
│   │   ├── routes/              # Rotas da API
│   │   ├── types.ts             # TypeScript types
│   │   └── server.ts            # Entry point
│   ├── Dockerfile               # Docker do backend
│   └── package.json
├── database/                     # Scripts SQL
│   ├── init.sql                 # Schema do banco
│   └── seed.sql                 # Dados iniciais
├── Dockerfile                    # Docker do frontend
├── docker-compose.yml            # Orquestração Docker
├── nginx.conf                    # Configuração nginx
└── README.md
```

## 🗄️ Schema do Banco de Dados

O banco de dados é criado automaticamente ao iniciar os containers pela primeira vez.

### Tabelas Principais:

- **MenuItems**: Produtos do cardápio (pizzas, bebidas, sobremesas)
- **Orders**: Pedidos dos clientes
- **OrderItems**: Itens de cada pedido
- **Customers**: Cadastro de clientes
- **Tables**: Mesas do restaurante
- **Coupons**: Cupons de desconto

## 🔌 API Endpoints

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Buscar produto por ID
- `POST /api/products` - Criar novo produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Remover produto

### Pedidos
- `GET /api/orders` - Listar todos os pedidos
- `GET /api/orders/:id` - Buscar pedido por ID
- `POST /api/orders` - Criar novo pedido
- `PATCH /api/orders/:id/status` - Atualizar status do pedido

### Clientes
- `GET /api/customers` - Listar todos os clientes
- `GET /api/customers/:id` - Buscar cliente por ID
- `POST /api/customers` - Criar novo cliente
- `PUT /api/customers/:id` - Atualizar cliente
- `DELETE /api/customers/:id` - Remover cliente

### Mesas
- `GET /api/tables` - Listar todas as mesas
- `GET /api/tables/:id` - Buscar mesa por ID
- `POST /api/tables` - Criar nova mesa
- `PATCH /api/tables/:id/status` - Atualizar status da mesa
- `DELETE /api/tables/:id` - Remover mesa

### Cupons
- `GET /api/coupons` - Listar todos os cupons
- `GET /api/coupons/:code/validate` - Validar cupom
- `POST /api/coupons` - Criar novo cupom
- `PUT /api/coupons/:id` - Atualizar cupom
- `DELETE /api/coupons/:id` - Desativar cupom

### Relatórios
- `GET /api/reports` - Obter relatórios e estatísticas

## 🔧 Desenvolvimento Local (sem Docker)

### Backend

```bash
cd server
npm install
npm run dev
```

O backend estará disponível em `http://localhost:5000`

### Frontend

```bash
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

### SQL Server

Você precisará ter uma instância do SQL Server rodando localmente ou usar uma conexão remota. Configure as variáveis de ambiente no `.env`:

```env
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword
DB_NAME=PizzaPOSDB
```

Execute os scripts de inicialização:
```bash
sqlcmd -S localhost -U sa -P YourPassword -i database/init.sql
sqlcmd -S localhost -U sa -P YourPassword -i database/seed.sql
```

## 🌍 Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# SQL Server
DB_HOST=sqlserver
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourStrong@Password123
DB_NAME=PizzaPOSDB

# Backend API
API_PORT=5000
NODE_ENV=production

# Frontend
VITE_API_URL=http://localhost:5000/api

# Gemini API (opcional)
GEMINI_API_KEY=your_api_key_here
```

## 🐛 Troubleshooting

### Container do SQL Server não inicia
- Verifique se tem pelo menos 2GB de RAM disponível
- Verifique se a porta 1433 não está em uso: `netstat -an | findstr 1433`

### Erro "Database initialization failed"
- Aguarde mais tempo (pode levar até 1 minuto na primeira vez)
- Verifique os logs: `docker-compose logs sqlserver`

### Frontend não conecta com o backend
- Verifique se o backend está rodando: `docker-compose ps`
- Teste o health check: `curl http://localhost:5000/api/health`

### Resetar o banco de dados
```bash
docker-compose down -v
docker volume rm projeto_sqlserver-data
docker-compose up -d
```

## 📝 Dados de Exemplo

O sistema vem com dados pré-carregados:
- 8 pizzas no cardápio
- 5 bebidas
- 4 sobremesas
- 8 mesas
- 4 clientes cadastrados
- 4 cupons de desconto ativos

### Cupons disponíveis:
- `PRIMEIRACOMPRA` - 15% de desconto (pedido mín. R$ 30)
- `PIZZA10` - 10% de desconto (pedido mín. R$ 50)
- `DESCONTO20` - R$ 20 de desconto (pedido mín. R$ 100)
- `FRETEGRATIS` - R$ 10 de desconto

## 🛡️ Segurança

Em produção, lembre-se de:
- Alterar a senha do SQL Server
- Configurar CORS adequadamente
- Usar HTTPS
- Implementar autenticação e autorização
- Revisar rate limiting
- Atualizar as variáveis de ambiente

## 📄 Licença

Este projeto é privado e proprietário.

## 🤝 Contribuindo

Entre em contato com o time de desenvolvimento para contribuir com o projeto.