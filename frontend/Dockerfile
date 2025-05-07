FROM node:20

# Рабочая директория
WORKDIR /usr/src/app

# Копируем package.json и установим зависимости
COPY package*.json ./
RUN npm install
#RUN npm install -g vite

# Копируем исходные файлы
COPY . .
EXPOSE 80

# Команда по умолчанию
RUN npm run build
CMD ["npm", "run", "preview"]