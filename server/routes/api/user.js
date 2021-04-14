const router = require('express').Router();
const bcrypt = require('bcryptjs');
//const { User } = require('../../db');
const { check, validationResult } = require('express-validator');
const moment = require('moment');
const jwt = require('jwt-simple');
//const { QueryTypes } = require('sequelize');
const middleware = require('../../middlewares/middlewares');
const User = require('../../models/user');
const city = require('../../models/city');

//const Sequelize = require('sequelize');
//const middleware_permission = require('../../middlewares/middleware_permission');
/*const sequelize = new Sequelize('delilah_resto', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});*/

/**************************************** */
/***** ENDPOINT PARA CREAR USUARIOS **** */
/**************************************** */

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    //check('username', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email debe estar correcto').isEmail().not(),
    check('phone', 'El teléfono no debe estar vacío').not().isEmpty(),
    check('admin', 'El rol no puede estar vacío').not().isEmpty(),
    /*check('is_disabled', 'El estado no puede estar vacío').not().isEmpty()*/
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errores: errors.array() });
    } else {
        console.log("LLega: " + req.body);
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        let user = new User();
        user.name = req.body.name;
        user.lastName = req.body.lastName;
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.admin = req.body.admin;

        user.save((err, userStored) =>{
            if(err) res.status(500).send({ 
                status: "500",
                message: `Error al guardar en la base de datos ${err}`});
    
            res.status(200).send({ 
                status: "200",
                message: "El usuario ha sido creado exitosamente"});
        });

        //const user = await User.create(req.body);
       /* await sequelize.query(
            `INSERT INTO users (username, email, password, full_name, phone, delivery_address, is_admin) ` +
            //`VALUES ('omar.moreno', 'omar.moreno@gmail.com', 'Omar Moreno', '12354', '12345', '12345', '0', '0')`,{
            `VALUES ('${req.body.username}', '${req.body.email}', '${req.body.password}', '${req.body.full_name}', '${req.body.phone}', '${req.body.delivery_address}', '${req.body.is_admin}')`, {
            type: QueryTypes.INSERT
        }).then(() => {
            res.status(200).json("Usuario creado exitosamente");
        }).catch(err => {
            res.status(409).json("Error en el formato de los datos");
        });*/
    }
});

/**************************************** */
/***** ENDPOINT PARA LISTAR USUARIOS **** */
/**************************************** */

router.get('/',/*middleware.checkToken,*/ async (req, res) => {
    try {
        console.log("Log del API");
        const userToken = req.headers['user-token'];
    let payload = {};
        payload = jwt.decode(userToken, 'frase secreta');
        console.log("PAYLOAD:" + payload.usuarioId);
        console.log("ROL: " + payload.rol);        
    
        User.find({},{password:0}, (err, users) =>{
            if(err) return res.status(500).send({message: `Error al realizar la petición: ${err}`});
            if(!users) return res.status(404).send({message: `NO existen usuarios`});
            res.status(200).json({ 
                status: "200",
                users });
        }); 
    } catch (err) {
        res.status(400).json({ message: "Error en la petición"});
        console.warn(err);
    }           
});

/****************************************** */
/***** ENDPOINT PARA LOGGEAR USUARIOS ***** */
/****************************************** */

router.post('/login', async (req, res) => {
    console.log("LOGIN OK");
    //const user = await User.findOne({ where: { email: req.body.email } });
    //console.log(req.body);
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            return res.status(500).send({message: `Error al realizar la petición: ${err}`});
        }
        if(!user){
            return res.status(404).send({message: `No existe ese usuario`});
        }else{
            if (user) {
                const iguales = bcrypt.compareSync(req.body.password, user.password);
                if (iguales) {
                    res.status(200).json({ 
                        status: 200,
                        message: "ok",
                        token: createToken(user),
                        rol: user.admin,
                        userName: user.name,
                        lastName: user.lastName
                    })
                } else {
                    res.status(401).json({ message: 'Error en usuario y/o contraseña ' });
                }
            } else {
                res.json({ error: 'Error en usuario y/o contraseña ' });
            }
        }
    });    
});

/**************************************** */
/***** ENDPOINT PARA EDITAR USUARIOS **** */
/**************************************** */

router.put('/:userId', (req, res) =>{    
    let userId = req.params.userId;
    //console.log(req.params.countryId);
    let update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdate) => {
        if(err) res.status(500).send({ 
            status: "500",
            message: `Error al actualizar el usuario` });

        res.status(200).json( { 
            status: "200",
            message: "El usuario fué actualizada exitosamente"} );
    });
});

/**************************************** */
/***** ENDPOINT PARA BORRAR USUARIOS **** */
/**************************************** */

router.delete('/:userId', /*middleware_permission.checkPermission,*/ async (req, res) => {
    let userId = req.params.userId;

    User.findById(userId, (err, user) =>{
        if(err) res.status(500).send({message: `Error al borrar el usuario: ${err}`});

        user.remove( err =>{
            if(err) res.status(500).send({message: `Error al borrar el usuario: ${err}`});
            res.status(200).send({
                status: "200",
                message: `El usuario ha sido borrado exitosamente`});
        });
    });
});

const createToken = (user) => {
    //console.log(user);
    const payload = {
        usuarioId: user._id,
        rol: user.admin,
        createdAt: moment().unix(),
        expiredAt: moment().add(30, 'minutes').unix()
    }

    return jwt.encode(payload, 'frase secreta');
}

module.exports = router;
