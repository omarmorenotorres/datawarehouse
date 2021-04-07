let path = 'http://localhost:3000/api/users/login';
let btnSubmit = document.getElementById("submit");


btnSubmit.addEventListener("click", function(event){
    event.preventDefault();

    /*let email = "";
    let password = "";*/
    
    if(document.getElementById('email').value && document.getElementById('password').value){
        email = document.getElementById('email').value;
        password = document.getElementById('password').value;

        let user ={
            "email": email,
            "password": password
        };
        //console.log(user);
        
        fetch(path, {
            method: 'POST',
            dataType: "json",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
    
            if (data.status === 200) {
                let token = data.token;
                //console.log(data.rol);
                sessionStorage.setItem('userName', data.userName);
                sessionStorage.setItem('lastName', data.lastName);
                sessionStorage.setItem('rol', data.rol);
                sessionStorage.setItem('token', token);
                //revisar validación de los permisos, si no tiene permiso no direccionar y sacar el mensaje de error
                window.location.href = 'contact.html';
            }
            else{
                alert(data.error);
            }
            //console.log(data.status);
            //console.log(data.token);
        }).catch(function(err) {
            console.error(err);
        });       
    }else{
        //Alert de user -pass
        console.log("CAMPOS INCOMPLETOS");
    }
});