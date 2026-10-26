# ==============================================================================
# Estágio 1: Build da Aplicação
# ==============================================================================
FROM node:24-alpine AS builder

WORKDIR /app

# Instala o pnpm globalmente (evita problemas com corepack e semver)
RUN npm install -g pnpm@latest

# Desativa a restrição do pnpm 11 antes da instalação
RUN pnpm config set strict-dep-builds false

# Copia os manifestos de dependências (hífen correto: pnpm-lock.yaml)
COPY package.json pnpm-lock.yaml* ./

# Instala todas as dependências (com frozen-lockfile correto)
RUN pnpm install --frozen-lockfile

# Copia código-fonte e configuração do TypeScript
COPY tsconfig.json ./
COPY src ./src

# Compila o TypeScript gerando a pasta dist/
RUN pnpm run build

# Comentado para manter o tsx disponível quando rodar via docker-compose (pnpm dev)
# RUN pnpm prune --prod

# ==============================================================================
# Estágio 2: Imagem Final de Execução
# ==============================================================================
FROM node:24-alpine AS runner

WORKDIR /app

# Instala o pnpm aqui também porque o docker-compose chama "command: pnpm dev"
RUN npm install -g pnpm@latest

ENV NODE_ENV=development
ENV PORT=3000

# Copia do estágio de build (agora com o tsx incluso em node_modules)
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]