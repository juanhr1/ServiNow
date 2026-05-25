import mysql.connector
import bcrypt

from config import (
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_USUARIOS,
    DB_PORT
)

def get_conexion():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_USUARIOS,
        port=DB_PORT
    )

def hashear_password(password):
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(
        password.encode('utf-8'),
        salt
    )
    return hashed.decode('utf-8')

def verificar_password(
    password_ingresada,
    password_hash
):

    return bcrypt.checkpw(
        password_ingresada.encode('utf-8'),
        password_hash.encode('utf-8')
    )

def crear_usuario(
    email,
    contrasena,
    nombre,
    apellido,
    rol_nombre,
    datos_perfil=None
):
    try:
        conn = get_conexion()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id FROM usuarios WHERE email = %s",
            (email,)
        )

        if cursor.fetchone():

            return None, "Email ya registrado"

        cursor.execute(
            "SELECT id FROM roles WHERE nombre = %s",
            (rol_nombre,)
        )

        rol = cursor.fetchone()

        if not rol:

            return None, "Rol no existe"

        password_hash = hashear_password(
            contrasena
        )

        cursor.execute(
            """
            INSERT INTO usuarios
            (email, contrasena, nombre, apellido, rol_id)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                email,
                password_hash,
                nombre,
                apellido,
                rol['id']
            )
        )

        usuario_id = cursor.lastrowid

        if (
            rol_nombre == 'profesional'
            and datos_perfil
        ):

            cursor.execute(
                """
                INSERT INTO profesionales_perfil
                (usuario_id, oficio, tarifa, ciudad)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    usuario_id,
                    datos_perfil.get('oficio'),
                    datos_perfil.get('tarifa'),
                    datos_perfil.get('ciudad')
                )
            )

        elif (
            rol_nombre == 'cliente'
            and datos_perfil
        ):
            cursor.execute(
                """
                INSERT INTO clientes_perfil
                (usuario_id, ciudad)
                VALUES (%s, %s)
                """,
                (
                    usuario_id,
                    datos_perfil.get('ciudad')
                )
            )
        conn.commit()
        cursor.close()
        conn.close()
        return usuario_id, None
    except Exception as e:
        return None, str(e)

def autenticar_usuario(
    email,
    contrasena
):
    try:
        conn = get_conexion()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT
                u.id,
                u.email,
                u.nombre,
                r.nombre as rol,
                u.estado
            FROM usuarios u
            JOIN roles r
            ON u.rol_id = r.id
            WHERE u.email = %s
            """,
            (email,)
        )
        usuario = cursor.fetchone()

        if not usuario:
            cursor.close()
            conn.close()
            return None, "Credenciales inválidas"

        if usuario['estado'] != 'activo':
            cursor.close()
            conn.close()
            return None, f"Usuario {usuario['estado']}"

        cursor.execute(
            """
            SELECT contrasena
            FROM usuarios
            WHERE id = %s
            """,
            (usuario['id'],)
        )
        usuario_data = cursor.fetchone()
        if not verificar_password(
            contrasena,
            usuario_data['contrasena']
        ):
            cursor.close()
            conn.close()
            return None, "Credenciales inválidas"
        cursor.execute(
            """
            UPDATE usuarios
            SET ultimo_login = NOW()
            WHERE id = %s
            """,
            (usuario['id'],)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return usuario, None

    except Exception as e:
        return None, str(e)

def obtener_usuario(usuario_id):
    try:
        conn = get_conexion()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            """
            SELECT
                u.id,
                u.email,
                u.nombre,
                r.nombre as rol
            FROM usuarios u
            JOIN roles r
            ON u.rol_id = r.id
            WHERE u.id = %s
            """,
            (usuario_id,)
        )

        usuario = cursor.fetchone()

        cursor.close()
        conn.close()

        if not usuario:
            return None, "Usuario no encontrado"

        return usuario, None

    except Exception as e:
        return None, str(e)