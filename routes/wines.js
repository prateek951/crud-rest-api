var mongo = require('mongodb');
var Server = mongo.Server;
var	Db = mongo.Db;
var	BSON = mongo.BSONPure;

var server = new Server('localhost',27017,{auto_reconnect : true});
db = new Db('winedb',server);

db.open((err,db)=>{
	if(!err){
		console.log("Connected to the 'winedb' database");
		db.collection('wines',{strict:true},(err,collection)=>{
			if(err){
				console.log('The wines collection doesnot exists.Creating it with the sampled data');
				populateDB();
			}
		});

	}
});

//Retrieval of the wine based on its id
exports.findById = (req,res)=>{
	//Tap the id
	var id = req.params.id;
	console.log('Retrieving wine:' + id);
	db.collection('wines',(err,collection)=>{
		collection.findOne({'_id' : new BSON.ObjectID(id)},(err,item)=>{
			res.send(item);
		});
	});
};

//Retrieve all the wines
exports.findAll = (req,res)=>{
	db.collection('wines',(err,collection)=>{
		collection.find().toArray((err,items)=>{
			res.send(items);
		});
	});
};

exports.addWine = (req,res)=>{
	//Tap the details of the wine to be added
	var wine = req.body;
	console.log('Adding wine : ' + JSON.stringify(wine));
	db.collection('wines',(err,collection)=>{
		collection.insert(wine,{safe:true},(err,result)=>{
			if(err){
				res.status(500).send({'error' : 'An error has occured'});
			}else{
				console.log('Success' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updateWine = (req,res)=>{
	//Tap the wine and its details which you want to update
	var id = req.params.id;
	var wine = req.body;
	console.log('Updating the wine:' + id);
	console.log(JSON.stringify(wine));

	db.collection('wines',(err,collection)=>{
		collection.update({'_id' : new BSON.ObjectID(id)},wine,{safe: true},(err,result)=>{
			if(err){
				console.log('Error updating the wine' + err);
				res.status(500).send({'error': 'An error has occured'});
			}else{
				console.log('' + result + 'document(s) updated');
				res.send(wine);
			}
		});
	});
}

exports.deleteWine = (req,res)=>{
	//Tap the wine by its id 
	var id = req.params.id;
	console.log('Deleting the wine :' + id);
	db.collection('wines',(err,collection)=>{
		db.remove({'_id' : new BSON.ObjectID(id)},{safe : true},(err,result)=>{
			if(err){
				res.status(500).send({'error' : 'An error occured -' + err});
			}else {
				console.log('' + result + 'document(s) deleted');
				res.status(200).send(req.body);
			}
		});
	});
}

// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.


var populateDB = ()=>{
	var wines = [
	{
		name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice...",
        picture: "saint_cosme.jpg"
	},
	    {
        name: "LAN RIOJA CRIANZA",
        year: "2006",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];
    db.collection('wines',(err,collection)=>{
    	collection.insert(wines,{safe: true},(err,result)=>{})
    });
};