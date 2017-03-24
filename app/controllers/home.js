var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  HomePage = mongoose.model('HomePage');
var cheerio = require('cheerio');
var request = require('request');
var http = require('http');
var Iconv = require('iconv').Iconv;
module.exports = function (app) {
  app.use('/api', router);
};

router.get('/getHome', function (req, res, next) {
	HomePage.find(function(err,homepages){
		if(homepages.length>0){
			res.json(homepages)
		}else{
			
			http.get('http://www.tuyimm.com/misc.php?mod=ranklist&type=thread&view=views&orderby=all',function(_res){
				var size=0;//接受res的长度
				var buffers = [];
				_res.on("data",(data)=>{
					buffers.push(data);
					size+=data.length;
				});
				_res.on('end',function(){
					var buffer = new Buffer(size),pos=0;
					for(var i=0;i<buffers.length;i++){
						buffers[i].copy(buffer,pos);
						pos+=buffers[i].length;
					}
					var gbkToUtf8 = new Iconv("gbk",'utf-8')
					var html = gbkToUtf8.convert(buffer);
					var homeObj=[];
					var $ = cheerio.load(html);
			
					$("th a").each(function(){
						var href = $(this).attr('href');
						var name = $(this).text();
						HomePage.findOne({name:name}).exec((err,homePage)=>{
							if(!homePage){
								var _homePage = new HomePage({
									name:name,
									html:href
								});
								_homePage.save();
							}
						});
						homeObj.push({
							name:name,
							html:href
						});
					})
					res.json(homeObj);
				})
			})
		}
	})
});
