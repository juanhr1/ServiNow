import bcrypt

password = "admin"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

print("Hash generado para 'admin':")
print(hashed)