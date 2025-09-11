# --------------------
# 1. Build stage
# --------------------
FROM node:20-slim AS builder

# Рабочая директория (не совпадает с "app" из Next.js)
WORKDIR /usr/src/app

# Копируем только package.json и lock-файлы для кэша
COPY package*.json ./

# Устанавливаем все зависимости (и dev, и prod — нужны для билда)
RUN npm install

# Копируем весь проект
COPY . .

# Сборка Next.js (SSR + статические ассеты)
RUN npm run build


# --------------------
# 2. Production stage
# --------------------
FROM node:20-slim AS runner

WORKDIR /usr/src/app

# Устанавливаем только прод-зависимости
COPY package*.json ./
RUN npm install --omit=dev

# Копируем собранное приложение из builder
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/next.config.* ./ 
COPY --from=builder /usr/src/app/tsconfig.json ./ 

# Экспонируем порт
EXPOSE 3000

# Запускаем Next.js
CMD ["npm", "run", "start"]
