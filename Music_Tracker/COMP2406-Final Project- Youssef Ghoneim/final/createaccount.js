
function CreateAccount(){

    let username = document.getElementById("username").value 

    let password = document.getElementById("password").value

    let type = document.getElementById("admin").value 

    const userData = {
        username: username,
        password: password,
        type: type
      };

      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 201) {
            const newUser = JSON.parse(xhr.responseText);
            console.log('New user created:', newUser);
            window.location.href = '/'; 
          } else {
            document.getElementById('create').innerHTML += `<p>You have either not filled out all the things needed, or the username is already chosen</p>`
            console.error('Error:', xhr.status);
          }
        }
      };
    
      xhr.open('POST', '/create-account');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(userData));

}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('create_id').addEventListener('click', CreateAccount)
})