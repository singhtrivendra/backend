const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/paytm ', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String
})

 const User = new mongoose.Model("User",userSchema);

 module.exports  = {
    User
 }