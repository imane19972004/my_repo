FROM node:22.14

WORKDIR /app

COPY package*.json ./

RUN ls
RUN npm install

COPY . .

# Port interne du backend
EXPOSE 9428

# Healthcheck sur /api/status toute les 30s
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:9428/api/status | grep -q '"ok"'

CMD ["npm", "run", "dev"]