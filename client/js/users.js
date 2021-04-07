function deshabilitaRetroceso(){
    window.location.hash="no-back-button";
    window.location.hash="Again-No-back-button" //chrome
    window.onhashchange=function(){window.location.hash="no-back-button";
}}

let dataSet = [];
let path = 'http://localhost:3000/api/users';
let users = new Array;
let tableRow = document.getElementById('tableRow');
let token = sessionStorage.getItem('token');
let rol = sessionStorage.getItem('rol');
let userName = sessionStorage.getItem('userName');
let lastName = sessionStorage.getItem('lastName');
let drop = document.getElementById('navbarDropdown');
let closeSession = document.getElementById('endSesion');

drop.textContent = `${userName} ${lastName}`
closeSession.addEventListener('click',()=>{
    sessionStorage.setItem('token', "");
    window.location.href = 'index.html';    
});

/*FETCH AL MODELO DE USUARIOS*/

//console.log(token);
//console.log(rol);

//console.log(localStorage.getItem('rol',rol));

if (rol === '0') {
    swal({
        title: "Warning",
        text: `Usted no tiene permisos para acceder`,
        icon: "warning",
        type: "warning"
      });
      setTimeout(function() {
        window.location.href = 'index.html';
      }, 2000);    
} /*else {
    document.getElementById('btnCreateUser').style.display = 'visible';
}*/

loadUsers = () =>{ 
    console.log("ROL: "+rol);  
    
    
    if (token === null) {        
         swal({
            title: "Warning",
            text: `La sesión ha expirado`,
            icon: "warning",
            type: "warning"
          });
          setTimeout(function() {
            window.location.href = 'index.html';
          }, 2000); 
          
    }else{
        
        fetch(path,{
            method: 'GET',
            //mode: 'no-cors',
            dataType: "json",
            headers: {'Content-Type':'application/json', 'user-token':token}
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {  
            
                    
            if (data.status === '200') {
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

                    $('#example tbody').on( 'click', '#btnEdit', function () {
                        var data = table.row( $(this).parents('tr') ).data();
                        //alert( data[0] +"'s edit is: "+ data[ 2 ] );
                        for (const i in users) {    
                            if(users[i].email === data[2]){
                                loadUserEdit(users[i]);
                            }
                        }
                    } );

                    $('#example tbody').on( 'click', '#btnDelete', function () {
                        var data = table.row( $(this).parents('tr') ).data();
                        for (const i in users) {    
                            if(users[i].email === data[2]){
                                deleteUser(users[i]);
                            }
                        }
                    } );
                    
                  });
                  
                //dataSet = data.users;
                //console.log("Algo "+dataSet);
                
                for (const i in data.users) {                    
                    users[i] = {     
                        id: data.users[i]._id,
                        name: data.users[i].name,
                        lastName: data.users[i].lastName,
                        email: data.users[i].email,
                        phone: data.users[i].phone,
                        rol: data.users[i].admin
                    }                  
                    
                    if (users[i].rol == 1) {
                        rol = `Admin`;
                    }else{
                        rol = `Basic`;
                    }
                                        
                    dataSet.push([users[i].name,users[i].lastName,users[i].email,rol,""]);
                }                
            } else {
                /*Colocar validaciones cuando:
                1. No se tenga token.
                2. El token este vencido -> OK
                3. Devuelva un 404
                -> Redirecciona al login*/
            }
        })
        .catch(function(err) {
            console.error(err);
        });
        console.log(dataSet.length);        
    }    
}


loadUsers();

let btnCreateUser = document.getElementById('btnCreateUser');
let btnSaveUser = document.getElementById('btnSaveUser');

newUser = () =>{
    document.getElementById('name').value="";
    document.getElementById('lastName').value="";
    document.getElementById('email').value="";
    document.getElementById('phone').value="";
    //Mostrar el modal
    btnCreateUser.addEventListener('click', function (){
        //console.log(123);
        $('#createUserModal').modal('show');
    });    
    
    //Acción del boton guardar    
    btnSaveUser.addEventListener('click', () =>{
        //Leer los datos
        let name = document.getElementById('name').value;
        let lastName = document.getElementById('lastName').value;
        let email = document.getElementById('email').value;
        let rol = selectRol.options[selectRol.selectedIndex].text;
        let rolValue = 0;
        let phone = document.getElementById('phone').value;
        let password = document.getElementById('password').value;
        let repeatPass = document.getElementById('repeatPass').value;        

        if (!name || !lastName || !email || !phone || !password || !repeatPass) {
            swal({
                title: "Error",
                text: `Los campos no deben estar vacíos`,
                icon: "error",
              });
        }else{
            console.log("TOKEN: " +token);
            if (password === repeatPass) {

                if(rol === 'Admin'){
                    rolValue = 1;
                }else{
                    rolValue = 0;
                }

                let user = {
                    "name": name,
                    "lastName": lastName,
                    "email": email,
                    "phone": phone,
                    "password": password,
                    "admin": rolValue
                };                     

                console.log(user);

                //Fetcha al endpoint
                fetch(path,{
                    method: 'POST',
                    //mode: 'no-cors',
                    dataType: "json",
                    headers: {'Content-Type':'application/json','user-token':token},
                    body: JSON.stringify( user )
                })
                .then(response => response.json())
                .then(function(data) {          
                    console.log("Dentro "+ data); 
                    if (data.status === '200') {                        
                        swal({
                            title: "Good job!",
                            text: `${data.message}`,
                            icon: "success",
                            type: "success"
                          });  
                          setTimeout(function() {
                            location.reload();
                          }, 2000);
                    } else {
                        swal({
                            title: "Error",
                            text: `${data.message}`,
                            icon: "error",
                          });
                    }                   
                })
                .catch(function(err) {
                    console.error(err);
                });

            } else {
                swal({
                    title: "Error",
                    text: `Los contraseñas no coinciden`,
                    icon: "error",
                  });
            }
        }
        
        document.getElementById('name').value = "";
        document.getElementById('lastName').value = "";
        document.getElementById('email').value = "";
        document.getElementById('phone').value = "";
        document.getElementById('password').value = "";
        document.getElementById('repeatPass').value = "";

    });
    
    //Mostrar las respuestas por swall
}

loadUserEdit = (user) => {        
    console.log(user.id);
    $('#createUserModal').modal('show');

    let close = document.getElementById('closeModal');
    let btnSaveEditUser = document.createElement('button');
    let modalFooter = document.getElementById('modalFooter');
    let name = user.name;
    let lastName = user.lastName;
    let email = user.email; 
    let phone = user.phone;
    let rol = selectRol.options[selectRol.selectedIndex].text;
    let rolValue = 0;
    let btnCloseUser = document.getElementById('btnCloseUser');
    
    document.getElementById('name').value = user.name;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('email').value = user.email;
    document.getElementById('phone').value = user.phone;

    document.getElementById('formPass').style.display = 'none';
    document.getElementById('formRePass').style.display = 'none';
    
    document.getElementById('createUserModalLabel').innerHTML="EDIT USER";
    document.getElementById('btnSaveUser').style.display = 'none';      
    
    document.getElementById('password').value = user.password;
    
    btnSaveEditUser.className = 'btn btn-outline-info';
    btnSaveEditUser.textContent = 'Save';    
    modalFooter.appendChild(btnSaveEditUser);    

    btnSaveEditUser.addEventListener('click',()=>{
        rol = selectRol.options[selectRol.selectedIndex].text;
        if(rol === 'Admin'){
        rolValue = 1;
    }else{
        rolValue = 0;
    }

    let userEdit = {
        "name": document.getElementById('name').value,
        "lastName": document.getElementById('lastName').value,
        "email": document.getElementById('email').value,
        "admin": rolValue,
        "phone": document.getElementById('phone').value
    };

    console.log(userEdit);

        fetch(`${path}/${user.id}`, {
            method: 'PUT',
            //mode: 'no-cors',
            dataType: "json",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify( userEdit )
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
    });
    

    close.addEventListener('click',()=>{        
        modalFooter.removeChild(btnSaveEditUser);
        location.reload();
    });

    btnCloseUser.addEventListener('click',()=>{
        location.reload();
    }); 
    
}


deleteUser = (user) =>{
    swal({
        title: "Are you sure?",
        text: `Once deleted, you will not be able to recover de user ${ user.name } ${user.lastName}`,
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

            fetch(path + `/${user.id}`, {
                method: 'DELETE',
                dataType: "json",
                headers: {'Content-Type':'application/json','user-token':token},
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

           // }
            
        } else {
          swal("The user record is safe!");
        }
      });
}

newUser();
