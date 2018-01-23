var express = require("express")
, request = require("request")
, cheerio = require("cheerio")
, app = express();
var scrapy = require('node-scrapy');
var Regex = require("regex");
var server = app.listen(3000,function(){
    var port = server.address().port;
    console.log("server is listning at port:"+port);
});

app.get('/',function(req,res){
    res.send("Good read scrap");
});

app.get('/scrap',function(req,res){
    //console.log(req.query.genres);
    url = "https://www.goodreads.com/genres/"+req.query.genres;
    //model = ".coverWrapper a img";
    model = { 
               alt:{
                selector: '.coverWrapper a img',
                get: 'alt'
               },
               src:{
                selector: '.coverWrapper a img',
                get: 'src'
               } 
             }
    scrapy.scrape(url, model, function(err, data) {
        if (err) return console.error(err)
        //console.log(data);
        var json = {};
        var arr=[];
        var pattern = '/books/([\d]+l)';
        
        
        for(i=0;i<5;i++){
            
            var strText = data['src'][i];
            var rePattern = new RegExp(/\/books\/([\d]+l)/);
            var match = strText.match(rePattern);
            json.id = match[1]; 
            json.title = data['alt'][i];          
           //json.src = data['src'][i];
           arr.push(json);
           json = {};
        }
        res.send(arr);
    });
    
})