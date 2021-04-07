const express = require ('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const port = process.env.PORT || 3000;

const app = express();

//require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', apiRouter);

mongoose.connect('mongodb://localhost:27017/shop', 
{ useNewUrlParser: true,  useFindAndModify: false  },  (err, res) =>{
    if (err) {
        return console.log( `Error al conectar a la base de datos: ${err}`);
        
    }else{
        console.log('Conexión a la base de datos establecida'); 
    }

    app.listen(port, () =>{
        console.log(`API REST corriendo en localhost://${port}`);
    }); 
    
});