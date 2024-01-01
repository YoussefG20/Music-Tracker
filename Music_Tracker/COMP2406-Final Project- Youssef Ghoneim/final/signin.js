let currentUsername

function getCreateAccount(){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            window.location.href = '/CreateAccount';
          } else {
            console.error('Error:', xhr.status);
          }
        }
      };
      xhr.open('GET', '/CreateAccount', true);
      xhr.send();
}


function SignIn() {
  const xhr = new XMLHttpRequest();
  let username = document.getElementById('username').value
  let password = document.getElementById('password').value
  
  if (username === '' || password === '') {
    document.getElementById('hello').innerHTML += '<p>Please enter both username and password</p>';
    return; 
  }

  currentUsername = username  

  xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              for (let i=0; i<data.length;i++){
                  if (data[i].username == username && data[i].password == password){
                          document.getElementById('hello').innerHTML = 
                          `<h2>Playlist:</h2>
                          <table id="playlist">
                              <thead>
                                <th></th>
                                <th>Song Name</th>
                                <th>Artist</th>
                                <th>Image</th>
                               </thead>
                               <tbody id=playlist_songs>
                               </tbody>
                          </table>
                          <div class="wrapper">
                              Enter Song Title: <input type="text" id="song" />
                              <button id="submit_button" onclick="getSong()"  style="margin-bottom: 50px;">Submit</button>
                          </div>
                          <div id="songs">
                              <h2>Songs Matching:</h2>
                          </div>
                          <table id="results">
                              <thead>
                                <th></th>
                                <th>Song Name</th>
                                <th>Artist</th>
                                <th>Image</th>
                               </thead>
                               <tbody id=matched_songs>
                               </tbody>
                          </table>
                          <table id="stats" style=width:20%>
                            <thead>
                                <th>Artist</th>
                                <th>Count</th>
                            </thead>
                            <tbody id="count">
                            </tbody>
                        </table>
                        <button id="admin" onclick="getStats()"  style="margin-bottom: 50px;">Get Stats</button>
                          `
                      if (data[i].type == "Admin"){
                        document.getElementById('hello').innerHTML += `
                        <table id= users" style=width:20%>
                            <thead>
                                <th>Users</th>
                                <th>Role</th>
                            </thead>
                            <tbody id="user">
                            </tbody>
                        </table>
                        <button id="admin" onclick="getUsers()"  style="margin-bottom: 50px;">Get Users</button>
                        `
                      }
                  }
              }
          } else {
              console.error('Error:', xhr.status);
          }
      }
  };

  xhr.open('GET', '/fetch-data'); // Make a GET request to the /fetch-data endpoint
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
}

function getSong() {
    //Make sure the user enetered a song 
    let songName = document.getElementById('song').value
    if(songName === '') {
        return alert('Please enter a song')
    }

    //get the html element matching this header so i can alter it 
    let cityDiv = document.getElementById('songs')
    cityDiv.innerHTML = ''

    //xml http request to get the info from the api 
    let xhr = new XMLHttpRequest()
    
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
 			cityDiv.innerHTML = cityDiv.innerHTML + `
			<h2>Songs Matching: ${songName} </h2>
			`
      //making sure to enter the id to start putting stuff in the table 
       let data = document.getElementById("matched_songs")
       data.innerHTML = ""
       //start going throw the results in the api and start filling out the table 
       for(let i=0; i < response.results.length; i++){
         data.innerHTML += `
          <tr id="${response.results[i].artistName}">
            <td><button onclick=addSongToPlaylist(this)>&#43</button></td>
            <td>${response.results[i].trackName}</td>
            <td>${response.results[i].artistName}</td>
            <td><img src=${response.results[i].artworkUrl30}></td>
          </tr>
         `
       }
      }
    }
    //open the get request with the /songs directory 
    xhr.open('GET', `/songs?title=${songName}`, true)
    xhr.send()
}

function addSongToPlaylist(button){
    //getting the row where the button was clicked and cloning the row
    let row = button.parentNode.parentNode
    let cloned = row.cloneNode(true)

    let clonedId = cloned.getAttribute('id');
    console.log(`The ID of the cloned element is: ${clonedId}`);
  
    //getting all the <td> html tags 
    let cells = cloned.querySelectorAll('td')
    if (cells.length > 0) {
      //changing the first cell from the only the plus button to all three buttons 
      cells[0].innerHTML= `<td></td>`
    }
  
    //adding the song to the playlist table 
    let playlist = document.getElementById("playlist")
    playlist.querySelector('tbody').appendChild(cloned)

    const userData = {
        username: currentUsername,
        artist: clonedId,
      };

      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 201) {
            const newUser = JSON.parse(xhr.responseText);
            console.log('New user created:', newUser);
          } else {
            console.error('Error:', xhr.status);
          }
        }
      };
    
      xhr.open('POST', '/create-artist');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(userData));
  
  }

  function getStats(){
    const countTable = document.getElementById('count');
    countTable.innerHTML = '';

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                const artistCounts = {}; // Object to store artist counts

                // Count occurrences of each artist for the current user
                for (let i = 0; i < data.length; i++) {
                    const username = data[i].username;
                    const artist = data[i].artist;

                    if (username === currentUsername) {
                        if (!artistCounts[artist]) {
                            artistCounts[artist] = 1; // Initialize count for new artist
                        } else {
                            artistCounts[artist]++; // Increment count for existing artist
                        }
                    }
                }

                // Populate the table with artist counts
                const countTable = document.getElementById('count');
                for (const artist in artistCounts) {
                    countTable.innerHTML += `
                        <tr>
                            <td>${artist}</td>
                            <td>${artistCounts[artist]}</td>
                        </tr>
                    `;
                }
            } else {
                console.error('Error:', xhr.status);
            }
        }
    };

    
        xhr.open('GET', '/fetch-artist'); // Make a GET request to the /fetch-data endpoint
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();

  }


  function getUsers(){

    const xhr = new XMLHttpRequest();
    

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                for (let i=0; i < data.length; i++){
                    document.getElementById('user').innerHTML += `
                        <tr>
                            <td>${data[i].username}</td>
                            <td>${data[i].type}</td>
                        </tr>
                    `;
                }
            } else {
                console.error('Error:', xhr.status);
            }
            }
        };

        xhr.open('GET', '/fetch-data'); // Make a GET request to the /fetch-data endpoint
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('create_id').addEventListener('click', getCreateAccount)
    document.getElementById('signin').addEventListener('click',SignIn)
})