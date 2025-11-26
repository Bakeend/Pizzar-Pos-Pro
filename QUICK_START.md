# 🚀 Guia Rápido - Pizza POS Pro

## Início Rápido (3 passos)

### 1. Configure o ambiente (opcional)
```bash
copy .env.example .env
```

### 2. Inicie tudo com Docker
```bash
docker-compose up -d
```

### 3. Acesse a aplicação
- Frontend: http://localhost
- API: http://localhost:5000/api

## Comandos Essenciais

### Ver o que está rodando
```bash
docker-compose ps
```

### Ver logs em tempo real
```bash
docker-compose logs -f
```

### Parar tudo
```bash
docker-compose down
```

### Resetar banco de dados (CUIDADO: apaga tudo!)
```bash
docker-compose down -v
docker-compose up -d
```

### Acessar SQL Server diretamente
```bash
docker-compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong@Password123"
```

## Cupons de Teste

Use estes códigos no checkout:
- `PRIMEIRACOMPRA` - 15% off (mín. R$ 30)
- `PIZZA10` - 10% off (mín. R$ 50)
- `DESCONTO20` - R$ 20 off (mín. R$ 100)
- `FRETEGRATIS` - R$ 10 off

## Problemas Comuns

**Container não inicia?**
```bash
docker-compose down
docker-compose up -d
```

**Precisa reconstruir?**
```bash
docker-compose build --no-cache
docker-compose up -d
```

**Ver erros do SQL Server?**
```bash
docker-compose logs sqlserver
```

## Estrutura de Arquivos Importantes

```
pizza-pos-pro/
├── docker-compose.yml       ← Configuração principal
├── .env                      ← Variáveis de ambiente
├── Dockerfile               ← Build do frontend
├── server/
│   ├── Dockerfile           ← Build do backend
│   └── src/
│       └── server.ts        ← Servidor Node.js
└── database/
    ├── init.sql             ← Schema do banco
    └── seed.sql             ← Dados iniciais
```

## Próximos Passos

1. ✅ Sistema está rodando
2. 📝 Personalize o cardápio em `/api/products`
3. 🎨 Ajuste o frontend em `src/`
4. 🔐 Configure autenticação (se necessário)
5. 🚀 Deploy em produção

---

**Dúvidas?** Veja o [README.md](./README.md) completo.
