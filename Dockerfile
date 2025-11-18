# Используем официальный Python образ
FROM python:3.10-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файл зависимостей
COPY requirements.txt .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код приложения
COPY app.py .

# Открываем порт 5001
EXPOSE 5001

# Устанавливаем переменные окружения
ENV FLASK_APP=app.py
ENV PORT=5001
ENV FLASK_DEBUG=False

# Запускаем приложение
CMD ["python", "app.py"]

