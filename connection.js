const mongoose = require('mongoose');

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on('error',(error) => console.error(error));
db.once('open',() => console.log("OK"));


module.exports = mongoose;