const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/paytm ', {
});
console.log("connected to mongodb")

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String
})

 const User = new mongoose.model("User",userSchema);

 module.exports  = {
    User
 }