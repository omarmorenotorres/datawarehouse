const router = require('express').Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { request } = require('express');
const Region = mongoose.model('Region');
const Country = require('../../models/country');

router.get('/', (req, res) =>{    
    Country.find({},{}, (err, countries) =>{
    //Country.find({},{name:1, region:1}, (err, countries) =>{
        if(err){
            res.status(500).send({ message: `Error al realizar la petición: ${err}`} );
        }else if(!countries){
            res.status(404).send({message: `No existen regiones en la base de datos`});
        }else{            
        Region.populate(countries, {path: "region"},function(err, countries){
                res.status(200).send(countries);
                /*res.status(200).send( {
                    country: countries[0].name,
                    region: countries[0].region.name
                });*/
                //console.log(countries);
                //console.log(countries[0].region.name);
            }); 
        }
    }); 
    
});

router.get('/:countryId', (req, res) =>{
    let countryId = req.params.countryId;
    
    console.log(countryId);

    /*Region.findOne(regionId, (err, region) => {
        if(err) return res.status(500).send({message: `Error al realizar la petición: ${err}`});
        if(!Region) return res.status(404).send({message: `La región no existe`});

        res.status(200).send({ region : region });        
    });*/

    Country.findOne({_id:countryId}, function(err, country){
        if (err){
            res.status(500).send({message: `Error al realizar la petición: ${err}`});
        }else if(country === null){
            res.status(404).send({message: `El país no existe`});            
        }else{
            res.status(200).send({ 
                status: "200",
                id: country._id,
                name: country.name                
            });
        }
    });
});

router.post('/', (req, res) => {
    let country = new Country();    
        country.name = req.body.name;
        country.region = req.body.region;
        country.description = req.body.description;

    country.save((err, countryStored) =>{
        if(err) res.status(500).send({ message: `Error al guardar en la base de datos ${err}`});

        res.status(200).send({ 
            status: "200",
            message: "El país ha sido creado exitosamente"
        });
    });
});

router.put('/:countryId', (req, res) =>{    
    let countryId = req.params.countryId;
    //console.log(req.params.countryId);
    let update = req.body;

    Country.findByIdAndUpdate(countryId, update, (err, countryUpdate) => {
        if(err) res.status(500).send({ 
            status: "500",
            message: `Error al actualizar el country` });

        res.status(200).json( { 
            status: "200",
            message: "El country fué actualizada exitosamente"} );
    });
});

router.delete('/:countryId', (req, res) =>{
    let countryId = req.params.countryId;

    Country.findById(countryId, (err, country) =>{
        if(err) res.status(500).send({message: `Error al borrar el país: ${err}`});

        country.remove( err =>{
            if(err) res.status(500).send({message: `Error al borrar el país: ${err}`});
            res.status(200).send({
                status: "200",
                message: `El país ha sido borrado exitosamente`});
        });
    });
});

module.exports = router;
