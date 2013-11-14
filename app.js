
var express = require('express'); 
var markdown = require('markdown-js'); 
var fs = require('fs'); 
var path = require('path'); 
  
var app = express();  
  
// Express 程序配置  
app.configure(function(){  
  app.set('views', __dirname + '/views');  
  app.set('view engine', 'jade');    
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.use(app.router);  
});  

app.engine('md', function(path, options, fn){  
  fs.readFile(path, 'utf8', function(err, str){  
    if (err) return fn(err);  
    str = markdown.parse(str).toString();  
    fn(null, str);  
  });  
});  

var config = {  
    title: 'Gang\'s Blog',  
    author: 'gang tao',
    encoding: 'utf8'
}  
  
// url路由  
app.get('/', function(req, res){  
  res.render('index', {  
    title: config.title
  });  
});  

app.get('/blogs/:title.html', function(req, res, next) {  
    var urlPath = [  
        'blogs/',  
        req.params.title, '.md'  
    ].join('');  
      
    var filePath = path.normalize('./views/' + urlPath); 
    //console.log(filePath); 
    fs.exists(filePath, function  (exists) {  
        if(!exists) {
            //Jump 404  
            next();  
        } else {  
            var content = fs.readFileSync(filePath, config.encoding);  
            //　这里将markdown转成html, 然后以参数形式输出  
            var html_content = markdown.parse(content);  
              
            res.render('blogs/show', {  
                title: config.app + " - Blogs"  
                , blog_content: html_content  
            });  
        }  
    });  
});

app.get('*', function(req, res) {  
    console.log('404 handler..')  
    res.render('404', {  
        status: 404,  
        title: 'File Not Found',  
    });  
})  
  
app.listen(process.env.VCAP_APP_PORT || 3000);