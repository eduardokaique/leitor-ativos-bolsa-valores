# 📈 Leitor de Ativos

Aplicação web para consulta de preços históricos de ativos financeiros, como ações da bolsa de valores. Desenvolvido com Angular no frontend e Node.js (Express) no backend, consumindo dados de uma API de mercado financeiro.

---

## ⚙️ Tecnologias

- **Frontend:** Angular + NGINX
- **Backend:** Node.js + Express
- **API externa:** [API de séries temporais financeiras](https://www.alphavantage.co/) (exemplo)
- **Docker:** Docker + Docker Compose

---

## 🖼️ Funcionalidades

### ✅ Funcionalidades Atuais
- Consulta de preços históricos de ativos.
- Gráfico com os valores históricos (últimos 60 períodos).
- Interface leve e responsiva para pesquisa de ativos por código (ex: `PETR4`, `VALE3`, etc).

### ❌ Funcionalidades Em Desenvolvimento
- Previsão de preços com IA (modelos de regressão).
- Treinamento de modelos preditivos.

---

## 🚀 Como executar localmente

### Pré-requisitos

- Docker e Docker Compose instalados

### Passos

```bash
# Clone o projeto
git clone https://github.com/eduardokaique/leitor-ativos-bolsa-valores.git
cd leitor-ativos-bolsa-valores

# Crie o arquivo .env na raiz da pasta backend com as variáveis:
# .env
API_KEY=your_api_key
BASE_URL=https://api.exemplo.com

# Suba os containers
docker-compose up --build

### Acesso

- Frontend: http://localhost
- Backend: [http://localhost:3000/api/ativo](https://api.twelvedata.com)
