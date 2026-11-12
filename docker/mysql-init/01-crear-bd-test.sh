#!/bin/sh
# Crea la base de datos de PRUEBAS (sabitech_test) y da permisos al usuario de la aplicación.
# Los tests usan esta base de datos y nunca la de desarrollo (sabitech_web).
#
# - Con un volumen de MySQL nuevo se ejecuta sola al arrancar el contenedor.
# - Con un volumen que ya existe, ejecútala a mano una vez:
#     docker compose exec db sh /docker-entrypoint-initdb.d/01-crear-bd-test.sh
mysql -uroot -p"$MYSQL_ROOT_PASSWORD" -e "
  CREATE DATABASE IF NOT EXISTS sabitech_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  GRANT ALL PRIVILEGES ON sabitech_test.* TO '$MYSQL_USER'@'%';
  FLUSH PRIVILEGES;
"
