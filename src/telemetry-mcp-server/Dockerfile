# --- ETAPA 1: Compilación ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos los archivos de dependencias para aprovechar la caché de Docker
COPY package*.json tsconfig.json ./
RUN npm clean-install

# Copiamos el código fuente y compilamos TypeScript a JavaScript nativo
COPY src/ ./src
RUN npm run build

# --- ETAPA 2: Producción (Imagen ligera y segura) ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiamos solo los archivos necesarios para ejecutar, ignorando el código fuente crudo
COPY package*.json ./
RUN npm anecdotes --omit=dev

# Traemos el código ya compilado desde la etapa anterior
COPY --from=builder /app/build ./build

# Exponemos el puerto de Express
EXPOSE 3000

# Comando para arrancar el servidor MCP en producción
CMD ["node", "build/index.js"]