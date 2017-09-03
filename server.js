var express = require('express');
var wines = require('./routes/wines');
var app = express();


app.configure(() => {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});

//Retrieve all wines

// GET	/wines

app.get('/wines',wines.findAll);

//Retrieve the wine with specific id

// GET	/wines/5069b47aa892630aae000001

app.get('/wines/:id',wines.findById);

//Add a new wine

// POST	/wines

app.post('/wines',wines.addWine);

//Update wine with the specific id

// PUT	/wines/5069b47aa892630aae000001

app.put('/wines/:id',wines.updateWine);

//Delete wine with the specific id

// DELETE	/wines/5069b47aa892630aae000001	

app.delete('/wines/:id',wines.deleteWine);

app.listen(3000);
console.log('Server running on port 3000');

