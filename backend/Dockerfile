# Imagem base
FROM node:18

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
COPY . .

# Instala dependências
RUN npm install

# Expõe a porta da API
EXPOSE 3000

# Inicia o servidor
CMD ["node", "server.js"]
