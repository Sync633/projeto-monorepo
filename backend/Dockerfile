# 1. Define a Imagem de origem base
FROM node:24-alpine

# Configura o diretório global do pnpm
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# 2. Define diretório de trabalho interno do container
WORKDIR /app

# 3. Instalar o pnpm globalmente para gerenciar as dependências
RUN npm install -g pnpm

# Desativa a restrição do pnpm 11
RUN pnpm config set strict-dep-builds false

# 4. Copia apena o manifetes de dependêcias
COPY package.json ./

# 5.Instalar as dependências do projeto
RUN pnpm install

# 6. Copia todo o restante do código
COPY . .

# 7. Expoe a porta padrão LDW
EXPOSE 3000

# 8. Comando para incializar a aplicação
CMD ["pnpm", "dev"]