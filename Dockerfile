# --------------------
# 1) Builder stage
# --------------------
FROM node:20-slim AS builder
WORKDIR /usr/src/app

# Копируем lock-файлы и package.json для кэширования слоёв
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (нужны dev-зависимости для сборки)
RUN npm ci

# Копируем весь проект
COPY . .

# Выполняем сборку (в этом шаге могут проявиться ошибки из-за регистра/путей)
RUN npm run build


# --------------------
# 2) Production stage
# --------------------
FROM node:20-slim AS runner
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Копируем package*.json и ставим только prod-зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем собранные артефакты из builder
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public

# Копируем конфиг/манифесты (по необходимости)
COPY --from=builder /usr/src/app/next.config.* ./
COPY --from=builder /usr/src/app/package.json ./

EXPOSE 3000
CMD ["npm", "run", "start"]
