FROM node:17-slim

# Adicione o repositório do MongoDB e a chave GPG
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add - \
    && echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/5.0 main" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list \
    && apt-get update \
    && apt-get install -y mongodb-org \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /fastFood

COPY . .

RUN npm install \
    && npm run build

# Adicionando permissões à pasta ./data/db
RUN mkdir -p /data/db \
    && chmod -R 777 /data/db

CMD ["npm", "run", "start"]
