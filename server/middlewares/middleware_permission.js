const jwt = require('jwt-simple');
//const Sequelize = require('sequelize');
//const { QueryTypes } = require('sequelize');
//const User = require('./models/user');
const User = require('../models/user');

/*const sequelize = new Sequelize('delilah_resto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});*/

const checkPermission = async (req, res, next) => {
    console.log(123);
    
    const userToken = req.headers['user-token'];
        let payload = {};
        payload = jwt.decode(userToken, 'frase secreta');
        console.log("PAYLOAD ->:" + payload.usuarioId);
 
        User.findOne({_id: payload.usuarioId},{admin:1}, function(err, user){
            if (err){
                res.status(500).send({message: `Error al realizar la petición: ${err}`});
            }else{
                //console.log(user.admin);
                if (user.admin === 0) {
                    res.status(403).send( { error: "No tienes permisos de administrador para ejecutar esta acción"});
                }else{
                    console.log("Eres administrador para ejecutar esta acción");
                    next();
                }
                /*res.status(200).send({
                    status : "200",
                    message: user });      */
            }
        });
}

module.exports = {    
    checkPermission: checkPermission
};