const router = require('express').Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { request } = require('express');
const Country = mongoose.model('Country');
const Company = require('../../models/company');
const moment = require('moment');
const { check, validationResult } = require('express-validator');

router.get('/',/*middlewarePermisson.checkPermission,*/ (req, res) =>{
    Company.find({}, (err, company) =>{
        if(err) return res.status(500).send({ message: `Error al realizar la petición: ${err}`} );
        if(company.length === 0) return res.status(404).send({message: `No existen compañias en la base de datos`});
        res.status(200).json({ 
            status: "200",
            company });
    });
});

router.get('/:companyId', (req, res) =>{
    let companyId = req.params.companyId;
    
    console.log(companyId);

    /*Region.findOne(regionId, (err, region) => {
        if(err) return res.status(500).send({message: `Error al realizar la petición: ${err}`});
        if(!Region) return res.status(404).send({message: `La región no existe`});

        res.status(200).send({ region : region });        
    });*/

    Company.findOne({_id:companyId}, function(err, company){
        if (err){
            res.status(500).send({message: `Error al realizar la petición: ${err}`});
        }else if(region === null){
            res.status(404).send({message: `La región no existe`});            
        }else{
            res.status(200).send({ company : company }); 
            console.log(company.name);
        }
    });
});

router.post('/', (req, res) => {
    //console.log(56);
    console.log(req.body);
    let company = new Company();    
        company.name = req.body.name;        
        company.address = req.body.address;
        company.country = req.body.country;

    company.save((err, companyStored) =>{
        if(err) res.status(500).send({ message: `Error al guardar en la base de datos ${err}`});

        res.status(200).send({ 
            status: "200",
            message: "La compañia ha sido creada exitosamente",
            company: companyStored});
    });
});

router.put('/:companyId', [
    check("regionId", `No es posible editar la región selecciones un valor válido`).isEmpty(),
    check('name', `El nombre de la región es obligatorio`).not().isEmpty()
],(req, res) =>{
    let companyId = req.params.companyId;
    let update = req.body;
    //console.log(regionId);
    //console.log(update);

    Company.findByIdAndUpdate(companyId, update, (err, companyUpdate) => {
        if(err) res.status(500).send({ 
            status: "500",
            message: `Error al actualizar la compañía` });

        res.status(200).json( { 
            status: "200",
            message: "La compañia fué actualizada exitosamente"} );
    });
});

router.delete('/:companyId', (req, res) =>{
    let companyId = req.params.companyId;

    Company.findById(companyId, (err, company) =>{
        if(err) res.status(500).send({message: `Error al borrar la compañia: ${err}`});

        company.remove( err =>{
            if(err) res.status(500).send({message: `Error al borrar la compañia: ${err}`});
            res.status(200).send({
                status: "200",
                message: `La compañia ha sido borrado exitosamente`});
        });
    });
});

module.exports = router;
