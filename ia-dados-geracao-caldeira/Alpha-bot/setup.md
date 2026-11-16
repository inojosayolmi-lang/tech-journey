#  Guia de Instalação - Chat Bot com Google Drive & Gemini AI

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior) - [Download aqui](https://nodejs.org/)
- Conta Google com acesso ao Google Drive
- Conta Google Cloud Platform

---

## 🔧 Passo 1: Configurar Google Cloud Platform

### 1.1 Criar Projeto no Google Cloud

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Novo Projeto"
3. Dê um nome ao projeto (ex: "chatbot-drive")
4. Clique em "Criar"

### 1.2 Ativar APIs Necessárias

1. No menu lateral, vá em **"APIs e Serviços" > "Biblioteca"**
2. Procure e ative as seguintes APIs:
   - **Google Drive API**
   - **Google Sheets API**

### 1.3 Criar Credenciais de Conta de Serviço

1. Vá em **"APIs e Serviços" > "Credenciais"**
2. Clique em **"Criar Credenciais" > "Conta de Serviço"**
3. Preencha:
   - Nome: `chatbot-service`
   - ID: `chatbot-service` (gerado automaticamente)
4. Clique em **"Criar e Continuar"**
5. Selecione o papel: **"Editor"**
6. Clique em **"Concluir"**

### 1.4 Baixar Arquivo de Credenciais

1. Clique na conta de serviço criada
2. Vá na aba **"Chaves"**
3. Clique em **"Adicionar Chave" > "Criar nova chave"**
4. Escolha o formato **JSON**
5. Clique em **"Criar"**
6. O arquivo `credentials.json` será baixado
7. **Salve este arquivo na pasta raiz do seu projeto**

---

## 📁 Passo 2: Configurar Google Drive

### 2.1 Criar Pasta no Drive

1. Acesse [Google Drive](https://drive.google.com/)
2. Crie uma nova pasta (ex: "Planilhas ChatBot")
3. Adicione suas planilhas do Google Sheets nesta pasta

### 2.2 Compartilhar Pasta com a Conta de Serviço

1. Abra o arquivo `credentials.json` que você baixou
2. Procure pelo campo `"client_email"` (exemplo: `chatbot-service@seu-projeto.iam.gserviceaccount.com`)
3. Copie este email
4. No Google Drive, clique com botão direito na pasta que você criou
5. Clique em **"Compartilhar"**
6. Cole o email da conta de serviço
7. Dê permissão de **"Leitor"**
8. Clique em **"Enviar"**

### 2.3 Obter ID da Pasta

1. Abra a pasta no Google Drive
2. Olhe na URL do navegador
3. O ID está após `/folders/`
   - Exemplo: `https://drive.google.com/drive/folders/1ABC_defGHI-jklMNO`
   - ID: `1ABC_defGHI-jklMNO`
4. **Copie este ID**

---

## 💻 Passo 3: Instalar o Projeto

### 3.1 Estrutura de Arquivos

Crie a seguinte estrutura de pastas:

```
chatbot-project/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server.js
├── package.json
├── credentials.json (arquivo baixado do Google Cloud)
├── .env
└── .gitignore
```

### 3.2 Criar arquivo .env

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
PORT=3000
GEMINI_API_KEY=AIzaSyCp_zyRljSLHmnjJscZQlvQi5DvK5e5Kf8
DRIVE_FOLDER_ID=COLE_AQUI_O_ID_DA_SUA_PASTA
GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
```

**⚠️ IMPORTANTE:** Substitua `COLE_AQUI_O_ID_DA_SUA_PASTA` pelo ID da pasta que você copiou no Passo 2.3

### 3.3 Criar arquivo .gitignore

Crie um arquivo `.gitignore` para não subir arquivos sensíveis:

```
node_modules/
.env
credentials.json
```

### 3.4 Instalar Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

---

## 🚀 Passo 4: Executar o Bot

### 4.1 Mover Arquivos HTML, CSS e JS

1. Crie uma pasta chamada `public` na raiz do projeto
2. Mova os arquivos para dentro da pasta `public`:
   - `index.html`
   - `styles.css`
   - `script.js`

### 4.2 Iniciar o Servidor

No terminal, execute:

```bash
npm start
```

Ou para desenvolvimento com auto-reload:

```bash
npm run dev
```

Você verá:

```
🚀 Servidor rodando na porta 3000
📊 Atualizando cache inicial...
Cache atualizado com sucesso!
✅ Bot pronto para uso!
```

### 4.3 Acessar o Chat Bot

Abra seu navegador e acesse:

```
http://localhost:3000
```

---

## ✅ Passo 5: Testar o Bot

### Exemplos de Perguntas:

1. **"Quais planilhas você tem acesso?"**
2. **"Me mostre os dados da planilha [nome]"**
3. **"Quantas linhas tem na planilha [nome]?"**
4. **"Me dê um resumo dos dados"**
5. **"Qual é o total de [coluna] na planilha [nome]?"**

---

## 🔍 Resolução de Problemas

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "ENOENT: no such file or directory, open './credentials.json'"
- Verifique se o arquivo `credentials.json` está na pasta raiz do projeto

### Erro: "The caller does not have permission"
- Verifique se compartilhou a pasta do Drive com o email da conta de serviço
- Confirme se o email está correto no campo `client_email` do `credentials.json`

### Erro: "Invalid API key"
- Verifique se a API Key do Gemini está correta no arquivo `.env`

### Bot não responde com dados das planilhas
- Confirme se o ID da pasta está correto no `.env`
- Verifique se há planilhas do Google Sheets na pasta
- Aguarde alguns segundos para o cache atualizar

---

## 📚 Comandos Úteis

```bash
# Iniciar servidor
npm start

# Iniciar em modo desenvolvimento
npm run dev

# Ver status do servidor
curl http://localhost:3000/api/health

# Listar planilhas disponíveis
curl http://localhost:3000/api/sheets

# Forçar atualização do cache
curl -