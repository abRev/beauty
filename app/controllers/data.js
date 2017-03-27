var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var HomePage = mongoose.model('HomePage');
var schedule = require('node-schedule');
var http = require('http');
var cheerio = require('cheerio');
var Iconv = require('iconv').Iconv;


//生命一个空对象用来保存定时任务对象
var job={};
module.exports = function(app){
	app.use('/data',router);
}

router.get('/',function(req,res,next){
	res.render('data/index');
})

router.post('/',function(req,res,next){
	if("cancel" in job && typeof(job.cancel)=='function'){
		job.cancel();
	}
	var timeTemp="";
	['second','minute','hour','day','month','week'].forEach((item)=>{
		console.log(item+": "+req.body[item]);
		if(req.body[item]==""){
			req.body[item]="*";
		}
		if(timeTemp.length>0 || req.body[item] !== '*'){
			timeTemp+=req.body[item]+" ";
		}
	})
	var time=timeTemp.substring(0,timeTemp.length-1);
	 job=schedule.scheduleJob(time,function(){
		console.log('进入定时器');
	 	dynamicGetData();
	 });

	res.send('定时器启动成功');
})

function dynamicGetData(){
	HomePage.remove({},(err)=>{
		if(err){
			return err;
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
					console.log('加载完成');
				})
			})
		}
	})
	
}


router.get('/stopJob',function(req,res,next){

	job.cancel();
	res.send("yes");
})
