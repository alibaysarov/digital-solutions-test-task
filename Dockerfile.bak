# Используем Node.js 21
FROM node:21

# Рабочая директория
WORKDIR /usr/src/app

# Копируем package.json и установим зависимости
COPY package*.json ./
RUN npm ci --only=development

# Копируем исходные файлы
COPY . .

# Устанавливаем production-зависимости
RUN npm ci --only=production

# Команда по умолчанию
CMD ["npm", "start"]