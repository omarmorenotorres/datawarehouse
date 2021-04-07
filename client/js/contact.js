function deshabilitaRetroceso() {
  window.location.hash = "no-back-button";
  window.location.hash = "Again-No-back-button" //chrome
  window.onhashchange = function () { window.location.hash = "no-back-button"; }
}

let pathCompany = 'http://localhost:3000/api/company';
let pathRegion = 'http://localhost:3000/api/regions';
let pathContact = 'http://localhost:3000/api/contact';
let company = document.getElementById('selectCompany');
let regionsList = new Array();
let region = document.getElementById('selectRegion');
let country = document.getElementById('selectCountry');
let selectCountry = country.options[country.selectedIndex].text;
let pathCity = 'http://localhost:3000/api/city/';
let cityList = new Array();
let city = document.getElementById('selectCity');
let selectCity = city.options[city.selectedIndex].text;
let dataSet = [];
let contact = new Array;
let btnEditContact = document.getElementById('btnEditContact');
let upload = document.getElementById('upload');

/**LECTURA DEL CSV Y CONVERTIR A ARRAY */
let selectedFile;
//console.log(window.XLSX);
document.getElementById('input').addEventListener("change", (event) => {
  selectedFile = event.target.files[0];
})

let data = [{
  "name": "jayanth",
  "data": "scd",
  "abc": "sdef"
}]

document.getElementById('button').addEventListener("click", () => {
  XLSX.utils.json_to_sheet(data, 'out.xlsx');
  if (selectedFile) {
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) => {
      let data = event.target.result;
      let workbook = XLSX.read(data, { type: "binary" });
      console.log(data);
      workbook.SheetNames.forEach(sheet => {
        let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
        console.log(rowObject);
        //document.getElementById("jsondata").innerHTML = JSON.stringify(rowObject,undefined,4);

        for (let index = 0; index < rowObject.length; index++) {
          //console.log(rowObject[index].name);
          //console.log(rowObject[index].mail);

          let contactXls = {
            "name": `${rowObject[index].name}`,
            "mail": `${rowObject[index].mail}`,
            "region": `${rowObject[index].region}`,
            "company": `${rowObject[index].company}`,
            "job": `${rowObject[index].job}`,
            "value": `${rowObject[index].value}`
          }

          //console.log(contact);
          //alert(index);


          fetch(pathContact, {
            method: 'POST',
            dataType: "json",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactXls)
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
            });
        }



      });
    }
  }
});


/*FETCH COMPAÑIAS*/
loadCompany = () => {
  let company = document.getElementById('selectCompany');
  company.textContent = '';

  //let selectCompany = company.options[company.selectedIndex].text;

  fetch(pathCompany, {
    method: 'GET',
    //mode: 'no-cors',
    dataType: "json",
    headers: { 'Content-Type': 'application/json' }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (const i in data.company) {
        //console.log(data.company[i].name);
        let option = document.createElement('option');
        option.textContent = `${data.company[i].name}`;
        company.appendChild(option);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

let regionId = "";

/*FETCH REGIONS*/
loadRegion = () => {

  let arrayRegion = [];
  region.textContent = '';

  fetch(pathRegion, {
    method: 'GET',
    //mode: 'no-cors',
    dataType: "json",
    headers: { 'Content-Type': 'application/json' }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      //console.log(data.regions);      
      for (const i in data.regions) {
        //console.log(data.regions[i].name);
        regionsList[i] = {
          id: data.regions[i]._id,
          name: data.regions[i].name,
          description: data.regions[i].description
        }
        //regionId = `${data.regions[i]._id}`;
        let option = document.createElement('option');
        option.textContent = `${data.regions[i].name}`;
        region.appendChild(option);
      }

      /**FETCH COUNTRY POR REGION */
    })
    .catch(function (err) {
      console.error(err);
    });
}

let pathCountry = 'http://localhost:3000/api/countries/';
let countryList = new Array();


selectedRegion = () => {
  //console.log(789);

  let regionSeleceted = region.options[region.selectedIndex].text;
  for (const i in regionsList) {
    if (regionSeleceted === regionsList[i].name) {
      regionId = regionsList[i].id;
      //console.log("ID: " + regionId);      
      selectedCountry(regionId);
    }
  }
}

selectedCountry = (regionId) => {
  country.textContent = '';

  fetch(pathCountry)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (const i in data) {
        let option = document.createElement('option');
        countryList[i] = {
          id: data[i]._id,
          name: data[i].name,
          region: data[i].region.name,
          regionID: data[i].region._id,
          description: data[i].description
        }

        if (regionId === countryList[i].regionID) {
          option.textContent = countryList[i].name;
          country.appendChild(option);
          //console.log("--->"+countryList[i].id);
          //selectedCity( countryList[i].id );                
        }
      }

      selectCountry = country.options[country.selectedIndex].text;

      for (const i in countryList) {
        if (countryList[i].name === selectCountry) {
          selectedCity(countryList[i].name);
        }
      }

    })
    .catch(function (err) {
      console.error(err);
    });
}

selectedCity = (countryName) => {
  city.textContent = '';

  if (countryName === undefined) {
    countryName = country.options[country.selectedIndex].text;
  }

  fetch(pathCity)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      for (const i in data) {
        let option = document.createElement('option');
        cityList[i] = {
          id: data[i]._id,
          name: data[i].name,
          country: data[i].country.name,
          description: data[i].description
        }

        if (countryName === cityList[i].country) {
          option.textContent = cityList[i].name;
          city.appendChild(option);
        } else {
          //option.textContent = 'No hay ciudad';
          //city.appendChild(option);
        }
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

let rol = sessionStorage.getItem('rol');
let userName = sessionStorage.getItem('userName');
let lastName = sessionStorage.getItem('lastName');
let closeSession = document.getElementById('endSesion');
let drop = document.getElementById('navbarDropdown');
let btnCreateContact = document.getElementById('btnCreateContact');

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


btnCreateContact.addEventListener('click', () => {
  $('#createContactModal').modal('show');
  btnEditContact.style.display = 'none';
  btnSaveChanel.style.display = 'block';
  loadCompany();
  loadRegion();
});

$(function () {
  $("#uploadFile").on("change", function () {
    var files = !!this.files ? this.files : [];
    if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

    if (/^image/.test(files[0].type)) { // only image file
      var reader = new FileReader(); // instance of the FileReader
      reader.readAsDataURL(files[0]); // read the local file

      reader.onloadend = function () { // set image data as background of div
        $("#imagePreview").css("background-image", "url(" + this.result + ")");
      }
    }
  });
});

let progress = document.getElementById('progress');
let btnNewChanel = document.getElementById('btnNewChanel');
let btnSaveChanel = document.getElementById('btnSaveChanel');

progress.textContent = '100%';
progress.style.width = '100%'


btnNewChanel.addEventListener('click', () => {
  //$('#createChanelModal').modal('show'); 
});

let chanelArray = [];
let chanelElement;

btnNewChanel.addEventListener('click', () => {

  let selectedChanel = document.getElementById('selectChanel');
  let chanel = selectedChanel.options[selectedChanel.selectedIndex].text;
  let userAccount = document.getElementById('userAccount').value;
  let selectedPreference = document.getElementById('selectedPreference');
  let preference = selectPreference.options[selectPreference.selectedIndex].text;
  let tableChanel = document.getElementById('tableChanel');
  let tdChanel = document.createElement('td');
  let tdUser = document.createElement('td');
  let tdPreference = document.createElement('td');
  let editar = document.createElement('button');
  let eliminar = document.createElement('button');
  let tdActions = document.createElement('td');
  let tr = document.createElement('tr');

  if (preference === 'Canal favorito') {
    chanelArray.push(chanel);
  }



  editar.className = 'btn btn-outline-info';
  editar.textContent = 'Editar';
  eliminar.className = 'btn btn-outline-danger';
  eliminar.textContent = 'Eliminar';
  console.log(userAccount + " " + preference + " " + chanel);
  tdChanel.textContent = chanel;
  tdUser.textContent = userAccount;
  tdPreference.textContent = preference;

  tdActions.appendChild(editar);
  tdActions.appendChild(eliminar);

  tr.appendChild(tdChanel);
  tr.appendChild(tdUser);
  tr.appendChild(tdPreference);
  tr.appendChild(tdActions);

  tableChanel.appendChild(tr);

});


let porcentage = document.getElementById('porcentage');
let value = '';

btnSaveChanel.addEventListener('click', () => {
  console.log(123);
  /*
Foto
*/

  let name = document.getElementById('name').value;
  let job = document.getElementById('job').value;
  let mail = document.getElementById('mail').value;
  let progress = document.getElementById('progress');
  let selectRegion = region.options[region.selectedIndex].text;
  selectCompany = company.options[company.selectedIndex].text;
  selectRegion = region.options[region.selectedIndex].text;
  selectCountry = country.options[country.selectedIndex].text;
  selectCities = city.options[city.selectedIndex].text;
  let address = document.getElementById('address').value;
  value = porcentage.options[porcentage.selectedIndex].text;

  let contact = {
    "name": `${name}`,
    "job": `${job}`,
    "mail": `${mail}`,
    "company": `${selectCompany}`,
    "region": `${selectRegion}`,
    "country": `${selectCountry}`,
    "city": `${selectCities}`,
    "address": `${address}`,
    "value": `${value}`,
    //"chanel": `${JSON.stringify(chanelArray)}`
    //"chanel": `${chanelArray}`
  }

  fetch(pathContact, {
    method: 'POST',
    dataType: "json",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
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
    });

  console.log(
    `${name} ${job} ${mail} ${selectCompany} ${selectRegion} ${selectCountry} ${selectCities} ${address} ${value} ${JSON.stringify(chanelArray)}`
  );

  /*Aca debería invocar el guardado del array en la base de datos*/
});

progress.textContent = porcentage.options[porcentage.selectedIndex].text;
progress.style.width = porcentage.options[porcentage.selectedIndex].text;
porcentageChange = () => {
  progress.textContent = porcentage.options[porcentage.selectedIndex].text;
  progress.style.width = porcentage.options[porcentage.selectedIndex].text;
}
let rowSelected = new Array();

fetch(pathContact, {
  method: 'GET',
  //mode: 'no-cors',
  dataType: "json",
  headers: { 'Content-Type': 'application/json' }
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {

    if (data.status === '200') {
      //console.log(data);
      for (const i in data.contact) {
        //console.log(data.contact[i].name);
        contact[i] = {
          id: data.contact[i]._id,
          name: data.contact[i].name,
          job: data.contact[i].job,
          mail: data.contact[i].mail,
          company: data.contact[i].company,
          region: data.contact[i].region,
          country: data.contact[i].country,
          city: data.contact[i].city,
          address: data.contact[i].address,
          value: data.contact[i].value,
          chanel: data.contact[i].chanel
        }

        dataSet.push([`${contact[i].name}`, `${contact[i].mail}`, `${contact[i].region}`,
        `${contact[i].company}`, `${contact[i].job}`, `${contact[i].chanel}`, `${contact[i].value}`]);
      }
      
      $(document).ready(function () {
        let table = $('#example').DataTable({
          dom: 'Bfrtip',
          buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
          ],
          data: dataSet,
          "columnDefs": [{
            "targets": -1,
            "data": null,
            "defaultContent": "<button id='btnEdit' class='btnTable btn btn-outline-info'>Edit</button><button id='btnDelete' class='btnTable btn btn-outline-danger'>Delete</button>"
          }
          ]
        });

        $('#example tbody').on('click', 'tr', function () {
          $(this).toggleClass('selected');
          //console.log(table.rows('.selected').data()[i]);          
        });

        $('#button').click(function () {
          alert(table.rows('.selected').data().length + ' row(s) selected');
          rowSelected.push(table.rows('.selected').data());
          console.log(rowSelected);
        });

        $('#example tbody').on('click', '#btnDelete', function () {
          var data = table.row($(this).parents('tr')).data();
          for (const i in contact) {
            if (contact[i].mail === data[1]) {
              deleteContact(contact[i]);
            }
          }
        });

        $('#example tbody').on('click', '#btnEdit', function () {
          var data = table.row($(this).parents('tr')).data();

          for (const i in contact) {
            if (contact[i].mail === data[1]) {
              $('#createContactModal').modal('show');
              let modalEdit = document.getElementById('createUserModalLabel');
              modalEdit.textContent = 'EDITAR CONTACTO';
              editContact(contact[i]);
            }
          }
        });
      });

    } else {

    }

    editContact = (contact) => {
      //alert(contact.id);
      btnSaveChanel.style.display = 'none';
      btnEditContact.style.display = 'block';
      loadCompany();
      loadRegion();
      let name = document.getElementById('name');
      let job = document.getElementById('job');
      let mail = document.getElementById('mail');
      let progress = document.getElementById('progress');
      //let selectRegion = region.options[region.selectedIndex].text;
      //selectCompany = company.options[company.selectedIndex].text;
      //selectRegion = region.options[region.selectedIndex].text;
      //selectCountry = country.options[country.selectedIndex].text;
      //selectCities = city.options[city.selectedIndex].text;
      let address = document.getElementById('address');
      value = porcentage.options[porcentage.selectedIndex].text;

      fetch(pathContact + `/${contact.id}`, {
        method: 'GET',
        //mode: 'no-cors',
        dataType: "json",
        headers: { 'Content-Type': 'application/json' }
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          //console.log(data.contact.chanel);
          name.value = data.contact.name;
          job.value = data.contact.job;
          mail.value = data.contact.mail;
          address.value = data.contact.address;

        })
        .catch(function (err) {
          console.error(err);
        });


      btnEditContact.addEventListener('click', () => {
        //alert(123);
        let name = document.getElementById('name').value;
        let job = document.getElementById('job').value;
        let mail = document.getElementById('mail').value;
        let progress = document.getElementById('progress');
        //let selectRegion = region.options[region.selectedIndex].text;
        //selectCompany = company.options[company.selectedIndex].text;
        //selectRegion = region.options[region.selectedIndex].text;
        //selectCountry = country.options[country.selectedIndex].text;
        //selectCities = city.options[city.selectedIndex].text;
        let address = document.getElementById('address').value;
        value = porcentage.options[porcentage.selectedIndex].text;

        let contactEdit = {
          "name": `${name}`,
          "job": `${job}`,
          "mail": `${mail}`,
          //"company": `${selectCompany}`,
          //"region": `${selectRegion}`,
          //"country": `${selectCountry}`,
          //"city": `${selectCities}`,
          "address": `${address}`,
          "value": `${value}`,
          //"chanel": `${JSON.stringify(chanelArray)}`
          "chanel": `${chanelArray}`
        }

        fetch(`${pathContact}/${contact.id}`, {
          method: 'PUT',
          //mode: 'no-cors',
          dataType: "json",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactEdit)
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
      });

    }

    deleteContact = (contact) => {
      swal({
        title: "Are you sure?",
        text: `Once deleted, you will not be able to recover the contact`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
        .then((willDelete) => {
          if (willDelete) {

            /*if (typeof idRegion === 'undefined') {
                swal({
                    title: "Error",
                    text: `Asegurese de seleccionar una Region válida}`,
                    icon: "error",
                  });
                
            }else{*/

            fetch(pathContact + `/${contact.id}`, {
              method: 'DELETE',
              dataType: "json",
              headers: { 'Content-Type': 'application/json'/*,'user-token':token*/ },
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

            // }

          } else {
            swal("The user record is safe!");
          }
        });
    }

  })
  .catch(function (err) {
    console.error(err);
  });