var express = require('express');    //Express Web Server 
var path = require('path');     //used for file path

var app = express();
app.use(express.static(path.join(__dirname, 'public')));


let IMAGE_NAME = 'image.jpg'
/* ========================================================== 
Upload with multer
============================================================ */
var multer  =   require('multer');
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/img');
  },
  filename: function (req, file, callback) {
    // callback(null, file.fieldname + '-' + Date.now());
    // IMAGE_NAME = "image" + Date.now() + "." + file.originalname.substring(file.originalname.indexOf('.') + 1)
    // IMAGE_NAME = "image.png";
    console.log("IMAGE_NAME", IMAGE_NAME);
    callback(null, IMAGE_NAME);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

app.post('/upload',function(req,res){
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

var server = app.listen(3030, function() {
    console.log('Listening on port %d', server.address().port);
});

///////////////////////////////////
// PYTHON
///////////////////////////////////

app.post('/process', callName);
 
function callName(req, res) {
     
    var sys = require('util');

    var projectPath = __dirname;  // Users/yujin/Desktop/nodePytonWithNN
    console.log('process-imagename', IMAGE_NAME)
    var imagePath = __dirname + "/public/img/"+IMAGE_NAME; // Users/yujin/Desktop/nodePytonWithNN/public/img/image.png

    // console.log("projectPath: " + projectPath.toString());
    // console.log("Image Path: " + imagePath.toString());

    var spawn = require("child_process").spawn;


    imagePath = 'public/img/'+IMAGE_NAME;
    console.log('project-path', projectPath.toString())
    console.log('img-path',imagePath.toString())
          
    var process = spawn('python3',["./Python_NN/app_image_caption.py",
    // var process = spawn('python',["./Python_NN/test.py",
                                projectPath.toString(),
                                imagePath.toString()] )
 
    process.stdout.on('data', function(data) {
        console.log("\n\nResponse from python: " + data.toString());
        res.json({
          caption:data.toString(),
          imagePath: imagePath.toString().replace('public/','./')
        });

        // res.json({
        //   caption: data.toString()
        // })

    })
    
}


