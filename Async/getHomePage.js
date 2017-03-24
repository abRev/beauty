var http = require('http');
var cheerio = require('cheerio');
var Iconv = require('iconv').Iconv;
var mongoose = require('mongoose');
var HomePage = mongoose.model('HomePage');

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
				})
			});

	})
})
