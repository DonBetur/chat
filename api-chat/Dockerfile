# Use the official Node.js image
FROM node:18.14.0

# Set the working directory
WORKDIR /usr/src/docker-backend

# Копирование package.json to the container
COPY ./package.json .

# Если package-lock.json существует, копировать его в контейнер
COPY ./package-lock.json* .

# Установка зависимостей
RUN npm install

# Установка global nest cli
RUN npm install -g @nestjs/cli

# Копирование остальных файлов приложения в контейнер
COPY . .
