const { check } = require('express-validator');
const jwt = require('jwt-simple');
const moment = require('moment');

const checkToken = (req, res, next) =>{
    if(!req.headers['user-token']){
        return res.json({ 
            status: "500",
            error: 'Necesitas incluír el user-token en la cabecera'});
    }

    const userToken = req.headers['user-token'];    
    let payload = {};
    
    try{
        payload = jwt.decode(userToken, 'frase secreta');
        console.log("PAYLOAD, CHECKTOKEN:" + payload.usuarioId);
    }catch(err){
        return res.json({
            status: "409",
             error: 'El token es incorrecto' });
    }

    if(payload.expiredAt < moment().unix()){
        return res.json({ 
            status: "409",
            error: 'El token ha expirado' });
    }
    req.usuarioId = payload.usaurioId;
    next();
}

module.exports = {
    checkToken: checkToken
};