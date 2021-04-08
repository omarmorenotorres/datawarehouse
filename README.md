# DATAWAREHOUSE

En este proyecto existen tres carpetas. La primera denominada server, la cual contiene los archivos para correr el api del proyecto. La segunda client, la cual contienen los archivos del cliente del proyecto. POr último la carpeta dump, la cual contiene las colecciones pobladas correspondientes a la base de datos del proyecto.

# STACK DE TECNOLOGÍAS
+ Boostrap
+ Javascript
+ Nodejs
+ MongoDB

# PRECONDICIONES
1. Asegurese de tener instalado npm
2. Asegurese de tener instalado nodejs
3. Asegurese de tener instalado MongoDB
4. El proyecto quedara correindo en el puerto local 3000

# CREAR BASE DE DATOS.
1. Asegurese de tener instalado mongoDB.
2. Ubiquese en la raíz del proyecto server.
3. Ejecute el comando mongorestore --db datawarehouse dump/shop. Este le permitirá cargar la base de datos del proyecto (Revise el path del backaup, se encuentra en la carpeta dump).
4. Use el comando mongo para accedere a la consola de mongo.
5. Una vez este en la consola de mongo, ejecute el comando show dbs. Asegurese de tener una nueva base de datos denominada datawarehouse.
6. Esta base de datos deberá tener 7 colecciones.

# CORRER SERVER
1. Abrir el proyecto server en su IDE predilecto. Se recomienda Visual Studio.
2. Abra una terminal en la raíz del proyecto.
3. Asegurese que este en el path /server.
4. Ejecute el comando npm install.
5. Ejecute nodemon index.js
6. Le deberá aparecer el mensaje: 

Conexión a la base de datos establecida
API REST corriendo en localhost://3000

# CORRER CLIENT
1. Abra la carpeta llamada client en su ide favorito. Se recomienda Visual Studio.
2. Abra el archivo index.html

# INSERCIÓN EN LA BASE DE DATOS

1. Abra una terminal.
2. Entre al gestor de mongoDB
