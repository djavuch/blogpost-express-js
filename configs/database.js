const mongoose = require('mongoose')

function connectMongooseToDB(uri) {
    mongoose.connect(uri, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then((result) => 
    console.log("MongoDB connected to", result.connections[0].host)
    )
    .catch((err) => console.log("an error occurred while connecting to the database", err))
}

module.exports = connectMongooseToDB