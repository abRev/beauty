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

router.get('/getPage',function(req,res,next){
	http.get(req.query.remoteUrl,function(_res){
		//接受html页面的大小
		var size=0;
		//保存页面的buf
		var buffers=[];
		_res.on('data',function(chunk){
			buffers.push(chunk);
			size+=chunk.length;
		});
		_res.on('end',function(){
			//把buffer数组转存到一个buffer里面
			var buffer = new Buffer(size);
			//循环遍历时存储buffer的标记位置
			var pos=0;
			for(var i=0;i<buffers.length;i++){
				buffers[i].copy(buffer,pos);
				pos+=buffers[i].length;
			}
			var gbkToUtf8 = new Iconv('gbk','utf-8');
			var html = gbkToUtf8.convert(buffer);
			var pictures = [];
			var $ = cheerio.load(html);

			$("dl dd div img").each(function(){
				let obj={
					name:$(this).attr('title'),
					src:$(this).attr('zoomfile')
				}
				pictures.push(obj);
			});
			res.json(pictures);
		})
	})
})

router.get('/getHome', function (req, res, next) {
	HomePage.find(function(err,homepages){
		if(homepages.length>0){
			res.json(homepages)
		}else{
			res.json([]);
		}
	})
});
