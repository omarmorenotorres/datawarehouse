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
2.1 Asegurese de tener instalado las mongo tools. Si no lo tiene use el comando:

sudo apt install mongo-tools

Si no usa linux como sistema operativo asegurese de usar el comando equivalente.

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
2. Abra el archivo index.html. Desde el IDE Visual Studio, de click en el botón derecho, seleccione la opción Open with Live Server. Se abrirá un navegador con la ejecución del index.
3. Se recomienda usar navegador Firefox.
4. Se necesita tener instalado el complemento de Test Cors corriendo ya que por el consumo de API puede generar un error de origen cruzado.

# USUARIOS

Existen dos tipos de usuarios: los usuarios admin que tienen todos los permisos de acceso al sistema, y los usuarios invitados, los caules tienen restricciones de acceso.


+ User Admin
email: bri.reyes@gmail.com
pass: 12345

+ User Invitado
email: omar.moreno@gmail.com
pass: 12345

