FROM node:20

# Рабочая директория
WORKDIR /usr/src/app

# Копируем package.json и установим зависимости
COPY package*.json ./
RUN npm install

# Копируем исходные файлы
COPY . .
EXPOSE 80

# Команда по умолчанию
RUN npm run build
#RUN npm run preview