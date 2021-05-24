# Generate a pair of RSSA keys (private and public)

## OpenSSL

openssl req -newkey rsa:2048 -new -nodes -keyout administrator-auth.private -out administrator-auth.csr
openssl x509 -req -days 365 -in administrator-auth.csr -signkey administrator-auth.private -out administrator-auth.public

openssl req -newkey rsa:2048 -new -nodes -keyout administrator-auth-refresh.private -out administrator-auth-refresh.csr
openssl x509 -req -days 365 -in administrator-auth-refresh.csr -signkey administrator-auth-refresh.private -out administrator-auth-refresh.public

openssl req -newkey rsa:2048 -new -nodes -keyout user-auth.private -out user-auth.csr
openssl x509 -req -days 365 -in user-auth.csr -signkey user-auth.private -out user-auth.public

openssl req -newkey rsa:2048 -new -nodes -keyout user-auth-refresh.private -out user-auth-refresh.csr
openssl x509 -req -days 365 -in user-auth-refresh.csr -signkey user-auth-refresh.private -out user-auth-refresh.public
