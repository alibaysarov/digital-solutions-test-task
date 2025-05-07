FROM node:20

# Рабочая директория
WORKDIR /usr/src/app
RUN npm install -g vite
# Копируем package.json и установим зависимости
COPY package*.json ./
RUN npm install --include=dev

ENV PATH="/usr/src/app/node_modules/.bin:${PATH}"
# Копируем исходные файлы
COPY . .
EXPOSE 80

# Команда по умолчанию
RUN npm run build
CMD ["npx", "vite", "preview"]