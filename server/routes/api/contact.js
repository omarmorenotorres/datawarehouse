const router = require('express').Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { request } = require('express');
//const Country = mongoose.model('Country');
const Company = require('../../models/company');
const Region = require('../../models/region');
const Country = require('../../models/country');
const Chanel = require('../../models/chanel');
const Contact = require('../../models/contact');
const moment = require('moment');
const { check, validationResult } = require('express-validator');

router.get('/',/*middlewarePermisson.checkPermission,*/(req, res) => {
    Contact.find({}, (err, contact) => {
        if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        if (contact.length === 0) return res.status(404).send({ message: `No existen contactos en la base de datos` });
        res.status(200).json({
            status: "200",
            contact: contact
        });
    });
});

router.get('/:contactId', (req, res) => {
    let contactId = req.params.contactId;

    console.log(contactId);

    /*Region.findOne(regionId, (err, region) => {
        if(err) return res.status(500).send({message: `Error al realizar la petición: ${err}`});
        if(!Region) return res.status(404).send({message: `La región no existe`});

        res.status(200).send({ region : region });        
    });*/

    Contact.findOne({ _id: contactId }, function (err, contact) {
        if (err) {
            res.status(500).send({ message: `Error al realizar la petición: ${err}` });
        } else if (contact === null) {
            res.status(404).send({ message: `El contacto no existe` });
        } else {
            res.status(200).send({ contact: contact });
            console.log(contact.name);
        }
    });
});

router.post('/', (req, res) => {
    //console.log(56);
    console.log(req.body);
    let contact = new Contact();
    contact.name = req.body.name;
    contact.job = req.body.job;
    contact.mail = req.body.mail;
    contact.company = req.body.company;
    contact.region = req.body.region;
    contact.country = req.body.country;
    contact.city = req.body.city;
    contact.address = req.body.address;
    contact.value = req.body.value;
    contact.chanel = req.body.chanel;

    contact.save((err, contactStored) => {
        if (err) res.status(500).send({ message: `Error al guardar en la base de datos ${err}` });

        res.status(200).send({
            status: "200",
            message: "Usuario(s) creado(s) exitosamente",
            contact: contactStored
        });
    });
});

router.put('/:contactId', [
    check("contactId", `No es posible editar el contacto selecciones un valor válido`).isEmpty(),
    check('name', `El nombre del contacto es obligatorio`).not().isEmpty()
], (req, res) => {
    let contactId = req.params.contactId;
    let update = req.body;
    //console.log(regionId);
    //console.log(update);

    Contact.findByIdAndUpdate(contactId, update, (err, contactUpdate) => {
        if (err) res.status(500).send({
            status: "500",
            message: `Error al actualizar el contacto`
        });
        res.status(200).json({
            status: "200",
            message: "El contacto fué actualizado exitosamente"
        });
    });
});

router.delete('/:contactId', (req, res) => {
    let contactId = req.params.contactId;

    Contact.findById(contactId, (err, contact) => {
        if (err) res.status(500).send({ message: `Error al borrar la compañia: ${err}` });

        contact.remove(err => {
            if (err) res.status(500).send({ message: `Error al borrar la compañia: ${err}` });
            res.status(200).send({
                status: "200",
                message: `El contacto ha sido borrado exitosamente`
            });
        });
    });
});

var fileupload = require('express-fileupload');

module.exports = router;
