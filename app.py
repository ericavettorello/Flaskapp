from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешаем CORS для работы с фронтендом


@app.route('/', methods=['GET'])
def home():
    """Главная страница приложения"""
    return jsonify({
        'message': 'Добро пожаловать в Flask-приложение!',
        'endpoints': {
            '/': 'Главная страница',
            '/info': 'Информация о приложении',
            '/health': 'Проверка состояния приложения',
            '/calc/<a>/<b>': 'Калькулятор (сложение двух чисел)'
        }
    })


@app.route('/info', methods=['GET'])
def info():
    """Информация о приложении"""
    return jsonify({
        'app_name': 'Flask Simple App',
        'version': 'latest',
        'description': 'Простое Flask-приложение с базовыми эндпоинтами',
        'author': 'Flask Developer'
    })


@app.route('/health', methods=['GET'])
def health():
    """Проверка состояния приложения (health check)"""
    return jsonify({
        'status': 'healthy',
        'service': 'Flask Simple App',
        'version': 'latest'
    }), 200


@app.route('/calc/<int:a>/<int:b>', methods=['GET'])
def calc(a, b):
    """Калькулятор: складывает два числа"""
    result = a + b
    return jsonify({
        'operation': 'addition',
        'a': a,
        'b': b,
        'result': result
    })


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug, host='0.0.0.0', port=port)

