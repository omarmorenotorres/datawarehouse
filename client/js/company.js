function deshabilitaRetroceso() {
    window.location.hash = "no-back-button";
    window.location.hash = "Again-No-back-button" //chrome
    window.onhashchange = function () { window.location.hash = "no-back-button"; }
}

let path = 'http://localhost:3000/api/company';
let pathCountry = 'http://localhost:3000/api/countries';
let token = sessionStorage.getItem('token');
let rol = sessionStorage.getItem('rol');
let userName = sessionStorage.getItem('userName');
let lastName = sessionStorage.getItem('lastName');
let drop = document.getElementById('navbarDropdown');
let tableRow = document.getElementById('tableRow');
let btnNewCompany = document.getElementById('btnNewCompany');
let btnSaveCompany = document.getElementById('btnSaveCompany');
let btnSaveEdit = document.createElement('button');
let btnCloseModal = document.getElementById('btnCloseModal');
let closeSession = document.getElementById('endSesion');
let country = new Array();
let company = new Array();
let countryList = new Array();
let dataSet = [];
let cL = [];
let cN = "";



loadCountrie = () => {
    let selectCountries = document.getElementById('selectCountries');

    fetch(pathCountry, {
        method: 'GET',
        //mode: 'no-cors',
        dataType: "json",
        headers: { 'Content-Type': 'application/json' }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            //Mostrar mensaje y validaciones
            
            for (const i in data) {
                //console.log("++++ "+data[i].name);
                localStorage.setItem('paises', JSON.stringify(data));
            }

        })
        .catch(function (err) {
            console.error(err);
        });

    
}

loadCountrie();

drop.textContent = `${userName} ${lastName}`
closeSession.addEventListener('click', () => {
    sessionStorage.setItem('token', "");
    window.location.href = 'index.html';
});

if (rol === '0') {
    document.getElementById('itemUser').style.display = 'none';
} else {
    document.getElementById('itemUser').style.display = 'visible';
}


loadCompany = () => {
    /*
    1. fetch GET company
    */

    fetch(path, {
        method: 'GET',
        //mode: 'no-cors',
        dataType: "json",
        headers: { 'Content-Type': 'application/json', 'user-token': token }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            if (data.status === '200') {
                //console.log(data);

                countryList = localStorage.getItem('paises');
                countryList = JSON.parse(countryList);

                for (const i in data.company) {
                    company[i] = {
                        id: data.company[i]._id,
                        name: data.company[i].name,
                        address: data.company[i].address,
                        country: data.company[i].country
                    }                       

                    for (const j in countryList) {
                        if(company[i].country === countryList[j]._id){
                            console.log(countryList[j].name);
                            cN = countryList[j].name;
                        }                        
                    }
                    

                    dataSet.push([company[i].name, cN, company[i].address, ""]);

                   
                }

                $(document).ready(function () {
                    let table = $('#example').DataTable({
                        data: dataSet,
                        "columnDefs": [{
                            "targets": -1,
                            "data": null,
                            "defaultContent": "<button id='btnEdit' class='btnTable btn btn-outline-info'>Edit</button><button id='btnDelete' class='btnTable btn btn-outline-danger'>Delete</button>"
                        }
                        ]
                    });

                    $('#example tbody').on('click', '#btnEdit', function () {
                        var data = table.row($(this).parents('tr')).data();
                        //alert( data[0] +"'s edit is: "+ data[ 2 ] );
                        for (const i in company) {
                            if (company[i].name === data[0]) {
                                companyEdit(company[i]);
                            }
                        }
                    });

                    $('#example tbody').on('click', '#btnDelete', function () {
                        var data = table.row($(this).parents('tr')).data();
                        for (const i in company) {
                            if (company[i].name === data[0]) {
                                companyDelete(company[i]);
                            }
                        }
                    });

                });


            }
        })
        .catch(function (err) {
            console.error(err);
        });
}
loadCompany();

companyEdit = (company) => {
    //console.log(company);
    let modal = document.getElementById('modalFooter');
    countryList = localStorage.getItem('paises');
    countryList = JSON.parse(countryList);

    document.getElementById('createCompanyModalLabel').textContent = 'EDIT COMPANY';
    $('#createCompanyModal').modal({ backdrop: 'static', keyboard: false })
    $('#createCompanyModal').modal('show');
    let name = document.getElementById('nameCompany');
    let address = document.getElementById('addressCompany');

    name.value = company.name;
    address.value = company.address;

    btnSaveCompany.style.display = 'none';

    btnSaveEdit.textContent = 'Save';
    btnSaveEdit.className = 'btn btn-outline-info';
    modal.appendChild(btnSaveEdit);

    for (const i in countryList) {
        //console.log(countryList[i].name);
        let option = document.createElement('option');
        option.textContent = countryList[i].name

        selectCountries.appendChild(option);        
    }

    btnSaveEdit.addEventListener('click', () => {
        console.log("Selec: "+selectCountries.options[selectCountries.selectedIndex].text);
        if (!name || !address || selectCountries.options[selectCountries.selectedIndex].text === 'Seleccione Valor') {
            swal({
                title: "CAMPOS INCOMPLETOS",
                text: `Asegurese de completar todos los campos`,
                icon: "error",
            });
        } else {

            for (const i in countryList) {
                //console.log(data.country.name);              

                if (selectCountries.options[selectCountries.selectedIndex].text === countryList[i].name) {
                    country = countryList[i]._id;
                    console.log(country);
                }
            }

            let companyEdit = {
                "name": document.getElementById('nameCompany').value,
                "address": document.getElementById('addressCompany').value,
                "country": country
            }
            /**
         * Fetch PUT company
         */
            fetch(`${path}/${company.id}`, {
                method: 'PUT',
                //mode: 'no-cors',
                dataType: "json",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(companyEdit)
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
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    } else {
                        swal({
                            title: "Bad :(!",
                            text: `${data.message}`,
                            icon: "error",
                        });
                    }
                }).catch(function (err) {
                    console.error(err);
                });
        }
    });
}

companyDelete = (company) => {
    swal({
        title: "Are you sure?",
        text: `Once deleted, you will not be able to recover company ${company.name}!`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {

                if (typeof company.id === 'undefined') {
                    swal({
                        title: "Error",
                        text: `Asegurese de seleccionar una compañía válida}`,
                        icon: "error",
                    });

                } else {

                    fetch(path + `/${company.id}`, {
                        method: 'DELETE',
                        dataType: "json",
                        headers: { 'Content-Type': 'application/json' },
                    })
                        .then(response => response.json())
                        .then(function (data) {
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
                        .catch(function (err) {
                            console.error(err);
                        });

                }

            } else {
                swal("The company record is safe!");
            }
        });
}

loadCountry = (idCountry, tdCountry) => {

    /*
    1. Fetch al GET countryID
    */
    //console.log(`${pathCountry}/${idCountry}`);

    fetch(`${pathCountry}/${idCountry}`, {
        method: 'GET',
        //mode: 'no-cors',
        dataType: "json",
        headers: { 'Content-Type': 'application/json', 'user-token': token }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            if (data.status === '200') {

                tdCountry.textContent = data.country.name;
            } else {
                tdCountry.textContent = "No country";
            }

        })
        .catch(function (err) {
            console.error(err);
        });
}

btnNewCompany.addEventListener('click', () => {
    btnSaveCompany.style.display = 'block';
    btnSaveEdit.style.display = 'none';
    document.getElementById('nameCompany').value = "";
    document.getElementById('addressCompany').value = "";
    document.getElementById('createCompanyModalLabel').textContent = 'CREAT NEW COMPANY';
    $('#createCompanyModal').modal('show');

    for (const i in countryList) {
        //console.log(countryList[i].name);
        let option = document.createElement('option');
        option.textContent = countryList[i].name;
        selectCountries.appendChild(option);   
    }
    
});

btnCloseModal.addEventListener('click', () => {
    modalFooter.removeChild(btnSaveEdit);
    location.reload();
});


btnSaveCompany.addEventListener('click', () => {
    /*
    1. Validar los campos del modal
    2. Crear el objeto compañia
    3. Tomar el valor id del country
    4. Fetch post company
    */

    let name = document.getElementById('nameCompany').value;
    let address = document.getElementById('addressCompany').value;
    let countryId = '';    

    if (!name || !address || selectCountries.options[selectCountries.selectedIndex].text === 'Seleccione Valor') {
        swal({
            title: "CAMPOS INCOMPLETOS",
            text: `Asegurese de completar todos los campos`,
            icon: "error",
        });
    } else {
        //console.log(country);
        for (const i in countryList) {
            if (selectCountries.options[selectCountries.selectedIndex].text === countryList[i].name) {
                countryId = countryList[i]._id;
                console.log(countryId);
            }
        }

        let company = {
            "name": document.getElementById('nameCompany').value,
            "address": document.getElementById('addressCompany').value,
            "country": countryId
        }

        /*fetch(path, {
            method: 'POST',
            dataType: "json",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(company)
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
                    setTimeout(function () {
                        location.reload();
                    }, 2000);
                } else {
                    swal({
                        title: "Bad :(!",
                        text: `${data.message}`,
                        icon: "error",
                    });
                }
            }).catch(function (err) {
                console.error(err);
            });*/


    }
});