# Slack Bot Invoices

Bot do Slack desenvolvido para auxiliar a Help Agency na administração de faturas.

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Slack Bolt](https://slack.dev/bolt-js/tutorial/getting-started)
- [Supabase](https://supabase.com/)
- [Express](https://expressjs.com/)

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## 🔧 Instalação

1. Clone o repositório
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências
```bash
yarn install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
```env
SLACK_BOT_TOKEN=seu-token-do-slack
SLACK_SIGNING_SECRET=seu-signing-secret
SUPABASE_URL=sua-url-do-supabase
SUPABASE_KEY=sua-chave-do-supabase
```

## 🏃‍♂️ Executando o projeto

Para executar o projeto em modo de desenvolvimento:

```bash
yarn dev
```

## 📁 Estrutura do Projeto

```
src/
├── app.ts         # Arquivo principal da aplicação
├── commands/      # Comandos do bot
├── events/        # Manipuladores de eventos do Slack
└── lib/          # Utilitários e configurações
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Help Agency Team 