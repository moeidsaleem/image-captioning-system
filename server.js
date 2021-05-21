var express = require('express');    //Express Web Server 
var path = require('path');     //used for file path

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://abrar:abrar@cluster0.xpldp.mongodb.net/image_captioning',  
{ useNewUrlParser: true,
useCreateIndex: true,
useUnifiedTopology: true
});



const Photo = new mongoose.Schema(
  {
    thumbnailUrl:String,
    fileId:String,
    name: String,
    size: Number,
    filePath: String,
    url: String,
    fileType: String,
    height: Number,
    width: Number,
    thumbnailUrl:String,
      caption:{
          type: String,
          required: [true, 'Please provide complete Caption'],
          index: true
      }

},{
  timestamps: true
});
const PhotoModel =  mongoose.model('Photo', Photo)



const ImageKit = require('imagekit');
const imageToBase64 = require('image-to-base64');


const imagekit = new ImageKit({
    urlEndpoint: 'https://ik.imagekit.io/busmanagement/',
    publicKey: 'public_fKo5YmIft0pv9hhR8bX+ixsX/z8=',
    privateKey: 'private_0gtSrJfQtC+55joG9/bfigh0BtI='
  });


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
 
async function callName(req, res) {
     
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
 
    process.stdout.on('data', async function(data) {
        console.log("\n\nResponse from python: " + data.toString());

        let url;
       let uploadImageToCloud = await imageToBase64(imagePath);
       console.log('upload',uploadImageToCloud);
       let imgKitUploadInstance = await imagekit.upload({
         file: uploadImageToCloud,
         fileName:"caption",
         folder: 'image_captioning'
       })
       console.log('imgKit', imgKitUploadInstance);
       let c = await PhotoModel.create({...imgKitUploadInstance, caption: data.toString()});
          let b = await PhotoModel.find();
          console.log('b', b);

          res.json({
          caption:data.toString(),
          imagePath: imagePath.toString().replace('public/','./')
        });
      
    });



    
}



app.get('/images', async (req,res)=>{
  let b = await PhotoModel.find();
  res.json(b)
});


app.post('/clear', async (req,res)=>{
  
})
