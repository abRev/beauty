var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var homePageSchema = new Schema({
	name:{type:String},
	html:{type:String}
});

mongoose.model("HomePage",homePageSchema);
