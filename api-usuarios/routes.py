from flask import jsonify, request
from config import (
    generar_access_token,
    generar_refresh_token,
    verificar_token
)

from models import (
    autenticar_usuario,
    crear_usuario,
    obtener_usuario
)

def registrar_rutas(app):

    @app.route('/registro', methods=['POST'])
    def registro():

        try:
            data = request.get_json()
            rol = data.get('rol', 'cliente')
            if rol not in ['cliente', 'profesional']:
                return jsonify({'error': 'Rol inválido'}), 400
            email = data.get('email')
            contrasena = data.get('contrasena')
            nombre = data.get('nombre')
            apellido = data.get('apellido', '')

            if not all([email, contrasena, nombre]):
                return jsonify({
                    'error': 'Faltan campos obligatorios'
                }), 400

            datos_perfil = {'ciudad': data.get('ciudad')}

            if rol == 'profesional':

                datos_perfil['oficio'] = data.get('oficio')
                datos_perfil['tarifa'] = data.get('tarifa')

            usuario_id, error = crear_usuario(
                email,
                contrasena,
                nombre,
                apellido,
                rol,
                datos_perfil
            )

            if error:
                return jsonify({'error': error}), 400

            return jsonify({
                'mensaje': 'Usuario registrado exitosamente',
                'usuario_id': usuario_id
            }), 201

        except Exception as e:

            return jsonify({
                'error': str(e)
            }), 500


    @app.route('/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            email = data.get('email')
            contrasena = data.get('contrasena')
            if not email or not contrasena:
                return jsonify({
                    'error': 'Falta email o contraseña'
                }), 400
            usuario, error = autenticar_usuario(
                email,
                contrasena
            )
            if error:
                return jsonify({
                    'error': error
                }), 401
            access_token = generar_access_token(
                usuario['id'],
                usuario['email'],
                usuario['rol']
            )
            refresh_token = generar_refresh_token(
                usuario['id']
            )
            return jsonify({
                'mensaje': 'Login exitoso',
                'access_token': access_token,
                'refresh_token': refresh_token,
                'usuario': {
                    'id': usuario['id'],
                    'email': usuario['email'],
                    'nombre': usuario['nombre'],
                    'rol': usuario['rol']
                }
            }), 200

        except Exception as e:

            return jsonify({
                'error': str(e)
            }), 500


    @app.route('/refresh', methods=['POST'])
    def refresh():

        try:
            data = request.get_json()
            refresh_token_recibido = data.get(
                'refresh_token'
            )
            if not refresh_token_recibido:
                return jsonify({
                    'error': 'Falta refresh_token'
                }), 400
            payload, error = verificar_token(
                refresh_token_recibido
            )
            if error:
                return jsonify({
                    'error': error
                }), 401
            usuario, error = obtener_usuario(
                payload['usuario_id']
            )
            if error:
                return jsonify({
                    'error': error
                }), 404
            nuevo_access_token = generar_access_token(
                usuario['id'],
                usuario['email'],
                usuario['rol']
            )
            return jsonify({
                'access_token': nuevo_access_token,
                'mensaje': 'Token renovado exitosamente'
            }), 200

        except Exception as e:

            return jsonify({
                'error': str(e)
            }), 500