from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from config import (DB_HOST, DB_USER, DB_PASSWORD, DB_USUARIOS, DB_PORT,
                    generar_access_token, generar_refresh_token, verificar_token,
                    token_y_rol_requerido)
from models import autenticar_usuario, crear_usuario, obtener_usuario, get_conexion
from routes import registrar_rutas  # Import routes and register them

app = Flask(__name__)
CORS(app)

registrar_rutas(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'API Usuarios activa', 'puerto': 5000}), 200

@app.errorhandler(404)
def no_encontrado(error):
    return jsonify({'error': 'Ruta no encontrada'}), 404

@app.errorhandler(500)
def error_servidor(error):
    return jsonify({'error': 'Error interno del servidor'}), 500

if __name__ == '__main__':
    print("\n" + "="*50)
    print("INICIANDO API USUARIOS (CENTRAL)")
    print("="*50)
    print("URL: http://localhost:5000")
    print("="*50 + "\n")
    app.run(host='localhost', port=5000, debug=True)