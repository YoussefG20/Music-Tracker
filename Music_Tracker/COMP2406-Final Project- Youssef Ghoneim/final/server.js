
const express = require('express')
const fs = require('fs')
const  app = express() 
const mongoose = require("mongoose")
const PORT = process.env.PORT || 3000
const User = require('./users')
const http = require('http')
const Artist = require('./artist')
const connectDB = require("./create")

connectDB()

app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (request, response) => {
	response.sendFile(__dirname + '/webpages/signin.html')
})

app.get('/app', (request, response) => {
	response.sendFile(__dirname + '/webpages/app.html')
})


app.get('/CreateAccount', (request, response) => {
	response.sendFile(__dirname + '/webpages/create.html')
})

app.get('/fetch-data', (req, res) => {
    User.find({})
        .then(data => {
            res.json(data); 
        })
        .catch(err => {
            res.status(500).json({ error: 'Error fetching data' });
        });
});

app.get('/fetch-artist', (req, res) => {
    Artist.find({})
        .then(data => {
            res.json(data); 
        })
        .catch(err => {
            res.status(500).json({ error: 'Error fetching data' });
        });
});


app.get('/songs', (request, response) => {
	//get the query title 
	let songTitle = request.query.title
	let titleWithPlusSigns = songTitle.trim().replace(/\s/g, '+')
  
	//api stuff to get the data 
	const options = {
	  "method": "GET",
	  "hostname": "itunes.apple.com",
	  "port": null,
	  "path": `/search?term=${titleWithPlusSigns}&entity=musicTrack&limit=20`,
	  "headers": {
	  "useQueryString": true
	  }
	}
  
	//http request to get the JSON file from the API 
	http.request(options, function(apiResponse) {
	  let songData = ''
	  apiResponse.on('data', function(chunk) {
		songData += chunk
	  })
	  apiResponse.on('end', function() {
		response.contentType('application/json').json(JSON.parse(songData))
	  })
	}).end() //important to end the request
			 //to actually send the message
			 //to actually send the message
  })


app.post('/create-account', async (req, res) => {
	try {
  
	  const { username, password, type } = req.body;
  
	  const newUser = new User({
		username,
		password,
		type
	  });
  
	  const savedUser = await newUser.save();
	  
	  res.status(201).json(savedUser); 
	} catch (error) {
	  if (error.code === 11000) {
		res.status(400).json({ message: 'Username already exists' });
	  } else {
		res.status(400).json({ message: error.message }); 
	  }
	}
  });
 
  app.post('/create-artist', async (req, res) => {
	try {
  
	  const { username, artist} = req.body;
  
	  const newArtist = new Artist({
		username,
		artist
	  });
  
	  const savedUser = await newArtist.save();
	  
	  res.status(201).json(savedUser); 
	} catch (error) {
	  if (error.code === 11000) {
		res.status(400).json({ message: 'Username already exists' });
	  } else {
		res.status(400).json({ message: error.message }); 
	  }
	}
  });

mongoose.connection.once('open',()=>{
	console.log("connected")
	app.listen(PORT, err => {
		if(err) console.log(err)
		else {
			  console.log(`Server listening on port: ${PORT} CNTL:-C to stop`)
			  console.log(`To Test:`)
			  console.log('http://localhost:3000')
			 
		  }
	  })
})