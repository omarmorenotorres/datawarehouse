let pathRegions = 'http://localhost:3000/api/regions/';
let pathCountry = 'http://localhost:3000/api/countries/';
let pathCity = 'http://localhost:3000/api/city/';
let selectRegions = document.getElementById('selectRegions');
let selectCountries = document.getElementById('selectCountries');
let selectCities = document.getElementById('selectCities');
let userName = sessionStorage.getItem('userName');
let lastName = sessionStorage.getItem('lastName');
let drop = document.getElementById('navbarDropdown');
let closeSession = document.getElementById('endSesion');
let selected;
let selectedCountries;
let regionsList = new Array();
let countryList = new Array();
let idCity;
let cityList = new Array();
let region;
let regionId;
let regionName;
let token = localStorage.getItem('token');
drop.textContent = `${userName} ${lastName}`
closeSession.addEventListener('click',()=>{
    sessionStorage.setItem('token', "");
    window.location.href = 'index.html';    
});


regions = () =>{
    
    fetch(pathRegions,{
        method: 'GET',
        //mode: 'no-cors',
        dataType: "json",
        headers: {'Content-Type':'application/json'}
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {     
        //Mostrar mensaje y validaciones

        console.log(data);        
        if (data.status === '500') {
            //console.log(951); 
            window.location.href = 'index.html'         
        } else {
            for (const i in data.regions) {            
                let option = document.createElement('option');   
                regionsList[i] = {
                    id: data.regions[i]._id,
                    name: data.regions[i].name,
                    description: data.regions[i].description
                }
                option.textContent = regionsList[i].name;
                selectRegions.appendChild(option);          
            }
        }
    })
    .catch(function(err) {
        console.error(err);
    });
}

countries = () => {
    fetch( pathCountry )
    .then(function(response) {
        return response.json();
    })
    .then(function(data) { 
        for (const i in data) {            
            let option = document.createElement('option');            
            countryList[i] = {
                id: data[i]._id,
                name: data[i].name,
                region: data[i].region.name,
                description: data[i].description
            }
            loadRegions();
            if ( region === countryList[i].region ) {
                option.textContent = countryList[i].name;
                selectCountries.appendChild(option);  
            }            
        }
        city();
    })
    .catch(function(err) {
        console.error(err);
    });
}


city = () => {
    selectedCountries = selectCountries.options[selectCountries.selectedIndex].text;    

    selectCities.textContent = "";
    fetch( pathCity )
    .then(function(response) {
        return response.json();
    })
    .then(function(data) { 
        
        for (const i in data) {            
            let option = document.createElement('option');            
            cityList[i] = {
                id: data[i]._id,
                name: data[i].name,
                country: data[i].country.name,
                description: data[i].description
            }
            
            if ( selectedCountries === cityList[i].country ) {
                option.textContent = cityList[i].name;
                selectCities.appendChild(option);  
            }
        }
    })
    .catch(function(err) {
        console.error(err);
    });
}


showSelected = ( /*selectRegions*/ ) => {

    selected = selectRegions.options[selectRegions.selectedIndex].text;    
    
    if (selected === "Seleccione Valor") {
        location.reload();   
    }
    
    selectCountries.textContent = "";

    for (const i in regionsList) {
        if ( selected == regionsList[i].name ) {
            //console.log(regionsList[i].id);
            region = regionsList[i].name;
            regionId = regionsList[i].id;
        }
    }
//    console.log(regionId);
    countries();
}

regions();

loadRegions = () =>{
    //console.log("Selece: " + selected);
    
    document.getElementById('regionName').value = selected;
    
    for (const i in regionsList) {
        if( regionsList[i].name === document.getElementById('regionName').value ){
            document.getElementById('regionDescription').value = regionsList[i].description;
        } 
    }
}

let idRegion;

regId = () =>{
    for (const i in regionsList) {
        if( regionsList[i].name === document.getElementById('regionName').value ){
            idRegion = regionsList[i].id;
            regionName = regionsList[i].name;
        } 
    }
};

let idCountry = "";
let countryName = "";


loadCountries = () => {            
    let description = "";
    
    if(!document.getElementById('selectCountries').value){
        swal({
            title: "Error",
            text: `Asegurese de seleccionar un Country válido`,
            icon: "error",
          });
    }else{
        $('#editCountryModal').modal('show');

        for (const i in countryList) {
            if(countryList[i].region === document.getElementById('regionName').value){
                if( countryList[i].name === document.getElementById('selectCountries').value){
                    idCountry = countryList[i].id;
                    countryName = countryList[i].name;
                    description = countryList[i].description;
                    //console.log( countryList[i]);
                    document.getElementById('countryName').value = countryName;

                    if(typeof description === 'undefined'){
                        document.getElementById('countryDescription').value = "";
                    }else{
                        document.getElementById('countryDescription').value = description;
                    }
                }                
            }
        }
    }    
}

editCountries = () =>{    
    let country ={
        "name": document.getElementById('countryName').value,
        "description": document.getElementById('countryDescription').value
    }

    if(!document.getElementById('selectCountries').value){
        swal({
            title: "Error",
            text: `Asegurese de seleccionar un Country válido`,
            icon: "error",
          });
    }else{        
        fetch(`${pathCountry}${idCountry}`, {
            method: 'PUT',
            //mode: 'no-cors',
            dataType: "json",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify( country )
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
            if (data.status === '200') {
                swal({
                    title: "Good job!",
                    text: `${data.message}`,
                    icon: "success",
                  });  
                  setTimeout(function() {
                    location.reload();
                  }, 2000);                  
            } else {
                swal({
                    title: "Bad :(!",
                    text: `${data.message}`,
                    icon: "error",
                  });
            }
        }).catch(function(err) {
            console.error(err);
        });  
    }
}

deleteCountry = () => {    
    
    let country = document.getElementById('selectCountries').value; 
    for (const i in countryList) {
        if ( countryList[i].name === country) {
            idCountry = countryList[i].id;
        }
    }
    console.log(idCountry);
    swal({
        title: "Esta seguro",
        text: `Once deleted, you will not be able to recover country ${ country }!`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            regId();
            //console.log(idRegion);           

            if (typeof idCountry === 'undefined') {
                swal({
                    title: "Error",
                    text: `Asegurese de seleccionar un Country válido`,
                    icon: "error",
                  });
                
            }else{

            fetch(pathCountry + `/${idCountry}`, {
                method: 'DELETE',
                dataType: "json",
                headers: {'Content-Type':'application/json'},
            })
            .then(response => response.json())
            .then(function(data) { 
                if (data.status === '200') {
                    swal(`${data.message}`, {
                        buttons: {
                          //cancel: "Run away!",
                          /*catch: {
                            text: "Throw Pokéball!",
                            value: "catch",
                          },*/
                          continuar: true,
                        },
                      })
                      .then((value) => {
                        switch (value) {                       
                          case "continuar":
                            //swal("Pikachu fainted! You gained 500 XP!");
                            location.reload();
                            break;

                          default:
                            swal("Got away safely!");
                        }
                      });               
                      /*setTimeout(function(){ 
                        location.reload();
                     }, 50000);*/
                     
                } else {
                    swal({
                        text: `${data.message}`,
                        icon: "error",
                      });                    
                }
            })
            .catch(function(err) {
                console.error(err);
            });

            }
            
        } else {
          swal("The country record is safe!");
        }
      });
}


loadCityModal = () =>{
    document.getElementById('createCityName').value = "";
    description = document.getElementById('createCityDescription').value = "";
    
    console.log( document.getElementById('selectCountries').value );

    if (  !document.getElementById('selectCountries').value ) {
        swal({
            title: "Error",
            text: `Asegurese de seleccionar un country válido`,
            icon: "error",
          });        
    }else{       
        $('#createCityModal').modal('show');
        for (const i in countryList) {
            if ( countryList[i].name === document.getElementById('selectCountries').value) {
                idCountry = countryList[i].id;
            }
        }
    }

    //console.log(idCountry);
}

addCity = () => {
    
    console.log( idCountry );

    let city = {
        "name" : document.getElementById('createCityName').value,
        "country" : idCountry,
        "description" : document.getElementById('createCityDescription').value
    }
     console.log(city);
        fetch(pathCity, {
            method: 'POST',
            dataType: "json",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify( city )
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data.status);
            if (data.status === '200') {
                swal({
                    title: "Good job!",
                    text: `${data.message}`,
                    icon: "success",
                  });  
                  setTimeout(function() {
                    location.reload();
                  }, 2000);
            } else {
                swal({
                    title: "Bad :(!",
                    text: `${data.message}`,
                    icon: "error",
                  });
            }
        }).catch(function(err) {
            console.error(err);
        });
    
    
}

deleteCity = () => {    
    
    let city = document.getElementById('selectCities').value; 
    for (const i in cityList) {
        if ( cityList[i].name === city) {
            idCity = cityList[i].id;
        }
    }
    console.log(idCity);
    swal({
        title: "Esta seguro",
        text: `Once deleted, you will not be able to recover city ${ city }!`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            regId();
            //console.log(idRegion);           

            if (typeof idCity === 'undefined') {
                swal({
                    title: "Error",
                    text: `Asegurese de seleccionar un City válido`,
                    icon: "error",
                  });
                
            }else{

            fetch(pathCity + `/${idCity}`, {
                method: 'DELETE',
                dataType: "json",
                headers: {'Content-Type':'application/json'},
            })
            .then(response => response.json())
            .then(function(data) { 
                if (data.status === '200') {
                    swal(`${data.message}`, {
                        buttons: {
                          //cancel: "Run away!",
                          /*catch: {
                            text: "Throw Pokéball!",
                            value: "catch",
                          },*/
                          continuar: true,
                        },
                      })
                      .then((value) => {
                        switch (value) {                       
                          case "continuar":
                            //swal("Pikachu fainted! You gained 500 XP!");
                            location.reload();
                            break;

                          default:
                            swal("Got away safely!");
                        }
                      });               
                      /*setTimeout(function(){ 
                        location.reload();
                     }, 50000);*/
                     
                } else {
                    swal({
                        text: `${data.message}`,
                        icon: "error",
                      });                    
                }
            })
            .catch(function(err) {
                console.error(err);
            });

            }
            
        } else {
          swal("The city record is safe!");
        }
      });
}

loadEditCity = () => {
    document.getElementById('editCityName').value = "";
    let name = "";
    let description ="";


    if(!document.getElementById('selectCities').value){
        swal({
            title: "Error",
            text: `Asegurese de seleccionar un City válido`,
            icon: "error",
          });
    }else{  
        for (const i in cityList) {
            if (cityList[i].name === document.getElementById('selectCities').value) {
                console.log(cityList[i]);
                idCity = cityList[i].id;
                document.getElementById('editCityName').value = cityList[i].name;
                document.getElementById('editCityDescription').value = cityList[i].description;
                $('#editCityModal').modal('show');
            }        
        }
    }    
}

editCity = () =>{    
    let city ={
        "name": document.getElementById('editCityName').value,
        "description": document.getElementById('editCityDescription').value
    }
    console.log(city);
    console.log(idCity);
    
    fetch(`${pathCity}${idCity}`, {
            method: 'PUT',
            //mode: 'no-cors',
            dataType: "json",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify( city )
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
            if (data.status === '200') {
                swal({
                    title: "Good job!",
                    text: `${data.message}`,
                    icon: "success",
                  });  
                  setTimeout(function() {
                    location.reload();
                  }, 2000);                  
            } else {
                swal({
                    title: "Bad :(!",
                    text: `${data.message}`,
                    icon: "error",
                  });
            }
        }).catch(function(err) {
            console.error(err);
        });
    //}
}

loadRegionsSelect = () =>{  
    regId();
    if(!document.getElementById('selectCountries').value){
        swal({
            title: "Error",
            text: `Asegurese de seleccionar un Country válido`,
            icon: "error",
          });
    }else{           
        $('#editRegionModal').modal('show');
    }
}

editRegions = () => {    
    
    region = {
        "name": document.getElementById('regionName').value,
        "description": document.getElementById('regionDescription').value
    }

    console.log(idRegion);
    console.log(region);

    /*if (document.getElementById('selectRegions').value === 'Seleccione Valor') {
        swal({
            title: "Error",
            text: `Asegurese de seleccionar una Region válida`,
            icon: "error",
          });*/
    //}else{
        fetch(`${pathRegions}${idRegion}`, {
            method: 'PUT',
            //mode: 'no-cors',
            dataType: "json",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify( region )
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
            if (data.status === '200') {
                swal({
                    title: "Good job!",
                    text: `${data.message}`,
                    icon: "success",
                  });  
                  setTimeout(function() {
                    location.reload();
                  }, 2000);
            } else {
                swal({
                    title: "Bad :(!",
                    text: `${data.message}`,
                    icon: "error",
                  });
            }
        }).catch(function(err) {
            console.error(err);
        });
    //}
}

deleteRegion = () => {
    regId();
    swal({
        title: "Are you sure?",
        text: `Once deleted, you will not be able to recover region ${ regionName }!`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            regId();
            //console.log(idRegion);           

            if (typeof idRegion === 'undefined') {
                swal({
                    title: "Error",
                    text: `Asegurese de seleccionar una Region válida}`,
                    icon: "error",
                  });
                
            }else{

            fetch(pathRegions + `/${idRegion}`, {
                method: 'DELETE',
                dataType: "json",
                headers: {'Content-Type':'application/json'},
            })
            .then(response => response.json())
            .then(function(data) { 
                if (data.status === '200') {
                    swal(`${data.message}`, {
                        buttons: {
                          //cancel: "Run away!",
                          /*catch: {
                            text: "Throw Pokéball!",
                            value: "catch",
                          },*/
                          continuar: true,
                        },
                      })
                      .then((value) => {
                        switch (value) {                       
                          case "continuar":
                            //swal("Pikachu fainted! You gained 500 XP!");
                            location.reload();
                            break;

                          default:
                            swal("Got away safely!");
                        }
                      });               
                      /*setTimeout(function(){ 
                        location.reload();
                     }, 50000);*/
                     
                } else {
                    swal({
                        text: `${data.message}`,
                        icon: "error",
                      });                    
                }
            })
            .catch(function(err) {
                console.error(err);
            });

            }
            
        } else {
          swal("The region record is safe!");
        }
      });
}

createRegion = () => {
    let name = document.getElementById('createRegionName').value;
    let description = document.getElementById('createRegionDescription').value;
    let region = {
        "name": name,
        "description": description
    }

    //console.log(region);

    fetch(pathRegions, {
        method: 'POST',
        dataType: "json",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify( region )
    })
    .then(response => response.json())
    .then(function(data) {
        swal(`${data.message}`, {
                        buttons: {
                          //cancel: "Run away!",
                          /*catch: {
                            text: "Throw Pokéball!",
                            value: "catch",
                          },*/
                          continuar: true,
                        },
                      })
                      .then((value) => {
                        switch (value) {                       
                          case "continuar":
                            //swal("Pikachu fainted! You gained 500 XP!");
                            location.reload();
                            break;                                                   
                          default:
                            swal("Got away safely!");
                        }
                      });      
    })
    .catch(function(err) {
        console.error(err);
    });

    //document.getElementById('createRegionName').value = "";
    //description = document.getElementById('createRegionDescription').value = "";
}

addCountry = () => {
    console.log( document.getElementById('regionName').value );
    regId();
    console.log( regionId );

    let country = {
        "name" : document.getElementById('createCountryName').value,
        "region" : regionId,
        "description" : document.getElementById('createCountryDescription').value
    }

    if (typeof idRegion === 'undefined') {
        swal({
            title: "Error",
            text: `Asegurese de seleccionar una Region válida}`,
            icon: "error",
          });
        
    }else{
        fetch(pathCountry, {
            method: 'POST',
            dataType: "json",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify( country )
        })
        .then(response => response.json())
        .then(function(data) {
            swal(`${data.message}`, {
                buttons: {
                //cancel: "Run away!",
                /*catch: {
                    text: "Throw Pokéball!",
                    value: "catch",
                },*/
                continuar: true,
                },
            })
            .then((value) => {
                switch (value) {                       
                case "continuar":
                    //swal("Pikachu fainted! You gained 500 XP!");
                    location.reload();
                    break;
                                        
                default:
                    swal("Got away safely!");
                }
            });               
        })
        .catch(function(err) {
            console.error(err);
        });
    }

    document.getElementById('createCountryName').value = "";
    description = document.getElementById('createCountryDescription').value = "";

}