const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { request } = require('express');
const Region = require('../../models/region');
const middlewarePermisson = require('../../middlewares/middleware_permission');

router.get('/',/*middlewarePermisson.checkPermission,*/ (req, res) =>{
    Region.find({}, (err, regions) =>{
        if(err) return res.status(500).send({ message: `Error al realizar la petición: ${err}`} );
        if(!regions) return res.status(404).send({message: `No existen regiones en la base de datos`});
        res.status(200).json({ regions });
    });
});

router.get('/:regionId', (req, res) =>{
    let regionId = req.params.regionId;
    
    console.log(regionId);

    /*Region.findOne(regionId, (err, region) => {
        if(err) return res.status(500).send({message: `Error al realizar la petición: ${err}`});
        if(!Region) return res.status(404).send({message: `La región no existe`});

        res.status(200).send({ region : region });        
    });*/

    Region.findOne({_id:regionId}, function(err, region){
        if (err){
            res.status(500).send({message: `Error al realizar la petición: ${err}`});
        }else if(region === null){
            res.status(404).send({message: `La región no existe`});            
        }else{
            res.status(200).send({ region : region }); 
            console.log(region.name);
        }
    });
});

router.post('/', (req, res) => {
    let region = new Region();    
        region.name = req.body.name;
        region.description = req.body.description

    region.save((err, regionStored) =>{
        if(err) res.status(500).send({ message: `Error al guardar en la base de datos ${err}`});

        res.status(200).send({ 
            status: "200",
            message: "La región ha sido guardada exitosamnte",
        });
    });
});

router.put('/:regionId', [
    check("regionId", `No es posible editar la región selecciones un valor válido`).isEmpty(),
    check('name', `El nombre de la región es obligatorio`).not().isEmpty()
],(req, res) =>{
    let regionId = req.params.regionId;
    let update = req.body;
    //console.log(regionId);
    //console.log(update);

    Region.findByIdAndUpdate(regionId, update, (err, regionUpdate) => {
        if(err) res.status(500).send({ 
            status: "500",
            message: `Error al actualizar la region` });

        res.status(200).json( { 
            status: "200",
            message: "La región fué actualizada exitosamente"} );
    });
});

router.delete('/:regionId', (req, res) =>{
    let regionId = req.params.regionId;

    Region.findById(regionId, (err, region) =>{
        if(err) res.status(500).send({message: `Error al borrar la region: ${err}`});

        region.remove( err =>{
            if(err) res.status(500).send({message: `Error al borrar la región: ${err}`});
            res.status(200).send({
                status: "200",
                message: `La región ha sido borrado exitosamente`});
        });
    });
});

module.exports = router;