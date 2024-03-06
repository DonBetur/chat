# Use the official Node.js image
FROM node:18.14.0

# Set the working directory
WORKDIR /usr/src/docker-frontend

# Копирование package.json to the container
COPY ./package.json .

# Если package-lock.json существует, копировать его в контейнер
COPY ./package-lock.json* .

# Установка зависимостей
RUN npm install --force

# Установка global nest cli
RUN npm install -g @angular/cli

# Копирование остальных файлов приложения в контейнер
COPY . .
