var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var HomePage = mongoose.model('HomePage');

module.exports = function(app){
	app.use('/data',router);
}

router.get('/',function(req,res,next){
	res.render('data/index');
})
