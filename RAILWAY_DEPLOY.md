# Deploy no Railway - Contexto Assessoria Contábil

Este guia explica como fazer o deploy do site no Railway.

## Pré-requisitos

1. Conta no [Railway](https://railway.app/)
2. Repositório GitHub conectado: `danilolimaCabral/contexto-contabil`

## Passo a Passo

### 1. Criar Novo Projeto no Railway

1. Acesse [railway.app](https://railway.app/) e faça login
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Conecte sua conta GitHub se ainda não estiver conectada
5. Selecione o repositório `contexto-contabil`

### 2. Adicionar Banco de Dados MySQL

1. No projeto, clique em **"+ New"**
2. Selecione **"Database"** → **"MySQL"**
3. O Railway criará automaticamente um banco MySQL
4. Copie a variável `DATABASE_URL` gerada

### 3. Configurar Variáveis de Ambiente

No painel do serviço, vá em **"Variables"** e adicione:

#### Variáveis Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL do banco MySQL | (copiada do passo anterior) |
| `JWT_SECRET` | Chave secreta para sessões | `gere-uma-string-aleatoria-de-32-caracteres` |
| `PORT` | Porta do servidor | `3000` |

#### Variáveis Opcionais (para funcionalidades extras)

| Variável | Descrição | Necessário para |
|----------|-----------|-----------------|
| `BUILT_IN_FORGE_API_KEY` | API key do Forge | Chatbot com IA |
| `BUILT_IN_FORGE_API_URL` | URL da API Forge | Chatbot com IA |
| `AWS_ACCESS_KEY_ID` | Credencial AWS | Upload de documentos |
| `AWS_SECRET_ACCESS_KEY` | Credencial AWS | Upload de documentos |
| `S3_BUCKET` | Nome do bucket S3 | Upload de documentos |

### 4. Configurar Domínio

1. No painel do serviço, vá em **"Settings"**
2. Em **"Networking"**, clique em **"Generate Domain"**
3. Ou adicione um domínio personalizado

### 5. Deploy

O Railway fará o deploy automaticamente quando você:
- Fizer push para o branch `main`
- Clicar em **"Deploy"** manualmente

## Comandos de Build

O Railway executará automaticamente:

```bash
pnpm install
pnpm build
pnpm start
```

## Health Check

O endpoint `/api/health` está configurado para verificação de saúde do serviço.

## Migração do Banco de Dados

Após o primeiro deploy, execute as migrações:

1. Acesse o terminal do Railway (aba **"Shell"**)
2. Execute: `pnpm db:push`

## Troubleshooting

### Erro de conexão com banco de dados
- Verifique se `DATABASE_URL` está correta
- Certifique-se de que o banco MySQL está rodando

### Erro de build
- Verifique os logs em **"Deployments"**
- Certifique-se de que todas as dependências estão no `package.json`

### Chatbot não funciona
- Configure `BUILT_IN_FORGE_API_KEY` e `BUILT_IN_FORGE_API_URL`
- Ou substitua por outra API de LLM (OpenAI, etc.)

## Estrutura de Arquivos de Configuração

```
├── railway.toml      # Configuração do Railway
├── nixpacks.toml     # Configuração do Nixpacks
├── package.json      # Scripts de build/start
└── RAILWAY_DEPLOY.md # Este arquivo
```

## Suporte

Para dúvidas sobre o código, abra uma issue no GitHub.
Para dúvidas sobre o Railway, consulte a [documentação oficial](https://docs.railway.app/).
