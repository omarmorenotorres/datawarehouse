const router = require('express').Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { request } = require('express');
const Country = mongoose.model('Country');
const City = require('../../models/city');
const middlewarePermisson = require('../../middlewares/middleware_permission');

router.get('/', /*middlewarePermisson.checkPermission,*/(req, res) =>{    
    City.find({}, (err, city) =>{
    //Country.find({},{name:1, region:1}, (err, countries) =>{
        if(err){
            res.status(500).send({ message: `Error al realizar la petición: ${err}`} );
        }else if(!city){
            res.status(404).send({message: `No existen ciudades en la base de datos`});
        }else{            
        Country.populate(city, {path: "country"},function(err, city){
                res.status(200).send(city);
                /*res.status(200).send( {
                    city: city[1].name,
                    country: city[1].country.name,
                    region: city[1].country.region
                });*/
                console.log(city);
            }); 
        }
    }); 
});

router.get('/:cityId', (req, res) =>{
    let cityId = req.params.cityId;
    
    console.log(cityId);

    /*Region.findOne(regionId, (err, region) => {
        if(err) return res.status(500).send({message: `Error al realizar la petición: ${err}`});
        if(!Region) return res.status(404).send({message: `La región no existe`});

        res.status(200).send({ region : region });        
    });*/

    City.findOne({_id:cityId}, function(err, city){
        if (err){
            res.status(500).send({message: `Error al realizar la petición: ${err}`});
        }else if(city === null){
            res.status(404).send({message: `La ciudad no existe`});            
        }else{
            res.status(200).send({ city : city });
            console.log(city.name);
        }
    });
});

router.post('/', (req, res) => {
    let city = new City();    
        city.name = req.body.name;
        city.country = req.body.country;
        city.description = req.body.description;

    city.save((err, cityStored) =>{
        if(err) res.status(500).send({ 
            status: "500",
            message: `Error al guardar en la base de datos ${err}`});

        res.status(200).send({ 
            status: "200",
            message: "La ciudad ha sido creada exitosamente"});
    });
});

router.put('/:cityId', (req, res) =>{
    let cityId = req.params.cityId;
    let update = req.body;    

    City.findByIdAndUpdate(cityId, update, (err, cityUpdate) => {
        if(err) res.status(500).send({ message: `Error al actualizar la ciudad: ${err}` });

        res.status(200).send( { 
            status: "200",
            message: `La ciudad ha sido actualizada exitosamente`});
    });
});

router.delete('/:cityId', (req, res) =>{
    let cityId = req.params.cityId;

    City.findById(cityId, (err, city) =>{
        if(err) res.status(500).send({message: `Error al borrar la ciudad: ${err}`});

        city.remove( err =>{
            if(err) res.status(500).send({message: `Error al borrar la ciudad: ${err}`});
            res.status(200).send({
                status: "200",
                message: `La ciudad ha sido borrado exitosamente`});
        });
    });
});

module.exports = router;
