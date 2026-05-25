DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = '12345678'
DB_USUARIOS = 'servinow_usuarios'
DB_PROFESIONALES = 'servinow_profesionales'
DB_PORT = 3306

# JWT
JWT_SECRET_KEY = 'servinow_secret_global_2025'
JWT_ACCESS_EXPIRATION = 3600  # 1 hora
JWT_REFRESH_EXPIRATION = 604800  # 7 días

# API
API_PORT = 5000
API_HOST = 'localhost'
DEBUG = True

import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify


def generar_access_token(usuario_id, email, rol):
    """Generar token de acceso (válido 1 hora)"""
    payload = {
        'usuario_id': usuario_id,
        'email': email,
        'rol': rol,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(seconds=JWT_ACCESS_EXPIRATION)
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    return token

def generar_refresh_token(usuario_id):
    """Generar token de refresco (válido 7 días)"""
    payload = {
        'usuario_id': usuario_id,
        'iat': datetime.utcnow(),
        'exp': datetime.utcnow() + timedelta(seconds=JWT_REFRESH_EXPIRATION)
    }
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    return token

def verificar_token(token):
    """Verificar y decodificar token JWT"""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=['HS256'])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, "Token expirado"
    except jwt.InvalidTokenError:
        return None, "Token inválido"

def token_y_rol_requerido(roles_permitidos=None):
    """Decorador que protege rutas - verifica JWT y valida rol"""
    def decorador(f):
        @wraps(f)
        def decorado(*args, **kwargs):
            token = None
            
            # Obtener token del header Authorization
            if 'Authorization' in request.headers:
                header = request.headers['Authorization']
                try:
                    token = header.split(" ")[1]  # "Bearer <token>"
                except IndexError:
                    return jsonify({'error': 'Formato inválido en Authorization header'}), 401
            
            if not token:
                return jsonify({'error': 'Falta el header Authorization'}), 401
            
            # Verificar token
            payload, error = verificar_token(token)
            
            if error:
                return jsonify({'error': error}), 401
            
            # Validar rol si es especificado
            if roles_permitidos and payload['rol'] not in roles_permitidos:
                return jsonify({'error': f'No tienes permiso. Roles requeridos: {roles_permitidos}'}), 403
            
            # Guardar datos del usuario en request
            request.usuario_id = payload['usuario_id']
            request.usuario_email = payload['email']
            request.usuario_rol = payload['rol']
            
            return f(*args, **kwargs)
        
        return decorado
    return decorador