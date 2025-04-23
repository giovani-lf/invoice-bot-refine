# Slack Bot Invoices

Bot do Slack desenvolvido para auxiliar a Refine Agency na administração de faturas.

## 🤖 Funcionalidades

- Registro de faturas com múltiplos serviços
- Cálculo automático de valores em tokens e stablecoins
- Visualização detalhada das faturas
- Suporte a múltiplos clientes
- Interface intuitiva através de modais do Slack

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

## 📸 Screenshots

### Resumo da Fatura
![Invoice Summary](./assets/invoice-summary.png)

### Registro de Nova Fatura
![Invoice Setup Step 1](./assets/invoice-setup-1.png)
![Invoice Setup Step 2](./assets/invoice-setup-2.png)

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

- [@davioliveeira](https://github.com/davioliveeira)

---

# [English Version] Slack Bot Invoices

Slack Bot developed to assist Refine Agency with invoice management.

## 🤖 Features

- Invoice registration with multiple services
- Automatic calculation of token and stablecoin values
- Detailed invoice visualization
- Support for multiple clients
- Intuitive interface through Slack modals

## 🚀 Technologies

This project was developed using the following technologies:

- [Node.js](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Slack Bolt](https://slack.dev/bolt-js/tutorial/getting-started)
- [Supabase](https://supabase.com/)
- [Express](https://expressjs.com/)

## 📋 Prerequisites

Before starting, you'll need to have installed on your machine:
- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

## 🔧 Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
yarn install
```

3. Configure environment variables
Create a `.env` file in the project root and add the following variables:
```env
SLACK_BOT_TOKEN=your-slack-token
SLACK_SIGNING_SECRET=your-signing-secret
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

## 🏃‍♂️ Running the project

To run the project in development mode:

```bash
yarn dev
```

## 📸 Screenshots

### Invoice Summary
![Invoice Summary](./assets/invoice-summary.png)

### New Invoice Registration
![Invoice Setup Step 1](./assets/invoice-setup-1.png)
![Invoice Setup Step 2](./assets/invoice-setup-2.png)

## 📁 Project Structure

```
src/
├── app.ts         # Main application file
├── commands/      # Bot commands
├── events/        # Slack event handlers
└── lib/          # Utilities and configurations
```

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 👥 Authors

- [@davioliveeira](https://github.com/davioliveeira) 