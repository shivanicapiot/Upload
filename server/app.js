    var express = require('express'); 
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var fs = require("fs");
    const path = require('path');
    //var rmdir = require('rmdir');
    var fse = require('fs-extra')

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /** Serving from the same express Server
    No cors required */
    app.use(express.static('../client'));
    app.use(bodyParser.json());  

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });
    function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

    var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
    });

    //api path that will display uploaded file names
    app.get('/upload',function(req, res){
        files = getFiles('uploads');
        res.send(files);
        // res.send(storage.originalname );
   

// console.log(getFiles('uploads'))

    });



    
    
app.post('/deletefile/:filename', function(req, res){

console.log("check");
//console.log(__dirname);
//console.log(req.params.filename);

//console.log(req.params.filename);
var pathValue = path.join(path.join(__dirname, "uploads") ,req.params.filename) ;
//console.log(pathValue);
    fs.unlink(pathValue,function(err){
        if (!err) {
        console.log("removed");
        res.status(200).send("working");
        }else
        res.send("no file found");
        //console.log("no file found");
    });
});


app.post('/deleteall',function(req,res)
{
 console.log("delete all working");
 var pathValue = path.join(path.join(__dirname, "uploads"));
 fse.emptyDir(pathValue, function (err) {
  if (!err)
  { console.log('success!');
  res.send("fn working");
}
  else
  {
  console .log("error occured");
  res.send("fn not working");
}
});

}

);




    app.listen('3000', function(){
        console.log('running on 3000...');
    });