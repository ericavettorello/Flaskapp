# Используем легковесный nginx для раздачи статических файлов
FROM nginx:alpine

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем файлы фронтенда
COPY . /usr/share/nginx/html

# Открываем порт 80
EXPOSE 80

# Nginx уже запущен по умолчанию в базовом образе
