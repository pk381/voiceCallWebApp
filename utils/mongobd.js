const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) =>{

    mongoClient.connect('mongodb+srv://prabhat:prabhat@cluster0.yktjrxl.mongodb.net/expensetracker?retryWrites=true&w=majority')
    .then(client=>{
        
        try{
            _db = client.db();
            callback();
        }
        catch(err){
            console.log(err);
        }
    })
    .catch(err=>{
        console.log("errrrrrrrrrrrrrrrrrrrrr in connecting",err);
        throw err;
    });
}


const getDb = ()=>{

    if(_db){
        return _db;
    }

    throw "not able to connect";
}

exports.getDb = getDb;
exports.mongoConnect = mongoConnect;