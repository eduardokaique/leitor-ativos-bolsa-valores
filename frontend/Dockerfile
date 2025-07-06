# Etapa 1: Build do Angular
FROM node:22.12-alpine AS build

WORKDIR /app

# Copia package.json e package-lock.json (se existir) para instalar dependências
COPY package*.json ./

RUN npm install

# Copia o restante do código
COPY . .

# Build de produção do Angular
RUN npm run build -- --configuration production

# Etapa 2: Servir arquivos estáticos via Nginx
FROM nginx:alpine

# Remove conteúdo default do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia build do Angular da etapa anterior para o diretório padrão do nginx
COPY --from=build app/dist/leitor-ativos/browser /usr/share/nginx/html

# Expor a porta 80 (padrão do nginx)
EXPOSE 80

# Comando padrão do nginx já está configurado para rodar em foreground
